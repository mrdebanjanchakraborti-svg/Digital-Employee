
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteConfig, CustomerProfile, PricingPlan, Task, CommissionLog, PartnerLead, PayoutRequest } from '../types';
import { DEFAULT_CONFIG } from '../constants';
import { useLocation } from 'react-router-dom';

interface CartItem extends PricingPlan {
  billingCycle: 'monthly' | 'yearly';
}

interface ConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: SiteConfig) => void;
  resetConfig: () => void;
  loading: boolean;
  currentUser: CustomerProfile | null;
  loginUser: (profile: CustomerProfile) => void;
  logoutUser: () => void;
  cart: CartItem | null;
  addToCart: (plan: PricingPlan, billingCycle: 'monthly' | 'yearly') => void;
  removeFromCart: () => void;
  referralCode: string | null;
  applyCommission: (amount: number, customerName: string) => void;
  registerPartnerLead: (partnerId: string, lead: Omit<PartnerLead, 'id' | 'dateAdded' | 'status'>) => void;
  importPartnerLeads: (partnerId: string, leads: any[]) => void;
  convertPartnerLead: (partnerId: string, leadId: string, planName: string, amount: number) => void;
  requestPartnerPayout: (partnerId: string, amount: number) => void;
  submitPartnerWork: (partnerId: string, commissionId: string, data: any) => void;
  approvePartnerWork: (commissionId: string) => void;
  rejectPartnerWork: (commissionId: string, feedback: string) => void;
  updateUserProfile: (data: Partial<CustomerProfile>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children?: ReactNode }) => {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CustomerProfile | null>(null);
  const [cart, setCart] = useState<CartItem | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const location = useLocation(); 
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    
    if (ref) {
      setReferralCode(ref);
      sessionStorage.setItem('referral_code', ref);
      
      setConfig(prev => {
          const pIndex = prev.partners.findIndex(p => p.code === ref);
          if (pIndex === -1) return prev;
          
          const newPartners = [...prev.partners];
          newPartners[pIndex] = { 
              ...newPartners[pIndex], 
              clicks: newPartners[pIndex].clicks + 1 
          };
          return { ...prev, partners: newPartners };
      });
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('site-config-v2');
    const storedUser = localStorage.getItem('customer_session');
    const storedCart = localStorage.getItem('inflow_cart');
    
    if (stored) {
      try {
        const savedConfig = JSON.parse(stored);
        setConfig({ ...DEFAULT_CONFIG, ...savedConfig, pricingSnapshot: { ...DEFAULT_CONFIG.pricingSnapshot, ...savedConfig.pricingSnapshot }, projectTemplates: savedConfig.projectTemplates || DEFAULT_CONFIG.projectTemplates });
      } catch (e) {
        console.error("Failed to parse config", e);
        setConfig(DEFAULT_CONFIG);
      }
    }
    if (storedUser) { try { setCurrentUser(JSON.parse(storedUser)); } catch (e) { console.error(e); } }
    if (storedCart) { try { setCart(JSON.parse(storedCart)); } catch (e) { console.error(e); } }
    setLoading(false);
  }, []);

  const updateConfig = (newConfig: SiteConfig) => { setConfig(newConfig); localStorage.setItem('site-config-v2', JSON.stringify(newConfig)); };
  const resetConfig = () => { if (window.confirm("Are you sure?")) { setConfig(DEFAULT_CONFIG); localStorage.setItem('site-config-v2', JSON.stringify(DEFAULT_CONFIG)); window.location.reload(); } };
  const loginUser = (profile: CustomerProfile) => { const safeProfile = { ...profile, tasks: profile.tasks || [], walletTransactions: profile.walletTransactions || [], creditLedger: profile.creditLedger || [], creditUsage: profile.creditUsage || [], workflowRuns: profile.workflowRuns || [] }; setCurrentUser(safeProfile); localStorage.setItem('customer_session', JSON.stringify(safeProfile)); };
  const logoutUser = () => { setCurrentUser(null); localStorage.removeItem('customer_session'); };
  const addToCart = (plan: PricingPlan, billingCycle: 'monthly' | 'yearly' = 'monthly') => { const item = { ...plan, billingCycle }; setCart(item); localStorage.setItem('inflow_cart', JSON.stringify(item)); };
  const removeFromCart = () => { setCart(null); localStorage.removeItem('inflow_cart'); };

  // --- EXECUTION-FIRST PARTNER LOGIC ---
  const applyCommission = (amount: number, customerName: string) => {
      const code = referralCode || sessionStorage.getItem('referral_code');
      if (!code) return;

      setConfig(prev => {
          const partnerIndex = prev.partners.findIndex(p => p.code === code);
          if (partnerIndex === -1) return prev; 
          const partner = prev.partners[partnerIndex];
          const rate = partner.type === 'Channel' ? 0.20 : 0.10;
          const commissionAmount = Math.round(amount * rate);

          const updatedPartner = {
              ...partner,
              signups: partner.signups + 1,
              totalEarned: partner.totalEarned + commissionAmount, 
              lockedBalance: (partner.lockedBalance || 0) + commissionAmount
          };

          const newPartners = [...prev.partners];
          newPartners[partnerIndex] = updatedPartner;

          const newLog: CommissionLog = {
              id: 'comm_' + Date.now(),
              partnerId: partner.id,
              date: new Date().toISOString(),
              customerId: currentUser?.id || 'new_cust',
              customerName: customerName,
              planName: cart?.name || 'Subscription',
              amount: commissionAmount,
              type: 'Recurring',
              status: 'Locked',
              nextRenewalDate: new Date(Date.now() + 30*24*60*60*1000).toISOString() 
          };

          const updatedConfig = { ...prev, partners: newPartners, commissionLogs: [newLog, ...(prev.commissionLogs || [])] };
          localStorage.setItem('site-config-v2', JSON.stringify(updatedConfig));
          return updatedConfig;
      });
  };

  const submitPartnerWork = (partnerId: string, commissionId: string, proofData: any) => {
      setConfig(prev => {
          const logs = prev.commissionLogs || [];
          const updatedLogs = logs.map(l => {
              if (l.id === commissionId) {
                  return {
                      ...l,
                      status: 'Under Review' as const,
                      proofOfWork: {
                          submittedAt: new Date().toISOString(),
                          description: proofData.description,
                          checklist: proofData.checklist
                      }
                  };
              }
              return l;
          });
          const updatedConfig = { ...prev, commissionLogs: updatedLogs };
          localStorage.setItem('site-config-v2', JSON.stringify(updatedConfig));
          return updatedConfig;
      });
  };

  const approvePartnerWork = (commissionId: string) => {
      setConfig(prev => {
          const log = prev.commissionLogs?.find(l => l.id === commissionId);
          if (!log) return prev;
          const updatedLogs = prev.commissionLogs!.map(l => l.id === commissionId ? { ...l, status: 'Payable' as const } : l);
          const partnerIdx = prev.partners.findIndex(p => p.id === log.partnerId);
          const newPartners = [...prev.partners];
          if (partnerIdx !== -1) {
              const p = newPartners[partnerIdx];
              newPartners[partnerIdx] = {
                  ...p,
                  lockedBalance: Math.max(0, (p.lockedBalance || 0) - log.amount),
                  walletBalance: p.walletBalance + log.amount
              };
          }
          const updatedConfig = { ...prev, commissionLogs: updatedLogs, partners: newPartners };
          localStorage.setItem('site-config-v2', JSON.stringify(updatedConfig));
          return updatedConfig;
      });
  };

  const rejectPartnerWork = (commissionId: string, feedback: string) => {
      setConfig(prev => {
          const updatedLogs = prev.commissionLogs!.map(l => {
              if (l.id === commissionId) {
                  return {
                      ...l,
                      status: 'Changes Requested' as const,
                      proofOfWork: l.proofOfWork ? { ...l.proofOfWork, adminFeedback: feedback } : undefined
                  };
              }
              return l;
          });
          const updatedConfig = { ...prev, commissionLogs: updatedLogs };
          localStorage.setItem('site-config-v2', JSON.stringify(updatedConfig));
          return updatedConfig;
      });
  };

  const registerPartnerLead = (partnerId: string, lead: Omit<PartnerLead, 'id' | 'dateAdded' | 'status'>) => {
      setConfig(prev => {
          const pIdx = prev.partners.findIndex(p => p.id === partnerId);
          if (pIdx === -1) return prev;
          const newLead: PartnerLead = { ...lead, id: 'lead_' + Date.now(), dateAdded: new Date().toISOString(), status: 'New' };
          const newPartners = [...prev.partners];
          newPartners[pIdx] = { ...newPartners[pIdx], leads: [newLead, ...(newPartners[pIdx].leads || [])] };
          const updated = { ...prev, partners: newPartners };
          localStorage.setItem('site-config-v2', JSON.stringify(updated));
          return updated;
      });
  };

  const importPartnerLeads = async (partnerId: string, leadsData: any[]) => {
      setConfig(prev => {
          const pIdx = prev.partners.findIndex(p => p.id === partnerId);
          if (pIdx === -1) return prev;

          const newLeads: PartnerLead[] = leadsData.map(l => ({
              id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
              name: `${l.first_name || ''} ${l.last_name || ''}`.trim() || l.name || 'Unknown',
              email: l.email || '',
              phone: l.phone || '',
              companyName: l.company_name || l.company || '',
              status: 'New',
              dateAdded: new Date().toISOString(),
              notes: l.custom_field_1 || ''
          }));

          const newPartners = [...prev.partners];
          newPartners[pIdx] = { 
              ...newPartners[pIdx], 
              leads: [...newLeads, ...(newPartners[pIdx].leads || [])] 
          };
          
          const updated = { ...prev, partners: newPartners };
          localStorage.setItem('site-config-v2', JSON.stringify(updated));
          return updated;
      });

      if (config.leadProcessingWebhook) {
          try {
              console.log("Triggering Lead Webhook:", config.leadProcessingWebhook);
              // In production this would be a real POST
              // await fetch(config.leadProcessingWebhook, { method: 'POST', body: JSON.stringify({ partner_id: partnerId, leads: leadsData }) });
              alert("Leads imported and sent to automation engine (Simulated)!");
          } catch (e) {
              console.error("Webhook trigger failed", e);
          }
      } else {
          alert("Leads imported locally. Automation webhook not configured.");
      }
  };

  const convertPartnerLead = (partnerId: string, leadId: string, planName: string, amount: number) => {
      setConfig(prev => {
          const pIdx = prev.partners.findIndex(p => p.id === partnerId);
          if (pIdx === -1) return prev;
          
          const partner = prev.partners[pIdx];
          
          const newLeads = (partner.leads || []).map(l => l.id === leadId ? { ...l, status: 'Converted' as const } : l);
          const lead = partner.leads?.find(l => l.id === leadId);

          const rate = partner.type === 'Channel' ? 0.20 : 0.10;
          const commissionAmount = Math.round(amount * rate);
          
          const newLog: CommissionLog = {
              id: 'comm_' + Date.now(),
              partnerId: partner.id,
              date: new Date().toISOString(),
              customerId: leadId,
              customerName: lead?.name || 'Converted Lead',
              planName: planName,
              amount: commissionAmount,
              type: 'One-time',
              status: 'Locked',
              nextRenewalDate: new Date(Date.now() + 30*24*60*60*1000).toISOString()
          };

          const newPartners = [...prev.partners];
          newPartners[pIdx] = { 
              ...partner, 
              leads: newLeads,
              lockedBalance: (partner.lockedBalance || 0) + commissionAmount,
              signups: partner.signups + 1,
              totalEarned: partner.totalEarned + commissionAmount
          };

          const updated = { 
              ...prev, 
              partners: newPartners, 
              commissionLogs: [newLog, ...(prev.commissionLogs || [])] 
          };
          localStorage.setItem('site-config-v2', JSON.stringify(updated));
          return updated;
      });
  };

  const requestPartnerPayout = (partnerId: string, amount: number) => {
      setConfig(prev => {
          const pIdx = prev.partners.findIndex(p => p.id === partnerId);
          if (pIdx === -1) return prev;
          const partner = prev.partners[pIdx];
          if (partner.walletBalance < amount) return prev;
          const newPayout: PayoutRequest = { id: 'pay_' + Date.now(), date: new Date().toISOString(), amount, status: 'Pending' };
          const newPartners = [...prev.partners];
          newPartners[pIdx] = { ...newPartners[pIdx], walletBalance: partner.walletBalance - amount, payouts: [newPayout, ...(partner.payouts || [])] };
          const updated = { ...prev, partners: newPartners };
          localStorage.setItem('site-config-v2', JSON.stringify(updated));
          return updated;
      });
  };

  const updateUserProfile = (data: Partial<CustomerProfile>) => { if (!currentUser) return; const updated = { ...currentUser, ...data }; setCurrentUser(updated); localStorage.setItem('customer_session', JSON.stringify(updated)); };
  const addTask = (taskData: Omit<Task, 'id'>) => { if (!currentUser) return; const newTask: Task = { ...taskData, id: Date.now().toString(), history: [], dependencies: taskData.dependencies || [] }; const updatedUser = { ...currentUser, tasks: [...(currentUser.tasks || []), newTask] }; setCurrentUser(updatedUser); localStorage.setItem('customer_session', JSON.stringify(updatedUser)); };
  const updateTask = (taskId: string, updates: Partial<Task>) => { if (!currentUser) return; const updatedTasks = (currentUser.tasks || []).map(t => { if (t.id === taskId) { const history = t.history || []; if (updates.status && updates.status !== t.status) { history.push({ timestamp: new Date().toISOString(), field: 'status', oldValue: t.status, newValue: updates.status }); } return { ...t, ...updates, history }; } return t; }); const updatedUser = { ...currentUser, tasks: updatedTasks }; setCurrentUser(updatedUser); localStorage.setItem('customer_session', JSON.stringify(updatedUser)); };
  const deleteTask = (taskId: string) => { if (!currentUser) return; const updatedTasks = (currentUser.tasks || []).filter(t => t.id !== taskId); const updatedUser = { ...currentUser, tasks: updatedTasks }; setCurrentUser(updatedUser); localStorage.setItem('customer_session', JSON.stringify(updatedUser)); };

  return (
    <ConfigContext.Provider value={{ 
      config, updateConfig, resetConfig, loading, currentUser, loginUser, logoutUser, 
      cart, addToCart, removeFromCart, referralCode, applyCommission, registerPartnerLead, importPartnerLeads, convertPartnerLead, requestPartnerPayout, submitPartnerWork, approvePartnerWork, rejectPartnerWork, updateUserProfile,
      addTask, updateTask, deleteTask
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
