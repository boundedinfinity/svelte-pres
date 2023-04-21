<script lang="ts">
    import { navPreferences } from "$lib/nav-utils";
    import NavButtons from "$lib/nav-buttons.svelte";
</script>

<div class:hidden={!$navPreferences.visible}>
    <NavButtons />
</div>

<style>
    .hidden {
        opacity: 0;
    }
</style>
