import { Server } from 'socket.io'

export const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server) {
        console.log('websocket server starting...')
        const io = new Server(server.httpServer)

        io.on('connection', (socket) => {
            socket.broadcast.emit("message", 'websocket server connected');
            console.log('websocket client connected')

            socket.on('message', (message) => {
                socket.broadcast.emit("message", message);
            });
        });
    }
};
