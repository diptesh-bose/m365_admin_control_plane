import React, { useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Download, Calendar, TrendingUp, AlertTriangle, Users, Shield, RefreshCw } from 'lucide-react';
import { useGraphData } from '../hooks/useGraphData';

export const Reports: React.FC = () => {
  const { 
    reportsData, 
    securityAlerts, 
    users, 
    policies, 
    activities, 
    loading, 
    error, 
    refreshData, 
    fetchData 
  } = useGraphData();

  useEffect(() => {
    if (!reportsData) {
      fetchData();
    }
  }, [reportsData, fetchData]);

  // Transform policy trends data from audit logs
  const policyTrendData = useMemo(() => {
    if (!reportsData?.policyTrends) return [];
    
    const trends = reportsData.policyTrends;
    const monthlyData = new Map();
    
    trends.forEach((trend: any) => {
      const date = new Date(trend.activityDateTime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { month, created: 0, modified: 0, deleted: 0 });
      }
      
      const entry = monthlyData.get(monthKey);
      if (trend.activityDisplayName.includes('Add')) entry.created++;
      else if (trend.activityDisplayName.includes('Update')) entry.modified++;
      else if (trend.activityDisplayName.includes('Delete')) entry.deleted++;
    });
    
    return Array.from(monthlyData.values()).slice(-6); // Last 6 months
  }, [reportsData]);

  // Transform security scores data
  const complianceData = useMemo(() => {
    if (!reportsData?.securityScores) return [];
    
    return reportsData.securityScores.slice(-10).map((score: any) => ({
      date: new Date(score.createdDateTime).toLocaleDateString(),
      score: Math.round((score.currentScore / score.maxScore) * 100)
    }));
  }, [reportsData]);

  // Calculate real-time metrics
  const metrics = useMemo(() => {
    const activeUsers = users.filter(user => user.status === 'Active').length;
    const totalPolicies = policies.length;
    const activePolicies = policies.filter(policy => policy.status === 'Active').length;
    const openAlerts = securityAlerts.length;
    const recentActivities = activities.filter(activity => 
      new Date(activity.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length;

    return {
      systemUptime: 98.7, // This would come from service health API
      securityEvents: recentActivities,
      activeUsers: activeUsers,
      openAlerts: openAlerts,
      totalPolicies: totalPolicies,
      activePolicies: activePolicies
    };
  }, [users, policies, securityAlerts, activities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-medium text-red-900">Error Loading Reports</h3>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
        <button
          onClick={refreshData}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your Microsoft 365 environment</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            <span>Date Range</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-green-600">+0.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.systemUptime}%</h3>
          <p className="text-sm text-gray-500">System Uptime</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">24h</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.securityEvents.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">Security Events</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">
              {reportsData?.organizationStats?.userGrowthRate ? `+${reportsData.organizationStats.userGrowthRate.toFixed(1)}%` : '+0%'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.activeUsers.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">Active Users</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-sm font-medium text-red-600">
              {metrics.openAlerts > 0 ? `${metrics.openAlerts} open` : 'All clear'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.openAlerts}</h3>
          <p className="text-sm text-gray-500">Security Alerts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Policy Activity Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            {policyTrendData.length > 0 ? (
              <BarChart data={policyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="created" fill="#3B82F6" name="Created" />
                <Bar dataKey="modified" fill="#10B981" name="Modified" />
                <Bar dataKey="deleted" fill="#EF4444" name="Deleted" />
              </BarChart>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No policy activity data available</p>
                </div>
              </div>
            )}
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Score Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            {complianceData.length > 0 ? (
              <AreaChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
              </AreaChart>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No security score data available</p>
                </div>
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Recommendations</h3>
        <div className="space-y-4">
          {(reportsData?.recommendations || []).slice(0, 5).map((item: any, index: number) => (
            <div key={item.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  item.impact === 'Critical' ? 'bg-red-500' :
                  item.impact === 'High' ? 'bg-orange-500' :
                  'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">Impact: {item.impact}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
          {(!reportsData?.recommendations || reportsData.recommendations.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recommendations available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};