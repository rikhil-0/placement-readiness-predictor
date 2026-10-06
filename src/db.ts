/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import {
  User,
  StudentProfile,
  CodingAssessment,
  AssessmentSubmission,
  ResumeAnalysis,
  InterviewSession,
  InterviewMessage,
  SkillRoadmap,
  PlacementReadinessResult
} from './types';
import { PROBLEMS_DB } from './data/problems';

const DB_FILE = path.join(process.cwd(), 'database_store.json');

interface DatabaseSchema {
  users: User[];
  userCredentials: { [userId: string]: string }; // password hashes or plain format for demo purposes
  profiles: StudentProfile[];
  assessments: CodingAssessment[];
  submissions: AssessmentSubmission[];
  resumes: ResumeAnalysis[];
  interviews: InterviewSession[];
  roadmaps: SkillRoadmap[];
  readinessResults: PlacementReadinessResult[];
}

const DEFAULT_ASSESSMENTS: CodingAssessment[] = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n### Example\n```json\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n```',
    initialCode: 'function twoSum(nums, target) {\n    // Write your code here\n    \n}',
    language: 'javascript',
    testCases: [
      { input: '[[2, 7, 11, 15], 9]', expected: '[0,1]' },
      { input: '[[3, 2, 4], 6]', expected: '[1,2]' },
      { input: '[[3, 3], 6]', expected: '[0,1]' }
    ]
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n\n### Example\n```json\nInput: s = "()[]{}"\nOutput: true\n```',
    initialCode: 'function isValid(s) {\n    // Write your code here\n    \n}',
    language: 'javascript',
    testCases: [
      { input: '"()"', expected: 'true' },
      { input: '"()[]{}"', expected: 'true' },
      { input: '"(]"', expected: 'false' },
      { input: '"([)]"', expected: 'false' }
    ]
  },
  {
    id: '3',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    description: 'Given a string `s`, return the longest palindromic substring in `s`.\n\n### Example\n```json\nInput: s = "babad"\nOutput: "bab" or "aba"\n```',
    initialCode: 'function longestPalindrome(s) {\n    // Write your code here\n    \n}',
    language: 'javascript',
    testCases: [
      { input: '"babad"', expected: '"bab"' }, // or aba
      { input: '"cbbd"', expected: '"bb"' },
      { input: '"a"', expected: '"a"' }
    ]
  }
];

function createDefaultData(): DatabaseSchema {
  return {
    users: [
      { id: 'usr_admin', email: 'admin@predictor.com', name: 'Dr. Sarah Jenkins', role: 'admin', createdAt: new Date().toISOString() },
      { id: 'usr_student', email: 'student@predictor.com', name: 'Rikhil Roy', role: 'student', createdAt: new Date().toISOString() },
      { id: 'usr_demojane', email: 'jane.doe@predictor.com', name: 'Jane Doe', role: 'student', createdAt: new Date().toISOString() },
    ],
    userCredentials: {
      'usr_admin': 'admin123',
      'usr_student': 'password123',
      'usr_demojane': 'password123'
    },
    profiles: [
      {
        userId: 'usr_student',
        fullName: 'Rikhil Roy',
        domain: 'Web Development & APIs',
        graduationYear: '2026',
        currentCgpa: 8.7,
        preferredRole: 'Full-stack Developer',
        skills: ['React', 'JavaScript', 'Node.js', 'Express', 'HTML', 'CSS', 'Tailwind'],
        githubUrl: 'https://github.com/rikhil-roy',
        leetcodeUrl: 'https://leetcode.com/rikhil-roy',
        experience: 'Completed a 3-month summer internship working with Node.js backend development.',
        projects: 'E-Commerce full-stack app with basic payment integration and reactive catalog.',
        updatedAt: new Date().toISOString()
      },
      {
        userId: 'usr_demojane',
        fullName: 'Jane Doe',
        domain: 'Data Informatics & Systems',
        graduationYear: '2026',
        currentCgpa: 9.1,
        preferredRole: 'Data Scientist',
        skills: ['Python', 'SQL', 'Data Analytics', 'Pandas', 'TensorFlow', 'PostgreSQL'],
        githubUrl: 'https://github.com/janedoe',
        leetcodeUrl: 'https://leetcode.com/janedoe',
        experience: 'Undergrad data structures researcher and tutor. Developed models for campus admissions analytics.',
        projects: 'Academic performance predictive modeling using random forests and gradient boosted trees.',
        updatedAt: new Date().toISOString()
      }
    ],
    assessments: PROBLEMS_DB,
    submissions: [
      {
        id: 'sub_1',
        userId: 'usr_student',
        assessmentId: '1',
        code: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}',
        status: 'Solved',
        score: 100,
        feedback: 'Correct Solution! Optimal time complexity O(N) and space complexity O(N). Passed all test cases smoothly.',
        submittedAt: new Date().toISOString()
      }
    ],
    resumes: [],
    interviews: [
      {
        id: 'int_1',
        userId: 'usr_student',
        roleType: 'Full-stack Developer',
        startedAt: new Date().toISOString(),
        completed: true,
        overallScore: 82,
        feedbackSummary: 'Rikhil demonstrated a thorough grasp of state synchronization and REST interface design. Showed clean diagnostic capability during code logic explanation, but needs refinement in architectural scale discussions.',
        detailedFeedback: {
          technicalAccuracy: 85,
          communication: 80,
          problemSolving: 80,
          keyStrengths: [
            'Extremely solid logic parsing and direct explanations.',
            'Understands API query mechanics like HTTP status codes and payloads perfectly.'
          ],
          improvements: [
            'Include system reliability protocols (rate limiting, caching strategies) explicitly.',
            'Focus on structured system design methodologies rather than jumping straight into implementation details.'
          ]
        },
        messages: [
          { id: '1', role: 'interviewer', content: 'Welcome Rikhil. Tell me, how do you manage state and avoid excess re-rendering in a large-scale React app?', timestamp: new Date().toISOString() },
          { id: '2', role: 'candidate', content: 'I split the component hierarchy and use local state by default. For global state, I use React Context, with memoized hooks or specialized state stores like Zustand, taking care to place keys correctly in dependency arrays.', timestamp: new Date().toISOString() },
          { id: '3', role: 'interviewer', content: 'That makes perfect sense. How would you handle errors on a Node API when a third-party payment provider goes offline?', timestamp: new Date().toISOString() },
          { id: '4', role: 'candidate', content: 'I would set robust try-catch blocks, implement a retry mechanism with exponential backoff, and log the precise error context securely. I would return an appropriate user-facing warning with an HTTP 503 code so the client UI can suggest retrying shortly.', timestamp: new Date().toISOString() }
        ]
      }
    ],
    roadmaps: [
      {
        id: 'rd_1',
        userId: 'usr_student',
        createdAt: new Date().toISOString(),
        skillGaps: [
          { skill: 'TypeScript', currentLevel: 'Beginner', requiredLevel: 'Advanced', importance: 'High', gapStatus: 'Gap' },
          { skill: 'Testing (Jest/Cypress)', currentLevel: 'None', requiredLevel: 'Intermediate', importance: 'Medium', gapStatus: 'Gap' },
          { skill: 'System Design (Scale)', currentLevel: 'Beginner', requiredLevel: 'Intermediate', importance: 'High', gapStatus: 'Gap' },
          { skill: 'Docker & DevOps', currentLevel: 'None', requiredLevel: 'Beginner', importance: 'Low', gapStatus: 'Gap' }
        ],
        roadmapSteps: [
          {
            week: 'Weeks 1-2',
            milestone: 'TypeScript and Typing Foundations',
            description: 'Transition vanilla JavaScript items to safe TypeScript. Focus on type annotations, interfaces, enums, unions, generics, and setting up tsconfig.',
            estimatedHours: 12,
            resources: [
              { title: 'TypeScript Deep Dive tutorial guide', type: 'Article', url: 'https://www.typescriptlang.org/docs/' },
              { title: 'Full stack TypeScript course walkthrough', type: 'Video', url: '#' }
            ]
          },
          {
            week: 'Weeks 3-4',
            milestone: 'Functional & Integration Testing Frameworks',
            description: 'Learn unit tests in Node using Jest. Move to React testing library to validate dynamic render outputs and component states.',
            estimatedHours: 10,
            resources: [
              { title: 'Jest core mock documentation guide', type: 'Article', url: 'https://jestjs.io/' }
            ]
          },
          {
            week: 'Weeks 5-6',
            milestone: 'Reliable Scalable Backend System Design',
            description: 'Gain visual awareness on Horizontal vs Vertical scaling, caching layer insertions (e.g. Redis limits), database index optimizations, load balancing configurations.',
            estimatedHours: 14,
            resources: [
              { title: 'System Design Interview Fundamentals', type: 'Video', url: '#' }
            ]
          }
        ]
      }
    ],
    readinessResults: [
      {
        userId: 'usr_student',
        overallScore: 81,
        codingScore: 90,
        resumeScore: 75,
        profileScore: 85,
        interviewScore: 82,
        decisionStatus: 'Ready with Minor Gaps',
        insightSummary: 'Exceptionally ready in general coding execution and core profile setups. Has minor vulnerabilities regarding system design depths, which were highlighted during resume parser and AI interviewer modules.',
        lastUpdated: new Date().toISOString()
      },
      {
        userId: 'usr_demojane',
        overallScore: 78,
        codingScore: 70,
        resumeScore: 88,
        profileScore: 92,
        interviewScore: 75,
        decisionStatus: 'Ready with Minor Gaps',
        insightSummary: 'Outstanding academic and project profile metrics. Can reinforce raw data structures speed to boost the coding assessments category rating.',
        lastUpdated: new Date().toISOString()
      }
    ]
  };
}

class DatabaseManager {
  private cache: DatabaseSchema | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        const initialData = createDefaultData();
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
        this.cache = initialData;
      } else {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.cache = JSON.parse(fileContent);
      }
      if (this.cache && this.cache.resumes) {
        // Clear out old pre-baked static resume scans that lack resumeText
        // to strictly purge existing Rikhil Roy legacy data
        this.cache.resumes = this.cache.resumes.filter(r => r.id !== 'res_1' && r.resumeText);
      }
    } catch {
      this.cache = createDefaultData();
    }
  }

  private save() {
    if (this.cache) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(this.cache, null, 2), 'utf-8');
      } catch (err) {
        console.error('Failed to write database file:', err);
      }
    }
  }

  public getUsers(): User[] {
    return this.cache?.users || [];
  }

  public getUserById(id: string): User | undefined {
    return this.cache?.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.cache?.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public checkPassword(userId: string, pass: string): boolean {
    return this.cache?.userCredentials[userId] === pass;
  }

  public createUser(email: string, name: string, pass: string, role: 'student' | 'admin'): User {
    if (!this.cache) this.init();
    const id = 'usr_' + Math.random().toString(36).substring(2, 11);
    const newUser: User = { id, email, name, role, createdAt: new Date().toISOString() };
    
    this.cache!.users.push(newUser);
    this.cache!.userCredentials[id] = pass;

    // Create a default initial profile for student roles
    if (role === 'student') {
      const newProfile: StudentProfile = {
        userId: id,
        fullName: name,
        domain: 'Data structures & Core algorithms',
        graduationYear: new Date().getFullYear().toString(),
        currentCgpa: 8.0,
        preferredRole: 'Frontend Developer',
        skills: ['JavaScript', 'HTML', 'CSS'],
        updatedAt: new Date().toISOString()
      };
      this.cache!.profiles.push(newProfile);

      // Create a default placement readiness score
      const placeholderScore: PlacementReadinessResult = {
        userId: id,
        overallScore: 40,
        codingScore: 30,
        resumeScore: 50,
        profileScore: 40,
        interviewScore: 40,
        decisionStatus: 'Developing',
        insightSummary: 'Profile set up completed. Complete a Coding Assessment and Resume evaluation to generate personalized readiness assessments.',
        lastUpdated: new Date().toISOString()
      };
      this.cache!.readinessResults.push(placeholderScore);
    }

    this.save();
    return newUser;
  }

  public getProfileByUserId(userId: string): StudentProfile | undefined {
    return this.cache?.profiles.find(p => p.userId === userId);
  }

  public updateProfile(userId: string, data: Partial<StudentProfile>): StudentProfile {
    if (!this.cache) this.init();
    let profile = this.cache!.profiles.find(p => p.userId === userId);
    if (!profile) {
      const user = this.getUserById(userId);
      profile = {
        userId,
        fullName: user?.name || 'New Student',
        domain: 'Software Engineering',
        graduationYear: '2026',
        currentCgpa: 8.0,
        preferredRole: 'Software Developer',
        skills: [],
        updatedAt: new Date().toISOString()
      };
      this.cache!.profiles.push(profile);
    }

    Object.assign(profile, data, { updatedAt: new Date().toISOString() });
    
    // Recalculate Profile metrics score based on inputs completeness
    this.recalculateReadinessScores(userId);

    this.save();
    return profile;
  }

  public getAssessments(): CodingAssessment[] {
    if (!this.cache?.assessments || this.cache.assessments.length < 50) {
      if (!this.cache) this.init();
      if (this.cache) {
        this.cache.assessments = PROBLEMS_DB;
        this.save();
      }
    }
    return this.cache?.assessments || PROBLEMS_DB;
  }

  public getAssessmentById(id: string): CodingAssessment | undefined {
    return this.getAssessments().find(a => a.id === id);
  }

  public saveSubmission(userId: string, assessmentId: string, code: string, status: 'Solved' | 'Failed', score: number, feedback: string): AssessmentSubmission {
    if (!this.cache) this.init();
    const id = 'sub_' + Math.random().toString(36).substring(2, 11);
    const submission: AssessmentSubmission = {
      id,
      userId,
      assessmentId,
      code,
      status,
      score,
      feedback,
      submittedAt: new Date().toISOString()
    };

    // Remove duplicates or old runs for this specific question to keep dashboard metrics clean
    this.cache!.submissions = this.cache!.submissions.filter(s => !(s.userId === userId && s.assessmentId === assessmentId));
    this.cache!.submissions.push(submission);

    // Recompute coding capability segment value
    this.recalculateReadinessScores(userId);

    this.save();
    return submission;
  }

  public getSubmissionsByUser(userId: string): AssessmentSubmission[] {
    return this.cache?.submissions.filter(s => s.userId === userId) || [];
  }

  public getResumesByUser(userId: string): ResumeAnalysis[] {
    return this.cache?.resumes.filter(r => r.userId === userId) || [];
  }

  public saveResumeAnalysis(userId: string, filename: string, score: number, summary: string, strengths: string[], weaknesses: string[], suggestKeywords: string[], resumeText?: string): ResumeAnalysis {
    if (!this.cache) this.init();
    const id = 'res_' + Math.random().toString(36).substring(2, 11);
    const analysis: ResumeAnalysis = {
      id,
      userId,
      score,
      summary,
      strengths,
      weaknesses,
      suggestedKeywords: suggestKeywords,
      originalFileName: filename,
      analyzedAt: new Date().toISOString(),
      resumeText: resumeText || ''
    };

    // filter prior submissions so student scores are aggregate single snapshots 
    this.cache!.resumes = this.cache!.resumes.filter(r => r.userId !== userId);
    this.cache!.resumes.push(analysis);

    this.recalculateReadinessScores(userId);

    this.save();
    return analysis;
  }

  public getInterviewsByUser(userId: string): InterviewSession[] {
    return this.cache?.interviews.filter(i => i.userId === userId) || [];
  }

  public getInterviewSessionById(id: string): InterviewSession | undefined {
    return this.cache?.interviews.find(i => i.id === id);
  }

  public createInterviewSession(userId: string, roleType: string): InterviewSession {
    if (!this.cache) this.init();
    const id = 'int_' + Math.random().toString(36).substring(2, 11);
    const session: InterviewSession = {
      id,
      userId,
      roleType,
      startedAt: new Date().toISOString(),
      messages: [
        {
          id: 'int_msg_init',
          role: 'interviewer',
          content: `Hi there! I am your AI Placement Interviewer. I see you are preparing for the '${roleType}' role. Let's start with a foundational question: Could you describe a challenging project you have worked on in this domain and how you approached resolving its core technical problem?`,
          timestamp: new Date().toISOString()
        }
      ],
      completed: false
    };

    this.cache!.interviews.push(session);
    this.save();
    return session;
  }

  public saveInterviewMessage(sessionId: string, role: 'interviewer' | 'candidate', content: string): InterviewMessage {
    if (!this.cache) this.init();
    const session = this.cache!.interviews.find(i => i.id === sessionId);
    if (!session) throw new Error('Session not found');

    const message: InterviewMessage = {
      id: 'int_msg_' + Math.random().toString(36).substring(2, 11),
      role,
      content,
      timestamp: new Date().toISOString()
    };

    session.messages.push(message);
    this.save();
    return message;
  }

  public completeInterviewSession(sessionId: string, overallScore: number, feedbackSummary: string, detailedFeedback: InterviewSession['detailedFeedback']): InterviewSession {
    if (!this.cache) this.init();
    const session = this.cache!.interviews.find(i => i.id === sessionId);
    if (!session) throw new Error('Session not found');

    session.completed = true;
    session.overallScore = overallScore;
    session.feedbackSummary = feedbackSummary;
    session.detailedFeedback = detailedFeedback;

    this.recalculateReadinessScores(session.userId);

    this.save();
    return session;
  }

  public getRoadmapByUser(userId: string): SkillRoadmap | undefined {
    return this.cache?.roadmaps.find(r => r.userId === userId);
  }

  public saveRoadmap(userId: string, gaps: SkillRoadmap['skillGaps'], steps: SkillRoadmap['roadmapSteps']): SkillRoadmap {
    if (!this.cache) this.init();
    let roadmap = this.cache!.roadmaps.find(r => r.userId === userId);
    if (!roadmap) {
      roadmap = {
        id: 'rd_' + Math.random().toString(36).substring(2, 11),
        userId,
        createdAt: new Date().toISOString(),
        skillGaps: gaps,
        roadmapSteps: steps
      };
      this.cache!.roadmaps.push(roadmap);
    } else {
      roadmap.skillGaps = gaps;
      roadmap.roadmapSteps = steps;
      roadmap.createdAt = new Date().toISOString();
    }

    this.save();
    return roadmap;
  }

  public getReadinessResult(userId: string): PlacementReadinessResult | undefined {
    return this.cache?.readinessResults.find(r => r.userId === userId);
  }

  public getAnalytics() {
    if (!this.cache) this.init();
    const students = this.cache!.users.filter(u => u.role === 'student');
    const studentCount = students.length;

    // Averages
    const completedResumes = this.cache!.resumes.length;
    const completedInterviews = this.cache!.interviews.filter(i => i.completed).length;
    const codingSubmissionsCount = this.cache!.submissions.filter(s => s.status === 'Solved').length;

    const scoresList = this.cache!.readinessResults.map(r => r.overallScore);
    const avgScore = scoresList.length ? Math.round(scoresList.reduce((a, b) => a + b, 0) / scoresList.length) : 0;

    // Difficulty and skill gaps aggregations
    const domainCounts: { [key: string]: number } = {};
    this.cache!.profiles.forEach(p => {
      domainCounts[p.domain] = (domainCounts[p.domain] || 0) + 1;
    });

    const categoryAverages = {
      coding: 0,
      resume: 0,
      profile: 0,
      interview: 0
    };

    if (this.cache!.readinessResults.length) {
      const results = this.cache!.readinessResults;
      categoryAverages.coding = Math.round(results.reduce((a, b) => a + b.codingScore, 0) / results.length);
      categoryAverages.resume = Math.round(results.reduce((a, b) => a + b.resumeScore, 0) / results.length);
      categoryAverages.profile = Math.round(results.reduce((a, b) => a + b.profileScore, 0) / results.length);
      categoryAverages.interview = Math.round(results.reduce((a, b) => a + b.interviewScore, 0) / results.length);
    }

    return {
      studentCount,
      completedResumes,
      completedInterviews,
      codingSubmissionsCount,
      averageScore: avgScore,
      domainDistribution: Object.entries(domainCounts).map(([name, value]) => ({ name, value })),
      categoryAverages,
      scoringTiers: [
        { name: 'Needs Attention (0-50)', count: scoresList.filter(s => s <= 50).length },
        { name: 'Developing (51-75)', count: scoresList.filter(s => s > 50 && s <= 75).length },
        { name: 'Ready with Gaps (76-90)', count: scoresList.filter(s => s > 75 && s <= 90).length },
        { name: 'Excellent Match (91-100)', count: scoresList.filter(s => s > 90).length }
      ]
    };
  }

  private recalculateReadinessScores(userId: string) {
    if (!this.cache) this.init();
    
    // Look up components belonging to this student
    const profile = this.cache!.profiles.find(p => p.userId === userId);
    const submissions = this.cache!.submissions.filter(s => s.userId === userId && s.status === 'Solved');
    const resume = this.cache!.resumes.find(r => r.userId === userId);
    const interviews = this.cache!.interviews.filter(i => i.userId === userId && i.completed);

    // Profile completeness: CGPA provided, preferredRole filled, skills list, repo links, text description
    let profileScore = 40; // baseline
    if (profile) {
      if (profile.currentCgpa > 0) profileScore += 15;
      if (profile.skills.length >= 3) profileScore += 15;
      if (profile.githubUrl || profile.leetcodeUrl) profileScore += 15;
      if (profile.experience || profile.projects) profileScore += 15;
    }
    profileScore = Math.min(100, profileScore);

    // Coding score: based on solved questions count and averages
    let codingScore = 30; // base standard rating
    if (submissions.length > 0) {
      const avgSolvedScore = submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length;
      codingScore = Math.round(30 + (avgSolvedScore * 0.7)); // scale O(n) solutions up
    }
    codingScore = Math.min(100, codingScore);

    // Resume score: direct from parsed resume or baseline default
    const resumeScore = resume ? resume.score : 0;

    // Interview score: average of completed AI evaluations
    let interviewScore = 0;
    if (interviews.length > 0) {
      interviewScore = Math.round(interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / interviews.length);
    }

    // Weight allocations: Coding (35%), Interview (25%), Resume (20%), Profile Completeness (20%)
    const activeComponentsCount = [
      codingScore > 30,
      resumeScore > 0,
      interviewScore > 0
    ].filter(Boolean).length;

    let overallScore = 40; // Default when fresh
    if (activeComponentsCount === 0) {
      overallScore = Math.round(profileScore * 0.4); 
    } else {
      const parts = [
        codingScore * 0.35,
        (resumeScore || 50) * 0.20,
        (interviewScore || 50) * 0.25,
        profileScore * 0.20
      ];
      overallScore = Math.round(parts.reduce((a, b) => a + b, 0));
    }

    // Decision categories
    let decisionStatus: PlacementReadinessResult['decisionStatus'] = 'Developing';
    if (overallScore >= 90) {
      decisionStatus = 'Excellent Match';
    } else if (overallScore >= 75) {
      decisionStatus = 'Ready with Minor Gaps';
    } else if (overallScore >= 50) {
      decisionStatus = 'Developing';
    } else {
      decisionStatus = 'Needs Attention';
    }

    // Insights matching score
    let insightSummary = '';
    if (decisionStatus === 'Excellent Match') {
      insightSummary = 'Extremely high readiness and exceptional alignment across analytical domains, technical interviews, and resume indexing. Ready to sit for top-tier tier-1 campus placements!';
    } else if (decisionStatus === 'Ready with Minor Gaps') {
      insightSummary = 'Highly ready in general attributes. Needs minor refinements in selected domain specialties or coding logic optimizations, which can be accomplished via the tailored roadmap module.';
    } else if (decisionStatus === 'Developing') {
      insightSummary = 'Demonstrating active technical development. Recommend solving more system-level coding challenges and refreshing resume keywords to align with modern corporate requirements.';
    } else {
      insightSummary = 'Profile requires targeted academic and code build support immediately. Complete core database skills checklists and attend practice assessment runs.';
    }

    let item = this.cache!.readinessResults.find(r => r.userId === userId);
    if (!item) {
      item = {
        userId,
        overallScore,
        codingScore,
        resumeScore,
        profileScore,
        interviewScore,
        decisionStatus,
        insightSummary,
        lastUpdated: new Date().toISOString()
      };
      this.cache!.readinessResults.push(item);
    } else {
      item.overallScore = overallScore;
      item.codingScore = codingScore;
      item.resumeScore = resumeScore || item.resumeScore;
      item.profileScore = profileScore;
      item.interviewScore = interviewScore || item.interviewScore;
      item.decisionStatus = decisionStatus;
      item.insightSummary = insightSummary;
      item.lastUpdated = new Date().toISOString();
    }
  }
}

export const dbStore = new DatabaseManager();
