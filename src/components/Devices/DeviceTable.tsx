import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  AlertTriangle,
  RefreshCw,
  Trash2,
  Lock,
  RotateCcw,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { ManagedDevice } from '../../types';

interface DeviceTableProps {
  devices: ManagedDevice[];
  loading: boolean;
  onDeviceAction: (deviceId: string, action: string) => void;
}

const DeviceTable: React.FC<DeviceTableProps> = ({ devices, loading, onDeviceAction }) => {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [actionDropdown, setActionDropdown] = useState<string | null>(null);

  const getDeviceIcon = (deviceType: string, operatingSystem: string) => {
    if (operatingSystem.toLowerCase().includes('ios') || operatingSystem.toLowerCase().includes('iphone')) {
      return <Smartphone className="h-4 w-4 text-gray-600" />;
    }
    if (deviceType.includes('desktop') || operatingSystem.toLowerCase().includes('windows')) {
      return <Monitor className="h-4 w-4 text-blue-600" />;
    }
    if (deviceType.includes('ipad') || deviceType.includes('tablet')) {
      return <Tablet className="h-4 w-4 text-purple-600" />;
    }
    return <Smartphone className="h-4 w-4 text-green-600" />;
  };

  const getComplianceIcon = (state: string) => {
    switch (state.toLowerCase()) {
      case 'compliant':
        return <ShieldCheck className="h-4 w-4 text-green-600" />;
      case 'noncompliant':
        return <ShieldX className="h-4 w-4 text-red-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'ingraceperiod':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const getConnectivityIcon = (lastSync: Date) => {
    const now = new Date();
    const diffHours = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return <Wifi className="h-4 w-4 text-green-600" />;
    } else if (diffHours < 24) {
      return <Wifi className="h-4 w-4 text-yellow-600" />;
    } else {
      return <WifiOff className="h-4 w-4 text-red-600" />;
    }
  };

  const getComplianceColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'noncompliant':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-yellow-100 text-yellow-800';
      case 'ingraceperiod':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId) 
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDevices.length === devices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(devices.map(d => d.id));
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
                  checked={selectedDevices.length === devices.length && devices.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compliance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Sync
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Management
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {devices.map((device) => (
              <tr key={device.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={selectedDevices.includes(device.id)}
                    onChange={() => handleSelectDevice(device.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getDeviceIcon(device.deviceType, device.operatingSystem)}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {device.deviceName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {device.manufacturer} {device.model}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{device.userDisplayName || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{device.userPrincipalName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{device.operatingSystem}</div>
                  <div className="text-sm text-gray-500">{device.osVersion}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getComplianceIcon(device.complianceState)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getComplianceColor(device.complianceState)}`}>
                      {device.complianceState}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getConnectivityIcon(device.lastSyncDateTime)}
                    <span className="ml-2 text-sm text-gray-900">
                      {formatLastSync(device.lastSyncDateTime)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {device.azureADRegistered ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="ml-2 text-sm text-gray-900">
                      {device.managementAgent}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setActionDropdown(actionDropdown === device.id ? null : device.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {actionDropdown === device.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              onDeviceAction(device.id, 'sync');
                              setActionDropdown(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync Device
                          </button>
                          <button
                            onClick={() => {
                              onDeviceAction(device.id, 'lock');
                              setActionDropdown(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Remote Lock
                          </button>
                          <button
                            onClick={() => {
                              onDeviceAction(device.id, 'resetPasscode');
                              setActionDropdown(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset Passcode
                          </button>
                          <div className="border-t border-gray-100"></div>
                          <button
                            onClick={() => {
                              onDeviceAction(device.id, 'retire');
                              setActionDropdown(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Retire Device
                          </button>
                          <button
                            onClick={() => {
                              onDeviceAction(device.id, 'wipe');
                              setActionDropdown(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Wipe Device
                          </button>
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
      
      {devices.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No devices found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No managed devices are currently enrolled in Intune.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeviceTable;
