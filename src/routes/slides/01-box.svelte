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
        _ _ A A _
        _ _ _ _ B 
        _ _ _ _ _ 
        _ _ C _ _ 
        _ D _ _ _
    " />
</Center>
