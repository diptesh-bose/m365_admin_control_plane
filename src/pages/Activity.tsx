import React from 'react';
import { mockActivities } from '../data/mockData';
import { format } from 'date-fns';
import { Filter, Download, Search, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const severityConfig = {
  Info: { icon: Info, color: 'text-blue-600 bg-blue-50' },
  Success: { icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  Warning: { icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50' },
  Error: { icon: AlertCircle, color: 'text-red-600 bg-red-50' }
};

export const Activity: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600">Monitor all administrative activities and system events</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search activities..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-4">
          {mockActivities.map((activity) => {
            const config = severityConfig[activity.severity];
            const Icon = config.icon;
            
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-full ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                    <span className="text-xs text-gray-500">
                      {format(activity.timestamp, 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500">User: {activity.user}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      activity.severity === 'Error' ? 'bg-red-100 text-red-800' :
                      activity.severity === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                      activity.severity === 'Success' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.severity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};