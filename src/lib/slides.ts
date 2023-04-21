// https://stackoverflow.com/questions/68060723/glob-import-of-image-urls-in-sveltekit
// https://vitejs.dev/guide/features.html#glob-import
// https://svelte.dev/tutorial/svelte-component
// https://svelte.dev/docs#template-syntax-svelte-component

import p from "path-browserify";
import { writable } from "svelte/store";
import { configure as sockerConfigure } from "$lib/socket-utils";
import { configure as storageConfigure } from "$lib/local-storage-utils";

const modules = import.meta.glob("../routes/slides/**/*.svelte", {
    eager: true,
});
// const modules = import.meta.glob("../routes/**/+page.svelte", { eager: true });
// const modules = import.meta.glob("./*.svelte", { eager: true });

class DeckState {
    count: number

    constructor(count: number) {
        this.count = count
    }
}

export class DeckLocationState {
    index: number;
    size: number;

    constructor() {
        this.index = 0
        this.size = 0
    }

    next() {
        this.index++
        this.normalize()
    }

    prev() {
        this.index--
        this.normalize()
    }

    goto(index: number) {
        this.index = index
        this.normalize()
    }

    private normalize() {
        if(this.index >= this.size) this.index = this.size - 1
        if(this.index < 0) this.index = 0
    }
}

const slides = writable<SlideInfo[]>([]);
const slideStateStore = writable<DeckLocationState>(new DeckLocationState())

Object.entries(modules).forEach(([path, module]: any) => {
    const slide: SlideInfo = {
        path: path,
        title:
            module.meta?.title || p.basename(path).replace(p.extname(path), ""),
        component: module.default,
    };

    slides.update((slides) => {
        slideStateStore.update(s => {
            s.size  = slides.length + 1
            return s
        })

        return [...slides, slide]
    });
    
});

export interface SlideInfo {
    path: string;
    title: string;
    component: any;
}

export { slides, slideStateStore };

sockerConfigure<DeckLocationState>(slideStateStore, { debug: false });
storageConfigure<DeckLocationState>(slideStateStore, { debug: true });
