import React from 'react';
import { Clock, ShieldAlert, CheckCircle, Info } from 'lucide-react';

const UserDashboard = () => {
  // Dummy scan history data
  const scanHistory = [
    {
      id: '1',
      date: '2026-09-05',
      type: 'Text/Email',
      snippet: 'You have won a free iPhone 15! Click here to claim...',
      riskLevel: 'High'
    },
    {
      id: '2',
      date: '2026-09-04',
      type: 'URL',
      snippet: 'https://secure-login-boc.cc/verify',
      riskLevel: 'High'
    },
    {
      id: '3',
      date: '2026-09-02',
      type: 'Screenshot',
      snippet: 'Image: "Urgent package delivery fee required"',
      riskLevel: 'Medium'
    },
    {
      id: '4',
      date: '2026-09-01',
      type: 'URL',
      snippet: 'https://www.boc.lk/',
      riskLevel: 'Low'
    }
  ];

  const getRiskBadge = (level) => {
    switch (level) {
      case 'High':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-alert-red-600">
            <ShieldAlert className="w-3 h-3 mr-1" /> High Risk
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-warning-amber-500">
            <Info className="w-3 h-3 mr-1" /> Medium Risk
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-safe-green-600">
            <CheckCircle className="w-3 h-3 mr-1" /> Low Risk
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back. Here is your recent activity and scan history.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="bg-blue-50 p-4 rounded-full">
            <Clock className="text-trust-blue-900 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Scans</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="bg-red-50 p-4 rounded-full">
            <ShieldAlert className="text-alert-red-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Threats Blocked</p>
            <p className="text-2xl font-bold text-gray-900">15</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="bg-green-50 p-4 rounded-full">
            <CheckCircle className="text-safe-green-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Safe Items</p>
            <p className="text-2xl font-bold text-gray-900">9</p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Scan History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Snippet</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scanHistory.map((scan) => (
                <tr key={scan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{scan.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{scan.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{scan.snippet}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRiskBadge(scan.riskLevel)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
