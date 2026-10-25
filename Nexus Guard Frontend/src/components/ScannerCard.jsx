import React, { useState } from 'react';
import { MessageSquare, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import ResultDisplay from './ResultDisplay';
import { getApiErrorMessage, predictPhishing } from '../services/text_analyze_service';

const ScannerCard = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (activeTab === 'screenshot') {
      setError('Screenshot scanning is not available from the connected backend yet.');
      return;
    }
    if (!inputValue.trim()) return;

    setIsScanning(true);
    setScanResult(null);
    setError(null);

    try {
      const data = await predictPhishing(inputValue);
      const severity = (data.severity || 'high').toLowerCase();
      const severityLabel = severity.charAt(0).toUpperCase() + severity.slice(1);
      const recommendation = severity === 'high'
        ? 'Immediate action required. Avoid interacting with this content.'
        : severity === 'medium'
          ? 'Exercise caution. Verify the source before proceeding.'
          : 'Content appears safe, but remain vigilant.';

      setScanResult({
        riskLevel: severityLabel,
        reasons: [
          `Phishing Probability: ${(Number(data.phishing_probability) * 100).toFixed(2)}%`,
          `Confidence Score: ${(Number(data.confidence) * 100).toFixed(2)}%`,
          recommendation
        ]
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to analyze content.'));
    } finally {
      setIsScanning(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setInputValue('');
    setScanResult(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto border border-gray-100">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => handleTabChange('text')}
          className={`flex items-center space-x-2 pb-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'text'
              ? 'border-b-2 border-trust-blue-900 text-trust-blue-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare size={18} />
          <span>Text/Email</span>
        </button>
        <button
          onClick={() => handleTabChange('url')}
          className={`flex items-center space-x-2 pb-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'url'
              ? 'border-b-2 border-trust-blue-900 text-trust-blue-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LinkIcon size={18} />
          <span>URL Link</span>
        </button>
        <button
          onClick={() => handleTabChange('screenshot')}
          className={`flex items-center space-x-2 pb-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'screenshot'
              ? 'border-b-2 border-trust-blue-900 text-trust-blue-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ImageIcon size={18} />
          <span>Screenshot</span>
        </button>
      </div>

      {/* Input Area */}
      <form onSubmit={handleScan} className="space-y-4">
        {activeTab === 'text' && (
          <div>
            <label htmlFor="text-input" className="sr-only">Paste suspicious text or email</label>
            <textarea
              id="text-input"
              rows={5}
              placeholder="Paste the suspicious SMS, email, or message here..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust-blue-900 focus:border-trust-blue-900 resize-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isScanning}
            />
          </div>
        )}

        {activeTab === 'url' && (
          <div>
            <label htmlFor="url-input" className="sr-only">Paste suspicious link</label>
            <input
              id="url-input"
              type="text"
              placeholder="https://example.com/login"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust-blue-900 focus:border-trust-blue-900"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isScanning}
            />
          </div>
        )}

        {activeTab === 'screenshot' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
            <ImageIcon size={48} className="mb-4 text-gray-400" />
            <p className="mb-2 text-sm font-medium text-gray-700">Drag and drop an image, or click to browse</p>
            <p className="text-xs">Supports JPG, PNG, WEBP (Max 5MB)</p>
            {/* Hidden file input for actual implementation */}
          </div>
        )}

        {error && <p className="text-sm text-alert-red-600" role="alert">{error}</p>}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isScanning || (activeTab !== 'screenshot' && !inputValue.trim())}
          className="w-full bg-trust-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScanning ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Analyzing Content...
            </>
          ) : (
            <span>Scan {activeTab === 'text' ? 'Text' : activeTab === 'url' ? 'Link' : 'Image'}</span>
          )}
        </button>
      </form>

      {/* Results */}
      {scanResult && (
        <ResultDisplay riskLevel={scanResult.riskLevel} reasons={scanResult.reasons} />
      )}
    </div>
  );
};

export default ScannerCard;
