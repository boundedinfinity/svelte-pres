import { browser } from "$app/environment";
import { type Writable, get } from "svelte/store";

interface Options<T> {
    prefix?: boolean;
    debug?: boolean;
    space?: number;
    saveFilter?: (obj:T) => boolean
    loadFilter?: (obj:T) => boolean
}

function saver<T extends Object>(store: Writable<T>, options?: Options<T>) {
    if (!store) return;

    store.subscribe((obj: T) => {
        if (!(browser && window && window.localStorage)) {
            return;
        }

        if (!obj) {
            console.warn(`local-storage-utils.save: no object`);
            return;
        }

        if(options?.saveFilter && options.saveFilter(obj)) return

        const key = obj.constructor.name;
        const raw = JSON.stringify(obj, null, options?.space);

        if (key === "Object") {
            // console.warn(`local-storage-utils.save[NO TYPE]: ${raw}`);
            return;
        }

        if (options?.debug)
            console.info(`local-storage-utils.save[${key}]:  ${raw}`);

        window.localStorage.setItem(key, raw);
    });
}

function loader<T extends Object>(store: Writable<T>, options?: Options<T>) {
    if (!store) {
        if (options?.debug) console.warn(`local-storage-utils.load: no store`);
        return;
    }

    if (!(browser && window && window.localStorage)) {
        if (options?.debug)
            console.warn(`local-storage-utils.load: not in browser`);
        return;
    }

    const obj = get(store);
    const key = obj.constructor.name;
    const raw = window.localStorage.getItem(key);

    if (!raw) return;
    if (JSON.stringify(obj) === raw) return;
    if (options?.debug)
        console.info(`local-storage-utils.load[${key}]: ${raw}`);

    const loaded = JSON.parse(raw!);
    Object.assign(obj, loaded);

    if(options?.loadFilter && options.loadFilter(obj)) return

    store.set(obj);
}

function clear<T extends Object>(obj: T, options?: Options<T>) {
    if (!(browser && window && window.localStorage)) {
        if (options?.debug)
            console.warn(`local-storage-utils.clear: not in browser`);
        return;
    }

    const key = obj.constructor.name;

    if (options?.debug)
        console.info(`local-storage-utils.clear${key}: clearning`);

    window.localStorage.removeItem(key);
}

function reset<T extends Object>(obj: T, options?: Options<T>) {
    if (!(browser && window && window.localStorage)) {
        if (options?.debug)
            console.warn(`local-storage-utils.clear: not in browser`);
        return;
    }

    const key = obj.constructor.name;
    const raw = JSON.stringify(obj, null, options?.space);

    if (key === "Object") {
        // console.warn(`local-storage-utils.save[NO TYPE]: ${raw}`);
        return;
    }

    if (options?.debug)
        console.info(`local-storage-utils.save[${key}]:  ${raw}`);

    window.localStorage.setItem(key, raw);
}

function configure<T extends Object>(store: Writable<T>, options?: Options<T>) {
    loader<T>(store, options);
    saver<T>(store, options);
}

export { configure, saver, loader, clear, reset };
