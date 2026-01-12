import { Router } from 'express';
import * as gameController from '../controllers/gameController.js';

const router = Router();

router.post('/move', gameController.handleMove);
router.post('/create-game',gameController.handleCreateGame)

export default router;