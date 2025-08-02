# Development Guide

## 🚀 Getting Started

### Initial Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
The `.env` file contains:
```env
VITE_AZURE_CLIENT_ID=a9815afe-7d1c-4ab0-a4ed-55782243aa5f
VITE_AZURE_TENANT_ID=e2d5ef3b-a22b-486b-8387-6159066be350
```

## 🔧 Development Tasks

### Code Quality
```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Building
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Package Management
```bash
# Install new dependency
npm install <package-name>

# Install dev dependency
npm install -D <package-name>

# Update dependencies
npm update

# Check for vulnerabilities
npm audit
npm audit fix
```

## 🎯 Development Tips

### 1. Mock Data vs Real Data
- The app includes mock data in `src/data/mockData.ts`
- Real data comes from Microsoft Graph API
- Switch between modes by modifying the `useGraphData` hook

### 2. Authentication Testing
- Use the `/setup` route for configuration help
- Test with different user roles
- Check browser DevTools for MSAL logs

### 3. Component Development
- Components are organized by feature
- Use TypeScript interfaces from `src/types/`
- Follow the existing patterns for consistency

### 4. API Integration
- All Graph API calls go through `graphService.ts`
- Error handling is centralized
- Token refresh is automatic

## 🔍 Debugging

### Common Debug Points
1. **Authentication**: Check MSAL logs in console
2. **API Calls**: Monitor Network tab in DevTools
3. **State Management**: Use React DevTools
4. **Permissions**: Verify in Azure AD portal

### Development Console Commands
```javascript
// Check MSAL instance
window.msalInstance

// Check active account
window.msalInstance.getActiveAccount()

// Check token cache
window.msalInstance.getAllAccounts()
```

## 📋 Checklist for New Features

- [ ] Create TypeScript interfaces in `src/types/`
- [ ] Add API methods to `graphService.ts`
- [ ] Create React components
- [ ] Add routing if needed
- [ ] Update navigation in `Sidebar.tsx`
- [ ] Add error handling
- [ ] Test authentication flow
- [ ] Update documentation

## 🚀 Deployment

### Local Testing
```bash
# Build and test locally
npm run build
npm run preview
```

### Production Deployment
1. **Build**: `npm run build`
2. **Deploy**: Upload `dist/` folder
3. **Configure**: Update Azure AD redirect URIs
4. **Test**: Verify all features work

## 🔐 Security Considerations

- Never commit secrets to version control
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP guidelines
- Keep dependencies updated

## 📱 Responsive Design

The app is built mobile-first:
- Tailwind CSS responsive utilities
- Sidebar collapses on mobile
- Touch-friendly interactions
- Optimized for all screen sizes
