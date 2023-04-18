<script lang="ts">
    import { dump } from "$lib/util";
    export let blank: string = "_";
    export let pattern: string;
    export let outlined: boolean = true;

    let symbols: string[] = [];
    let current = "";

    // console.log(pattern)

    for (let i = 0; i < pattern.trim().length; i++) {
        switch (pattern[i]) {
            case "[":
                symbols.push(current);
                current = ''
                break;
            case "]":
                break;
            default:
                current += pattern[i]
        }
    }

    if(current) symbols.push(current)
    symbols = symbols.filter(s => s != blank)

    dump(symbols)
</script>

<section class:outlined={outlined && symbols && symbols.length > 0}>
    {symbols.join('-')}
</section>

<style>
    section {
        padding-inline: 1rem;
        padding-block: .5rem;
        display: grid;
        justify-content: center;
        align-content: center;
    }

    .outlined {
        border: 2px solid blue;
    }
</style>
