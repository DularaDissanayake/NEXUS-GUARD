import React, { useState } from 'react';
import { BookOpen, Video, HelpCircle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearningCentre = () => {
  const [theme, setTheme] = useState('dark');
  const navigate = useNavigate();

  const resources = [
    {
      title: 'How to Spot a Phishing Email',
      type: 'Article',
      icon: <BookOpen className="text-[color:var(--accent-2)] w-5 h-5" />,
      description: 'Learn the top 5 signs that an email is not actually from your bank.',
      videoUrl: 'https://www.youtube.com/watch?v=LNZU5jqkZbI',
    },
    {
      title: 'The Anatomy of a Scam URL',
      type: 'Video',
      icon: <Video className="text-[color:var(--accent-2)] w-5 h-5" />,
      description: 'A 2-minute visual guide to reading web addresses correctly.',
      videoUrl: 'https://www.youtube.com/watch?v=WiEXPHYA6xM',
    },
    {
      title: 'What to do if you clicked a bad link',
      type: 'Article',
      icon: <BookOpen className="text-[color:var(--accent-2)] w-5 h-5" />,
      description: 'Immediate steps to secure your accounts and minimize damage.',
      videoUrl: 'https://www.youtube.com/watch?v=pA63jP8mPLk',
    }
  ];

  const quizzes = [
    {
      title: 'Beginner Level',
      questions: 10,
      difficulty: 'Beginner'
    },
    {
      title: 'Intermediate Level',
      questions: 10,
      difficulty: 'Intermediate'
    },
    {
      title: 'Advanced Level',
      questions: 10,
      difficulty: 'Advanced'
    }
  ];

  const handleStartQuiz = (quiz) => {
    const difficultySlug = quiz.difficulty.toLowerCase();
    navigate(`/quiz/${difficultySlug}`);
  };

  const handleReadMore = (videoUrl) => {
    window.open(videoUrl, '_blank');
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
        <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          {/* Top Bar / Theme Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 font-data text-xs text-[color:var(--accent-2)] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--safe)]" />
              Knowledge & Assessment Hub
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
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[color:var(--text)] mb-4 font-body">
              Cybersecurity Learning Centre
            </h1>
            <p className="text-base sm:text-lg text-[color:var(--text-dim)] max-w-2xl mx-auto leading-relaxed">
              Empower yourself with knowledge. Read articles, watch quick videos, and test your skills to stay one step ahead of scammers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resources Section */}
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--text)] mb-6 flex items-center font-body">
                <BookOpen className="mr-2 text-[color:var(--accent-2)] w-6 h-6" /> Latest Resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {resources.map((resource, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleReadMore(resource.videoUrl)}
                    className="bg-[color:var(--surface)] rounded-md border border-[color:var(--border)] p-6 hover:border-[color:var(--accent-2)] transition-colors cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-[color:var(--surface-2)] border border-[color:var(--border)] p-3 rounded">
                          {resource.icon}
                        </div>
                        <span className="text-xs font-data font-semibold text-[color:var(--accent-2)] uppercase tracking-wider">
                          {resource.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[color:var(--text)] mb-2 font-body">
                        {resource.title}
                      </h3>
                      <p className="text-[color:var(--text-dim)] text-sm mb-6 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadMore(resource.videoUrl);
                      }}
                      className="text-[color:var(--accent-2)] font-data text-xs font-semibold hover:underline flex items-center self-start"
                    >
                      Read More <Play className="ml-1.5 w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quizzes Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--text)] mb-6 flex items-center font-body">
                <HelpCircle className="mr-2 text-[color:var(--accent-2)] w-6 h-6" /> Test Your Skills
              </h2>
              <div className="space-y-4">
                {quizzes.map((quiz, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[color:var(--surface)] rounded-md border border-[color:var(--border)] p-6"
                  >
                    <h3 className="text-lg font-bold text-[color:var(--text)] mb-2 font-body">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs font-data text-[color:var(--text-dim)] mb-5">
                      <span>{quiz.questions} Questions</span>
                      <span>•</span>
                      <span className="text-[color:var(--accent)]">{quiz.difficulty}</span>
                    </div>
                    <button 
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full bg-[color:var(--accent-2)] hover:opacity-90 text-black font-semibold font-data text-xs py-3 px-4 rounded transition-opacity"
                    >
                      Start Quiz
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningCentre;