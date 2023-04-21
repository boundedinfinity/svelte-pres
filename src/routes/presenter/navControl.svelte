<script lang="ts">
    import { navPreferences, clearStorage } from "$lib/nav-utils";
</script>

<main>
    <div>Debug:</div>
    <div>
        <input type="checkbox" bind:checked={$navPreferences.debug} />
    </div>
    <div>Visible:</div>
    <div>
        <input type="checkbox" bind:checked={$navPreferences.visible} />
    </div>
    <div>Scale:</div>
    <div>
        <input
            type="number"
            bind:value={$navPreferences.scale}
            min="1"
            max="10"
        />
    </div>
    <div>Opacity:</div>
    <div>
        <input
            type="number"
            bind:value={$navPreferences.opacity}
            min="0"
            max="100"
        />
    </div>
    <div>Clear Storage:</div>
    <div>
        <button on:click={clearStorage}>Clear</button>
    </div>
</main>

<style>
    main {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.25rem;
    }
</style>
