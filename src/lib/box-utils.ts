import { dump } from "$lib/util";

const debug = false;
let id = 0;

function nextId(symbol: string, blank: string): string {
    if (symbol == blank) {
        id++;
        symbol = symbol.replace(blank, `${blank}${id}`);
    }

    return symbol;
}

function pattern2lines(pattern: string, blank:string): string[][] {
    let lines: string[][] = pattern
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => line.replaceAll(/\s+/g, " "))
        .map((line) => line.split(" "));
    if (debug) dump(lines, { name: "lines" });

    const rows = lines2maxRow(lines);
    const cols = lines2maxCol(lines);

    lines.forEach((xs) => {
        while (xs.length < cols) xs.push(blank);
    });

    lines = lines.map((xs) => xs.map((symbol) => nextId(symbol, blank)));

    if (debug) dump(lines, { name: "lines2" });
    if (debug) console.log(`rows: ${rows}, cols: ${cols}`);

    return lines;
}

function lines2maxRow(lines: string[][]): number {
    if (lines) return lines.length;
    return -1;
}

function lines2maxCol(lines: string[][]): number {
    if (lines) return lines.reduce((acc, cur) => Math.max(acc, cur.length), 0);
    return -1;
}

function lines2gridArea(lines: string[][]): string {
    if (lines) {
        const area = lines
            .map((xs) => xs.join(" "))
            .map((x) => `"${x}"`)
            .join(" ");
        if (debug) dump(area, { name: "area" });
        return area;
    }

    return "";
}

function lines2elems(lines: string[][], blank: string): string[] {
    if (lines) {
        const elems: string[] = [
            ...new Set(lines.flat().filter((e) => !e.startsWith(blank))),
        ];
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
};
