export interface Policy {
  id: string;
  name: string;
  type: 'Conditional Access' | 'Device Compliance' | 'Device Configuration' | 'App Protection' | 'Security' | 'Compliance';
  status: 'enabled' | 'disabled' | 'enabledForReportingButNotEnforced'; // Actual Microsoft Graph API values
  priority: number | null; // Actual priority value from API, or null if not available
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

// Microsoft Intune Types
export interface ManagedDevice {
  id: string;
  deviceName: string;
  managedDeviceOwnerType: 'unknown' | 'company' | 'personal';
  enrolledDateTime: Date;
  lastSyncDateTime: Date;
  operatingSystem: 'Windows' | 'iOS' | 'macOS' | 'Android' | 'Linux' | 'Unknown';
  osVersion: string;
  deviceType: 'desktop' | 'windowsRT' | 'winMO6' | 'nokia' | 'windowsPhone' | 'mac' | 'winCE' | 'winEmbedded' | 'iPhone' | 'iPad' | 'iPod' | 'android' | 'iSocConsumer' | 'unix' | 'macMDM' | 'holoLens' | 'surfaceHub' | 'androidForWork' | 'androidEnterprise' | 'windows10x' | 'androidnGMS' | 'cloudPC' | 'blackberry' | 'palm' | 'unknown';
  complianceState: 'unknown' | 'compliant' | 'noncompliant' | 'conflict' | 'error' | 'inGracePeriod' | 'configManager';
  jailBroken: 'Unknown' | 'False' | 'True';
  managementAgent: 'eas' | 'mdm' | 'easMdm' | 'intuneClient' | 'easIntuneClient' | 'configurationManagerClient' | 'configurationManagerClientMdm' | 'configurationManagerClientMdmEas' | 'unknown' | 'jamf' | 'googleCloudDevicePolicyController' | 'microsoft365ManagedMdm' | 'msSense' | 'intuneAosp';
  azureADRegistered: boolean;
  deviceEnrollmentType: 'unknown' | 'userEnrollment' | 'deviceEnrollmentManager' | 'appleBulkWithUser' | 'appleBulkWithoutUser' | 'windowsAzureADJoin' | 'windowsBulkUserless' | 'windowsAutoEnrollment' | 'windowsBulkAzureDomainJoin' | 'windowsCoManagement' | 'windowsAzureADJoinUsingDeviceAuth' | 'appleUserEnrollment' | 'appleUserEnrollmentWithServiceAccount' | 'azureAdJoinUsingAzureVmExtension' | 'androidEnterpriseDedicatedDevice' | 'androidEnterpriseFullyManaged' | 'androidEnterpriseCorporateWorkProfile';
  activationLockBypassCode?: string;
  emailAddress?: string;
  azureADDeviceId?: string;
  deviceRegistrationState: 'notRegistered' | 'registered' | 'revoked' | 'keyConflict' | 'approvalPending' | 'certificateReset' | 'notRegisteredPendingEnrollment' | 'unknown';
  deviceCategoryDisplayName?: string;
  isSupervised: boolean;
  exchangeLastSuccessfulSyncDateTime?: Date;
  exchangeAccessState: 'none' | 'unknown' | 'allowed' | 'blocked' | 'quarantined';
  exchangeAccessStateReason: 'none' | 'unknown' | 'exchangeGlobalRule' | 'exchangeIndividualRule' | 'exchangeDeviceRule' | 'exchangeUpgrade' | 'exchangeMailboxPolicy' | 'other' | 'compliant' | 'notCompliant' | 'notEnrolled' | 'unknownLocation' | 'mfaRequired' | 'azureADBlockDueToAccessPolicy' | 'compromisedPassword' | 'deviceNotKnownWithManagedApp';
  remoteAssistanceSessionUrl?: string;
  remoteAssistanceSessionErrorDetails?: string;
  isEncrypted: boolean;
  userPrincipalName?: string;
  model?: string;
  manufacturer?: string;
  imei?: string;
  complianceGracePeriodExpirationDateTime?: Date;
  serialNumber?: string;
  phoneNumber?: string;
  androidSecurityPatchLevel?: string;
  userDisplayName?: string;
  configurationManagerClientEnabledFeatures?: {
    inventory: boolean;
    modernApps: boolean;
    resourceAccess: boolean;
    deviceConfiguration: boolean;
    compliancePolicy: boolean;
    windowsUpdateForBusiness: boolean;
    endpointProtection: boolean;
    officeApps: boolean;
  };
  wiFiMacAddress?: string;
  deviceHealthAttestationState?: {
    lastUpdateDateTime?: string;
    contentNamespaceUrl?: string;
    deviceHealthAttestationStatus?: string;
    contentVersion?: string;
    issuedDateTime?: Date;
    attestationIdentityKey?: string;
    resetCount?: number;
    restartCount?: number;
    dataExcutionPolicy?: string;
    bitLockerStatus?: string;
    bootManagerVersion?: string;
    codeIntegrityCheckVersion?: string;
    secureBoot?: string;
    bootDebugging?: string;
    operatingSystemKernelDebugging?: string;
    codeIntegrity?: string;
    testSigning?: string;
    safeMode?: string;
    windowsPE?: string;
    earlyLaunchAntiMalwareDriverProtection?: string;
    virtualSecureMode?: string;
    pcrHashAlgorithm?: string;
    bootAppSecurityVersion?: string;
    bootManagerSecurityVersion?: string;
    tpmVersion?: string;
    pcr0?: string;
    secureBootConfigurationPolicyFingerPrint?: string;
    codeIntegrityPolicy?: string;
    bootRevisionListInfo?: string;
    operatingSystemRevListInfo?: string;
    healthStatusMismatchInfo?: string;
    healthAttestationSupportedStatus?: string;
  };
  subscriberCarrier?: string;
  meid?: string;
  totalStorageSpaceInBytes?: number;
  freeStorageSpaceInBytes?: number;
  managedDeviceName?: string;
  partnerReportedThreatState: 'unknown' | 'activated' | 'deactivated' | 'secured' | 'lowSeverity' | 'mediumSeverity' | 'highSeverity' | 'unresponsive' | 'compromised' | 'misconfigured';
  retireAfterDateTime?: Date;
  usersLoggedOn?: {
    userId: string;
    lastLogOnDateTime: Date;
  }[];
  preferMdmOverGroupPolicyAppliedDateTime?: Date;
  autopilotEnrolled: boolean;
  requireUserEnrollmentApproval?: boolean;
  managementCertificateExpirationDate?: Date;
  iccid?: string;
  udid?: string;
  roleScopeTagIds?: string[];
  windowsActiveMalwareCount?: number;
  windowsRemediatedMalwareCount?: number;
  notes?: string;
  configurationManagerClientHealthState?: {
    state: 'unknown' | 'installed' | 'healthy' | 'installFailed' | 'updateFailed' | 'communicationError';
    errorCode?: number;
    lastSyncDateTime?: Date;
  };
  configurationManagerClientInformation?: {
    clientIdentifier?: string;
    isBlocked?: boolean;
  };
  ethernetMacAddress?: string;
  physicalMemoryInBytes?: number;
  processorArchitecture: 'unknown' | 'x86' | 'x64' | 'arm' | 'arM64';
  specificationVersion?: string;
  joinType: 'unknown' | 'azureADJoined' | 'azureADRegistered' | 'hybridAzureADJoined';
  skuFamily?: string;
  skuNumber?: number;
  managementFeatures: 'none' | 'microsoftManagedDesktop';
  chromeOSDeviceInfo?: {
    name?: string;
    chromeOSDeviceId?: string;
    lastSyncDateTime?: Date;
    supportEndDate?: Date;
  }[];
}

export interface MobileApp {
  id: string;
  displayName: string;
  description?: string;
  publisher?: string;
  largeIcon?: {
    type?: string;
    value?: string;
  };
  createdDateTime: Date;
  lastModifiedDateTime: Date;
  isFeatured: boolean;
  privacyInformationUrl?: string;
  informationUrl?: string;
  owner?: string;
  developer?: string;
  notes?: string;
  uploadState: 'success' | 'transientError' | 'azureStorageUriRequestSuccess' | 'azureStorageUriRequestPending' | 'azureStorageUriRequestFailed' | 'azureStorageUriRequestTimedOut' | 'azureStorageUriRenewalSuccess' | 'azureStorageUriRenewalPending' | 'azureStorageUriRenewalFailed' | 'azureStorageUriRenewalTimedOut' | 'commitFileSuccess' | 'commitFilePending' | 'commitFileFailed' | 'commitFileTimedOut';
  publishingState: 'notPublished' | 'processing' | 'published';
  isAssigned: boolean;
  roleScopeTagIds: string[];
  dependentAppCount: number;
  supersedingAppCount: number;
  supersededAppCount: number;
  appAvailability: 'lineOfBusiness' | 'global';
  version?: string;
  bundleId?: string;
  appStoreUrl?: string;
  applicableDeviceType?: {
    iPad: boolean;
    iPhoneAndIPod: boolean;
  };
  minimumSupportedOperatingSystem?: {
    v10_0?: boolean;
    v11_0?: boolean;
    v12_0?: boolean;
    v13_0?: boolean;
    v14_0?: boolean;
    v15_0?: boolean;
  };
}

export interface PolicyAssignment {
  id: string;
  target: DeviceAndAppManagementAssignmentTarget;
  source: 'direct' | 'policySets';
  sourceId?: string;
}

export interface DeviceAndAppManagementAssignmentTarget {
  '@odata.type': string;
  deviceAndAppManagementAssignmentFilterId?: string;
  deviceAndAppManagementAssignmentFilterType?: 'none' | 'include' | 'exclude';
}

export interface AllLicensedUsersAssignmentTarget extends DeviceAndAppManagementAssignmentTarget {
  '@odata.type': '#microsoft.graph.allLicensedUsersAssignmentTarget';
}

export interface AllDevicesAssignmentTarget extends DeviceAndAppManagementAssignmentTarget {
  '@odata.type': '#microsoft.graph.allDevicesAssignmentTarget';
}

export interface GroupAssignmentTarget extends DeviceAndAppManagementAssignmentTarget {
  '@odata.type': '#microsoft.graph.groupAssignmentTarget';
  groupId: string;
}

export interface DeviceCompliancePolicy {
  id: string;
  displayName: string;
  description?: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  version: number;
  assignments: PolicyAssignment[];
  scheduledActionsForRule: DeviceComplianceScheduledActionForRule[];
}

export interface DeviceComplianceScheduledActionForRule {
  id: string;
  ruleName?: string;
  scheduledActionConfigurations: DeviceComplianceActionItem[];
}

export interface DeviceComplianceActionItem {
  id: string;
  gracePeriodHours: number;
  actionType: 'noAction' | 'notification' | 'block' | 'retire' | 'wipe' | 'removeResourceAccessProfiles' | 'pushNotification';
  notificationTemplateId?: string;
  notificationMessageCCList?: string[];
}

export interface DeviceManagementApplicabilityRule {
  '@odata.type': string;
  ruleType: 'include' | 'exclude';
}

export interface DeviceConfigurationPolicy {
  id: string;
  displayName: string;
  description?: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  version: number;
  '@odata.type': string;
  deviceManagementApplicabilityRuleOsEdition?: DeviceManagementApplicabilityRule;
  deviceManagementApplicabilityRuleOsVersion?: DeviceManagementApplicabilityRule;
  deviceManagementApplicabilityRuleDeviceMode?: DeviceManagementApplicabilityRule;
  assignments: PolicyAssignment[];
  deviceStatuses: DeviceConfigurationDeviceStatus[];
  userStatuses: DeviceConfigurationUserStatus[];
  deviceStatusOverview: DeviceConfigurationDeviceOverview;
  userStatusOverview: DeviceConfigurationUserOverview;
  settingsXml?: string;
  platformType: 'windows10' | 'iOS' | 'android' | 'macOS' | 'windowsPhone81' | 'windows81AndLater';
  technologies: string[];
  configurationCategory: 'none' | 'deviceConfiguration' | 'deviceCompliance' | 'deviceEnrollment' | 'deviceCompliancePartnerIntegration' | 'endpointProtection';
  roleScopeTagIds: string[];
  policyType?: 'Settings Catalog' | 'Device Configuration' | 'Device Compliance' | 'Security Baseline' | 'Endpoint Security' | 'Windows 10 General Configuration' | 'Windows 10 Endpoint Protection' | 'Windows 10 Device Restrictions' | 'Windows 10 Custom' | 'Android General Configuration' | 'Android Work Profile' | 'iOS General Configuration' | 'macOS General Configuration';
}

export interface DeviceConfigurationDeviceStatus {
  id: string;
  deviceDisplayName: string;
  userName: string;
  deviceModel: string;
  platform: number;
  complianceGracePeriodExpirationDateTime: string;
  status: 'unknown' | 'notApplicable' | 'compliant' | 'remediated' | 'nonCompliant' | 'error' | 'conflict' | 'notAssigned';
  lastReportedDateTime: string;
  userPrincipalName: string;
}

export interface DeviceConfigurationUserStatus {
  id: string;
  userDisplayName: string;
  devicesCount: number;
  status: 'unknown' | 'notApplicable' | 'compliant' | 'remediated' | 'nonCompliant' | 'error' | 'conflict' | 'notAssigned';
  lastReportedDateTime: string;
  userPrincipalName: string;
}

export interface DeviceConfigurationDeviceOverview {
  pendingCount: number;
  notApplicableCount: number;
  notApplicablePlatformCount: number;
  successCount: number;
  errorCount: number;
  failedCount: number;
  conflictCount: number;
  configurationVersion: number;
}

export interface DeviceConfigurationUserOverview {
  pendingCount: number;
  notApplicableCount: number;
  successCount: number;
  errorCount: number;
  failedCount: number;
  conflictCount: number;
  configurationVersion: number;
}

export interface Windows10CustomConfiguration extends DeviceConfigurationPolicy {
  '@odata.type': '#microsoft.graph.windows10CustomConfiguration';
  omaSettings: OmaSetting[];
}

export interface Windows10GeneralConfiguration extends DeviceConfigurationPolicy {
  '@odata.type': '#microsoft.graph.windows10GeneralConfiguration';
  enterpriseCloudPrintDiscoveryEndPoint?: string;
  enterpriseCloudPrintOAuthAuthority?: string;
  enterpriseCloudPrintOAuthClientIdentifier?: string;
  enterpriseCloudPrintResourceIdentifier?: string;
  enterpriseCloudPrintDiscoveryMaxLimit?: number;
  enterpriseCloudPrintMopriaDiscoveryResourceIdentifier?: string;
  searchBlockDiacritics?: boolean;
  searchDisableAutoLanguageDetection?: boolean;
  searchDisableIndexingEncryptedItems?: boolean;
  searchEnableRemoteQueries?: boolean;
  searchDisableUseLocation?: boolean;
  searchDisableIndexerBackoff?: boolean;
  searchDisableIndexingRemovableDrive?: boolean;
  searchEnableAutomaticIndexSizeManangement?: boolean;
  diagnosticsDataSubmissionMode: 'userDefined' | 'none' | 'basic' | 'enhanced' | 'full';
  oneDriveDisableFileSync?: boolean;
  smartScreenEnableAppInstallControl?: boolean;
  personalizationDesktopImageUrl?: string;
  personalizationLockScreenImageUrl?: string;
  bluetoothAllowedServices?: string[];
  bluetoothBlockAdvertising?: boolean;
  bluetoothBlockPromiscuousMode?: boolean;
  bluetoothBlockDiscoverableMode?: boolean;
  bluetoothBlockPrePairing?: boolean;
  edgeBlockAutofill?: boolean;
  edgeBlocked?: boolean;
  edgeCookiePolicy: 'userDefined' | 'allow' | 'blockThirdParty' | 'blockAll';
  edgeBlockDeveloperTools?: boolean;
  edgeBlockSendingDoNotTrackHeader?: boolean;
  edgeBlockExtensions?: boolean;
  edgeBlockInPrivateBrowsing?: boolean;
  edgeBlockJavaScript?: boolean;
  edgeBlockPasswordManager?: boolean;
  edgeBlockAddressBarDropdown?: boolean;
  edgeBlockCompatibilityList?: boolean;
  edgeClearBrowsingDataOnExit?: boolean;
  edgeAllowStartPagesModification?: boolean;
  edgeDisableFirstRunPage?: boolean;
  edgeBlockLiveTileDataCollection?: boolean;
  edgeSyncFavoritesWithInternetExplorer?: boolean;
}

export interface OmaSetting {
  '@odata.type': string;
  displayName: string;
  description?: string;
  omaUri: string;
  value?: string;
  isEncrypted?: boolean;
}

export interface SettingsCatalogPolicy {
  '@odata.type': '#microsoft.graph.deviceManagementConfigurationPolicy';
  id: string;
  name: string;
  displayName: string;
  description?: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  platforms: 'none' | 'android' | 'iOS' | 'macOS' | 'windows10X' | 'windows10' | 'linux' | 'unknownFutureValue';
  technologies: 'none' | 'mdm' | 'windows10XManagement' | 'configManager' | 'appleRemoteManagement' | 'microsoftSense' | 'exchangeOnline' | 'linuxMdm' | 'enrollment' | 'unknownFutureValue';
  templateReference?: DeviceManagementConfigurationPolicyTemplateReference;
  settings: DeviceManagementConfigurationSetting[];
  creationSource?: string;
  isAssigned: boolean;
  settingCount: number;
  assignments: PolicyAssignment[];
  roleScopeTagIds: string[];
  policyType?: 'Settings Catalog' | 'Device Configuration' | 'Device Compliance' | 'Security Baseline' | 'Endpoint Security' | 'Windows 10 General Configuration' | 'Windows 10 Endpoint Protection' | 'Windows 10 Device Restrictions' | 'Windows 10 Custom' | 'Android General Configuration' | 'Android Work Profile' | 'iOS General Configuration' | 'macOS General Configuration';
}

export interface DeviceManagementConfigurationPolicyTemplateReference {
  templateId: string;
  templateFamily: 'none' | 'endpointSecurityAntivirus' | 'endpointSecurityDiskEncryption' | 'endpointSecurityFirewall' | 'endpointSecurityEndpointDetectionAndResponse' | 'endpointSecurityAttackSurfaceReduction' | 'endpointSecurityAccountProtection' | 'endpointSecurityApplicationControl' | 'endpointSecurityApplicationControlSupplementalPolicies' | 'endpointSecurityEndpointPrivilegeManagement' | 'enrollmentConfiguration' | 'appQuietTime' | 'baseline' | 'unknownFutureValue' | 'deviceConfigurationScripts' | 'deviceConfigurationPolicies' | 'windowsOsRecoveryPolicies' | 'companyPortal' | 'hardwarePasswordInfo' | 'configurationPolicies';
  templateDisplayName?: string;
  templateDisplayVersion?: string;
}

export interface DeviceManagementConfigurationSetting {
  '@odata.type': string;
  settingInstance: DeviceManagementConfigurationSettingInstance;
}

export interface DeviceManagementConfigurationSettingInstance {
  '@odata.type': string;
  settingDefinitionId: string;
  settingInstanceTemplateReference?: DeviceManagementConfigurationSettingInstanceTemplateReference;
}

export interface DeviceManagementConfigurationSettingInstanceTemplateReference {
  settingInstanceTemplateId: string;
}

export interface GraphDeviceManagementTemplate {
  id: string;
  displayName: string;
  description?: string;
  versionInfo?: string;
  isDeprecated?: boolean;
  intentCount?: number;
  templateType: 'securityBaseline' | 'specializedDevices' | 'advancedThreatProtectionSecurityBaseline' | 'deviceConfiguration' | 'custom' | 'compliancePolicy' | 'deviceRestrictions' | 'cloudPC' | 'firewallSharedSettings';
  platformType?: 'android' | 'androidForWork' | 'iOS' | 'macOS' | 'windowsPhone81' | 'windows81AndLater' | 'windows10AndLater' | 'androidWorkProfile' | 'windows10XProfile' | 'all';
}

export interface DeviceConfiguration {
  id: string;
  displayName: string;
  description?: string;
  createdDateTime: Date;
  lastModifiedDateTime: Date;
  version: number;
  assignments?: {
    id: string;
    target: {
      '@odata.type': string;
      groupId?: string;
      deviceAndAppManagementAssignmentFilterId?: string;
      deviceAndAppManagementAssignmentFilterType?: 'none' | 'include' | 'exclude';
    };
  }[];
  deviceStatuses?: {
    id: string;
    deviceDisplayName?: string;
    userName?: string;
    deviceModel?: string;
    platform?: number;
    complianceGracePeriodExpirationDateTime?: Date;
    status: 'unknown' | 'notApplicable' | 'success' | 'error' | 'conflict' | 'notAssigned';
    lastReportedDateTime?: Date;
    userPrincipalName?: string;
  }[];
  userStatuses?: {
    id: string;
    userDisplayName?: string;
    devicesCount?: number;
    status: 'unknown' | 'notApplicable' | 'success' | 'error' | 'conflict' | 'notAssigned';
    lastReportedDateTime?: Date;
    userPrincipalName?: string;
  }[];
  deviceStatusOverview?: {
    pendingCount?: number;
    notApplicableCount?: number;
    successCount?: number;
    errorCount?: number;
    failedCount?: number;
    conflictCount?: number;
    configurationVersion?: number;
  };
  userStatusOverview?: {
    pendingCount?: number;
    notApplicableCount?: number;
    successCount?: number;
    errorCount?: number;
    failedCount?: number;
    conflictCount?: number;
    configurationVersion?: number;
  };
  settingStateSummaries?: {
    id: string;
    setting?: string;
    settingName?: string;
    platformType: 'android' | 'androidForWork' | 'iOS' | 'macOS' | 'windowsPhone81' | 'windows81AndLater' | 'windows10AndLater' | 'androidWorkProfile' | 'windows10XProfile' | 'androidAOSP' | 'all';
    unknownDeviceCount?: number;
    notApplicableDeviceCount?: number;
    compliantDeviceCount?: number;
    remediatedDeviceCount?: number;
    nonCompliantDeviceCount?: number;
    errorDeviceCount?: number;
    conflictDeviceCount?: number;
  }[];
  roleScopeTagIds: string[];
}

export interface AppProtectionPolicy {
  id: string;
  displayName: string;
  description?: string;
  createdDateTime: Date;
  lastModifiedDateTime: Date;
  version?: string;
  isAssigned: boolean;
  roleScopeTagIds: string[];
  targetedAppManagementLevels: 'unspecified' | 'unmanaged' | 'mdm' | 'androidEnterprise';
  appGroupType: 'selectedPublicApps' | 'allCoreMicrosoftApps' | 'allMicrosoftApps' | 'allApps';
  assignments?: {
    id: string;
    target: {
      '@odata.type': string;
      groupId?: string;
      deviceAndAppManagementAssignmentFilterId?: string;
      deviceAndAppManagementAssignmentFilterType?: 'none' | 'include' | 'exclude';
    };
  }[];
  apps?: {
    id: string;
    version?: string;
    mobileAppIdentifier?: {
      '@odata.type': string;
      packageId?: string;
      bundleId?: string;
    };
  }[];
}

export interface IntuneReports {
  deviceComplianceReport: {
    reportName: string;
    totalDevices: number;
    compliantDevices: number;
    nonCompliantDevices: number;
    errorDevices: number;
    unknownDevices: number;
    complianceRate: number;
  };
  appInstallationReport: {
    reportName: string;
    totalApps: number;
    successfulInstalls: number;
    failedInstalls: number;
    pendingInstalls: number;
    installationRate: number;
  };
  deviceInventoryReport: {
    reportName: string;
    totalDevices: number;
    enrolledDevices: number;
    activeDevices: number;
    inactiveDevices: number;
    devicesByPlatform: {
      windows: number;
      iOS: number;
      android: number;
      macOS: number;
      other: number;
    };
  };
}