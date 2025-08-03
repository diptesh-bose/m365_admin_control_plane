import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { PolicyTable } from '../components/Policies/PolicyTable';
import PolicyConfigurationTable from '../components/Policies/PolicyConfigurationTable';
import { PolicyFilters } from '../components/Policies/PolicyFilters';
import { PolicyBackup } from '../components/Policies/PolicyBackup';
import { useGraphData } from '../hooks/useGraphData';
import { graphService } from '../services/graphService';
import { DeviceConfigurationPolicy, SettingsCatalogPolicy, DeviceCompliancePolicy } from '../types';
import { Plus, Import, RefreshCw, AlertTriangle, Database, Shield, Settings } from 'lucide-react';

export const Policies: React.FC = () => {
  const { policies, loading, error, fetchData, refreshData } = useGraphData();
  const [activeTab, setActiveTab] = useState<'conditional-access' | 'device-configuration'>('conditional-access');
  const [configurationPolicies, setConfigurationPolicies] = useState<(DeviceConfigurationPolicy | SettingsCatalogPolicy | DeviceCompliancePolicy)[]>([]);
  const [configurationLoading, setConfigurationLoading] = useState(false);
  const [configurationError, setConfigurationError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    type: string[];
    status: string[];
    priority: string[];
    search: string;
  }>({
    type: [],
    status: [],
    priority: [],
    search: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [showBackupModal, setShowBackupModal] = useState(false);

  const fetchDeviceConfigurationPolicies = useCallback(async () => {
    setConfigurationLoading(true);
    setConfigurationError(null);
    try {
      console.log('🔍 Fetching all device configuration policies...');
      
      // Use the comprehensive method that queries all endpoints
      const allPolicies = await graphService.getSettingsCatalogPolicies();
      
      console.log('📊 All Policies Retrieved:', allPolicies);
      console.log('📈 Total Policies Count:', allPolicies.length);
      
      if (allPolicies.length > 0) {
        console.log('✅ Setting configuration policies:', allPolicies);
        setConfigurationPolicies(allPolicies);
      } else {
        console.log('⚠️ No policies found - testing basic connectivity...');
        // await testBasicConnectivity();
      }
    } catch (err) {
      console.error('❌ Error fetching configuration policies:', err);
      setConfigurationError(err instanceof Error ? err.message : 'Failed to fetch configuration policies');
    } finally {
      setConfigurationLoading(false);
    }
  }, []);

  useEffect(() => {
    if (policies.length === 0) {
      fetchData();
    }
  }, [fetchData, policies.length]);

  useEffect(() => {
    console.log('Policies useEffect triggered. ActiveTab:', activeTab, 'ConfigurationPolicies length:', configurationPolicies.length);
    
    if (activeTab === 'device-configuration' && configurationPolicies.length === 0) {
      console.log('Conditions met, calling fetchDeviceConfigurationPolicies...');
      fetchDeviceConfigurationPolicies();
    }
  }, [activeTab, configurationPolicies.length, fetchDeviceConfigurationPolicies]);

  const testBasicConnectivity = async () => {
    try {
      console.log('Testing basic Graph API connectivity...');
      
      // Test a simple endpoint first
      const response = await graphService.getUsers(5);
      console.log('Basic API test - Users response:', response);
      
      // Test organization info
      const orgInfo = await graphService.getOrganizationInfo();
      console.log('Organization info:', orgInfo);
      
    } catch (error) {
      console.error('Basic connectivity test failed:', error);
    }
  };

  const handlePolicyAction = (policyId: string, action: string) => {
    // Handle policy actions like edit, delete, duplicate, etc.
    console.log(`Policy ${policyId}: ${action}`);
  };

  const filteredPolicies = useMemo(() => {
    return policies.filter(policy => {
      const matchesType = filters.type.length === 0 || filters.type.includes(policy.type);
      const matchesStatus = filters.status.length === 0 || filters.status.includes(policy.status);
      
      // Handle priority range filtering
      const matchesPriority = filters.priority.length === 0 || filters.priority.some(priorityRange => {
        if (priorityRange === 'none') return policy.priority === null;
        if (priorityRange === 'high') return policy.priority !== null && policy.priority <= 10;
        if (priorityRange === 'medium') return policy.priority !== null && policy.priority > 10 && policy.priority <= 50;
        if (priorityRange === 'low') return policy.priority !== null && policy.priority > 50 && policy.priority <= 100;
        return false;
      });
      
      const matchesSearch = filters.search === '' || 
        policy.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        policy.description.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesType && matchesStatus && matchesPriority && matchesSearch;
    });
  }, [policies, filters]);

  const paginatedPolicies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredPolicies.slice(start, end);
  }, [filteredPolicies, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredPolicies.length / pageSize);

  const handleRefresh = () => {
    if (activeTab === 'conditional-access') {
      refreshData();
    } else {
      fetchDeviceConfigurationPolicies();
    }
  };

  const handleBackupCreated = () => {
    // Optionally refresh data or show success message
    console.log('Backup created successfully');
  };

  const handlePolicySelect = () => {
    // Handle policy selection if needed
    console.log('Policy selected');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading policies from Microsoft Graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-medium text-red-900">Error Loading Policies</h3>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
        <button
          onClick={refreshData}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-gray-600">Manage your organization's security and device configuration policies</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              console.log('Manual test button clicked');
              testBasicConnectivity();
              fetchDeviceConfigurationPolicies();
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200"
          >
            <span>Test API</span>
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button 
            onClick={() => setShowBackupModal(true)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 border border-purple-300 rounded-lg hover:bg-purple-200"
          >
            <Database className="w-4 h-4" />
            <span>Backup & Restore</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Import className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Create Policy</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('conditional-access')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'conditional-access'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Conditional Access
          </button>
          <button
            onClick={() => setActiveTab('device-configuration')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'device-configuration'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Device Configuration
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'conditional-access' ? (
        <>
          {policies.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-yellow-900 mb-2">No Policies Found</h3>
              <p className="text-yellow-700">
                No policies were found in your tenant, or you may need additional permissions to view them.
              </p>
            </div>
          ) : (
            <>
              <PolicyFilters filters={filters} onFiltersChange={setFilters} />
              
              <PolicyTable policies={paginatedPolicies} onPolicySelect={handlePolicySelect} />

          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredPolicies.length)} of {filteredPolicies.length} policies
              </span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
        </>
      ) : (
        <>
          {/* Error State for Device Configuration */}
          {configurationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">Error loading configuration policies: {configurationError}</span>
              </div>
            </div>
          )}

          {/* Device Configuration Controls */}
          <div className="bg-white rounded-lg shadow-sm border mb-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Device Configuration Policies</h3>
                  <p className="text-sm text-gray-600">Manage device settings and compliance policies across all policy types</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={fetchDeviceConfigurationPolicies}
                    disabled={configurationLoading}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${configurationLoading ? 'animate-spin' : ''}`} />
                    {configurationLoading ? 'Refreshing...' : 'Refresh Policies'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Device Configuration Policy Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <PolicyConfigurationTable
              policies={configurationPolicies}
              loading={configurationLoading}
              onPolicyAction={handlePolicyAction}
            />
          </div>
        </>
      )}

      {/* Policy Backup Modal */}
      <PolicyBackup
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onBackupCreated={handleBackupCreated}
      />
    </div>
  );
};