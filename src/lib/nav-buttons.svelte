<script lang="ts">
    // https://docs.robbrazier.com/svelte-awesome/icons
    // https://github.com/RobBrazier/svelte-awesome#more-advanced-cases

    import Icon from "svelte-awesome";
    import arrowLeft from "svelte-awesome/icons/arrowLeft";
    import arrowRight from "svelte-awesome/icons/arrowRight";
    import { navPreferences } from "$lib/nav-utils";
    import { currentDeck, slides } from "$lib/deck-utils";
    import { next, prev } from "$lib/deck-utils";

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

<div
    class="nav"
    style="--opacity: {$navPreferences.opacity}%;"
    class:nav-debug={$navPreferences.debug}
>
    <div on:click={prev} on:keypress={prev} class="button">
        <Icon data={arrowLeft} scale={$navPreferences.scale} />
    </div>
    <div>{$currentDeck.index + 1}</div>
    <div>of</div>
    <div>{$slides.length}</div>
    <div on:click={next} on:keypress={next} class="button">
        <Icon data={arrowRight} scale={$navPreferences.scale} />
    </div>
</div>

<style>
    .nav {
        display: flex;
        gap: 1rem;
        align-items: center;
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
