<script lang="ts">
    import Center from "$lib/center.svelte";
    import Grid from "$lib/grid.svelte";
    import GridItem from "$lib/gridItem.svelte";
</script>

<Grid debug={false}>
    <GridItem row={1} col={1} debug={false}>1,1</GridItem>
    <GridItem row={12} col={1} debug={false}>12,1</GridItem>

    <GridItem row={1} col={12} debug={false}>1,12</GridItem>

    <GridItem row={6} col={6} debug={false}>6,6</GridItem>

    <GridItem row={12} col={12} debug={false}>12,12</GridItem>
</Grid>

<style>
</style>
