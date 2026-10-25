import React, { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle, XCircle, Loader2, Globe } from 'lucide-react';
import { checkWebsite, getApiErrorMessage } from '../services/text_analyze_service';

const FakeWebsiteDetector = () => {
  const [url, setUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setIsChecking(true);
    setResults(null);
    setError(null);

    try {
      const data = await checkWebsite(url);
      setResults(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to check this website.'));
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-10">
        <Globe className="w-16 h-16 text-trust-blue-900 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-trust-blue-900 mb-4">
          Fake Website Detector
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Not sure if a login page or e-commerce site is real? Enter the URL below to check its domain age, SSL validity, and blacklist status.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 mb-8">
        <form onSubmit={handleCheck} className="flex flex-col md:flex-row gap-4">
          <input
            type="url"
            placeholder="https://example.com"
            className="flex-1 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust-blue-900 focus:border-trust-blue-900 text-lg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isChecking}
            required
          />
          <button
            type="submit"
            disabled={isChecking || !url.trim()}
            className="bg-trust-blue-900 hover:bg-blue-800 text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 whitespace-nowrap"
          >
            {isChecking ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Analyzing...
              </>
            ) : (
              'Check Website'
            )}
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-alert-red-600" role="alert">{error}</p>}
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Domain Age */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${results.domainAge.safe ? 'bg-safe-green-600' : 'bg-alert-red-600'}`} />
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Domain Age</h3>
              {results.domainAge.safe ? (
                <CheckCircle className="text-safe-green-600 w-6 h-6" />
              ) : (
                <XCircle className="text-alert-red-600 w-6 h-6" />
              )}
            </div>
            <p className="text-2xl font-bold mb-2">{results.domainAge.value}</p>
            <p className="text-sm text-gray-500">{results.domainAge.message}</p>
          </div>

          {/* SSL Certificate */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${results.ssl.safe ? 'bg-safe-green-600' : 'bg-alert-red-600'}`} />
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-700">SSL Certificate</h3>
              {results.ssl.safe ? (
                <Shield className="text-safe-green-600 w-6 h-6" />
              ) : (
                <ShieldAlert className="text-alert-red-600 w-6 h-6" />
              )}
            </div>
            <p className="text-2xl font-bold mb-2">{results.ssl.value}</p>
            <p className="text-sm text-gray-500">{results.ssl.message}</p>
          </div>

          {/* Blacklist Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${results.blacklist.safe ? 'bg-safe-green-600' : 'bg-alert-red-600'}`} />
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Blacklist Status</h3>
              {results.blacklist.safe ? (
                <CheckCircle className="text-safe-green-600 w-6 h-6" />
              ) : (
                <XCircle className="text-alert-red-600 w-6 h-6" />
              )}
            </div>
            <p className="text-2xl font-bold mb-2">{results.blacklist.value}</p>
            <p className="text-sm text-gray-500">{results.blacklist.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeWebsiteDetector;
