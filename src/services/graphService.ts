import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../config/authConfig';

// Type definitions for Graph API responses
interface GraphUser {
  id: string;
  displayName: string;
  userPrincipalName: string;
  accountEnabled: boolean;
  createdDateTime?: string;
  lastSignInDateTime?: string;
  department?: string;
  jobTitle?: string;
  signInActivity?: {
    lastSignInDateTime?: string;
  };
}

interface GraphPolicy {
  id: string;
  displayName: string;
  state?: string;
  modifiedDateTime?: string;
  lastModifiedDateTime?: string;
  createdDateTime?: string;
  description?: string;
  conditions?: {
    applications?: { includeApplications?: string[] };
    users?: { includeUsers?: string[] };
  };
}

interface GraphAuditLog {
  id: string;
  category: string;
  activityDisplayName: string;
  activityDateTime: string;
  initiatedBy?: {
    user?: { userPrincipalName?: string };
  };
  result?: {
    resultType?: string;
  };
}

interface GraphSecurityRecommendation {
  id: string;
  title: string;
  implementationCost?: string;
  userImpact?: string;
  complianceInformation?: unknown;
  actionType?: string;
  controlStateUpdates?: Array<{
    assignedTo?: string;
  }>;
}

interface GraphDevice {
  id: string;
  accountEnabled: boolean;
  approximateLastSignInDateTime?: string;
}

class GraphService {
  private graphClient: Client | null = null;
  private msalInstance: PublicClientApplication;

  constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
  }

  async initialize() {
    await this.msalInstance.initialize();
    
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
      this.msalInstance,
      {
        account: this.msalInstance.getActiveAccount()!,
        scopes: loginRequest.scopes,
        interactionType: 'redirect',
      }
    );

    this.graphClient = Client.initWithMiddleware({ authProvider });
  }

  async getUsers(top: number = 100) {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api('/users')
        .select('id,displayName,userPrincipalName,accountEnabled,createdDateTime,lastSignInDateTime,department,jobTitle')
        .top(top)
        .get();
      
      return response.value.map((user: GraphUser) => ({
        id: user.id,
        name: user.displayName,
        email: user.userPrincipalName,
        status: user.accountEnabled ? 'Active' : 'Inactive',
        lastLogin: user.lastSignInDateTime ? new Date(user.lastSignInDateTime) : new Date(),
        department: user.department || 'Unknown',
        role: this.mapUserRole(user.jobTitle || '')
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getConditionalAccessPolicies() {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api('/identity/conditionalAccess/policies')
        .get();
      
      return response.value.map((policy: GraphPolicy) => ({
        id: policy.id,
        name: policy.displayName,
        type: 'Security',
        status: policy.state === 'enabled' ? 'Active' : 'Inactive',
        priority: this.mapPolicyPriority(policy),
        lastModified: new Date(policy.modifiedDateTime || policy.createdDateTime || new Date()),
        createdBy: policy.createdDateTime,
        affectedUsers: 0, // Would need additional API calls to calculate
        description: policy.displayName,
        tags: ['conditional-access', 'security']
      }));
    } catch (error) {
      console.error('Error fetching conditional access policies:', error);
      throw error;
    }
  }

  async getDeviceCompliancePolicies() {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api('/deviceManagement/deviceCompliancePolicies')
        .get();
      
      return response.value.map((policy: GraphPolicy) => ({
        id: policy.id,
        name: policy.displayName,
        type: 'Device',
        status: 'Active', // Device policies are typically active when created
        priority: 'Medium',
        lastModified: new Date(policy.lastModifiedDateTime || policy.createdDateTime || new Date()),
        createdBy: policy.createdDateTime,
        affectedUsers: 0,
        description: policy.description || policy.displayName,
        tags: ['device-compliance', 'intune']
      }));
    } catch (error) {
      console.error('Error fetching device compliance policies:', error);
      throw error;
    }
  }

  async getAuditLogs(top: number = 100) {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api('/auditLogs/directoryAudits')
        .select('id,category,activityDisplayName,activityDateTime,initiatedBy,result')
        .top(top)
        .orderby('activityDateTime desc')
        .get();
      
      return response.value.map((log: GraphAuditLog) => ({
        id: log.id,
        type: log.activityDisplayName,
        description: `${log.category}: ${log.activityDisplayName}`,
        timestamp: new Date(log.activityDateTime),
        user: log.initiatedBy?.user?.userPrincipalName || 'System',
        severity: this.mapLogSeverity(log.result)
      }));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  async getSecurityAlerts(top: number = 50) {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api('/security/alerts_v2')
        .select('id,title,description,severity,status,createdDateTime,classification')
        .top(top)
        .orderby('createdDateTime desc')
        .get();
      
      return response.value;
    } catch (error) {
      console.error('Error fetching security alerts:', error);
      throw error;
    }
  }

  async getOrganizationInfo() {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api('/organization')
        .select('id,displayName,verifiedDomains,assignedPlans')
        .get();
      
      return response.value[0];
    } catch (error) {
      console.error('Error fetching organization info:', error);
      throw error;
    }
  }

  async getOrganizationStatistics() {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      // Get organization info and user statistics
      const [orgResponse, usersResponse, devicesResponse] = await Promise.allSettled([
        this.graphClient.api('/organization').select('id,displayName,verifiedDomains').get(),
        this.graphClient.api('/users').select('id,accountEnabled,signInActivity').top(999).get(),
        this.graphClient.api('/devices').select('id,accountEnabled,approximateLastSignInDateTime').top(500).get()
      ]);

      const users = usersResponse.status === 'fulfilled' ? usersResponse.value.value : [];
      const devices = devicesResponse.status === 'fulfilled' ? devicesResponse.value.value : [];
      
      const activeUsers = users.filter((user: GraphUser) => user.accountEnabled).length;
      const totalUsers = users.length;
      const activeDevices = devices.filter((device: GraphDevice) => device.accountEnabled).length;

      return {
        totalUsers,
        activeUsers,
        activeDevices,
        userGrowthRate: this.calculateGrowthRate(users),
        organizationInfo: orgResponse.status === 'fulfilled' ? orgResponse.value.value[0] : null
      };
    } catch (error) {
      console.error('Error fetching organization statistics:', error);
      throw error;
    }
  }

  async getSignInLogs(days: number = 30) {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const response = await this.graphClient
        .api('/auditLogs/signIns')
        .filter(`createdDateTime ge ${startDate.toISOString()}`)
        .select('id,createdDateTime,status,userDisplayName,appDisplayName,riskLevel')
        .top(1000)
        .orderby('createdDateTime desc')
        .get();
      
      return response.value;
    } catch (error) {
      console.error('Error fetching sign-in logs:', error);
      // Return empty array if sign-in logs are not accessible
      return [];
    }
  }

  async getSecurityScore() {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api('/security/secureScores')
        .select('id,createdDateTime,currentScore,maxScore,averageComparativeScores')
        .top(30)
        .orderby('createdDateTime desc')
        .get();
      
      return response.value;
    } catch (error) {
      console.error('Error fetching security scores:', error);
      // Return empty array if security scores are not accessible
      return [];
    }
  }

  async getPolicyTrends(days: number = 180) {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const response = await this.graphClient
        .api('/auditLogs/directoryAudits')
        .filter(`activityDateTime ge ${startDate.toISOString()} and category eq 'Policy'`)
        .select('id,activityDisplayName,activityDateTime,result')
        .top(1000)
        .orderby('activityDateTime desc')
        .get();
      
      return response.value;
    } catch (error) {
      console.error('Error fetching policy trends:', error);
      return [];
    }
  }

  async getSecurityRecommendations() {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api('/security/secureScoreControlProfiles')
        .select('id,title,implementationCost,userImpact,complianceInformation,actionType,controlStateUpdates')
        .top(20)
        .get();
      
      return response.value.map((rec: GraphSecurityRecommendation) => ({
        id: rec.id,
        title: rec.title,
        impact: this.mapRecommendationImpact(rec.userImpact || 'Medium'),
        status: this.mapRecommendationStatus(rec.controlStateUpdates || []),
        implementationCost: rec.implementationCost,
        actionType: rec.actionType
      }));
    } catch (error) {
      console.error('Error fetching security recommendations:', error);
      // Return sample recommendations if API is not accessible
      return this.getFallbackRecommendations();
    }
  }

  private calculateGrowthRate(users: GraphUser[]): number {
    // Calculate user growth rate based on creation dates
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentUsers = users.filter(user => 
      user.createdDateTime && new Date(user.createdDateTime) > thirtyDaysAgo
    ).length;
    
    return users.length > 0 ? (recentUsers / users.length) * 100 : 0;
  }

  private mapRecommendationImpact(impact: string): string {
    switch (impact?.toLowerCase()) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  }

  private mapRecommendationStatus(updates: Array<{ assignedTo?: string }>): string {
    if (!updates || updates.length === 0) return 'Not Started';
    
    const latestUpdate = updates[updates.length - 1];
    switch (latestUpdate.assignedTo?.toLowerCase()) {
      case 'completed': return 'Completed';
      case 'inprogress': return 'In Progress';
      default: return 'Pending';
    }
  }

  private getFallbackRecommendations() {
    return [
      { id: '1', title: 'Enable Multi-Factor Authentication', impact: 'High', status: 'Pending' },
      { id: '2', title: 'Update Data Loss Prevention Policies', impact: 'Medium', status: 'In Progress' },
      { id: '3', title: 'Review Guest User Access', impact: 'High', status: 'Pending' },
      { id: '4', title: 'Configure Conditional Access', impact: 'Critical', status: 'Not Started' },
      { id: '5', title: 'Update Mobile Device Management', impact: 'Medium', status: 'Completed' }
    ];
  }

  private mapUserRole(jobTitle: string): string {
    if (!jobTitle) return 'Viewer';
    
    const title = jobTitle.toLowerCase();
    if (title.includes('admin') || title.includes('administrator')) {
      if (title.includes('global') || title.includes('tenant')) return 'Global Admin';
      if (title.includes('security')) return 'Security Admin';
      if (title.includes('compliance')) return 'Compliance Admin';
      return 'User Admin';
    }
    return 'Viewer';
  }

  private mapPolicyPriority(policy: GraphPolicy): string {
    // Map based on policy conditions complexity
    const conditions = policy.conditions;
    if (conditions?.applications?.includeApplications?.includes('All')) return 'Critical';
    if (conditions?.users?.includeUsers?.includes('All')) return 'High';
    return 'Medium';
  }

  private mapLogSeverity(result?: { resultType?: string }): string {
    if (result?.resultType === 'success') return 'Success';
    if (result?.resultType === 'failure') return 'Error';
    return 'Info';
  }

  // Policy Backup and Restore Methods
  async createPolicyBackup(name: string, description: string): Promise<object> {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      // Get all policy types
      const [conditionalAccess, deviceCompliance] = await Promise.all([
        this.getRawConditionalAccessPolicies(),
        this.getRawDeviceCompliancePolicies()
      ]);

      const backup = {
        name,
        description,
        createdDateTime: new Date().toISOString(),
        snapshotDateTime: new Date().toISOString(),
        createdBy: 'Current User', // TODO: Get current user
        policiesCount: conditionalAccess.length + deviceCompliance.length,
        policies: {
          conditionalAccess,
          deviceCompliance,
          deviceConfiguration: [], // TODO: Add when needed
          appProtection: [] // TODO: Add when needed
        },
        metadata: {
          tenantId: 'current-tenant', // TODO: Get tenant ID
          version: '1.0',
          tags: ['manual-backup']
        }
      };

      // Store backup in SharePoint Lists or another storage solution
      // For now, we'll use browser local storage as a demo
      const backupId = `backup_${Date.now()}`;
      const existingBackups = JSON.parse(localStorage.getItem('policyBackups') || '[]');
      existingBackups.push({ id: backupId, ...backup });
      localStorage.setItem('policyBackups', JSON.stringify(existingBackups));

      return { id: backupId, ...backup };
    } catch (error) {
      console.error('Error creating policy backup:', error);
      throw error;
    }
  }

  async getRawConditionalAccessPolicies(): Promise<object[]> {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api('/identity/conditionalAccess/policies')
        .get();
      
      return response.value || [];
    } catch (error) {
      console.error('Error fetching raw conditional access policies:', error);
      return [];
    }
  }

  async getRawDeviceCompliancePolicies(): Promise<object[]> {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api('/deviceManagement/deviceCompliancePolicies')
        .get();
      
      return response.value || [];
    } catch (error) {
      console.error('Error fetching raw device compliance policies:', error);
      return [];
    }
  }

  async listPolicyBackups(): Promise<object[]> {
    try {
      const backups = JSON.parse(localStorage.getItem('policyBackups') || '[]');
      return backups.sort((a: Record<string, unknown>, b: Record<string, unknown>) => 
        new Date(b.createdDateTime as string).getTime() - new Date(a.createdDateTime as string).getTime()
      );
    } catch (error) {
      console.error('Error listing policy backups:', error);
      return [];
    }
  }

  async deletePolicyBackup(backupId: string): Promise<void> {
    try {
      const backups = JSON.parse(localStorage.getItem('policyBackups') || '[]');
      const filteredBackups = backups.filter((backup: Record<string, unknown>) => backup.id !== backupId);
      localStorage.setItem('policyBackups', JSON.stringify(filteredBackups));
    } catch (error) {
      console.error('Error deleting policy backup:', error);
      throw error;
    }
  }

  async restorePolicyBackup(backupId: string, selectedPolicyTypes: string[]): Promise<object> {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const backups = JSON.parse(localStorage.getItem('policyBackups') || '[]');
      const backup = backups.find((b: Record<string, unknown>) => b.id === backupId);
      
      if (!backup) {
        throw new Error('Backup not found');
      }

      const restoreResults = {
        conditionalAccess: { success: 0, failed: 0, errors: [] as string[] },
        deviceCompliance: { success: 0, failed: 0, errors: [] as string[] }
      };

      // Restore Conditional Access Policies
      if (selectedPolicyTypes.includes('conditionalAccess') && backup.policies?.conditionalAccess) {
        for (const policy of backup.policies.conditionalAccess as Record<string, unknown>[]) {
          try {
            // Create a new policy with a modified name to avoid conflicts
            const newPolicy = {
              ...policy,
              displayName: `${policy.displayName} (Restored ${new Date().toLocaleDateString()})`,
              state: 'disabled' // Start disabled for safety
            } as Record<string, unknown>;
            delete (newPolicy as Record<string, unknown>).id; // Remove ID to create new policy
            delete (newPolicy as Record<string, unknown>).createdDateTime;
            delete (newPolicy as Record<string, unknown>).modifiedDateTime;

            await this.graphClient
              .api('/identity/conditionalAccess/policies')
              .post(newPolicy);
            
            restoreResults.conditionalAccess.success++;
          } catch (error) {
            restoreResults.conditionalAccess.failed++;
            restoreResults.conditionalAccess.errors.push(`${policy.displayName}: ${error}`);
          }
        }
      }

      // Restore Device Compliance Policies
      if (selectedPolicyTypes.includes('deviceCompliance') && backup.policies?.deviceCompliance) {
        for (const policy of backup.policies.deviceCompliance as Record<string, unknown>[]) {
          try {
            const newPolicy = {
              ...policy,
              displayName: `${policy.displayName} (Restored ${new Date().toLocaleDateString()})`
            } as Record<string, unknown>;
            delete (newPolicy as Record<string, unknown>).id;
            delete (newPolicy as Record<string, unknown>).createdDateTime;
            delete (newPolicy as Record<string, unknown>).lastModifiedDateTime;

            await this.graphClient
              .api('/deviceManagement/deviceCompliancePolicies')
              .post(newPolicy);
            
            restoreResults.deviceCompliance.success++;
          } catch (error) {
            restoreResults.deviceCompliance.failed++;
            restoreResults.deviceCompliance.errors.push(`${policy.displayName}: ${error}`);
          }
        }
      }

      return restoreResults;
    } catch (error) {
      console.error('Error restoring policy backup:', error);
      throw error;
    }
  }
}

export const graphService = new GraphService();