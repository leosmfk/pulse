// Configuration file for the Heart Monitor Dashboard
const config = {
  // Backend URL - use your local IP when running locally
  // Use the deployed URL when deploying the frontend
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://10.232.32.9:3000',
  
  // Socket.io connection settings
  SOCKET_OPTIONS: {
    transports: ['websocket', 'polling'],
    timeout: 5000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }
};

export default config; 