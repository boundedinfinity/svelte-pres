import { writable } from "svelte/store";
import { dumpl } from "$lib/util";
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

    constructor() {}

    add(slide: SlideDescriptor): DeckDescriptor {
        dumpl(this.slides);
        this.slides = _.uniqBy([...this.slides, slide], (s) => s.index)
        dumpl(this.slides);
        this.index = 0;
        return this;
    }
}

function createDesk() {
    const { subscribe, set, update } = writable<DeckDescriptor>(
        new DeckDescriptor()
    );

    return {
        subscribe,
        set,
        add: (slide: SlideDescriptor) => update((d) => d.add(slide)),
    };
}

const deck = createDesk();

export { deck, SlideDescriptor };
