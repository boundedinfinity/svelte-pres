<script lang="ts">
    // https://docs.robbrazier.com/svelte-awesome/icons
    // https://github.com/RobBrazier/svelte-awesome#more-advanced-cases

    import Icon from "svelte-awesome";
    import arrowLeft from "svelte-awesome/icons/arrowLeft";
    import arrowRight from "svelte-awesome/icons/arrowRight";
    import { index } from "$lib/slides";

    export let debug: boolean = false;
    export let scale: number = 5;
    export let opacity: number = 30;

    function next() {
        index.next();
    }

    function prev() {
        index.prev();
    }

    function keydown(e: KeyboardEvent) {
        switch (e.key) {
            case "ArrowLeft":
                prev();
                break;
            case "ArrowRight":
                next();
                break;
        }
    }
</script>

<svelte:window on:keydown|preventDefault={keydown} />

<div class="nav" style="--opacity: {opacity}%;" class:nav-debug={debug}>
    <div on:click={prev} on:keypress={prev} class="button">
        <Icon data={arrowLeft} {scale} />
    </div>
    <div on:click={next} on:keypress={next} class="button">
        <Icon data={arrowRight} {scale} />
    </div>
</div>

<style>
    .nav {
        display: flex;
        gap: 1rem;
    }

    .button {
        opacity: var(--opacity);
    }

    .button:hover {
        opacity: calc(var(--opacity) + 15%);
    }

    .nav-debug {
        border: 1px solid navy;
    }
</style>
