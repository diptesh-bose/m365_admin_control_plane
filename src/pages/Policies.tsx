import React, { useState, useMemo, useEffect } from 'react';
import { PolicyTable } from '../components/Policies/PolicyTable';
import { PolicyFilters } from '../components/Policies/PolicyFilters';
import { PolicyBackup } from '../components/Policies/PolicyBackup';
import { useGraphData } from '../hooks/useGraphData';
import { Plus, Import, RefreshCw, AlertTriangle, Database } from 'lucide-react';

export const Policies: React.FC = () => {
  const { policies, loading, error, fetchData, refreshData } = useGraphData();
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

  useEffect(() => {
    if (policies.length === 0) {
      fetchData();
    }
  }, [fetchData, policies.length]);

  const filteredPolicies = useMemo(() => {
    return policies.filter(policy => {
      const matchesType = filters.type.length === 0 || filters.type.includes(policy.type);
      const matchesStatus = filters.status.length === 0 || filters.status.includes(policy.status);
      const matchesPriority = filters.priority.length === 0 || filters.priority.includes(policy.priority);
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
          <p className="text-gray-600">Real-time policies from your Microsoft 365 tenant</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshData}
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

      {/* Policy Backup Modal */}
      <PolicyBackup
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onBackupCreated={handleBackupCreated}
      />
    </div>
  );
};