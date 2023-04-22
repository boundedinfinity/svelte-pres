<script lang="ts">
    import Nav from "./nav.svelte";
    import { slides, deckLocation } from "$lib/slides";
    import { fade } from "svelte/transition";

    export let debug: boolean = false;
    export let h = "95svh";
    export let w = "95svw";

    $: slide = $slides[$deckLocation.index];
    $: title = `[${$deckLocation.index + 1} of ${$slides.length}] ${
        slide.title
    }`;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<main style="--h: {h}; --w: {w};" transition:fade>
    {#key $deckLocation.index}
        <div class="content" class:debug-content={debug} transition:fade>
            <svelte:component this={slide.component} />
        </div>
    {/key}

    <div class="overlay" class:nav-debug={debug}>
        <Nav />
    </div>
</main>

<style>
    main {
        display: grid;
        grid-template-areas:
            "c c c c c c c c c c c c"
            "c c c c c c c c c c c c"
            "c c c c c c c c c c c c"
            "c c c c c c c c c c c c"
            "c c c c c c c c c c c c"
            "c c c c c c c c c c c c"
            "c c c c c c c c c c c c"
            "c c c c c c c c c c c c"
            "c c c c c c c c c c c c"
            "c c c c c c c c c c c c"
            "c c c c c c c c c c c c"
            "i i i i i n n n n n n n";
        grid-template-rows: repeat(12, 1fr);
        grid-template-columns: repeat(12, 1fr);

        height: var(--h, 95svh);
        width: var(--w, 95svw);
        box-sizing: border-box;
        margin: auto;
    }

    .content {
        grid-area: c;
    }

    .debug-content {
        border: 1px solid red;
    }

    .overlay {
        grid-area: n;
    }

    .nav-debug {
        border: 1px solid orange;
    }
</style>
