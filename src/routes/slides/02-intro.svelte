<script lang="ts" context="module">
    export const meta = {
        title: "This is slide 1",
    };
</script>

<script lang="ts">
    import Center from "$lib/center.svelte";
    import Box from "$lib/box.svelte";
</script>

<Center>
    <!-- <code>test = fn(test)</code> -->
    <Box pattern="
    _
    _ _ _ _ _ B
    A A
    _ _ C
    _ 
    _ _ _ D
    ===
" />
</Center>
