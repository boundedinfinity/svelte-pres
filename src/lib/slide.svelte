<script lang="ts">
    import { deck, SlideDescriptor } from "$lib/deck-utils";
    import { fade as sfade } from "svelte/transition";
    export let title: string;
    export let fade: boolean = true;
    const slide = new SlideDescriptor(title, $deck.slides.length);
    deck.add(slide);
</script>

{#key $deck.index}
    {#if fade}
        <div
            class:show={$deck.index == slide.index}
            in:sfade={{ delay: 50 }}
            out:sfade={{ duration: 50 }}
        >
            <h1>{title}</h1>
            slide <slot />
        </div>
    {:else}
        <div class:show={$deck.index == slide.index}>
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
