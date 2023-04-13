<script lang="ts">
    import Overlay from "./overlay.svelte";
    import { slides, index } from "$lib/slides";

    export let debug: boolean = false;
    export let h: number = 97;
    export let w: number = 97;

    $: slide = $slides[$index];
    $: title = `[${$index + 1} of ${$slides.length}] ${slide.title}`;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<main style="--h: {h}vh; --w: {w}vw;">
    <div class="content" class:debug-content={debug}>
        <svelte:component this={slide.component} />
    </div>

    <div class="overlay" class:debug-overlay={debug}>
        <Overlay {debug} />
    </div>
</main>

<style>
    main {
        position: relative;
        height: var(--h);
        width: var(--w);
        background-color: white;
    }

    .content {
        position: absolute;
        height: var(--h);
        width: var(--w);
        top: 0;
        left: 0;
    }

    .debug-content {
        border: 1px solid red;
    }

    .overlay {
        position: absolute;
        height: var(--h);
        width: var(--w);
        top: 0;
        left: 0;
    }

    .debug-overlay {
        border: 1px solid orange;
    }
</style>
