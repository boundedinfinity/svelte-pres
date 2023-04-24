<script lang="ts">
    import Nav from "./nav.svelte";
    import NavControl from "./navControl.svelte";
    import { currentDeck, currentComponent, slides } from "$lib/deck-utils";

    export let h: number = 97;
    export let w: number = 97;
    export let debug: boolean = false;
</script>

<svelte:head>
    {#if $currentDeck}
        <title>{$currentDeck.title} : Presenter</title>
    {/if}
</svelte:head>

<div class="grid" style="--h: {h}vh; --w: {w}vw;">
    <div class="list" class:debug>
        <p>Count: {$slides.length}</p>

        <ul>
            {#each $slides as slide, i}
                <li>
                    <button
                        class:current={i == $currentDeck.index}
                        on:click={() => ($currentDeck.index = i)}
                    >
                        [{i}] {slide.title}
                    </button>
                </li>
            {/each}
        </ul>
    </div>

    <div class="viewer" class:debug>
        <svelte:component this={$currentComponent} />
    </div>

    <div class="info" class:debug>
        <Nav />
        <NavControl />
    </div>
</div>

<style>
    .viewer {
        grid-area: v;
    }
    .info {
        grid-area: i;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        align-items: center;
        border-top-width: 1px;
        border-top-style: solid;
    }

    .current {
        background-color: bisque;
    }

    .debug {
        border: 1px solid red;
    }

    .grid {
        display: grid;
        grid-template-areas:
            "l l v v v v v v v v"
            "l l v v v v v v v v"
            "l l v v v v v v v v"
            "l l v v v v v v v v"
            "l l v v v v v v v v"
            "l l v v v v v v v v"
            "l l v v v v v v v v"
            "l l v v v v v v v v"
            "l l i i i i i i i i"
            "l l i i i i i i i i";
        height: var(--h);
        width: var(--w);
        gap: 1rem;
        grid-template-rows: repeat(10, 1fr);
        grid-template-columns: repeat(10, 1fr);
    }

    li {
        margin-block: 0.25rem;
    }

    button {
        padding-block: 0.25rem;
        padding-inline: 0.5rem;
    }

    .list {
        grid-area: l;
        border-right-width: 1px;
        border-right-style: solid;
    }
</style>
