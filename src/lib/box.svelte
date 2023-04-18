<script lang="ts">
    import { dump } from "$lib/util";
    import BoxItem from "./boxItem.svelte";
    export let outlined: boolean = true;
    export let pattern: string;
    export let gap: string = "0.5rem";
    export let blank = "_";
    
    const lines: string[] = pattern
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => line.replaceAll(/\s+/g, " "));
    const area = lines.map((line) => `"${line}"`).join(" ");
    const lines2: string[][] = lines.map((line) => line.split(" "));
    const elems: string[] = [...new Set(lines2.flat().filter(e => e != blank))]
    const rows = lines2.length;
    const cols = lines2.reduce((acc, cur) => Math.max(acc, cur.length), 0);
    
    console.log(`rows: ${rows}, cols: ${cols}`);
    dump(elems);
    dump(lines);
    dump(area);
</script>

<main
    style="--rows: {rows}; --cols: {cols}; --area: '{area}'; --gap: {gap}"
    class:outlined
>
    {#each elems as elem}
        <div class:outlined style="grid-area: '{elem}';">
            {elem}
        </div>
    {/each}
</main>

<style>
    main {
        display: grid;
        grid-template-areas: var(--area);
        grid-template-columns: repeat(var(--cols), 1fr);
        grid-template-rows: repeat(var(--rows), 1fr);
        gap: var(--gap);
    }

    .outlined {
        border: 2px solid blue;
    }
</style>
