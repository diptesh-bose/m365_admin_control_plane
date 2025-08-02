import React, { useState } from 'react';
import { Copy, Check, ExternalLink, AlertCircle, Globe } from 'lucide-react';

export const SetupInstructions: React.FC = () => {
  const [copiedSteps, setCopiedSteps] = useState<Set<number>>(new Set());

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSteps(prev => new Set(prev).add(stepIndex));
    setTimeout(() => {
      setCopiedSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(stepIndex);
        return newSet;
      });
    }, 2000);
  };

  const requiredPermissions = [
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
  ];

  const tenantId = "e2d5ef3b-a22b-486b-8387-6159066be350";
  const clientId = "a9815afe-7d1c-4ab0-a4ed-55782243aa5f";
  const deployedUrl = "https://astounding-kangaroo-20c487.netlify.app";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900">Fix Authentication Error</h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-red-900 mb-2">Current Issue</h3>
          <p className="text-sm text-red-800">
            Your Azure AD app registration needs to be configured as a Single-Page Application (SPA) and include the deployed URL as a redirect URI.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Your App Information</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">Client ID:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-blue-100 px-2 py-1 rounded text-xs font-mono text-blue-900">{clientId}</code>
                <button
                  onClick={() => copyToClipboard(clientId, 0)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {copiedSteps.has(0) ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">Deployed URL:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-blue-100 px-2 py-1 rounded text-xs font-mono text-blue-900">{deployedUrl}</code>
                <button
                  onClick={() => copyToClipboard(deployedUrl, 1)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {copiedSteps.has(1) ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-red-900">🚨 URGENT: Fix App Registration</h3>
              <a
                href={`https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Authentication/appId/${clientId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                <span>Open in Azure Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-red-800">
              <li>Click the link above to go directly to your app's Authentication settings</li>
              <li>Under "Platform configurations", find your existing "Single-page application" entry</li>
              <li>Click "Add URI" and add: <code className="bg-red-100 px-1 rounded font-mono">{deployedUrl}</code></li>
              <li>Make sure both URIs are listed:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><code className="bg-red-100 px-1 rounded font-mono">http://localhost:5173</code> (for development)</li>
                  <li><code className="bg-red-100 px-1 rounded font-mono">{deployedUrl}</code> (for production)</li>
                </ul>
              </li>
              <li>Click "Save" at the bottom of the page</li>
            </ol>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Verify Platform Configuration</h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700 mb-2">Your app should be configured as:</p>
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Single-page application (SPA)</span>
              </div>
              <p className="text-xs text-gray-600">
                NOT "Web" or "Mobile and desktop applications"
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Verify API Permissions</h3>
            <p className="text-sm text-gray-600 mb-3">Ensure these Microsoft Graph permissions are granted:</p>
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Required Permissions:</span>
                <button
                  onClick={() => copyToClipboard(requiredPermissions.join('\n'), 2)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  {copiedSteps.has(2) ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSteps.has(2) ? 'Copied!' : 'Copy All'}</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs font-mono">
                {requiredPermissions.map((permission, index) => (
                  <div key={index} className="text-gray-600">{permission}</div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Make sure "Grant admin consent" is clicked and shows green checkmarks.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-2">After Making Changes</h3>
        <p className="text-sm text-green-800">
          Once you've added the deployed URL to your app registration, wait 2-3 minutes for the changes to propagate, then try signing in again at: <a href={deployedUrl} className="underline font-medium">{deployedUrl}</a>
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Quick Fix Summary</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Go to Azure Portal → App registrations → Your app → Authentication</li>
          <li>Add <code className="bg-blue-100 px-1 rounded font-mono">{deployedUrl}</code> as a redirect URI</li>
          <li>Ensure it's configured as "Single-page application"</li>
          <li>Save changes and wait 2-3 minutes</li>
          <li>Try signing in again</li>
        </ol>
      </div>
    </div>
  );
};