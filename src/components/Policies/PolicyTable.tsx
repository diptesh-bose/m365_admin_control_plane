import React, { useState } from 'react';
import { Policy } from '../../types';
import { format } from 'date-fns';
import { ChevronDown, Filter, Download, MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react';

interface PolicyTableProps {
  policies: Policy[];
  onPolicySelect: (policy: Policy) => void;
}

const statusColors = {
  enabled: 'bg-green-100 text-green-800',
  disabled: 'bg-gray-100 text-gray-800',
  enabledForReportingButNotEnforced: 'bg-yellow-100 text-yellow-800'
};

const statusLabels = {
  enabled: 'On',
  disabled: 'Off', 
  enabledForReportingButNotEnforced: 'Report Only'
};

const getPriorityColor = (priority: number | null) => {
  if (priority === null) return 'bg-gray-100 text-gray-800';
  if (priority <= 10) return 'bg-red-100 text-red-800';
  if (priority <= 50) return 'bg-orange-100 text-orange-800';
  if (priority <= 100) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

export const PolicyTable: React.FC<PolicyTableProps> = ({ policies, onPolicySelect }) => {
  const [selectedPolicies, setSelectedPolicies] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof Policy>('lastModified');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Check if any policies have priority values to determine if we should show the column
  const hasPriorityPolicies = policies.some(policy => policy.priority !== null);

  const handleSort = (field: keyof Policy) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedPolicies = [...policies].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Handle null values in sorting
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return sortDirection === 'asc' ? -1 : 1;
    if (bValue === null) return sortDirection === 'asc' ? 1 : -1;
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const togglePolicySelection = (policyId: string) => {
    const newSelection = new Set(selectedPolicies);
    if (newSelection.has(policyId)) {
      newSelection.delete(policyId);
    } else {
      newSelection.add(policyId);
    }
    setSelectedPolicies(newSelection);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Policies ({policies.length.toLocaleString()})
            </h3>
            {selectedPolicies.size > 0 && (
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {selectedPolicies.size} selected
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPolicies(new Set(policies.map(p => p.id)));
                    } else {
                      setSelectedPolicies(new Set());
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Policy Name</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {hasPriorityPolicies && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('lastModified')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Last Modified</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Affected Users
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedPolicies.map((policy) => (
              <tr key={policy.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPolicies.has(policy.id)}
                    onChange={() => togglePolicySelection(policy.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <button
                      onClick={() => onPolicySelect(policy)}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 text-left"
                    >
                      {policy.name}
                    </button>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {policy.description}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {policy.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[policy.status]}`}>
                    {statusLabels[policy.status]}
                  </span>
                </td>
                {hasPriorityPolicies && (
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(policy.priority)}`}>
                      {policy.priority !== null ? policy.priority : 'N/A'}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span>{format(policy.lastModified, 'MMM d, yyyy')}</span>
                    <span className="text-xs text-gray-400">
                      {format(policy.lastModified, 'HH:mm')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {policy.affectedUsers.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};