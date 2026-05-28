import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  // Which trip does this expense belong to?
  tripId: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  // Who actually paid for this?
  paidBy: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);