import { browser } from '$app/environment';
import { writable, get, type Writable, type Updater } from "svelte/store";
import { io } from "socket.io-client";

const socket = io();

export function fancy<T extends Object>(value: T): Writable<T> {
    const name = value.constructor.name
    let realValue: T = value

    if (browser) {
        const json = window.localStorage.getItem(name)

        if(json) {
            realValue = JSON.parse(json);
        }
    }

    const { subscribe, set: sset, update: supdate } = writable<T>(realValue)

    return {
        subscribe,
        set: (value: T) => {
            const json = JSON.stringify(value)
            const name = value.constructor.name

            socket.emit(name, json)

            if (browser) {
                window.localStorage.setItem(name, json)
            }

            sset(value)
        },

        update: (updater: Updater<T>) => {
            function wrapper(value: T): T {
                const newValue = updater(value)
                const json = JSON.stringify(newValue)
                const name = newValue.constructor.name

                socket.emit(name, json)

                if (browser) {
                    window.localStorage.setItem(name, json)
                }

                return newValue
            }

            supdate(wrapper)
        },
    }
}


// socket.on("index", (raw: string) => {
//     // console.log(`raw: ${raw}`);
//     const message: SlideMessage = JSON.parse(raw);
//     console.log(`received: ${JSON.stringify(message)}`);
//     index.set(message.index)
// });