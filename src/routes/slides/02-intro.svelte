<script lang="ts" context="module">
    export const meta = {
        title: "Go optional type",
    };
</script>

<script lang="ts">
    import Center from "$lib/center.svelte";
    import Box from "$lib/box.svelte";
    import Deck from "$lib/deck.svelte";
    import Slide from "$lib/slide.svelte";
    // https://github.com/boundedinfinity/go-optioner
    // https://en.wikipedia.org/wiki/Option_type
</script>

<Deck>
    <Slide title="Describing the type">
        <ul>
            <li>
                A container type that wraps a value that may or may not contain
                a value.
            </li>
        </ul>
    </Slide>
    <Slide title="Describing the type">
        <ul>
            <li>
                A container type that wraps a value that may or may not contain
                a value.
            </li>
            <li>This type may also be know as the <em>Maybe</em> type.</li>
        </ul>
    </Slide>
    <Slide title="Getting started">
        <ul>
            <li>
                A container type that wraps a value that may or may not contain
                a value.
            </li>
            <li>This type may also be know as the <em>Maybe</em> type.</li>
        </ul>
        <Box debug={false}
            pattern="
        
        _ _ A[B]
        _
        _ _ _   B
        _
        _ _ _   C
        _ _ _ D
        ===
        A:
            text: Optional
    "
        />
    </Slide>
</Deck>
