import { writable, derived, get } from "svelte/store";
import { Dumper } from "$lib/util";
import _ from "lodash";
import pathb from "path-browserify";
import { allModules } from '$lib/module-utils'
import { configure as socketConfigure } from "$lib/socket-utils";
import { configure as storageConfigure, } from "$lib/local-storage-utils";

const dumper = new Dumper({ prefix: 'deck-utils' })

class DeckDescriptor {
    path: string;
    title: string;
    labels?: string[]
    index: number;

    constructor(path?: string, title?: string, labels?: string[], index?: number) {
        this.path = path || '/'
        this.title = title || pathb.basename(this.path).replace(pathb.extname(this.path), "")
        this.labels = labels
        this.index = index || 0
    }
}

class SlideDescriptor {
    title: string;
    index: number;

    constructor(title: string, index: number) {
        this.title = title;
        this.index = index;
    }
}

const currentDeck = writable<DeckDescriptor>(new DeckDescriptor())
socketConfigure<DeckDescriptor>(currentDeck, { debug: false, sendFilter: obj => obj.path === '/' });
storageConfigure<DeckDescriptor>(currentDeck, { debug: true, saveFilter: obj => obj.path === '/' });

const allDescriptors = derived<typeof allModules, DeckDescriptor[]>(
    allModules, ($allModules): DeckDescriptor[] =>
    $allModules.map(module => new DeckDescriptor(module.path, module.meta?.title, module.meta?.labels))
)

const currentComponent = derived<[typeof allModules, typeof currentDeck], any | undefined>(
    [allModules, currentDeck],
    ([$allModules, $currentDeck]) => {
        const found = $allModules.find(module => $currentDeck.path == module.path)
        dumper.debug(found, { name: 'currentComponent' })
        return found?.component
    }
)

const slides = writable<SlideDescriptor[]>([])

function next() {
    currentDeck.update(d => {
        d.index++
        const len = get(slides).length
        if (d.index > len - 1) d.index = len - 1
        return d
    })
}

function prev() {
    currentDeck.update(d => {
        d.index--
        if (d.index < 0) d.index = 0
        return d
    })
}

export { allDescriptors, currentDeck, DeckDescriptor, SlideDescriptor, currentComponent, slides, next, prev };
