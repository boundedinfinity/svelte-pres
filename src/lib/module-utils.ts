// https://stackoverflow.com/questions/68060723/glob-import-of-image-urls-in-sveltekit
// https://vitejs.dev/guide/features.html#glob-import
// https://svelte.dev/tutorial/svelte-component
// https://svelte.dev/docs#template-syntax-svelte-component

import { readable } from "svelte/store";

class ModuleMetaData {
    title?: string
    labels?: string[]

    constructor() { }
}

class ModuleDescriptor {
    path: string;
    component: any;
    meta?: ModuleMetaData

    constructor(path: string, component: any, meta?: ModuleMetaData) {
        this.path = path
        // this.title = meta?.title || p.basename(path).replace(p.extname(path), "")
        this.component = component
        this.meta = meta
    }
}

const records = import.meta.glob("../routes/slides/**/*.svelte", {
    eager: true,
});

const _allDescriptors = Object.entries(records).map(([path, module]: any) => {
    const meta = Object.assign(new ModuleMetaData(), module.meta)
    return new ModuleDescriptor(path, module.default, meta)
});

const allModules = readable<ModuleDescriptor[]>(_allDescriptors);

export { allModules, ModuleMetaData, ModuleDescriptor };

