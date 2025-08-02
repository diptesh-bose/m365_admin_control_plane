import React from 'react';
import { Filter, X } from 'lucide-react';

interface PolicyFiltersProps {
  filters: {
    type: string[];
    status: string[];
    priority: string[];
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

const policyTypes = ['Security', 'Compliance', 'Device', 'App', 'Data', 'Identity'];
const statuses = ['Active', 'Inactive', 'Pending', 'Draft'];
const priorities = ['Critical', 'High', 'Medium', 'Low'];

export const PolicyFilters: React.FC<PolicyFiltersProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = (key: string, value: string) => {
    const currentValues = filters[key as keyof typeof filters];
    if (Array.isArray(currentValues)) {
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      onFiltersChange({ ...filters, [key]: newValues });
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      type: [],
      status: [],
      priority: [],
      search: ''
    });
  };

  const hasActiveFilters = filters.type.length > 0 || filters.status.length > 0 || 
                          filters.priority.length > 0 || filters.search.length > 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder="Search policies..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <div className="space-y-2">
            {policyTypes.map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.type.includes(type)}
                  onChange={() => updateFilter('type', type)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="space-y-2">
            {statuses.map(status => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => updateFilter('status', status)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <div className="space-y-2">
            {priorities.map(priority => (
              <label key={priority} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.priority.includes(priority)}
                  onChange={() => updateFilter('priority', priority)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{priority}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};