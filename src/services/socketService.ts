import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { GetUsername } from '../utils/usernameGenerator.js';

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

    socket.on("assigned_username",(name:string)=>{
      if(name.length>0){
        socket.data.username = name
      } else {
        const username = GetUsername();
        socket.emit("assigned_name", username);
      }
    })


    socket.on('join-game', (gameId: string) => {
      socket.join(gameId);
      console.log(`User ${socket.data.username} joined room: ${gameId}`);
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