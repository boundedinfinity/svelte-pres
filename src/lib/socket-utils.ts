import { io } from "socket.io-client";
import { type Writable, get } from "svelte/store";
import { Dumper } from '$lib/util'

const socket = io();
const dumper = new Dumper({ prefix: 'socket-utils' })

interface Options<T> {
    prefix?: boolean;
    debug?: boolean;
    space?: number;
    sendFilter?: (obj: T) => boolean
    receiveFilter?: (obj: T) => boolean
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


function sender<T extends Object>(store: Writable<T>, options?: Options<T>) {
    const method = "sender<T>"
    
    if (!store) {
        dumper.error("cannot initialize without a valid store", { method })
        throw new Error("cannot initialize without a valid store")
    }

    store.subscribe((obj: T) => {
        if (!obj?.constructor?.name) {
            dumper.debug("no object", { method })
            return
        }

        const wrapper = new Wrapper<T>(obj, Date.now());
        const raw = JSON.stringify(wrapper, null, options?.space);

        if (wrapper.event == "Object") {
            return;
        }

        if (options?.sendFilter && options.sendFilter(obj)) {
            return
        }

        dumper.debug(raw, { method, name: `[${wrapper.event}]` })
        socket.emit(wrapper.event, raw);
    });
}

class Factory {
    create<T>(type: (new () => T)): T {
        return new type()
    }
}


function receiver<T extends Object>(store: Writable<T>, options?: Options<T>) {
    const method = "receiver<T>"

    if (!store) {
        dumper.error("cannot initialize without a valid store", { method })
        throw new Error("cannot initialize without a valid store")
    }

    const obj = get<T>(store);

    if (!obj) {
        dumper.error("cannot initialize without a valid instance of T", { method })
        throw new Error("cannot initialize without a valid instance of T")
    }

    const wrapper = new Wrapper<T>(obj, 0);
    const event = obj.constructor.name;

    socket.on(event, (raw: string) => {
        if (options?.debug) console.debug(`socket-utils.receive: ${raw}`);
        if (event === "Object") return;
        if (!raw) return

        const json = JSON.parse(raw);
        Object.assign(wrapper, json);
        const rawObj = JSON.stringify(wrapper.obj, null, options?.space);
        const rawCurrent = JSON.stringify(get(store), null, options?.space);

        if (wrapper.time < currentTime) return;
        if (rawCurrent === rawObj) return;

        if (options?.receiveFilter && options.receiveFilter(obj)) {
            return
        }

        if (options?.debug)
            console.log(`socket-utils.receive[${event}]: ${rawObj}`);

        store.set(wrapper.obj);
    });
}

function configure<T extends Object>(store: Writable<T>, options?: Options<T>) {
    sender<T>(store, options)
    receiver<T>(store, options)
}

export { configure, sender, receiver };
