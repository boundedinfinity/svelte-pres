<script lang="ts" context="module">
    export const meta = {
        title: "All in one",
    };
</script>

<script lang="ts">
    import Deck from '$lib/deck.svelte'
    import Slide from '$lib/slide.svelte'
    import Box from "$lib/box.svelte";
</script>

<Deck>
    <Slide title="slide 1 title" fade={false}>
        <Box debug={false}
        pattern="
        _ _ _ A[X,Y] A _ _ _
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
    </Slide>
    <Slide title="slide 2 title" fade={false}>
        <Box  debug={false}
        pattern="
        _ _ _ A[X,Y] A _ _ _
        _ _ _ A A _ B 
        _
        _ _ _ _ _ C
        _
        _ _ _ _ _ D
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
    </Slide>
    <Slide title="slide 3 title">slide 3 contents</Slide>
    <Slide title="slide 4 title">slide 4 contents</Slide>
</Deck>
