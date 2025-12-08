
import React, { useState } from 'react';
import { useConfig } from '../services/configContext';
import { Section, GlassCard, Badge, NeonButton, ImageWithFallback } from '../components/Shared';
import { Check, Calendar, Play, Star, ArrowRight } from 'lucide-react';
import { VoiceAgentOverlay } from '../components/VoiceAgent';
import { useNavigate } from 'react-router-dom';

export const HireMe = () => {
  const { config, addToCart } = useConfig();
  const navigate = useNavigate();
  const [voiceAgentOpen, setVoiceAgentOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleLiveDemoClick = () => setVoiceAgentOpen(true);
  const handleVoiceAgentFallback = () => setVoiceAgentOpen(false);

  const handleSubscribe = (plan: any) => {
    addToCart(plan, billingCycle);
    navigate('/cart');
  };

  const PricingSection = () => {
    const pricing = config.pricingSnapshot;
    if (!pricing?.enabled || !pricing.plans?.length) return null;

    return (
      <Section className="bg-black/20 mt-12">
        <div className="max-w-7xl mx-auto text-center mb-10">
           <Badge color="cyan">Subscription Plans</Badge>
           <h2 className="text-3xl md:text-5xl font-bold mt-6">Choose Your Plan</h2>
           <p className="text-gray-400 mt-4">Scale your digital workforce as you grow.</p>
        </div>

        {/* Billing Cycle Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 p-1.5 rounded-full flex relative border border-white/10">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-brand-cyan text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center ${billingCycle === 'yearly' ? 'bg-brand-violet text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Yearly <span className="ml-2 text-[10px] bg-green-500 text-black px-1.5 rounded-full">-17%</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
           {pricing.plans.filter((p:any) => p.visible).map((plan: any, idx: number) => {
             const price = billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);
             const displayPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
             
             return (
               <GlassCard key={idx} className={`relative flex flex-col ${plan.recommended ? 'border-brand-violet shadow-[0_0_30px_rgba(108,40,255,0.15)] scale-105 z-10' : 'border-white/5 opacity-90 hover:opacity-100 hover:scale-100'}`}>
                  {plan.recommended && (
                    <div className="absolute top-0 right-0 bg-brand-violet text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex flex-col my-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-brand-cyan">{plan.currency} {displayPrice}</span>
                      <span className="text-xs text-gray-400">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {billingCycle === 'yearly' && (
                        <div className="text-xs text-green-400 mt-1">Equivalent to {plan.currency} {price}/mo</div>
                    )}
                  </div>
                  
                  <div className="flex-grow space-y-3 mb-8">
                    <p className="text-sm font-bold text-white border-b border-white/10 pb-2">Includes:</p>
                    <div className="flex items-center text-sm text-gray-300">
                      <Check size={14} className="text-green-400 mr-2" /> {plan.maxProjects} Active Projects
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                       <Check size={14} className="text-green-400 mr-2" /> {plan.aiCredits} AI Credits/mo
                    </div>
                    {plan.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start text-sm text-gray-300 list-none">
                        <Check size={14} className="text-green-400 mr-2 mt-1" />
                        {f}
                      </li>
                    ))}
                  </div>
                  
                  <NeonButton fullWidth variant={plan.recommended ? 'primary' : 'outline'} onClick={() => handleSubscribe(plan)}>
                    Select {plan.name}
                  </NeonButton>
               </GlassCard>
             );
           })}
        </div>
      </Section>
    );
  };

  const hirePageConfig = config.hireMePage || { headline: "Hire Your Next Digital Employee", subtext: "Select a specialized AI agent to automate your specific business department." };

  return (
    <div className="min-h-screen pt-10">
      <VoiceAgentOverlay isOpen={voiceAgentOpen} onClose={handleVoiceAgentFallback} />

      <Section className="bg-transparent">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <Badge>Our Workforce</Badge>
          <h2 className="text-4xl md:text-6xl font-bold mt-6 mb-4">
             {hirePageConfig.headline.split("Digital Employee")[0]} 
             <span className="text-brand-cyan">Digital Employee</span>
             {hirePageConfig.headline.split("Digital Employee")[1]}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{hirePageConfig.subtext}</p>
        </div>

        <div className="max-w-7xl mx-auto space-y-24">
          {config.employees.filter(e => e.visible).sort((a,b) => a.order - b.order).map((emp, index) => (
            <div key={emp.id} id={emp.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
              
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative w-80 h-80 lg:w-[450px] lg:h-[450px]">
                   <div className={`absolute inset-0 bg-gradient-to-tr ${index % 2 === 0 ? 'from-brand-violet to-brand-dark' : 'from-brand-cyan to-brand-dark'} rounded-full blur-[100px] opacity-30`} />
                   <ImageWithFallback src={emp.robotImage} alt={emp.name} className="relative z-10 w-full h-full object-contain drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]" />
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                   <h3 className="text-3xl md:text-4xl font-bold">{emp.name}</h3>
                </div>
                <p className="text-xl text-brand-cyan mb-6 font-medium">{emp.shortTitle}</p>
                <p className="text-gray-300 leading-relaxed mb-8">{emp.detailedDescription}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="glass-panel p-4 rounded-lg bg-white/5">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Key Tasks</h4>
                    <ul className="space-y-2">
                      {emp.tasks.map((task, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <Check size={14} className="text-green-400 mr-2" /> {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                   <div className="glass-panel p-4 rounded-lg bg-white/5">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Workflows</h4>
                    <ul className="space-y-2">
                      {emp.n8nWorkflows.map((wf, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-violet mt-1.5 mr-2" />
                          <div>
                            <span className="font-semibold block">{wf.title}</span>
                            <span className="text-xs text-gray-500">{wf.summary}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {emp.meetMeLink && (
                    <a href={emp.meetMeLink} target="_blank" rel="noreferrer">
                      <NeonButton><Calendar size={18} /> Meet Me</NeonButton>
                    </a>
                  )}
                  {emp.liveDemoEnabled && (
                    <NeonButton variant="secondary" onClick={handleLiveDemoClick}><Play size={18} /> Live Demo</NeonButton>
                  )}
                  <button 
                      onClick={() => {
                        document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3 rounded-lg font-bold border border-white/20 hover:bg-white/10 transition-colors"
                    >
                      View Plans
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div id="pricing-section">
          <PricingSection />
        </div>
      </Section>
    </div>
  );
};
