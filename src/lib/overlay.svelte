<script lang="ts">
    // https://docs.robbrazier.com/svelte-awesome/icons
    // https://github.com/RobBrazier/svelte-awesome#more-advanced-cases
    import Icon from "svelte-awesome";
    import arrowLeft from "svelte-awesome/icons/arrowLeft";
    import arrowRight from "svelte-awesome/icons/arrowRight";
    export let debug: boolean = true;
    export let scale: number = 2;
    export let opacity: number = 30;

    function left() {
        console.log("left clicked");
    }

    function right() {
        console.log("right clicked");
    }

    function keydown(e: KeyboardEvent) {
        switch (e.key) {
            case "ArrowLeft":
                left();
                break;
            case "ArrowRight":
                right();
                break;
        }
    }
</script>

<svelte:window on:keydown|preventDefault={keydown} />

<div class="overlay">
    <div class="nav" style="--opacity: {opacity}%;" class:nav-debug={debug}>
        <div on:click={left} on:keypress={left}>
            <Icon data={arrowLeft} {scale} />
        </div>
        <div on:click={right} on:keypress={right}>
            <Icon data={arrowRight} {scale} />
        </div>
    </div>
</div>

<style>
    .overlay {
        position: relative;
        height: 100%;
        width: 100%;
    }

    .nav {
        position: absolute;
        bottom: 5%;
        left: 50%;
        opacity: var(--opacity);
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, 1fr);
    }
    .nav-debug {
        border: 1px solid navy;
    }
</style>
