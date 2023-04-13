import { Server } from 'socket.io'

export const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server) {
        console.log('websocket server starting...')
        const io = new Server(server.httpServer)

        io.on('connection', (socket) => {
            console.log("server: client connected")
            
            socket.onAny((event, message) => {
                socket.broadcast.emit(event, message);
            })

            socket.on("disconnect", () => {
                console.log("server: client disconnected")
            })
        });
    }
};
