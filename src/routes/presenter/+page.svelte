<script lang="ts">
    import Nav from "$lib/nav.svelte";
    import { slides, index } from "$lib/slides";
    $: slide = $slides[$index];
    $: title = `[${$index + 1} of ${$slides.length}] ${slide.title}`;
    export let h: number = 97;
    export let w: number = 97;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="grid" style="--h: {h}vh; --w: {w}vw;">
    <div class="list debug">
        <ul>
            {#each $slides as slide, i}
                <li>
                    <button
                        class:current={i == $index}
                        on:click={() => index.set(i)}
                    >
                        slide: {i} - {slide.title}
                    </button>
                </li>
            {/each}
        </ul>
    </div>

    <div class="viewer debug">
        <svelte:component this={slide.component} />
    </div>

    <div class="info debug">
        <Nav scale={3} />
    </div>
</div>

<style>
    li {
        margin-block: 0.25rem;
    }

    .list {
        grid-area: l;
    }

    .viewer {
        grid-area: v;
    }

    .info {
        grid-area: i;
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
            "l l l v v v v v v v v"
            "l l l v v v v v v v v"
            "l l l v v v v v v v v"
            "l l l i i i i i i i i";
        height: var(--h);
        width: var(--w);
        grid-template-rows: repeat(4, 1fr);
        grid-template-columns: repeat(11, 1fr);
    }
</style>
