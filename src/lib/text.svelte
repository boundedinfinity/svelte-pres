<script lang="ts">
    export let size: string = "10vw";
</script>

<span class="text" style="--size: {size};">
    <slot />
</span>

<style>
    .text {
        font-size: var(--size);
    }
</style>
