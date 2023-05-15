<script lang="ts">
    import { currentDeck, slides, SlideDescriptor } from "$lib/deck-utils";
    import { fade as sfade } from "svelte/transition";
    export let title: string;
    export let fade: boolean = true;
    const slide = new SlideDescriptor(title, $slides.length);
    slides.update((_) => [..._, slide]);
</script>

{#key slide.index}
    {#if fade}
        <div class:show={$currentDeck.index == slide.index}>
            <h1>{title}</h1>
            <slot />
        </div>
    {:else}
        <div class:show={$currentDeck.index == slide.index}>
            <h1>{title}</h1>
            slide <slot />
        </div>
    {/if}
{/key}

<style>
    div {
        position: absolute;
        opacity: 0;
        width: 100%;
    }

    .show {
        opacity: inherit;
    }
</style>
