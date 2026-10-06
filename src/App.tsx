/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  BarChart3, 
  UserCircle, 
  Code2, 
  FileText, 
  MessageSquareCode, 
  Map, 
  Award, 
  Layers, 
  BookOpen, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X, 
  Loader2 
} from 'lucide-react';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentProfile from './pages/StudentProfile';
import CodingAssessment from './pages/CodingAssessment';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import InterviewFeedback from './pages/InterviewFeedback';
import PlacementReport from './pages/PlacementReport';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import LearningRoadmap from './pages/LearningRoadmap';
import AdminDashboard from './pages/AdminDashboard';
import { User } from './types';

function NavigationWrapper({ user, onLogout, children }: { user: User; onLogout: () => void; children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isStudent = user.role === 'student';

  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/profile', label: 'Academic Profile', icon: UserCircle },
    { path: '/report', label: 'Placement Report', icon: Award },
    { path: '/gaps', label: 'Skill Gap Analysis', icon: Layers },
    { path: '/roadmap', label: 'Learning Roadmap', icon: BookOpen },
    { path: '/coding', label: 'Algorithmic Sandbox', icon: Code2 },
    { path: '/resume', label: 'ATS CV Screener', icon: FileText },
    { path: '/interview', label: 'AI Mock Interview', icon: MessageSquareCode },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Admin Panel', icon: ShieldAlert }
  ];

  const activeLinks = isStudent ? studentLinks : adminLinks;

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col md:flex-row relative" id="layout_navigator">
      
      {/* Mobile Header */}
      <header className="md:hidden w-full bg-[#121214] border-b border-white/5 h-16 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-emerald-400" />
          <span className="font-serif italic text-white text-lg font-bold">Predictor.AI</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-1 rounded text-slate-400 hover:text-white transition cursor-pointer"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-y-0 left-0 right-0 top-16 bg-[#121214] z-40 border-b border-white/5 p-4 flex flex-col justify-between">
          <nav className="space-y-1.5">
            {activeLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-xs font-semibold uppercase tracking-wider border transition ${
                    isActive 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450' 
                      : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/5 pt-4 space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-slate-200 border border-white/5 uppercase font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{user.name}</p>
                <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
                navigate('/login');
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/15 text-red-400 py-3 text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out Session
            </button>
          </div>
        </div>
      )}

      {/* Sidebar (Desktop Only) */}
      <aside className="hidden md:flex md:w-[230px] border-r border-white/5 bg-[#121214] shrink-0 flex-col justify-between p-4 sticky top-0 h-screen font-sans">
        <div className="space-y-6">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 px-1">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-1.5 shrink-0">
              <GraduationCap className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="font-serif italic text-white text-lg font-bold tracking-tight">
              Predictor<span className="text-emerald-400 font-sans font-medium">.AI</span>
            </span>
          </Link>

          {/* Links navigation list */}
          <nav className="space-y-1">
            {activeLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-extrabold' 
                      : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-emerald-400" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* User context cards footer */}
        <div className="border-t border-white/5 pt-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-slate-200 border border-white/5 uppercase font-bold text-xs shrink-0 font-mono">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider">{user.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              onLogout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400 py-2.5 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>

      </aside>

      {/* Main Container Viewport */}
      {location.pathname === '/coding' ? (
        <div className="flex-1 flex flex-col min-h-0 min-w-0 h-screen overflow-hidden">
          {children}
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between min-h-screen min-w-0 bg-[#09090b]">
          <main className="w-full flex-1 p-2.5 sm:p-4 md:p-6 lg:p-6 min-w-0">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-[#121214] border-t border-white/5 py-5 px-4 sm:px-6 text-center text-[10px] text-slate-400">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-slate-300">Predictor.AI</span>
                <span>- Standard Verification Engine</span>
              </div>
              <p>© {new Date().getFullYear()} Campus Placements analytics. Powered by Gemini.</p>
            </div>
          </footer>
        </div>
      )}

    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    const cachedUser = localStorage.getItem('predictor_session_user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        localStorage.removeItem('predictor_session_user');
      }
    }
    setBootstrapping(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('predictor_session_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('predictor_session_user');
  };

  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-slate-100 font-mono">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto" />
          <p className="text-[10px] uppercase tracking-widest animate-pulse text-zinc-500">BOOTSTRAPPING DESKTOP SIMULATOR...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            !user ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : user.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            !user ? (
              <Register onLoginSuccess={handleLoginSuccess} />
            ) : user.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />

        {/* Protected Student Routes */}
        <Route
          path="/dashboard"
          element={
            user && user.role === 'student' ? (
              <NavigationWrapper user={user} onLogout={handleLogout}>
                <Dashboard user={user} />
              </NavigationWrapper>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user && user.role === 'student' ? (
              <NavigationWrapper user={user} onLogout={handleLogout}>
                <StudentProfile user={user} />
              </NavigationWrapper>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/report"
          element={
            user && user.role === 'student' ? (
              <NavigationWrapper user={user} onLogout={handleLogout}>
                <PlacementReport user={user} />
              </NavigationWrapper>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/gaps"
          element={
            user && user.role === 'student' ? (
              <NavigationWrapper user={user} onLogout={handleLogout}>
                <SkillGapAnalysis user={user} />
              </NavigationWrapper>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/roadmap"
          element={
            user && user.role === 'student' ? (
              <NavigationWrapper user={user} onLogout={handleLogout}>
                <LearningRoadmap user={user} />
              </NavigationWrapper>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/coding"
          element={
            user && user.role === 'student' ? (
              <NavigationWrapper user={user} onLogout={handleLogout}>
                <CodingAssessment user={user} />
              </NavigationWrapper>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/resume"
          element={
            user && user.role === 'student' ? (
              <NavigationWrapper user={user} onLogout={handleLogout}>
                <ResumeAnalyzer user={user} />
              </NavigationWrapper>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/interview"
          element={
            user && user.role === 'student' ? (
              <NavigationWrapper user={user} onLogout={handleLogout}>
                <InterviewFeedback user={user} />
              </NavigationWrapper>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            user && user.role === 'admin' ? (
              <NavigationWrapper user={user} onLogout={handleLogout}>
                <AdminDashboard />
              </NavigationWrapper>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback Catch-all Route */}
        <Route 
          path="*" 
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : user.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
