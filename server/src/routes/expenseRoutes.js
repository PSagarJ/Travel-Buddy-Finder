import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// GET: Fetch all expenses for a specific trip
router.get('/:tripId', async (req, res) => {
  try {
    // FIXED: Changed req.req.params to req.params
    const expenses = await Expense.find({ tripId: req.params.tripId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
  }
});

// POST: Add a new expense to a trip
router.post('/:tripId', async (req, res) => {
  try {
    const newExpense = new Expense({
      tripId: req.params.tripId,
      description: req.body.description,
      amount: req.body.amount,
      paidBy: req.body.paidBy
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: 'Failed to save expense', error: error.message });
  }
});

export default router;