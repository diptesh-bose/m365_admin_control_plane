import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../config/authConfig';
import { 
  User, 
  Policy, 
  DeviceConfigurationPolicy
} from '../types';

// Interface definitions
interface GraphUser {
  id: string;
  displayName: string;
  userPrincipalName: string;
  accountEnabled: boolean;
  createdDateTime?: string;
  lastSignInDateTime?: string;
  department?: string;
  jobTitle?: string;
}

interface GraphPolicy {
  id: string;
  displayName: string;
  description?: string;
  state?: string;
  modifiedDateTime?: string;
  createdDateTime?: string;
}

interface GraphDeviceConfigurationPolicy {
  id: string;
  displayName?: string;
  description?: string;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  version?: number;
  '@odata.type'?: string;
  platformType?: string;
  roleScopeTagIds?: string[];
  technologies?: string[];
}

interface GraphDeviceCompliancePolicy {
  id: string;
  displayName?: string;
  description?: string;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  version?: number;
  assignments?: unknown[];
  scheduledActionsForRule?: unknown[];
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
        interactionType: InteractionType.Redirect,
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
    } catch (error: unknown) {
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
        type: 'Conditional Access',
        status: policy.state || 'disabled',
        priority: null,
        lastModified: new Date(policy.modifiedDateTime || policy.createdDateTime || new Date()),
        createdBy: policy.createdDateTime,
        affectedUsers: 0,
        description: policy.description || policy.displayName,
        tags: ['conditional-access', 'security']
      }));
    } catch (error: unknown) {
      console.error('Error fetching conditional access policies:', error);
      throw error;
    }
  }

  async getDeviceConfigurationPolicies(top: number = 100) {
    console.log('getDeviceConfigurationPolicies called with top:', top);
    console.log('Graph client initialized:', !!this.graphClient);
    
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api('/deviceManagement/deviceConfigurations')
        .select('id,displayName,description,createdDateTime,lastModifiedDateTime,version,platformType,roleScopeTagIds')
        .top(top)
        .orderby('lastModifiedDateTime desc')
        .get();
      
      console.log('Device Configuration Policies Response:', response);
      
      return response.value.map((policy: GraphDeviceConfigurationPolicy) => ({
        id: policy.id,
        displayName: policy.displayName || 'Unknown Policy',
        description: policy.description,
        createdDateTime: policy.createdDateTime ? new Date(policy.createdDateTime) : new Date(),
        lastModifiedDateTime: policy.lastModifiedDateTime ? new Date(policy.lastModifiedDateTime) : new Date(),
        version: policy.version || 1,
        '@odata.type': policy['@odata.type'] || '#microsoft.graph.deviceConfiguration',
        platformType: policy.platformType || 'unknown',
        roleScopeTagIds: policy.roleScopeTagIds || [],
        configurationCategory: this.getConfigurationCategory(policy['@odata.type'] || ''),
        technologies: policy.technologies || [],
        deviceStatusOverview: {
          pendingCount: 0,
          notApplicableCount: 0,
          notApplicablePlatformCount: 0,
          successCount: 0,
          errorCount: 0,
          failedCount: 0,
          conflictCount: 0,
          configurationVersion: policy.version || 1
        },
        userStatusOverview: {
          pendingCount: 0,
          notApplicableCount: 0,
          successCount: 0,
          errorCount: 0,
          failedCount: 0,
          conflictCount: 0,
          configurationVersion: policy.version || 1
        },
        deviceStatuses: [],
        userStatuses: [],
        assignments: []
      }));
    } catch (error: unknown) {
      console.error('Error fetching device configuration policies:', error);
      return [];
    }
  }

  async getSettingsCatalogPolicies(top: number = 100) {
    console.log('🔍 Starting comprehensive Device Configuration Policies fetch');
    console.log('Graph client initialized:', !!this.graphClient);
    
    if (!this.graphClient) {
      console.error('❌ Graph client not initialized - attempting to initialize...');
      try {
        await this.initialize();
        console.log('✅ Graph client initialization attempted');
      } catch (initError) {
        console.error('❌ Failed to initialize Graph client:', initError);
        throw new Error('Graph client not initialized and initialization failed');
      }
    }
    
    if (!this.graphClient) {
      throw new Error('Graph client still not available after initialization attempt');
    }

    try {
      console.log('🔗 Testing basic Graph connectivity...');
      const testResponse = await this.graphClient.api('/me').get();
      console.log('✅ Graph connectivity test successful:', testResponse.displayName);
    } catch (connectivityError) {
      console.error('❌ Graph connectivity test failed:', connectivityError);
      throw new Error('Graph client authentication failed');
    }
    
    try {
      const allPolicies: (DeviceConfigurationPolicy & { 
        name: string; 
        platforms: string; 
        technologies: string; 
        isAssigned: boolean; 
        settingCount: number; 
        settings: unknown[]; 
        policyType: string;
      })[] = [];
      
      // 1. Device Configuration Profiles
      try {
        console.log('📱 Fetching Device Configuration Profiles...');
        const deviceConfigResponse = await this.graphClient
          .api('/deviceManagement/deviceConfigurations')
          .select('id,displayName,description,createdDateTime,lastModifiedDateTime,@odata.type,version')
          .top(top)
          .orderby('lastModifiedDateTime desc')
          .get();
        
        console.log('✅ Device Configuration Profiles:', deviceConfigResponse?.value?.length || 0, 'profiles');
        
        if (deviceConfigResponse?.value?.length > 0) {
          const deviceConfigPolicies = deviceConfigResponse.value.map((config: Record<string, unknown>) => ({
            id: config.id as string,
            name: (config.displayName as string) || 'Unknown Configuration',
            displayName: (config.displayName as string) || 'Unknown Configuration',
            description: (config.description as string) || '',
            createdDateTime: config.createdDateTime ? new Date(config.createdDateTime as string) : new Date(),
            lastModifiedDateTime: config.lastModifiedDateTime ? new Date(config.lastModifiedDateTime as string) : new Date(),
            '@odata.type': (config['@odata.type'] as string) || '#microsoft.graph.deviceConfiguration',
            platforms: this.extractPlatformFromODataType(config['@odata.type'] as string),
            technologies: 'mdm',
            isAssigned: false,
            settingCount: 0,
            roleScopeTagIds: [],
            settings: [],
            assignments: [],
            policyType: this.getPolicyTypeName(config['@odata.type'] as string)
          }));
          allPolicies.push(...deviceConfigPolicies);
          console.log('✅ Added', deviceConfigPolicies.length, 'Device Configuration policies');
        }
      } catch (error) {
        console.warn('⚠️ Device Configuration Profiles endpoint failed:', error);
      }

      // 2. Device Compliance Policies
      try {
        console.log('📋 Fetching Device Compliance Policies...');
        const deviceComplianceResponse = await this.graphClient
          .api('/deviceManagement/deviceCompliancePolicies')
          .select('id,displayName,description,createdDateTime,lastModifiedDateTime,@odata.type,version')
          .top(top)
          .orderby('lastModifiedDateTime desc')
          .get();
        
        console.log('✅ Device Compliance Policies:', deviceComplianceResponse?.value?.length || 0, 'policies');
        
        if (deviceComplianceResponse?.value?.length > 0) {
          const deviceCompliancePolicies = deviceComplianceResponse.value.map((policy: Record<string, unknown>) => ({
            id: policy.id as string,
            name: (policy.displayName as string) || 'Unknown Compliance Policy',
            displayName: (policy.displayName as string) || 'Unknown Compliance Policy',
            description: (policy.description as string) || '',
            createdDateTime: policy.createdDateTime ? new Date(policy.createdDateTime as string) : new Date(),
            lastModifiedDateTime: policy.lastModifiedDateTime ? new Date(policy.lastModifiedDateTime as string) : new Date(),
            '@odata.type': (policy['@odata.type'] as string) || '#microsoft.graph.deviceCompliancePolicy',
            platforms: this.extractPlatformFromODataType(policy['@odata.type'] as string),
            technologies: 'mdm',
            isAssigned: false,
            settingCount: 0,
            roleScopeTagIds: [],
            settings: [],
            assignments: [],
            policyType: 'Device Compliance'
          }));
          allPolicies.push(...deviceCompliancePolicies);
          console.log('✅ Added', deviceCompliancePolicies.length, 'Device Compliance policies');
        }
      } catch (error) {
        console.warn('⚠️ Device Compliance Policies endpoint failed:', error);
      }

      console.log(`📊 Total policies found across all endpoints: ${allPolicies.length}`);
      console.log('📈 Breakdown by type:', {
        'Device Configuration': allPolicies.filter((p: { policyType: string }) => 
          p.policyType.includes('Configuration') || 
          p.policyType.includes('Windows') || 
          p.policyType.includes('Android') || 
          p.policyType.includes('iOS') || 
          p.policyType.includes('macOS')
        ).length,
        'Device Compliance': allPolicies.filter((p: { policyType: string }) => 
          p.policyType === 'Device Compliance'
        ).length
      });

      return allPolicies;
    } catch (error: unknown) {
      console.error('❌ Error fetching Device Configuration Policies:', error);
      throw error;
    }
  }

  async getDeviceCompliancePolicies(top: number = 100) {
    console.log('getDeviceCompliancePolicies called with top:', top);
    console.log('Graph client initialized:', !!this.graphClient);
    
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api('/deviceManagement/deviceCompliancePolicies')
        .select('id,displayName,description,createdDateTime,lastModifiedDateTime,version')
        .top(top)
        .orderby('lastModifiedDateTime desc')
        .get();
      
      console.log('Device Compliance Policies Response:', response);
      
      return response.value.map((policy: GraphDeviceCompliancePolicy) => ({
        id: policy.id,
        displayName: policy.displayName || 'Unknown Policy',
        description: policy.description,
        createdDateTime: policy.createdDateTime ? new Date(policy.createdDateTime) : new Date(),
        lastModifiedDateTime: policy.lastModifiedDateTime ? new Date(policy.lastModifiedDateTime) : new Date(),
        version: policy.version || 1,
        assignments: [],
        scheduledActionsForRule: []
      }));
    } catch (error: unknown) {
      console.error('Error fetching device compliance policies:', error);
      return [];
    }
  }

  async getDeviceConfigurationPolicyAssignments(policyId: string) {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api(`/deviceManagement/deviceConfigurations/${policyId}/assignments`)
        .get();
      
      return response.value || [];
    } catch (error: unknown) {
      console.error('Error fetching device configuration policy assignments:', error);
      return [];
    }
  }

  async getDeviceConfigurationPolicyDeviceStatuses(policyId: string) {
    if (!this.graphClient) throw new Error('Graph client not initialized');
    
    try {
      const response = await this.graphClient
        .api(`/deviceManagement/deviceConfigurations/${policyId}/deviceStatuses`)
        .get();
      
      return response.value || [];
    } catch (error: unknown) {
      console.error('Error fetching device configuration policy device statuses:', error);
      return [];
    }
  }

  private getConfigurationCategory(odataType: string): string {
    if (!odataType) return 'Device Configuration';
    
    const type = odataType.toLowerCase();
    if (type.includes('deviceconfiguration')) return 'Device Configuration';
    
    return 'Device Configuration';
  }

  private extractPlatformFromODataType(odataType?: string): string {
    if (!odataType) return 'Unknown';
    
    const type = odataType.toLowerCase();
    if (type.includes('windows')) return 'Windows';
    if (type.includes('ios')) return 'iOS';
    if (type.includes('android')) return 'Android';
    if (type.includes('macos')) return 'macOS';
    
    return 'Cross-platform';
  }

  private getPolicyTypeName(odataType?: string): string {
    if (!odataType) return 'Device Configuration';
    
    const type = odataType.toLowerCase();
    if (type.includes('compliance')) return 'Device Compliance';
    if (type.includes('windows')) return 'Windows Configuration';
    if (type.includes('ios')) return 'iOS Configuration';
    if (type.includes('android')) return 'Android Configuration';
    if (type.includes('macos')) return 'macOS Configuration';
    if (type.includes('deviceconfiguration')) return 'Device Configuration';
    
    return 'Device Configuration';
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

  // Stub methods for other functionality - add implementations as needed
  async getAuditLogs(_top: number = 100): Promise<unknown[]> {
    return [];
  }

  async getSecurityAlerts(_top: number = 50): Promise<unknown[]> {
    return [];
  }

  async getOrganizationInfo(): Promise<unknown> {
    return {};
  }

  async getOrganizationStatistics(): Promise<unknown> {
    return {};
  }

  async getSignInLogs(_days: number = 30): Promise<unknown[]> {
    return [];
  }

  async getSecurityScore(): Promise<unknown[]> {
    return [];
  }

  async getPolicyTrends(_days: number = 30): Promise<unknown[]> {
    return [];
  }

  async getSecurityRecommendations(): Promise<unknown[]> {
    return [];
  }
}

export const graphService = new GraphService();
