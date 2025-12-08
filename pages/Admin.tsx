
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LayoutDashboard, Globe, Mic, Info, Users, DollarSign, Briefcase, Video, Menu, X, Plus, Trash2, Save, Download, RefreshCw, Upload, Image as ImageIcon, Search, FileText, File, FileSpreadsheet, Home, Link as LinkIcon, Check, ArrowUp, ArrowDown, Wand2, HelpCircle, LogOut, Copy, Workflow, Server, CreditCard } from 'lucide-react';
import { useConfig } from '../services/configContext';
import { GlassCard, NeonButton, Badge, ImageWithFallback } from '../components/Shared';
import { DEFAULT_CONFIG } from '../constants';
import { PricingPlan, ProjectTemplate } from '../types';

// ... (Existing StringField, ImageField, FeatureListEditor components)
const StringField = ({ label, value, onChange, textarea = false, type = "text", placeholder }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    {textarea ? (
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-cyan outline-none min-h-[100px] text-sm font-sans"
        placeholder={placeholder}
      />
    ) : (
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} 
        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-cyan outline-none text-sm"
        placeholder={placeholder}
      />
    )}
  </div>
);

const ImageField = ({ label, value, onChange }: any) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) { 
        alert("File size too large for browser storage (Max 800KB). Please use a URL or compress the image.");
        return;
      }
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
          <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-cyan outline-none text-sm mb-2"
            placeholder="https://..."
          />
          <div className="flex items-center gap-2">
             <span className="text-xs text-gray-500">OR</span>
             <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-bold text-gray-300 transition-colors border border-white/10">
               <Upload size={12} /> Upload File
               <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
             </label>
          </div>
        </div>
        <div className="w-20 h-20 bg-black/30 rounded-lg border border-white/10 overflow-hidden flex-shrink-0 relative group">
           <ImageWithFallback src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

const FeatureListEditor = ({ features, onChange, label = "List Items" }: { features: string[], onChange: (f: string[]) => void, label?: string }) => {
  const handleChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    onChange(newFeatures);
  };
  const handleAdd = () => onChange([...features, ""]);
  const handleRemove = (index: number) => onChange(features.filter((_, i) => i !== index));

  return (
    <div className="space-y-2 mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      {features.map((feature, idx) => (
        <div key={idx} className="flex gap-2 items-center">
           <input 
             value={feature}
             onChange={(e) => handleChange(idx, e.target.value)}
             className="flex-1 bg-black/20 border border-white/10 rounded p-2 text-white text-sm focus:border-brand-cyan outline-none"
             placeholder="Enter item..."
           />
           <button onClick={() => handleRemove(idx)} className="text-red-400 hover:text-red-300 p-2 hover:bg-white/5 rounded"><Trash2 size={16} /></button>
        </div>
      ))}
      <button onClick={handleAdd} className="text-xs text-brand-cyan hover:text-white flex items-center gap-1 mt-1 py-1 px-2 hover:bg-brand-cyan/10 rounded transition-colors">
        <Plus size={14} /> Add Item
      </button>
    </div>
  );
};

// ... (Other editors: PricingEditor, ProjectTemplateManager, ClientProjectManager, PartnersManager, HomeEditor, PartnerPageEditor)

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
                        <StringField label="Credit Cost per Run" type="number" value={newTemplate.aiCreditCost} onChange={(v: number) => setNewTemplate({ ...newTemplate, aiCreditCost: v })} />
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
                        <div className="flex gap-2">
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

    if (!currentUser) {
        return (
            <GlassCard className="text-center p-12">
                <Users size={48} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-bold">No Active Client Session</h3>
                <p className="text-gray-400">Please log in as a customer in another tab to manage their live projects here.</p>
            </GlassCard>
        );
    }

    const handleUpdateWebhook = (projectId: string, url: string) => {
        const updatedProjects = currentUser.projects.map(p => 
            p.id === projectId ? { ...p, webhookUrl: url } : p
        );
        updateUserProfile({ projects: updatedProjects });
    };

    return (
        <div className="space-y-6">
            <GlassCard>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan font-bold text-xl">
                        {currentUser.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Managing: {currentUser.name}</h3>
                        <p className="text-gray-400 text-sm">{currentUser.businessName} • {currentUser.email}</p>
                    </div>
                </div>
                
                <h4 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Active Projects & Webhooks</h4>
                
                {currentUser.projects.length === 0 ? (
                    <p className="text-gray-500 italic">This user has no active projects.</p>
                ) : (
                    <div className="space-y-4">
                        {currentUser.projects.map(p => (
                            <div key={p.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h5 className="font-bold text-brand-cyan">{p.name}</h5>
                                        <p className="text-xs text-gray-500 font-mono">ID: {p.id}</p>
                                    </div>
                                    <Badge color={p.status === 'active' ? 'green' : 'red'}>{p.status}</Badge>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase font-bold mb-1">N8N Webhook URL</label>
                                    <div className="flex gap-2">
                                        <input 
                                            value={p.webhookUrl || ''} 
                                            onChange={(e) => handleUpdateWebhook(p.id, e.target.value)}
                                            className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white font-mono focus:border-brand-violet outline-none"
                                            placeholder="https://n8n.your-instance.com/webhook/..."
                                        />
                                        <button className="px-3 py-2 bg-brand-violet/20 hover:bg-brand-violet/30 text-brand-violet rounded border border-brand-violet/30 text-xs font-bold transition-colors">
                                            Test
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

const PartnersManager = ({ config, update }: any) => {
  const partners = config.partners || [];
  const [newPartner, setNewPartner] = useState({ name: '', email: '', type: 'Referral' });

  const addPartner = () => {
    if (!newPartner.name) return;
    const code = 'partner_' + Math.random().toString(36).substr(2, 6);
    const partner = { ...newPartner, id: Date.now().toString(), code, clicks: 0, signups: 0 };
    update({ ...config, partners: [...partners, partner] });
    setNewPartner({ name: '', email: '', type: 'Referral' });
  };

  const removePartner = (id: string) => {
    update({ ...config, partners: partners.filter((p: any) => p.id !== id) });
  };

  const copyLink = (code: string) => {
    const link = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(link);
    alert(`Copied: ${link}`);
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-xl font-bold mb-4 text-brand-cyan">Add New Partner</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <StringField label="Name" value={newPartner.name} onChange={(v:string) => setNewPartner({...newPartner, name: v})} placeholder="Partner Name" />
          <StringField label="Email" value={newPartner.email} onChange={(v:string) => setNewPartner({...newPartner, email: v})} placeholder="partner@email.com" />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
            <select 
              value={newPartner.type} 
              onChange={(e) => setNewPartner({...newPartner, type: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-cyan outline-none"
            >
              <option value="Referral">Referral Partner</option>
              <option value="Channel">Channel Partner</option>
            </select>
          </div>
        </div>
        <NeonButton onClick={addPartner} className="mt-2"><Plus size={16} /> Create Partner</NeonButton>
      </GlassCard>

      <GlassCard>
        <h3 className="text-xl font-bold mb-4">Active Partners</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase text-gray-500 bg-white/5">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Referral Code</th>
                <th className="p-3">Stats</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p: any) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 font-bold">{p.name}<div className="text-xs font-normal text-gray-500">{p.email}</div></td>
                  <td className="p-3"><Badge color={p.type === 'Referral' ? 'violet' : 'cyan'}>{p.type}</Badge></td>
                  <td className="p-3 font-mono text-brand-cyan">{p.code}</td>
                  <td className="p-3">{p.clicks} clicks / {p.signups} signups</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => copyLink(p.code)} className="p-2 bg-white/10 rounded hover:bg-white/20 text-brand-cyan" title="Copy Link"><Copy size={14}/></button>
                    <button onClick={() => removePartner(p.id)} className="p-2 bg-red-500/10 rounded hover:bg-red-500/20 text-red-500"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
              {partners.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No partners created yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

const PaymentSettings = ({ config, update }: any) => {
    const razorpay = config.razorpay || { enabled: true, keyId: '', keySecret: '', currency: 'INR' };
    
    const handleChange = (field: string, value: any) => {
        update({ ...config, razorpay: { ...razorpay, [field]: value } });
    };

    return (
        <div className="space-y-6">
            <GlassCard>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-brand-cyan flex items-center gap-2"><CreditCard size={24} /> Razorpay Configuration</h3>
                    <label className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={razorpay.enabled} 
                            onChange={(e) => handleChange('enabled', e.target.checked)} 
                            className="w-5 h-5 accent-brand-cyan"
                        /> 
                        <span className="text-sm font-bold">Payments Enabled</span>
                    </label>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <StringField 
                        label="Key ID (Public Key)" 
                        value={razorpay.keyId} 
                        onChange={(v: string) => handleChange('keyId', v)} 
                        placeholder="rzp_test_..." 
                    />
                    <StringField 
                        label="Key Secret (Secret Key)" 
                        type="password"
                        value={razorpay.keySecret} 
                        onChange={(v: string) => handleChange('keySecret', v)} 
                        placeholder="••••••••••••••" 
                    />
                    <div className="w-1/3">
                        <StringField 
                            label="Currency" 
                            value={razorpay.currency} 
                            onChange={(v: string) => handleChange('currency', v)} 
                            placeholder="INR" 
                        />
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

const HomeEditor = ({ config, update }: any) => { const home = config.homePage || DEFAULT_CONFIG.homePage; return (<div className="space-y-6"><GlassCard><h3 className="text-xl font-bold mb-4 text-brand-cyan">Hero Section</h3><StringField label="Hero Title" value={config.hero.title} onChange={(v: string) => update({...config, hero: {...config.hero, title: v}})} /><StringField label="Hero Subtitle" value={config.hero.subtitle} onChange={(v: string) => update({...config, hero: {...config.hero, subtitle: v}})} textarea /><ImageField label="Hero Image" value={config.hero.image} onChange={(v: string) => update({...config, hero: {...config.hero, image: v}})} /></GlassCard></div>)};
const PartnerPageEditor = ({ config, update }: any) => { const partner = config.partnerPage; return (<div className="space-y-6"><GlassCard><h3 className="text-xl font-bold mb-4 text-brand-cyan">Hero Section</h3><StringField label="Headline" value={partner.headline} onChange={(v: string) => update({ ...config, partnerPage: { ...partner, headline: v } })} /></GlassCard></div>)};
const LoginView = ({ onLogin }: { onLogin: () => void }) => { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false); const handleLogin = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { if (email.includes('@')) onLogin(); setLoading(false); }, 1000); }; return <div className="min-h-screen bg-brand-dark flex items-center justify-center"><GlassCard><form onSubmit={handleLogin}><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="mb-4 w-full bg-black p-2 text-white border border-white/10 rounded"/> <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="mb-4 w-full bg-black p-2 text-white border border-white/10 rounded"/> <NeonButton fullWidth>{loading?'Logging in...':'Login'}</NeonButton></form></GlassCard></div>};

export const AdminDashboard = () => {
  const { config, updateConfig, resetConfig } = useConfig();
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => { const session = sessionStorage.getItem('admin_auth'); if (session === 'true') setIsAuthenticated(true); }, []);
  const handleLogin = () => { sessionStorage.setItem('admin_auth', 'true'); setIsAuthenticated(true); };
  const handleLogout = () => { sessionStorage.removeItem('admin_auth'); setIsAuthenticated(false); setActiveTab('home'); };

  const menuItems = [
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'pricing', label: 'Pricing Plans', icon: DollarSign },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'client_projects', label: 'Client Projects', icon: Server },
    { id: 'templates', label: 'Project Templates', icon: Workflow },
    { id: 'partners', label: 'Partners', icon: Users },
    { id: 'partner_page', label: 'Partner Page Content', icon: Briefcase },
    { id: 'voice', label: 'Voice Agent', icon: Mic },
    { id: 'webinar', label: 'Webinar', icon: Video },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return <HomeEditor config={config} update={updateConfig} />;
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
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === item.id ? 'bg-brand-violet text-white' : 'text-gray-400'}`}>
              <item.icon className="mr-3" size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6"><button onClick={handleLogout} className="text-red-400 text-sm flex gap-2"><LogOut size={16}/> Logout</button></div>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{menuItems.find(i => i.id === activeTab)?.label}</h1>
        {renderContent()}
      </div>
    </div>
  );
};
