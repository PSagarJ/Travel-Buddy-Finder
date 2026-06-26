import express from 'express';
import { addExpense, getTripExpenses } from '../controllers/expenseController.js';

const router = express.Router();

// 💥 POST requests to http://localhost:5000/api/expenses
router.post('/', addExpense);

// 💥 GET requests to http://localhost:5000/api/expenses/:tripId
router.get('/:tripId', getTripExpenses);

// 🚨 THIS IS WHERE THE EXPORT BELONGS!
export default router;