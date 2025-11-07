'use client';

import React, { useState, useMemo } from 'react';
import { Expense } from '@/types/expense';
import { formatCurrency } from '@/utils/currency';
import { QRCodeSVG } from 'qrcode.react';

interface ExportHubProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'export' | 'schedule' | 'history' | 'share' | 'integrations';
type ExportTemplate = 'tax-report' | 'monthly-summary' | 'category-analysis' | 'custom';
type CloudProvider = 'google-sheets' | 'dropbox' | 'onedrive' | 'email' | 'notion';

interface ExportHistoryItem {
  id: string;
  template: string;
  provider: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
  recordCount: number;
}

interface ScheduledExport {
  id: string;
  template: string;
  frequency: string;
  destination: string;
  nextRun: string;
  enabled: boolean;
}

export const ExportHub: React.FC<ExportHubProps> = ({ expenses, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('export');
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate>('monthly-summary');
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  // Mock export history
  const [exportHistory] = useState<ExportHistoryItem[]>([
    {
      id: '1',
      template: 'Monthly Summary',
      provider: 'Email',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'success',
      recordCount: 45
    },
    {
      id: '2',
      template: 'Tax Report',
      provider: 'Google Sheets',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'success',
      recordCount: 128
    },
    {
      id: '3',
      template: 'Category Analysis',
      provider: 'Dropbox',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      recordCount: 89
    }
  ]);

  // Mock scheduled exports
  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>([
    {
      id: '1',
      template: 'Monthly Summary',
      frequency: 'Monthly (1st of month)',
      destination: 'your.email@example.com',
      nextRun: '2025-12-01',
      enabled: true
    },
    {
      id: '2',
      template: 'Tax Report',
      frequency: 'Quarterly',
      destination: 'Google Sheets',
      nextRun: '2025-12-31',
      enabled: true
    }
  ]);

  const exportTemplates = [
    {
      id: 'tax-report' as ExportTemplate,
      name: 'Tax Report',
      icon: '📋',
      description: 'Detailed report formatted for tax purposes with category breakdowns',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'monthly-summary' as ExportTemplate,
      name: 'Monthly Summary',
      icon: '📊',
      description: 'Concise monthly overview with key metrics and trends',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'category-analysis' as ExportTemplate,
      name: 'Category Analysis',
      icon: '📈',
      description: 'Deep dive into spending patterns by category with visualizations',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'custom' as ExportTemplate,
      name: 'Custom Export',
      icon: '⚙️',
      description: 'Build your own export with custom fields and formatting',
      color: 'from-gray-500 to-slate-600'
    }
  ];

  const cloudProviders = [
    {
      id: 'google-sheets' as CloudProvider,
      name: 'Google Sheets',
      icon: '📗',
      description: 'Live sync to spreadsheet',
      status: 'connected',
      color: 'border-green-500 bg-green-50'
    },
    {
      id: 'email' as CloudProvider,
      name: 'Email',
      icon: '✉️',
      description: 'Send to your inbox',
      status: 'ready',
      color: 'border-blue-500 bg-blue-50'
    },
    {
      id: 'dropbox' as CloudProvider,
      name: 'Dropbox',
      icon: '📦',
      description: 'Save to cloud storage',
      status: 'not-connected',
      color: 'border-gray-300 bg-gray-50'
    },
    {
      id: 'onedrive' as CloudProvider,
      name: 'OneDrive',
      icon: '☁️',
      description: 'Microsoft cloud sync',
      status: 'not-connected',
      color: 'border-gray-300 bg-gray-50'
    },
    {
      id: 'notion' as CloudProvider,
      name: 'Notion',
      icon: '📝',
      description: 'Export to workspace',
      status: 'connected',
      color: 'border-purple-500 bg-purple-50'
    }
  ];

  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const handleExport = async () => {
    if (!selectedProvider) return;

    setIsProcessing(true);

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setShowSuccessNotification(true);

    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  const generateShareLink = () => {
    const randomId = Math.random().toString(36).substring(7);
    const link = `https://expenses.app/share/${randomId}`;
    setShareLink(link);
    setShowQRCode(true);
  };

  const toggleSchedule = (id: string) => {
    setScheduledExports(scheduledExports.map(schedule =>
      schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Success</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Failed</span>;
      default:
        return null;
    }
  };

  const getConnectionBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <div className="flex items-center text-xs text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
            Connected
          </div>
        );
      case 'ready':
        return <span className="text-xs text-blue-600">Ready</span>;
      default:
        return <span className="text-xs text-gray-400">Not connected</span>;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with modern gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                Export Hub
              </h2>
              <p className="text-indigo-100 mt-1">Cloud-integrated data export and sharing platform</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sync status bar */}
          <div className="mt-4 flex items-center justify-between bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm">All systems operational</span>
              </div>
              <div className="text-sm opacity-75">
                Last sync: 2 minutes ago
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold">{expenses.length} records</span>
              <span className="text-sm opacity-75">•</span>
              <span className="text-sm font-semibold">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-1 px-6">
            {[
              { id: 'export' as TabType, label: 'Export', icon: '🚀' },
              { id: 'schedule' as TabType, label: 'Schedule', icon: '⏰' },
              { id: 'history' as TabType, label: 'History', icon: '📜' },
              { id: 'share' as TabType, label: 'Share', icon: '🔗' },
              { id: 'integrations' as TabType, label: 'Integrations', icon: '🔌' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* EXPORT TAB */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Export Template</h3>
                <div className="grid grid-cols-2 gap-4">
                  {exportTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        selectedTemplate === template.id
                          ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} text-white text-2xl mb-3`}>
                        {template.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Destination</h3>
                <div className="grid grid-cols-2 gap-3">
                  {cloudProviders.map(provider => (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider.id)}
                      disabled={provider.status === 'not-connected'}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedProvider === provider.id
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : provider.status === 'not-connected'
                          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                          : `${provider.color} hover:shadow-md`
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-3xl">{provider.icon}</span>
                        {getConnectionBadge(provider.status)}
                      </div>
                      <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{provider.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email input for email provider */}
              {selectedProvider === 'email' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Export preview card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Export Preview
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Template</div>
                    <div className="font-semibold text-gray-900">
                      {exportTemplates.find(t => t.id === selectedTemplate)?.name || 'Select template'}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Destination</div>
                    <div className="font-semibold text-gray-900">
                      {cloudProviders.find(p => p.id === selectedProvider)?.name || 'Select destination'}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Records</div>
                    <div className="font-semibold text-gray-900">{expenses.length}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleExport}
                disabled={!selectedProvider || !selectedTemplate || isProcessing}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing Export...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Export to Cloud
                  </>
                )}
              </button>
            </div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Automated Backups</h3>
                <p className="text-gray-700 mb-4">Set up recurring exports to never lose your data. We&apos;ll automatically send your expenses to your chosen destination.</p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  + Create New Schedule
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Schedules</h3>
                <div className="space-y-3">
                  {scheduledExports.map(schedule => (
                    <div key={schedule.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-gray-900">{schedule.template}</h4>
                            <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                              schedule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {schedule.enabled ? 'Active' : 'Paused'}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Frequency:</span>
                              <div className="font-medium text-gray-900">{schedule.frequency}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Destination:</span>
                              <div className="font-medium text-gray-900">{schedule.destination}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Next Run:</span>
                              <div className="font-medium text-gray-900">{schedule.nextRun}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => toggleSchedule(schedule.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              schedule.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                schedule.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Export History</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Clear History
                </button>
              </div>

              <div className="space-y-3">
                {exportHistory.map(item => (
                  <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-semibold text-gray-900">{item.template}</h4>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-600">{item.provider}</span>
                          <span className="ml-3">{getStatusBadge(item.status)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <span>{formatTimeAgo(item.timestamp)}</span>
                          <span>•</span>
                          <span>{item.recordCount} records</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHARE TAB */}
          {activeTab === 'share' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Your Expenses
                </h3>
                <p className="text-gray-700 mb-4">Generate a secure, shareable link or QR code for your expense data. Perfect for accountants, financial advisors, or team members.</p>
                <button
                  onClick={generateShareLink}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors font-semibold shadow-md"
                >
                  Generate Share Link
                </button>
              </div>

              {shareLink && (
                <div className="bg-white rounded-xl border-2 border-indigo-200 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Shareable Link Generated</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Active for 7 days
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <code className="text-sm text-indigo-600 font-mono">{shareLink}</code>
                      <button
                        onClick={() => navigator.clipboard.writeText(shareLink)}
                        className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {showQRCode && (
                    <div className="flex flex-col items-center py-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-3">
                        <QRCodeSVG value={shareLink} size={200} />
                      </div>
                      <p className="text-sm text-gray-600">Scan this QR code to access the shared data</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm">
                      Set Password Protection
                    </button>
                    <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
                      Configure Permissions
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Collaboration Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Allow Comments</div>
                      <div className="text-sm text-gray-600">Let viewers add notes to expenses</div>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Download Access</div>
                      <div className="text-sm text-gray-600">Allow viewers to export data</div>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cloud Integrations</h3>
                <p className="text-gray-700">Connect your favorite apps and services to automate your expense workflow.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {cloudProviders.map(provider => (
                  <div key={provider.id} className={`rounded-xl border-2 p-6 ${provider.color}`}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-4xl">{provider.icon}</span>
                      {getConnectionBadge(provider.status)}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{provider.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{provider.description}</p>
                    {provider.status === 'connected' ? (
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                          Configure Settings
                        </button>
                        <button className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm">
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                        Connect Now
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Coming Soon</h4>
                <div className="grid grid-cols-4 gap-4">
                  {['Slack', 'QuickBooks', 'Xero', 'Zapier'].map(service => (
                    <div key={service} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                      <div className="text-sm font-medium text-gray-600">{service}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-2xl border-2 border-green-500 p-4 flex items-center space-x-3 animate-slide-up">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Export Successful!</div>
            <div className="text-sm text-gray-600">Your data has been sent to {cloudProviders.find(p => p.id === selectedProvider)?.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};
