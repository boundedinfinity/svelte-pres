<script lang="ts">
    import Nav from "$lib/nav.svelte";
    import { viewerNav } from "$lib/slides";
    export let debug: boolean = true;
</script>

<div class="overlay">
    {#if $viewerNav}
        <div class="nav" class:nav-debug={debug}>
            <Nav {debug} scale={4} opacity={10} />
        </div>
    {/if}
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
        right: 5%;
    }

    .nav-debug {
        border: 1px solid navy;
    }
</style>
