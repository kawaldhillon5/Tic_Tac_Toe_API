import { Router } from 'express';
import * as gameController from '../controllers/gameController.js';

const router = Router();

router.post('/move', gameController.handleMove);

export default router;