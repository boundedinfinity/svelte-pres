// https://stackoverflow.com/questions/68060723/glob-import-of-image-urls-in-sveltekit
// https://vitejs.dev/guide/features.html#glob-import
// https://svelte.dev/tutorial/svelte-component
// https://svelte.dev/docs#template-syntax-svelte-component

import p from "path-browserify";
import { writable } from "svelte/store";
const modules = import.meta.glob("../routes/slides/**/*.svelte", { eager: true });
// const modules = import.meta.glob("../routes/**/+page.svelte", { eager: true });
// const modules = import.meta.glob("./*.svelte", { eager: true });

export interface SlideInfo {
    path: string,
    title: string,
    component: any,
}

const slides = writable<SlideInfo[]>([])
const index = writable(0)

Object.entries(modules).forEach(([path, module]: any) => {
    const slide:SlideInfo = {
        path: path,
        title: module.meta?.title || p.basename(path).replace(p.extname(path), ""),
        component: module.default,
    }
    
    slides.update(slides => [...slides, slide])
});

export {
    slides,
    index
}

