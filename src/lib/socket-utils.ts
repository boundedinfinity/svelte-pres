import { io } from "socket.io-client";
import { type Writable, get } from "svelte/store";

const socket = io();

interface Options {
    prefix?: boolean;
    debug?: boolean;
    space?: string;
}

function sender<T extends Object>(store: Writable<T>, options?: Options) {
    store.subscribe((obj: T) => {
        if (!obj && options?.debug)
            console.warn("socket-utils.send: no object");
        const event = obj.constructor.name;
        const raw = JSON.stringify(obj, null, options?.space || "");
        if (options?.debug) console.info(`socket-utils.send[${event}]: ${raw}`);
        socket.emit(event, raw);
    });
}

function receiver<T extends Object>(store: Writable<T>, options?: Options) {
    const obj = get<T>(store);
    const event = obj.constructor.name;

    socket.on(event, (raw: string) => {
        const current = get(store);
        if (JSON.stringify(current) == raw) return;

        if (options?.debug)
            console.log(`socket-utils.receive[${event}]: ${raw}`);
        const json = JSON.parse(raw);
        Object.assign(obj, json);
        store.set(obj);
    });
}

export { sender, receiver };
