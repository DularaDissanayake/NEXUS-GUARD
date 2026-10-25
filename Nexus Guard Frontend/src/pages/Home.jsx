import React, { useState, useEffect } from 'react';
import ScannerCard from '../components/ScannerCard';

const Home = () => {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div
      data-theme={theme}
      className="min-h-screen transition-colors duration-300 bg-[color:var(--bg)] font-body"
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

        @keyframes sweep {
          0% { transform: translateY(-8%); opacity: 0; }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { transform: translateY(108%); opacity: 0; }
        }
        .scan-sweep { animation: sweep 3.4s ease-in-out infinite; }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        .status-dot { animation: blink 2s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .scan-sweep, .status-dot { animation: none; opacity: 0.5; }
        }
      `}</style>

      <div className="circuit-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-10 sm:pb-20">

          {/* Top bar: mark + theme toggle */}
          <div className="flex items-center justify-between mb-10 sm:mb-14">
            <span className="font-data text-sm tracking-tight text-[color:var(--text)]">Nexus Guard</span>

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

          {/* Hero */}
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-start mb-20 sm:mb-28">
            <div className="lg:pt-4">
              <h1 className="font-body text-[2.25rem] sm:text-[3rem] lg:text-[3.4rem] leading-[1.08] font-medium text-[color:var(--text)] mb-5 max-w-[17ch]">
                Before you click, know what you're looking at.
              </h1>
              <p className="text-base sm:text-lg text-[color:var(--text-dim)] max-w-[42ch] mb-8 leading-relaxed">
                Paste a message, a link, or a screenshot. Nexus Guard checks it against
                known scam patterns and tells you plainly whether it's safe.
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[color:var(--border)] pt-5 font-data text-xs sm:text-sm text-[color:var(--text-dim)]">
                <span>
                  <span className="text-[color:var(--text)]">2,481</span> scans this week
                </span>
                <span className="w-px h-3.5 bg-[color:var(--border)] hidden sm:inline-block" />
                <span>
                  <span className="text-[color:var(--danger)]">312</span> threats caught
                </span>
                <span className="w-px h-3.5 bg-[color:var(--border)] hidden sm:inline-block" />
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--safe)]" />
                  database updated 4m ago
                </span>
              </div>
            </div>

            {/* Scanner panel: HUD corner-bracket framing */}
            <div className="relative">
              {/* corner brackets */}
              {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2',
                'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((pos, i) => (
                  <span
                    key={i}
                    className={`absolute w-4 h-4 sm:w-5 sm:h-5 ${pos} -m-1.5 border-[color:var(--accent)] pointer-events-none`}
                  />
                ))}

              <div className="relative overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--surface)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
                  <div className="scan-sweep h-10 w-full bg-gradient-to-b from-transparent via-[color:var(--accent-2)]/[0.07] to-transparent" />
                </div>
                <div className="relative p-4 sm:p-6">
                  <ScannerCard />
                </div>
              </div>
            </div>
          </div>

          {/* How it works — connected sequence */}
          <div className="max-w-4xl">
            <h2 className="font-body text-xl sm:text-2xl font-medium text-[color:var(--text)] mb-8 sm:mb-10">
              How it works
            </h2>

            <div className="grid sm:grid-cols-3 gap-x-8 gap-y-8 relative">
              <div className="hidden sm:block absolute top-[0.55rem] left-[8%] right-[8%] h-px bg-[color:var(--border)]" />

              {[
                { n: '01', title: 'Submit', copy: 'Paste a suspicious text, a link, or upload a screenshot.' },
                { n: '02', title: 'Analyze', copy: 'We check it against patterns seen in real scams and phishing attempts.' },
                { n: '03', title: 'Review', copy: 'Get a plain-language risk read, and why it looks that way.' },
              ].map((step) => (
                <div key={step.n} className="relative">
                  <div className="relative z-10 font-data text-sm text-[color:var(--accent)] bg-[color:var(--bg)] inline-block pr-3 mb-2.5">
                    {step.n}
                  </div>
                  <h3 className="font-body font-semibold text-[color:var(--text)] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[color:var(--text-dim)] leading-relaxed max-w-[30ch]">
                    {step.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;