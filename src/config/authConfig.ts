export const msalConfig = {
  auth: {
    clientId: "a9815afe-7d1c-4ab0-a4ed-55782243aa5f",
    authority: "https://login.microsoftonline.com/e2d5ef3b-a22b-486b-8387-6159066be350",
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
    loggerOptions: {
      loggerCallback: (level: any, message: string, containsPii: boolean) => {
        if (containsPii) return;
        console.log(`[MSAL] ${message}`);
      },
      piiLoggingEnabled: false,
      logLevel: 3, // Info level
    },
  },
};

export const loginRequest = {
  scopes: [
    "User.Read",
    "User.ReadWrite.All",
    "Group.Read.All",
    "Group.ReadWrite.All",
    "Directory.Read.All",
    "Directory.ReadWrite.All",
    "Policy.Read.All",
    "Policy.ReadWrite.ConditionalAccess",
    "DeviceManagementConfiguration.Read.All",
    "DeviceManagementConfiguration.ReadWrite.All",
    "SecurityEvents.Read.All",
    "AuditLog.Read.All",
    "Reports.Read.All"
  ],
  redirectUri: window.location.origin,
  prompt: "select_account",
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphUsersEndpoint: "https://graph.microsoft.com/v1.0/users",
  graphGroupsEndpoint: "https://graph.microsoft.com/v1.0/groups",
  graphPoliciesEndpoint: "https://graph.microsoft.com/v1.0/policies",
  graphConditionalAccessEndpoint: "https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies",
  graphDeviceManagementEndpoint: "https://graph.microsoft.com/v1.0/deviceManagement",
  graphAuditLogsEndpoint: "https://graph.microsoft.com/v1.0/auditLogs/directoryAudits",
  graphSecurityAlertsEndpoint: "https://graph.microsoft.com/v1.0/security/alerts_v2"
};