// https://stackoverflow.com/questions/68060723/glob-import-of-image-urls-in-sveltekit
// https://vitejs.dev/guide/features.html#glob-import
// https://svelte.dev/tutorial/svelte-component
// https://svelte.dev/docs#template-syntax-svelte-component

import p from "path-browserify";
import { browser } from "$app/environment";
import { writable, get } from "svelte/store";
import { sender, receiver } from "$lib/socket-utils";
import { saver, loader } from "$lib/local-storage-utils";

const debug = false;

const modules = import.meta.glob("../routes/slides/**/*.svelte", {
    eager: true,
});
// const modules = import.meta.glob("../routes/**/+page.svelte", { eager: true });
// const modules = import.meta.glob("./*.svelte", { eager: true });



export class SlideState {
    index: number;
    max: number;

    constructor() {
        this.index = 0
        this.max = 0
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
        if(this.index > this.max) this.index = this.max
        if(this.index < 0) this.index = 0
    }
}

const slides = writable<SlideInfo[]>([]);
const viewerNav = writable<boolean>(true);
const slideStateStore = writable<SlideState>(new SlideState())

sender<SlideState>(slideStateStore, { debug: true });
receiver<SlideState>(slideStateStore, { debug: true });
saver<SlideState>(slideStateStore, { debug: true });
loader<SlideState>(slideStateStore, { debug: true });

Object.entries(modules).forEach(([path, module]: any) => {
    const slide: SlideInfo = {
        path: path,
        title:
            module.meta?.title || p.basename(path).replace(p.extname(path), ""),
        component: module.default,
    };

    slides.update((slides) => {
        slideStateStore.update(s => {
            s.max  = slides.length - 1
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

export { slides, slideStateStore, viewerNav };
