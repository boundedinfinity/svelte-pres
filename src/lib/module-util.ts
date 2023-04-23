// https://stackoverflow.com/questions/68060723/glob-import-of-image-urls-in-sveltekit
// https://vitejs.dev/guide/features.html#glob-import
// https://svelte.dev/tutorial/svelte-component
// https://svelte.dev/docs#template-syntax-svelte-component

import p from "path-browserify";
import { writable } from "svelte/store";

class ModuleMetaData {
    title?: string

    constructor() {
    }
}

class ModuleDescriptor {
    path: string;
    component: any;
    title: string;
    labels: string[] = []

    constructor(path: string, component: any, meta?: ModuleMetaData) {
        this.path = path
        this.title = meta?.title || p.basename(path).replace(p.extname(path), "")
        this.component = component
    }
}

const allModules = writable<ModuleDescriptor[]>([]);

const moduleRecords = import.meta.glob("../routes/slides/**/*.svelte", {
    eager: true,
});

const _allModules = Object.entries(moduleRecords).map(([path, module]: any) => {
    const meta = Object.assign(new ModuleMetaData(), module.meta)
    return new ModuleDescriptor(path, module.default, meta)
});

allModules.set(_allModules)

const currentModule = writable<ModuleDescriptor>();

export { allModules,  currentModule, ModuleMetaData, ModuleDescriptor};