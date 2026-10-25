import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ResultDisplay = ({ riskLevel, reasons }) => {
  if (!riskLevel) return null;

  const getRiskConfig = (level) => {
    switch (level) {
      case 'High':
        return {
          color: 'text-alert-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-alert-red-600',
          icon: <AlertTriangle className="w-8 h-8 text-alert-red-600" />,
          title: 'High Risk Detected',
        };
      case 'Medium':
        return {
          color: 'text-warning-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-warning-amber-500',
          icon: <Info className="w-8 h-8 text-warning-amber-500" />,
          title: 'Medium Risk - Proceed with Caution',
        };
      case 'Low':
        return {
          color: 'text-safe-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-safe-green-600',
          icon: <CheckCircle className="w-8 h-8 text-safe-green-600" />,
          title: 'Low Risk - Seems Safe',
        };
      default:
        return null;
    }
  };

  const config = getRiskConfig(riskLevel);
  if (!config) return null;

  return (
    <div className={`mt-6 p-6 rounded-lg border-l-4 ${config.borderColor} ${config.bgColor} shadow-sm`}>
      <div className="flex items-center space-x-3 mb-4">
        {config.icon}
        <h3 className={`text-xl font-bold ${config.color}`}>{config.title}</h3>
      </div>
      
      <div className="ml-11">
        <p className="font-semibold text-gray-800 mb-2">Reasons for this assessment:</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          {reasons.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultDisplay;
