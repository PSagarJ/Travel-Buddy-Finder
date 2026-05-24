import express from 'express';
import { createTrip } from '../controllers/tripController.js';

const router = express.Router();

// When a POST request hits this route, create the trip
router.post('/', createTrip);

export default router;