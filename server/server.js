import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js'; // <-- NEW IMPORT
import tripRoutes from './src/routes/tripRoutes.js'; // <-- NEW IMPORT
import matchRoutes from './src/routes/matchRoutes.js';

// Load environment variables from the .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middlewares
app.use(cors()); // Allows your frontend to talk to your backend
app.use(express.json()); // Allows your server to accept JSON data

app.use('/api/users',userRoutes);
app.use('/api/trips', tripRoutes); // <-- NEW CONNECTION
app.use('/api/matches', matchRoutes); // <-- NEW CONNECTION

// A simple test route
app.get('/', (req, res) => {
  res.send('Travel Buddy API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});