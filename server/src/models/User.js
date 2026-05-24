import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Trust & Safety Features
    isGovIdVerified: {
      type: Boolean,
      default: false, // Users start unverified
    },
    govIdUrl: {
      type: String, // Will hold the AWS S3 link later
    },
    // Matchmaking & Gamification Features
    travelStyle: {
      type: String,
      enum: ['Backpacker', 'Luxury', 'Budget', 'Adventure', 'Chill'],
      default: 'Chill',
    },
    vibeBadges: [
      {
        type: String, 
      }
    ]
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt dates
  }
);

const User = mongoose.model('User', userSchema);
export default User;