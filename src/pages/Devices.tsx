import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Search, 
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import DeviceTable from '../components/Devices/DeviceTable';
import { graphService } from '../services/graphService';
import { ManagedDevice } from '../types';

const Devices: React.FC = () => {
  const [devices, setDevices] = useState<ManagedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterCompliance, setFilterCompliance] = useState('all');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const deviceData = await graphService.getManagedDevices(100);
      setDevices(deviceData);
    } catch (error) {
      console.error('Error loading devices:', error);
      setActionMessage({
        type: 'error',
        message: 'Failed to load devices. Please check your permissions.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceAction = async (deviceId: string, action: string) => {
    try {
      setActionMessage(null);
      let result;
      
      switch (action) {
        case 'sync':
          result = await graphService.syncManagedDevice(deviceId);
          break;
        case 'lock':
          result = await graphService.lockManagedDevice(deviceId);
          break;
        case 'resetPasscode':
          result = await graphService.resetPasscodeManagedDevice(deviceId);
          break;
        case 'retire':
          if (window.confirm('Are you sure you want to retire this device? This action cannot be undone.')) {
            result = await graphService.retireManagedDevice(deviceId);
          } else {
            return;
          }
          break;
        case 'wipe':
          if (window.confirm('Are you sure you want to wipe this device? This will remove all data and cannot be undone.')) {
            result = await graphService.wipeManagedDevice(deviceId);
          } else {
            return;
          }
          break;
        default:
          return;
      }

      if (result?.success) {
        setActionMessage({
          type: 'success',
          message: result.message || `${action} action completed successfully`
        });
        // Refresh devices after action
        setTimeout(() => loadDevices(), 2000);
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      setActionMessage({
        type: 'error',
        message: `Failed to ${action} device. Please try again.`
      });
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.userDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.userPrincipalName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = filterPlatform === 'all' || 
                           device.operatingSystem.toLowerCase().includes(filterPlatform.toLowerCase());
    
    const matchesCompliance = filterCompliance === 'all' || 
                             device.complianceState.toLowerCase() === filterCompliance.toLowerCase();
    
    return matchesSearch && matchesPlatform && matchesCompliance;
  });

  const getComplianceStats = () => {
    const total = devices.length;
    const compliant = devices.filter(d => d.complianceState === 'compliant').length;
    const nonCompliant = devices.filter(d => d.complianceState === 'noncompliant').length;
    const errors = devices.filter(d => d.complianceState === 'error').length;
    
    return { total, compliant, nonCompliant, errors };
  };

  const stats = getComplianceStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Device Management</h1>
          <p className="text-gray-600">Manage and monitor Intune-enrolled devices</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadDevices}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
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
            <Smartphone className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Devices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Compliant</p>
              <p className="text-2xl font-bold text-green-600">{stats.compliant}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Non-Compliant</p>
              <p className="text-2xl font-bold text-red-600">{stats.nonCompliant}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Errors</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.errors}</p>
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
              placeholder="Search devices..."
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
            value={filterCompliance}
            onChange={(e) => setFilterCompliance(e.target.value)}
          >
            <option value="all">All Compliance States</option>
            <option value="compliant">Compliant</option>
            <option value="noncompliant">Non-Compliant</option>
            <option value="error">Error</option>
            <option value="unknown">Unknown</option>
          </select>
          
          <div className="text-sm text-gray-500 flex items-center">
            Showing {filteredDevices.length} of {devices.length} devices
          </div>
        </div>
      </div>

      {/* Device Table */}
      <DeviceTable 
        devices={filteredDevices}
        loading={loading}
        onDeviceAction={handleDeviceAction}
      />
    </div>
  );
};

export default Devices;
