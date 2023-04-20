import { load } from "js-yaml";
import { dump } from "$lib/util";

interface StyleConfig {
    borderColor?: string;
    borderRadius?: string;
    borderStyle?: string;
    borderWidth?: string;
    backgroundColor?: string;
    color?: string;
}

const defaultColors: StyleConfig[] = [
    {
        borderColor: "darkblue",
        borderWidth: "1px",
        borderRadius: "5px",
        borderStyle: "solid",
        backgroundColor: "white",
        color: "darkblue",
    },
];

class ItemConfig {
    id: string;
    text?: string;
    outlined?: boolean;
    style?: StyleConfig;
    children: ItemConfig[];
    parent?: ItemConfig;

    constructor(id?: string) {
        this.id = id || "";
        this.children = [];
    }
}

type ItemConfigMap = { [id: string]: ItemConfig };

function paraseConfig(rawConfig: string, debug: boolean): ItemConfigMap {
    if (rawConfig) {
        if (debug) dump(rawConfig, { name: "rawConfig" });
        const index = rawConfig.indexOf(rawConfig.trim());

        rawConfig = rawConfig
            .split("\n")
            .map((l) => l.substring(index - 1))
            .join("\n");

        if (debug) dump(rawConfig, { name: "rawConfig (normalized)" });
        const configMap = load(rawConfig) as ItemConfigMap;
        if (debug) dump(configMap, { name: "configMap" });
        return configMap;
    }

    return {};
}

function parseSymbol(symbol: string, debug: boolean): ItemConfig {
    if (debug) dump(symbol, { name: "parseSymbol(symbol)" });
    const root = new ItemConfig();
    let current = root;

    for (let i = 0; i < symbol.trim().length; i++) {
        switch (symbol[i]) {
            case "[":
                const parent = current;
                current = new ItemConfig();
                current.parent = parent;
                parent.children.push(current);
                break;
            case "]":
                if (current.parent) {
                    const child = current;
                    current = current.parent;
                    current.children.push(child);
                } else {
                    if (debug)
                        dump(current, { name: "parseSymbol(no parent)" });
                }
                break;
            case ",":
                const sibling = current;
                current = new ItemConfig();
                current.parent = sibling.parent;
                break;
            default:
                current.id += symbol[i];
        }
    }

    if (debug) dump(root, { name: "parseSymbol(root)" });
    return root;
}

function parseMap(
    rawTable: string,
    blank: string,
    minRows: number,
    minCols: number,
    debug: boolean
): string[][] {
    debug = true;
    if (rawTable) {
        let symbols: string[][] = rawTable
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => line.replaceAll(/\s+/g, " "))
            .map((line) => line.split(" "));

        if (debug) dump(symbols, { name: "symbols" });

        const rows = Math.max(minRows, lines2maxRow(symbols));
        const cols = Math.max(minCols, lines2maxCol(symbols));
        if (debug) console.log(`raw: rows: ${rows}, cols: ${cols}`);

        while (symbols.length < rows) symbols.push([]);

        symbols.forEach((symbol) => {
            while (symbol.length < cols) symbol.push(blank);
        });

        if (debug) console.log(`normalized: rows: ${rows}, cols: ${cols}`);

        symbols = symbols.map((symbol) =>
            symbol.map((id) => nextId(id, blank))
        );
        if (debug) dump(symbols, { name: "symbols (with ids)" });

        return symbols;
    }

    return [];
}

function pattern2lines(
    pattern: string,
    blank: string,
    minRows: number,
    minCols: number,
    separator: string,
    debug: boolean
): ItemConfig[][] {
    if (debug) dump(pattern, { name: "pattern2lines(pattern)" });
    let [rawTable, rawConfig] = pattern.split(separator);
    const symbols = parseMap(rawTable, blank, minRows, minCols, debug);
    const configMap = paraseConfig(rawConfig, debug);

    const configs = symbols.map((symbols) =>
        symbols.map((symbol) => {
            let ic = parseSymbol(symbol, debug);

            function walk(root: ItemConfig) {
                const rootId = root.id;

                if (configMap && configMap[rootId]) {
                    Object.assign(root, configMap[rootId]);
                    root.id = rootId;
                }

                if (root.id.startsWith(blank) && debug) root.text = blank;
                if (!root.text) root.text = rootId;

                if (root.children) {
                    for (const child of root.children) walk(child);
                }
            }

            walk(ic)
            return ic;
        })
    );

    if (debug) dump(configs, { name: "configs" });

    return configs;
}

function lines2maxRow(lines: string[][]): number {
    if (lines) return lines.length;
    return -1;
}

function lines2maxCol(lines: string[][]): number {
    if (lines) return lines.reduce((acc, cur) => Math.max(acc, cur.length), 0);
    return -1;
}

function lines2gridArea(icTable: ItemConfig[][], debug: boolean): string {
    if (icTable) {
        const area = icTable
            .map((ics) => ics.map((ic) => ic.id).join(" "))
            .map((x) => `"${x}"`)
            .join(" ");
        if (debug) dump(area, { name: "area" });
        return area;
    }

    return "";
}

function lines2elems(
    lines: ItemConfig[][],
    blank: string,
    debug: boolean
): ItemConfig[] {
    if (lines) {
        let elems: ItemConfig[];

        if (debug) {
            elems = lines.flat();
        } else {
            elems = [
                ...new Set(lines.flat().filter((e) => !e.id.startsWith(blank))),
            ];
        }

        if (debug) dump(elems);
        return elems;
    }

    return [];
}

export {
    dump,
    nextId,
    pattern2lines,
    lines2maxRow,
    lines2maxCol,
    lines2gridArea,
    lines2elems,
    type ItemConfig,
    type StyleConfig,
};

let id = 0;
let color = 0;

function nextId(symbol: string, blank: string): string {
    if (symbol == blank) {
        id++;
        symbol = symbol.replace(blank, `${blank}${id}`);
    }

    return symbol;
}

function nextStyle(): StyleConfig {
    if (color > defaultColors.length) {
        color = 0;
    }

    const current = defaultColors[color];
    color++;

    return current;
}

// interface LightDark {
//     normal: string,
//     light: string,
//     dark: string,
// }

// function getLightDark(): LightDark[] {
//     const found: LightDark[] = []
//     const withLight = Object.keys(CSS_COLOR_NAMES).filter(k => k.startsWith('Light'))
//     const withDark = Object.keys(CSS_COLOR_NAMES).filter(k => k.startsWith('Dark'))

//     Object.keys(CSS_COLOR_NAMES).

//     return found
// }
// const x = {
// LightBlue: "#ADD8E6",
//     LightCyan: "#E0FFFF",
//     LightGoldenRodYellow: "#FAFAD2",

//     LightGrey: "#D3D3D3",
//     LightGreen: "#90EE90",
//     LightPink: "#FFB6C1",
//     LightSalmon: "#FFA07A",
//     LightSeaGreen: "#20B2AA",
//     LightSkyBlue: "#87CEFA",
//     LightSlateGray: "#778899",
//     LightSlateGrey: "#778899",
//     LightSteelBlue: "#B0C4DE",
//     LightYellow: "#FFFFE0",
//     DarkBlue: "#00008B",
//     DarkCyan: "#008B8B",
//     DarkGoldenRod: "#B8860B",

//     DeepPink: "#FF1493",
//     DarkGrey: "#A9A9A9",
//     DarkGreen: "#006400",
//     DarkKhaki: "#BDB76B",
//     DarkMagenta: "#8B008B",
//     DarkOliveGreen: "#556B2F",
//     DarkOrange: "#FF8C00",
//     DarkOrchid: "#9932CC",
//     DarkRed: "#8B0000",
//     DarkSalmon: "#E9967A",
//     DarkSeaGreen: "#8FBC8F",
//     DarkSlateBlue: "#483D8B",
//     DarkSlateGray: "#2F4F4F",
//     DarkSlateGrey: "#2F4F4F",
//     DarkTurquoise: "#00CED1",
//     DarkViolet: "#9400D3",
// }

// // https://gist.github.com/bobspace/2712980
// const CSS_COLOR_NAMES = {
//     AliceBlue: "#F0F8FF",
//     AntiqueWhite: "#FAEBD7",
//     Aqua: "#00FFFF",
//     Aquamarine: "#7FFFD4",
//     Azure: "#F0FFFF",
//     Beige: "#F5F5DC",
//     Bisque: "#FFE4C4",
//     Black: "#000000",
//     BlanchedAlmond: "#FFEBCD",
//     Blue: "#0000FF",
//     BlueViolet: "#8A2BE2",
//     Brown: "#A52A2A",
//     BurlyWood: "#DEB887",
//     CadetBlue: "#5F9EA0",
//     Chartreuse: "#7FFF00",
//     Chocolate: "#D2691E",
//     Coral: "#FF7F50",
//     CornflowerBlue: "#6495ED",
//     Cornsilk: "#FFF8DC",
//     Crimson: "#DC143C",
//     Cyan: "#00FFFF",
//     DarkBlue: "#00008B",
//     DarkCyan: "#008B8B",
//     DarkGoldenRod: "#B8860B",
//     DarkGray: "#A9A9A9",
//     DarkGrey: "#A9A9A9",
//     DarkGreen: "#006400",
//     DarkKhaki: "#BDB76B",
//     DarkMagenta: "#8B008B",
//     DarkOliveGreen: "#556B2F",
//     DarkOrange: "#FF8C00",
//     DarkOrchid: "#9932CC",
//     DarkRed: "#8B0000",
//     DarkSalmon: "#E9967A",
//     DarkSeaGreen: "#8FBC8F",
//     DarkSlateBlue: "#483D8B",
//     DarkSlateGray: "#2F4F4F",
//     DarkSlateGrey: "#2F4F4F",
//     DarkTurquoise: "#00CED1",
//     DarkViolet: "#9400D3",
//     DeepPink: "#FF1493",
//     DeepSkyBlue: "#00BFFF",
//     DimGray: "#696969",
//     DimGrey: "#696969",
//     DodgerBlue: "#1E90FF",
//     FireBrick: "#B22222",
//     FloralWhite: "#FFFAF0",
//     ForestGreen: "#228B22",
//     Fuchsia: "#FF00FF",
//     Gainsboro: "#DCDCDC",
//     GhostWhite: "#F8F8FF",
//     Gold: "#FFD700",
//     GoldenRod: "#DAA520",
//     Gray: "#808080",
//     Grey: "#808080",
//     Green: "#008000",
//     GreenYellow: "#ADFF2F",
//     HoneyDew: "#F0FFF0",
//     HotPink: "#FF69B4",
//     IndianRed: "#CD5C5C",
//     Indigo: "#4B0082",
//     Ivory: "#FFFFF0",
//     Khaki: "#F0E68C",
//     Lavender: "#E6E6FA",
//     LavenderBlush: "#FFF0F5",
//     LawnGreen: "#7CFC00",
//     LemonChiffon: "#FFFACD",
//     LightBlue: "#ADD8E6",
//     LightCoral: "#F08080",
//     LightCyan: "#E0FFFF",
//     LightGoldenRodYellow: "#FAFAD2",
//     LightGray: "#D3D3D3",
//     LightGrey: "#D3D3D3",
//     LightGreen: "#90EE90",
//     LightPink: "#FFB6C1",
//     LightSalmon: "#FFA07A",
//     LightSeaGreen: "#20B2AA",
//     LightSkyBlue: "#87CEFA",
//     LightSlateGray: "#778899",
//     LightSlateGrey: "#778899",
//     LightSteelBlue: "#B0C4DE",
//     LightYellow: "#FFFFE0",
//     Lime: "#00FF00",
//     LimeGreen: "#32CD32",
//     Linen: "#FAF0E6",
//     Magenta: "#FF00FF",
//     Maroon: "#800000",
//     MediumAquaMarine: "#66CDAA",
//     MediumBlue: "#0000CD",
//     MediumOrchid: "#BA55D3",
//     MediumPurple: "#9370DB",
//     MediumSeaGreen: "#3CB371",
//     MediumSlateBlue: "#7B68EE",
//     MediumSpringGreen: "#00FA9A",
//     MediumTurquoise: "#48D1CC",
//     MediumVioletRed: "#C71585",
//     MidnightBlue: "#191970",
//     MintCream: "#F5FFFA",
//     MistyRose: "#FFE4E1",
//     Moccasin: "#FFE4B5",
//     NavajoWhite: "#FFDEAD",
//     Navy: "#000080",
//     OldLace: "#FDF5E6",
//     Olive: "#808000",
//     OliveDrab: "#6B8E23",
//     Orange: "#FFA500",
//     OrangeRed: "#FF4500",
//     Orchid: "#DA70D6",
//     PaleGoldenRod: "#EEE8AA",
//     PaleGreen: "#98FB98",
//     PaleTurquoise: "#AFEEEE",
//     PaleVioletRed: "#DB7093",
//     PapayaWhip: "#FFEFD5",
//     PeachPuff: "#FFDAB9",
//     Peru: "#CD853F",
//     Pink: "#FFC0CB",
//     Plum: "#DDA0DD",
//     PowderBlue: "#B0E0E6",
//     Purple: "#800080",
//     RebeccaPurple: "#663399",
//     Red: "#FF0000",
//     RosyBrown: "#BC8F8F",
//     RoyalBlue: "#4169E1",
//     SaddleBrown: "#8B4513",
//     Salmon: "#FA8072",
//     SandyBrown: "#F4A460",
//     SeaGreen: "#2E8B57",
//     SeaShell: "#FFF5EE",
//     Sienna: "#A0522D",
//     Silver: "#C0C0C0",
//     SkyBlue: "#87CEEB",
//     SlateBlue: "#6A5ACD",
//     SlateGray: "#708090",
//     SlateGrey: "#708090",
//     Snow: "#FFFAFA",
//     SpringGreen: "#00FF7F",
//     SteelBlue: "#4682B4",
//     Tan: "#D2B48C",
//     Teal: "#008080",
//     Thistle: "#D8BFD8",
//     Tomato: "#FF6347",
//     Turquoise: "#40E0D0",
//     Violet: "#EE82EE",
//     Wheat: "#F5DEB3",
//     White: "#FFFFFF",
//     WhiteSmoke: "#F5F5F5",
//     Yellow: "#FFFF00",
//     YellowGreen: "#9ACD32",
// };
