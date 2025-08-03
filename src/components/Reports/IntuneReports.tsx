import React from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  AlertTriangle,
  Smartphone,
  Download,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { IntuneReports } from '../../types';

interface IntuneReportsProps {
  reports: IntuneReports;
  loading: boolean;
}

const IntuneReportsComponent: React.FC<IntuneReportsProps> = ({ reports, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  const { deviceComplianceReport, appInstallationReport, deviceInventoryReport } = reports;

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Compliant Devices</h3>
              <p className="text-3xl font-bold text-green-600">
                {deviceComplianceReport.compliantDevices}
              </p>
              <p className="text-sm text-gray-500">
                {deviceComplianceReport.complianceRate}% compliance rate
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldX className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Non-Compliant</h3>
              <p className="text-3xl font-bold text-red-600">
                {deviceComplianceReport.nonCompliantDevices}
              </p>
              <p className="text-sm text-gray-500">
                {Math.round((deviceComplianceReport.nonCompliantDevices / deviceComplianceReport.totalDevices) * 100)}% of total
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Errors</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {deviceComplianceReport.errorDevices}
              </p>
              <p className="text-sm text-gray-500">
                Devices with errors
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Smartphone className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Devices</h3>
              <p className="text-3xl font-bold text-blue-600">
                {deviceComplianceReport.totalDevices}
              </p>
              <p className="text-sm text-gray-500">
                Managed devices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Device Platform Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Device Platform Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(deviceInventoryReport.devicesByPlatform).map(([platform, count]) => (
            <div key={platform} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">
                {platform === 'windows' && '🪟'}
                {platform === 'iOS' && '📱'}
                {platform === 'android' && '🤖'}
                {platform === 'macOS' && '🍎'}
                {platform === 'other' && '💻'}
              </div>
              <div className="text-xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-500 capitalize">{platform}</div>
            </div>
          ))}
        </div>
      </div>

      {/* App Installation Report */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Download className="h-5 w-5 mr-2" />
            App Installation Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Apps</span>
              <span className="text-lg font-bold text-gray-900">
                {appInstallationReport.totalApps}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Successful</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {appInstallationReport.successfulInstalls}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <XCircle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Failed</span>
              </div>
              <span className="text-lg font-bold text-red-600">
                {appInstallationReport.failedInstalls}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Pending</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">
                {appInstallationReport.pendingInstalls}
              </span>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Installation Rate</span>
                <div className="flex items-center">
                  {appInstallationReport.installationRate >= 90 ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : appInstallationReport.installationRate >= 70 ? (
                    <BarChart3 className="h-4 w-4 text-yellow-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-lg font-bold ${
                    appInstallationReport.installationRate >= 90 
                      ? 'text-green-600' 
                      : appInstallationReport.installationRate >= 70 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
                    {appInstallationReport.installationRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Device Activity Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Enrolled Devices</span>
              <span className="text-lg font-bold text-blue-600">
                {deviceInventoryReport.enrolledDevices}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Active (Last 3 days)</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {deviceInventoryReport.activeDevices}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">Inactive</span>
              </div>
              <span className="text-lg font-bold text-gray-600">
                {deviceInventoryReport.inactiveDevices}
              </span>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Activity Rate</span>
                <div className="flex items-center">
                  {((deviceInventoryReport.activeDevices / deviceInventoryReport.totalDevices) * 100) >= 80 ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-yellow-600 mr-1" />
                  )}
                  <span className={`text-lg font-bold ${
                    ((deviceInventoryReport.activeDevices / deviceInventoryReport.totalDevices) * 100) >= 80 
                      ? 'text-green-600' 
                      : 'text-yellow-600'
                  }`}>
                    {Math.round((deviceInventoryReport.activeDevices / deviceInventoryReport.totalDevices) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Progress Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Overview</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className="bg-green-600 h-4 rounded-full transition-all duration-500"
            style={{ 
              width: `${(deviceComplianceReport.compliantDevices / deviceComplianceReport.totalDevices) * 100}%` 
            }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Compliant: {deviceComplianceReport.compliantDevices}</span>
          <span>Non-compliant: {deviceComplianceReport.nonCompliantDevices}</span>
          <span>Errors: {deviceComplianceReport.errorDevices}</span>
          <span>Unknown: {deviceComplianceReport.unknownDevices}</span>
        </div>
      </div>
    </div>
  );
};

export default IntuneReportsComponent;
