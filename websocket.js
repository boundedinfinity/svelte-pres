import { Server } from 'socket.io'

const debug = true

export const webSocketServer = {
    name: 'webSocketServer',
    // @ts-ignore
    configureServer(server) {
        console.log('websocket server starting...')
        const io = new Server(server.httpServer)

        io.on('connection', (socket) => {
            console.info("server.on[connection]: connected")

            socket.onAny((event, message) => {
                if (debug) console.info(`server.on[${event}] ${message}`)
                socket.broadcast.emit(event, message);
            })

            socket.on("disconnect", () => {
                console.info("server.on[disconnect]: disconnected")
            })
        });
    }
};
