import { writable, derived } from "svelte/store";
import { dumper } from "$lib/util";
import _ from "lodash";
import p from "path-browserify";
import { allModules } from '$lib/module-utils'
import { configure as socketConfigure } from "$lib/socket-utils";
import { configure as storageConfigure, } from "$lib/local-storage-utils";


class DeckDescriptor {
    path: string;
    title: string;
    labels?: string[]

    constructor(path?: string, title?: string, labels?: string[]) {
        this.path = path || '/'
        this.title = title || p.basename(this.path).replace(p.extname(this.path), "")
        this.labels = labels
    }
}

const allDecks = derived<typeof allModules, DeckDescriptor[]>(
    allModules, ($allModules): DeckDescriptor[] =>
    $allModules.map(module => new DeckDescriptor(module.path, module.meta?.title, module.meta?.labels))
)

const currentDeck = writable<DeckDescriptor>(new DeckDescriptor())

socketConfigure<DeckDescriptor>(currentDeck, { debug: false, sendFilter: obj => obj.path === '/'});
storageConfigure<DeckDescriptor>(currentDeck, { debug: true });

const deckComponent = derived<[typeof allModules, typeof currentDeck], any>(
    [allModules, currentDeck],
    ([$allModules, $currentDeck]) => {
        return $allModules.find(module => $currentDeck.path == module.path)?.component
    }
)

class SlideDescriptor {
    title: string;
    index: number;

    constructor(title: string, index: number) {
        this.title = title;
        this.index = index;
    }
}

class DeckController {
    slides: SlideDescriptor[] = [];
    index: number = -1;
    debug: boolean = true;

    constructor() { }

    add(slide: SlideDescriptor): DeckController {
        this.slides = _.uniqBy([...this.slides, slide], (s) => s.index)
        dumper.debug(this.slides);
        this.index = 0;
        return this;
    }

    next(): DeckController {
        dumper.debug(`prev: ${this.index} --> ${this.index + 1}`)
        this.index++
        this.normalize()
        return this
    }

    prev(): DeckController {
        dumper.debug(`prev: ${this.index} --> ${this.index - 1}`)
        this.index--
        this.normalize()
        return this
    }

    goto(index: number): DeckController {
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
    const { subscribe, set, update } = writable<DeckController>(
        new DeckController()
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

export { allDecks, deck, currentDeck, DeckDescriptor, SlideDescriptor, deckComponent };
