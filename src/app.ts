import express, {type Application} from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';

import gameRoutes from './routes/gameRoutes.js'

dotenv.config();



const app: Application = express();
const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN

const httpServer  = createServer(app)
const io = new Server(httpServer,{
  cors: {
    origin: ORIGIN, 
    methods: ["GET", "POST"]
  }
})

app.use(cors({
  origin: ORIGIN
}));
app.use(express.json());

io.on('connection', (socket) => {
  console.log('user connected:', socket.id);

  socket.on('join-game', (gameId: string) => {
    socket.join(gameId);
    console.log(`User ${socket.id} joined room: ${gameId}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use('/api/game', gameRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { io };