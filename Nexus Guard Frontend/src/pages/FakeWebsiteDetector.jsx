import React, { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle, XCircle, Loader2, Globe } from 'lucide-react';
import { checkWebsite, getApiErrorMessage } from '../services/website_detector_service';

const FakeWebsiteDetector = () => {
  const [theme, setTheme] = useState('dark');
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
    <div
      data-theme={theme}
      className="min-h-screen transition-colors duration-300 bg-[color:var(--bg)] font-body text-[color:var(--text)]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap');

        [data-theme="dark"] {
          --bg: #0A0E16;
          --surface: #10151F;
          --surface-2: #161C29;
          --border: #232B3A;
          --text: #E7ECF3;
          --text-dim: #8B93A7;
          --accent: #FF9F45;
          --accent-2: #4FD8E8;
          --safe: #3DDC84;
          --warn: #FFC24B;
          --danger: #FF5C5C;
          --grid-line: rgba(255,255,255,0.035);
        }
        [data-theme="light"] {
          --bg: #F3F4F7;
          --surface: #FFFFFF;
          --surface-2: #ECEEF2;
          --border: #DADFE6;
          --text: #10151F;
          --text-dim: #5B6472;
          --accent: #C97A1F;
          --accent-2: #0E93A6;
          --safe: #1E8F5B;
          --warn: #B9790F;
          --danger: #C23B3B;
          --grid-line: rgba(16,21,31,0.045);
        }

        .font-body { font-family: 'Space Grotesk', sans-serif; }
        .font-data { font-family: 'JetBrains Mono', monospace; }

        .circuit-bg {
          background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 36px 36px;
        }
      `}</style>

      <div className="circuit-bg min-h-screen">
        <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          
          {/* Top Bar / Theme Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 font-data text-xs text-[color:var(--accent-2)] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--safe)]" />
              Security Diagnostics Module
            </div>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle color theme"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-dim)] hover:text-[color:var(--text)] transition-colors"
            >
              {theme === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                </svg>
              )}
              <span className="font-data text-xs">{theme === 'dark' ? 'light' : 'dark'}</span>
            </button>
          </div>

          {/* Header Title */}
          <div className="text-center mb-10">
            <Globe className="w-16 h-16 text-[color:var(--accent-2)] mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-[color:var(--text)] mb-4 font-body">
              Fake Website Detector
            </h1>
            <p className="text-base sm:text-lg text-[color:var(--text-dim)] max-w-2xl mx-auto leading-relaxed">
              Not sure if a login page or e-commerce site is real? Enter the URL below to check its domain age, SSL validity, and blacklist status.
            </p>
          </div>

          {/* Search Box Card */}
          <div className="bg-[color:var(--surface)] rounded-md shadow-lg p-6 md:p-8 border border-[color:var(--border)] mb-8">
            <form onSubmit={handleCheck} className="flex flex-col md:flex-row gap-4">
              <input
                type="url"
                placeholder="https://example.com"
                className="flex-1 p-4 border border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--text)] placeholder:text-[color:var(--text-dim)] rounded focus:outline-none focus:border-[color:var(--accent-2)] text-base font-data"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isChecking}
                required
              />
              <button
                type="submit"
                disabled={isChecking || !url.trim()}
                className="bg-[color:var(--accent-2)] hover:opacity-90 text-black font-semibold font-data text-sm py-4 px-8 rounded transition-opacity flex items-center justify-center disabled:opacity-50 whitespace-nowrap"
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
            {error && <p className="mt-4 text-sm font-data text-[color:var(--danger)]" role="alert">{error}</p>}
          </div>

          {/* Results Grid */}
          {results && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Domain Age */}
              <div className="bg-[color:var(--surface)] p-6 rounded-md border border-[color:var(--border)] relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${results.domainAge.safe ? 'bg-[color:var(--safe)]' : 'bg-[color:var(--danger)]'}`} />
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[color:var(--text)] font-body">Domain Age</h3>
                  {results.domainAge.safe ? (
                    <CheckCircle className="text-[color:var(--safe)] w-6 h-6" />
                  ) : (
                    <XCircle className="text-[color:var(--danger)] w-6 h-6" />
                  )}
                </div>
                <p className="text-2xl font-bold mb-2 font-data text-[color:var(--text)]">{results.domainAge.value}</p>
                <p className="text-sm text-[color:var(--text-dim)]">{results.domainAge.message}</p>
              </div>

              {/* SSL Certificate */}
              <div className="bg-[color:var(--surface)] p-6 rounded-md border border-[color:var(--border)] relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${results.ssl.safe ? 'bg-[color:var(--safe)]' : 'bg-[color:var(--danger)]'}`} />
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[color:var(--text)] font-body">SSL Certificate</h3>
                  {results.ssl.safe ? (
                    <Shield className="text-[color:var(--safe)] w-6 h-6" />
                  ) : (
                    <ShieldAlert className="text-[color:var(--danger)] w-6 h-6" />
                  )}
                </div>
                <p className="text-2xl font-bold mb-2 font-data text-[color:var(--text)]">{results.ssl.value}</p>
                <p className="text-sm text-[color:var(--text-dim)]">{results.ssl.message}</p>
              </div>

              {/* Blacklist Status */}
              <div className="bg-[color:var(--surface)] p-6 rounded-md border border-[color:var(--border)] relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${results.blacklist.safe ? 'bg-[color:var(--safe)]' : 'bg-[color:var(--danger)]'}`} />
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[color:var(--text)] font-body">Blacklist Status</h3>
                  {results.blacklist.safe ? (
                    <CheckCircle className="text-[color:var(--safe)] w-6 h-6" />
                  ) : (
                    <XCircle className="text-[color:var(--danger)] w-6 h-6" />
                  )}
                </div>
                <p className="text-2xl font-bold mb-2 font-data text-[color:var(--text)]">{results.blacklist.value}</p>
                <p className="text-sm text-[color:var(--text-dim)]">{results.blacklist.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FakeWebsiteDetector;