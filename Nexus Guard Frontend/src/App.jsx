import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AIChatbotWidget from './components/AIChatbotWidget';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Home from './pages/Home';
import FakeWebsiteDetector from './pages/FakeWebsiteDetector';
import LearningCentre from './pages/LearningCentre';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UserDashboard from './pages/UserDashboard';
import QuizBeginner from './pages/QuizBeginner';
import QuizIntermediate from './pages/QuizIntermediate';
import QuizAdvanced from './pages/QuizAdvanced';
import logo from './assets/Nexus_Guard_Logo (3).png';

function ProtectedDashboard() {
  const { user } = useAuth();
  const location = useLocation();

  return user ? <UserDashboard /> : <Navigate to="/signin" replace state={{ from: location.pathname }} />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detector" element={<FakeWebsiteDetector />} />
              <Route path="/learning" element={<LearningCentre />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<ProtectedDashboard />} />
              <Route path="/quiz/beginner" element={<QuizBeginner />} />
              <Route path="/quiz/intermediate" element={<QuizIntermediate />} />
              <Route path="/quiz/advanced" element={<QuizAdvanced />} />
            </Routes>
          </main>

          <AIChatbotWidget />

         <footer className="bg-[#0B1120] text-gray-400 py-12 border-t border-gray-800">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
    
    {/* 1. Brand */}
    <div>
      <img src={logo} alt="Nexus Guard" className="h-10 mb-3" />
      <p className="text-sm">Secure Today, Safer Tomorrow.<br/>Before you click, know what you're looking at.</p>
      <p className="mt-4 text-xs text-blue-400">2,483 scans this week | 312 threats caught</p>
    </div>

    {/* 2. Quick Links */}
    <div>
      <h4 className="text-white font-bold mb-3">Quick Links</h4>
      <ul className="text-sm space-y-2">
        <li>Home</li>
        <li>Fake Website Detector</li>
        <li>Learning Centre</li>
      </ul>
    </div>

    {/* 3. Cyber Crime Types */}
    <div>
      <h4 className="text-white font-bold mb-3">Common Cyber Aparadha</h4>
      <ul className="text-sm space-y-2">
        <li>🔹 Phishing & Fake Links</li>
        <li>🔹 OTP / Bank Scams</li>
        <li>🔹 Social Media Hacking</li>
        <li>🔹 Online Financial Fraud</li>
      </ul>
    </div>

   
    <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
      <h4 className="text-red-400 font-bold mb-2">🚨 Report Cyber Crime</h4>
      <p className="text-xs mb-2">CERT Hotline: <b className="text-white">101</b></p>
      <p className="text-xs mb-2">CID: <b className="text-white">011 238 1045</b></p>
      <p className="text-xs mb-2">Email: dir.cid@police.gov.lk</p>
      <a href="https://cert.gov.lk/report_incident" target="_blank" 
         className="mt-3 inline-block bg-red-600 text-white text-xs px-4 py-2 rounded hover:bg-red-700">
         Report Now
      </a>
    </div>
  </div>
  <div className="text-center text-xs mt-8 text-gray-600">
    © 2026 Nexus Guard. Built for a safer Sri Lanka.
  </div>
</footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
