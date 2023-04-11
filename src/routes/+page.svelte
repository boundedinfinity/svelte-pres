<script lang="ts">
    import {io} from 'socket.io-client'
    import {onMount} from 'svelte'

    const socket = io({
        host: "http://localhost:5173"
    } )
    socket.on('message', (message) => {
        console.log(message)
    })
</script>
Nothing here.
