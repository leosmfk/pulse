import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface HeartRateData {
  bpm: number;
  timestamp: string;
}

interface HeartRateChartProps {
  data: HeartRateData[];
}

const HeartRateChart: React.FC<HeartRateChartProps> = ({ data }) => {
  // Format data for the chart
  const chartData = data.map((item, index) => ({
    time: new Date(item.timestamp).toLocaleTimeString('pt-BR', { 
      hour12: false,
      minute: '2-digit',
      second: '2-digit'
    }),
    bpm: item.bpm,
    fullTimestamp: item.timestamp
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-800">
            Horário: {label}
          </p>
          <p className="text-sm text-red-600">
            Frequência Cardíaca: {payload[0].value} BPM
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p>Nenhum dado de frequência cardíaca disponível</p>
            <p className="text-sm">Aguardando dados do seu dispositivo...</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              fontSize={12}
              tick={{ fill: '#666' }}
            />
            <YAxis 
              domain={['dataMin - 10', 'dataMax + 10']}
              stroke="#666"
              fontSize={12}
              tick={{ fill: '#666' }}
              label={{ value: 'BPM', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="bpm"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default HeartRateChart; 