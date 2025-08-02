import { useState, useEffect, useCallback } from 'react';
import { graphService } from '../services/graphService';
import { Policy, User, Activity } from '../types';

interface SecurityAlert {
  id: string;
  title: string;
  severity: string;
  status: string;
  createdDateTime: string;
  description?: string;
}

interface OrganizationInfo {
  id: string;
  displayName: string;
  verifiedDomains: Array<{ name: string; isDefault: boolean }>;
  technicalNotificationMails: string[];
}

interface ReportsData {
  organizationStats: object | null;
  securityScores: object[];
  policyTrends: object[];
  recommendations: object[];
}

export const useGraphData = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo | null>(null);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await graphService.initialize();

      // Fetch all data in parallel
      const [
        usersData,
        conditionalAccessPolicies,
        devicePolicies,
        auditLogs,
        alerts,
        orgInfo,
        orgStats,
        securityScores,
        policyTrends,
        recommendations
      ] = await Promise.allSettled([
        graphService.getUsers(500),
        graphService.getConditionalAccessPolicies(),
        graphService.getDeviceCompliancePolicies(),
        graphService.getAuditLogs(200),
        graphService.getSecurityAlerts(100),
        graphService.getOrganizationInfo(),
        graphService.getOrganizationStatistics(),
        graphService.getSecurityScore(),
        graphService.getPolicyTrends(),
        graphService.getSecurityRecommendations()
      ]);

      // Process users
      if (usersData.status === 'fulfilled') {
        setUsers(usersData.value);
      }

      // Combine all policies
      const allPolicies: Policy[] = [];
      if (conditionalAccessPolicies.status === 'fulfilled') {
        allPolicies.push(...conditionalAccessPolicies.value);
      }
      if (devicePolicies.status === 'fulfilled') {
        allPolicies.push(...devicePolicies.value);
      }
      setPolicies(allPolicies);

      // Process activities
      if (auditLogs.status === 'fulfilled') {
        setActivities(auditLogs.value);
      }

      // Process security alerts
      if (alerts.status === 'fulfilled') {
        setSecurityAlerts(alerts.value);
      }

      // Process organization info
      if (orgInfo.status === 'fulfilled') {
        setOrganizationInfo(orgInfo.value);
      }

      // Process reports data
      const reports = {
        organizationStats: orgStats.status === 'fulfilled' ? orgStats.value : null,
        securityScores: securityScores.status === 'fulfilled' ? securityScores.value : [],
        policyTrends: policyTrends.status === 'fulfilled' ? policyTrends.value : [],
        recommendations: recommendations.status === 'fulfilled' ? recommendations.value : []
      };
      setReportsData(reports);

    } catch (err) {
      console.error('Error fetching Graph data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we don't depend on any props or state

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = () => {
    fetchData();
  };

  return {
    policies,
    users,
    activities,
    securityAlerts,
    organizationInfo,
    reportsData,
    loading,
    error,
    refreshData,
    fetchData
  };
};