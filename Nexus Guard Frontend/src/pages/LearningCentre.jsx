import React from 'react';
import { BookOpen, Video, HelpCircle, Play } from 'lucide-react';

const LearningCentre = () => {
  const resources = [
    {
      title: 'How to Spot a Phishing Email',
      type: 'Article',
      icon: <BookOpen className="text-trust-blue-900" />,
      description: 'Learn the top 5 signs that an email is not actually from your bank.',
    },
    {
      title: 'The Anatomy of a Scam URL',
      type: 'Video',
      icon: <Video className="text-trust-blue-900" />,
      description: 'A 2-minute visual guide to reading web addresses correctly.',
    },
    {
      title: 'What to do if you clicked a bad link',
      type: 'Article',
      icon: <BookOpen className="text-trust-blue-900" />,
      description: 'Immediate steps to secure your accounts and minimize damage.',
    }
  ];

  const quizzes = [
    {
      title: 'Phishing Identifier Quiz',
      questions: 5,
      difficulty: 'Beginner'
    },
    {
      title: 'Password Security Check',
      questions: 3,
      difficulty: 'Intermediate'
    }
  ];

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-trust-blue-900 mb-4">
          Cybersecurity Learning Centre
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Empower yourself with knowledge. Read articles, watch quick videos, and test your skills to stay one step ahead of scammers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resources Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <BookOpen className="mr-2" /> Latest Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {resources.map((resource, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    {resource.icon}
                  </div>
                  <span className="text-sm font-semibold text-trust-blue-900 uppercase tracking-wider">{resource.type}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <button className="text-trust-blue-900 font-semibold text-sm hover:underline flex items-center">
                  Read More <Play className="ml-1 w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quizzes Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <HelpCircle className="mr-2" /> Test Your Skills
          </h2>
          <div className="space-y-4">
            {quizzes.map((quiz, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{quiz.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>{quiz.questions} Questions</span>
                  <span>•</span>
                  <span>{quiz.difficulty}</span>
                </div>
                <button className="w-full bg-trust-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningCentre;
