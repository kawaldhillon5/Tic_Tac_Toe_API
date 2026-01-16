import { Router } from 'express';
import * as gameController from '../controllers/gameController.js';

const router = Router();

router.get('/:id', gameController.handleGetGame)

router.post('/move', gameController.handleMove);
router.post('/create-game',gameController.handleFindGame)


export default router;