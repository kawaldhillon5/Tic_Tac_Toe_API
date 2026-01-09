import express, {type Application, type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Tic-Tac-Toe Server is Running!');
});

app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});