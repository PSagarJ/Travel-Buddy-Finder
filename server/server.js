import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; // <-- NEW: Built-in Node module
import { Server } from 'socket.io'; // <-- NEW: Socket.io

// Import Routes
import userRoutes from './src/routes/userRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
import expenseRoutes from './src/routes/expenseRoutes.js';

dotenv.config();

const app = express();

// --- NEW: Wrap Express with HTTP Server for Socket.io ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow your Vite React app to connect
    methods: ["GET", "POST"]
  }
});
// --------------------------------------------------------

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/expenses', expenseRoutes);

// --- NEW: Socket.io Logic (The Chat Engine) ---
io.on('connection', (socket) => {
  console.log(`🔌 New User Connected: ${socket.id}`);

  // When a user opens a specific trip chat
  socket.on('join_trip_room', (tripId) => {
    socket.join(tripId);
    console.log(`User ${socket.id} joined Trip Room: ${tripId}`);
  });

  // When a user hits "send" on a message
  socket.on('send_message', (messageData) => {
    // Blast the message to everyone ELSE in that specific trip room
    socket.to(messageData.tripId).emit('receive_message', messageData);
  });

  // When a user closes the browser
  socket.on('disconnect', () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
  });
});
// ----------------------------------------------

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    // Important: We use server.listen now, NOT app.listen
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));