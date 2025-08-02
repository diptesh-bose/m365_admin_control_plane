import React, { useEffect } from 'react';
import { MetricCard } from '../components/Dashboard/MetricCard';
import { ActivityFeed } from '../components/Dashboard/ActivityFeed';
import { PolicyChart } from '../components/Dashboard/PolicyChart';
import { useGraphData } from '../hooks/useGraphData';
import { Shield, Users, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    policies, 
    users, 
    activities, 
    securityAlerts, 
    organizationInfo, 
    loading, 
    error, 
    fetchData,
    refreshData 
  } = useGraphData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tenant data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-medium text-red-900">Error Loading Data</h3>
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

  const activePolicies = policies.filter(p => p.status === 'Active').length;
  const pendingPolicies = policies.filter(p => p.status === 'Pending').length;
  const activeUsers = users.filter(u => u.status === 'Active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            {organizationInfo ? `${organizationInfo.displayName} - ` : ''}
            Overview of your Microsoft 365 environment
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={refreshData}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Live data from Microsoft Graph</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Policies"
          value={policies.length}
          icon={Shield}
          color="blue"
        />
        <MetricCard
          title="Active Policies"
          value={activePolicies}
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Pending Policies"
          value={pendingPolicies}
          icon={Clock}
          color="yellow"
        />
        <MetricCard
          title="Total Users"
          value={users.length}
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Active Users"
          value={activeUsers}
          icon={Users}
          color="green"
        />
        <MetricCard
          title="Security Alerts"
          value={securityAlerts.length}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PolicyChart policies={policies} />
        </div>
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {organizationInfo && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenant Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Organization</p>
              <p className="text-gray-900">{organizationInfo.displayName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Tenant ID</p>
              <p className="text-gray-900 font-mono text-sm">{organizationInfo.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Verified Domains</p>
              <p className="text-gray-900">
                {organizationInfo.verifiedDomains?.map((d: { name: string }) => d.name).join(', ')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Active Plans</p>
              <p className="text-gray-900">
                {organizationInfo.assignedPlans?.length || 0} subscription(s)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};