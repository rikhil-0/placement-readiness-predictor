/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Play, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Search, 
  Filter, 
  Sparkles, 
  History, 
  RotateCcw, 
  Cpu, 
  Activity, 
  Award,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Maximize2,
  Minimize2,
  Terminal,
  Brain,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  Flame,
  Check,
  PanelRightClose,
  PanelRightOpen,
  X,
  Keyboard,
  Braces,
  RotateCw,
  Compass
} from 'lucide-react';
import { User, CodingAssessment as CodingAssessmentType, AssessmentSubmission } from '../types';

interface CodingAssessmentProps {
  user: User;
}

type SelectedTabType = 'description' | 'submissions' | 'testcases';
type AssistantRequestType = 'explain' | 'hint' | 'debug' | 'optimize' | 'complexity' | 'interview';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  requestType?: AssistantRequestType;
  timestamp: Date;
}

export default function CodingAssessment({ user }: CodingAssessmentProps) {
  const [assessments, setAssessments] = useState<CodingAssessmentType[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<CodingAssessmentType | null>(null);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Coding states
  const [activeLanguage, setActiveLanguage] = useState<'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'c'>('javascript');
  const [userCode, setUserCode] = useState('');
  
  // Custom input toggle
  const [customInput, setCustomInput] = useState('');
  const [enableCustomInput, setEnableCustomInput] = useState(false);
  
  // Exectuion running states
  const [executing, setExecuting] = useState(false);
  const [results, setResults] = useState<{
    compiledSuccessfullyObj: boolean;
    compilerLog: string;
    runtime: string;
    memory: string;
    testCases: {
      input: string;
      actual: string;
      expected: string;
      passed: boolean;
      logStr?: string;
    }[];
  } | null>(null);

  // Center column tabs
  const [activeTab, setActiveTab] = useState<SelectedTabType>('description');

  // AI Placement Coach drawer states
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      text: "Welcome, Candidate! I am your real-time AI Placement Coach. 🌟\n\nNeed high-level help? Tap any focus mode above to analyze your solution code, identify hidden logical bugs, perform run-time analysis, or generate mock behavior questions directly linked to this challenge.",
      timestamp: new Date()
    }
  ]);
  const [activeAiTab, setActiveAiTab] = useState<AssistantRequestType | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Monaco Editor Ref
  const [editorRef, setEditorRef] = useState<any>(null);
  const [monacoRef, setMonacoRef] = useState<Monaco | null>(null);

  // Panel collapsed/visibility switches for maximized workspace feel
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);

  // Dynamic layout resizing states and helper references
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isDragging, setIsDragging] = useState(false);
  const [explorerWidth, setExplorerWidth] = useState(22); // percent
  const [statementWidth, setStatementWidth] = useState(33); // percent
  const [editorWidth, setEditorWidth] = useState(45); // percent
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSplitterOneDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const currentX = moveEvent.clientX - containerRect.left;
      
      let newExplorerWidth = (currentX / containerRect.width) * 100;
      
      // Boundaries to prevent layout collapse
      if (newExplorerWidth < 10) newExplorerWidth = 10;
      if (newExplorerWidth > 40) newExplorerWidth = 40;
      
      const remainingWidth = 100 - newExplorerWidth;
      const currentSum = statementWidth + editorWidth;
      
      const statementRatio = statementWidth / currentSum;
      const editorRatio = editorWidth / currentSum;
      
      setExplorerWidth(newExplorerWidth);
      setStatementWidth(remainingWidth * statementRatio);
      setEditorWidth(remainingWidth * editorRatio);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleSplitterTwoDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const currentX = moveEvent.clientX - containerRect.left;
      
      const currentXPercent = (currentX / containerRect.width) * 100;
      
      if (leftSidebarCollapsed) {
        let newStatementWidth = currentXPercent;
        if (newStatementWidth < 15) newStatementWidth = 15;
        if (newStatementWidth > 85) newStatementWidth = 85;
        
        setStatementWidth(newStatementWidth);
        setEditorWidth(100 - newStatementWidth);
      } else {
        let newExplorerStatementSum = currentXPercent;
        if (newExplorerStatementSum < explorerWidth + 15) newExplorerStatementSum = explorerWidth + 15;
        if (newExplorerStatementSum > 100 - 20) newExplorerStatementSum = 100 - 20;
        
        const newEditorWidth = 100 - newExplorerStatementSum;
        const newStatementWidth = newExplorerStatementSum - explorerWidth;
        
        setStatementWidth(newStatementWidth);
        setEditorWidth(newEditorWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Available Categories
  const categoriesList = [
    'All', 'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 
    'Graphs', 'Dynamic Programming', 'Greedy', 'Recursion', 'Sorting', 'Searching'
  ];

  // Load assessments & solutions history
  useEffect(() => {
    async function loadData() {
      try {
        const [assRes, subRes] = await Promise.all([
          fetch('/api/assessments'),
          fetch(`/api/submissions/${user.id}`)
        ]);

        if (assRes.ok) {
          const arr: CodingAssessmentType[] = await assRes.json();
          setAssessments(arr);
          if (arr.length > 0) {
            setSelectedAssessment(arr[0]);
            const codeTemplate = arr[0].starterTemplates?.javascript || arr[0].initialCode || '';
            setUserCode(codeTemplate);
          }
        }
        if (subRes.ok) {
          const list = await subRes.json();
          setSubmissions(list);
        }
      } catch (err) {
        console.error('Failed loading assessments data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user.id]);

  // Autofocus chat window when new message arrives
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, aiLoading]);

  // Handle active language change
  const handleLanguageChange = (lang: 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'c') => {
    setActiveLanguage(lang);
    if (!selectedAssessment) return;

    const templates = selectedAssessment.starterTemplates;
    if (templates && templates[lang]) {
      setUserCode(templates[lang]);
    } else {
      setUserCode(selectedAssessment.initialCode || '');
    }
    // Clear results & logs to avoid confusion
    setResults(null);
  };

  // Select key challenge
  const selectChallenge = (ass: CodingAssessmentType) => {
    setSelectedAssessment(ass);
    setResults(null);
    setActiveTab('description');
    
    // Check for prior submission
    const prior = submissions.find(s => s.assessmentId === ass.id);
    if (prior) {
      setUserCode(prior.code);
    } else {
      const templates = ass.starterTemplates;
      if (templates && templates[activeLanguage]) {
        setUserCode(templates[activeLanguage]);
      } else {
        setUserCode(ass.initialCode || '');
      }
    }
  };

  // Reset actual solution template
  const handleResetCode = () => {
    if (!selectedAssessment) return;
    const templates = selectedAssessment.starterTemplates;
    if (templates && templates[activeLanguage]) {
      setUserCode(templates[activeLanguage]);
    } else {
      setUserCode(selectedAssessment.initialCode || '');
    }
    setResults(null);
  };

  // Auto-format document trigger invoking monaco native formatter
  const handleFormatCode = () => {
    if (editorRef) {
      editorRef.getAction('editor.action.formatDocument').run();
    }
  };

  // Run Code / Submit Code execution
  const handleRunCode = async (isSubmit: boolean = false) => {
    if (!selectedAssessment) return;
    setExecuting(true);
    setResults(null);
    
    try {
      const response = await fetch('/api/assessments/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          assessmentId: selectedAssessment.id,
          code: userCode,
          language: activeLanguage,
          customInput: enableCustomInput ? customInput : undefined,
          isSubmit
        })
      });

      if (response.ok) {
        const payload = await response.json();
        setResults({
          compiledSuccessfullyObj: payload.compiledSuccessfully,
          compilerLog: payload.compilerMessage,
          runtime: payload.runtime,
          memory: payload.memory,
          testCases: payload.testResults
        });

        if (isSubmit) {
          // Re-load submissions payload
          const subRes = await fetch(`/api/submissions/${user.id}`);
          if (subRes.ok) {
            const list = await subRes.json();
            setSubmissions(list);
          }
        }
      } else {
        const errorText = await response.text();
        alert(`Compilation environment feedback error: ${errorText}`);
      }
    } catch (e: any) {
      console.error('Execution system fault:', e);
    } finally {
      setExecuting(false);
    }
  };

  // Core Request to AI Coach
  const handleAiRequest = async (type: AssistantRequestType) => {
    if (!selectedAssessment) return;
    setAiLoading(true);
    setActiveAiTab(type);
    setAiDrawerOpen(true); // Always open drawer upon request

    const promptLabels: Record<AssistantRequestType, string> = {
      explain: "Explain Challenge & Data Layout",
      hint: "Request Progressive Hints",
      debug: "Diagnose Code Faults",
      optimize: "Propose Optimal Algorithms",
      complexity: "Analyze Space/Time Big-O",
      interview: "Mock Architectural Interview"
    };

    // Append user's action message
    const userMsgId = `user-${Date.now()}`;
    const userText = `Please analyze my ${activeLanguage} solution and provide: **${promptLabels[type]}**`;
    
    setAiMessages(prev => [...prev, {
      id: userMsgId,
      role: 'user',
      text: userText,
      requestType: type,
      timestamp: new Date()
    }]);

    try {
      const response = await fetch('/api/assessments/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          problemId: selectedAssessment.id,
          code: userCode,
          language: activeLanguage,
          requestType: type
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: data.response || "No feedback generated from AI host.",
          requestType: type,
          timestamp: new Date()
        }]);
      } else {
        setAiMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: "My apologies, the compiler coach node lost tracking. Let's retry that prompt.",
          requestType: type,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Coaching endpoint error:', error);
      setAiMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: "Could not link with our Placement Engine. Please verify server connection state.",
        requestType: type,
        timestamp: new Date()
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Editor mounted hook
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    setEditorRef(editor);
    setMonacoRef(monaco);

    // Command bindings to enhance user delight
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode(false);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      handleRunCode(true);
    });
  };

  // Dynamic filter lists
  const filteredProblems = assessments.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.category || 'Arrays').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.difficulty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || (p.category || 'Arrays') === selectedCategory;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Calculate dynamic statistics
  const solvedProblemIds = new Set(submissions.filter(s => s.status === 'Solved').map(s => s.assessmentId));
  const solvedCount = solvedProblemIds.size;
  const totalProblems = assessments.length || 53;
  const progressPercent = Math.round((solvedCount / totalProblems) * 100) || 0;

  // Accuracies
  const totalSubmissionAttempts = submissions.length;
  const successfullySolvedTrials = submissions.filter(s => s.status === 'Solved').length;
  const accuracy = totalSubmissionAttempts > 0 ? Math.round((successfullySolvedTrials / totalSubmissionAttempts) * 100) : 100;
  
  // Simulated engagement stats
  const activeStreak = totalSubmissionAttempts > 0 ? 12 : 0;

  const getDiffBadgeColor = (diff: 'Easy' | 'Medium' | 'Hard') => {
    if (diff === 'Easy') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (diff === 'Medium') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  // Native CSS Markdown formatter without extra packages
  const renderNativeMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');

    return (
      <div className="space-y-2 text-slate-300 font-sans leading-relaxed text-xs">
        {lines.map((line, idx) => {
          // Headers
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-[13px] font-bold text-emerald-400 font-mono tracking-wide mt-4 mb-2 border-b border-white/5 pb-1 uppercase">
                {line.substring(4)}
              </h3>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-sm font-bold text-slate-100 font-mono mt-5 mb-2">
                {line.substring(3)}
              </h2>
            );
          }
          if (line.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-base font-bold text-white mt-6 mb-3">
                {line.substring(2)}
              </h1>
            );
          }

          // Bullet lists
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-3 my-1">
                <span className="text-emerald-400 mt-1 shrink-0 select-none">✦</span>
                <span className="flex-1 text-slate-300">{formatInlineSymbols(line.substring(2))}</span>
              </div>
            );
          }

          // Numbered lists
          const numMatch = line.match(/^\d+\.\s(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-3 my-1">
                <span className="text-emerald-500 font-bold font-mono text-[10px] mt-0.5 shrink-0 select-none">{line.match(/^\d+/)?.[0]}.</span>
                <span className="flex-1 text-slate-300">{formatInlineSymbols(numMatch[1])}</span>
              </div>
            );
          }

          // Format blockquotes
          if (line.startsWith('> ')) {
            return (
              <div key={idx} className="pl-3 border-l-2 border-emerald-500/35 py-1 my-2 bg-emerald-500/5 rounded-r text-slate-350 italic">
                {formatInlineSymbols(line.substring(2))}
              </div>
            );
          }

          // Empty lines
          if (line.trim() === '') {
            return <div key={idx} className="h-2" />;
          }

          return (
            <p key={idx} className="leading-relaxed">
              {formatInlineSymbols(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // Format code blocks & bold typography
  const formatInlineSymbols = (line: string) => {
    const boldCodeRegex = /(\*\*.*?\*\*|`.*?`)/g;
    const components = line.split(boldCodeRegex);

    return components.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="text-slate-100 font-semibold tracking-wide bg-white/5 px-1 py-0.5 rounded">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-1.5 py-0.5 bg-zinc-900 border border-white/5 rounded text-emerald-400 font-mono text-[11px] font-medium inline-block">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans antialiased overflow-hidden selection:bg-emerald-500/20">
      
      {/* 1. Header showing high-level stats and brand */}
      <header className="h-16 bg-[#0a0a0d]/90 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between z-30 relative shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 shadow-inner">
              <Code2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs font-black tracking-widest text-slate-100 uppercase font-mono">Algorithmic Sandbox</h1>
                <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded-full font-mono font-extrabold uppercase animate-pulse">PRO</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Interactive compilation & AI placements accelerator.</p>
            </div>
          </div>
        </div>

        {/* Global Stats bar - replacing custom small metrics cards */}
        <div className="flex items-center gap-4 lg:gap-8">
          
          {/* Level Completion Progress */}
          <div className="hidden sm:flex flex-col items-end gap-1.5 min-w-[120px] lg:min-w-[170px]">
            <div className="flex items-center justify-between w-full text-[10px] font-mono tracking-widest text-slate-400">
              <span className="uppercase">OVERALL PROGRESS</span>
              <span className="text-emerald-400 font-bold font-sans">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#121216] border border-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-350" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="h-8 w-px bg-white/5 hidden sm:block" />

          {/* Metric details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            <div className="flex items-center gap-2 bg-[#101014] border border-white/5 py-1 px-2.5 rounded-lg">
              <Award className="h-3.5 w-3.5 text-emerald-400" />
              <div className="text-left">
                <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-mono">Accuracy</span>
                <span className="text-[11px] font-bold text-slate-100">{accuracy}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#101014] border border-white/5 py-1 px-2.5 rounded-lg">
              <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-550" />
              <div className="text-left">
                <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-mono">Streak</span>
                <span className="text-[11px] font-bold text-slate-100">{activeStreak} Days</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-[#101014] border border-white/5 py-1 px-2.5 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <div className="text-left">
                <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-mono">Solved</span>
                <span className="text-[11px] font-bold text-slate-100">{solvedCount} / {totalProblems}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Responsive 3-Panel Main Layout Component */}
      <div 
        ref={containerRef}
        className="flex-1 flex flex-col lg:flex-row min-h-0 min-w-0 relative select-none bg-[#070709]"
      >
        
        {/* PANEL 1: Leftmost Problem Explorer */}
        <aside 
          style={isDesktop ? { width: `${leftSidebarCollapsed ? 0 : explorerWidth}%` } : undefined}
          className={`bg-[#09090b] border-r border-white/5 flex flex-col shrink-0 z-20 ${
            leftSidebarCollapsed ? 'lg:hidden opacity-0 overflow-hidden w-0' : 'w-full'
          }`}
          id="problems_sidebar"
        >
          {/* Inner headers & filter container */}
          <div className="p-4 flex flex-col gap-3 shrink-0 bg-[#0b0c0f]/80 border-b border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 font-mono">Challenge Selector</span>
              <button 
                onClick={() => setLeftSidebarCollapsed(true)} 
                className="lg:hidden text-slate-400 hover:text-white p-1 rounded hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Search problems */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search problem title, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121216] border border-white/5 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/30 transition-all font-mono"
              />
            </div>

            {/* Difficulty Segment selector */}
            <div className="flex gap-1 bg-[#121216] p-1 border border-white/5 rounded-lg select-none">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`flex-1 py-1 rounded text-[10px] font-bold font-mono transition-colors uppercase tracking-wider ${
                    selectedDifficulty === diff 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Category horizontal lists */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 block font-mono">Domain Track</span>
              <div className="flex gap-1 overflow-x-auto pb-1 select-none scrollbar-thin scrollbar-thumb-white/5 pr-1">
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 rounded-md text-[9px] font-mono tracking-wider transition-colors border shrink-0 uppercase ${
                      selectedCategory === cat
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Problem list scrollable */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-[#070709]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Compiling Placement Index...</p>
              </div>
            ) : filteredProblems.length > 0 ? (
              filteredProblems.map((ass) => {
                const isSelected = selectedAssessment?.id === ass.id;
                const isSolved = solvedProblemIds.has(ass.id);

                return (
                  <button
                    key={ass.id}
                    onClick={() => selectChallenge(ass)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 select-none ${
                      isSelected 
                        ? 'bg-emerald-500/[0.04] border-emerald-500/20 shadow-md shadow-emerald-500/5' 
                        : 'bg-[#0a0a0c] border-transparent hover:border-white/5 hover:bg-[#0e0e11]'
                    }`}
                  >
                    {/* Status check icons */}
                    <div className="mt-1 shrink-0">
                      {isSolved ? (
                        <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-emerald-400 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-700 hover:border-emerald-500/40" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[9px] font-mono py-0.5 px-1.5 rounded uppercase font-bold tracking-wider border ${getDiffBadgeColor(ass.difficulty)}`}>
                          {ass.difficulty}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 font-bold uppercase truncate max-w-[100px]">
                          {ass.category || 'Algorithms'}
                        </span>
                      </div>
                      <h4 className={`text-xs font-bold mt-2 truncate ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>
                        {ass.title}
                      </h4>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-20 text-center text-slate-500 font-medium italic text-xs">
                No matching code challenges found.
              </div>
            )}
          </div>
        </aside>

        {/* Floating Mini Explorer Drawer opener on desktop */}
        {leftSidebarCollapsed && (
          <div className="hidden lg:flex flex-col items-center gap-4 bg-[#0a0a0d] border-r border-white/5 w-12 py-4 shrink-0 transition-all">
            <button 
              onClick={() => setLeftSidebarCollapsed(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              title="Open problem list"
            >
              <PanelRightOpen className="h-4 w-4 transform rotate-180" />
            </button>
            <div className="h-px w-6 bg-white/5" />
            <span className="text-[9px] font-bold font-mono tracking-widest text-[#10b981] vertical-text select-none uppercase">
              PROBLEMS
            </span>
          </div>
        )}

        {/* Dynamic Splitter One (between Panel 1 Explorer and Panel 2 Statement) */}
        {!leftSidebarCollapsed && (
          <div
            onMouseDown={handleSplitterOneDrag}
            className="hidden lg:flex w-1 self-stretch cursor-col-resize hover:bg-emerald-500/40 active:bg-emerald-500/70 bg-transparent transition-colors items-center justify-center relative group z-30"
          >
            <div className="absolute inset-y-0 w-[1px] bg-white/5 group-hover:bg-emerald-500/20" />
          </div>
        )}

        {/* PANEL 2: Problem Details & Tab View */}
        <section 
          style={isDesktop ? { 
            width: `${leftSidebarCollapsed ? (statementWidth / (statementWidth + editorWidth)) * 100 : statementWidth}%` 
          } : undefined}
          className="bg-[#09090b] flex flex-col min-w-0"
        >
          {/* Drawer opener bar on tablet/mobile views */}
          <div className="bg-[#0b0c10] border-b border-white/5 px-4 h-12 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 lg:bg-transparent"
                title="Toggle problem catalog"
              >
                <Braces className="h-4 w-4 text-emerald-400" />
              </button>
              
              {/* Custom Nav tabs for problem details */}
              <div className="flex gap-1 p-0.5 bg-[#121216] border border-white/5 rounded-lg">
                {(['description', 'submissions', 'testcases'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider transition-all select-none ${
                      activeTab === tab 
                        ? 'bg-[#1a1a24] text-emerald-400 font-extrabold shadow' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab === 'description' && 'Description'}
                    {tab === 'submissions' && `History (${submissions.filter(s => s.assessmentId === selectedAssessment?.id).length})`}
                    {tab === 'testcases' && 'Test Cases'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick AI Trigger button */}
            <button
              onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
              className="flex items-center gap-1 text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg font-mono font-bold tracking-wider transition-all"
            >
              <Brain className="h-3.5 w-3.5 text-emerald-450 animate-pulse" />
              COACH {aiDrawerOpen ? 'CLOSE' : 'OPEN'}
            </button>
          </div>

          {/* Content area with optimized, sleek p-4 responsive padding */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto select-none bg-[#09090c] relative">
            
            {selectedAssessment ? (
              <div className="space-y-6">
                
                {/* TAB 1: Problem description and parameters */}
                {activeTab === 'description' && (
                  <div className="space-y-6">
                    
                    {/* Interactive Header Title block */}
                    <div className="bg-[#121217]/50 border border-white/5 rounded-xl p-4 shadow-sm backdrop-blur">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider border ${getDiffBadgeColor(selectedAssessment.difficulty)}`}>
                          {selectedAssessment.difficulty}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">
                          {selectedAssessment.category || 'Algorithms'}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-white mt-3 leading-snug tracking-tight">
                        {selectedAssessment.title}
                      </h2>
                    </div>

                    {/* Main explanation body */}
                    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-xs border-t border-white/5 pt-5 space-y-4 font-sans whitespace-pre-wrap">
                      {selectedAssessment.description}
                    </div>

                    {/* Formatting beautiful example cards */}
                    {selectedAssessment.examples && selectedAssessment.examples.length > 0 && (
                      <div className="space-y-3 pt-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono block">Examples Specifications</span>
                        
                        {selectedAssessment.examples.map((ex, exIdx) => (
                          <div key={exIdx} className="bg-[#121217]/80 border border-white/5 rounded-xl p-4 font-mono text-xs overflow-hidden">
                            <p className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold mb-3">Example {exIdx + 1}</p>
                            
                            <div className="space-y-2">
                              <div className="grid grid-cols-[70px_1fr] gap-2 items-start border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                                <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Input:</span>
                                <span className="text-slate-200 select-all">{ex.input}</span>
                              </div>
                              <div className="grid grid-cols-[70px_1fr] gap-2 items-start border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                                <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Output:</span>
                                <span className="text-emerald-400 font-bold select-all">{ex.output}</span>
                              </div>
                              {ex.explanation && (
                                <div className="grid grid-cols-[70px_1fr] gap-2 items-start">
                                  <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Reason:</span>
                                  <span className="text-slate-400 italic font-sans text-[11px] leading-relaxed">{ex.explanation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Code complexity constraints */}
                    {selectedAssessment.constraints && selectedAssessment.constraints.length > 0 && (
                      <div className="space-y-3 pt-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono block">Technical Boundaries</span>
                        <div className="bg-[#121217]/40 border border-white/5 rounded-xl p-4">
                          <ul className="space-y-2 font-mono text-[11px] text-slate-400">
                            {selectedAssessment.constraints.map((c, cIdx) => (
                              <li key={cIdx} className="flex items-start gap-2.5">
                                <span className="text-emerald-500 shrink-0">■</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: Dynamic solution archives list */}
                {activeTab === 'submissions' && (
                  <div className="space-y-4">
                    <div className="border-b border-white/5 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">Submission archive</h3>
                      <p className="text-[10px] text-slate-500 mt-1">Review your historical compilation attempts and evaluations.</p>
                    </div>

                    {submissions.filter(s => s.assessmentId === selectedAssessment?.id).length > 0 ? (
                      submissions
                        .filter(s => s.assessmentId === selectedAssessment?.id)
                        .map((sub, sIdx) => {
                          const dateObj = new Date(sub.submittedAt || Date.now());
                          return (
                            <div key={sub.id || sIdx} className="bg-[#121217] border border-white/5 p-4.5 rounded-xl gap-4 flex flex-col sm:flex-row sm:items-center justify-between">
                              <div className="space-y-2 font-sans">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`inline-block py-0.5 px-2 rounded-md text-[9px] font-bold font-mono tracking-wider uppercase border ${
                                    sub.status === 'Solved' 
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                      : 'bg-rose-500/10 text-rose-450 border-rose-500/20'
                                  }`}>
                                    {sub.status || 'Solved'}
                                  </span>
                                  <span className="text-xs font-bold text-slate-200 font-mono bg-white/5 px-2 py-0.5 border border-white/5 rounded">
                                    Grader Score: {sub.score}%
                                  </span>
                                </div>
                                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                                  COMPILED: {dateObj.toLocaleString()}
                                </p>
                                {sub.feedback && (
                                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans italic bg-black/30 p-2 border border-white/5 rounded-lg">
                                    {sub.feedback}
                                  </p>
                                )}
                              </div>

                              <button
                                onClick={() => {
                                  setUserCode(sub.code);
                                }}
                                className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold font-mono text-slate-350 border border-white/10 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                              >
                                Load in Editor
                              </button>
                            </div>
                          );
                        })
                    ) : (
                      <div className="py-20 text-center">
                        <p className="text-slate-500 text-xs italic">No solution entries recorded for this challenge yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: Test cases and verification coordinates */}
                {activeTab === 'testcases' && (
                  <div className="space-y-4">
                    <div className="border-b border-white/5 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">Test Parameters</h3>
                      <p className="text-[10px] text-slate-500 mt-1">Structured assertion arrays containing validation coordinates for this question.</p>
                    </div>

                    <div className="space-y-3">
                      {selectedAssessment.testCases.map((tc, tcIdx) => (
                        <div key={tcIdx} className="bg-[#121217] border border-white/5 rounded-xl p-4 font-mono text-xs">
                          <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1.5 mb-2">
                            <span className="text-[9px] font-bold uppercase text-slate-500">Case Coordinates #{tcIdx + 1}</span>
                            {tc.hidden ? (
                              <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-1.5 rounded font-bold tracking-wider uppercase">HIDDEN</span>
                            ) : (
                              <span className="text-[8px] bg-slate-500/10 border border-slate-500/20 text-slate-400 px-1.5 rounded font-bold tracking-wider uppercase">PUBLIC</span>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                              <span className="text-slate-500 font-medium">Test Inputs:</span>
                              <span className="text-slate-350 select-all truncate">{tc.input}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                              <span className="text-slate-500 font-medium">Expected Output:</span>
                              <span className="text-emerald-400 font-semibold select-all truncate">{tc.expected}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <BookOpen className="h-10 w-10 text-slate-600 mb-2" />
                <p className="text-slate-400 text-xs italic">Select a challenge challenge from the catalog.</p>
              </div>
            )}

          </div>
        </section>

        {/* Dynamic Splitter Two (between Panel 2 Statement and Panel 3 Editor) */}
        <div
          onMouseDown={handleSplitterTwoDrag}
          className="hidden lg:flex w-1 self-stretch cursor-col-resize hover:bg-emerald-500/40 active:bg-emerald-500/70 bg-transparent transition-colors items-center justify-center relative group z-30"
        >
          <div className="absolute inset-y-0 w-[1px] bg-white/5 group-hover:bg-emerald-500/20" />
        </div>

        {/* PANEL 3: Code Editor Workspace */}
        <section 
          style={isDesktop ? { 
            width: `${leftSidebarCollapsed ? (editorWidth / (statementWidth + editorWidth)) * 100 : editorWidth}%` 
          } : undefined}
          className="bg-[#0c0c0e] flex flex-col min-w-0"
        >
          {/* Editor Action toolbar */}
          <div className="bg-[#0b0c10] border-b border-white/5 px-4 h-12 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-400" />
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 font-mono">LANGUAGE:</span>
              <select
                value={activeLanguage}
                onChange={(e) => handleLanguageChange(e.target.value as any)}
                className="bg-[#121216] border border-white/5 rounded-lg px-2.5 py-1 text-[11px] text-slate-100 uppercase tracking-wide font-mono font-bold focus:outline-none focus:border-emerald-500/30"
              >
                <option value="javascript">JavaScript (ES6)</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java (JDK 17)</option>
                <option value="cpp">C++ (g++ 17)</option>
                <option value="c">C (GCC gnu99)</option>
            </select>
          </div>

          {/* Reset/Format Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFormatCode}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold font-mono text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors cursor-pointer"
              title="Auto-format code document"
            >
              <Braces className="h-3 w-3" /> Format
            </button>
            <div className="h-3 w-px bg-white/5" />
            <button
              onClick={handleResetCode}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold font-mono text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors cursor-pointer"
              title="Reset to challenge boilerplate"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
        </div>

        {/* Monaco Sandbox Stage */}
        <div className="flex-1 relative bg-black min-h-[300px]">
          {loading ? (
            <div className="absolute inset-0 bg-[#070709] flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            </div>
          ) : (
            <Editor
              height="100%"
              language={activeLanguage === 'python' ? 'python' : (activeLanguage === 'cpp' || activeLanguage === 'c') ? 'cpp' : activeLanguage}
              theme="vs-dark"
              value={userCode}
              onChange={(val) => setUserCode(val || '')}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                tabSize: 4,
                quickSuggestions: { other: true, comments: true, strings: true },
                parameterHints: { enabled: true },
                suggestOnTriggerCharacters: true,
                formatOnPaste: true,
                formatOnType: true,
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                matchBrackets: 'always',
                folding: true,
                wordWrap: 'on',
              }}
            />
          )}
        </div>

        {/* Grader Console panel & custom parameters */}
        <div className="bg-[#09090b] border-t border-white/5 flex flex-col shrink-0">
          
          {/* Optional assertion panel input fields */}
          <div className="p-4 border-b border-white/5 space-y-3 bg-[#0a0a0d]">
            <label className="flex items-center gap-2.5 text-[11px] font-mono tracking-wide text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enableCustomInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onClick={() => setEnableCustomInput(!enableCustomInput)}
                className="rounded accent-emerald-500 border-white/5 bg-[#121216] text-emerald-500 focus:ring-0"
              />
              <span>Inject custom test values (Debugging sandbox mode)</span>
            </label>

            {enableCustomInput && (
              <textarea
                placeholder="Provide custom test vector, e.g. input_val = [1, 5, 10]"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full bg-[#121216]/90 border border-white/5 font-mono text-[11px] text-slate-300 p-3 rounded-lg focus:outline-none focus:border-emerald-500/30 h-16 leading-relaxed resize-none"
                spellCheck={false}
              />
            )}
          </div>

          {/* Results compiler panel overlay */}
          {results && (
            <div className="p-4 bg-[#0a0a0d] border-b border-white/5 font-mono text-xs max-h-[220px] overflow-y-auto space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Assertion Logs</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                  results.compiledSuccessfullyObj 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {results.compiledSuccessfullyObj ? 'COMPILATION OK' : 'COMPILATION FAIL'}
                </span>
              </div>

              {results.compiledSuccessfullyObj && (
                <div className="grid grid-cols-2 gap-2 text-[9px] tracking-widest uppercase py-1 px-2.5 bg-black/40 border border-white/5 rounded-lg text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold"><Cpu className="h-3.5 w-3.5" /> CPU: {results.runtime}</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold"><Activity className="h-3.5 w-3.5" /> RAM: {results.memory}</span>
                </div>
              )}

              {results.compilerLog && (
                <pre className="p-3 rounded-lg bg-black/60 text-slate-400 overflow-auto max-h-24 leading-relaxed font-mono whitespace-pre-wrap text-[10px] border border-white/5 select-text">
                  {results.compilerLog}
                </pre>
              )}

              {results.testCases && results.testCases.length > 0 && (
                <div className="space-y-2">
                  {results.testCases.map((tc, tcIdx) => (
                    <div 
                      key={tcIdx} 
                      className={`p-3 rounded-xl border flex flex-col gap-2 ${
                        tc.passed 
                          ? 'bg-emerald-500/[0.02] border-emerald-500/10 text-emerald-400' 
                          : 'bg-rose-500/[0.02] border-rose-500/10 text-rose-440'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[11px]">
                        <span>Test Spec #{tcIdx + 1}</span>
                        {tc.passed ? (
                          <span className="text-[9px] uppercase tracking-wider font-black flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> PASSED
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase tracking-wider font-black flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5 text-rose-450" /> FAILED
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-[80px_1fr] gap-y-1 text-[10px] font-mono pl-1 text-slate-400 border-t border-white/5 pt-2 select-text">
                        <span className="text-slate-500 font-semibold tracking-wider uppercase text-[8px] self-center">Inputs:</span>
                        <span className="text-slate-300 font-bold truncate">{tc.input}</span>
                        <span className="text-slate-500 font-semibold tracking-wider uppercase text-[8px] self-center">Expected:</span>
                        <span className="text-emerald-400 font-bold truncate">{tc.expected}</span>
                        <span className="text-slate-500 font-semibold tracking-wider uppercase text-[8px] self-center">Returned:</span>
                        <span className={`font-bold truncate ${tc.passed ? 'text-emerald-450' : 'text-rose-400 font-extrabold'}`}>{tc.actual}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action triggering platform buttons */}
          <div className="p-4 bg-[#0d0d10] flex items-center justify-between shrink-0 relative select-none">
            <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono">
              <Keyboard className="h-3 w-3 text-emerald-500/60" />
              <span className="hidden sm:inline">Ctrl+Enter to Compile</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleRunCode(false)}
                disabled={executing || loading}
                className="flex items-center gap-1.5 font-mono uppercase tracking-wider text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-[10px] font-bold rounded-lg cursor-pointer transition-all disabled:opacity-50"
              >
                {executing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                ) : (
                  <Play className="h-3.5 w-3.5 text-emerald-400" />
                )}
                <span>RUN CODE</span>
              </button>

              <button
                onClick={() => handleRunCode(true)}
                disabled={executing || loading}
                className="flex items-center gap-1.5 font-mono uppercase tracking-wider text-black bg-emerald-400 hover:bg-emerald-500 px-5 py-2 text-[10px] font-black rounded-lg cursor-pointer transition-all disabled:opacity-50 shadow-md shadow-emerald-500/10"
              >
                {executing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-black" />
                ) : (
                  <Send className="h-3.5 w-3.5 text-black" />
                )}
                <span>SUBMIT SOLUTION</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Dragging intercept blocker overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize select-none pointer-events-auto" />
      )}

    </div>

        {/* Floating Side Drawer Slide Panel: AI Placement Coach */}
        <AnimatePresence>
          {aiDrawerOpen && (
            <>
              {/* Backing shadow Overlay backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                exit={{ opacity: 0 }}
                onClick={() => setAiDrawerOpen(false)}
                className="fixed inset-0 bg-black z-40 cursor-pointer select-none"
              />

              {/* Flyout chat panel container */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                className="fixed right-0 top-0 bottom-0 w-full sm:w-[380px] md:w-[440px] bg-[#0c0c0e] border-l border-white/5 z-50 flex flex-col shadow-2xl overflow-hidden"
              >
                {/* Drawer Header */}
                <div className="p-4 bg-[#0d0d10] border-b border-white/5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                      <Brain className="h-4 w-4 text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase font-mono tracking-widest text-slate-100">AI Coding Envoy</h3>
                      <p className="text-[10px] text-slate-500 font-medium font-sans">Strategic interview diagnostics & mocks.</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setAiDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Grid of 6 interactive smart prompting capability options */}
                <div className="p-3 bg-[#0a0a0d] border-b border-white/10 grid grid-cols-2 gap-1.5 shrink-0 select-none">
                  {(['explain', 'hint', 'debug', 'optimize', 'complexity', 'interview'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => handleAiRequest(type)}
                      disabled={aiLoading}
                      className={`py-2 px-1.5 rounded-lg border text-center transition-all cursor-pointer font-bold font-mono uppercase tracking-wider text-[9px] disabled:opacity-50 select-none ${
                        activeAiTab === type
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-extrabold shadow-sm'
                          : 'border-white/5 bg-[#121216] text-slate-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {type === 'explain' && 'Explain Problem'}
                      {type === 'hint' && 'Request Hint'}
                      {type === 'debug' && 'Diagnose Bugs'}
                      {type === 'optimize' && 'Optimization'}
                      {type === 'complexity' && 'Big-O Analysis'}
                      {type === 'interview' && 'Mock Interview'}
                    </button>
                  ))}
                </div>

                {/* Message logs chat box */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#08080a] select-text">
                  {aiMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col gap-1.5 ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      {/* Avatar/Sender meta header */}
                      <div className="flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-wider text-slate-500">
                        {msg.role === 'user' ? (
                          <>
                            <span>Candidate Workstation</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                          </>
                        ) : (
                          <>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>PLACEMENT COACH AI</span>
                          </>
                        )}
                        <span className="text-[7px] text-slate-600">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Chat text box */}
                      <div 
                        className={`p-3.5 rounded-xl border max-w-[90%] font-sans whitespace-pre-wrap select-text selection:bg-emerald-500/30 text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-zinc-900 border-white/5 text-slate-200'
                            : 'bg-[#101014] border-emerald-500/10 text-slate-300'
                        }`}
                      >
                        {msg.role === 'assistant' 
                          ? renderNativeMarkdown(msg.text) 
                          : <p>{msg.text}</p>
                        }
                      </div>
                    </div>
                  ))}

                  {/* Typing loader indicator */}
                  {aiLoading && (
                    <div className="flex flex-col gap-1.5 items-start">
                      <div className="flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-wider text-slate-500">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>COACH IS ANALYZING SOURCE CODE...</span>
                      </div>
                      <div className="bg-[#101014] border border-emerald-500/10 p-4 rounded-xl flex items-center gap-2 max-w-[200px]">
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-450" />
                        <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase animate-pulse">Computing Big-O...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Form instructions reminder bar */}
                <div className="p-3 bg-[#0a0a0d] border-t border-white/5 shrink-0 text-center text-[9px] text-slate-500 font-mono uppercase tracking-wider select-none">
                  AI uses current editor selection and code templates automatically.
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

    </div>
  );
}
