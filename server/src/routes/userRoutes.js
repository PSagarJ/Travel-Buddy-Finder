import express from 'express';
import { registerUser } from '../controllers/userController.js';

const router = express.Router();

// When a POST request hits /register, run the registerUser function
router.post('/register', registerUser);

export default router;