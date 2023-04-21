<script lang="ts">
    import Overlay from "./overlay.svelte";
    import { slides, slideStateStore } from "$lib/slides";
    import { fade } from "svelte/transition";

    export let debug: boolean = false;
    export let h = "95svh";
    export let w = "95svw";

    $: slide = $slides[$slideStateStore.index];
    $: title = `[${$slideStateStore.index + 1} of ${$slides.length}] ${slide.title}`;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<main style="--h: {h}; --w: {w};" transition:fade>
    {#key $slideStateStore.index}
        <div class="content" class:debug-content={debug} transition:fade>
            <svelte:component this={slide.component} />
        </div>
    {/key}

    <div class="overlay" class:debug-overlay={debug}>
        <Overlay {debug} />
    </div>
</main>

<style>
    main {
        display: grid;
        grid-template-areas:
            "c c c c c c c c c c"
            "c c c c c c c c c c"
            "c c c c c c c c c c"
            "c c c c c c c c c c"
            "c c c c c c c c c c"
            "c c c c c c c c c c"
            "i i i i i n n n n n";
        grid-template-rows: repeat(7, 1fr);
        grid-template-columns: repeat(10, 1fr);

        /* position: relative; */
        height: var(--h, 95svh);
        width: var(--w, 95svw);
        box-sizing: border-box;
        margin: auto;
    }

    .content {
        grid-area: c;
        /* position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0; */
    }

    .debug-content {
        border: 1px solid red;
    }

    .overlay {
        grid-area: n;
        /* position: absolute;
        height: var(--h);
        width: var(--w);
        top: 0;
        left: 0; */
    }

    .debug-overlay {
        border: 1px solid orange;
    }
</style>
