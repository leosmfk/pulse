# Heart Rate Monitor Dashboard

Real-time heart rate monitoring dashboard with Node.js backend and React frontend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Redis server (local installation)

### Setup Instructions

1. **Start Redis Server**
   ```bash
   # On macOS with Homebrew
   brew services start redis
   
   # Or manually
   redis-server
   ```

2. **Start Backend Server**
   ```bash
   cd heart-monitor-backend
   npm start
   ```
   Backend will run on `http://localhost:3000`

3. **Start Frontend Dashboard**
   ```bash
   cd heart-monitor-dashboard
   npm start
   ```
   Dashboard will open at `http://localhost:3001`

## 🧪 Testing the System

### Option 1: Test Data Simulator
Run the built-in simulator to generate realistic heart rate data:
```bash
cd heart-monitor-backend
node test-data.js
```
This will send heart rate data every 2 seconds to test the real-time dashboard.

### Option 2: Manual API Testing
Send heart rate data manually using curl:
```bash
curl -X POST http://localhost:3000/api/heartrate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "bpm": 75,
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'"
  }'
```

### Option 3: Swift iOS App
Use your Swift app to send real heart rate data to `http://localhost:3000/api/heartrate`

## 📊 Dashboard Features

- **Real-time Heart Rate Chart** - Shows last 5 minutes of data
- **Animated Heart Display** - Heart icon beats at actual BPM rate
- **Status Indicator** - Shows "Seguro" status
- **Connection Status** - Real-time connection indicator
- **Heart Rate Categories** - Visual indicators for different HR zones

## 🔧 API Endpoints

- `POST /api/heartrate` - Send heart rate data
- `GET /api/heartrate/:userId` - Get recent heart rate data
- `GET /api/health` - Health check endpoint

## 🌟 System Architecture

```
iOS App → Node.js Backend → Redis → WebSocket → React Dashboard
```

The system uses WebSocket connections for real-time updates, ensuring the dashboard reflects heart rate changes immediately. 