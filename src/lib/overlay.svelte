<script lang="ts">
    export let debug: boolean = true;
  </script>
  
<main class:debug>
    <div class="navigation">
        nav
    </div>
</main>


<style>
  main {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .navigation {
    position: absolute;
  }


  .debug {
    border: 1px solid navy;
  }
</style>
