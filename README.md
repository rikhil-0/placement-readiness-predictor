# 🎓 Predictor.AI — AI-Powered Placement Readiness Predictor

<div align="center">
  <img width="1200" height="475" alt="Predictor.AI Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

---

## 🌟 Project Overview

**Predictor.AI** is a state-of-the-art, full-stack placement readiness assessment and student mentoring platform. It is designed to bridge the gap between academic capabilities and modern corporate engineering expectations. Using **Google Gemini 3.5 Flash** integrated into a single-port **Express & React (Vite)** architecture, the application evaluates student readiness across multiple criteria and gives them actionable, AI-driven paths to success.

Students undergo automated technical evaluations, including writing code in a LeetCode-style algorithmic sandbox, uploading/scanning their CVs with an ATS-compatible scanner, and engaging in multi-turn mock technical interviews. The platform then compiles these data points to calculate a comprehensive **Placement Readiness Index (PRI)**. For any weaknesses found, it generates a personalized 6-week curriculum with learning materials. Admins can view cohort analytics, student progress, and classroom grade distributions in real-time.

---

## 🚀 Key Modules & Features

The platform is split into six key analytical components:

### 1. 📊 Placement Readiness Dashboard
*   **Composite Index**: Integrates coding, interview performance, resume quality, and profile completeness to calculate an overall Placement Readiness Index (PRI).
*   **Weighted Grading Policy**:
    *   💻 **Coding Capability**: $35\%$
    *   💬 **Mock Technical Interview**: $25\%$
    *   📄 **ATS Resume Screening**: $20\%$
    *   👤 **Academic Profile Completeness**: $20\%$
*   **Tier Classification**: Automatically buckets students into four placement bands:
    *   🌟 **Excellent Match** (Score $\ge 90$)
    *   ✅ **Ready with Minor Gaps** (Score $75$–$89$)
    *   📈 **Developing** (Score $50$–$74$)
    *   ⚠️ **Needs Attention** (Score $< 50$)

### 2. 💻 Algorithmic Coding Sandbox (LeetCode Simulator)
*   **Interactive IDE**: Integrated **Monaco Editor** interface featuring templates and syntax highlighting for JavaScript, TypeScript, Python, Java, C++, and C.
*   **AI Compiler & Grader**: Simulates isolated, secure compilation and runs code against predefined public and hidden test cases.
*   **Metrics Profiling**: Estimates code execution runtime (ms) and memory usage footprints (MB).
*   **AI Coaching Coach**: Provides interactive diagnostics:
    *   *Explain*: Decodes the core trick or data structure layout of the problem.
    *   *Hint*: Suggests step-by-step progressive clues without spoiling the solution.
    *   *Debug*: Evaluates student code to locate syntax traps or boundary limits.
    *   *Optimize*: Recommends optimizations to transition from $O(N^2)$ to $O(N)$ or $O(N \log N)$ complexities.
    *   *Complexity*: Performs detailed Big-O time and space complexity breakdowns.

### 3. 💬 AI Mock Technical Interviewer
*   **Contextual Multi-Turn Interview**: Conducts a realistic 6-turn conversational interview with **Dr. Sarah Jenkins** (AI Principal Software Engineer).
*   **Interactive Follow-ups**: The AI analyzes the candidate's answers in real time and asks contextual technical questions on system design, database replication, security, API routing, and performance optimization.
*   **Scorecard & Feedback**: Generates a detailed report grading **Technical Accuracy**, **Communication Skills**, and **Problem Solving** out of 100, along with a list of key strengths and actionable improvement targets.

### 4. 📄 ATS Resume CV Screener
*   **Keyword Optimization Scan**: Compares CV text against role specifications (Frontend, Backend, Full-stack, Data Science).
*   **Keyword Gaps**: Detects missing tools, libraries, or methodologies (e.g., Docker, Jest, Redis) and rates the candidate.
*   **ATS Alignment Score**: Evaluates CV layout, project representations, and metric inclusions, returning strengths and weaknesses.

### 5. 🗺️ Personalized Skill Gap & Roadmap Planner
*   **Delta Analyzer**: Visualizes skill gaps by comparing candidate capabilities to modern industry profiles.
*   **Custom 6-Week Curriculum**: Groups learning targets into 2-week milestones containing estimated study hours, weekly summaries, and study resources.

### 6. 🛡️ Admin Dashboard (Command Center)
*   **Cohort Analytics**: Tracks total registered students, overall average readiness scores, completed interviews, and CV scans.
*   **Visual Charts**: Uses **Recharts** to plot grade distributions, tier breakdowns, and domain distributions (Web Dev, Data Science, Core Algorithms).
*   **Student Roster**: Displays a table of student profiles, graduation years, CGPA scores, readiness ratings, and tier labels.

---

## 🛠️ Technology Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend UI** | React 19, React Router DOM v7, Tailwind CSS v4, Lucide React Icons, Motion (Framer Motion v12) |
| **Data Visualizations** | Recharts (Responsive Line, Bar, Pie, Radar, and Area charts) |
| **Interactive Editor** | `@monaco-editor/react` (Monaco Editor Integration) |
| **Backend Server** | Express.js, Vite Dev Server middleware mode, CJS Bundler esbuild, node-tsx |
| **AI SDK** | Official Google Gemini SDK (`@google/genai` v2.4.0) using `gemini-3.5-flash` |
| **Database** | In-memory cache + persistent local JSON file-system store (`database_store.json`) |

---

## 📁 Codebase Architecture

Below is a map of the key directories and files:

```bash
remix_-placement-readiness-predictor/
├── .env.example              # Template configuration file for app variables
├── .env.local                # Local environment secrets (e.g. GEMINI_API_KEY)
├── database_store.json       # Local database storage file (created automatically)
├── index.html                # Application entry HTML wrapper
├── package.json              # App scripts, dependencies, and metadata
├── server.ts                 # Fullstack Express server & Gemini API handlers
├── tsconfig.json             # TypeScript compiler rules
├── vite.config.ts            # Vite bundle options and Tailwind configuration
└── src/                      # Client side react source
    ├── App.tsx               # Client side routing, wrappers, and initialization
    ├── db.ts                 # Local database managers, seeding, and analytics
    ├── index.css             # Main styling base
    ├── main.tsx              # React client bootstrapping
    ├── types.ts              # Global TypeScript models and API schemas
    ├── components/           # Reusable layout fragments
    │   ├── AdminDashboard.tsx# Subcomponent for admin dashboard visualizations
    │   ├── AuthScreen.tsx    # Split register/login visual container
    │   ├── Dashboard.tsx     # Student overview, charts, and metrics
    │   ├── InterviewFeedback.tsx # Chat interface and interview report card
    │   ├── Navbar.tsx        # Top navigation element
    │   ├── ProfileForm.tsx   # Student academic info form
    │   ├── ResumeAnalyzer.tsx# Resume CV text upload layout
    │   └── RoadmapView.tsx   # Custom 6-week curriculum progress track
    ├── data/                 # Static database sources
    │   └── problems.ts       # Database of DSA coding problems
    └── pages/                # Main dashboard pages
        ├── AdminDashboard.tsx# Parent admin workspace
        ├── CodingAssessment.tsx # Coding editor workspace
        ├── Dashboard.tsx     # Student dashboard wrapper
        ├── InterviewFeedback.tsx # AI Interview room
        ├── LearningRoadmap.tsx# Student learning path
        ├── Login.tsx         # Login page
        ├── PlacementReport.tsx# Print-ready report card
        ├── Register.tsx      # Sign-up page
        ├── ResumeAnalyzer.tsx# Resume evaluation page
        ├── SkillGapAnalysis.tsx # Skill delta chart view
        └── StudentProfile.tsx# Academic details page
```

### Key Source Code Links
- 🔌 **Server & API Handler**: [server.ts](file:///d:/Project/remix_-placement-readiness-predictor/server.ts)
- 💾 **Database Controller**: [db.ts](file:///d:/Project/remix_-placement-readiness-predictor/src/db.ts)
- 🔀 **Routing Entrypoint**: [App.tsx](file:///d:/Project/remix_-placement-readiness-predictor/src/App.tsx)
- 📐 **Types & Interfaces**: [types.ts](file:///d:/Project/remix_-placement-readiness-predictor/src/types.ts)
- 🧩 **DSA Coding Problems**: [problems.ts](file:///d:/Project/remix_-placement-readiness-predictor/src/data/problems.ts)

---

## ⚙️ Environment Configuration

To run the application with full AI functionality, configure the environment variables:

1.  Duplicate the example file and name it `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
2.  Open [.env.local](file:///d:/Project/remix_-placement-readiness-predictor/.env.local) and populate the values:
    ```env
    # GEMINI_API_KEY: Your Google AI Studio API key
    GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"

    # APP_URL: The hosting url of the application
    APP_URL="http://localhost:3000"
    ```

---

## 🚀 Installation & Run Instructions

Follow these steps to run the application locally:

### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 2. Run in Development Mode
Vite runs inside the Express server wrapper. Start the development server with:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Run in Production Mode
Compile the client bundle and server script, then run:
```bash
# Clean previous builds and run build scripts
npm run build

# Start the compiled server
npm run start
```

### 4. Clean Build Directories
To purge build artifacts:
```bash
npm run clean
```

---

## 🧠 Under the Hood: AI Execution & Schema Grading

The backend utilizes `gemini-3.5-flash` with **Structured JSON Outputs** to ensure consistent API payloads. 

### Code Sandbox grading workflow:
When a student executes code inside the sandbox, [server.ts](file:///d:/Project/remix_-placement-readiness-predictor/server.ts) constructs a prompt detailing:
- The problem description, constraints, and target programming language.
- The student's code solution.
- The input parameters to run.

Gemini acts as an isolated, sandboxed runner, returning responses conforming to this TypeScript definition:

```typescript
interface SandboxResponse {
  compiledSuccessfully: boolean;
  compilerMessage: string;
  runtime: string;       // Estimated speed, e.g. "12ms"
  memory: string;        // Estimated memory, e.g. "14.5 MB"
  testResults: {
    input: string;
    actual: string;
    expected: string;
    passed: boolean;
    log?: string;        // Console logs if any
  }[];
  recommendations?: string; // Complexity guidance
}
```

This structural schema guarantees that client pages can render test case details without risky `eval()` code execution on the server.

---

## 🛡️ Smart Offline Fallback Mode

> [!NOTE]
> If `GEMINI_API_KEY` is missing, the application automatically enters **Smart Offline Fallback Mode** instead of failing.

The platform uses local evaluation logic when running offline:
*   **Coding Sandbox**: Safely parses JavaScript/TypeScript solutions locally, compares results to expectations, and returns execution metrics.
*   **ATS Scan**: Evaluates the text for key matches depending on the chosen role, providing realistic scores, strengths, and weaknesses.
*   **Mock Interview**: Initiates a fallback conversation using common technical follow-up questions.
*   **Roadmaps**: Generates pre-configured learning curricula based on the student's selected target role.

This ensures the application remains fully functional for presentation, development, and offline grading.

---

## 📄 License
This project is open-source and licensed under the [Apache-2.0 License](file:///d:/Project/remix_-placement-readiness-predictor/LICENSE).
