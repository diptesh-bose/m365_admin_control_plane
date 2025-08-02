import React from 'react';
import { Activity } from '../../types';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

const severityConfig = {
  Info: { icon: Info, color: 'text-blue-600 bg-blue-50' },
  Success: { icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  Warning: { icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50' },
  Error: { icon: AlertCircle, color: 'text-red-600 bg-red-50' }
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.slice(0, 10).map((activity) => {
          const config = severityConfig[activity.severity];
          const Icon = config.icon;
          
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-1.5 rounded-full ${config.color}`}>
                <Icon className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-400">
                    {format(activity.timestamp, 'MMM d, HH:mm')}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{activity.user}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
        View All Activities
      </button>
    </div>
  );
};