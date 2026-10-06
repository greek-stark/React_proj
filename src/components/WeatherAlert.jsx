import React from 'react';
import { formatDate } from '../utils/formatDate';

const WeatherAlert = ({ alert }) => {
  if (!alert) return null;

  const getSeverityColor = (event) => {
    const eventLower = event.toLowerCase();
    if (eventLower.includes('critical') || eventLower.includes('extreme') || eventLower.includes('tornado')) {
      return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-200';
    }
    if (eventLower.includes('severe') || eventLower.includes('warning') || eventLower.includes('storm')) {
      return 'bg-orange-100 border-orange-500 text-orange-800 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-200';
    }
    if (eventLower.includes('watch') || eventLower.includes('advisory')) {
      return 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-200';
    }
    return 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-200';
  };

  const severityColor = getSeverityColor(alert.event);

  return (
    <div className={`border-l-4 rounded-lg p-4 ${severityColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            
            <h3 className="text-lg font-semibold">{alert.event}</h3>
          </div>
          <p className="text-sm mb-2">{alert.description}</p>
          <div className="flex items-center space-x-4 text-xs">
            <div>
              <span className="font-medium">Start:</span>{' '}
              {formatDate(alert.start * 1000, 'datetime')}
            </div>
            <div>
              <span className="font-medium">End:</span>{' '}
              {formatDate(alert.end * 1000, 'datetime')}
            </div>
          </div>
          {alert.sender_name && (
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
              Source: {alert.sender_name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherAlert;