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
        <!-- <Box pattern="
        A[X,Y]  _
        B
        ===
        A:
            text: SOME A
        B:
            text: SOME B
        X:
            text: SOME X
    " /> -->
        <Box pattern="
        A[X,Y] A A A _ _
        A A A A _ B 
        _ _ _ _ _ _
        _ _ C _ _ _
        _ _ _ _ _ _
        _ D
        ===
        A:
            text: SOME A
        B:
            text: SOME B
        X:
            text: SOME X
    " />
</Center>
