export interface Policy {
  id: string;
  name: string;
  type: 'Security' | 'Compliance' | 'Device' | 'App' | 'Data' | 'Identity';
  status: 'Active' | 'Inactive' | 'Pending' | 'Draft';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  lastModified: Date;
  createdBy: string;
  affectedUsers: number;
  description: string;
  tags: string[];
}

export interface PolicyBackup {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdDateTime: Date;
  snapshotDateTime: Date;
  policiesCount: number;
  policies: {
    conditionalAccess: object[];
    deviceCompliance: object[];
    deviceConfiguration: object[];
    appProtection: object[];
  };
  metadata: {
    tenantId: string;
    version: string;
    tags: string[];
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Global Admin' | 'Security Admin' | 'Compliance Admin' | 'User Admin' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastLogin: Date;
  department: string;
}

export interface Activity {
  id: string;
  type: 'Policy Created' | 'Policy Modified' | 'Policy Deleted' | 'User Login' | 'Security Alert';
  description: string;
  timestamp: Date;
  user: string;
  severity: 'Info' | 'Warning' | 'Error' | 'Success';
}

export interface DashboardMetrics {
  totalPolicies: number;
  activePolicies: number;
  pendingPolicies: number;
  totalUsers: number;
  securityAlerts: number;
  complianceScore: number;
}