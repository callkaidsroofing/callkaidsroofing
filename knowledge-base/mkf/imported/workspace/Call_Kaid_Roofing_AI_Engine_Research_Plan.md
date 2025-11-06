# Research Framework
-   **Strategic Alignment & Core System Objectives:**
    -   **Knowledge Needed:** Deep understanding of the user's overarching mission (growth, quality, proof, trust, data integrity) and the "backend-first, AI-enhanced digital engine" concept. How does the system achieve internal intelligence, solo operator efficiency, and modularity without public-facing AI?
    -   **Evidence/Sources:** Analysis of the provided system requirements and strategic goals outlined in the prompt.

-   **Internal Operations AI Module (Non-Customer Facing):**
    -   **Knowledge Needed:** Best practices for automated job/inspection scheduling considering dynamic variables (weather, workload, region), robust data synchronization patterns between Supabase and Google Drive, intelligent trigger mechanisms for follow-ups, and AI-driven insight generation for operational optimization (quotes, jobs, crew deployment). Understanding of CKR's internal philosophy and protocols from `KF_00` to `KF_05`.
    -   **Evidence/Sources:** Research on enterprise resource planning (ERP) systems, AI-powered scheduling algorithms, data integration platforms, workflow automation, and operational analytics.

-   **Content Engine (Proof + Blog + SEO):**
    -   **Knowledge Needed:** Strategies for AI-powered content generation from structured data (case studies, job folders, photos, testimonials), local SEO optimization techniques (Tier 1–3 intent), dynamic content assembly for proof packages (before/after shots), and efficient multi-format content rendering (Markdown, HTML, JSON) for publishing.
    -   **Evidence/Sources:** SEO industry best practices, content marketing automation platforms, AI text and image generation models, structured content management systems.

-   **Meta Ads Engine (Creative + Strategy + Launch):**
    -   **Knowledge Needed:** Advanced Meta Ads API utilization for campaign creation, dynamic ad creative generation from proof-driven visuals, AI-driven copy generation using frameworks (PAS, AIDA, BAB), location-aware audience targeting, retargeting campaign mechanics, automated performance evaluation, A/B testing orchestration, and scheduled ad set deployment.
    -   **Evidence/Sources:** Meta for Developers documentation, digital advertising best practices, AI in marketing research, programmatic advertising platforms.

-   **Design & Technical Architecture Constraints:**
    -   **Knowledge Needed:** Mobile-first UI/UX design principles specific to trades-based applications, strict adherence to given UI libraries (Tailwind CSS, shadcn/ui), specific color palettes and typography hierarchy, frontend technology stack (Vite, React, TypeScript, Bun, React Router) best practices, backend integration with Supabase (non-destructive schema changes), Google Drive/Gmail API, Weather API, Meta Ads API, and robust error handling/security protocols.
    -   **Evidence/Sources:** Frontend/backend development documentation, API specifications, UI/UX design guidelines, security best practices.

-   **Vector RAG Engine (Pinecone & Knowledge Retrieval):**
    -   **Knowledge Needed:** Optimal Pinecone indexing strategies (chunking, metadata tagging), secure namespace management for versioning (`v2_kf03`), selection and performance characteristics of embedding models (text-embedding-3-small, Cohere v3), and effective retrieval methods (top 5 semantic + filtered chunks) for grounding GPT context. Understanding of source documents (`03_KnowledgeFiles.zip`, SOPs, pricing, etc.).
    -   **Evidence/Sources:** Pinecone documentation, vector database best practices, RAG system design principles, embedding model comparative analysis.

-   **Self-Directed Research Mandate & Tool Selection:**
    -   **Knowledge Needed:** Up-to-date best practices for LangChain + Supabase integration (non-breaking schema), latest trends in mobile-first UI for trades, current Pinecone performance, pricing, and namespace management, and comparative analysis of optimal AI tools for scheduling, CRM-file sync, Meta Ads campaign generation, and blog/proof formatting/publishing.
    -   **Evidence/Sources:** White papers, technical blogs, official documentation, industry reports, expert reviews of AI tools.

# Search Plan
1.  Research best practices for integrating LangChain with Supabase, focusing on strategies to append data and extend functionality without modifying or breaking existing Supabase schemas.

2.  Investigate effective mobile-first UI/UX design patterns and implementation techniques specifically for web applications targeting trades-based professionals, considering their unique workflow and on-site needs.

3.  Explore current Pinecone performance benchmarks, optimal pricing strategies for scaling, and advanced namespace management techniques to safely version and update knowledge bases in production environments.

4.  Identify and compare leading AI tools and libraries that can efficiently automate job scheduling with dynamic weather logic and reliably synchronize CRM data with cloud storage like Google Drive.

5.  Evaluate AI platforms or frameworks best suited for generating localized SEO-optimized blog content, automatically creating case studies from structured job data, and orchestrating Meta Ads campaigns with dynamic creative and copy generation.

6.  Determine secure and efficient integration patterns for orchestrating multiple external APIs (e.g., Google Drive, Gmail, Weather, Meta Ads) within a backend-first system, prioritizing data integrity, reliability, and rate limit management.