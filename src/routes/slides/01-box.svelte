<script lang="ts" context="module">
    export const meta = {
        title: "box 1",
        notes: `
            This is a test.
        `
    };
</script>

<script lang="ts">
    import Box from "$lib/box.svelte";
</script>

<!-- <Center> -->
    <Box
        pattern="
        _ _ _ A[X,Y] A _ _
        _ _ _ A A _ B 
        _
        _ _ _ _ _ C
        _
        _ D
        ===
        A:
            text: |
                TLS X.509 Certificate<br />
                with another line
        B:
            text: SSL Private Key
        X:
            text: SSL Public Key
        Y:
            text: User information
    "
    />
<!-- </Center> -->
