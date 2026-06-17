import express from 'express';
// 💥 Import our new getTripById function
import { createTrip, getAllTrips, getTripById, updateApplicationStatus, applyForTrip, getUserTrips } from '../controllers/tripController.js'; 

const router = express.Router();

// GET all trips
router.get('/', getAllTrips);

// 💥 NEW: Fetch trips for a specific user
router.get('/user/:userId', getUserTrips);

// 💥 GET a single trip by its ID (must come AFTER the '/' route)
router.get('/:id', getTripById);

// POST a new trip
router.post('/', createTrip);

// 💥 NEW: PUT route for updating application statuses
router.put('/:id/status', updateApplicationStatus);

// 💥 NEW: POST route for applying to a trip
router.post('/:id/apply', applyForTrip);

export default router;