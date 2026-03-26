export type AgentSeed = {
  id: string;
  name: string;
  role: string;
  building: string;
  level: number;
  xp: number;
  mood: "calm" | "focused" | "urgent";
  missions: number;
  status: "Idle" | "In Mission" | "Waiting on You";
  portrait: string;
  summary: string;
  buildingLevel: number;
  skillPoints: number;
};

export type MissionSeed = {
  id: string;
  agentId: string;
  title: string;
  objective: string;
  steps: { id: string; text: string; done: boolean }[];
  status: "Active" | "Completed" | "Archived";
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  dueAt?: string;
  rewardXp: number;
  rewardResources: {
    coins: number;
    focus: number;
    intel: number;
    reputation: number;
  };
};

export type SkillNode = {
  id: string;
  name: string;
  description: string;
  costPoints: number;
  prerequisites: string[];
  effects: string[];
};

export const seedAgents: AgentSeed[] = [
  {
    id: "marketing",
    name: "Lyra",
    role: "Marketing Strategist",
    building: "Marketing Tower",
    level: 3,
    xp: 240,
    mood: "focused",
    missions: 2,
    status: "In Mission",
    portrait: "/avatars/marketing.png",
    summary: "Building a launch campaign for the Q4 product.",
    buildingLevel: 2,
    skillPoints: 1
  },
  {
    id: "finance",
    name: "Atlas",
    role: "Finance Architect",
    building: "Finance Vault",
    level: 4,
    xp: 380,
    mood: "calm",
    missions: 1,
    status: "Idle",
    portrait: "/avatars/finance.png",
    summary: "Reviewing runway scenarios and burn optimization.",
    buildingLevel: 3,
    skillPoints: 2
  },
  {
    id: "product",
    name: "Nova",
    role: "Product Lead",
    building: "Product Lab",
    level: 5,
    xp: 520,
    mood: "focused",
    missions: 3,
    status: "Waiting on You",
    portrait: "/avatars/product.png",
    summary: "Synthesizing user research for sprint planning.",
    buildingLevel: 4,
    skillPoints: 2
  },
  {
    id: "engineering",
    name: "Forge",
    role: "Engineering Captain",
    building: "Engineering Forge",
    level: 4,
    xp: 410,
    mood: "urgent",
    missions: 2,
    status: "In Mission",
    portrait: "/avatars/engineering.png",
    summary: "Planning infrastructure upgrades and technical debt.",
    buildingLevel: 3,
    skillPoints: 1
  },
  {
    id: "community",
    name: "Echo",
    role: "Community Steward",
    building: "Community Hall",
    level: 2,
    xp: 120,
    mood: "calm",
    missions: 1,
    status: "Idle",
    portrait: "/avatars/community.png",
    summary: "Designing retention loops and ambassador programs.",
    buildingLevel: 2,
    skillPoints: 1
  },
  {
    id: "legal",
    name: "Quill",
    role: "Legal Advisor",
    building: "Legal Library",
    level: 3,
    xp: 260,
    mood: "focused",
    missions: 0,
    status: "Idle",
    portrait: "/avatars/legal.png",
    summary: "Maintaining contract checklist archives.",
    buildingLevel: 2,
    skillPoints: 1
  }
];

export const seedMissions: MissionSeed[] = [
  {
    id: "m1",
    agentId: "marketing",
    title: "Launch Narrative Kit",
    objective: "Align positioning, messaging, and hero asset copy for the launch.",
    steps: [
      { id: "m1-s1", text: "Draft hero copy variations", done: false },
      { id: "m1-s2", text: "Collect 3 customer proof points", done: false },
      { id: "m1-s3", text: "Ship messaging matrix", done: false }
    ],
    status: "Active",
    priority: "High",
    createdAt: "2024-08-02",
    dueAt: "2024-08-10",
    rewardXp: 120,
    rewardResources: { coins: 40, focus: 12, intel: 20, reputation: 18 }
  },
  {
    id: "m2",
    agentId: "product",
    title: "Sprint 18 Impact Review",
    objective: "Summarize insights from user interviews and prioritize top fixes.",
    steps: [
      { id: "m2-s1", text: "Summarize interview themes", done: false },
      { id: "m2-s2", text: "Rank top 5 issues", done: false },
      { id: "m2-s3", text: "Update roadmap", done: false }
    ],
    status: "Active",
    priority: "Medium",
    createdAt: "2024-08-01",
    rewardXp: 90,
    rewardResources: { coins: 30, focus: 10, intel: 22, reputation: 12 }
  },
  {
    id: "m3",
    agentId: "engineering",
    title: "Stability Upgrade",
    objective: "Reduce p95 latency and ship observability dashboard.",
    steps: [
      { id: "m3-s1", text: "Trace slow endpoints", done: true },
      { id: "m3-s2", text: "Plan infra changes", done: true },
      { id: "m3-s3", text: "Deploy dashboard", done: true }
    ],
    status: "Completed",
    priority: "High",
    createdAt: "2024-07-21",
    rewardXp: 140,
    rewardResources: { coins: 50, focus: 15, intel: 26, reputation: 22 }
  }
];

export const seedSkills: Record<string, SkillNode[]> = {
  marketing: [
    {
      id: "mkt-1",
      name: "Amplified Reach",
      description: "Boost campaign XP by 10%.",
      costPoints: 1,
      prerequisites: [],
      effects: ["+10% XP from Marketing missions"]
    },
    {
      id: "mkt-2",
      name: "Growth Flywheel",
      description: "Unlock 5-step mission suggestions.",
      costPoints: 2,
      prerequisites: ["mkt-1"],
      effects: ["Unlock: Auto-suggest 5 mission steps"]
    },
    {
      id: "mkt-3",
      name: "Influencer Pact",
      description: "Reduce upgrade costs by 5%.",
      costPoints: 2,
      prerequisites: ["mkt-1"],
      effects: ["Reduce upgrade costs by 5%"]
    },
    {
      id: "mkt-4",
      name: "Channel Beacon",
      description: "Reveal top-performing channels.",
      costPoints: 2,
      prerequisites: ["mkt-2"],
      effects: ["Unlock: Channel performance report"]
    },
    {
      id: "mkt-5",
      name: "Narrative Vault",
      description: "Increase intel rewards by 10%.",
      costPoints: 2,
      prerequisites: ["mkt-2"],
      effects: ["+10% intel rewards"]
    },
    {
      id: "mkt-6",
      name: "Momentum Surge",
      description: "Gain +5 focus after Marketing missions.",
      costPoints: 3,
      prerequisites: ["mkt-3"],
      effects: ["+5 focus after Marketing missions"]
    },
    {
      id: "mkt-7",
      name: "Launch Ritual",
      description: "Unlock launch checklist templates.",
      costPoints: 3,
      prerequisites: ["mkt-4"],
      effects: ["Unlock: Launch checklist templates"]
    },
    {
      id: "mkt-8",
      name: "Signal Mesh",
      description: "Boost reputation rewards by 10%.",
      costPoints: 3,
      prerequisites: ["mkt-5"],
      effects: ["+10% reputation rewards"]
    },
    {
      id: "mkt-9",
      name: "Brand Moat",
      description: "Reduce mission cooldowns by 5%.",
      costPoints: 4,
      prerequisites: ["mkt-6"],
      effects: ["Reduce mission cooldowns by 5%"]
    },
    {
      id: "mkt-10",
      name: "Global Spark",
      description: "Unlock high-impact campaign boosts.",
      costPoints: 4,
      prerequisites: ["mkt-7", "mkt-8"],
      effects: ["Unlock: High-impact campaign boosts"]
    }
  ],
  finance: [
    {
      id: "fin-1",
      name: "Runway Clairvoyance",
      description: "Gain +10% coins from Finance missions.",
      costPoints: 1,
      prerequisites: [],
      effects: ["+10% coins from Finance missions"]
    },
    {
      id: "fin-2",
      name: "Pricing Ritual",
      description: "Unlock pricing model templates.",
      costPoints: 2,
      prerequisites: ["fin-1"],
      effects: ["Unlock: Pricing model templates"]
    },
    {
      id: "fin-3",
      name: "Burn Compass",
      description: "+10% focus from Finance missions.",
      costPoints: 2,
      prerequisites: ["fin-1"],
      effects: ["+10% focus from Finance missions"]
    },
    {
      id: "fin-4",
      name: "Budget Shield",
      description: "Reduce upgrade costs by 5%.",
      costPoints: 2,
      prerequisites: ["fin-2"],
      effects: ["Reduce upgrade costs by 5%"]
    },
    {
      id: "fin-5",
      name: "Capital Chorus",
      description: "Unlock investor briefing deck.",
      costPoints: 3,
      prerequisites: ["fin-2"],
      effects: ["Unlock: Investor briefing deck"]
    },
    {
      id: "fin-6",
      name: "Forecast Lens",
      description: "+15% intel rewards from Finance missions.",
      costPoints: 3,
      prerequisites: ["fin-3"],
      effects: ["+15% intel rewards"]
    },
    {
      id: "fin-7",
      name: "Cashflow Rhythm",
      description: "Gain +5 coins daily.",
      costPoints: 3,
      prerequisites: ["fin-4"],
      effects: ["+5 coins daily"]
    },
    {
      id: "fin-8",
      name: "Risk Sentinel",
      description: "Unlock risk register templates.",
      costPoints: 4,
      prerequisites: ["fin-5"],
      effects: ["Unlock: Risk register templates"]
    },
    {
      id: "fin-9",
      name: "Portfolio Matrix",
      description: "Boost mission rewards by 5%.",
      costPoints: 4,
      prerequisites: ["fin-6"],
      effects: ["+5% mission rewards"]
    },
    {
      id: "fin-10",
      name: "Sovereign Vault",
      description: "Unlock strategic reserve protocols.",
      costPoints: 4,
      prerequisites: ["fin-7", "fin-8"],
      effects: ["Unlock: Strategic reserve protocols"]
    }
  ],
  product: [
    {
      id: "prd-1",
      name: "Signal Amplifier",
      description: "+15% intel rewards from Product missions.",
      costPoints: 1,
      prerequisites: [],
      effects: ["+15% intel rewards"]
    },
    {
      id: "prd-2",
      name: "Roadmap Prism",
      description: "Reveal roadmap impact scores.",
      costPoints: 2,
      prerequisites: ["prd-1"],
      effects: ["Unlock: Impact score overlays"]
    },
    {
      id: "prd-3",
      name: "User Echo",
      description: "+10% XP from Product missions.",
      costPoints: 2,
      prerequisites: ["prd-1"],
      effects: ["+10% XP from Product missions"]
    },
    {
      id: "prd-4",
      name: "Discovery Sprint",
      description: "Unlock discovery sprint templates.",
      costPoints: 2,
      prerequisites: ["prd-2"],
      effects: ["Unlock: Discovery sprint templates"]
    },
    {
      id: "prd-5",
      name: "Priority Compass",
      description: "Reduce mission planning time by 5%.",
      costPoints: 3,
      prerequisites: ["prd-2"],
      effects: ["Reduce mission planning time by 5%"]
    },
    {
      id: "prd-6",
      name: "Value Stream",
      description: "+10% coins from Product missions.",
      costPoints: 3,
      prerequisites: ["prd-3"],
      effects: ["+10% coins from Product missions"]
    },
    {
      id: "prd-7",
      name: "Insight Vault",
      description: "Unlock interview synthesis packs.",
      costPoints: 3,
      prerequisites: ["prd-4"],
      effects: ["Unlock: Interview synthesis packs"]
    },
    {
      id: "prd-8",
      name: "Experiment Matrix",
      description: "+10% focus rewards.",
      costPoints: 4,
      prerequisites: ["prd-5"],
      effects: ["+10% focus rewards"]
    },
    {
      id: "prd-9",
      name: "Roadmap Horizon",
      description: "Unlock quarterly roadmap canvas.",
      costPoints: 4,
      prerequisites: ["prd-6"],
      effects: ["Unlock: Quarterly roadmap canvas"]
    },
    {
      id: "prd-10",
      name: "North Star Council",
      description: "Boost mission rewards by 5%.",
      costPoints: 4,
      prerequisites: ["prd-7", "prd-8"],
      effects: ["+5% mission rewards"]
    }
  ],
  engineering: [
    {
      id: "eng-1",
      name: "Latency Guard",
      description: "+10% XP for Engineering missions.",
      costPoints: 1,
      prerequisites: [],
      effects: ["+10% XP from Engineering missions"]
    },
    {
      id: "eng-2",
      name: "System Forge",
      description: "Reduce upgrade costs by 5%.",
      costPoints: 2,
      prerequisites: ["eng-1"],
      effects: ["Reduce upgrade costs by 5%"]
    },
    {
      id: "eng-3",
      name: "Infrastructure Pulse",
      description: "+10% focus rewards.",
      costPoints: 2,
      prerequisites: ["eng-1"],
      effects: ["+10% focus rewards"]
    },
    {
      id: "eng-4",
      name: "Observability Grid",
      description: "Unlock monitoring dashboards.",
      costPoints: 2,
      prerequisites: ["eng-2"],
      effects: ["Unlock: Monitoring dashboards"]
    },
    {
      id: "eng-5",
      name: "Deployment Rite",
      description: "Reduce mission cooldowns by 5%.",
      costPoints: 3,
      prerequisites: ["eng-2"],
      effects: ["Reduce mission cooldowns by 5%"]
    },
    {
      id: "eng-6",
      name: "Optimization Loop",
      description: "+10% intel rewards.",
      costPoints: 3,
      prerequisites: ["eng-3"],
      effects: ["+10% intel rewards"]
    },
    {
      id: "eng-7",
      name: "Architecture Atlas",
      description: "Unlock system design templates.",
      costPoints: 3,
      prerequisites: ["eng-4"],
      effects: ["Unlock: System design templates"]
    },
    {
      id: "eng-8",
      name: "Reliability Ward",
      description: "+10% reputation rewards.",
      costPoints: 4,
      prerequisites: ["eng-5"],
      effects: ["+10% reputation rewards"]
    },
    {
      id: "eng-9",
      name: "Automation Chorus",
      description: "Unlock automation runbooks.",
      costPoints: 4,
      prerequisites: ["eng-6"],
      effects: ["Unlock: Automation runbooks"]
    },
    {
      id: "eng-10",
      name: "Forge Mastery",
      description: "Boost mission rewards by 5%.",
      costPoints: 4,
      prerequisites: ["eng-7", "eng-8"],
      effects: ["+5% mission rewards"]
    }
  ],
  community: [
    {
      id: "com-1",
      name: "Ambassador Bloom",
      description: "+10% reputation rewards.",
      costPoints: 1,
      prerequisites: [],
      effects: ["+10% reputation rewards"]
    },
    {
      id: "com-2",
      name: "Retention Chorus",
      description: "Unlock community pulse report.",
      costPoints: 2,
      prerequisites: ["com-1"],
      effects: ["Unlock: Community pulse report"]
    },
    {
      id: "com-3",
      name: "Onboarding Beacon",
      description: "+10% focus rewards.",
      costPoints: 2,
      prerequisites: ["com-1"],
      effects: ["+10% focus rewards"]
    },
    {
      id: "com-4",
      name: "Event Forge",
      description: "Unlock event planning templates.",
      costPoints: 2,
      prerequisites: ["com-2"],
      effects: ["Unlock: Event planning templates"]
    },
    {
      id: "com-5",
      name: "Ritual Builder",
      description: "Reduce mission planning time by 5%.",
      costPoints: 3,
      prerequisites: ["com-2"],
      effects: ["Reduce mission planning time by 5%"]
    },
    {
      id: "com-6",
      name: "Storyline Loom",
      description: "+10% XP from Community missions.",
      costPoints: 3,
      prerequisites: ["com-3"],
      effects: ["+10% XP from Community missions"]
    },
    {
      id: "com-7",
      name: "Signal Garden",
      description: "+10% intel rewards.",
      costPoints: 3,
      prerequisites: ["com-4"],
      effects: ["+10% intel rewards"]
    },
    {
      id: "com-8",
      name: "Alliance Guild",
      description: "Unlock partner program templates.",
      costPoints: 4,
      prerequisites: ["com-5"],
      effects: ["Unlock: Partner program templates"]
    },
    {
      id: "com-9",
      name: "Trust Beacon",
      description: "+10% coins from Community missions.",
      costPoints: 4,
      prerequisites: ["com-6"],
      effects: ["+10% coins from Community missions"]
    },
    {
      id: "com-10",
      name: "Cultural Summit",
      description: "Boost mission rewards by 5%.",
      costPoints: 4,
      prerequisites: ["com-7", "com-8"],
      effects: ["+5% mission rewards"]
    }
  ],
  legal: [
    {
      id: "leg-1",
      name: "Clause Sentinel",
      description: "+10% XP from Legal missions.",
      costPoints: 1,
      prerequisites: [],
      effects: ["+10% XP from Legal missions"]
    },
    {
      id: "leg-2",
      name: "Contract Beacon",
      description: "Unlock contract checklist templates.",
      costPoints: 2,
      prerequisites: ["leg-1"],
      effects: ["Unlock: Contract checklist templates"]
    },
    {
      id: "leg-3",
      name: "Risk Ledger",
      description: "+10% intel rewards.",
      costPoints: 2,
      prerequisites: ["leg-1"],
      effects: ["+10% intel rewards"]
    },
    {
      id: "leg-4",
      name: "Compliance Archive",
      description: "Unlock compliance playbooks.",
      costPoints: 2,
      prerequisites: ["leg-2"],
      effects: ["Unlock: Compliance playbooks"]
    },
    {
      id: "leg-5",
      name: "Negotiation Glyph",
      description: "Reduce mission planning time by 5%.",
      costPoints: 3,
      prerequisites: ["leg-2"],
      effects: ["Reduce mission planning time by 5%"]
    },
    {
      id: "leg-6",
      name: "Clause Weave",
      description: "+10% focus rewards.",
      costPoints: 3,
      prerequisites: ["leg-3"],
      effects: ["+10% focus rewards"]
    },
    {
      id: "leg-7",
      name: "Policy Sentinel",
      description: "Unlock policy review templates.",
      costPoints: 3,
      prerequisites: ["leg-4"],
      effects: ["Unlock: Policy review templates"]
    },
    {
      id: "leg-8",
      name: "Shielded Terms",
      description: "+10% reputation rewards.",
      costPoints: 4,
      prerequisites: ["leg-5"],
      effects: ["+10% reputation rewards"]
    },
    {
      id: "leg-9",
      name: "Ethics Compass",
      description: "+10% coins from Legal missions.",
      costPoints: 4,
      prerequisites: ["leg-6"],
      effects: ["+10% coins from Legal missions"]
    },
    {
      id: "leg-10",
      name: "Guardian Council",
      description: "Boost mission rewards by 5%.",
      costPoints: 4,
      prerequisites: ["leg-7", "leg-8"],
      effects: ["+5% mission rewards"]
    }
  ]
};

export const seedResources = {
  coins: 220,
  focus: 84,
  intel: 96,
  reputation: 76
};

export const dailyQuests = [
  {
    id: "dq1",
    title: "Refresh GTM Narrative",
    summary: "Craft a two-line narrative for the fall launch.",
    agentId: "marketing"
  },
  {
    id: "dq2",
    title: "Budget Pulse",
    summary: "Draft a 30-day runway snapshot.",
    agentId: "finance"
  },
  {
    id: "dq3",
    title: "Retention Sprint",
    summary: "Outline a weekly community ritual.",
    agentId: "community"
  }
];
