import React from 'react';

const StatusIndicator: React.FC = () => {
  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Status
      </h3>
      
      {/* Status Badge */}
      <div className="mb-4">
        <div className="inline-flex items-center px-6 py-3 bg-green-100 rounded-full">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          <span className="text-2xl font-bold text-green-700">
            Seguro
          </span>
        </div>
      </div>

      {/* Status Description */}
      <div className="text-sm text-gray-600 space-y-2">
        <p>✅ Monitoramento cardíaco ativo</p>
        <p>✅ Todos os sistemas operacionais</p>
        <p>✅ Conexão de dados estável</p>
      </div>

      {/* Last Check Time */}
      <div className="mt-4 text-xs text-gray-500">
        Última verificação: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default StatusIndicator; 