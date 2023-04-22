<script lang="ts">
    import { onDestroy } from "svelte";
    import { deck } from "$lib/deck-utils";

    onDestroy(() => {
        $deck.slides.length = 0;
    });
</script>

<p>Count: {$deck.slides.length}</p>

<div>
    <input type="number" bind:value={$deck.index} min="0" max="10" />
</div>

<main>
    <slot />
</main>

<style>
    main {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
