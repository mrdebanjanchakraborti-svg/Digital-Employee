
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

  const handleChange = (f: string, v: string) => setData({ ...data, [f]: v });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate subscription end date (30 days from now)
    const end = new Date();
    end.setDate(end.getDate() + 30);

    // Auto-create default projects based on plan
    const currentPlan = config.pricingSnapshot.plans.find(p => p.id === currentUser?.planId) || config.pricingSnapshot.plans[0];
    const projectLimit = currentPlan.maxProjects || 1;
    
    const defaultProjects: Project[] = [];
    for (let i = 0; i < projectLimit; i++) {
        defaultProjects.push({
            id: `proj_${Date.now()}_${i}`,
            name: `My Project ${i + 1}`,
            status: 'active',
            webhookUrl: '', // Admin to map this
            aiCreditCost: 10
        });
    }
    
    updateUserProfile({
      ...data,
      subscriptionStatus: 'active',
      subscriptionEndDate: end.toISOString(),
      walletBalance: 0, 
      workflowsRemaining: 0,
      projects: defaultProjects, // Initialize with default projects
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
                <div><label className="text-xs text-gray-500 uppercase">Full Name</label><input required value={data.name} onChange={e=>handleChange('name', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"/></div>
                <div><label className="text-xs text-gray-500 uppercase">Business Name</label><input required value={data.businessName} onChange={e=>handleChange('businessName', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"/></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500 uppercase">Phone</label><input required value={data.phone} onChange={e=>handleChange('phone', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"/></div>
                <div><label className="text-xs text-gray-500 uppercase">WhatsApp</label><input required value={data.whatsapp} onChange={e=>handleChange('whatsapp', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"/></div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 uppercase">Industry</label>
                <select required value={data.industry} onChange={e=>handleChange('industry', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white">
                  <option value="">Select Industry</option>
                  {config.industries.map((ind, i) => <option key={i} value={ind.name}>{ind.name}</option>)}
                  <option value="Other">Other</option>
                </select>
              </div>

              <div><label className="text-xs text-gray-500 uppercase">Address</label><textarea required value={data.address} onChange={e=>handleChange('address', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"/></div>

              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs text-gray-500 uppercase">City</label><input required value={data.city} onChange={e=>handleChange('city', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"/></div>
                <div><label className="text-xs text-gray-500 uppercase">State</label><input required value={data.state} onChange={e=>handleChange('state', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"/></div>
                <div><label className="text-xs text-gray-500 uppercase">PIN</label><input required value={data.pin} onChange={e=>handleChange('pin', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"/></div>
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
