import { useState } from 'react';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { createUser } from '../services/auth_service';

const SignUp = () => {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  //const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email_address: '',
    password: '',
    confirm_password: '',
    active_status: true,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  //const [error, setError] = useState('');
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const updateField = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.firstname.trim() || !formData.lastname.trim() || !formData.email_address.trim() || !formData.password || !formData.confirm_password) {
      setErrorMessage('Complete all fields to create your account.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Your password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const responseData = await createUser(formData);
      setSuccessMessage(`Account created successfully! Welcome, ${responseData.firstname}.`);
      
      // Optionally reset form
      setFormData({
        firstname: '',
        lastname: '',
        email_address: '',
        password: '',
        active_status: true,
      });

      navigate('/signin', { replace: true });
    } catch (err) {
      // Handle backend errors (like FastAPI HTTPException details or validation errors)
      if (typeof err.detail === 'string') {
        setErrorMessage(err.detail);
      } else if (Array.isArray(err.detail)) {
        // FastAPI Pydantic validation error array
        setErrorMessage(err.detail.map((e) => `${e.loc.join('.')}: ${e.msg}`).join(', '));
      } else {
        setErrorMessage('An unexpected error occurred during sign up.');
      }
    } finally {
      setLoading(false);
    }

    //signUp(formData.firstname, formData.email_address);
  };

  return (
    <div className="pt-28 pb-16 px-4 min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-trust-blue-900" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 text-center">Create your account</h1>
        <p className="text-gray-600 text-center mt-2 mb-8">Start keeping your digital life safer.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">First name</label>
            <input id="firstname" name="firstname" type="text" autoComplete="firstname" value={formData.firstname} onChange={updateField} placeholder="Your first name" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-trust-blue-900 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
            <input id="lastname" name="lastname" type="text" autoComplete="lastname" value={formData.lastname} onChange={updateField} placeholder="Your last name" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-trust-blue-900 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label htmlFor="email_address" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
            <input id="email_address" name="email_address" type="email_address" autoComplete="email_address" value={formData.email_address} onChange={updateField} placeholder="you@example.com" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-trust-blue-900 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input id="signup-password" name="password" type="password" autoComplete="new-password" value={formData.password} onChange={updateField} placeholder="At least 6 characters" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-trust-blue-900 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
            <input id="confirmPassword" name="confirm_password" type="password" autoComplete="new-password" value={formData.confirm_password} onChange={updateField} placeholder="Re-enter your password" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-trust-blue-900 focus:ring-2 focus:ring-blue-100" />
          </div>
          {errorMessage && <p className="text-sm text-alert-red-600" role="alert">{errorMessage}</p>}
          <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-trust-blue-900 text-white px-4 py-3 font-semibold hover:bg-blue-800 transition-colors">
            <LockKeyhole className="w-4 h-4" />
            Create account
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/signin" className="font-medium text-trust-blue-900 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;