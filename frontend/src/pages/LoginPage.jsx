/**
 * Login Page Component
 * Company login and registration with email/password
 */

import { useState } from 'react';
import { registerCompany, loginCompany } from '../services/api';

export function LoginPage({ onCompanyLogin, onCompanyCreated }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    industry: '',
    sustainabilityGoal: '',
    headquartersLocation: '',
  });

  /**
   * Handle company login
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate inputs
    if (!loginData.email || !loginData.password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      const response = await loginCompany(loginData.email, loginData.password);

      if (response.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          onCompanyLogin(response.data);
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle company registration
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Company name, email, and password are required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password length
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validate password match
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        industry: registerData.industry || undefined,
        sustainabilityGoal: registerData.sustainabilityGoal || undefined,
        headquartersLocation: registerData.headquartersLocation || undefined,
      };

      const response = await registerCompany(payload);

      if (response.success) {
        setSuccess('Company registered successfully! Logging you in...');
        setTimeout(() => {
          onCompanyCreated(response.data);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const switchToLogin = () => {
    setMode('login');
    setError('');
    setSuccess('');
  };

  const switchToRegister = () => {
    setMode('register');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gradient mb-2">CarbonChain Pro</h1>
          <p className="text-text-secondary">Supply Chain Carbon & Net-Zero Tracker</p>
        </div>

        {/* Card */}
        <div className="card-base">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border-color">
            <button
              onClick={switchToLogin}
              className={`flex-1 py-3 font-semibold transition-all ${
                mode === 'login'
                  ? 'text-accent-emerald border-b-2 border-accent-emerald -mb-1'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={switchToRegister}
              className={`flex-1 py-3 font-semibold transition-all ${
                mode === 'register'
                  ? 'text-accent-emerald border-b-2 border-accent-emerald -mb-1'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-text-primary font-semibold mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="your@company.com"
                  className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary font-semibold mb-3">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                  className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-danger-red bg-opacity-10 border border-danger-red rounded-lg">
                  <p className="text-danger-red text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-success-green bg-opacity-10 border border-success-green rounded-lg">
                  <p className="text-success-green text-sm">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !loginData.email || !loginData.password}
                className="w-full bg-accent-emerald text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <p className="text-text-secondary text-sm text-center">
                No account?{' '}
                <button
                  type="button"
                  onClick={switchToRegister}
                  className="text-accent-emerald hover:underline font-semibold"
                >
                  Register here
                </button>
              </p>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-text-primary text-sm font-semibold mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  placeholder="e.g., Sustainable Corp"
                  className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-text-primary text-sm font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="company@example.com"
                  className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-text-primary text-sm font-semibold mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-text-primary text-sm font-semibold mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Re-enter password"
                  className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
                  required
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-text-primary text-sm font-semibold mb-2">
                  Industry
                </label>
                <select
                  name="industry"
                  value={registerData.industry}
                  onChange={handleRegisterChange}
                  className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
                >
                  <option value="">Select Industry</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Technology">Technology</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Sustainability Goal */}
              <div>
                <label className="block text-text-primary text-sm font-semibold mb-2">
                  Sustainability Goal
                </label>
                <input
                  type="text"
                  name="sustainabilityGoal"
                  value={registerData.sustainabilityGoal}
                  onChange={handleRegisterChange}
                  placeholder="e.g., Net Zero by 2030"
                  className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
                />
              </div>

              {/* Headquarters Location */}
              <div>
                <label className="block text-text-primary text-sm font-semibold mb-2">
                  Headquarters Location
                </label>
                <input
                  type="text"
                  name="headquartersLocation"
                  value={registerData.headquartersLocation}
                  onChange={handleRegisterChange}
                  placeholder="e.g., San Francisco, CA"
                  className="w-full bg-primary-darker border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald"
                />
              </div>

              {error && (
                <div className="p-4 bg-danger-red bg-opacity-10 border border-danger-red rounded-lg">
                  <p className="text-danger-red text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-success-green bg-opacity-10 border border-success-green rounded-lg">
                  <p className="text-success-green text-sm">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-emerald text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register Company'}
              </button>

              <p className="text-text-secondary text-sm text-center">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-accent-emerald hover:underline font-semibold"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-text-secondary text-xs text-center mt-8">
          Helping companies balance sustainability, cost efficiency, and business continuity
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
