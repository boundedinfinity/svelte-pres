<script lang="ts">
    import Overlay from '$lib/overlay.svelte'
    export let debug: boolean = false;
</script>

<main class:debug>
    <slot />
    <Overlay {debug} />
</main>

<style>
    main {
        height: 97vh;
        width: 98vw;
    }

    .debug {
        border: 1px solid orange;
    }
</style>
