<script lang="ts">
    import { pattern2lines, lines2gridArea, lines2elems } from "./box-utils";

    export let pattern: string;
    export let containerOutline: boolean = false;
    export let itemOutline: boolean = true;
    export let gap: string = "0.5rem";
    export let blank = "_";
    export let separator = "===";
    export let minRows = 0;
    export let minCols = 0;
    export let debug = true;

    let lines = pattern2lines(
        pattern,
        blank,
        minRows,
        minCols,
        separator,
        debug
    );
    const area = lines2gridArea(lines, debug);
    const elems = lines2elems(lines, blank, debug);
</script>

<main
    class:containerOutline
    style={`--area: ${area}; --gap: ${gap};`}
>
    {#each elems as elem}
        <div class="item" class:itemOutline style={`grid-area: ${elem.id}`}>
            {elem.text}
        </div>
    {/each}
</main>

<style>
    main {
        display: grid;
        grid-template-areas: var(--area);
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 1fr);
        gap: var(--gap, 0.5rem);
    }

    .item {
        display: grid;
        justify-content: center;
        align-content: center;

        margin-inline: var(--item-margin-inline, 0.25rem);
        margin-block: var(--item-margin-block, 0.25rem);
        padding-inline: var(--item-padding-inline, 0.25rem);
        padding-block: var(--item-padding-block, 0.25rem);
        background-color: var(--item-background-color, white);
        color: var(--item-background-color, darkblue);
    }

    .itemOutline {
        border-width: var(--item-border-width, 1px);
        border-color: var(--item-border-color, darkblue);
        border-style: var(--item-border-color, solid);
        border-radius: var(--item-border-radius, 5px);
    }

    .containerOutline {
        border: 2px solid blue;
    }
</style>
