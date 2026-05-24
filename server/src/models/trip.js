import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    // Budget & Matchmaking features
    estimatedBudget: {
      type: Number,
      required: true,
    },
    travelStyle: {
      type: String,
      enum: ['Backpacker', 'Luxury', 'Budget', 'Adventure', 'Chill'],
      required: true,
    },
    targetVibe: {
      type: String, // e.g., "Party", "Nature & Hiking", "Historical", "Foodie"
      required: true,
    },
    // Relational Data: Linking Users to Trips
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    status: {
      type: String,
      enum: ['Planning', 'Ongoing', 'Completed'],
      default: 'Planning',
    }
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;