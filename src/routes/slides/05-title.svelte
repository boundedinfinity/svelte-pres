<script lang="ts" context="module">
    export const meta = {
        title: "Cross fade",
    };
</script>

<script lang="ts">
    import Center from "$lib/center.svelte";
    import Text from "$lib/text.svelte";
    import { crossfade } from "svelte/transition";
    import { flip } from "svelte/animate";
    import { quintOut } from "svelte/easing";

    const [send, receive] = crossfade({
        duration: (d) => Math.sqrt(d * 200),

        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === "none" ? "" : style.transform;

            return {
                duration: 600,
                easing: quintOut,
                css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
            };
        },
    });

    let items: string[] = [];
    
    for (let i = 0; i < 99; i++) {
        items.push(i.toString().padStart(2, "0"));
    }
    items.push("")

    function handleClick() {
        const x00 = items[0]
        const x99 = items[99]
        
        items[99] = x00
        items = [...items]
    }
</script>

<Center>
    <button on:click={handleClick}> Click me </button>
    <div>
        {#each items as item, index (item)}
            <section
                in:send={{ key: index }}
                out:receive={{ key: index }}
                animate:flip
            >
                <span>{item}</span>
            </section>
        {/each}
    </div>
</Center>

<style>
    span {
        border: 2px solid red;
    }
    section {
        border: 2px solid blue;
        padding: 0.5rem;
    }
    div {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(10, 1fr);
        gap: 1rem;
        /* height: var(--h);
        width: var(--w); */
    }
</style>
