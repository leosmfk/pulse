import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import HeartRateChart from './components/HeartRateChart';
import HeartBeatDisplay from './components/HeartBeatDisplay';
import StatusIndicator from './components/StatusIndicator';

interface HeartRateData {
  bpm: number;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [currentBPM, setCurrentBPM] = useState<number>(72);
  const [heartRateData, setHeartRateData] = useState<HeartRateData[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);


  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000');

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to backend');
      setIsConnected(true);
      // Request initial data
      newSocket.emit('request-initial-data', 'user123');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from backend');
      setIsConnected(false);
    });

    // Heart rate data handlers
    newSocket.on('heartrate-update', (data: HeartRateData) => {
      console.log('Received heart rate update:', data);
      setCurrentBPM(data.bpm);
      setHeartRateData(prev => [...prev.slice(-29), data]); // Keep last 30 points
    });

    newSocket.on('initial-data', (data: HeartRateData[]) => {
      console.log('Received initial data:', data);
      setHeartRateData(data);
      if (data.length > 0) {
        setCurrentBPM(data[data.length - 1].bpm);
      }
    });

    // Detection stopped handler
    newSocket.on('detection-stopped', (data) => {
      console.log('Detection stopped:', data);
      setCurrentBPM(0); // Zero the heart rate display
    });

    // Error handling
    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    // Cleanup
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Monitor de Frequência Cardíaca
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-600">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heart Rate Chart - Takes up 2/3 on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Tendência da Frequência Cardíaca
              </h2>
              <HeartRateChart data={heartRateData} />
            </div>
          </div>

          {/* Right Panel - Heart Beat Display + Status */}
          <div className="space-y-6">
            {/* Current Heart Rate */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <HeartBeatDisplay currentBPM={currentBPM} />
            </div>

            {/* Status Indicator */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <StatusIndicator />
            </div>

            {/* Connection Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Informações de Conexão
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Status: {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}</div>
                <div>Pontos de Dados: {heartRateData.length}</div>
                <div>Última Atualização: {heartRateData.length > 0 ? 
                  new Date(heartRateData[heartRateData.length - 1].timestamp).toLocaleTimeString() : 
                  'Sem dados'
                }</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 