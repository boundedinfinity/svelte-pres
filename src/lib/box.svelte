<script lang="ts">
    import {
        pattern2lines,
        lines2gridArea,
        lines2elems,
    } from "./box-utils";
    
    export let pattern: string;
    export let outlined: boolean = true;
    export let gap: string = "0.5rem";
    export let blank = "_";

    let lines = pattern2lines(pattern, blank);
    const area = lines2gridArea(lines);
    const elems = lines2elems(lines, blank);
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
        margin: 0.25rem;
        padding-inline: 0.25rem;
        padding-block: 0.25rem;
        display: grid;
        justify-content: center;
        align-content: center;
    }

    .outlined {
        border: 2px solid blue;
    }
</style>
