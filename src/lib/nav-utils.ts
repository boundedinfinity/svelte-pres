import { writable } from "svelte/store";
import { configure as sockerConfigure } from "$lib/socket-utils";
import {
    configure as storageConfigure,
    clear as storageClear,
} from "$lib/local-storage-utils";

class NavPreferences {
    visible: boolean;
    scale: number;
    opacity: number;
    debug: boolean;

    constructor() {
        this.visible = true;
        this.scale = 2;
        this.opacity = 30;
        this.debug = false;
    }
}

const navPreferences = writable<NavPreferences>(new NavPreferences());

function clearStorage() {
    storageClear<NavPreferences>(new NavPreferences(), { debug: true });
}

export { type NavPreferences, navPreferences, clearStorage };

sockerConfigure<NavPreferences>(navPreferences, { debug: false });
storageConfigure<NavPreferences>(navPreferences, { debug: true });
