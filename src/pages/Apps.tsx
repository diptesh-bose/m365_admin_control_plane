import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Plus, 
  Search, 
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Package
} from 'lucide-react';
import AppTable from '../components/Apps/AppTable';
import { graphService } from '../services/graphService';
import { MobileApp } from '../types';

const Apps: React.FC = () => {
  const [apps, setApps] = useState<MobileApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      setLoading(true);
      const appData = await graphService.getMobileApps();
      setApps(appData);
    } catch (error) {
      console.error('Error loading apps:', error);
      setActionMessage({
        type: 'error',
        message: 'Failed to load apps. Please check your permissions.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAppAction = async (appId: string, action: string) => {
    try {
      setActionMessage(null);
      
      switch (action) {
        case 'assign':
          // In a real implementation, this would open an assignment dialog
          setActionMessage({
            type: 'success',
            message: 'App assignment dialog would open here'
          });
          break;
        case 'unassign':
          if (window.confirm('Are you sure you want to remove all assignments for this app?')) {
            setActionMessage({
              type: 'success',
              message: 'App assignments removed (simulated)'
            });
          }
          break;
        case 'retire':
          if (window.confirm('Are you sure you want to retire this app? This will remove it from assigned devices.')) {
            setActionMessage({
              type: 'success',
              message: 'App retired from devices (simulated)'
            });
          }
          break;
        default:
          return;
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      setActionMessage({
        type: 'error',
        message: `Failed to ${action} app. Please try again.`
      });
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.publisher?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = filterPlatform === 'all' || 
                           app.applicableDeviceType?.toLowerCase().includes(filterPlatform.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         app.publishingState?.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const getAppStats = () => {
    const total = apps.length;
    const published = apps.filter(a => a.publishingState === 'published').length;
    const processing = apps.filter(a => a.publishingState === 'processing').length;
    const available = apps.filter(a => a.isAvailable).length;
    
    return { total, published, processing, available };
  };

  const stats = getAppStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">App Management</h1>
          <p className="text-gray-600">Manage and deploy mobile applications</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadApps}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-green-600 text-sm font-medium text-white hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add App
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Action Message */}
      {actionMessage && (
        <div className={`rounded-md p-4 ${
          actionMessage.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {actionMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                actionMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {actionMessage.message}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setActionMessage(null)}
                className={`text-sm ${
                  actionMessage.type === 'success' ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600'
                }`}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Apps</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <RefreshCw className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Processing</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Smartphone className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available</p>
              <p className="text-2xl font-bold text-purple-600">{stats.available}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search apps..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="windows">Windows</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
            <option value="macos">macOS</option>
          </select>
          
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="processing">Processing</option>
            <option value="notPublished">Not Published</option>
          </select>
          
          <div className="text-sm text-gray-500 flex items-center">
            Showing {filteredApps.length} of {apps.length} apps
          </div>
        </div>
      </div>

      {/* App Table */}
      <AppTable 
        apps={filteredApps}
        loading={loading}
        onAppAction={handleAppAction}
      />
    </div>
  );
};

export default Apps;
