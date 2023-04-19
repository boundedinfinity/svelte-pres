// https://stackoverflow.com/questions/68060723/glob-import-of-image-urls-in-sveltekit
// https://vitejs.dev/guide/features.html#glob-import
// https://svelte.dev/tutorial/svelte-component
// https://svelte.dev/docs#template-syntax-svelte-component

import p from "path-browserify";
import { browser } from '$app/environment';
import { writable, get } from "svelte/store";
import { io } from "socket.io-client";

const modules = import.meta.glob("../routes/slides/**/*.svelte", { eager: true });
// const modules = import.meta.glob("../routes/**/+page.svelte", { eager: true });
// const modules = import.meta.glob("./*.svelte", { eager: true });
const socket = io();
const slides = writable<SlideInfo[]>([])
const viewerNav = writable<boolean>(true)

function safeIndex(i: number): number {
    const l = get(slides).length - 1
    let v = i
    if (v > l) v = l
    if (v < 0) v = 0
    // console.log(`i: ${i}, l: ${l}, v: ${v}`)
    return v
}

function createIndex() {
    let initial = 0

    if (browser) {
        try {
            const raw = window.localStorage.getItem('index')
            initial = raw ? Number.parseFloat(raw) : 0
            initial = safeIndex(initial)
        } catch (e) { }
    }

    const { subscribe, set, update } = writable<number>(initial)

    return {
        subscribe,
        set,
        update,
        next: () => update(i => safeIndex(i + 1)),
        prev: () => update(i => safeIndex(i - 1))
    }
}

const index = createIndex()

index.subscribe(value => {
    const message: SlideMessage = { index: value }
    const raw = JSON.stringify(message)
    // console.log(`sending: ${raw}`)
    socket.emit("index", raw);

    if (browser) {
        window.localStorage.setItem("index", value.toString())
    }
})

socket.on("index", (raw: string) => {
    // console.log(`raw: ${raw}`);
    const message: SlideMessage = JSON.parse(raw);
    console.log(`received: ${JSON.stringify(message)}`);
    index.set(message.index)
});

class MessageTest1 {
    x: number
    constructor(x: number) {
        this.x = x
    }
}

class MessageTest2 {
    y: number
    constructor(y: number) {
        this.y = y
    }
}

export interface SlideMessage {
    index: number;
}

export interface SlideInfo {
    path: string,
    title: string,
    component: any,
}

Object.entries(modules).forEach(([path, module]: any) => {
    const slide: SlideInfo = {
        path: path,
        title: module.meta?.title || p.basename(path).replace(p.extname(path), ""),
        component: module.default,
    }

    slides.update(slides => [...slides, slide])
});

export {
    slides,
    index,
    viewerNav
}

