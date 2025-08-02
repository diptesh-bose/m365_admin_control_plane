import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Policy } from '../../types';

interface PolicyChartProps {
  policies: Policy[];
}

export const PolicyChart: React.FC<PolicyChartProps> = ({ policies }) => {
  // Transform real policy data by type
  const policyTypeData = useMemo(() => {
    const typeColors = {
      'Security': '#3B82F6',
      'Compliance': '#10B981',
      'Device': '#F59E0B',
      'App': '#EF4444',
      'Data': '#8B5CF6',
      'Identity': '#06B6D4'
    };

    const typeCounts = policies.reduce((acc, policy) => {
      acc[policy.type] = (acc[policy.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value,
      color: typeColors[name as keyof typeof typeColors] || '#6B7280'
    }));
  }, [policies]);

  // Transform real policy data by status
  const statusData = useMemo(() => {
    const statusCounts = policies.reduce((acc, policy) => {
      acc[policy.status] = (acc[policy.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, policies]) => ({
      name,
      policies
    }));
  }, [policies]);

  // Show empty state if no policies
  if (policies.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Policy Overview</h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <p>No policies found</p>
            <p className="text-sm">Policy data will appear here once available</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Policy Overview</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Policies by Type ({policyTypeData.reduce((sum, item) => sum + item.value, 0)} total)
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={policyTypeData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {policyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, `${name} Policies`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-4">
            {policyTypeData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Policies by Status ({statusData.reduce((sum, item) => sum + item.policies, 0)} total)
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, `${name} Policies`]}
              />
              <Bar dataKey="policies" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};