import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Eye,
  Settings,
  Share2
} from 'lucide-react';
import { MobileApp } from '../../types';

interface AppTableProps {
  apps: MobileApp[];
  loading: boolean;
  onAppAction: (appId: string, action: string) => void;
}

const AppTable: React.FC<AppTableProps> = ({ apps, loading, onAppAction }) => {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [actionDropdown, setActionDropdown] = useState<string | null>(null);

  const getUploadStateIcon = (state: string) => {
    switch (state.toLowerCase()) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'transientError':
      case 'azureStorageUriRequestFailed':
      case 'commitFileFailed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'azureStorageUriRequestPending':
      case 'commitFilePending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPublishingStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'notpublished':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'global':
        return '🌍';
      case 'lineofbusiness':
        return '🏢';
      default:
        return '📱';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSelectApp = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApps.length === apps.length) {
      setSelectedApps([]);
    } else {
      setSelectedApps(apps.map(a => a.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectedApps.length === apps.length && apps.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Application
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publisher
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Modified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apps.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={selectedApps.includes(app.id)}
                    onChange={() => handleSelectApp(app.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {app.largeIcon?.value ? (
                        <img
                          className="h-8 w-8 rounded"
                          src={`data:${app.largeIcon.type};base64,${app.largeIcon.value}`}
                          alt={app.displayName}
                        />
                      ) : (
                        <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                          <Smartphone className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {app.displayName}
                        {app.isFeatured && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        {getAvailabilityIcon(app.appAvailability)} {app.appAvailability}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{app.publisher || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{app.developer || app.owner}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-y-1 flex-col">
                    <div className="flex items-center">
                      {getUploadStateIcon(app.uploadState)}
                      <span className="ml-2 text-xs text-gray-600">
                        Upload: {app.uploadState}
                      </span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPublishingStateColor(app.publishingState)}`}>
                      {app.publishingState}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {app.isAssigned ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="ml-2 text-sm text-gray-900">
                      {app.isAssigned ? 'Assigned' : 'Not Assigned'}
                    </span>
                  </div>
                  {app.dependentAppCount > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {app.dependentAppCount} dependencies
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(app.lastModifiedDateTime)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {formatDate(app.createdDateTime)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setActionDropdown(actionDropdown === app.id ? null : app.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {actionDropdown === app.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              onAppAction(app.id, 'view');
                              setActionDropdown(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              onAppAction(app.id, 'configure');
                              setActionDropdown(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </button>
                          <button
                            onClick={() => {
                              onAppAction(app.id, 'assign');
                              setActionDropdown(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Manage Assignments
                          </button>
                          {!app.isAssigned && (
                            <button
                              onClick={() => {
                                onAppAction(app.id, 'delete');
                                setActionDropdown(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Delete App
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {apps.length === 0 && (
        <div className="text-center py-12">
          <Download className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No mobile applications are currently configured in Intune.
          </p>
        </div>
      )}
    </div>
  );
};

export default AppTable;
