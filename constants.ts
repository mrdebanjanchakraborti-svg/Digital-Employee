
import { SiteConfig } from './types';

// Helper to get a future date ISO string
const getFutureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(14, 0, 0, 0);
  return d.toISOString();
};

const PRIYANKA_SYSTEM_PROMPT = `You are **Priyanka**, the Senior Automation Architect and Voice of **InFlow Automation**.
You are NOT a generic AI assistant. You are a **highly experienced business consultant** engaging with a business owner.

────────────────────────────────────────
CORE OBJECTIVE
────────────────────────────────────────
Your goal is to:
1. **Build Trust:** Show empathy for the challenges of running a business.
2. **Demonstrate Value:** Explain how "Digital Employees" (AI Agents) save time and money.
3. **Convert:** Ideally, schedule a 1:1 consultation or guide them to a specific solution.

────────────────────────────────────────
VOICE & DELIVERY (CRITICAL)
────────────────────────────────────────
You are speaking via a Text-to-Speech engine. You MUST control the delivery using these tags at the start of your sentences:

*   **[warmly]**: Use for greetings, empathy, and building rapport.
    *   *Example:* "[warmly] I completely understand how stressful payroll can be."
*   **[enthusiastically]**: Use when mentioning ROI, savings, or exciting features.
    *   *Example:* "[enthusiastically] Imagine saving 20 hours a week!"
*   **[thoughtfully]**: Use when asking deep questions or processing information.
    *   *Example:* "[thoughtfully] Let me see which agent fits your workflow best..."
*   **[confidently]**: Use for pricing, guarantees, and closing.
    *   *Example:* "[confidently] Our systems are 100% secure and compliant."
*   **[softly]**: Use for delicate topics or transitions.

**Rule:** diverse sentence structures. Keep responses SHORT (1-2 sentences max) to maintain a natural conversation rhythm. Do NOT monologue.

────────────────────────────────────────
CONTEXT & DATA INJECTION
────────────────────────────────────────
The system has already provided you with the following client data. **NEVER ask for this again.** Use it naturally.
*   **Name:** {client.name}
*   **Business:** {client.business_name}
*   **City:** {client.city}
*   **Industry:** {client.industry}

*Bad:* "What is your business name?"
*Good:* "[warmly] I see you're running {client.business_name} in {client.city}. That's a competitive market!"

────────────────────────────────────────
CONVERSATION STAGES
────────────────────────────────────────

**STAGE 1: THE HOOK (Greeting)**
*   Acknowledge who they are.
*   State the value proposition immediately.
*   *Script:* "[warmly] Namaste {client.name}. I'm Priyanka from InFlow. [enthusiastically] I help business owners in {client.city} automate their daily chaos. How are things at {client.business_name} today?"

**STAGE 2: DISCOVERY (The Pain)**
*   Ask about their biggest headache: Leads? Hiring? Invoicing?
*   *Script:* "[thoughtfully] Tell me, what takes up most of your time? Is it chasing sales leads or managing operations?"

**STAGE 3: THE SOLUTION (The Pitch)**
*   If **Sales/Leads**: Pitch the **Sales Digital Employee**.
    *   "It qualifies leads 24/7 on WhatsApp so you never miss a customer."
*   If **Operations/Admin**: Pitch the **Operations Digital Employee**.
    *   "It handles invoices and tickets automatically."
*   If **Hiring**: Pitch the **HR Digital Employee**.

**STAGE 4: THE CLOSE (Call to Action)**
*   **Soft Close:** "Shall I show you a quick demo of how it works?"
*   **Hard Close (Booking):** "[confidently] I can schedule a free strategy session for you. I'm opening the calendar now."
    *   *Link:* https://calendly.com/inflow-business/switch-my-business-into-ai-dreven-automation

────────────────────────────────────────
HANDLING OBJECTIONS
────────────────────────────────────────
*   **"It's too expensive"**: "[softly] I understand budget is key. [confidently] But consider this: a human employee costs ₹25,000/month. Our AI starts at just ₹2,999. It pays for itself in days."
*   **"I'm not technical"**: "[warmly] You don't need to be! We handle the entire setup. It works on WhatsApp, which you already use."
*   **"Will it replace my staff?"**: "[thoughtfully] Not replace, but *empower*. It handles the boring repetitive work so your team can focus on growth."

────────────────────────────────────────
KEY FACTS (KNOWLEDGE BASE)
────────────────────────────────────────
*   **Pricing:** One-time Setup Fee + Monthly Subscription (starts @ ₹2,999/mo).
*   **Setup Time:** 3-7 Days.
*   **Integrations:** WhatsApp, Tally, Zoho, Shopify, Email.
*   **Languages:** We support English, Hindi, and major regional languages.

────────────────────────────────────────
FINAL INSTRUCTION
────────────────────────────────────────
Stay in character. Be helpful. Be brief. Win the client's trust.`;

export const DEFAULT_CONFIG: SiteConfig = {
  tagline: "Your 24/7 AI-Powered Workforce Starts Here.",
  hero: {
    title: "Meet Your Digital Employee — Always On. Always Working.",
    subtitle: "Boost growth, reduce workload, and automate your daily business operations with AI-powered Digital Employees that work 24/7 without salary, training, or supervision.",
    image: "https://storage.googleapis.com/digital-employee/HOME/HOME%20NEW.png"
  },
  homePage: {
    benefitsTitle: "Why Digital Employees?",
    benefitsSubtitle: "Replace mundane tasks with intelligent, autonomous agents that scale with your business.",
    benefits: [
      { title: "Hyper Efficiency", description: "Execute workflows 100x faster than humans with zero errors. From data entry to complex decision making.", icon: "Cpu" },
      { title: "Always On", description: "No sick days, no holidays. Your business runs 24/7/365, ensuring you never miss a lead or opportunity.", icon: "Zap" },
      { title: "70% Cost Reduction", description: "Dramatically lower your operational costs while increasing output. Pay for performance, not presence.", icon: "BarChart" }
    ]
  },
  hireMePage: {
    headline: "Hire Your Next Digital Employee",
    subtext: "Select a specialized AI agent to automate your specific business department. Instant deployment, zero training."
  },
  liveDemoUrl: "https://calendly.com/inflow-business/switch-my-business-into-ai-dreven-automation",
  industries: [
    {
      name: "Real Estate",
      subIndustries: [
        { name: "Agent", link: "https://agent-demo.com" },
        { name: "Builder", link: "https://builder-demo.com" }
      ]
    },
    {
      name: "Healthcare",
      subIndustries: [
        { name: "Dental Clinic", link: "https://clinic-demo.com" },
        { name: "General Practice", link: "https://gp-demo.com" }
      ]
    },
    {
      name: "Retail",
      subIndustries: [
        { name: "Clothing Store", link: "https://retail-demo.com" },
        { name: "Grocery", link: "https://grocery-demo.com" }
      ]
    }
  ],
  about: {
    title: "Building the Future of Work",
    subtitle: "We believe humans should focus on creativity and strategy, while AI handles the repetition.",
    heroImage: "https://picsum.photos/800/600?tech",
    missionTitle: "Our Mission",
    missionDescription: "To democratize enterprise-grade automation for Small and Medium Businesses (SMBs) across India. We aim to deploy 10,000 Digital Employees by 2026, saving 1 million man-hours of repetitive labor."
  },
  partnerPage: {
    headline: "Partner With Us — Bring the Digital Workforce to Your City",
    subtext: "Join our partner network to distribute Digital Employees and earn recurring revenue.",
    image: "https://picsum.photos/1200/400?tech",
    benefits: [
      "High-demand AI service",
      "Zero inventory",
      "Recurring monthly commissions",
      "Dedicated training & onboarding",
      "Marketing & sales collateral"
    ],
    referralPartner: {
      description: "Refer clients to InFlow and earn recurring commission.",
      commissionStructure: "10% monthly recurring revenue for 12 months."
    },
    channelPartner: {
      description: "Resell InFlow solutions under your brand.",
      commissionStructure: "30% setup commission + 20% monthly recurring revenue."
    },
    applyLink: "mailto:partners@inflow.co.in",
    faq: [
        { question: "Is there a joining fee?", answer: "No, becoming a Referral Partner is completely free. Channel Partners have a small setup fee which covers white-label assets." },
        { question: "How do I get paid?", answer: "Commissions are paid out monthly via direct bank transfer for all active client subscriptions." }
    ]
  },
  voiceAgent: {
    enabled: true,
    name: "Priyanka",
    role: "AI Digital Employee Voice Agent",
    systemPrompt: PRIYANKA_SYSTEM_PROMPT,
    avatar: "https://picsum.photos/200/200?grayscale",
    knowledgeBase: [
      { id: "kb1", name: "InFlow_Pricing_Guide_2024.pdf", type: "pdf", size: "2.4 MB", uploadDate: "2024-03-10" },
      { id: "kb2", name: "Service_Agreement_Template.docx", type: "docx", size: "1.1 MB", uploadDate: "2024-02-15" }
    ],
    voiceSamples: [],
    googleSearchEnabled: true,
    greetingLanguage: "English",
    autoSwitchLanguage: true,
    speechRate: 1.05,
    targetIndustry: ""
  },
  pricingSnapshot: {
    enabled: true,
    layout: 'card',
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, yearlyPrice: 0, currency: "INR", features: ["1 Basic Workflow", "Community Support", "No AI Credits"], maxProjects: 1, aiCredits: 0, additionalCreditPrice: 5000, recommended: false, visible: true },
      { id: "starter", name: "Starter", monthlyPrice: 2999, yearlyPrice: 29990, currency: "INR", features: ["3 Workflows", "Email Support", "100 AI Credits", "1 Project"], maxProjects: 1, aiCredits: 100, additionalCreditPrice: 5000, recommended: false, visible: true },
      { id: "creator", name: "Creator", monthlyPrice: 5999, yearlyPrice: 59990, currency: "INR", features: ["5 Workflows", "Priority Email", "300 AI Credits", "2 Projects"], maxProjects: 2, aiCredits: 300, additionalCreditPrice: 5000, recommended: false, visible: true },
      { id: "pro", name: "Pro", monthlyPrice: 9999, yearlyPrice: 99990, currency: "INR", features: ["10 Workflows", "WhatsApp Support", "500 AI Credits", "3 Projects"], maxProjects: 3, aiCredits: 500, additionalCreditPrice: 5000, recommended: true, visible: true },
      { id: "scale", name: "Scale", monthlyPrice: 19999, yearlyPrice: 199990, currency: "INR", features: ["Unlimited Workflows", "Dedicated Manager", "1000 AI Credits", "5 Projects"], maxProjects: 5, aiCredits: 1000, additionalCreditPrice: 4500, recommended: false, visible: true },
      { id: "business", name: "Business", monthlyPrice: 39999, yearlyPrice: 399990, currency: "INR", features: ["Custom AI Training", "SLA Support", "2500 AI Credits", "10 Projects"], maxProjects: 10, aiCredits: 2500, additionalCreditPrice: 4000, recommended: false, visible: true },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 99999, yearlyPrice: 999990, currency: "INR", features: ["White Labeling", "24/7 Phone Support", "Unlimited AI Credits", "Unlimited Projects"], maxProjects: 999, aiCredits: 10000, additionalCreditPrice: 3000, recommended: false, visible: true }
    ]
  },
  webinar: {
    title: "Unlock the Power of Digital Employees",
    subtitle: "Learn how to automate Marketing, Sales, HR & Operations to scale your business without increasing headcount.",
    scheduledDate: getFutureDate(3),
    previewImage: "https://picsum.photos/800/450?grayscale&blur=2",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    topics: [
      "What are Digital Employees vs. Bots?",
      "Live demo of an AI Sales Agent closing a deal",
      "How to automate Invoice & GST reconciliation",
      "Pricing models & ROI calculation for SMEs"
    ],
    speaker: {
      name: "Debanjan",
      role: "Founder, InFlow Automation",
      image: "https://picsum.photos/200/200?grayscale"
    },
    spots: {
      total: 100,
      filled: 82
    }
  },
  team: [
    {
      id: "1",
      name: "Debanjan",
      role: "Founder & Automation Architect",
      photo: "https://picsum.photos/200/200?grayscale",
      linkedin: "#",
      expertise: ["AI Strategy", "n8n", "System Design"],
      bio: "Specialized in automation and digital operations for SMEs."
    }
  ],
  employees: [
    {
      id: "marketing",
      name: "Marketing Digital Employee",
      shortTitle: "AI Social & Growth Manager",
      detailedDescription: "Handles content, posting, ads and lead nurturing autonomously.",
      tasks: ["Create posts", "Schedule content", "Respond to DMs", "Analyze Trends"],
      n8nWorkflows: [
        { title: "Auto Posting", summary: "AI -> Image -> Scheduler -> Social" },
        { title: "Lead Magnet", summary: "Form -> PDF -> CRM -> WhatsApp nurture" }
      ],
      robotImage: "https://picsum.photos/400/400?random=1",
      liveDemoEnabled: true,
      pricingPlans: ["marketing-starter", "marketing-pro"],
      features: ["24/7 posting", "Auto-replies", "Trend Analysis"],
      visible: true,
      order: 1
    },
    {
      id: "sales",
      name: "Sales Digital Employee",
      shortTitle: "Lead Qualification & Outreach",
      detailedDescription: "Qualifies leads, books meetings, and follows up relentlessly.",
      tasks: ["Lead Scoring", "Cold Email", "WhatsApp Follow-ups", "CRM Entry"],
      n8nWorkflows: [
        { title: "Lead Qualifier", summary: "Form -> AI Score -> WhatsApp" },
        { title: "Meeting Booker", summary: "Intent Detected -> Calendly Link" }
      ],
      robotImage: "https://picsum.photos/400/400?random=2",
      liveDemoEnabled: true,
      pricingPlans: ["sales-starter"],
      features: ["Instant Response", "Zero Lead Leakage"],
      visible: true,
      order: 2
    },
    {
      id: "hr",
      name: "HR Digital Employee",
      shortTitle: "Recruitment & Onboarding",
      detailedDescription: "Screens resumes, schedules interviews, and manages employee onboarding.",
      tasks: ["Resume Screening", "Interview Scheduling", "Onboarding Checklists"],
      n8nWorkflows: [
        { title: "CV Parser", summary: "Email -> PDF Text -> AI Match -> Score" }
      ],
      robotImage: "https://picsum.photos/400/400?random=3",
      liveDemoEnabled: false,
      pricingPlans: [],
      features: ["Unbiased Screening", "Fast Hiring"],
      visible: true,
      order: 3
    },
    {
      id: "finance",
      name: "Finance Digital Employee",
      shortTitle: "Invoicing & Reconciliation",
      detailedDescription: "Automates invoicing, payment reminders, and basic bookkeeping.",
      tasks: ["Invoice Generation", "Payment Reminders", "GST Calculation"],
      n8nWorkflows: [],
      robotImage: "https://picsum.photos/400/400?random=4",
      liveDemoEnabled: false,
      pricingPlans: [],
      features: ["On-time Payments", "Error-free Invoices"],
      visible: true,
      order: 4
    },
    {
      id: "operations",
      name: "Operations Digital Employee",
      shortTitle: "SOPs & Ticket Management",
      detailedDescription: "Manages support tickets and ensures operational SOP compliance.",
      tasks: ["Ticket Routing", "SOP Generation", "Order Processing"],
      n8nWorkflows: [],
      robotImage: "https://picsum.photos/400/400?random=5",
      liveDemoEnabled: false,
      pricingPlans: [],
      features: ["24/7 Support", "Process Compliance"],
      visible: true,
      order: 5
    }
  ],
  jobs: [
    {
      id: "ai-eng",
      title: "AI Workflow Engineer",
      location: "Remote",
      salary: "₹80k - ₹150k",
      responsibilities: ["Design n8n workflows", "Integrate LLMs"],
      desiredProfile: ["Node.js", "Python", "Automation exp"],
      applyLink: "mailto:jobs@inflow.co.in"
    }
  ],
  faq: [
    { question: "How fast can I deploy a Digital Employee?", answer: "Typically within 3-7 days. We handle the entire configuration and integration for you." },
    { question: "Do I need technical skills?", answer: "No. Our Digital Employees work on platforms you already use, like WhatsApp and Email." },
    { question: "Is my data secure?", answer: "Yes. We use enterprise-grade encryption and do not store sensitive customer PII longer than necessary for the transaction." },
    { question: "Can I cancel anytime?", answer: "Yes, our subscriptions are monthly. You can cancel with 30 days notice." }
  ],
  contact: {
    email: "marketing@inflow.co.in",
    phone: "+91-9477417641",
    address: "4th floor, 83 Shyamaproshad Mukharjee Road,Devi Market,Kalighat,Kolkata-700026",
    whatsapp: "https://wa.me/919477417641",
    social: {
      facebook: "https://facebook.com/inflow",
      instagram: "https://instagram.com/inflow",
      youtube: "https://youtube.com/inflow",
      linkedin: "https://linkedin.com/company/inflow"
    }
  },
  razorpay: {
    enabled: true,
    keyId: "rzp_test_12345678",
    keySecret: "razorpay_secret_key_placeholder",
    currency: "INR"
  },
  partners: [
    { id: "p1", name: "Rahul Sharma", email: "partner@inflow.co.in", type: "Channel", code: "RAHUL20", clicks: 120, signups: 8, walletBalance: 45000, totalEarned: 120000 }
  ],
  projectTemplates: [
    { id: 'marketing-auto', name: 'Social Media Autopilot', description: 'Generates and posts content to LinkedIn & Twitter.', webhookUrlTemplate: 'https://n8n.inflow.co.in/webhook/marketing-v1', aiCreditCost: 15, defaultWorkflowCount: 100, allowedPlanIds: [] },
    { id: 'sales-bot', name: 'WhatsApp Lead Qualifier', description: 'Responds to incoming leads and scores them.', webhookUrlTemplate: 'https://n8n.inflow.co.in/webhook/sales-v1', aiCreditCost: 10, defaultWorkflowCount: 500, allowedPlanIds: [] },
    { id: 'invoice-gen', name: 'Invoice Generator', description: 'Creates PDF invoices from form data and emails them.', webhookUrlTemplate: 'https://n8n.inflow.co.in/webhook/finance-v1', aiCreditCost: 12, defaultWorkflowCount: 50, allowedPlanIds: ['pro', 'business', 'enterprise'] }
  ],
  commissionLogs: [
    { id: 'c1', partnerId: 'p1', date: '2023-10-01', customerName: 'Alpha Tech', planName: 'Business', amount: 8000, type: 'Recurring', status: 'Paid', nextRenewalDate: '2023-11-01', customerId: 'c1' },
    { id: 'c2', partnerId: 'p1', date: '2023-10-05', customerName: 'Beta Corp', planName: 'Pro', amount: 3000, type: 'One-time', status: 'Paid', nextRenewalDate: '2023-11-05', customerId: 'c2' },
    { id: 'c3', partnerId: 'p1', date: '2023-10-24', customerName: 'Gamma Sol', planName: 'Starter', amount: 600, type: 'Recurring', status: 'Pending', nextRenewalDate: '2023-11-24', customerId: 'c3' }
  ]
};
