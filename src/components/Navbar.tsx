/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart3, 
  Code2, 
  FileText, 
  LogOut, 
  Map, 
  MessageSquareCode, 
  UserCircle, 
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: User;
  onLogout: () => void;
}

export function Navbar({ currentView, onViewChange, user, onLogout }: NavbarProps) {
  const isStudent = user.role === 'student';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#121214]/90 backdrop-blur-md shadow-lg shadow-black/20" id="main_navbar">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Branding Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onViewChange('dashboard')}>
          <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/10">
            <GraduationCap className="h-5 w-5 text-emerald-450" />
          </div>
          <span className="text-lg font-serif italic text-white tracking-tight">
            Predictor<span className="text-emerald-450 font-sans font-medium">.AI</span>
          </span>
        </div>

        {/* Main Navigation tabs */}
        <nav className="hidden md:flex space-x-1.5">
          {isStudent ? (
            <>
              <button
                id="btn_nav_dashboard"
                onClick={() => onViewChange('dashboard')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
                  currentView === 'dashboard'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                Dashboard
              </button>
              <button
                id="btn_nav_profile"
                onClick={() => onViewChange('profile')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
                  currentView === 'profile'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <UserCircle className="h-4 w-4 text-emerald-400" />
                Profile
              </button>
              <button
                id="btn_nav_coding"
                onClick={() => onViewChange('coding')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
                  currentView === 'coding'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Code2 className="h-4 w-4 text-emerald-400" />
                Coding runs
              </button>
              <button
                id="btn_nav_resume"
                onClick={() => onViewChange('resume')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
                  currentView === 'resume'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <FileText className="h-4 w-4 text-emerald-400" />
                Resume ATS
              </button>
              <button
                id="btn_nav_interview"
                onClick={() => onViewChange('interview')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
                  currentView === 'interview'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <MessageSquareCode className="h-4 w-4 text-emerald-400" />
                AI Interview
              </button>
              <button
                id="btn_nav_roadmap"
                onClick={() => onViewChange('roadmap')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
                  currentView === 'roadmap'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Map className="h-4 w-4 text-emerald-400" />
                Learning Path
              </button>
            </>
          ) : (
            <>
              <button
                id="btn_nav_admin"
                onClick={() => onViewChange('admin')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
                  currentView === 'admin'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="h-4 w-4 text-emerald-400" />
                Admin Panel
              </button>
            </>
          )}
        </nav>

        {/* User profile dropdown info & logout action */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-sm font-semibold text-slate-100">{user.name}</span>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">
              {user.role}
            </span>
          </div>

          <button
            id="btn_navbar_logout"
            onClick={onLogout}
            title="Log Out"
            className="flex items-center gap-1.5 rounded-lg border border-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
      
      {/* Mobile view top helper tabs line */}
      <div className="flex md:hidden items-center justify-around border-t border-white/5 py-2 bg-[#121214]">
        {isStudent ? (
          <>
            <button 
              id="mob_nav_d" 
              onClick={() => onViewChange('dashboard')} 
              className={`p-1 text-[10px] uppercase tracking-wider flex flex-col items-center cursor-pointer ${currentView === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}
            >
              <BarChart3 className="h-4 w-4 mb-0.5 text-emerald-400/80" />
              Stats
            </button>
            <button 
              id="mob_nav_c" 
              onClick={() => onViewChange('coding')} 
              className={`p-1 text-[10px] uppercase tracking-wider flex flex-col items-center cursor-pointer ${currentView === 'coding' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}
            >
              <Code2 className="h-4 w-4 mb-0.5 text-emerald-400/80" />
              Code
            </button>
            <button 
              id="mob_nav_r" 
              onClick={() => onViewChange('resume')} 
              className={`p-1 text-[10px] uppercase tracking-wider flex flex-col items-center cursor-pointer ${currentView === 'resume' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}
            >
              <FileText className="h-4 w-4 mb-0.5 text-emerald-400/80" />
              Resume
            </button>
            <button 
              id="mob_nav_i" 
              onClick={() => onViewChange('interview')} 
              className={`p-1 text-[10px] uppercase tracking-wider flex flex-col items-center cursor-pointer ${currentView === 'interview' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}
            >
              <MessageSquareCode className="h-4 w-4 mb-0.5 text-emerald-400/80" />
              Interview
            </button>
            <button 
              id="mob_nav_m" 
              onClick={() => onViewChange('roadmap')} 
              className={`p-1 text-[10px] uppercase tracking-wider flex flex-col items-center cursor-pointer ${currentView === 'roadmap' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}
            >
              <Map className="h-4 w-4 mb-0.5 text-emerald-400/80" />
              Path
            </button>
          </>
        ) : (
          <button 
            id="mob_nav_admin" 
            onClick={() => onViewChange('admin')} 
            className={`p-1 text-[10px] uppercase tracking-wider flex flex-col items-center cursor-pointer ${currentView === 'admin' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            <ShieldAlert className="h-4 w-4 mb-0.5 text-emerald-400" />
            Admin Panel Controls
          </button>
        )}
      </div>
    </header>
  );
}
