<script lang="ts">
    export let h: number = 100;
    export let w: number = 100;
    export let debug: boolean = false;
</script>

<main class:debug1={debug} style="--h: {h}%; --w: {w}%;">
    <div class:debug2={debug}>
        <slot />
    </div>
</main>

<style>
    main {
        display: grid;
        height: var(--h);
        width: var(--w);
        justify-content: center;
        align-content: center;
    }

    .debug1 {
        border: 1px solid red;
    }

    .debug2 {
        border: 1px solid blue;
    }
</style>
