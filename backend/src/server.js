require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path'); 
const { Server } = require('socket.io');

const queueRoutes = require('./routes/queueRoutes');
const authRoutes = require('./routes/authRoutes');
const socketService = require('./services/socketService');

// 1. Create the App
const app = express();

// 2. Create the HTTP Server (MUST BE BEFORE SOCKET.IO)
const server = http.createServer(app);

// 3. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

// 4. Configure Socket Service
socketService.setIo(io);
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socketService.registerSocket(socket);
});

// 5. Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled briefly to allow local scripts/images if needed
  })
);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. API Routes
// Note: These must come BEFORE the static files/catch-all route
app.use('/api/queue', queueRoutes);
app.use('/api/auth', authRoutes);


// 7. DEPLOYMENT: Serve Frontend Static Files
// Serve the static files from the React app build folder
app.use(express.static(path.join(__dirname, '../dist')));

// The "Catch-All" Handler:
// For any request that doesn't match an API route (above),
// send back the React index.html file. This lets React Router handle the page.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// ---------------------------------------------------------

// 8. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local Access: http://localhost:${PORT}`);
});