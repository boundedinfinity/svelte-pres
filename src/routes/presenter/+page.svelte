<script lang="ts">
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
                    <button on:click={() => ($index = i)}>
                        slide: {i} - {slide.title}
                    </button>
                </li>
            {/each}
        </ul>
    </div>

    <div class="viewer debug">
        <svelte:component this={slide.component} />
    </div>

    <div class="info debug">This is information</div>
</div>

<style>
    .list {
        grid-area: l;
    }

    .viewer {
        grid-area: v;
    }

    .info {
        grid-area: i;
    }

    .debug {
        border: 1px solid red;
    }
    .grid {
        display: grid;
        grid-template-areas:
            "l v v v v v v v v"
            "l v v v v v v v v"
            "l v v v v v v v v"
            "l i i i i i i i i";
        height: var(--h);
        width: var(--w);
    }
</style>
