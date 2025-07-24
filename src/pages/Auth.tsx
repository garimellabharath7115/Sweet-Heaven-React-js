import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, default to home
  const from = location.state?.from?.pathname || '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    if (!isLogin && name.trim().length < 2) {
      return setError('Name must be at least 2 characters');
    }

    try {
      setError('');
      setLoading(true);
      
      if (isLogin) {
        await login(email, password);
        // Role-based redirect after login
        if (email === 'admin@gmail.com') {
          navigate('/admin');
        } else {
          // Redirect to intended destination or home
          navigate(from, { replace: true });
        }
      } else {
        await signup(email, password, name.trim());
        // After signup, redirect to intended destination or home
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to ' + (isLogin ? 'sign in' : 'create account'));
      }
    }
    
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-amber-100 flex items-center justify-center py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-rose-500 fill-current" />
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome back to' : 'Join'} Sweet-Heaven
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your sweet account'}
          </p>
        </div>
        
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xl" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-3 sm:space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 sm:top-3 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required={!isLogin}
                    className="pl-10 sm:pl-12 block w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:py-3 placeholder-gray-500 focus:border-rose-500 focus:outline-none focus:ring-rose-500 text-sm sm:text-base"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 sm:top-3 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 sm:pl-12 block w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:py-3 placeholder-gray-500 focus:border-rose-500 focus:outline-none focus:ring-rose-500 text-sm sm:text-base"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 sm:top-3 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  className="pl-10 sm:pl-12 pr-10 sm:pr-12 block w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:py-3 placeholder-gray-500 focus:border-rose-500 focus:outline-none focus:ring-rose-500 text-sm sm:text-base"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 sm:top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 sm:h-6 sm:w-6" /> : <Eye className="h-5 w-5 sm:h-6 sm:w-6" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-rose-600 hover:text-rose-500 text-sm sm:text-base font-medium"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setName('');
              }}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}