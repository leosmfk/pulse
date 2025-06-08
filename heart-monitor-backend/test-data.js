const axios = require('axios');

// Test data generator for heart rate simulation
class HeartRateSimulator {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.userId = 'user123';
    this.currentBPM = 70; // Starting BPM
    this.isRunning = false;
  }

  // Generate realistic heart rate variation
  generateBPM() {
    // Simulate natural heart rate variation (±5 BPM)
    const variation = (Math.random() - 0.5) * 10;
    this.currentBPM = Math.max(50, Math.min(180, this.currentBPM + variation));
    return Math.round(this.currentBPM);
  }

  // Send heart rate data to the backend
  async sendHeartRateData() {
    try {
      const bpm = this.generateBPM();
      const data = {
        userId: this.userId,
        bpm: bpm,
        timestamp: new Date().toISOString()
      };

      const response = await axios.post(`${this.baseUrl}/api/heartrate`, data);
      console.log(`✅ Sent: ${bpm} BPM at ${new Date().toLocaleTimeString()}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending heart rate data:', error.message);
    }
  }

  // Start continuous heart rate simulation
  start(intervalMs = 2000) {
    if (this.isRunning) {
      console.log('Simulator is already running');
      return;
    }

    this.isRunning = true;
    console.log(`🚀 Starting heart rate simulation (${this.userId})`);
    console.log(`📊 Sending data every ${intervalMs}ms`);
    console.log('Press Ctrl+C to stop\n');

    this.interval = setInterval(() => {
      this.sendHeartRateData();
    }, intervalMs);
  }

  // Stop the simulation
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.isRunning = false;
      console.log('\n🛑 Heart rate simulation stopped');
    }
  }
}

// Run the simulator
const simulator = new HeartRateSimulator();

// Handle graceful shutdown
process.on('SIGINT', () => {
  simulator.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  simulator.stop();
  process.exit(0);
});

// Start simulation
simulator.start(2000); // Send data every 2 seconds 