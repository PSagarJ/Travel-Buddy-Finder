import express from 'express';
import { 
  createTrip, 
  getAllTrips, 
  getTripById, 
  updateApplicationStatus, 
  applyForTrip, 
  getUserTrips,
  deleteTrip // 💥 FIXED: Cleanly added deleteTrip here without duplicates
} from '../controllers/tripController.js';

const router = express.Router();

// Existing core route endpoints
router.post('/', createTrip);
router.get('/', getAllTrips);
router.get('/:id', getTripById);
router.get('/user/:userId', getUserTrips);
router.post('/:id/apply', applyForTrip);
router.put('/:id/status', updateApplicationStatus);

// 💥 NEW: Secure deletion route endpoint
router.delete('/:id', deleteTrip);

export default router;