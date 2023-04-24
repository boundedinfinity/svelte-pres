<script lang="ts">
    import {
        allDescriptors,
        currentDeck,
        DeckDescriptor,
    } from "$lib/deck-utils";
    import { goto } from "$app/navigation";

    function setModule(deck: DeckDescriptor, path: string) {
        $currentDeck = deck;
        goto(path);
    }
</script>

<ul>
    {#each $allDescriptors as deck}
        <li class:current={deck.path == $currentDeck.path}>
            <div>
                <h3>{deck.title}</h3>
                <ul>
                    <li>Path: {deck.path}</li>
                    <li>
                        <button on:click={() => setModule(deck, "/viewer")}>
                            Viewer</button
                        >
                    </li>
                    <li>
                        <button on:click={() => setModule(deck, "/presenter")}
                            >Presenter</button
                        >
                    </li>
                    {#if deck.labels}
                        <li>
                            Labels:
                            <ul>
                                {#each deck.labels as label}
                                    <li>{label}</li>
                                {/each}
                            </ul>
                        </li>
                    {/if}
                </ul>
            </div>
        </li>
    {/each}
</ul>

<style>
    .current {
        border: 1px solid red;
    }
</style>
