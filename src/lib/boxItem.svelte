<script lang="ts">
    import type { ItemConfig } from "$lib/box-utils";
    import { cssProp, cssPropObj } from "$lib/box-utils";
    export let item: ItemConfig;
    let style = cssProp("", "grid-area", item.id);
    style = cssPropObj(style, item.style);
</script>

<section class:outline={item.outlined} {style}>
    <div>
        <div>
            {@html item.text}
        </div>

        <div><slot /></div>

        {#if item.children && item.children.length}
            {#each item.children as child}
                <svelte:self item={child} />
            {/each}
        {/if}
    </div>
</section>

<style>
    section {
        grid-area: var(--item-grid-area);
        display: grid;
        justify-content: var(--item-justify-content, center);
        align-content: var(--item-align-content, center);

        margin-inline: var(--item-margin-inline, 0.25rem);
        margin-block: var(--item-margin-block, 0.25rem);
        padding-inline: var(--item-padding-inline, 0.25rem);
        padding-block: var(--item-padding-block, 0.25rem);
        background-color: var(--item-background-color, white);
        color: var(--item-color, darkblue);
        border-radius: var(--item-border-radius, 3px);
    }

    .outline {
        border-width: var(--item-border-width, 1px);
        border-color: var(--item-border-color, darkblue);
        border-style: var(--item-border-style, solid);
    }
</style>
