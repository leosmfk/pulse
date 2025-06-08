const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const redis = require('redis');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3001", "http://10.232.32.9:3001", "https://pulse-ten-cyan.vercel.app"],
    methods: ["GET", "POST"]
  }
});

// Redis client setup
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});

redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://10.232.32.9:3001', 'https://pulse-ten-cyan.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Store heart rate data (sliding window of 5 minutes)
const storeHeartRateData = async (userId, bpm, timestamp) => {
  try {
    const key = `heartrate:${userId}`;
    const dataPoint = JSON.stringify({ bpm, timestamp });
    
    // Add to sorted set with timestamp as score
    await redisClient.zAdd(key, { score: Date.parse(timestamp), value: dataPoint });
    
    // Keep only last 5 minutes of data
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    await redisClient.zRemRangeByScore(key, '-inf', fiveMinutesAgo);
    
    return true;
  } catch (error) {
    console.error('Error storing heart rate data:', error);
    return false;
  }
};

// Get recent heart rate data
const getRecentHeartRateData = async (userId) => {
  try {
    const key = `heartrate:${userId}`;
    const data = await redisClient.zRange(key, 0, -1);
    return data.map(item => JSON.parse(item));
  } catch (error) {
    console.error('Error retrieving heart rate data:', error);
    return [];
  }
};

// Add request logging middleware
app.use('/api/heartrate', (req, res, next) => {
  console.log(`🔥 DEBUG: Incoming ${req.method} request from ${req.ip} to ${req.originalUrl}`);
  console.log(`🔥 DEBUG: Headers:`, req.headers);
  console.log(`🔥 DEBUG: Body:`, req.body);
  next();
});

// API Routes
app.post('/api/heartrate', async (req, res) => {
  try {
    const { userId, bpm, timestamp } = req.body;
    
    if (!userId || !bpm || !timestamp) {
      console.log(`❌ ERROR: Missing required fields - userId: ${userId}, bpm: ${bpm}, timestamp: ${timestamp}`);
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Store in Redis
    const stored = await storeHeartRateData(userId, bpm, timestamp);
    
    if (stored) {
      // Broadcast to all connected clients
      io.emit('heartrate-update', { userId, bpm, timestamp });
      
      console.log(`Heart rate received: ${bpm} BPM for user ${userId}`);
      res.json({ success: true, message: 'Heart rate data stored successfully' });
    } else {
      res.status(500).json({ error: 'Failed to store heart rate data' });
    }
  } catch (error) {
    console.error('Error processing heart rate data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent data endpoint
app.get('/api/heartrate/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getRecentHeartRateData(userId);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error retrieving heart rate data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stop detection endpoint
app.post('/api/stop-detection', async (req, res) => {
  try {
    const { userId, timestamp } = req.body;
    
    console.log(`🛑 Detection stopped for user ${userId}`);
    
    // Broadcast stop signal to all connected clients
    io.emit('detection-stopped', { userId, timestamp });
    
    res.json({ success: true, message: 'Stop detection signal received' });
  } catch (error) {
    console.error('Error processing stop detection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
  
  // Send initial data when client connects
  socket.on('request-initial-data', async (userId) => {
    try {
      const data = await getRecentHeartRateData(userId || 'user123');
      socket.emit('initial-data', data);
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Heart Monitor Backend Server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
  console.log(`Server accessible at:`);
  console.log(`- http://localhost:${PORT}`);
  console.log(`- http://10.232.32.9:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await redisClient.quit();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 