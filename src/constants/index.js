import bucknellLogo from "../assets/Bucknell.png";
import idtechLogo from "../assets/idtech.png";
import project1 from "../assets/projects/project-1.jpg";
import project2 from "../assets/projects/project-2.jpg";
import project3 from "../assets/projects/project-3.jpg";
import uberLogo from "../assets/uber.png";

export const HERO_CONTENT = `I am a passionate full stack developer with a knack for crafting robust and scalable web applications. With 5 years of hands-on experience, I have honed my skills in front-end technologies like React and Next.js, as well as back-end technologies like Node.js, MySQL, PostgreSQL, and MongoDB. My goal is to leverage my expertise to create innovative solutions that drive business growth and deliver exceptional user experiences.`;

export const ABOUT_TEXT = `Hi! I’m Zohaib (Zo-hey-b), a Computer Science and Math student passionate about using technology to solve real-world problems. Growing up in a resource-limited community taught me to think creatively and stay solution-focused. I’ve interned at companies like Uber, led 3 student organizations, organized 20+ events, and managed student group finances. With over 180 volunteer hours teaching coding to students and underserved communities, I’m dedicated to expanding STEM access. I’ve built 50+ technical projects, and outside tech, I choreograph and dance to express creativity and leadership. Let’s connect: zohaib.s.cheema92@gmail.com.`;

export const EXPERIENCES = [
  {
    year: "May 2024 – Aug 2024",
    role: "Software Engineer Intern",
    company: "Uber",
    logo: uberLogo,
    description: `Improved order accuracy by 27% for 200 Uber Eats merchants and boosted Uber One adoption across 9 countries (10M users) by architecting a real-time Kafka-FlinkSQL-Pinot pipeline and building a validated migration system with A/B-tested Go/TypeScript rollouts.`,
    technologies: ["Kafka", "FlinkSQL", "Go", "Typescript", "Pinot"],
  },
  {
    year: "Dec 2024 – May 2025",
    role: "Software Engineer Intern",
    company: "iD Tech",
    logo: idtechLogo,
    description: `Taught 70+ students DSA in Python, MERN stack development, and led workshops on building multi-agent GPT-3.5/Microsoft AutoGen chatbots to generate and debug Gurobi code for supply chain optimization.`,
    technologies: ["Python", "AI", "GPT-3.5", "Microsoft AutoGen", "Gurobi"],
  },
  {
    year: "Aug 2023 – April 2024",
    role: "Full-Stack Software Engineer Intern",
    company: "Bucknell L&IT Services",
    logo: bucknellLogo,
    description: `Reduced manual record-keeping by over 40% by building a React-based dashboard for L&IT Equipment Services to track 1,200+ devices, integrating live PostgreSQL data and custom Node.js APIs for inventory summaries, overdue flags, and activity logs.`,
    technologies: ["React", "PostgreSQL", "Node.js", "RESTful API"],
  },
];


export const PROJECTS = [
  {
    title: "PayPie",
    image: project2,
    description:
      "PayPie is a web app designed to simplify expense splitting for groups, whether for travel, shared living, or collaborative projects. With features like smart cost splitting, real-time updates, and receipt scanning, PayPie streamlines the process of managing and settling group finances.",    technologies: ["React", "Next.js", "Firebase", "AWS Lambda", "Gemini Gen AI"],
  },
  {
    title: "AwareNest",
    image: project1,
    description:
      "AwareNest is a mental health app designed to help users track their emotional well-being, log moods, and access mindfulness content. The app uses personalized emotion analysis to provide targeted suggestions and improve mental health tracking over time.",    technologies: ["Dart", "MySQL", "C++"],
  },
  {
    title: "DeFacto",
    image: project3,
    description:
      "DeFacto is a machine learning-based tool that classifies fake news articles using a hybrid model built with Scikit-learn, TensorFlow, and Keras. The system analyzes social and political content to detect deception in news stories and social media posts, providing a reliable solution to address the growing issue of misinformation.",
    technologies: ["Scikit-learn", "TensorFlow", "Keras", "R", "Pandas", "NumPy"],
  },
];


export const CONTACT = {
  address: "140 North Clinton Ave, Bay Shore, NY 11706 ",
  phoneNo: "+1 619-897-5041 ",
  email: "zohaib.s.cheema9@gmail.com",
};

export const SKILL_PLAYGROUNDS = [
  {
    id: "ai-sandbox",
    title: "Generative AI Sandbox",
    demandSignals: ["GenAI automation", "Prompt engineering", "EvalOps"],
    summary:
      "Multi-agent workflows that turn ambiguous product specs into validated features with automated guardrails.",
    highlights: [
      "AutoGen agents co-write TypeScript test harnesses from PRDs and self-critique with vectorized guardrails.",
      "Latency & cost overlays keep inferencing under 120ms while surfacing prompt efficiency deltas.",
      "Red-team notebook documents jailbreak attempts, mitigations, and lessons learned.",
    ],
    artifacts: ["Prompt graph", "Auto-eval log", "Risk register snapshot"],
    ctaLabel: "Launch AI Sandbox",
    ctaLink: "#ai-sandbox-lab",
  },
  {
    id: "cloud-ops",
    title: "Cloud Ops Command Center",
    demandSignals: ["SRE", "Cloud FinOps", "IaC"],
    summary:
      "A simulated production control room showcasing blue/green rollouts, error-budget tracking, and live cost governance.",
    highlights: [
      "Canary + feature flag board visualizes rollout health with synthetic Grafana traces.",
      "Terraform plan diff gallery illustrates policy-as-code guardrails and drift remediation.",
      "Runbook snippets cover pager rotations, RCAs, and postmortem templates.",
    ],
    artifacts: ["Canary dashboard", "Terraform plan diff", "RCA template"],
    ctaLabel: "View Ops Console",
    ctaLink: "#cloud-ops-lab",
  },
  {
    id: "data-studio",
    title: "Data Storytelling Studio",
    demandSignals: ["Decision intelligence", "Product analytics", "SQL/Python"],
    summary:
      "Interactive cohort explorer turning raw warehouse tables into executive-friendly narratives and growth bets.",
    highlights: [
      "Lightweight React viz lets reviewers slice retention cohorts and export stakeholder-ready insights.",
      "Notebook + dbt snippets reveal feature engineering, anomaly detection, and data contracts.",
      "Decision memo template ties findings to roadmap, KPIs, and experiment backlog.",
    ],
    artifacts: ["Cohort explorer demo", "dbt + notebook bundle", "Decision memo"],
    ctaLabel: "Explore Data Studio",
    ctaLink: "#data-storytelling-lab",
  },
  {
    id: "devsecops",
    title: "DevSecOps Lab",
    demandSignals: ["Secure SDLC", "SBOM", "Threat modeling"],
    summary:
      "Hands-on supply-chain hardening lab documenting SBOM generation, attack simulations, and automated patch playbooks.",
    highlights: [
      "GitHub Actions pipeline publishes CycloneDX SBOMs and blocks risky dependencies.",
      "Interactive threat-model canvas pairs misuse cases with compensating controls.",
      "Incident simulator walks through CVE ingestion → triage → fix verification.",
    ],
    artifacts: ["SBOM packet", "Threat model", "Incident sim video"],
    ctaLabel: "Open DevSecOps Lab",
    ctaLink: "#devsecops-lab",
  },
  {
    id: "inclusive-a11y",
    title: "Inclusive Design Playground",
    demandSignals: ["Accessibility", "Inclusive design", "QA leadership"],
    summary:
      "Accessibility audits, user persona research, and WCAG regression tooling packaged as a living QA lab.",
    highlights: [
      "Personas tie qualitative feedback to concrete UI changes and toggles.",
      "WCAG scorecard + regression scripts quantify improvements.",
      "Downloadable QA report shows stakeholder-ready documentation.",
    ],
    artifacts: ["QA report", "Persona board", "Regression suite"],
    ctaLabel: "Review A11y Lab",
    ctaLink: "#inclusive-design-lab",
  },
  {
    id: "enablement",
    title: "Enablement Hub",
    demandSignals: ["Technical leadership", "Education", "Product enablement"],
    summary:
      "Workshop kits, facilitation scripts, and impact metrics that prove your ability to upskill teams fast.",
    highlights: [
      "Catalog of AI, SRE, and accessibility labs with agendas and starter repos.",
      "Ready-to-send comms templates + retro forms for repeatable execution.",
      "Impact dashboard tracks attendees, confidence lift, and follow-up commits.",
    ],
    artifacts: ["Toolkit PDF", "Slides", "Survey templates"],
    ctaLabel: "Open Enablement Hub",
    ctaLink: "#enablement-lab",
  },
];

export const ARTIFACT_LIBRARY = [
  {
    title: "Data Studio Decision Memo",
    format: "Markdown report",
    goal: "Summarize experiment outcomes, risks, and next bets for growth reviews.",
    impact: "Gives stakeholders the narrative behind the Cohort Explorer demo.",
    linkLabel: "Download Memo",
    link: "/artifacts/data-storytelling-decision-memo.md",
  },
  {
    title: "AI Experiment Log",
    format: "Notion + Colab bundle",
    goal: "Document hypothesis-driven GenAI experiments with metrics, costs, and failure notes.",
    impact: "Shows analytical rigor and responsible AI practices for PM + SWE audiences.",
    linkLabel: "Download Log",
    link: "/artifacts/ai-experiment-log.md",
  },
  {
    title: "Cloud Ops Runbook",
    format: "Markdown playbook",
    goal: "Document blue/green rollout guardrails, incident response, and cost governance.",
    impact: "Shows reliability rigor plus FinOps awareness for SRE-heavy roles.",
    linkLabel: "View Runbook",
    link: "/artifacts/cloud-ops-runbook.md",
  },
  {
    title: "DevSecOps SBOM Packet",
    format: "CycloneDX report",
    goal: "Provide supply-chain evidence, policy gates, and threat model snapshots for secure SDLC stories.",
    impact: "Highlights ability to operationalize security within CI/CD.",
    linkLabel: "Download SBOM Packet",
    link: "/artifacts/devsecops-lab-sbom.md",
  },
  {
    title: "Systems Runbook",
    format: "Terraform + PagerDuty PDF",
    goal: "Explain how cloud rollouts are governed, triaged, and communicated cross-functionally.",
    impact: "Highlights reliability leadership and cross-team coordination.",
    linkLabel: "View Runbook",
    link: "https://github.com/zohaib-cheema",
  },
  {
    title: "Inclusive QA Report",
    format: "Accessibility audit + usability clips",
    goal: "Showcase how accessibility debt is measured, prioritized, and fixed.",
    impact: "Aligns with inclusive design & CSR requirements many companies now enforce.",
    linkLabel: "Preview QA Report",
    link: "/artifacts/inclusive-qa-report.md",
  },
  {
    title: "Enablement Toolkit",
    format: "Workshop decks + starter repos",
    goal: "Provide ready-to-teach content for internal upskilling sessions.",
    impact: "Demonstrates leadership, communication, and multiplier mindset.",
    linkLabel: "Access Toolkit",
    link: "/artifacts/enablement-toolkit.md",
  },
];
