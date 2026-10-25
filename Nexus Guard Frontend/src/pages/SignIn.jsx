import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { loginUser } from '../services/auth_service';

const SignIn = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  //const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email_address: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (user) {
    console.log('User is already logged in:', user);
    if (user.email === "admin.nexusguard@gmail.com") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.email_address.trim() || !formData.password) {
      setErrorMessage('Enter your email and password to continue.');
      return;
    }

    try {
      const responseData = await loginUser(formData);
      setSuccessMessage(`Welcome back, ${responseData.user.firstname}! Login successful.`);
      
      // Optional: Save user session/data to localStorage
      localStorage.setItem('user', JSON.stringify(responseData.user));

      signIn(formData.email_address.trim().toLowerCase());
      // Reset form
      setFormData({
        email_address: '',
        password: '',
      });

      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      // Handle FastAPI errors (like 401 Unauthorized or validation errors)
      if (typeof err.detail === 'string') {
        setErrorMessage(err.detail);
      } else if (Array.isArray(err.detail)) {
        setErrorMessage(err.detail.map((e) => `${e.loc.join('.')}: ${e.msg}`).join(', '));
      } else {
        setErrorMessage('An unexpected error occurred during sign in.');
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="pt-28 pb-16 px-4 min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-trust-blue-900" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 text-center">Welcome back</h1>
        <p className="text-gray-600 text-center mt-2 mb-8">Sign in to view your protection history.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={formData.email_address}
              onChange={(event) => setFormData({ ...formData, email_address: event.target.value })}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-trust-blue-900 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-trust-blue-900 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          {errorMessage && <p className="text-sm text-alert-red-600" role="alert">{errorMessage}</p>}
          <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-trust-blue-900 text-white px-4 py-3 font-semibold hover:bg-blue-800 transition-colors">
            <LockKeyhole className="w-4 h-4" />
            Sign in
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          New to Nexus Guard? <Link to="/signup" className="font-medium text-trust-blue-900 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;