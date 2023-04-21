import { writable } from "svelte/store";
import { sender, receiver } from "$lib/socket-utils";
import { saver, loader } from "$lib/local-storage-utils";

class NavState {
    visible: boolean;
    scale: number;
    opacity: number;
    debug: boolean;

    constructor() {
        this.visible = true;
        this.scale = 2;
        this.opacity = 30;
        this.debug = true;
    }
}

const navStateStore = writable<NavState>(new NavState());

sender<NavState>(navStateStore, { debug: true });
receiver<NavState>(navStateStore, { debug: true });
saver<NavState>(navStateStore, { debug: true });
loader<NavState>(navStateStore, { debug: true });

export { type NavState, navStateStore };
