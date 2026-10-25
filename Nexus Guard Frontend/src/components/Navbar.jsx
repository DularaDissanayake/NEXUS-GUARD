import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'text-trust-blue-900 border-b-2 border-trust-blue-900' : 'text-gray-600 hover:text-trust-blue-900';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="font-bold text-xl text-trust-blue-900 tracking-tight">
              Nexus Guard
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium h-full flex items-center px-1 ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/detector" className={`font-medium h-full flex items-center px-1 ${isActive('/detector')}`}>
              Fake Website Detector
            </Link>
            <Link to="/learning" className={`font-medium h-full flex items-center px-1 ${isActive('/learning')}`}>
              Learning Centre
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-trust-blue-900 font-medium text-sm">
                  <User size={16} />
                  <span>{user.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => { signOut(); navigate('/'); }}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full transition-colors font-medium text-sm"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <Link to="/signin" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors font-medium text-sm">
                <LogIn size={16} />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
