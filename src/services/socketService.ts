import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initSocket = (httpServer: HttpServer, origin: string) => {
  io = new Server(httpServer, {
    cors: {
      origin: origin,
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-game', (gameId: string) => {
      socket.join(gameId);
      console.log(`User ${socket.id} joined room: ${gameId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};