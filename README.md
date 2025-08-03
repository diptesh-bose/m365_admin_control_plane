# M365 Admin Control Plane

A comprehensive Microsoft 365 administration portal built with React, TypeScript, and Microsoft Graph API integration.

## 🚀 Features

### Core Functionality
- **Azure AD Authentication** - Secure Single Sign-On with Microsoft Entra ID
- **Dashboard Analytics** - Real-time tenant metrics and KPIs
- **Policy Management** - Conditional Access, Device Compliance, and Security policies
- **User Administration** - User directory management and role assignments
- **Device Management** - Intune-enrolled device monitoring and remote actions
- **App Management** - Mobile application deployment and assignment tracking
- **Security Monitoring** - Real-time alerts and threat detection
- **Audit & Compliance** - Activity logs and compliance reporting
- **Reports & Analytics** - Comprehensive reporting with data visualization including Intune metrics

### Technical Features
- **Modern UI/UX** - Built with Tailwind CSS and Lucide icons
- **Real-time Data** - Microsoft Graph API integration
- **Responsive Design** - Mobile-first approach
- **Type Safety** - Full TypeScript implementation
- **Performance Optimized** - Vite build system with fast HMR

## 🏗️ Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **Authentication** | Azure AD/Microsoft Entra ID (MSAL) |
| **API Integration** | Microsoft Graph API |
| **Data Visualization** | Recharts |
| **Routing** | React Router v7 |
| **Icons** | Lucide React |
| **Date Handling** | date-fns |

## 🔧 Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Azure AD tenant** with admin privileges
- **Azure AD App Registration** (configured as SPA)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd m365_admin_control_plane
npm install
```

### 2. Environment Configuration

The `.env` file is already configured with the necessary Azure AD settings:

```env
VITE_AZURE_CLIENT_ID=a9815afe-7d1c-4ab0-a4ed-55782243aa5f
VITE_AZURE_TENANT_ID=e2d5ef3b-a22b-486b-8387-6159066be350
```

### 3. Azure AD App Registration Setup

For the application to work properly, ensure your Azure AD app registration has:

#### **Redirect URIs**
- **Type**: Single-page application (SPA)
- **URIs**: 
  - `http://localhost:5173` (for development)
  - `https://astounding-kangaroo-20c487.netlify.app` (production)

#### **Required API Permissions**
```
Microsoft Graph API:
├── User.Read
├── User.ReadWrite.All
├── Group.Read.All
├── Group.ReadWrite.All
├── Directory.Read.All
├── Directory.ReadWrite.All
├── Policy.Read.All
├── Policy.ReadWrite.ConditionalAccess
├── DeviceManagementConfiguration.Read.All
├── DeviceManagementConfiguration.ReadWrite.All
├── DeviceManagementApps.Read.All
├── DeviceManagementApps.ReadWrite.All
├── DeviceManagementManagedDevices.Read.All
├── DeviceManagementManagedDevices.ReadWrite.All
├── DeviceManagementManagedDevices.PrivilegedOperations.All
├── SecurityEvents.Read.All
├── AuditLog.Read.All
└── Reports.Read.All
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Auth/               # Authentication components
│   │   └── LoginPage.tsx   # Login interface
│   ├── Dashboard/          # Dashboard widgets
│   │   ├── ActivityFeed.tsx
│   │   ├── MetricCard.tsx
│   │   └── PolicyChart.tsx
│   ├── Layout/             # Layout components
│   │   ├── Header.tsx      # Top navigation
│   │   └── Sidebar.tsx     # Side navigation
│   ├── Policies/           # Policy management
│   │   ├── PolicyFilters.tsx
│   │   └── PolicyTable.tsx
│   └── Setup/              # Setup instructions
│       └── SetupInstructions.tsx
├── config/                 # Configuration files
│   └── authConfig.ts       # Azure AD configuration
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Authentication hook
│   └── useGraphData.ts     # Microsoft Graph data hook
├── pages/                  # Page components
│   ├── Activity.tsx        # Activity logs page
│   ├── Apps.tsx           # Intune app management page
│   ├── Dashboard.tsx       # Main dashboard
│   ├── Devices.tsx        # Intune device management page
│   ├── Policies.tsx        # Policy management page
│   ├── Reports.tsx         # Reports page with Intune analytics
│   ├── Settings.tsx        # Settings page
│   └── Users.tsx           # User management page
├── services/               # API services
│   └── graphService.ts     # Microsoft Graph service
├── types/                  # TypeScript definitions
│   └── index.ts            # Type definitions
└── data/                   # Development data
    └── mockData.ts         # Mock data for development
```

## 📱 Microsoft Intune Integration

The application now includes comprehensive Microsoft Intune integration for mobile device and application management.

### **Device Management Features**
- **Device Inventory** - Complete view of all Intune-enrolled devices
- **Compliance Monitoring** - Real-time device compliance status tracking
- **Remote Actions** - Device sync, lock, wipe, retire, and passcode reset
- **Platform Support** - Windows, iOS, Android, and macOS devices
- **Connectivity Status** - Online/offline device monitoring

### **Application Management Features**
- **App Catalog** - Comprehensive mobile application inventory
- **Assignment Tracking** - Monitor app assignments to users and groups
- **Installation Status** - Track app installation success/failure rates
- **Publishing States** - Monitor app publishing workflow status
- **Featured Apps** - Highlight important applications

### **Reporting & Analytics**
- **Compliance Reports** - Device compliance overview with detailed metrics
- **Platform Distribution** - Visual breakdown of device platforms
- **Installation Metrics** - App installation success rates and trends
- **Activity Tracking** - Recent device and app management activities

### **Remote Device Actions**
The following remote actions are supported:
- **Sync Device** - Force policy and app sync
- **Lock Device** - Remotely lock a lost or stolen device
- **Reset Passcode** - Force passcode reset on managed devices
- **Retire Device** - Remove corporate data while preserving personal data
- **Wipe Device** - Complete device factory reset (with confirmation)

### **Intune API Endpoints Used**
- `GET /deviceManagement/managedDevices` - Device inventory
- `GET /deviceManagement/mobileApps` - Application catalog
- `POST /deviceManagement/managedDevices/{id}/sync` - Device sync
- `POST /deviceManagement/managedDevices/{id}/remoteLock` - Remote lock
- `POST /deviceManagement/managedDevices/{id}/resetPasscode` - Passcode reset
- `POST /deviceManagement/managedDevices/{id}/retire` - Device retirement
- `POST /deviceManagement/managedDevices/{id}/wipe` - Device wipe

## 🔒 Security & Permissions

The application requires extensive Microsoft Graph permissions to function properly:

### **User & Directory Management**
- Read and write user profiles
- Manage group memberships
- Access directory information

### **Policy Management**
- Read and write conditional access policies
- Manage device compliance policies
- Configure security policies

### **Monitoring & Reporting**
- Access security events and alerts
- Read audit logs
- Generate compliance reports

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎯 Key Features Deep Dive

### 1. **Authentication Flow**
- Azure AD integration with MSAL
- Automatic token refresh
- Secure session management
- Role-based access control

### 2. **Dashboard Analytics**
- Real-time tenant metrics
- Policy compliance status
- Security alert monitoring
- User activity insights

### Policy Management
- **Conditional Access policies**
- **Device compliance rules** 
- **Security configurations**
- **Bulk policy operations**
- **Policy backup and restore** with calendar controls and audit trail
- **Smart filtering** with Graph API-aligned values and priority ranges
- **Conditional UI** that adapts based on available policy data

#### Policy Status Values
The application displays **actual Microsoft Graph API values** for policy status:
- **On** - `enabled` (policy is active and enforced)
- **Off** - `disabled` (policy is inactive)  
- **Report Only** - `enabledForReportingButNotEnforced` (monitoring mode)

#### Policy Types and Priority
- **Type**: Displays actual policy categories (Conditional Access, Device Compliance, etc.)
- **Priority**: Shows numeric priority values from the API when available
  - Conditional Access policies don't have priority (column hidden when only CA policies)
  - Device/App policies show numeric values (1-100, lower numbers = higher priority)
  - Priority filtering supports ranges: High (1-10), Medium (11-50), Low (51-100), No Priority

### 4. **User Administration**
- User directory browsing
- Role and permission management
- Department-based filtering
- User lifecycle management

### 5. **Security Monitoring**
- Real-time security alerts
- Threat detection
- Compliance monitoring
- Risk assessment

## 🔄 Development Workflow

### Local Development
1. **Start dev server**: `npm run dev`
2. **Login with Azure AD**: Use admin credentials
3. **Development tools**: Browser DevTools, React DevTools
4. **API testing**: Microsoft Graph Explorer

### Production Deployment
1. **Build**: `npm run build`
2. **Deploy**: Deploy `dist/` folder
3. **Configure**: Update redirect URIs in Azure AD
4. **Test**: Verify authentication and permissions

## 🐛 Troubleshooting

### Common Issues

#### Authentication Errors
- **Issue**: Login redirect fails
- **Solution**: Verify redirect URIs in Azure AD app registration

#### Permission Errors
- **Issue**: API calls fail with 403
- **Solution**: Ensure all required permissions are granted and admin consented

#### Development Server Issues
- **Issue**: App won't start locally
- **Solution**: Check Node.js version and run `npm install`

### Setup Verification
Visit `/setup` route in the application for detailed setup instructions and troubleshooting.

## 📚 Additional Resources

- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)
- [Azure AD App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [MSAL.js Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**🎉 Ready to manage your M365 tenant with style!**
