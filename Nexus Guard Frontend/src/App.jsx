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
            </Routes>
          </main>

          <AIChatbotWidget />

          <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
            <p>© 2026 NEXUS GUARD. Project for ITIC2272 - Skills Development Project II.</p>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
