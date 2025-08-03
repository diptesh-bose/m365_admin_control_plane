import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Download, Calendar, TrendingUp, AlertTriangle, Users, Shield, RefreshCw, Smartphone } from 'lucide-react';
import { useGraphData } from '../hooks/useGraphData';
import IntuneReportsComponent from '../components/Reports/IntuneReports';

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'intune'>('general');
  
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
  const securityScoreData = useMemo(() => {
    if (!reportsData?.securityScores) return [];
    
    return reportsData.securityScores.slice(-10).map((score: any) => ({
      date: new Date(score.createdDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      currentScore: score.currentScore,
      maxScore: score.maxScore,
      percentage: Math.round((score.currentScore / score.maxScore) * 100)
    }));
  }, [reportsData]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const activePolicies = policies.filter(policy => policy.status === 'enabled').length;
    const recentActivities = activities.slice(0, 10).length;
    const openAlerts = securityAlerts.filter(alert => alert.status === 'newAlert').length;
    const systemUptime = 99.8; // This would come from actual monitoring data
    
    return { totalUsers, activePolicies, recentActivities, openAlerts, systemUptime };
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

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>General Reports</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('intune')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'intune'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4" />
              <span>Intune Reports</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <div className="space-y-6">
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
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-medium text-green-600">
                  +5%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.totalUsers}</h3>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
                <span className="text-sm font-medium text-blue-600">
                  {metrics.activePolicies > 0 ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.activePolicies}</h3>
              <p className="text-sm text-gray-500">Security Policies</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <span className={`text-sm font-medium ${metrics.openAlerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {metrics.openAlerts > 0 ? 'Action Required' : 'All Clear'}
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
                    <Bar dataKey="created" fill="#10b981" name="Created" />
                    <Bar dataKey="modified" fill="#f59e0b" name="Modified" />
                    <Bar dataKey="deleted" fill="#ef4444" name="Deleted" />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No policy activity data available</p>
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Score History</h3>
              <ResponsiveContainer width="100%" height={300}>
                {securityScoreData.length > 0 ? (
                  <AreaChart data={securityScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value, name === 'percentage' ? 'Score (%)' : name]} />
                    <Area type="monotone" dataKey="percentage" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
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
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'recommended' ? 'bg-blue-100 text-blue-800' :
                    item.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
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
      )}

      {/* Intune Reports Tab */}
      {activeTab === 'intune' && (
        <IntuneReportsComponent 
          reports={{
            deviceComplianceReport: {
              reportName: "Device Compliance Overview",
              totalDevices: 0,
              compliantDevices: 0,
              nonCompliantDevices: 0,
              errorDevices: 0,
              unknownDevices: 0,
              complianceRate: 0
            },
            appInstallationReport: {
              reportName: "Application Installation Status",
              totalApps: 0,
              successfulInstalls: 0,
              failedInstalls: 0,
              pendingInstalls: 0,
              installationRate: 0
            },
            deviceInventoryReport: {
              reportName: "Device Inventory Summary",
              totalDevices: 0,
              enrolledDevices: 0,
              activeDevices: 0,
              inactiveDevices: 0,
              devicesByPlatform: {
                windows: 0,
                iOS: 0,
                android: 0,
                macOS: 0,
                other: 0
              }
            }
          }}
          loading={false}
        />
      )}
    </div>
  );
};

export default Reports;
