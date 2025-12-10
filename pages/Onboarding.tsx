
import React, { useState } from 'react';
import { useConfig } from '../services/configContext';
import { Section, GlassCard, NeonButton } from '../components/Shared';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';

export const Onboarding = () => {
  const { currentUser, updateUserProfile, config } = useConfig();
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: currentUser?.name || '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    pin: '',
    state: '',
    businessName: '',
    industry: '',
    gstNo: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (f: string, v: string) => {
      setData({ ...data, [f]: v });
      if (errors[f]) setErrors({...errors, [f]: ''});
  };

  const validate = () => {
      const newErrors: Record<string, string> = {};
      if (!data.name.trim()) newErrors.name = "Full Name is required";
      if (!data.businessName.trim()) newErrors.businessName = "Business Name is required";
      
      if (!data.phone.trim()) newErrors.phone = "Phone is required";
      else if (data.phone.length < 10) newErrors.phone = "Invalid phone number";

      if (!data.whatsapp.trim()) newErrors.whatsapp = "WhatsApp is required";
      else if (data.whatsapp.length < 10) newErrors.whatsapp = "Invalid WhatsApp number";

      if (!data.industry) newErrors.industry = "Please select an industry";
      if (!data.address.trim()) newErrors.address = "Address is required";
      if (!data.city.trim()) newErrors.city = "City is required";
      if (!data.state.trim()) newErrors.state = "State is required";
      
      if (!data.pin.trim()) newErrors.pin = "PIN is required";
      else if (!/^\d{6}$/.test(data.pin)) newErrors.pin = "Invalid PIN (6 digits)";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Calculate subscription end date (30 days from now)
    const end = new Date();
    end.setDate(end.getDate() + 30);

    // Auto-create default projects based on plan
    const currentPlan = config.pricingSnapshot.plans.find(p => p.id === currentUser?.planId) || config.pricingSnapshot.plans[0];
    const projectLimit = currentPlan.maxProjects || 1;
    
    const defaultProjects: Project[] = [];
    for (let i = 0; i < projectLimit; i++) {
        const projectId = `proj_${Date.now()}_${i}`;
        const pName = `My Project ${i + 1}`;
        
        // Generate Unique Webhook URL for ALL projects securely
        let baseUrl = 'https://n8n.inflow.co.in/webhook/general-task'; 
        if (i === 0) {
            baseUrl = 'https://new.webhook.url.com'; 
        }

        const separator = baseUrl.includes('?') ? '&' : '?';
        const webhook = `${baseUrl}${separator}userId=${currentUser?.id}&projectId=${projectId}`;

        defaultProjects.push({
            id: projectId,
            name: pName,
            status: 'active',
            webhookUrl: webhook, 
            aiCreditCost: 10,
            runCount: 0,
            workflowCountLimit: 100 // Default limit
        });
    }
    
    updateUserProfile({
      ...data,
      subscriptionStatus: 'active',
      subscriptionEndDate: end.toISOString(),
      walletBalance: 0, 
      workflowsRemaining: 0,
      projects: defaultProjects, // Initialize with unique default projects
      tasks: currentUser?.tasks || [] 
    });
    
    // Simulate processing
    setTimeout(() => {
        navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20">
      <Section>
        <div className="max-w-3xl mx-auto">
          <GlassCard>
            <h1 className="text-3xl font-bold mb-2 text-center">Complete Your Profile</h1>
            <p className="text-gray-400 text-center mb-8">We need a few details to configure your Digital Employee.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-500 uppercase">Full Name</label>
                    <input value={data.name} onChange={e=>handleChange('name', e.target.value)} className={`w-full bg-black/30 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded p-2 text-white`}/>
                    {errors.name && <span className="text-red-400 text-xs">{errors.name}</span>}
                </div>
                <div>
                    <label className="text-xs text-gray-500 uppercase">Business Name</label>
                    <input value={data.businessName} onChange={e=>handleChange('businessName', e.target.value)} className={`w-full bg-black/30 border ${errors.businessName ? 'border-red-500' : 'border-white/10'} rounded p-2 text-white`}/>
                    {errors.businessName && <span className="text-red-400 text-xs">{errors.businessName}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-500 uppercase">Phone</label>
                    <input value={data.phone} onChange={e=>handleChange('phone', e.target.value)} className={`w-full bg-black/30 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded p-2 text-white`}/>
                    {errors.phone && <span className="text-red-400 text-xs">{errors.phone}</span>}
                </div>
                <div>
                    <label className="text-xs text-gray-500 uppercase">WhatsApp</label>
                    <input value={data.whatsapp} onChange={e=>handleChange('whatsapp', e.target.value)} className={`w-full bg-black/30 border ${errors.whatsapp ? 'border-red-500' : 'border-white/10'} rounded p-2 text-white`}/>
                    {errors.whatsapp && <span className="text-red-400 text-xs">{errors.whatsapp}</span>}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 uppercase">Industry</label>
                <select value={data.industry} onChange={e=>handleChange('industry', e.target.value)} className={`w-full bg-black/30 border ${errors.industry ? 'border-red-500' : 'border-white/10'} rounded p-2 text-white`}>
                  <option value="">Select Industry</option>
                  {config.industries.map((ind, i) => <option key={i} value={ind.name}>{ind.name}</option>)}
                  <option value="Other">Other</option>
                </select>
                {errors.industry && <span className="text-red-400 text-xs">{errors.industry}</span>}
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase">Address</label>
                <textarea value={data.address} onChange={e=>handleChange('address', e.target.value)} className={`w-full bg-black/30 border ${errors.address ? 'border-red-500' : 'border-white/10'} rounded p-2 text-white`}/>
                {errors.address && <span className="text-red-400 text-xs">{errors.address}</span>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="text-xs text-gray-500 uppercase">City</label>
                    <input value={data.city} onChange={e=>handleChange('city', e.target.value)} className={`w-full bg-black/30 border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded p-2 text-white`}/>
                    {errors.city && <span className="text-red-400 text-xs">{errors.city}</span>}
                </div>
                <div>
                    <label className="text-xs text-gray-500 uppercase">State</label>
                    <input value={data.state} onChange={e=>handleChange('state', e.target.value)} className={`w-full bg-black/30 border ${errors.state ? 'border-red-500' : 'border-white/10'} rounded p-2 text-white`}/>
                    {errors.state && <span className="text-red-400 text-xs">{errors.state}</span>}
                </div>
                <div>
                    <label className="text-xs text-gray-500 uppercase">PIN</label>
                    <input value={data.pin} onChange={e=>handleChange('pin', e.target.value)} className={`w-full bg-black/30 border ${errors.pin ? 'border-red-500' : 'border-white/10'} rounded p-2 text-white`}/>
                    {errors.pin && <span className="text-red-400 text-xs">{errors.pin}</span>}
                </div>
              </div>

              <div><label className="text-xs text-gray-500 uppercase">GST No (Optional)</label><input value={data.gstNo} onChange={e=>handleChange('gstNo', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"/></div>

              <NeonButton fullWidth className="mt-6">Setup Dashboard</NeonButton>
            </form>
          </GlassCard>
        </div>
      </Section>
    </div>
  );
};
