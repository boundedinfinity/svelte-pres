<script lang="ts">
    import { onDestroy } from "svelte";
    import { slides } from "$lib/deck-utils";

    onDestroy(() => {
        $slides.length = 0;
    });
</script>

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
