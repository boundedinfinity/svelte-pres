<script lang="ts">
    export let rows: number = 12;
    export let cols: number = 12;
    export let h: number = 100;
    export let w: number = 100;
    export let gap: string = "0.5rem";
    export let debug: boolean = false;
</script>

<main
    class:debug1={debug}
    style="--rows: {rows}; --cols: {cols}; --h: {h}%; --w: {w}%; --gap: {gap};"
>
    <slot />
</main>

<style>
    main {
        display: grid;
        grid-template-columns: repeat(var(--cols), 1fr);
        grid-template-rows: repeat(var(--rows), 1fr);
        gap: var(--gap);
        height: var(--h);
        width: var(--w);
    }

    .debug1 {
        border: 1px solid red;
    }
</style>
