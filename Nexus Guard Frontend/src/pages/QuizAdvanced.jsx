import React, { useState, useEffect } from 'react';
import { fetchAdvancedQuestions } from '../services/quiz_service';

const QuizAdvanced = () => {
  const [theme, setTheme] = useState('dark');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdvancedQuestions();
      setQuestions(data);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setShowReview(false);
    } catch (err) {
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, option) => {
    if (isSubmitted) return; // Disable changing answer after submit
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_answer) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      if (!window.confirm('You have unanswered questions. Are you sure you want to submit?')) {
        return;
      }
    }
    setIsSubmitted(true);
  };

  return (
    <div
      data-theme={theme}
      className="min-h-screen transition-colors duration-300 bg-[color:var(--bg)] font-body text-[color:var(--text)]"
    >
      <style>{`
        @import url('[https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap](https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap)');

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <span className="font-data text-sm tracking-tight text-[color:var(--text)]">
                Nexus Guard
              </span>
              <span className="text-[color:var(--border)]">/</span>
              <span className="font-data text-xs text-[color:var(--accent)] uppercase tracking-wider">
                Advanced Assessment
              </span>
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

          {/* Loading & Error States */}
          {loading && (
            <div className="text-center py-20 font-data text-sm text-[color:var(--text-dim)]">
              Fetching assessment module...
            </div>
          )}

          {error && (
            <div className="p-6 rounded-md border border-[color:var(--danger)] bg-[color:var(--surface)] text-center">
              <p className="text-[color:var(--danger)] font-data mb-4">{error}</p>
              <button
                onClick={loadQuestions}
                className="px-4 py-2 font-data text-xs bg-[color:var(--surface-2)] border border-[color:var(--border)] rounded hover:bg-[color:var(--accent)] hover:text-black transition-colors"
              >
                Retry Request
              </button>
            </div>
          )}

          {/* Quiz Content */}
          {!loading && !error && questions.length > 0 && (
            <div>
              {/* Results View */}
              {isSubmitted && !showReview && (
                <div className="relative">
                  {/* HUD Corner Brackets */}
                  {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2',
                    'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((pos, i) => (
                    <span key={i} className={`absolute w-4 h-4 ${pos} -m-1.5 border-[color:var(--accent)] pointer-events-none`} />
                  ))}

                  <div className="p-8 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] text-center">
                    <h2 className="font-data text-xs text-[color:var(--accent)] uppercase tracking-widest mb-2">
                      Assessment Complete
                    </h2>
                    <div className="text-5xl font-bold font-data text-[color:var(--text)] mb-4">
                      {calculateScore()} <span className="text-2xl text-[color:var(--text-dim)]">/ {questions.length}</span>
                    </div>
                    <p className="text-[color:var(--text-dim)] max-w-md mx-auto mb-8 text-sm">
                      {calculateScore() >= 8
                        ? 'Excellent awareness! You demonstrated strong capability in identifying security fundamentals.'
                        : 'Review your responses below to learn how to identify potential threats better.'}
                    </p>

                    <div className="flex justify-center gap-4 flex-wrap font-data text-xs">
                      <button
                        onClick={() => setShowReview(true)}
                        className="px-5 py-2.5 rounded bg-[color:var(--accent)] text-black font-semibold hover:opacity-90 transition-opacity"
                      >
                        Review Answers
                      </button>
                      <button
                        onClick={loadQuestions}
                        className="px-5 py-2.5 rounded border border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--text)] hover:border-[color:var(--accent)] transition-colors"
                      >
                        Retake Quiz
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions List & Review Mode */}
              {(!isSubmitted || showReview) && (
                <div className="space-y-8">
                  {showReview && (
                    <div className="flex items-center justify-between border-b border-[color:var(--border)] pb-4 mb-6">
                      <h2 className="font-body text-xl font-medium">Detailed Breakdown</h2>
                      <button
                        onClick={() => setShowReview(false)}
                        className="font-data text-xs text-[color:var(--accent)] underline"
                      >
                        Back to Score
                      </button>
                    </div>
                  )}

                  {questions.map((q, index) => {
                    const userChoice = selectedAnswers[q.id];
                    const isCorrect = userChoice === q.correct_answer;

                    return (
                      <div key={q.id} className="relative">
                        {/* Bracket styling for questions */}
                        <div className="p-6 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)]">
                          <div className="flex items-center justify-between mb-3 font-data text-xs">
                            <span className="text-[color:var(--accent)]">
                              QUESTION {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[color:var(--surface-2)] border border-[color:var(--border)] text-[color:var(--text-dim)]">
                              {/* {q.difficulty} */} Advanced
                            </span>
                          </div>

                          <h3 className="font-body text-lg font-medium mb-5">
                            {q.question}
                          </h3>

                          {/* Options */}
                          <div className="grid gap-3">
                            {q.options.map((opt, optIdx) => {
                              let btnStyle = 'border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--text)] hover:border-[color:var(--accent)]';

                              if (isSubmitted) {
                                if (opt === q.correct_answer) {
                                  btnStyle = 'border-[color:var(--safe)] bg-[color:var(--safe)]/10 text-[color:var(--safe)]';
                                } else if (userChoice === opt && !isCorrect) {
                                  btnStyle = 'border-[color:var(--danger)] bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
                                } else {
                                  btnStyle = 'border-[color:var(--border)] opacity-40';
                                }
                              } else if (userChoice === opt) {
                                btnStyle = 'border-[color:var(--accent)] bg-[color:var(--accent)]/10 text-[color:var(--accent)]';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectOption(q.id, opt)}
                                  disabled={isSubmitted}
                                  className={`w-full text-left p-3.5 rounded border transition-all text-sm flex items-center justify-between ${btnStyle}`}
                                >
                                  <span>{opt}</span>
                                  {isSubmitted && opt === q.correct_answer && (
                                    <span className="font-data text-xs text-[color:var(--safe)]">✓ Correct</span>
                                  )}
                                  {isSubmitted && userChoice === opt && !isCorrect && (
                                    <span className="font-data text-xs text-[color:var(--danger)]">✗ Your Selection</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation output post-submission */}
                          {isSubmitted && (
                            <div className="mt-4 pt-4 border-t border-[color:var(--border)] text-xs font-data text-[color:var(--text-dim)]">
                              <span className="text-[color:var(--accent-2)] font-semibold">EXPLANATION: </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Submission Trigger */}
                  {!isSubmitted && (
                    <div className="pt-6 border-t border-[color:var(--border)] flex justify-between items-center">
                      <span className="font-data text-xs text-[color:var(--text-dim)]">
                        {Object.keys(selectedAnswers).length} of {questions.length} answered
                      </span>
                      <button
                        onClick={handleSubmit}
                        className="px-6 py-3 rounded font-data text-xs font-semibold bg-[color:var(--accent)] text-black hover:opacity-90 transition-opacity"
                      >
                        Submit Assessment
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAdvanced;