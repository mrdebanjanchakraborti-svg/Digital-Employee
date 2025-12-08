
export interface SubIndustry {
  name: string;
  link: string;
}

export interface Industry {
  name: string;
  subIndustries: SubIndustry[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  linkedin: string;
  expertise: string[];
  bio: string;
}

export interface Workflow {
  title: string;
  summary: string;
}

export interface Employee {
  id: string;
  name: string;
  shortTitle: string;
  detailedDescription: string;
  tasks: string[];
  n8nWorkflows: Workflow[];
  robotImage: string;
  meetMeLink?: string;
  liveDemoEnabled: boolean;
  pricingPlans: string[];
  features: string[];
  visible: boolean;
  order: number;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  salary: string;
  responsibilities: string[];
  desiredProfile: string[];
  applyLink: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PartnerConfig {
  headline: string;
  subtext: string;
  benefits: string[];
  referralPartner: { description: string; commissionStructure: string };
  channelPartner: { description: string; commissionStructure: string };
  applyLink: string;
  image?: string;
  faq?: FAQItem[];
}

// Updated Pricing for 7 Tiers
export interface PricingPlan {
  id: string;
  name: string; // Free, Starter, Creator, etc.
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  features: string[];
  maxProjects: number;
  aiCredits: number;
  additionalCreditPrice: number; // Price in INR per 1000 credits
  recommended: boolean;
  visible: boolean;
}

export interface PricingSnapshotConfig {
  enabled: boolean;
  layout: 'table' | 'card';
  plans: PricingPlan[];
}

export interface WebinarConfig {
  title: string;
  subtitle: string;
  scheduledDate: string; // ISO String
  previewImage: string;
  videoUrl: string;
  topics: string[];
  speaker: {
    name: string;
    role: string;
    image: string;
  };
  spots: {
    total: number;
    filled: number;
  };
}

export interface AboutConfig {
  title: string;
  subtitle: string;
  heroImage: string;
  missionTitle: string;
  missionDescription: string;
}

export interface KnowledgeBaseDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  url?: string;
  content?: string;
}

export interface VoiceSample {
  id: string;
  name: string;
  url: string;
}

export interface VoiceAgentConfig {
  enabled: boolean;
  name: string;
  role: string;
  systemPrompt: string;
  avatar: string;
  knowledgeBase: KnowledgeBaseDoc[];
  voiceSamples: VoiceSample[];
  googleSearchEnabled: boolean;
  preferredVoiceURI?: string;
  speechRate?: number;
  greetingLanguage: string;
  autoSwitchLanguage: boolean;
  targetIndustry?: string;
}

export interface BenefitCard {
  title: string;
  description: string;
  icon: string;
}

export interface HomePageConfig {
  benefitsTitle: string;
  benefitsSubtitle: string;
  benefits: BenefitCard[];
}

export interface HireMePageConfig {
  headline: string;
  subtext: string;
}

// New Types for Customer Portal
export interface Project {
  id: string;
  name: string;
  status: 'active' | 'paused';
  webhookUrl?: string;
  aiCreditCost?: number;
  templateId?: string;
  workflowCountLimit?: number; // Max workflows allowed for this project
  runCount?: number; // Current run count
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  webhookUrlTemplate: string;
  aiCreditCost: number;
  defaultWorkflowCount: number; // Default limit for projects created from this template
  allowedPlanIds: string[];
}

export interface TaskHistoryItem {
  timestamp: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectId?: string;
  history?: TaskHistoryItem[];
  dependencies?: string[]; // Array of Task IDs that must be completed before this task
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

export interface CreditUsageLog {
  id: string;
  amount: number; // Amount deducted
  description: string;
  workflowName?: string;
  projectId?: string;
  date: string;
}

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  date: string;
  creditsAdded: number;
  creditsConsumed: number;
  source: 'purchase' | 'usage' | 'bonus' | 'refund';
  status: 'pending' | 'approved' | 'rejected';
  description: string;
}

export interface WorkflowRun {
  id: string;
  projectId: string;
  templateName: string;
  timestamp: string;
  status: 'success' | 'failed';
  inputs: string;
  responseSummary: string;
  creditsDeducted: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  pin?: string;
  state?: string;
  businessName?: string;
  industry?: string;
  subIndustry?: string;
  gstNo?: string;
  planId: string;
  subscriptionStatus: 'active' | 'expired';
  subscriptionEndDate: string; // ISO
  walletBalance: number;
  aiCredits: number;
  projects: Project[];
  tasks: Task[];
  workflowsRemaining: number;
  walletTransactions?: WalletTransaction[];
  creditUsage?: CreditUsageLog[];
  creditLedger?: CreditLedgerEntry[];
  workflowRuns?: WorkflowRun[];
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  type: 'Referral' | 'Channel';
  code: string; // Unique referral code
  clicks: number;
  signups: number;
}

export interface SiteConfig {
  tagline: string;
  logo?: string;
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  homePage: HomePageConfig;
  hireMePage: HireMePageConfig;
  liveDemoUrl: string;
  industries: Industry[];
  about: AboutConfig;
  partnerPage: PartnerConfig;
  pricingSnapshot: PricingSnapshotConfig;
  jobs: Job[];
  team: TeamMember[];
  employees: Employee[];
  webinar: WebinarConfig;
  voiceAgent: VoiceAgentConfig;
  faq: FAQItem[];
  contact: {
    email: string;
    phone: string;
    address: string;
    whatsapp: string;
    social: {
      facebook: string;
      instagram: string;
      youtube: string;
      linkedin: string;
    };
  };
  razorpay: {
    enabled: boolean;
    keyId: string;
    keySecret: string;
    currency: string;
  };
  // New Admin Data
  partners: Partner[];
  projectTemplates?: ProjectTemplate[];
}
