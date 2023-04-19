<script lang="ts">
    import { dump } from "$lib/util";
    import BoxItem from "./boxItem.svelte";
    export let outlined: boolean = true;
    export let pattern: string;
    export let gap: string = "0.5rem";
    export let blank = "_";

    let i = 0;
    function next(): string {
        const s = `${blank}${i}`;
        i++;
        return s;
    }

    let lines: string[][] = pattern
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => line.replaceAll(/\s+/g, " "))
        .map((line) => line.split(" "));
    dump(lines, { name: "lines" });

    const rows = lines.length;
    const cols = lines.reduce((acc, cur) => Math.max(acc, cur.length), 0);

    lines.forEach((xs) => {
        while (xs.length < cols) xs.push(blank);
    });

    lines = lines.map(xs => xs.map((symbol) => symbol.replace(blank, next())))
    dump(lines, { name: "lines2" });

    console.log(`rows: ${rows}, cols: ${cols}`);

    const area = lines
        .map((xs) => xs.join(" "))
        .map((x) => `"${x}"`)
        .join(" ");
    // dump(area, {name: 'area'});

    const elems: string[] = [
        ...new Set(lines.flat().filter((e) => !e.startsWith(blank))),
    ];
    // dump(elems);
</script>

<main class:outlined style={`--area: ${area}; --gap: ${gap};`}>
    {#each elems as elem}
        <div class="item" class:outlined style={`grid-area: ${elem}`}>
            {elem}
        </div>
    {/each}
</main>

<style>
    main {
        display: grid;
        grid-template-areas: var(--area);
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 1fr);
        gap: var(--area);
    }

    .item {
        padding-inline: 0.5rem;
        padding-block: 0.5rem;
    }

    .outlined {
        border: 2px solid blue;
    }
</style>
