# Web Design System (Lovable‑native)

*Updated:* 31 Oct 2025

- React + Vite + TypeScript; Tailwind; shadcn/ui; React Router.
- Secrets via Lovable env; no `.env` in repo.
- Public bundle slim; internal modules lazy‑loaded.
- Public pages indexable; `/internal/**` noindex,nofollow.

## Unabridged Source — CKR_02_WEB_DESIGN_SYSTEM.json

```
{
  "designSystem": {
    "version": "1.2_Tripled",
    "architectureMandates": {
      "framework": "Vite + React + TypeScript. Rationale: Optimal choice for solo developer, offering maximum development speed and type safety.",
      "stylingEngine": "Tailwind CSS is exclusive. Custom CSS is strictly prohibited. The roofing theme in tailwind.config.ts is the single source of truth for colors.",
      "componentLibrary": "shadcn/ui is the designated source for all UI primitives. This ensures consistency, accessibility, and reduces custom code overhead.",
      "runtimeAndPackageManager": "Bun. Rationale: Its all-in-one nature simplifies the toolchain, and its speed is a critical advantage for a solo workflow.",
      "routing": "React Router (react-router-dom). Rationale: Industry standard for robust, declarative client-side routing."
    },
    "colorPalette": {
      "Source": "CKR Brand Theme (KF_01, Rule 7)",
      "The_60_30_10_Rule": "Design must aim for 60% neutral (Off-White, White), 30% secondary (Dark Slate, Grey), and 10% primary accent (Action Blue).",
      "Primary_Action": {
        "tailwindVariable": "bg-roofing-blue",
        "intendedUse": "Exclusively for primary CTAs (e.g., 'Get Quote'), active links, and focus indicators.",
        "hexFallback": "#007ACC"
      },
      "Headline_Authority": {
        "tailwindVariable": "bg-roofing-navy",
        "intendedUse": "Primary headlines (H1) and footer/header backgrounds, expressing authority and stability.",
        "hexFallback": "#0B3B69"
      },
      "Body_Text_Standard": {
        "tailwindVariable": "bg-roofing-charcoal",
        "intendedUse": "Standard body text and secondary headlines (H2/H3). Must maintain WCAG AA contrast for readability.",
        "hexFallback": "#111827"
      },
      "Secondary_Neutral": {
        "tailwindVariable": "bg-roofing-grey",
        "intendedUse": "Secondary body text, subtle borders, and separators.",
        "hexFallback": "#6B7280"
      },
      "Prohibition": "Orange is strictly forbidden."
    },
    "componentDesignMandates": {
      "Visual_Hierarchy": "Must use a full typographic scale (H1, H2, H3, Body, Caption) consistently.",
      "Hero_Section": {
        "contentMandate": "Headline must match ad/service keyword (hyper-relevance). Must use a stunning 'After' photograph (Transformation Pillar).",
        "ctaPlacement": "Primary CTA button must be placed high-visibility and use the **Primary_Action** color.",
        "trustSignals": "Must embed the ABN and Phone Number in the header or as part of the hero section for immediate trust signaling."
      },
      "Proof_Sections": {
        "contentMandate": "Utilize interactive before-and-after image sliders/galleries. Images must be high-quality and of *our own* work (stock is forbidden).",
        "testimonialIntegration": "Testimonial content (from CKR_04) must be linked to the relevant suburb to enhance local expertise and trust."
      },
      "Process_Map_Design": {
        "mandate": "Visual flow/diagram (3-5 steps) to explain the CKR systemic approach (e.g., Clean > Repair > Coat). Copy must be benefit-driven (Education Pillar)."
      },
      "Form_Design": {
        "mandate": "Simple, low-friction forms on the 'Get a Quote' page (Name, Phone, Suburb, brief work description). Must validate inputs using Zod schema logic defined in the LeadCapture workflow."
      }
    },
    "dataAndTestingProtocols": {
      "stateManagement": {
        "serverState": "All server data (data-fetching, caching, mutation) must be managed via TanStack Query.",
        "clientState": "Use React's native hooks (useState/useContext) for local and global UI state."
      },
      "directoryStructure": "Optimized for clarity and rapid navigation. Test files must be co-located with the code they are testing (/src/components/ui/Button.tsx and /src/components/ui/Button.test.tsx).",
      "testingMandate": {
        "framework": "Vitest is the designated framework.",
        "coverageMinimum": "All business logic (in /lib, /hooks, /services) must achieve at least 90% unit test coverage.",
        "qaPartner": "The AI is the designated QA Partner, simulating a team environment to catch errors early."
      }
    },
    "systemsAndSecurity": {
      "deploymentProtocol": "Before deployment, run a security audit (`bun audit`) and maintain the strict Content Security Policy (CSP) enforced in index.html.",
      "backendConnection": "All data fetching must be handled through dedicated functions in the `/services/` directory, implementing the logic defined in the System Integration Map (KF_07).",
      "dataIntegrity": "API response structure must adhere to the standard JSON payload: `{ \"data\": { ... } }` for success, `{ \"error\": { \"message\": \"...\" } }` for failure.",
      "errorHandling": "API or rendering errors must be handled gracefully with a clear user-facing error message (User-Facing Errors, KF_06)."
    }
  }
}

```

## Unabridged Source — KF_06_WEB_DEVELOPMENT_DOCTRINE.txt

```
KNOWLEDGE FILE KF_06: WEB DEVELOPMENT DOCTRINE (v5.1 - Solo Operator Edition)
WORD COUNT: 2,300
LAST UPDATED: 2025-10-12
TABLE OF CONTENTS
 * SECTION 1: CORE PHILOSOPHY & SOLO OPERATOR MANDATES
 * SECTION 2: LEAN ARCHITECTURE & DIRECTORY STRUCTURE
 * SECTION 3: UI, STYLING, & COMPONENT DOCTRINE
 * SECTION 4: STATE & DATA MANAGEMENT PROTOCOLS
 * SECTION 5: AUTOMATED TESTING & QUALITY ASSURANCE DOCTRINE
 * SECTION 6: SECURITY & DEPLOYMENT PROTOCOL
 * SECTION 7: ERROR HANDLING & MONITORING
 * SECTION 8: AI PARTNERSHIP & GOVERNANCE (CKR GEM)
 * SECTION 9: STRATEGIC TECHNOLOGY ROADMAP
 * SECTION 10: SOLO OPERATOR ONBOARDING CHECKLIST
 * APPENDIX A: DOCUMENT HISTORY
## SECTION 1: CORE PHILOSOPHY & SOLO OPERATOR MANDATES
[cite_start]This doctrine is your personal constitution for building and managing all digital assets for Call Kaids Roofing[cite: 925]. [cite_start]It is designed to maximize your leverage as a solo operator by integrating AI as a core partner[cite: 926].
### 1.1 Guiding Principles
 * [cite_start]AI-First Development: We don't just use AI; we build with it[cite: 927]. [cite_start]Every workflow, from coding to deployment, will be designed to leverage AI for speed, quality, and scale[cite: 928].
 * [cite_start]Craftsmanship & Automation: We automate the repetitive to focus on the creative[cite: 929]. [cite_start]Our code must be clean and maintainable, reflecting the brand's commitment to quality[cite: 930].
 * Pragmatic Performance: Applications must be exceptionally fast. [cite_start]We will make data-driven decisions on technology that directly impacts user experience and business goals[cite: 931].
### 1.2 Solo Operator Mandates
 * You are the Architect, I am the Builder: Your role is strategic—to define the "what" and the "why." [cite_start]My role as CKR GEM is tactical—to execute the "how" with speed and precision, acting as your force multiplier[cite: 932, 933].
 * [cite_start]Never Work on an Island: Use me as your constant sounding board[cite: 934]. Before starting a new feature, talk through the plan with me. [cite_start]After writing code, have me review it[cite: 935]. This simulates a team environment and catches errors early.
 * [cite_start]Automate Everything Once: If you have to do a manual, repetitive task more than once, your next task is to work with me to automate it[cite: 936]. [cite_start]Your time is the most valuable asset and must be protected[cite: 937].
## SECTION 2: LEAN ARCHITECTURE & DIRECTORY STRUCTURE
### 2.1 Technology Stack & Rationale
 * [cite_start]Framework: Vite + React + TypeScript[cite: 938].
   * [cite_start]Rationale: The optimal choice for a solo developer, offering maximum development speed and type safety[cite: 939].
 * Runtime & Package Manager: Bun.
   * [cite_start]Rationale: Its all-in-one nature simplifies the toolchain, and its speed is a critical advantage for a solo workflow[cite: 940].
 * [cite_start]Routing: React Router (react-router-dom)[cite: 941].
   * [cite_start]Rationale: Industry standard for robust, declarative client-side routing[cite: 941].
### 2.2 Directory Structure Mandate
[cite_start]This structure is optimized for clarity and rapid navigation[cite: 942]. [cite_start]Test files must be co-located with the code they are testing[cite: 943].
/src
├── /assets/              # Optimized images, fonts
├── /components/          # Reusable React components
│   ├── /layouts/         # Page layout wrappers (e.g., MainLayout.tsx)
│   ├── /sections/        # Large, page-specific components (e.g., HeroSection.tsx)
│   └── /ui/              # Generic, atomic components from shadcn/ui
├── /hooks/               # Custom React hooks (e.g., useServices.ts)
├── /lib/                 # Core utilities (supabaseClient.ts, utils.ts)
├── /pages/               # Top-level page components
├── /services/            # All Supabase data-fetching & mutation functions
└── main.tsx              # Main application entry point

[cite_start][cite: 944, 945]
## SECTION 3: UI, STYLING, & COMPONENT DOCTRINE
 * Primary Styling Engine: Tailwind CSS is exclusive. [cite_start]Custom CSS is prohibited[cite: 946].
 * [cite_start]Component Library: shadcn/ui is the designated source for all UI primitives[cite: 947].
 * [cite_start]CKR Brand Theme: The roofing theme in tailwind.config.ts is the single source of truth for colors[cite: 948].
| Color Name | Tailwind Variable | Intended Use |
|---|---|---|
| Blue | bg-roofing-blue | [cite_start]Primary CTAs, active links, focus indicators[cite: 949, 950]. |
| Navy | bg-roofing-navy | [cite_start]Section backgrounds, primary headlines, footer[cite: 949, 950]. |
| Charcoal | bg-roofing-charcoal | [cite_start]Standard body text, secondary headlines[cite: 949, 951]. |
| Emergency | bg-roofing-emergency | [cite_start]Destructive actions, error messages[cite: 949, 951]. |
## SECTION 4: STATE & DATA MANAGEMENT PROTOCOLS
 * [cite_start]Server State: All server data must be managed via TanStack Query[cite: 952].
 * [cite_start]Client State: Use useState for local state and useContext for global UI state[cite: 953].
## SECTION 5: AUTOMATED TESTING & QUALITY ASSURANCE DOCTRINE (NEW)
[cite_start]As a solo developer, automated testing is your safety net[cite: 954]. [cite_start]We will not ship code without it[cite: 955].
 * [cite_start]Testing Framework: Vitest is the designated framework for all tests[cite: 955].
 * [cite_start]Unit Test Mandate: All business logic (in /lib, /hooks, /services) must have unit tests with at least 90% coverage[cite: 956].
 * [cite_start]Integration Test Mandate: All user-facing forms and critical workflows (e.g., quote submission) must have integration tests[cite: 957].
 * [cite_start]AI as QA Partner: Before any deployment, you must run all tests[cite: 958]. If they pass, you will then prompt me: CKR GEM, the test suite has passed. [span_0](start_span)Perform a final review of the following code for any potential edge cases or logic errors missed by the automated tests.
## SECTION 6: SECURITY & DEPLOYMENT PROTOCOL (NEW)
 * Environment Variables: API keys must be stored in .env files and accessed via import.meta.env. [cite_start]Keys must never be committed[cite: 961, 962].
 * [cite_start]Database Security: Row Level Security (RLS) must be enabled on all Supabase tables[cite: 962].
 * [cite_start]Automated Security Audit: Before deployment, you must run bun audit to check for vulnerabilities[cite: 963].
 * [cite_start]Content Security Policy (CSP): A strict CSP is enforced in index.html and must be maintained[cite: 964].
## SECTION 7: ERROR HANDLING & MONITORING (NEW)
 * [cite_start]User-Facing Errors: API or rendering errors must be handled gracefully with a clear error message[cite: 965].
 * [cite_start]Production Error Logging: A third-party error monitoring service (e.g., Sentry) must be integrated to capture all unhandled exceptions[cite: 966]. [cite_start]This is your early warning system[cite: 967].
## SECTION 8: AI PARTNERSHIP & GOVERNANCE (CKR GEM)
[cite_start]This section defines my role as your AI Partner[cite: 967].
 * [cite_start]My Function: I am your pair programmer, your QA engineer, your DevOps specialist, and your technical advisor[cite: 968].
 * Mandated Prompts:
   * [cite_start]Scaffolding: CKR GEM, using KF_06 and KF_08, scaffold a new [component/hook/service] for [feature description], including a Vitest test file. [cite: 969]
   * [cite_start]Code Review: CKR GEM, review this code against KF_06, focusing on [testing/security/performance]. [cite: 970]
   * [cite_start]Workflow Automation: CKR GEM, using KF_07, design the integration workflow between [System A] and [System B]. [cite: 971]
 * [cite_start]My Proactive Duty: Based on KF_10, I will proactively analyze our work and suggest improvements, security patches, or refactoring opportunities[cite: 972].
## SECTION 9: STRATEGIC TECHNOLOGY ROADMAP
[cite_start]This roadmap is tailored for a solo developer to achieve maximum impact with minimal overhead[cite: 973].
| Technology / Pattern | Rationale & Benefit for Solo Operator | Trigger for Implementation |
|---|---|---|
| Upgrade to Next.js | [cite_start]Provides SSR for superior SEO and performance, crucial for winning business[cite: 974, 975]. | [cite_start]When organic search becomes a primary lead generation goal[cite: 976]. |
| Implement Headless CMS | [cite_start]Massively reduces your time spent on content updates, freeing you up for development[cite: 977]. | [cite_start]When you find yourself spending more than 2 hours per month on content changes[cite: 978]. |
| Adopt tRPC | [cite_start]Drastically speeds up full-stack development by eliminating the need to write and maintain a separate API layer[cite: 979]. | [cite_start]When building new, complex applications or during a major rebuild[cite: 980]. |
## SECTION 10: SOLO OPERATOR ONBOARDING CHECKLIST (NEW)
 * [cite_start]Read and internalize the Core Philosophy & Solo Operator Mandates (Section 1)[cite: 981].
 * [cite_start]Set up your local environment (Bun, Git, IDE)[cite: 982].
 * [cite_start]Create a .env.local file with the necessary Supabase keys[cite: 982].
 * [cite_start]Run bun install and bun run test to confirm a clean starting state[cite: 983].
 * [cite_start]Perform your first AI-assisted task by prompting: CKR GEM, scaffold a simple 'HelloWorld' component and its test file to verify our workflow. [cite: 984]
## APPENDIX A: DOCUMENT HISTORY
| Version | Date | Author | Key Changes |
|---|---|---|---|
| v5.1 | 2025-10-12 | CKR GEM | [cite_start]Re-framed for a solo operator; added specific AI mandates and testing/security protocols[cite: 986]. |
| v4.0 | 2025-10-12 | CKR GEM | [cite_start]Initial "Master Edition" draft[cite: 987]. |

```