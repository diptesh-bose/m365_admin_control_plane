import React from 'react';
import { Shield, Cloud, Lock, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Microsoft 365 Admin Portal</h1>
            <p className="text-gray-600">Connect to your M365 tenant to manage policies and users</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">Authentication Error</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          )}

          <div className="space-y-6 mb-8">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Cloud className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-800">Real-time tenant data</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Lock className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-800">Secure Azure AD authentication</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-purple-800">Comprehensive policy management</span>
            </div>
          </div>

          <button
            onClick={login}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Sign in with Microsoft</span>
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-2">Ready to Connect</h3>
            <p className="text-xs text-green-700">
              Your app is configured with Client ID: a9815afe-7d1c-4ab0-a4ed-55782243aa5f
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};