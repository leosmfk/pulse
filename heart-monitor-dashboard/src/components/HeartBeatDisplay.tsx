import React from 'react';
import { motion } from 'framer-motion';

interface HeartBeatDisplayProps {
  currentBPM: number;
}

const HeartBeatDisplay: React.FC<HeartBeatDisplayProps> = ({ currentBPM }) => {
  // Check if detection is stopped
  const isDetectionStopped = currentBPM === 0;

  // Calculate animation duration based on BPM
  // Normal resting heart rate is 60-100 BPM
  // Animation duration should be 60/BPM seconds for realistic heartbeat
  const animationDuration = isDetectionStopped ? 2 : Math.max(0.5, 60 / currentBPM);

  // Determine heart rate category and color
  const getHeartRateCategory = (bpm: number) => {
    if (bpm === 0) return { category: 'Detecção Parada', color: 'text-gray-600', bgColor: 'bg-gray-50' };
    if (bpm < 60) return { category: 'Abaixo do Normal', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (bpm <= 100) return { category: 'Normal', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (bpm <= 150) return { category: 'Elevada', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { category: 'Alta', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const { category, color, bgColor } = getHeartRateCategory(currentBPM);

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Frequência Cardíaca Atual
      </h3>
      
      {/* Animated Heart Icon */}
      <div className="mb-6">
        <motion.div
          animate={isDetectionStopped ? {
            scale: 1,
            rotate: 0,
          } : {
            scale: [1, 1.2, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: animationDuration,
            repeat: isDetectionStopped ? 0 : Infinity,
            ease: "easeInOut"
          }}
          className="inline-block"
        >
          <div className={`text-8xl drop-shadow-lg ${isDetectionStopped ? 'text-gray-400' : 'text-red-500'}`}>
            ❤️
          </div>
        </motion.div>
      </div>

      {/* BPM Display */}
      <div className="space-y-4">
        <div className="text-center">
          <div className={`text-5xl font-bold mb-2 ${isDetectionStopped ? 'text-gray-400' : 'text-gray-800'}`}>
            {isDetectionStopped ? '--' : currentBPM}
          </div>
          <div className={`text-xl font-medium ${isDetectionStopped ? 'text-gray-400' : 'text-gray-600'}`}>
            BPM
          </div>
        </div>

        {/* Heart Rate Category */}
        <div className={`inline-block px-4 py-2 rounded-full ${bgColor}`}>
          <span className={`text-sm font-medium ${color}`}>
            {category}
          </span>
        </div>

        {/* Heart Rate Range Indicator */}
        <div className="mt-6">
          <div className="text-xs text-gray-500 mb-2">Faixas de Frequência Cardíaca</div>
          <div className="flex justify-between text-xs">
            <span className="text-blue-600">Baixa (&lt;60)</span>
            <span className="text-green-600">Normal (60-100)</span>
            <span className="text-yellow-600">Elevada (100-150)</span>
            <span className="text-red-600">Alta (&gt;150)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                currentBPM < 60 ? 'bg-blue-500' :
                currentBPM <= 100 ? 'bg-green-500' :
                currentBPM <= 150 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.min(100, Math.max(10, (currentBPM / 200) * 100))}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartBeatDisplay; 