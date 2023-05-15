import { load } from "js-yaml";
import { dumpl } from "$lib/util";
import _ from "lodash";

interface MapDescriptor {
    symbols: string[][];
    rows: number;
    cols: number;
}

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
        if (debug) dumpl(rawConfig, { name: "rawConfig" });
        const index = rawConfig.indexOf(rawConfig.trim());

        rawConfig = rawConfig
            .split("\n")
            .map((l) => l.substring(index - 1))
            .join("\n");

        if (debug) dumpl(rawConfig, { name: "rawConfig (normalized)" });
        const configMap = load(rawConfig) as ItemConfigMap;
        if (debug) dumpl(configMap, { name: "configMap" });
        return configMap;
    }

    return {};
}

function parseSymbol(symbol: string, debug: boolean): ItemConfig {
    if (debug) dumpl(symbol, { name: "parseSymbol(symbol)" });
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
                    current = current.parent
                } else {
                    if (debug)
                        dumpl(current, { name: "parseSymbol(no parent)" });
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

    if (debug) dumpl(root, { name: "parseSymbol(root)" });
    return root;
}

function parseMap(
    rawTable: string,
    blank: string,
    minRows: number,
    minCols: number,
    debug: boolean
): MapDescriptor {
    const desc: MapDescriptor = {
        symbols: [],
        rows: minRows,
        cols: minCols,
    };

    if (rawTable) {
        desc.symbols = rawTable
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => line.replaceAll(/\s+/g, " "))
            .map((line) => line.split(" "));

        if (debug) dumpl(desc.symbols, { name: "symbols" });

        desc.rows = Math.max(minRows, lines2maxRow(desc.symbols));
        desc.cols = Math.max(minCols, lines2maxCol(desc.symbols));

        if (debug) console.log(`raw: rows: ${desc.rows}, cols: ${desc.cols}`);

        while (desc.symbols.length < desc.rows) desc.symbols.push([]);

        desc.symbols.forEach((symbol) => {
            while (symbol.length < desc.cols) symbol.push(blank);
        });

        if (debug)
            console.log(`normalized: rows: ${desc.rows}, cols: ${desc.cols}`);

        desc.symbols = desc.symbols.map((symbol) =>
            symbol.map((id) => nextId(id, blank))
        );

        if (debug) dumpl(desc.symbols, { name: "symbols (with ids)" });

        desc.symbols = desc.symbols;
    }

    return desc;
}

function pattern2lines(
    pattern: string,
    blank: string,
    minRows: number,
    minCols: number,
    separator: string,
    outlined: boolean,
    debug: boolean
): ItemConfig[][] {
    if (debug) dumpl(pattern, { name: "pattern2lines(pattern)" });
    let [rawTable, rawConfig] = pattern.split(separator);
    const mapDesc = parseMap(rawTable, blank, minRows, minCols, debug);
    const configMap = paraseConfig(rawConfig, debug);

    let configs = mapDesc.symbols.map((symbols) =>
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

                if (!root.style) root.style = nextStyle();
                if (!root.outlined) root.outlined = outlined;
            }

            walk(ic);
            return ic;
        })
    );

    if (debug) dumpl(configs, { name: "configs" });

    return configs;
}

function lines2maxRow(lines: string[][]): number {
    if (lines) return lines.length;
    return 0;
}

function lines2maxCol(lines: string[][]): number {
    if (lines) return lines.reduce((acc, cur) => Math.max(acc, cur.length), 0);
    return 0;
}

function lines2gridArea(icTable: ItemConfig[][], debug: boolean): string {
    if (icTable) {
        const area = icTable
            .map((ics) => ics.map((ic) => ic.id).join(" "))
            .map((x) => `"${x}"`)
            .join(" ");
        if (debug) dumpl(area, { name: "area" });
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
                ..._.uniqBy(lines.flat(), (e) => e.id).filter(
                    (e) => !e.id.startsWith(blank)
                ),
            ];
        }

        if (debug) dumpl(elems);
        return elems;
    }

    return [];
}

function cssPropObj(orig: string, config: StyleConfig | undefined): string {
    if (!config) return orig;
    let style = orig;

    Object.entries(config).forEach(([name, value]) => {
        style = cssProp(style, name, value);
    });

    return style;
}

function cssProp(
    orig: string,
    name: string,
    value: string | undefined
): string {
    if (!value || value.length <= 0) return orig;

    let style = orig;
    if (style && style.length > 0) style += " ";

    name = name.replaceAll(/([A-Z])/g, `-$1`).toLowerCase();

    style += `--item-${name}: ${value};`;

    return style;
}

export {
    dumpl,
    nextId,
    pattern2lines,
    lines2maxRow,
    lines2maxCol,
    lines2gridArea,
    lines2elems,
    type ItemConfig,
    type StyleConfig,
    cssProp,
    cssPropObj,
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

interface StyleConfig {
    marginInline?: string;
    marginBlock?: string;
    paddingInline?: string;
    paddingBlock?: string;
    borderColor?: string;
    borderRadius?: string;
    borderStyle?: string;
    borderWidth?: string;
    backgroundColor?: string;
    color?: string;
    justifyContent?: string;
    alignContent?: string;
}

const defaultColors: StyleConfig[] = [
    {
        marginInline: "0.25rem",
        marginBlock: "0.25rem",
        backgroundColor: "skyblue",
        color: "darkblue",
        borderColor: "darkblue",
    },
];

function nextStyle(): StyleConfig {
    return defaultColors[0];
    // if (color > defaultColors.length) {
    //     color = 0;
    // }

    // const current = defaultColors[color];
    // color++;

    // return current;
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
