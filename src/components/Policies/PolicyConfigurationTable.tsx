import React, { useState } from 'react';
import { 
  Shield, 
  Settings, 
  CheckCircle,
  Clock,
  Users,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';
import { DeviceConfigurationPolicy, SettingsCatalogPolicy, DeviceCompliancePolicy } from '../../types';

interface PolicyConfigurationTableProps {
  policies: (DeviceConfigurationPolicy | SettingsCatalogPolicy | DeviceCompliancePolicy)[];
  loading: boolean;
  onPolicyAction: (policyId: string, action: string) => void;
}

const PolicyConfigurationTable: React.FC<PolicyConfigurationTableProps> = ({ 
  policies, 
  loading, 
  onPolicyAction 
}) => {
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'displayName' | 'lastModifiedDateTime' | 'platformType'>('lastModifiedDateTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

  // Debug logging
  console.log('PolicyConfigurationTable received policies:', policies);
  console.log('PolicyConfigurationTable loading state:', loading);
  console.log('PolicyConfigurationTable policies length:', policies.length);

  const getDisplayName = (policy: DeviceConfigurationPolicy | SettingsCatalogPolicy | DeviceCompliancePolicy): string => {
    if ('displayName' in policy && policy.displayName) return policy.displayName;
    if ('name' in policy && policy.name) return policy.name;
    return 'Unknown Policy';
  };

  const getPlatformType = (policy: DeviceConfigurationPolicy | SettingsCatalogPolicy | DeviceCompliancePolicy): string => {
    if ('platformType' in policy) return policy.platformType || 'unknown';
    if ('platforms' in policy) return policy.platforms || 'unknown';
    return 'unknown';
  };

  const handleSort = (field: 'displayName' | 'lastModifiedDateTime' | 'platformType') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPolicies = [...policies].sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;

    switch (sortField) {
      case 'displayName':
        aValue = getDisplayName(a).toLowerCase();
        bValue = getDisplayName(b).toLowerCase();
        break;
      case 'lastModifiedDateTime':
        aValue = new Date(a.lastModifiedDateTime);
        bValue = new Date(b.lastModifiedDateTime);
        break;
      case 'platformType':
        aValue = getPlatformType(a).toLowerCase();
        bValue = getPlatformType(b).toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getPolicyTypeIcon = (policy: DeviceConfigurationPolicy | SettingsCatalogPolicy | DeviceCompliancePolicy) => {
    if ('@odata.type' in policy) {
      const odataType = policy['@odata.type'];
      if (odataType?.includes('deviceManagementConfigurationPolicy')) {
        return <Settings className="h-4 w-4 text-blue-600" />;
      }
      if (odataType?.includes('windows10CustomConfiguration')) {
        return <Monitor className="h-4 w-4 text-purple-600" />;
      }
      if (odataType?.includes('deviceCompliance')) {
        return <Shield className="h-4 w-4 text-green-600" />;
      }
    }
    
    // Fallback based on other properties
    if ('settingCount' in policy) {
      return <Settings className="h-4 w-4 text-blue-600" />; // Settings catalog
    }
    if ('scheduledActionsForRule' in policy) {
      return <Shield className="h-4 w-4 text-green-600" />; // Compliance policy
    }
    
    return <Shield className="h-4 w-4 text-gray-600" />;
  };

  const getPolicyTypeName = (policy: DeviceConfigurationPolicy | SettingsCatalogPolicy | DeviceCompliancePolicy) => {
    // Use the explicit policyType if available
    if ('policyType' in policy && policy.policyType) {
      return policy.policyType;
    }

    // Fallback to OData type analysis
    if ('@odata.type' in policy) {
      const odataType = policy['@odata.type'];
      if (odataType?.includes('deviceManagementConfigurationPolicy')) return 'Settings Catalog';
      if (odataType?.includes('deviceManagementTemplate')) return 'Security Baseline';
      if (odataType?.includes('deviceManagementIntent')) return 'Endpoint Security';
      if (odataType?.includes('windows10CustomConfiguration')) return 'Custom';
      if (odataType?.includes('windows10GeneralConfiguration')) return 'Administrative Templates';
      if (odataType?.includes('deviceCompliance')) return 'Compliance Policy';
      if (odataType?.includes('windowsHealthMonitoring')) return 'Windows Health Monitoring';
    }
    
    if ('settingCount' in policy) return 'Settings Catalog';
    if ('scheduledActionsForRule' in policy) return 'Compliance Policy';
    
    return 'Configuration Policy';
  };

  const getPlatformIcon = (policy: DeviceConfigurationPolicy | SettingsCatalogPolicy | DeviceCompliancePolicy) => {
    let platform = '';
    if ('platformType' in policy) {
      platform = policy.platformType || '';
    } else if ('platforms' in policy) {
      platform = policy.platforms || '';
    }

    switch (platform.toLowerCase()) {
      case 'windows10':
      case 'windows':
        return <Monitor className="h-4 w-4 text-blue-600" />;
      case 'ios':
        return <Smartphone className="h-4 w-4 text-gray-800" />;
      case 'android':
        return <Smartphone className="h-4 w-4 text-green-600" />;
      case 'macos':
        return <Laptop className="h-4 w-4 text-gray-600" />;
      default:
        return <Tablet className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIndicator = (policy: DeviceConfigurationPolicy | SettingsCatalogPolicy | DeviceCompliancePolicy) => {
    if ('isAssigned' in policy) {
      return policy.isAssigned ? (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="text-xs">Assigned</span>
        </div>
      ) : (
        <div className="flex items-center text-yellow-600">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-xs">Not Assigned</span>
        </div>
      );
    }
    
    // For regular device configuration policies, show as assigned by default
    return (
      <div className="flex items-center text-green-600">
        <CheckCircle className="h-4 w-4 mr-1" />
        <span className="text-xs">Active</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading device configuration policies...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Device Configuration Policies</h3>
        <p className="text-sm text-gray-600">Manage device settings and compliance policies</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPolicies(policies.map(p => p.id));
                    } else {
                      setSelectedPolicies([]);
                    }
                  }}
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('displayName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Policy Name</span>
                  {sortField === 'displayName' && (
                    <span className="text-blue-600">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('platformType')}
              >
                <div className="flex items-center space-x-1">
                  <span>Platform</span>
                  {sortField === 'platformType' && (
                    <span className="text-blue-600">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('lastModifiedDateTime')}
              >
                <div className="flex items-center space-x-1">
                  <span>Last Modified</span>
                  {sortField === 'lastModifiedDateTime' && (
                    <span className="text-blue-600">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPolicies.map((policy) => (
              <React.Fragment key={policy.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedPolicies.includes(policy.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPolicies([...selectedPolicies, policy.id]);
                        } else {
                          setSelectedPolicies(selectedPolicies.filter(id => id !== policy.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getPolicyTypeIcon(policy)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {getDisplayName(policy)}
                        </div>
                        {policy.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {policy.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getPolicyTypeName(policy)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getPlatformIcon(policy)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {'platformType' in policy 
                          ? policy.platformType?.replace('windows10', 'Windows 10') || 'Unknown'
                          : 'platforms' in policy 
                            ? policy.platforms?.replace('windows10', 'Windows 10') || 'Unknown'
                            : 'Unknown'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusIndicator(policy)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(policy.lastModifiedDateTime)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setExpandedPolicy(expandedPolicy === policy.id ? null : policy.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <div className="absolute right-0 top-6 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onPolicyAction(policy.id, 'edit')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Policy
                          </button>
                          <button
                            onClick={() => onPolicyAction(policy.id, 'copy')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => onPolicyAction(policy.id, 'assignments')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Assignments
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => onPolicyAction(policy.id, 'delete')}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                
                {expandedPolicy === policy.id && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Policy ID</label>
                            <p className="text-sm text-gray-900 font-mono">{policy.id}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Created</label>
                            <p className="text-sm text-gray-900">{formatDate(policy.createdDateTime)}</p>
                          </div>
                          {'version' in policy && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Version</label>
                              <p className="text-sm text-gray-900">{policy.version}</p>
                            </div>
                          )}
                          {'settingCount' in policy && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Settings Count</label>
                              <p className="text-sm text-gray-900">{policy.settingCount}</p>
                            </div>
                          )}
                          {'technologies' in policy && policy.technologies && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Technology</label>
                              <p className="text-sm text-gray-900 capitalize">{policy.technologies}</p>
                            </div>
                          )}
                        </div>
                        
                        {policy.description && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Description</label>
                            <p className="text-sm text-gray-900 mt-1">{policy.description}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {policies.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Policies Found</h3>
          <p className="text-gray-500">No device configuration policies are available.</p>
        </div>
      )}
    </div>
  );
};

export default PolicyConfigurationTable;
