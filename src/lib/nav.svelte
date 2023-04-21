<script lang="ts">
    // https://docs.robbrazier.com/svelte-awesome/icons
    // https://github.com/RobBrazier/svelte-awesome#more-advanced-cases

    import Icon from "svelte-awesome";
    import arrowLeft from "svelte-awesome/icons/arrowLeft";
    import arrowRight from "svelte-awesome/icons/arrowRight";
    import { slideStateStore } from "$lib/slides";
    import { navStateStore } from "$lib/nav-utils";

    function next() {
        slideStateStore.update(s => {
            s.next()
            return s;
        });
    }

    function prev() {
        slideStateStore.update(s => {
            s.prev()
            return s
        })
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

<div
    class="nav"
    style="--opacity: {$navStateStore.opacity}%;"
    class:nav-debug={$navStateStore.debug}
    class:hidden={!$navStateStore.visible}
>
    <div on:click={prev} on:keypress={prev} class="button">
        <Icon data={arrowLeft} scale={$navStateStore.scale} />
    </div>
    <div on:click={next} on:keypress={next} class="button">
        <Icon data={arrowRight} scale={$navStateStore.scale} />
    </div>
</div>

<style>
    .nav {
        display: flex;
        gap: 1rem;
    }

    .hidden {
        opacity: 0;
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
