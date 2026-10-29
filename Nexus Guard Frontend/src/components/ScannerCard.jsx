import React, { useState, useRef } from 'react';
import { MessageSquare, Link as LinkIcon, Image as ImageIcon, Loader2, X } from 'lucide-react';
import ResultDisplay from './ResultDisplay';
import { getApiErrorMessage, predictPhishing } from '../services/text_analyze_service';
import { analyzeImage } from '../services/image_analysis_service'; // Import the new service

const ScannerCard = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // State for image file
  const [imagePreview, setImagePreview] = useState(null);   // State for image preview URL
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setError(null);
    setScanResult(null);

    // Validation checks
    if (activeTab === 'screenshot' && !selectedImage) {
      setError('Please select or drop an image first.');
      return;
    }
    if (activeTab !== 'screenshot' && !inputValue.trim()) {
      return;
    }

    setIsScanning(true);

    try {
      let textToAnalyze = inputValue;

      // If screenshot tab is active, upload image to get text first
      if (activeTab === 'screenshot') {
        const imageResponse = await analyzeImage(selectedImage);
        textToAnalyze = imageResponse.extracted_text;

        if (!textToAnalyze) {
          throw new Error('No readable text could be recognized from this image.');
        }
      }

      // Pass the extracted text (or text input / URL) to your phishing prediction model
      const data = await predictPhishing(textToAnalyze);
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
          activeTab === 'screenshot' ? `Extracted Text: "${textToAnalyze.substring(0, 60)}..."` : null,
          `Phishing Probability: ${(Number(data.phishing_probability) * 100).toFixed(2)}%`,
          `Confidence Score: ${(Number(data.confidence) * 100).toFixed(2)}%`,
          recommendation
        ].filter(Boolean)
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
    setSelectedImage(null);
    setImagePreview(null);
    setScanResult(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto border border-gray-100">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          type="button"
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
          type="button"
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
          type="button"
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
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            <div 
              onClick={() => !isScanning && fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer relative"
            >
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img src={imagePreview} alt="Upload preview" className="max-h-40 rounded-lg mb-2 object-contain shadow" />
                  <p className="text-xs text-gray-600 font-medium">{selectedImage?.name}</p>
                  <p className="text-xs text-blue-600 mt-1">Click or drop to replace</p>
                </div>
              ) : (
                <>
                  <ImageIcon size={48} className="mb-4 text-gray-400" />
                  <p className="mb-2 text-sm font-medium text-gray-700">Drag and drop an image, or click to browse</p>
                  <p className="text-xs">Supports JPG, PNG, WEBP (Max 5MB)</p>
                </>
              )}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isScanning || (activeTab === 'screenshot' ? !selectedImage : !inputValue.trim())}
          className="w-full bg-trust-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScanning ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              {activeTab === 'screenshot' ? 'Extracting Text & Analyzing...' : 'Analyzing Content...'}
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