
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Globe, Mic, Info, Users, DollarSign, Briefcase, Video, Menu, X, Plus, Trash2, Save, Download, RefreshCw, Upload, Image as ImageIcon, Search, FileText, File, FileSpreadsheet, Home, Link as LinkIcon, Check, ArrowUp, ArrowDown, Wand2, HelpCircle, LogOut, Copy, Workflow, Server, CreditCard, Share2, Calendar, Filter, UserPlus, Gift, FileText as FileIcon, Rocket, Lock, CheckCircle, AlertTriangle, Settings, Key } from 'lucide-react';
import { useConfig } from '../services/configContext';
import { GlassCard, NeonButton, Badge, ImageWithFallback, Modal } from '../components/Shared';
import { DEFAULT_CONFIG } from '../constants';
import { PricingPlan, ProjectTemplate, Partner, CommissionLog } from '../types';

// --- Shared Field Components ---
const StringField = ({ label, value, onChange, textarea = false, type = "text", placeholder }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-cyan outline-none min-h-[100px] text-sm font-sans" placeholder={placeholder} />
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-cyan outline-none text-sm" placeholder={placeholder} />
    )}
  </div>
);

const ImageField = ({ label, value, onChange }: any) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) { alert("File size too large (Max 800KB). Use a URL or compress."); return; }
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-cyan outline-none text-sm mb-2" placeholder="https://..." />
          <div className="flex items-center gap-2"><span className="text-xs text-gray-500">OR</span><label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-bold text-gray-300 transition-colors border border-white/10"><Upload size={12} /> Upload File<input type="file" accept="image/*" className="hidden" onChange={handleFileChange} /></label></div>
        </div>
        <div className="w-20 h-20 bg-black/30 rounded-lg border border-white/10 overflow-hidden flex-shrink-0 relative group"><ImageWithFallback src={value} alt="Preview" className="w-full h-full object-cover" /></div>
      </div>
    </div>
  );
};

const FeatureListEditor = ({ features, onChange, label = "List Items" }: { features: string[], onChange: (f: string[]) => void, label?: string }) => {
  const handleChange = (index: number, value: string) => { const newFeatures = [...features]; newFeatures[index] = value; onChange(newFeatures); };
  const handleAdd = () => onChange([...features, ""]);
  const handleRemove = (index: number) => onChange(features.filter((_, i) => i !== index));
  return (
    <div className="space-y-2 mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      {features.map((feature, idx) => (
        <div key={idx} className="flex gap-2 items-center">
           <input value={feature} onChange={(e) => handleChange(idx, e.target.value)} className="flex-1 bg-black/20 border border-white/10 rounded p-2 text-white text-sm focus:border-brand-cyan outline-none" placeholder="Enter item..." />
           <button onClick={() => handleRemove(idx)} className="text-red-400 hover:text-red-300 p-2 hover:bg-white/5 rounded"><Trash2 size={16} /></button>
        </div>
      ))}
      <button onClick={handleAdd} className="text-xs text-brand-cyan hover:text-white flex items-center gap-1 mt-1 py-1 px-2 hover:bg-brand-cyan/10 rounded transition-colors"><Plus size={14} /> Add Item</button>
    </div>
  );
};

// --- Admin Sub-Components ---

const PricingEditor = ({ config, update }: any) => {
  const pricing = config.pricingSnapshot;
  const updatePricing = (p: any) => update({...config, pricingSnapshot: p});
  const updatePlan = (idx: number, field: string, val: any) => { const newPlans = [...pricing.plans]; newPlans[idx] = { ...newPlans[idx], [field]: val }; updatePricing({ ...pricing, plans: newPlans }); };
  return (
    <div className="space-y-6">
      <GlassCard><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-brand-cyan">Subscription Plans (7 Tiers)</h3><label className="flex items-center gap-2"><input type="checkbox" checked={pricing.enabled} onChange={(e)=>updatePricing({...pricing, enabled: e.target.checked})} className="w-5 h-5 accent-brand-cyan" /> Enabled</label></div></GlassCard>
      <div className="grid grid-cols-1 gap-6">{pricing.plans.map((plan: PricingPlan, idx: number) => (<GlassCard key={idx} className="relative border border-white/5"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><div className="flex justify-between"><h3 className="text-xl font-bold text-brand-cyan mb-4">{plan.name} Plan</h3><label className="flex items-center gap-2 mb-4 bg-white/5 px-2 rounded"><input type="checkbox" checked={plan.recommended} onChange={(e) => updatePlan(idx, 'recommended', e.target.checked)} /> Recommended</label></div><div className="grid grid-cols-2 gap-4"><StringField label="Monthly Price" type="number" value={plan.monthlyPrice} onChange={(v:any)=>updatePlan(idx, 'monthlyPrice', v)} /><StringField label="Yearly Price" type="number" value={plan.yearlyPrice} onChange={(v:any)=>updatePlan(idx, 'yearlyPrice', v)} /><StringField label="Max Projects" type="number" value={plan.maxProjects} onChange={(v:any)=>updatePlan(idx, 'maxProjects', v)} /><StringField label="AI Credits/Mo" type="number" value={plan.aiCredits} onChange={(v:any)=>updatePlan(idx, 'aiCredits', v)} /><StringField label="Extra Credit Price (per 1k)" type="number" value={plan.additionalCreditPrice || 5000} onChange={(v:any)=>updatePlan(idx, 'additionalCreditPrice', v)} /></div></div><div><FeatureListEditor label="Included Features" features={plan.features} onChange={(v: string[]) => updatePlan(idx, 'features', v)} /></div></div></GlassCard>))}</div>
    </div>
  );
};

const ProjectTemplateManager = ({ config, update }: any) => {
    const templates = config.projectTemplates || [];
    const [newTemplate, setNewTemplate] = useState<Partial<ProjectTemplate>>({ name: '', description: '', webhookUrlTemplate: '', aiCreditCost: 10, defaultWorkflowCount: 100, allowedPlanIds: [] });

    const addTemplate = () => {
        if (!newTemplate.name) return;
        const template: ProjectTemplate = {
            id: 'tmpl_' + Date.now(),
            name: newTemplate.name!,
            description: newTemplate.description || '',
            webhookUrlTemplate: newTemplate.webhookUrlTemplate || '',
            aiCreditCost: newTemplate.aiCreditCost || 10,
            defaultWorkflowCount: newTemplate.defaultWorkflowCount || 100,
            allowedPlanIds: newTemplate.allowedPlanIds || []
        };
        update({ ...config, projectTemplates: [...templates, template] });
        setNewTemplate({ name: '', description: '', webhookUrlTemplate: '', aiCreditCost: 10, defaultWorkflowCount: 100, allowedPlanIds: [] });
    };

    const removeTemplate = (id: string) => {
        update({ ...config, projectTemplates: templates.filter((t: ProjectTemplate) => t.id !== id) });
    };

    return (
        <div className="space-y-6">
            <GlassCard>
                <h3 className="text-xl font-bold mb-4 text-brand-cyan">Create Project Template</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StringField label="Template Name" value={newTemplate.name} onChange={(v: string) => setNewTemplate({ ...newTemplate, name: v })} placeholder="e.g. Social Media Bot" />
                    <StringField label="Webhook URL (Template)" value={newTemplate.webhookUrlTemplate} onChange={(v: string) => setNewTemplate({ ...newTemplate, webhookUrlTemplate: v })} placeholder="https://n8n.webhook/..." />
                    <StringField label="Description" value={newTemplate.description} onChange={(v: string) => setNewTemplate({ ...newTemplate, description: v })} textarea />
                    <div className="grid grid-cols-2 gap-4">
                        <StringField label="Credit Cost/Run" type="number" value={newTemplate.aiCreditCost} onChange={(v: number) => setNewTemplate({ ...newTemplate, aiCreditCost: v })} />
                        <StringField label="Default Workflow Count" type="number" value={newTemplate.defaultWorkflowCount} onChange={(v: number) => setNewTemplate({ ...newTemplate, defaultWorkflowCount: v })} />
                    </div>
                </div>
                <NeonButton onClick={addTemplate} className="mt-2"><Plus size={16} /> Add Template</NeonButton>
            </GlassCard>

            <div className="grid grid-cols-1 gap-6">
                {templates.map((t: ProjectTemplate) => (
                    <GlassCard key={t.id} className="relative group">
                        <button onClick={() => removeTemplate(t.id)} className="absolute top-4 right-4 text-red-400 hover:bg-white/10 p-2 rounded"><Trash2 size={16} /></button>
                        <h3 className="font-bold text-lg">{t.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{t.description}</p>
                        <div className="text-xs text-gray-500 font-mono bg-black/30 p-2 rounded mb-2 break-all">{t.webhookUrlTemplate || 'No Webhook Set'}</div>
                        <div className="flex gap-2 flex-wrap">
                            <Badge color="violet">{t.aiCreditCost} Credits/Run</Badge>
                            <Badge color="cyan">{t.defaultWorkflowCount} Runs Max</Badge>
                            <Badge color="cyan">{t.allowedPlanIds.length === 0 ? 'All Plans' : `${t.allowedPlanIds.length} Plans`}</Badge>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

const ClientProjectManager = ({ config, update }: any) => {
    const { currentUser, updateUserProfile } = useConfig();
    if (!currentUser) return (
        <GlassCard className="text-center p-12">
            <Users size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-bold">No Active Client Session</h3>
            <p className="text-gray-400">Please log in as a customer in another tab to manage their live projects here.</p>
        </GlassCard>
    );

    const handleUpdateWebhook = (projectId: string, url: string) => {
        const updatedProjects = currentUser.projects.map(p => p.id === projectId ? { ...p, webhookUrl: url } : p);
        updateUserProfile({ projects: updatedProjects });
    };

    const handleMakeUnique = (projectId: string, currentUrl: string) => {
        if (!currentUrl) return;
        const separator = currentUrl.includes('?') ? '&' : '?';
        const uniqueSuffix = `userId=${currentUser.id}&projectId=${projectId}`;
        if (!currentUrl.includes(uniqueSuffix)) handleUpdateWebhook(projectId, `${currentUrl}${separator}${uniqueSuffix}`);
    };

    return (
        <div className="space-y-6">
            <GlassCard>
                <div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan font-bold text-xl">{currentUser.name.charAt(0)}</div><div><h3 className="text-xl font-bold text-white">Managing: {currentUser.name}</h3><p className="text-gray-400 text-sm">{currentUser.businessName} • {currentUser.email}</p></div></div>
                <h4 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Active Projects & Webhooks</h4>
                {currentUser.projects.length === 0 ? <p className="text-gray-500 italic">This user has no active projects.</p> : (
                    <div className="space-y-4">{currentUser.projects.map(p => (<div key={p.id} className="bg-white/5 p-4 rounded-lg border border-white/10"><div className="flex justify-between items-start mb-3"><div><h5 className="font-bold text-brand-cyan">{p.name}</h5><p className="text-xs text-gray-500 font-mono">ID: {p.id}</p></div><Badge color={p.status === 'active' ? 'green' : 'red'}>{p.status}</Badge></div><div><label className="block text-xs text-gray-400 uppercase font-bold mb-1">N8N Webhook URL</label><div className="flex gap-2"><input value={p.webhookUrl || ''} onChange={(e) => handleUpdateWebhook(p.id, e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white font-mono focus:border-brand-violet outline-none" placeholder="https://n8n.your-instance.com/webhook/..." /><button onClick={() => handleMakeUnique(p.id, p.webhookUrl || '')} className="px-3 py-2 bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan rounded border border-brand-cyan/30 text-xs font-bold transition-colors flex items-center gap-1"><Key size={12}/> Make Unique</button></div></div></div>))}</div>
                )}
            </GlassCard>
        </div>
    );
};

const PaymentSettings = ({ config, update }: any) => { 
    const razorpay = config.razorpay || { enabled: true, keyId: '', keySecret: '', currency: 'INR' }; 
    const handleChange = (field: string, value: any) => { update({ ...config, razorpay: { ...razorpay, [field]: value } }); }; 
    return (
        <div className="space-y-6">
            <GlassCard>
                <h3 className="text-xl font-bold mb-6">Payment Settings</h3>
                <div className="grid grid-cols-1 gap-6">
                    <StringField label="Razorpay Key ID" value={razorpay.keyId} onChange={(v: string) => handleChange('keyId', v)} />
                    <StringField label="Razorpay Secret" type="password" value={razorpay.keySecret} onChange={(v: string) => handleChange('keySecret', v)} />
                    <StringField label="Currency Code" value={razorpay.currency} onChange={(v: string) => handleChange('currency', v)} />
                </div>
            </GlassCard>
            <GlassCard>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Workflow size={20} className="text-brand-cyan"/> Automation Integrations</h3>
                <StringField label="Lead Processing Webhook (n8n/Make)" value={config.leadProcessingWebhook || ''} onChange={(v: string) => update({...config, leadProcessingWebhook: v})} placeholder="https://n8n.your-domain.com/webhook/process-leads" />
            </GlassCard>
        </div>
    ); 
};

const HomeEditor = ({ config, update }: any) => {
  const hero = config.hero;
  const home = config.homePage;

  const updateHero = (field: string, value: any) => update({ ...config, hero: { ...hero, [field]: value } });
  
  return (
    <div className="space-y-8">
      <GlassCard>
        <h3 className="text-xl font-bold mb-4 text-brand-cyan">Hero Section</h3>
        <StringField label="Hero Title" value={config.hero.title} onChange={(v: string) => updateHero('title', v)} />
        <StringField label="Hero Subtitle" value={config.hero.subtitle} onChange={(v: string) => updateHero('subtitle', v)} textarea />
        <ImageField label="Hero Image" value={config.hero.image} onChange={(v: string) => updateHero('image', v)} />
      </GlassCard>
    </div>
  );
};

const PartnerPageEditor = ({ config, update }: any) => {
    const partner = config.partnerPage;
    return (
        <div className="space-y-6">
            <GlassCard>
                <h3 className="text-xl font-bold mb-4 text-brand-cyan">Partner Page Content</h3>
                <StringField label="Headline" value={partner.headline} onChange={(v: string) => update({ ...config, partnerPage: { ...partner, headline: v } })} />
                <StringField label="Subtext" value={partner.subtext} onChange={(v: string) => update({ ...config, partnerPage: { ...partner, subtext: v } })} textarea />
                <StringField label="Application Link" value={partner.applyLink} onChange={(v: string) => update({ ...config, partnerPage: { ...partner, applyLink: v } })} />
            </GlassCard>
        </div>
    );
};

const ApprovalsManager = ({ config, update }: any) => {
    const { approvePartnerWork, rejectPartnerWork } = useConfig();
    const pendingLogs = config.commissionLogs?.filter((l:CommissionLog) => l.status === 'Under Review') || [];

    return (
        <div className="space-y-6">
            <GlassCard>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle size={20} className="text-brand-cyan"/> Pending Partner Approvals</h3>
                {pendingLogs.length === 0 ? <p className="text-gray-500">No pending approvals.</p> : (
                    <div className="space-y-4">
                        {pendingLogs.map((log: CommissionLog) => (
                            <div key={log.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-bold text-white">{log.customerName} Onboarding</h4>
                                    <span className="text-sm font-mono text-brand-cyan">Commission: ₹{log.amount}</span>
                                </div>
                                <div className="bg-black/30 p-3 rounded mb-3 text-sm text-gray-300">
                                    <p className="font-bold text-xs text-gray-500 uppercase mb-1">Proof of Work</p>
                                    <p>{log.proofOfWork?.description}</p>
                                    <div className="flex gap-2 mt-2">
                                        {log.proofOfWork?.checklist.setupDone && <Badge color="violet">Setup Done</Badge>}
                                        {log.proofOfWork?.checklist.trainingDone && <Badge color="violet">Training Done</Badge>}
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button onClick={() => {
                                        const reason = prompt("Enter rejection reason:");
                                        if (reason) rejectPartnerWork(log.id, reason);
                                    }} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded font-bold text-xs border border-red-500/30">Reject</button>
                                    <NeonButton onClick={() => approvePartnerWork(log.id)} className="text-xs py-2 h-auto">Approve & Unlock Payment</NeonButton>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

// --- PARTNER DASHBOARD (ENHANCED WITH WORK ORDERS & LOGOUT) ---
const PartnerDashboard = ({ partner, onLogout }: { partner: Partner, onLogout: () => void }) => {
    const { config, registerPartnerLead, requestPartnerPayout, submitPartnerWork, importPartnerLeads, convertPartnerLead } = useConfig();
    const [subTab, setSubTab] = useState<'overview' | 'work_orders' | 'leads' | 'commissions' | 'payouts' | 'resources'>('overview');
    const logs = config.commissionLogs?.filter(l => l.partnerId === partner.id) || [];
    
    // Work Order State
    const [selectedJob, setSelectedJob] = useState<CommissionLog | null>(null);
    const [proofForm, setProofForm] = useState({ description: '', checklist: { setupDone: false, trainingDone: false, dataMigrated: false } });

    // Other Form State
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', companyName: '' });
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState(0);

    const referralLink = `${window.location.origin}/?ref=${partner.code}`;
    const handleCopy = () => { navigator.clipboard.writeText(referralLink); alert('Referral Link Copied!'); };
    const handleShare = (platform: 'whatsapp' | 'twitter' | 'linkedin') => {
        const text = `Check out InFlow Automation! Use my code ${partner.code} for benefits. ${referralLink}`;
        let url = '';
        if (platform === 'whatsapp') url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        if (platform === 'twitter') url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        if (platform === 'linkedin') url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
        window.open(url, '_blank');
    };

    const handleRegisterLead = (e: React.FormEvent) => {
        e.preventDefault();
        registerPartnerLead(partner.id, leadForm);
        setLeadForm({ name: '', email: '', phone: '', companyName: '' });
        setIsLeadModalOpen(false);
        alert("Lead Registered Successfully!");
    };

    const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            // Simple CSV parser
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            const data = [];
            
            for(let i = 1; i < lines.length; i++) {
                if(!lines[i].trim()) continue;
                const values = lines[i].split(',');
                const entry: any = {};
                headers.forEach((h, idx) => {
                    entry[h] = values[idx]?.trim();
                });
                data.push(entry);
            }
            
            importPartnerLeads(partner.id, data);
        };
        reader.readAsText(file);
    };

    const handleConvertLead = (leadId: string) => {
        const amount = prompt("Enter Commission Amount (Locked):", "5000");
        const plan = prompt("Enter Plan Name:", "Pro Plan");
        if (amount && plan) {
            convertPartnerLead(partner.id, leadId, plan, parseInt(amount));
            alert("Lead converted and commission locked pending execution.");
        }
    };

    const handlePayoutRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (payoutAmount > partner.walletBalance) { alert("Insufficient wallet balance."); return; }
        requestPartnerPayout(partner.id, payoutAmount);
        setIsPayoutModalOpen(false);
        setPayoutAmount(0);
        alert("Payout Request Submitted.");
    };

    const handleSubmitWork = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedJob) {
            submitPartnerWork(partner.id, selectedJob.id, proofForm);
            setSelectedJob(null);
            setProofForm({ description: '', checklist: { setupDone: false, trainingDone: false, dataMigrated: false } });
            alert("Work submitted for review!");
        }
    };

    const NavButton = ({ id, label, icon: Icon }: any) => (
        <button onClick={() => setSubTab(id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${subTab === id ? 'bg-brand-cyan text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <Icon size={16} /> {label}
        </button>
    );

    const actionableLogs = logs.filter(l => l.status === 'Locked' || l.status === 'Changes Requested');

    return (
        <div className="space-y-6">
            {/* Header / Nav */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 border-b border-white/10 pb-4">
                <div className="flex flex-wrap gap-2">
                    <NavButton id="overview" label="Overview" icon={LayoutDashboard} />
                    <NavButton id="work_orders" label="Work Orders" icon={Briefcase} />
                    <NavButton id="leads" label="Prospects CRM" icon={Users} />
                    <NavButton id="commissions" label="Commissions" icon={DollarSign} />
                    <NavButton id="payouts" label="Payouts" icon={CreditCard} />
                    <NavButton id="resources" label="Resources" icon={Download} />
                </div>
                
                {/* LOGOUT BUTTON ADDED HERE */}
                <button 
                    onClick={onLogout} 
                    className="flex items-center gap-2 text-red-400 hover:text-white hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors text-sm font-bold border border-red-500/30 shadow-lg"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>

            {subTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <GlassCard className="p-4 bg-brand-violet/10 border-brand-violet/30"><p className="text-xs text-gray-400 uppercase font-bold">Total Earnings</p><h3 className="text-2xl font-bold text-white">₹ {(partner.totalEarned || 0).toLocaleString()}</h3></GlassCard>
                        <GlassCard className="p-4"><p className="text-xs text-gray-400 uppercase font-bold">Withdrawable</p><h3 className="text-2xl font-bold text-brand-cyan">₹ {(partner.walletBalance || 0).toLocaleString()}</h3></GlassCard>
                        <GlassCard className="p-4 bg-yellow-500/5 border-yellow-500/20"><div className="flex items-center gap-2"><Lock size={14} className="text-yellow-500"/><p className="text-xs text-yellow-500 uppercase font-bold">Locked Balance</p></div><h3 className="text-2xl font-bold text-white">₹ {(partner.lockedBalance || 0).toLocaleString()}</h3></GlassCard>
                        <GlassCard className="p-4"><p className="text-xs text-gray-400 uppercase font-bold">Pending Work</p><h3 className="text-2xl font-bold text-white">{actionableLogs.length}</h3></GlassCard>
                    </div>
                    <GlassCard>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Share2 size={20} className="text-brand-cyan"/> Referral Tools</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase font-bold mb-2">Unique Link</label>
                                <div className="flex gap-2"><input readOnly value={referralLink} className="flex-1 bg-black/30 border border-white/10 rounded p-3 text-white font-mono text-sm" /><button onClick={handleCopy} className="bg-brand-violet/20 hover:bg-brand-violet/40 text-brand-violet border border-brand-violet/30 rounded px-4"><Copy size={18} /></button></div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 uppercase font-bold mb-2">Share On</label>
                                <div className="flex gap-3"><button onClick={() => handleShare('whatsapp')} className="flex-1 py-3 rounded bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-bold">WhatsApp</button><button onClick={() => handleShare('linkedin')} className="flex-1 py-3 rounded bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/30 font-bold">LinkedIn</button></div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}

            {subTab === 'work_orders' && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Pending Onboarding Tasks</h3>
                    {actionableLogs.length === 0 ? <GlassCard className="text-center text-gray-500 py-10">No pending work orders. Good job!</GlassCard> : 
                    actionableLogs.map(log => (
                        <GlassCard key={log.id} className="border-l-4 border-l-yellow-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-lg font-bold text-white">{log.customerName}</h4>
                                    <p className="text-sm text-gray-400">Plan: {log.planName} • Commission: ₹{log.amount}</p>
                                    <div className="mt-2 text-xs bg-yellow-500/10 text-yellow-500 inline-block px-2 py-1 rounded border border-yellow-500/20">
                                        {log.status === 'Changes Requested' ? '⚠️ Revision Needed' : '🔒 Locked - Execution Required'}
                                    </div>
                                    {log.proofOfWork?.adminFeedback && <p className="mt-2 text-sm text-red-400 bg-red-500/10 p-2 rounded">Feedback: {log.proofOfWork.adminFeedback}</p>}
                                </div>
                                <NeonButton onClick={() => setSelectedJob(log)}>Start Onboarding</NeonButton>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {subTab === 'leads' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="text-xl font-bold text-white">Prospects Database</h3>
                        <div className="flex gap-3">
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                <Upload size={16}/> Import CSV
                                <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
                            </label>
                            <NeonButton onClick={() => setIsLeadModalOpen(true)} className="py-2 text-sm"><UserPlus size={16} className="mr-2"/> Add Lead</NeonButton>
                        </div>
                    </div>
                    <GlassCard>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="text-xs uppercase text-gray-500 bg-white/5">
                                    <tr><th className="p-3">Date</th><th className="p-3">Name</th><th className="p-3">Company</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {(partner.leads || []).length === 0 ? <tr><td colSpan={5} className="p-6 text-center text-gray-500">No leads registered yet.</td></tr> : 
                                    partner.leads?.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-white/5">
                                            <td className="p-3">{new Date(lead.dateAdded).toLocaleDateString()}</td>
                                            <td className="p-3 font-bold">{lead.name}<div className="text-xs font-normal text-gray-500">{lead.email}</div></td>
                                            <td className="p-3">{lead.companyName}</td>
                                            <td className="p-3"><Badge color={lead.status === 'Converted' ? 'cyan' : lead.status === 'Lost' ? 'violet' : 'violet'}>{lead.status}</Badge></td>
                                            <td className="p-3">
                                                {lead.status !== 'Converted' && (
                                                    <button onClick={() => handleConvertLead(lead.id)} className="text-xs text-brand-cyan hover:underline font-bold">Convert to Sale</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            )}

            {subTab === 'commissions' && (
                <GlassCard className="animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-xl font-bold mb-4">Commission Report</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="text-xs uppercase text-gray-500 bg-white/5">
                                <tr><th className="p-3">Date</th><th className="p-3">Customer</th><th className="p-3">Plan</th><th className="p-3 text-right">Amount</th><th className="p-3">Status</th><th className="p-3">Next Renewal</th></tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map(log => (
                                    <tr key={log.id} className="hover:bg-white/5">
                                        <td className="p-3">{new Date(log.date).toLocaleDateString()}</td>
                                        <td className="p-3 font-bold text-white">{log.customerName}</td>
                                        <td className="p-3"><Badge color="cyan">{log.planName}</Badge></td>
                                        <td className="p-3 text-right font-mono text-green-400">₹{log.amount.toLocaleString()}</td>
                                        <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${log.status === 'Payable' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{log.status}</span></td>
                                        <td className="p-3 text-gray-400">{log.nextRenewalDate ? new Date(log.nextRenewalDate).toLocaleDateString() : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            )}

            {subTab === 'payouts' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <GlassCard className="flex justify-between items-center bg-brand-violet/10 border-brand-violet/30">
                         <div>
                             <p className="text-sm text-gray-400 mb-1">Withdrawable Balance</p>
                             <h3 className="text-3xl font-bold text-white">₹ {(partner.walletBalance || 0).toLocaleString()}</h3>
                         </div>
                         <NeonButton onClick={() => setIsPayoutModalOpen(true)} disabled={partner.walletBalance < 1000}>Request Payout</NeonButton>
                    </GlassCard>
                    <GlassCard>
                        <h3 className="text-lg font-bold mb-4">Payout History</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="text-xs uppercase text-gray-500 bg-white/5">
                                    <tr><th className="p-3">Date</th><th className="p-3 text-right">Amount</th><th className="p-3">Status</th><th className="p-3">Ref ID</th></tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {(partner.payouts || []).map(pay => (
                                        <tr key={pay.id} className="hover:bg-white/5">
                                            <td className="p-3">{new Date(pay.date).toLocaleDateString()}</td>
                                            <td className="p-3 text-right font-bold text-white">₹{pay.amount.toLocaleString()}</td>
                                            <td className="p-3"><Badge color={pay.status === 'Processed' ? 'cyan' : 'violet'}>{pay.status}</Badge></td>
                                            <td className="p-3 font-mono text-xs">{pay.referenceId || '-'}</td>
                                        </tr>
                                    ))}
                                    {(partner.payouts || []).length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">No payout history.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            )}

            {subTab === 'resources' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
                    {['Sales Pitch Deck', 'Brand Guidelines', 'Social Media Kit', 'Email Templates', 'Case Studies'].map((item, i) => (
                        <GlassCard key={i} className="flex items-start gap-4 hover:border-brand-cyan/50 cursor-pointer group">
                            <div className="p-3 bg-white/5 rounded-lg group-hover:bg-brand-cyan/20 group-hover:text-brand-cyan transition-colors">
                                <FileIcon size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-brand-cyan transition-colors">{item}</h4>
                                <p className="text-xs text-gray-400 mb-2">PDF / ZIP • 2.4 MB</p>
                                <button className="text-xs text-brand-cyan hover:underline flex items-center gap-1">Download <Download size={10}/></button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Modals */}
            <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title="Submit Proof of Work">
                <form onSubmit={handleSubmitWork} className="space-y-4">
                    <div className="bg-white/5 p-4 rounded mb-4">
                        <h4 className="font-bold text-white">{selectedJob?.customerName}</h4>
                        <p className="text-sm text-gray-400">Complete the checklist to unlock ₹{selectedJob?.amount}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 border border-white/10 rounded cursor-pointer hover:bg-white/5">
                            <input type="checkbox" checked={proofForm.checklist.setupDone} onChange={e=>setProofForm({...proofForm, checklist: {...proofForm.checklist, setupDone: e.target.checked}})} className="w-5 h-5 accent-brand-cyan"/> <span>System Configuration & Setup</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-white/10 rounded cursor-pointer hover:bg-white/5">
                            <input type="checkbox" checked={proofForm.checklist.dataMigrated} onChange={e=>setProofForm({...proofForm, checklist: {...proofForm.checklist, dataMigrated: e.target.checked}})} className="w-5 h-5 accent-brand-cyan"/> <span>Data Migration / Template Upload</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-white/10 rounded cursor-pointer hover:bg-white/5">
                            <input type="checkbox" checked={proofForm.checklist.trainingDone} onChange={e=>setProofForm({...proofForm, checklist: {...proofForm.checklist, trainingDone: e.target.checked}})} className="w-5 h-5 accent-brand-cyan"/> <span>Client Training Completed</span>
                        </label>
                    </div>
                    <StringField label="Notes / Proof Link" textarea value={proofForm.description} onChange={(v:string) => setProofForm({...proofForm, description: v})} placeholder="Link to signed document or setup screenshot..." />
                    <NeonButton fullWidth disabled={!proofForm.checklist.setupDone || !proofForm.description}>Submit for Approval</NeonButton>
                </form>
            </Modal>

            <Modal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} title="Register New Lead">
                <form onSubmit={handleRegisterLead} className="space-y-4">
                    <StringField label="Contact Name" value={leadForm.name} onChange={(v:string) => setLeadForm({...leadForm, name: v})} />
                    <StringField label="Company Name" value={leadForm.companyName} onChange={(v:string) => setLeadForm({...leadForm, companyName: v})} />
                    <div className="grid grid-cols-2 gap-4">
                        <StringField label="Email" value={leadForm.email} onChange={(v:string) => setLeadForm({...leadForm, email: v})} />
                        <StringField label="Phone" value={leadForm.phone} onChange={(v:string) => setLeadForm({...leadForm, phone: v})} />
                    </div>
                    <NeonButton fullWidth>Register Lead</NeonButton>
                </form>
            </Modal>
            
            <Modal isOpen={isPayoutModalOpen} onClose={() => setIsPayoutModalOpen(false)} title="Request Payout">
                <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded text-center">
                        <p className="text-gray-400 text-sm">Available Balance</p>
                        <p className="text-2xl font-bold text-white">₹ {partner.walletBalance}</p>
                    </div>
                    <StringField label="Withdrawal Amount" type="number" value={payoutAmount} onChange={(v:number)=>setPayoutAmount(v)} />
                    <NeonButton fullWidth disabled={payoutAmount <= 0 || payoutAmount > partner.walletBalance} onClick={handlePayoutRequest}>Confirm Request</NeonButton>
                    <p className="text-xs text-gray-500 text-center">Minimum withdrawal ₹1000. Processed within 7 days.</p>
                </div>
            </Modal>
        </div>
    );
};

const PartnersManager = ({ config, update }: any) => {
  const partners = config.partners || [];
  const [newPartner, setNewPartner] = useState({ name: '', email: '', type: 'Referral' });
  const addPartner = () => { if (!newPartner.name) return; const code = 'partner_' + Math.random().toString(36).substr(2, 6); const partner = { ...newPartner, id: Date.now().toString(), code, clicks: 0, signups: 0, walletBalance: 0, totalEarned: 0 }; update({ ...config, partners: [...partners, partner] }); setNewPartner({ name: '', email: '', type: 'Referral' }); };
  const removePartner = (id: string) => { update({ ...config, partners: partners.filter((p: any) => p.id !== id) }); };
  return (
    <div className="space-y-6">
      <GlassCard><h3 className="text-xl font-bold mb-4 text-brand-cyan">Add New Partner</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"><StringField label="Name" value={newPartner.name} onChange={(v:string) => setNewPartner({...newPartner, name: v})} placeholder="Partner Name" /><StringField label="Email" value={newPartner.email} onChange={(v:string) => setNewPartner({...newPartner, email: v})} placeholder="partner@email.com" /><div className="mb-4"><label className="block text-sm font-medium text-gray-400 mb-1">Type</label><select value={newPartner.type} onChange={(e) => setNewPartner({...newPartner, type: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-cyan outline-none"><option value="Referral">Referral Partner</option><option value="Channel">Channel Partner</option></select></div></div><NeonButton onClick={addPartner} className="mt-2"><Plus size={16} /> Create Partner</NeonButton></GlassCard>
      <GlassCard><h3 className="text-xl font-bold mb-4">Active Partners</h3><div className="overflow-x-auto"><table className="w-full text-left text-sm text-gray-300"><thead className="text-xs uppercase text-gray-500 bg-white/5"><tr><th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3">Code</th><th className="p-3">Earnings</th><th className="p-3">Actions</th></tr></thead><tbody>{partners.map((p: any) => (<tr key={p.id} className="border-b border-white/5 hover:bg-white/5"><td className="p-3 font-bold">{p.name}<div className="text-xs font-normal text-gray-500">{p.email}</div></td><td className="p-3"><Badge color={p.type === 'Referral' ? 'violet' : 'cyan'}>{p.type}</Badge></td><td className="p-3 font-mono text-brand-cyan">{p.code}</td><td className="p-3">₹{(p.totalEarned || 0).toLocaleString()}</td><td className="p-3 flex gap-2"><button onClick={() => removePartner(p.id)} className="p-2 bg-red-500/10 rounded hover:bg-red-500/20 text-red-500"><Trash2 size={14}/></button></td></tr>))}</tbody></table></div></GlassCard>
    </div>
  );
};

const LoginView = ({ onLogin }: { onLogin: (role: 'admin' | 'partner', email: string) => void }) => { 
    const { config } = useConfig();
    const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false); 
    const handleLogin = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { if (email.includes('partner')) onLogin('partner', email); else if (email.includes('@')) onLogin('admin', email); setLoading(false); }, 1000); }; 
    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
            <GlassCard className="max-w-md w-full">
                <div className="flex justify-center mb-6">
                    {config.logo ? <img src={config.logo} className="h-12"/> : <Rocket size={48} className="text-brand-cyan"/>}
                </div>
                <div className="text-center mb-6"><h2 className="text-2xl font-bold text-white">Portal Login</h2><p className="text-gray-400 text-sm">Admin or Partner Access</p></div>
                <form onSubmit={handleLogin}><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email (admin@... or partner@...)" className="mb-4 w-full bg-black p-3 text-white border border-white/10 rounded outline-none focus:border-brand-cyan"/> <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="mb-4 w-full bg-black p-3 text-white border border-white/10 rounded outline-none focus:border-brand-cyan"/> <NeonButton fullWidth>{loading?'Authenticating...':'Login'}</NeonButton></form>
            </GlassCard>
        </div>
    );
};

export const AdminDashboard = () => {
  const { config, updateConfig, resetConfig } = useConfig();
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authRole, setAuthRole] = useState<'admin' | 'partner' | null>(null);
  const [partnerEmail, setPartnerEmail] = useState('');

  useEffect(() => { const session = sessionStorage.getItem('admin_auth'); if (session === 'true') { setIsAuthenticated(true); setAuthRole('admin'); } }, []);
  useEffect(() => { const session = sessionStorage.getItem('portal_auth'); if (session) { const parsed = JSON.parse(session); setIsAuthenticated(true); setAuthRole(parsed.role); setPartnerEmail(parsed.email); } }, []);

  const handleLogin = (role: 'admin' | 'partner', email: string) => { 
      if (role === 'admin') sessionStorage.setItem('admin_auth', 'true');
      else sessionStorage.setItem('portal_auth', JSON.stringify({ role, email }));
      setAuthRole(role); setPartnerEmail(email); setIsAuthenticated(true);
  };
  
  const handleLogout = () => { sessionStorage.removeItem('admin_auth'); sessionStorage.removeItem('portal_auth'); setIsAuthenticated(false); setAuthRole(null); setActiveTab('home'); };

  if (authRole === 'partner') {
      const currentPartner = config.partners.find(p => p.email === partnerEmail) || config.partners[0];
      return (
          <div className="flex min-h-screen bg-brand-dark">
              <div className="w-64 glass-panel border-r border-white/10 hidden md:flex flex-col p-6"><div className="mb-8"><h2 className="text-xl font-bold text-brand-cyan">Partner Portal</h2><p className="text-sm text-gray-400 mt-1">Welcome, {currentPartner?.name}</p></div><nav className="space-y-2 flex-1"><button className="w-full text-left px-4 py-3 bg-brand-violet/20 text-brand-cyan rounded-lg font-bold">Dashboard</button></nav><button onClick={handleLogout} className="flex items-center gap-2 text-red-400 text-sm hover:text-red-300"><LogOut size={16}/> Logout</button></div>
              <div className="flex-1 p-8 overflow-y-auto">{currentPartner ? <PartnerDashboard partner={currentPartner} onLogout={handleLogout} /> : <div className="text-white">Partner not found.</div>}</div>
          </div>
      );
  }

  const menuItems = [
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
    { id: 'pricing', label: 'Pricing Plans', icon: DollarSign },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'client_projects', label: 'Client Projects', icon: Server },
    { id: 'templates', label: 'Project Templates', icon: Workflow },
    { id: 'partners', label: 'Partner Management', icon: Users },
    { id: 'partner_page', label: 'Partner Page Content', icon: Briefcase },
    { id: 'voice', label: 'Voice Agent', icon: Mic },
    { id: 'webinar', label: 'Webinar', icon: Video },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return <HomeEditor config={config} update={updateConfig} />;
      case 'approvals': return <ApprovalsManager config={config} update={updateConfig} />;
      case 'pricing': return <PricingEditor config={config} update={updateConfig} />;
      case 'payments': return <PaymentSettings config={config} update={updateConfig} />;
      case 'client_projects': return <ClientProjectManager config={config} update={updateConfig} />;
      case 'templates': return <ProjectTemplateManager config={config} update={updateConfig} />;
      case 'partners': return <PartnersManager config={config} update={updateConfig} />;
      case 'partner_page': return <PartnerPageEditor config={config} update={updateConfig} />;
      default: return <div className="text-gray-400">Select a tab</div>;
    }
  };

  if (!isAuthenticated) return <LoginView onLogin={handleLogin} />;

  return (
    <div className="flex min-h-screen bg-brand-dark">
      <div className={`fixed inset-y-0 left-0 w-64 glass-panel border-r border-white/10 z-40 md:sticky md:top-0 md:h-screen flex flex-col bg-brand-dark`}>
        <div className="p-6 font-bold text-brand-cyan text-xl">Admin Portal</div>
        <nav className="flex-1 px-3 space-y-1">{menuItems.map(item => (<button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === item.id ? 'bg-brand-violet text-white' : 'text-gray-400'}`}><item.icon className="mr-3" size={18} /> {item.label}</button>))}</nav>
        <div className="p-6"><button onClick={handleLogout} className="text-red-400 text-sm flex gap-2"><LogOut size={16}/> Logout</button></div>
      </div>
      <div className="flex-1 p-8 overflow-y-auto"><h1 className="text-3xl font-bold text-white mb-8">{menuItems.find(i => i.id === activeTab)?.label}</h1>{renderContent()}</div>
    </div>
  );
};
