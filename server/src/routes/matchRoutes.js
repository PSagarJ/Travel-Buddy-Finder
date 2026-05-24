import express from 'express';
import { getTopMatches } from '../controllers/matchController.js';

const router = express.Router();

// GET /api/matches/:userId
router.get('/:userId', getTopMatches);

export default router;