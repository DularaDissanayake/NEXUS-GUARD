import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import logo from '../assets/Nexus_Guard_Logo (3).png';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-[#22D3EE] border-b-2 border-[#22D3EE]' 
      : 'text-[#F8FAFC] hover:text-[#22D3EE]';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#0B1228]/85 backdrop-blur-md border-b border-white/10 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-22">
          <div className="flex items-center space-x-2">
            <Link to="/" className="font-bold text-xl text-[#F8FAFC] tracking-tight flex items-center">
              <img 
                src={logo} 
                alt="Nexus Guard Logo" 
                className="h-20 object-contain" 
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium h-full flex items-center px-1 transition-colors ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/detector" className={`font-medium h-full flex items-center px-1 transition-colors ${isActive('/detector')}`}>
              Fake Website Detector
            </Link>
            <Link to="/learning" className={`font-medium h-full flex items-center px-1 transition-colors ${isActive('/learning')}`}>
              Learning Centre
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2 text-[#F8FAFC] hover:text-[#22D3EE] font-medium text-sm transition-colors">
                  <User size={16} />
                  <span>{user.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => { signOut(); navigate('/'); }}
                  className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-[#F8FAFC] px-4 py-2 rounded-full transition-colors font-medium text-sm shadow-sm"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <Link to="/signin" className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-[#F8FAFC] px-5 py-2 rounded-full transition-colors font-medium text-sm shadow-sm">
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