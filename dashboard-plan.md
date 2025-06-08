# Heart Rate Monitor Dashboard Plan

## 📱 Project Overview
Real-time heart rate monitoring dashboard that displays data from a Swift mobile app, featuring live visualization, current heart rate display, and a simple mocked status indicator.

## 🎯 Dashboard Requirements

### Core Features
1. **Real-time Heart Rate Graph** - Line chart showing heart rate data from the last few minutes
2. **Live Heart Rate Display** - Animated heart icon with current BPM value
3. **Status Indicator** - Simple mocked status always showing "Seguro"

## 🛠 Technology Stack Recommendations

### Frontend (Dashboard)
- **Framework**: **React.js** with TypeScript
  - Fast development, excellent real-time capabilities
  - Rich ecosystem for charts and animations
  - Great WebSocket support for live data
- **UI Library**: **Tailwind CSS** + **Framer Motion**
  - Clean, responsive design
  - Smooth animations for heart beat effect
- **Charting Library**: **Chart.js** or **Recharts**
  - Real-time chart updates
  - Smooth animations and customization

### Backend (Data Hub)
- **Runtime**: **Node.js** with **Express.js**
  - Fast WebSocket handling
  - Easy integration with mobile apps
  - Real-time data processing
- **Database**: **Redis** (local) for real-time data storage
  - Ultra-fast real-time data storage
  - Perfect for development and testing
- **Real-time Communication**: **Socket.io**
  - Bi-directional real-time communication
  - Works great in local development

### Mobile Integration
- **API**: RESTful API + WebSocket endpoints
- **Data Format**: JSON with timestamp and BPM value

## 🏗 System Architecture

```
┌─────────────────┐    HTTP/WS     ┌──────────────────┐    WebSocket    ┌─────────────────┐
│                 │   ──────────►  │                  │   ──────────►   │                 │
│   Swift App     │                │   Node.js API    │                 │  React Dashboard│
│   (iOS)         │   ◄──────────  │   + Socket.io    │   ◄──────────   │   (localhost)   │
│                 │                │   (localhost)    │                 │                 │
└─────────────────┘                └──────────────────┘                 └─────────────────┘
                                             │
                                             ▼
                                   ┌──────────────────┐
                                   │                  │
                                   │  Redis (Local)   │
                                   │                  │
                                   │                  │
                                   └──────────────────┘
```

## 📊 Dashboard Layout Design

### Main Container (Full Screen)
```
┌─────────────────────────────────────────────────────────────────┐
│                    Heart Rate Monitor                           │
│                                                                 │
│  ┌─────────────────────────────────┐  ┌─────────────────────┐   │
│  │                                 │  │                     │   │
│  │        Heart Rate Graph         │  │    ❤️  72 BPM      │   │
│  │     (Last 5 minutes)            │  │                     │   │
│  │                                 │  │     Status:         │   │
│  │  100 ┤                         │  │      Seguro         │   │
│  │   90 ┤     ╭─╮                 │  │                     │   │
│  │   80 ┤    ╱   ╲                │  │                     │   │
│  │   70 ┤ ╱─╱     ╲               │  │                     │   │
│  │   60 ┤╱         ╲─╲            │  │                     │   │
│  │   50 └─────────────────────────  │  │                     │   │
│  │      0   1   2   3   4   5min   │  │                     │   │
│  └─────────────────────────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Implementation Details

### Data Flow
1. **Swift App** collects heart rate data from HealthKit
2. **HTTP POST** sends data to local Node.js API every 1-2 seconds
3. **Redis** stores latest readings (5-minute sliding window)
4. **Socket.io** broadcasts new data to connected dashboards
5. **React Dashboard** receives real-time updates and renders

### API Endpoints
```javascript
// Send heart rate data
POST /api/heartrate
{
  "userId": "user123",
  "bpm": 72,
  "timestamp": "2024-01-15T10:30:00Z"
}

// WebSocket events
Socket Events:
- 'heartrate-update' → New BPM data
```

### Status Logic
- **Status**: Always displays "Seguro" (mocked/static value)
- No dynamic status calculation needed
- Simple hardcoded string in the frontend component

## 📱 Swift App Integration

### Required Changes to Swift App
```swift
// Add HTTP client for API calls (local development)
func sendHeartRateData(bpm: Int) {
    let url = URL(string: "http://localhost:3000/api/heartrate")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let data = [
        "userId": "user123",
        "bpm": bpm,
        "timestamp": ISO8601DateFormatter().string(from: Date())
    ]
    
    request.httpBody = try? JSONSerialization.data(withJSONObject: data)
    
    URLSession.shared.dataTask(with: request) { _, _, _ in
        // Handle response
    }.resume()
}
```

## 🚀 Development Phases

### Phase 1: Backend Setup (Week 1)
- Set up Node.js server with Express locally
- Install and configure Redis locally
- Create WebSocket endpoints with Socket.io
- Basic API endpoints for heart rate data
- Test with sample data

### Phase 2: Frontend Development (Week 2)
- React app setup with TypeScript
- Real-time chart implementation
- Heart rate display with animation
- Simple status component (hardcoded "Seguro")
- Local development server setup

### Phase 3: Integration & Testing (Week 3)
- Connect Swift app to local backend API
- End-to-end testing on local network
- Performance optimization
- Error handling and reconnection logic
- Testing with real heart rate data

## 📈 Future Enhancements
- Historical data analysis and trends
- Heart rate zones and workout detection
- Multiple user support
- Data export functionality
- Integration with other health metrics
- Dynamic status logic (if needed later)

## 🛠 Local Development Setup
- **Backend**: Run on `localhost:3000`
- **Frontend**: Run on `localhost:3001` 
- **Redis**: Local Redis server on default port 6379
- **Testing**: Use iOS Simulator connecting to local network