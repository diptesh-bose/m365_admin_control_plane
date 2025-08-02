import { Policy, User, Activity, DashboardMetrics } from '../types';

const policyTypes = ['Security', 'Compliance', 'Device', 'App', 'Data', 'Identity'] as const;
const statuses = ['Active', 'Inactive', 'Pending', 'Draft'] as const;
const priorities = ['Critical', 'High', 'Medium', 'Low'] as const;

export const generateMockPolicies = (count: number): Policy[] => {
  const policies: Policy[] = [];
  
  for (let i = 1; i <= count; i++) {
    const policy: Policy = {
      id: `policy-${i}`,
      name: `Policy ${i.toString().padStart(4, '0')} - ${policyTypes[Math.floor(Math.random() * policyTypes.length)]}`,
      type: policyTypes[Math.floor(Math.random() * policyTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      createdBy: `admin${Math.floor(Math.random() * 20) + 1}@contoso.com`,
      affectedUsers: Math.floor(Math.random() * 10000) + 100,
      description: `This policy manages ${policyTypes[Math.floor(Math.random() * policyTypes.length)].toLowerCase()} settings and configurations for organizational compliance.`,
      tags: ['microsoft365', 'compliance', 'security'].slice(0, Math.floor(Math.random() * 3) + 1)
    };
    policies.push(policy);
  }
  
  return policies;
};

export const mockUsers: User[] = Array.from({ length: 150 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `Administrator ${i + 1}`,
  email: `admin${i + 1}@contoso.com`,
  role: ['Global Admin', 'Security Admin', 'Compliance Admin', 'User Admin', 'Viewer'][Math.floor(Math.random() * 5)] as any,
  status: Math.random() > 0.1 ? 'Active' : 'Inactive',
  lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  department: ['IT', 'Security', 'Compliance', 'HR', 'Finance'][Math.floor(Math.random() * 5)]
}));

export const mockActivities: Activity[] = Array.from({ length: 100 }, (_, i) => ({
  id: `activity-${i + 1}`,
  type: ['Policy Created', 'Policy Modified', 'Policy Deleted', 'User Login', 'Security Alert'][Math.floor(Math.random() * 5)] as any,
  description: `Activity ${i + 1} - System operation performed`,
  timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
  user: `admin${Math.floor(Math.random() * 20) + 1}@contoso.com`,
  severity: ['Info', 'Warning', 'Error', 'Success'][Math.floor(Math.random() * 4)] as any
}));

export const mockMetrics: DashboardMetrics = {
  totalPolicies: 12547,
  activePolicies: 10234,
  pendingPolicies: 156,
  totalUsers: 25678,
  securityAlerts: 23,
  complianceScore: 94
};