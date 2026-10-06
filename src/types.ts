/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  createdAt: string;
}

export interface StudentProfile {
  userId: string;
  fullName: string;
  domain: string; // e.g., 'Web Development', 'Machine Learning', 'Data structures', 'Mobile Apps'
  graduationYear: string;
  currentCgpa: number;
  preferredRole: string; // e.g., 'Frontend Engineer', 'Full-stack Developer', 'Data Scientist'
  skills: string[]; // e.g., ['JavaScript', 'TypeScript', 'Node.js', 'React']
  githubUrl?: string;
  leetcodeUrl?: string;
  experience?: string; // Text summary
  projects?: string;   // Text summary
  updatedAt: string;
}

export interface CodingAssessment {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  initialCode?: string;
  language?: string;
  category?: 'Arrays' | 'Strings' | 'Linked Lists' | 'Stacks' | 'Queues' | 'Trees' | 'Graphs' | 'Dynamic Programming' | 'Greedy' | 'Recursion' | 'Sorting' | 'Searching';
  constraints?: string[];
  examples?: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterTemplates?: {
    javascript: string;
    typescript: string;
    python: string;
    java: string;
    cpp: string;
    c: string;
  };
  testCases: {
    input: string;
    expected: string;
    hidden?: boolean;
  }[];
}

export interface AssessmentSubmission {
  id: string;
  userId: string;
  assessmentId: string;
  code: string;
  status: 'Solved' | 'Failed' | 'Draft';
  score: number; // 0 to 100
  feedback: string;
  submittedAt: string;
}

export interface ResumeAnalysis {
  id: string;
  userId: string;
  score: number; // 0 to 100
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestedKeywords: string[];
  originalFileName: string;
  analyzedAt: string;
  resumeText?: string;
}

export interface InterviewMessage {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  roleType: string; // e.g., 'Frontend Engineer'
  startedAt: string;
  messages: InterviewMessage[];
  completed: boolean;
  overallScore?: number; // 0 to 100
  feedbackSummary?: string;
  detailedFeedback?: {
    technicalAccuracy: number;
    communication: number;
    problemSolving: number;
    keyStrengths: string[];
    improvements: string[];
  };
}

export interface SkillGapItem {
  skill: string;
  currentLevel: 'None' | 'Beginner' | 'Intermediate' | 'Advanced';
  requiredLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  importance: 'High' | 'Medium' | 'Low';
  gapStatus: 'Acquired' | 'Gap' | 'In Progress';
}

export interface RoadmapStep {
  week: string;
  milestone: string;
  description: string;
  estimatedHours: number;
  resources: { title: string; type: 'Video' | 'Article' | 'Practice'; url: string }[];
}

export interface SkillRoadmap {
  id: string;
  userId: string;
  createdAt: string;
  skillGaps: SkillGapItem[];
  roadmapSteps: RoadmapStep[];
}

export interface PlacementReadinessResult {
  userId: string;
  overallScore: number; // 0 to 100
  codingScore: number; // 0 to 100
  resumeScore: number; // 0 to 100
  profileScore: number; // 0 to 100
  interviewScore: number; // 0 to 100
  decisionStatus: 'Excellent Match' | 'Ready with Minor Gaps' | 'Developing' | 'Needs Attention';
  insightSummary: string;
  lastUpdated: string;
}
