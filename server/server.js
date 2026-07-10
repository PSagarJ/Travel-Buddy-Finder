import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; 
import { Server } from 'socket.io'; 

// Import Routes
import userRoutes from './src/routes/userRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
import expenseRoutes from './src/routes/expenseRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import router from './src/routes/userRoutes.js';

dotenv.config();

const app = express();

// --- 1. GLOBAL MIDDLEWARES ---
app.use(express.json()); // Essential for reading req.body
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-new-frontend.onrender.com'],
  credentials: true
}));         // Essential for cross-origin frontend requests

// --- 2. WRAP EXPRESS WITH HTTP SERVER FOR SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

// --- 3. API ROUTES ---
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/expenses', expenseRoutes);

// --- 4. SOCKET.IO CHAT LOGIC ---
io.on('connection', (socket) => {
  console.log(`🔌 New User Connected: ${socket.id}`);

  socket.on('join_trip_room', (tripId) => {
    socket.join(tripId);
    console.log(`User ${socket.id} joined Trip Room: ${tripId}`);
  });

  socket.on('send_message', (messageData) => {
    socket.to(messageData.tripId).emit('receive_message', messageData);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
  });
});

// --- 5. DATABASE & SERVER BOOTUP ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully! 🚀');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log('❌ Database connection error:', err));

