/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GraduationCap, Lock, Mail, UserPlus, LogIn, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: UserType) => void;
}

export function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email, password } 
      : { email, name, password, role };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Error executing requests');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (userType: 'student' | 'admin') => {
    if (userType === 'student') {
      setEmail('student@predictor.com');
      setPassword('password123');
      setIsLogin(true);
    } else {
      setEmail('admin@predictor.com');
      setPassword('admin123');
      setIsLogin(true);
    }
    setError(null);
  };

  return (
    <div className="flex min-h-[90vh] flex-col justify-center bg-[#09090b] text-slate-100 py-12 px-4 sm:px-6 lg:px-8" id="auth_container">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3">
            <GraduationCap className="h-10 w-10 text-emerald-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-serif italic text-white tracking-tight">
            {isLogin ? 'Predict Placement Readiness' : 'Create Onboarding Profile'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            {isLogin ? 'Determine candidate alignment using real-time insights' : 'Get started in seconds with personalized insights'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#121214] py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-white/5">
          
          {error && (
            <div className="mb-4 rounded-lg bg-red-950/30 p-4 text-sm text-red-400 border border-red-900/40" id="auth_error">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="reg_name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="reg_name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-lg border border-white/10 pl-10 pr-3 py-2.5 bg-white/5 text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 sm:text-sm outline-none transition"
                      placeholder="e.g. Sarah Connor"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Role Selection</label>
                  <div className="mt-2 grid grid-cols-2 gap-3" id="role_selection">
                    <button
                      type="button"
                      id="role_student_btn"
                      onClick={() => setRole('student')}
                      className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold border transition ${
                        role === 'student'
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Student
                    </button>
                    <button
                      type="button"
                      id="role_admin_btn"
                      onClick={() => setRole('admin')}
                      className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold border transition ${
                        role === 'admin'
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin Evaluation
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="auth_email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="auth_email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 pl-10 pr-3 py-2.5 bg-white/5 text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 sm:text-sm outline-none transition"
                  placeholder="name@predictor.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth_password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="auth_password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 pl-10 pr-3 py-2.5 bg-white/5 text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 sm:text-sm outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                id="btn_auth_submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-lg bg-emerald-500 py-2.5 px-4 text-sm font-semibold text-black hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-black transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                ) : isLogin ? (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Register Account
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
            <button
              type="button"
              id="btn_toggle_auth"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already registered? Log in'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Demo Credentials Guide Box */}
        <div className="mt-6 rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
            💡 Testing Credentials & Onboarding Simulator
          </h3>
          <p className="mt-1 text-xs text-slate-405 leading-relaxed">
            Skip registration or test already populated candidate charts with these sandbox profiles:
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              id="btn_autofill_student"
              onClick={() => fillQuickCredentials('student')}
              className="flex flex-col items-center bg-white/5 border border-white/5 hover:bg-white/10 p-2.5 rounded-lg transition text-left cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-200">Student Profile</span>
              <span className="text-[10px] text-slate-400">student@predictor.com</span>
            </button>
            <button
              type="button"
              id="btn_autofill_admin"
              onClick={() => fillQuickCredentials('admin')}
              className="flex flex-col items-center bg-white/5 border border-white/5 hover:bg-white/10 p-2.5 rounded-lg transition text-left cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-200">Admin Panel</span>
              <span className="text-[10px] text-slate-400">admin@predictor.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
