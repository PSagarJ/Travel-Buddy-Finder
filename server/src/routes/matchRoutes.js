import express from 'express';
import { getTopMatches } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/matches/:userId
router.get('/:userId', protect, getTopMatches);

export default router;