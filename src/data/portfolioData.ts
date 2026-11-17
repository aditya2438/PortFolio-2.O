export type SkillCategory = 'all' | 'languages' | 'backend' | 'databases' | 'tools';

export interface SkillItem {
  id: string;
  name: string;
  category: Exclude<SkillCategory, 'all'>;
  level: string;
  usedIn: string[];
  witNote: string;
}

export interface ProjectStage {
  id: string;
  title: string;
  highlight: string;
  caption: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  tagline: string;
  categoryText: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  liveUrl?: string;
  repoUrl?: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  highlights: string[];
  stages: ProjectStage[];
  deepDive: { title: string; body: string }[];
  engineerWit: string;
}

export interface EducationItem {
  period: string;
  degree: string;
  institution: string;
  score: string;
  details: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  focus: string;
  summary: string;
  skills: string[];
}

export interface MoodConfig {
  id: 'recruiter' | 'builder' | 'honest';
  label: string;
  kicker: string;
  summary: string;
}

export interface FitCriterion {
  id: string;
  label: string;
  points: number;
  note: string;
}

export const PROFILE = {
  name: 'Aditya Chouhan',
  fullName: 'Aditya Singh Chouhan',
  role: 'Software Developer & Java Backend Engineer',
  location: 'Ujjain / Indore, MP, India',
  timezone: 'Asia/Kolkata',
  graduation: 'B.Tech CSE · Class of 2026',
  cgpa: '6.98',
  email: 'adityachouhan2446@gmail.com',
  phone: '+91 78802 09425',
  phoneHref: 'tel:+917880209425',
  whatsappDigits: '917880209425',
  whatsappDisplay: '+91 78802 09425',
  whatsappUrl:
    'https://wa.me/917880209425?text=Hi%20Aditya!%20I%20just%20visited%20your%20portfolio%20and%20would%20love%20to%20connect.',
  photoUrl: '/aditya-profile.jpg',
  resumeUrl: '/Aditya_Chouhan_Resume.pdf',
  resumeDownloadUrl: '/api/resume/download',
  websiteUrl: 'https://aditya-singh-chouhan.vercel.app/',
  githubUrl: 'https://github.com/aditya2438',
  githubHandle: '@aditya2438',
  linkedinUrl: 'https://www.linkedin.com/in/adityachouhan24',
  linkedinHandle: 'in/adityachouhan24',
  leetcodeUrl: 'https://leetcode.com/u/kX69jmDS30/',
  leetcodeHandle: '@kX69jmDS30',
};

export const HERO_MOODS: MoodConfig[] = [
  {
    id: 'recruiter',
    label: 'Recruiter Brief',
    kicker: 'Day-One Backend & Full-Stack Ready',
    summary:
      'I build resilient Spring Boot 3.3 applications, normalized 3NF relational databases, sub-25ms Redis caches, and containerized Docker deployments.',
  },
  {
    id: 'builder',
    label: 'Builder Mode',
    kicker: 'Clean APIs Meet Kinetic Craft',
    summary:
      'From 5-service Kafka checkout flows in FairCart to spherical geo-routing across MP cities in FixOra, I obsess over reliability and joyful user experiences.',
  },
  {
    id: 'honest',
    label: '2 AM Truths',
    kicker: 'Powered by Chai & Composite Indexes',
    summary:
      '"I add pessimistic write locks so flash sales never turn into customer-support horror stories—and yes, I genuinely enjoy reading SQL EXPLAIN plans."',
  },
];

export const FUN_TRUTHS: { tag: string; quote: string }[] = [
  {
    tag: 'Flash-Sale Sanity',
    quote: 'Two shoppers clicked "Buy Last Pair" in the same millisecond? Pessimistic row locks politely made one wait instead of overselling 47 pairs.',
  },
  {
    tag: '3NF Confession',
    quote: 'Yes, I voluntarily normalized 17 MySQL tables to Third Normal Form in FixOra. No, I do not regret naming every composite B-Tree index cleanly.',
  },
  {
    tag: 'Spring AI Guardrail',
    quote: 'Teaching an LLM to negotiate e-commerce discounts is fun until you put a strict Redis profit-margin fence around its generosity.',
  },
  {
    tag: 'Dead-Letter Diplomacy',
    quote: 'When downstream services sneeze during a traffic spike, Kafka Dead-Letter Queues hold the order politely instead of losing customer money.',
  },
  {
    tag: 'Docker Liberation',
    quote: 'Containerizing Java 21 + Redis + Postgres officially retired my favorite excuse: "Wait, it worked on my laptop five minutes ago."',
  },
  {
    tag: 'Chai-to-Code Metric',
    quote: 'Optimal productivity formula observed in Indore: 1 cup masala chai yields approximately 5 decoupled Spring Boot microservices.',
  },
];

export const HERO_METRICS = [
  { value: '55%', label: 'Primary DB read load saved with Redis' },
  { value: '<25ms', label: 'Flash-sale catalog cache response' },
  { value: '17', label: 'Normalized 3NF MySQL tables in FixOra' },
  { value: '2026', label: 'B.Tech CSE graduating class (SVVV)' },
];

export const FIT_CRITERIA: FitCriterion[] = [
  { id: 'java', label: 'Needs clean Java 21 & Spring Boot 3.3', points: 24, note: 'Daily core stack across FairCart & FixOra' },
  { id: 'db', label: 'Cares about zero race conditions & 3NF SQL', points: 22, note: 'Pessimistic JPA locks + 17-table MySQL design' },
  { id: 'scale', label: 'Wants sub-25ms Redis + Kafka resilience', points: 20, note: '55% DB read offload & Dead-Letter Queues' },
  { id: 'docker', label: 'Ships containerized Docker services', points: 14, note: 'Production-deployed across Vercel & Render' },
  { id: 'security', label: 'Demands JWT, OAuth2 & RBAC hygiene', points: 12, note: 'Stateless JJWT + BCrypt multi-role security' },
  { id: 'humor', label: 'Appreciates calm humor during 2 AM deploys', points: 8, note: 'High debugging patience guaranteed' },
];

export const CONTACT_STARTERS: { label: string; topic: string; message: string }[] = [
  {
    label: 'Internship / FTE Role',
    topic: 'Software Developer Role',
    message:
      'Hi Aditya, we explored your portfolio, FairCart, and FixOra and would love to discuss a Software Developer opportunity with you.',
  },
  {
    label: 'Project Collaboration',
    topic: 'Engineering Collaboration',
    message:
      'Hey Aditya! I have an exciting Java / Spring Boot web project idea and would love to collaborate with you.',
  },
  {
    label: 'Quick Hello',
    topic: 'Portfolio Hello',
    message:
      'Hi Aditya! Really loved the animations and creativity on your portfolio. Let us connect!',
  },
];

export const SKILLS: SkillItem[] = [
  {
    id: 'java21',
    name: 'Java 21',
    category: 'languages',
    level: 'Core Runtime',
    usedIn: ['FairCart', 'FixOra'],
    witNote: 'Virtual threads, clean pattern matching, and strong OOP clarity.',
  },
  {
    id: 'springboot',
    name: 'Spring Boot 3.3',
    category: 'backend',
    level: 'Primary Framework',
    usedIn: ['FairCart', 'FixOra'],
    witNote: 'Turning complex domain rules into clean, predictable REST backends.',
  },
  {
    id: 'springai',
    name: 'Spring AI',
    category: 'backend',
    level: 'LLM Workflows',
    usedIn: ['FairCart'],
    witNote: 'Powers dynamic deal negotiation bounded by real margin guardrails.',
  },
  {
    id: 'springsecurity',
    name: 'Spring Security',
    category: 'backend',
    level: 'JWT & RBAC',
    usedIn: ['FairCart', 'FixOra'],
    witNote: 'Stateless JJWT + BCrypt protecting Customer, Pro, and Admin flows.',
  },
  {
    id: 'kafka',
    name: 'Apache Kafka',
    category: 'tools',
    level: 'Event Streaming',
    usedIn: ['FairCart'],
    witNote: 'Dead-Letter Queues ensure failed orders wait safely instead of disappearing.',
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'databases',
    level: 'Sub-25ms Cache',
    usedIn: ['FairCart', 'FixOra'],
    witNote: 'Absorbing 55% of primary database reads so traffic spikes stay smooth.',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'databases',
    level: 'ACID & Locking',
    usedIn: ['FairCart'],
    witNote: 'Pessimistic write locks so two shoppers never buy the same last item.',
  },
  {
    id: 'mysql',
    name: 'MySQL 8.0',
    category: 'databases',
    level: '3NF & B-Tree',
    usedIn: ['FixOra'],
    witNote: '17 normalized tables with stored procedures for crisp audit trails.',
  },
  {
    id: 'hibernate',
    name: 'Hibernate / JPA',
    category: 'backend',
    level: 'ORM & Fetching',
    usedIn: ['FairCart', 'FixOra'],
    witNote: 'Intentional fetch joins so N+1 query bugs stay out of production.',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'tools',
    level: 'Containers',
    usedIn: ['FairCart', 'FixOra'],
    witNote: 'Reliable builds that run identically from laptop to cloud.',
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'languages',
    level: 'Query Tuning',
    usedIn: ['FairCart', 'FixOra'],
    witNote: 'Composite B-Tree indexes that turn slow scans into millisecond lookups.',
  },
  {
    id: 'javascript',
    name: 'JavaScript (ES6+)',
    category: 'languages',
    level: 'Interactive UI',
    usedIn: ['FairCart', 'FixOra'],
    witNote: 'Connecting responsive web interfaces seamlessly to Java APIs.',
  },
  {
    id: 'cpp',
    name: 'C++',
    category: 'languages',
    level: 'DSA & Logic',
    usedIn: ['LeetCode'],
    witNote: 'Sharp algorithmic problem solving across graphs, DP, and trees.',
  },
  {
    id: 'microservices',
    name: 'Microservices',
    category: 'backend',
    level: 'Distributed',
    usedIn: ['FairCart'],
    witNote: 'Auth, Catalog, Cart, Order, Inventory — clean domain boundaries.',
  },
  {
    id: 'junit',
    name: 'JUnit 5',
    category: 'backend',
    level: 'Unit Testing',
    usedIn: ['FairCart'],
    witNote: 'Automated confidence checks before shipping new releases.',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'databases',
    level: 'NoSQL',
    usedIn: ['Prototypes'],
    witNote: 'Flexible JSON document storage for rapid experiments.',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'databases',
    level: 'Cloud Postgres',
    usedIn: ['Prototypes'],
    witNote: 'Fast managed Postgres provisioning for side builds.',
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'tools',
    level: 'Collaboration',
    usedIn: ['All Projects'],
    witNote: 'Atomic commits, readable diffs, and disciplined branching.',
  },
  {
    id: 'maven',
    name: 'Maven & Gradle',
    category: 'tools',
    level: 'Build Tools',
    usedIn: ['FairCart', 'FixOra'],
    witNote: 'Deterministic Java dependency builds and packaging.',
  },
  {
    id: 'postman',
    name: 'Postman',
    category: 'tools',
    level: 'API Validation',
    usedIn: ['FairCart', 'FixOra'],
    witNote: 'Edge-case verification on every endpoint contract.',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'faircart',
    index: '01',
    title: 'FairCart',
    tagline: 'AI-Powered Distributed E-Commerce Platform',
    categoryText: 'Microservices · Spring AI · Kafka · Redis · PostgreSQL',
    description:
      'A decoupled 5-service e-commerce platform uniting Spring AI dynamic deal negotiation, Apache Kafka Dead-Letter Queues, sub-25ms Redis caching, and pessimistic PostgreSQL locking for airtight flash-sale checkouts.',
    imageUrl: '/src/assets/images/project_faircart_visual_1794822529865.jpg',
    imageAlt: 'Isometric distributed microservices and Kafka event architecture for FairCart',
    liveUrl: 'https://faircart-ten.vercel.app/',
    repoUrl: 'https://github.com/aditya2438/FairCart',
    stack: ['Java 21', 'Spring Boot 3.3', 'Spring AI', 'Apache Kafka', 'Redis', 'PostgreSQL', 'Docker', 'JWT & OAuth2'],
    metrics: [
      { value: '55%', label: 'DB read load saved' },
      { value: '<25ms', label: 'Redis cache response' },
      { value: '5', label: 'Microservices' },
    ],
    highlights: [
      'Decoupled Auth, Catalog, Cart, Order, and Inventory services connected over Apache Kafka with Dead-Letter Queues (DLQ).',
      'Integrated Spring AI LLMs for real-time bundle deal negotiation, product recommendations, and cart-abandonment insights.',
      'Built a Redis caching layer absorbing 55% of PostgreSQL read load with sub-25ms latency under flash-sale surges.',
      'Applied 3NF PostgreSQL schemas and Hibernate pessimistic write locks to eliminate concurrent checkout overselling.',
    ],
    stages: [
      { id: 'auth', title: 'Stateless Shield', highlight: 'JWT & OAuth2', caption: 'Verifies shopper identity cleanly at the gateway edge.' },
      { id: 'redis', title: 'Sub-25ms Cache', highlight: '55% DB Relief', caption: 'Serves hot catalog & cart snapshots directly from Redis.' },
      { id: 'ai', title: 'Spring AI Negotiator', highlight: 'Margin Guardrail', caption: 'Crafts smart deal offers while respecting server margin bounds.' },
      { id: 'kafka', title: 'Kafka + DLQ Bus', highlight: 'Zero Lost Orders', caption: 'Asynchronously dispatches inventory & retries hiccups safely.' },
    ],
    deepDive: [
      {
        title: 'Kafka Dead-Letter Queue Strategy',
        body: 'Idempotency keys ride on every checkout event. Transient failures park safely in an isolated DLQ topic with exponential backoff.',
      },
      {
        title: 'Pessimistic Write Locking',
        body: 'Row-level JPA pessimistic locks serialize concurrent inventory decrements so the last sneaker is only ever sold once.',
      },
      {
        title: 'Spring AI Deal Guardrails',
        body: 'Negotiation prompts inject live server-fetched floor prices from Redis—AI can persuade, never over-discount.',
      },
    ],
    engineerWit:
      'Built so "1 item left" never turns into 47 oversold orders at 12:01 AM.',
  },
  {
    id: 'fixora',
    index: '02',
    title: 'FixOra',
    tagline: 'On-Demand Local Service Booking Marketplace',
    categoryText: 'Geo-Discovery · Spring Security · MySQL 8.0 · Docker',
    description:
      'A multi-role neighborhood service marketplace featuring Haversine spherical provider discovery across MP city clusters, collision-free slot booking, 17 normalized 3NF MySQL tables, and a 5-stage job lifecycle.',
    imageUrl: '/src/assets/images/project_fixora_visual_1794822529992.jpg',
    imageAlt: 'Isometric geo-spatial city map routing pins and arcs for FixOra marketplace',
    liveUrl: 'https://fixora-xn4k.onrender.com',
    repoUrl: 'https://github.com/aditya2438/Fixora',
    stack: ['Java 21', 'Spring Boot 3.3', 'Spring Security', 'MySQL 8.0', 'Redis', 'JJWT & BCrypt', 'Docker', 'Render'],
    metrics: [
      { value: '17', label: '3NF MySQL tables' },
      { value: '3', label: 'MP city clusters' },
      { value: '5-Stage', label: 'Job lifecycle' },
    ],
    highlights: [
      'Separate dashboards for Customers, Service Pros, and Admins protected by stateless JJWT tokens and BCrypt hashing.',
      'Location-aware Haversine distance sorting across Ujjain, Indore, and Bhopal with collision-free slot reservations.',
      'Designed 17 normalized (3NF) MySQL 8.0 tables with composite B-Tree indexes and ACID auditing stored procedures.',
      'Orchestrated a deterministic 5-stage booking workflow containerized cleanly via Docker on Render.',
    ],
    stages: [
      { id: 'geo', title: 'Haversine Ranking', highlight: '3 City Clusters', caption: 'Finds closest vetted technicians across Ujjain, Indore & Bhopal.' },
      { id: 'rbac', title: 'Role Isolation', highlight: 'JJWT + BCrypt', caption: 'Keeps Customer, Service Pro, and Admin permissions airtight.' },
      { id: 'slot', title: 'Collision Lock', highlight: 'No Double-Books', caption: 'Guarantees a technician can never be reserved twice for one hour.' },
      { id: 'audit', title: '17-Table 3NF Core', highlight: 'MySQL 8.0 ACID', caption: 'Tracks every booking stage from Booked through Completed & Paid.' },
    ],
    deepDive: [
      {
        title: 'Haversine Great-Circle Math',
        body: 'Computes real spherical distances with bounding-box filtering and composite B-Tree indexes for sub-15ms discovery.',
      },
      {
        title: '17-Table 3NF Relational Design',
        body: 'Eliminates update anomalies across schedules, payouts, ratings, and dispute audits with strict foreign key cascades.',
      },
      {
        title: '5-Stage State Enforcement',
        body: 'Validates both caller role and current state on every transition from Booked -> Assigned -> In Progress -> Completed -> Paid.',
      },
    ],
    engineerWit:
      'Normalized 17 tables to 3NF purely for the joy of zero duplicate state.',
  },
  {
    id: 'core-craft',
    index: '03',
    title: 'Core Java & ACID Craft',
    tagline: 'Foundations That Keep Production Predictable',
    categoryText: 'Concurrency · Indexing · Clean Architecture · DSA',
    description:
      'Beyond flagship builds—my engineering obsession lives in clean object-oriented design patterns, N+1-free Hibernate fetching, algorithmic problem solving on LeetCode, and human-friendly interactive product polish.',
    imageUrl: '/src/assets/images/project_systems_lab_visual_1794822530372.jpg',
    imageAlt: 'Isometric layered frosted glass database architecture and security rings',
    repoUrl: 'https://github.com/aditya2438',
    stack: ['Java 21', 'OOP & Patterns', 'B-Tree Indexing', 'JUnit 5', 'LeetCode DSA', 'Docker'],
    metrics: [
      { value: '0', label: 'Tolerated race conditions' },
      { value: '3', label: 'Verified certs' },
      { value: '100%', label: 'Clean REST focus' },
    ],
    highlights: [
      'Apply Strategy, Factory, and Repository patterns in Java 21 to keep business services small and unit-testable.',
      'Profile slow SQL queries with EXPLAIN plans and design covering composite B-Tree indexes before scaling traffic.',
      'Practice daily Data Structures, Dynamic Programming, Graphs, and SQL challenges on LeetCode (@kX69jmDS30).',
    ],
    stages: [
      { id: 'dsa', title: 'Algorithmic Speed', highlight: 'Graphs & DP', caption: 'Fast problem decomposition sharpened on LeetCode.' },
      { id: 'acid', title: 'ACID & Locking', highlight: 'Zero Drift', caption: 'Transactional safety around every inventory & money update.' },
      { id: 'tests', title: 'JUnit Confidence', highlight: 'Clean PRs', caption: 'Modular service layers covered by automated unit specs.' },
    ],
    deepDive: [
      {
        title: 'Why I Love Database Internals',
        body: 'Most "slow backend" bugs are unindexed joins or N+1 loops—clean relational modeling solves 80% of performance pain upfront.',
      },
    ],
    engineerWit:
      'Because slick UI animations shine brightest when the backend beneath never drops a beat.',
  },
];

export const EDUCATION: EducationItem[] = [
  {
    period: '2022 – 2026',
    degree: 'Bachelor of Technology (B.Tech) in Computer Science & Engineering',
    institution: 'Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore, MP',
    score: 'CGPA: 6.98',
    details:
      'Core coursework in Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, and Computer Networks.',
  },
  {
    period: '2021 – 2022',
    degree: 'Class XII (Senior Secondary) — Science (PCM)',
    institution: 'Ujjain Public School, Ujjain, MP · MP Board',
    score: 'Science & Mathematics',
    details: 'Physics, Chemistry, and Mathematics foundation with analytical problem solving.',
  },
  {
    period: '2019 – 2020',
    degree: 'Class X (Secondary School)',
    institution: 'Jolly Memorial Mission School, Ujjain, MP · CBSE Board',
    score: 'CBSE Curriculum',
    details: 'Strong academic base in mathematics, science, and computing fundamentals.',
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'nptel',
    title: 'Java Programming & Cloud Computing',
    issuer: 'NPTEL · IIT Kharagpur',
    focus: 'Cloud & Distributed Systems',
    summary:
      'Virtualization, distributed resource scheduling, cloud storage architecture, and scalable backend deployment patterns.',
    skills: ['Cloud Architecture', 'Virtualization', 'Distributed Storage'],
  },
  {
    id: 'oracle-db',
    title: 'Relational Databases & MySQL',
    issuer: 'Oracle',
    focus: '3NF Modeling & ACID',
    summary:
      'Relational schema design, 3NF normalization, composite B-Tree indexing, complex SQL joins, and ACID transaction safety.',
    skills: ['MySQL 8.0', 'B-Tree Indexing', 'ACID Transactions'],
  },
  {
    id: 'java-spec',
    title: 'Java Programming Specialization',
    issuer: 'Oracle Academy & Core Java',
    focus: 'OOP & Concurrency',
    summary:
      'Object-Oriented Design patterns, Collections Framework, multithreading, exception handling, and modern Java 17/21 features.',
    skills: ['Java 21 / 17', 'Collections & Threads', 'Design Patterns'],
  },
];
