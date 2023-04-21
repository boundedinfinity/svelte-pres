import { browser } from "$app/environment";
import { type Writable, get } from "svelte/store";

interface Options {
    prefix?: boolean;
    debug?: boolean;
    space?: string;
}

function saver<T extends Object>(store: Writable<T>, options?: Options) {
    if (!store) return;

    store.subscribe((obj) => {
        if (!obj && options?.debug)
            console.warn("local-storage-utils.save: no object");

        if (browser && window && window.localStorage) {
            const key = obj.constructor.name;
            const raw = JSON.stringify(obj, null);

            if (options?.debug)
                console.info(`local-storage-utils.save.[${key}]:  ${raw}`);

            window.localStorage.setItem(key, raw);
        }
    });
}

function loader<T extends Object>(store: Writable<T>, options?: Options) {
    if (!store) return;
    if (!browser) return;

    const obj = get(store);
    const key = obj.constructor.name;
    const raw = window.localStorage.getItem(key);

    if (!raw) return;
    if (JSON.stringify(obj) === raw) return;
    if (options?.debug)
        console.warn(`local-storage-utils.load[${key}]: ${raw}`);

    const loaded = JSON.parse(raw!);
    Object.assign(obj, loaded);
    store.set(loaded);
}

export { saver, loader };
