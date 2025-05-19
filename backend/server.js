const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/mentees', require('./routes/mentees'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/messages', require('./routes/messages'));

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'ConnectEd API - Welcome to the mentorship platform API' });
});

// Error handler middleware
app.use(errorHandler);

// Set static folder in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../Frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../Frontend', 'build', 'index.html'));
  });
}

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join a room (conversation)
  socket.on('join', (conversationId) => {
    socket.join(conversationId);
  });

  // Listen for new messages
  socket.on('sendMessage', (message) => {
    io.to(message.conversationId).emit('message', message);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.conversationId).emit('typing', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});