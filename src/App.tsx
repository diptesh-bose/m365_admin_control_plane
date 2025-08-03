import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './config/authConfig';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/Auth/LoginPage';
import { SetupInstructions } from './components/Setup/SetupInstructions';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Policies } from './pages/Policies';
import { Users } from './pages/Users';
import Devices from './pages/Devices';
import Apps from './pages/Apps';
import { Reports } from './pages/Reports';
import { Activity } from './pages/Activity';
import { Settings } from './pages/Settings';

const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL instance
msalInstance.initialize().then(() => {
  // Handle redirect promise
  msalInstance.handleRedirectPromise().then((response) => {
    if (response) {
      console.log('Redirect response:', response);
      msalInstance.setActiveAccount(response.account);
    }
  }).catch((error) => {
    console.error('Redirect promise error:', error);
  });
});

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is authenticated and on login page, redirect to dashboard
    if (isAuthenticated && location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-xl">⚠</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/setup" element={<SetupInstructions />} />
      {!isAuthenticated ? (
        <Route path="*" element={<LoginPage />} />
      ) : (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                  <Dashboard />
                </main>
              </div>
            </div>
          } />
          <Route path="/policies" element={
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                  <Policies />
                </main>
              </div>
            </div>
          } />
          <Route path="/users" element={
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                  <Users />
                </main>
              </div>
            </div>
          } />
          <Route path="/devices" element={
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                  <Devices />
                </main>
              </div>
            </div>
          } />
          <Route path="/apps" element={
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                  <Apps />
                </main>
              </div>
            </div>
          } />
          <Route path="/reports" element={
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                  <Reports />
                </main>
              </div>
            </div>
          } />
          <Route path="/activity" element={
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                  <Activity />
                </main>
              </div>
            </div>
          } />
          <Route path="/settings" element={
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                  <Settings />
                </main>
              </div>
            </div>
          } />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <AppContent />
      </Router>
    </MsalProvider>
  );
}

export default App;