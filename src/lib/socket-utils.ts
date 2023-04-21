import { io } from "socket.io-client";
import { type Writable, get } from "svelte/store";

const socket = io();

interface Options {
    prefix?: boolean;
    debug?: boolean;
    space?: number;
}

let currentTime: number = 0;

class Wrapper<T extends Object> {
    time: number;
    event: string;
    obj: T;

    constructor(obj: T, time: number) {
        this.obj = obj;
        this.event = obj.constructor.name;
        this.time = time;
    }
}

function sender<T extends Object>(store: Writable<T>, options?: Options) {
    store.subscribe((obj: T) => {
        if (!obj && options?.debug)
            console.warn("socket-utils.send: no object");

        const wrapper = new Wrapper<T>(obj, Date.now());
        const raw = JSON.stringify(wrapper, null, options?.space);

        if (wrapper.event == "Object") {
            return;
        }

        if (options?.debug)
            console.info(`socket-utils.send[${wrapper.event}]: ${raw}`);

        socket.emit(wrapper.event, raw);
    });
}

function receiver<T extends Object>(store: Writable<T>, options?: Options) {
    const obj = get<T>(store);
    const wrapper = new Wrapper<T>(obj, 0);
    const event = obj.constructor.name;

    socket.on(event, (raw: string) => {
        if (options?.debug) console.debug(`socket-utils.receive: ${raw}`);
        if (event === "Object") return;

        const json = JSON.parse(raw);
        Object.assign(wrapper, json);
        const rawObj = JSON.stringify(wrapper.obj, null, options?.space);
        const rawCurrent = JSON.stringify(get(store), null, options?.space);

        if (wrapper.time < currentTime) return;
        if (rawCurrent === rawObj) return;

        if (options?.debug)
            console.log(`socket-utils.receive[${event}]: ${rawObj}`);

        store.set(wrapper.obj);
    });
}

function configure<T extends Object>(store: Writable<T>, options?: Options) {
    sender<T>(store, options)
    receiver<T>(store, options)
}

export { configure, sender, receiver };
