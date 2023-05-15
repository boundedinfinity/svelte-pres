<script lang="ts">
    import { pattern2lines, lines2gridArea, lines2elems } from "./box-utils";
    import BoxItem from "$lib/boxItem.svelte";

    export let pattern: string;
    export let outline: boolean = false;
    export let itemOutline: boolean = true;
    export let gap: string = "0.5rem";
    export let blank = "_";
    export let separator = "===";
    export let minRows = 0;
    export let minCols = 0;
    export let debug = false;

    let lines = pattern2lines(
        pattern,
        blank,
        minRows,
        minCols,
        separator,
        itemOutline,
        debug
    );
    const area = lines2gridArea(lines, debug);
    const elems = lines2elems(lines, blank, debug);
</script>

<main
    class:outline
    style={`--area: ${area}; --gap: ${gap}; --cols: ${lines[0].length}; --rows: ${lines.length}`}
>
    {#each elems as elem}
        <BoxItem item={elem} />
    {/each}
</main>

<style>
    main {
        display: grid;
        grid-template-areas: var(--area);
        grid-auto-columns: 1fr;
        grid-auto-rows: 1fr;
        grid-auto-flow: column;
        width: max-content;
        height: 100%;
        gap: var(--gap, 0.5rem);
        box-sizing: border-box;
    }

    .outline {
        border-color: var(--border-color, darkblue);
        border-style: var(--border-color, solid);
        border-width: var(--border-color, 2px);
        border-radius: var(--border-color, 3px);
    }
</style>
