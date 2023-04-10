<script lang="ts">
    import Overlay from "$lib/overlay.svelte";
    export let debug: boolean = false;
    export let h: number = 97;
    export let w: number = 98;
</script>

<main style="--h: {h}vh; --w: {w}vw;">
    <div class="content" class:debug-content={debug}>
        <slot />
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
