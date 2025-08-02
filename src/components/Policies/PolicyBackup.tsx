import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { 
  Calendar, 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Clock, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  X,
  RefreshCw
} from 'lucide-react';
import { graphService } from '../../services/graphService';

interface PolicyBackupProps {
  isOpen: boolean;
  onClose: () => void;
  onBackupCreated: () => void;
}

interface Backup {
  id: string;
  name: string;
  description: string;
  createdDateTime: string;
  snapshotDateTime: string;
  createdBy: string;
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

interface RestoreResults {
  [key: string]: {
    success: number;
    failed: number;
    errors: string[];
  };
}

export const PolicyBackup: React.FC<PolicyBackupProps> = ({ isOpen, onClose, onBackupCreated }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'restore'>('create');
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create Backup State
  const [backupName, setBackupName] = useState('');
  const [backupDescription, setBackupDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | null>(new Date());

  // Restore State
  const [selectedBackup, setSelectedBackup] = useState<string>('');
  const [selectedPolicyTypes, setSelectedPolicyTypes] = useState<string[]>(['conditionalAccess', 'deviceCompliance']);
  const [restoreResults, setRestoreResults] = useState<RestoreResults | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadBackups();
    }
  }, [isOpen]);

  const loadBackups = async () => {
    try {
      setLoading(true);
      const backupsList = await graphService.listPolicyBackups();
      setBackups(backupsList as Backup[]);
    } catch (err) {
      setError('Failed to load backups');
      console.error('Error loading backups:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    if (!backupName.trim()) {
      setError('Backup name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await graphService.createPolicyBackup(backupName, backupDescription);
      
      setSuccess('Policy backup created successfully!');
      setBackupName('');
      setBackupDescription('');
      setScheduledDate(new Date());
      
      await loadBackups();
      onBackupCreated();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const deleteBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await graphService.deletePolicyBackup(backupId);
      await loadBackups();
      setSuccess('Backup deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to delete backup');
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async () => {
    if (!selectedBackup) {
      setError('Please select a backup to restore');
      return;
    }

    if (selectedPolicyTypes.length === 0) {
      setError('Please select at least one policy type to restore');
      return;
    }

    if (!confirm('Are you sure you want to restore these policies? This will create new policies in your tenant.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const results = await graphService.restorePolicyBackup(selectedBackup, selectedPolicyTypes);
      setRestoreResults(results as RestoreResults);
      setSuccess('Policy restore completed! Check results below.');
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore backup');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackup = (backup: Backup) => {
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${backup.name.replace(/[^a-z0-9]/gi, '_')}_backup.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Policy Backup & Restore</h2>
                <p className="text-blue-100">Manage your Microsoft 365 policy snapshots</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 bg-white bg-opacity-10 rounded-lg p-1">
            {[
              { id: 'create', label: 'Create Backup', icon: Save },
              { id: 'manage', label: 'Manage Backups', icon: Calendar },
              { id: 'restore', label: 'Restore Policies', icon: Upload }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === id
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700">{success}</span>
            </div>
          )}

          {/* Create Backup Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Create Policy Snapshot
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backup Name *
                      </label>
                      <input
                        type="text"
                        value={backupName}
                        onChange={(e) => setBackupName(e.target.value)}
                        placeholder="e.g., Pre-Holiday Policy Backup"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={backupDescription}
                        onChange={(e) => setBackupDescription(e.target.value)}
                        placeholder="Describe the purpose of this backup..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Snapshot Date & Time
                      </label>
                      <DatePicker
                        selected={scheduledDate}
                        onChange={(date) => setScheduledDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Included Policies:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Conditional Access Policies</li>
                        <li>• Device Compliance Policies</li>
                        <li>• Security Baselines</li>
                        <li>• App Protection Policies</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={createBackup}
                    disabled={loading || !backupName.trim()}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Creating...' : 'Create Backup'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Manage Backups Tab */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Policy Backups</h3>
                <button
                  onClick={loadBackups}
                  className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>

              {backups.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Backups Found</h4>
                  <p className="text-gray-600">Create your first policy backup to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {backups.map((backup) => (
                    <div key={backup.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-semibold text-gray-900">{backup.name}</h4>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {backup.policiesCount} policies
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{backup.description}</p>
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Created: {new Date(backup.createdDateTime).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Snapshot: {new Date(backup.snapshotDateTime).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => downloadBackup(backup)}
                            className="flex items-center space-x-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                          <button
                            onClick={() => deleteBackup(backup.id)}
                            className="flex items-center space-x-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Restore Policies Tab */}
          {activeTab === 'restore' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Restore Policies from Backup
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Backup
                      </label>
                      <select
                        value={selectedBackup}
                        onChange={(e) => setSelectedBackup(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Choose a backup...</option>
                        {backups.map((backup) => (
                          <option key={backup.id} value={backup.id}>
                            {backup.name} - {new Date(backup.createdDateTime).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Policy Types to Restore
                      </label>
                      <div className="space-y-2">
                        {[
                          { id: 'conditionalAccess', label: 'Conditional Access Policies' },
                          { id: 'deviceCompliance', label: 'Device Compliance Policies' },
                          { id: 'deviceConfiguration', label: 'Device Configuration Policies' },
                          { id: 'appProtection', label: 'App Protection Policies' }
                        ].map(({ id, label }) => (
                          <label key={id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedPolicyTypes.includes(id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPolicyTypes([...selectedPolicyTypes, id]);
                                } else {
                                  setSelectedPolicyTypes(selectedPolicyTypes.filter(type => type !== id));
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Important Notes
                    </h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Restored policies will be created as new policies</li>
                      <li>• Names will include "(Restored)" suffix</li>
                      <li>• Conditional Access policies start disabled for safety</li>
                      <li>• Review and enable policies manually after restore</li>
                      <li>• This operation cannot be undone</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={restoreBackup}
                    disabled={loading || !selectedBackup || selectedPolicyTypes.length === 0}
                    className="flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Restoring...' : 'Restore Policies'}</span>
                  </button>
                </div>

                {/* Restore Results */}
                {restoreResults && (
                  <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Restore Results</h4>
                    <div className="space-y-3">
                      {Object.entries(restoreResults).map(([type, results]) => (
                        <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-green-600">✓ {results.success} success</span>
                            {results.failed > 0 && (
                              <span className="text-red-600">✗ {results.failed} failed</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
