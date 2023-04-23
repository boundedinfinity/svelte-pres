<script lang="ts">
    import {
        allModules,
        currentModule,
        ModuleDescriptor,
    } from "$lib/module-util";

    import { goto } from "$app/navigation";

    function setModule(module: ModuleDescriptor, path: string) {
        $currentModule = module;
        goto(path)
    }
</script>

<ul>
    {#each $allModules as module}
        <li>
            <div>
                <h3>{module.title}</h3>
                <ul>
                    <li>Path: {module.path}</li>
                    <li>
                        <button on:click={() => setModule(module, "/viewer")}>
                            Viewer</button
                        >
                    </li>
                    <li>
                        <button on:click={() => setModule(module, "/presenter")}
                            >Presenter</button
                        >
                    </li>
                </ul>
            </div>
        </li>
    {/each}
</ul>
