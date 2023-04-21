<script lang="ts">
    import { navStateStore } from "$lib/nav-utils";
</script>

<main>
    <div>Debug:</div>
    <div>
        <input type="checkbox" bind:checked={$navStateStore.debug} />
    </div>
    <div>Visible:</div>
    <div>
        <input type="checkbox" bind:checked={$navStateStore.visible} />
    </div>
    <div>Scale:</div>
    <div>
        <input
            type="number"
            bind:value={$navStateStore.scale}
            min="1"
            max="10"
        />
    </div>
    <div>Opacity:</div>
    <div>
        <input
            type="number"
            bind:value={$navStateStore.opacity}
            min="0"
            max="100"
        />
    </div>
</main>

<style>
    main {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
</style>
