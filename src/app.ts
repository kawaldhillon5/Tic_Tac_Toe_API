import express, {type Application} from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';

import gameRoutes from './routes/gameRoutes.js'
import { initSocket } from './services/socketService.js';

dotenv.config();



const app: Application = express();
const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN || ""

const httpServer  = createServer(app)


app.use(cors({
  origin: ORIGIN
}));
app.use(express.json());
initSocket(httpServer,ORIGIN)


app.use('/api/game', gameRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

