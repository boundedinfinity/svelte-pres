import { writable } from "svelte/store";
import { dumper } from "$lib/util";
import _ from "lodash";

class SlideDescriptor {
    title: string;
    index: number;

    constructor(title: string, index: number) {
        this.title = title;
        this.index = index;
    }
}

class DeckDescriptor {
    slides: SlideDescriptor[] = [];
    index: number = -1;
    debug: boolean = true;

    constructor() { }

    add(slide: SlideDescriptor): DeckDescriptor {
        this.slides = _.uniqBy([...this.slides, slide], (s) => s.index)
        dumper.debug(this.slides);
        this.index = 0;
        return this;
    }

    next(): DeckDescriptor {
        dumper.debug(`prev: ${this.index} --> ${this.index + 1}`)
        this.index++
        this.normalize()
        return this
    }

    prev(): DeckDescriptor {
        dumper.debug(`prev: ${this.index} --> ${this.index - 1}`)
        this.index--
        this.normalize()
        return this
    }

    goto(index: number): DeckDescriptor {
        dumper.debug(`goto: ${this.index} --> ${index}`)
        this.index = index
        this.normalize()
        return this
    }

    private normalize() {
        if (this.index > this.slides.length - 1) this.index = this.slides.length - 1
        if (this.index < 0) this.index = 0
    }
}

function createDeck() {
    const { subscribe, set, update } = writable<DeckDescriptor>(
        new DeckDescriptor()
    );

    return {
        subscribe,
        set,
        add: (slide: SlideDescriptor) => update((d) => d.add(slide)),
        goto: (index: number) => update(d => d.goto(index)),
        next: () => update(d => d.next()),
        prev: () => update(d => d.prev()),
    };
}

const deck = createDeck();

export { deck, SlideDescriptor };
