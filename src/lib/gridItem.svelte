<script lang="ts">
    import Center from "$lib/center.svelte";
    export let row: number = 1;
    export let col: number = 1;
    export let debug: boolean = false;
</script>

<main style="--row: {row}; --col: {col};">
    <Center {debug}>
        <slot />
    </Center>
</main>

<style>
    main {
        grid-column: var(--col);
        grid-row: var(--row);
        width: 100%;
        height: 100%;
    }
</style>
