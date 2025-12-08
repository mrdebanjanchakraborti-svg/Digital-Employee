import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Play, Cpu, Zap, BarChart, Home as HomeIcon } from 'lucide-react';
import { useConfig } from '../services/configContext';
import { Section, NeonButton, GlassCard, Modal, Badge, ImageWithFallback } from '../components/Shared';
import { Link } from 'react-router-dom';
import { VoiceAgentOverlay } from '../components/VoiceAgent';

// Helper to resolve icon name to component
const getIcon = (iconName: string) => {
  const icons: any = { Cpu, Zap, BarChart, Home: HomeIcon };
  const IconComponent = icons[iconName] || Cpu;
  return IconComponent;
};

export const Home = () => {
  const { config } = useConfig();
  const [voiceAgentOpen, setVoiceAgentOpen] = useState(false);
  
  // Use default fallback if homePage config is missing (safety)
  const homeConfig = config.homePage || {
    benefitsTitle: "Why Digital Employees?",
    benefitsSubtitle: "Replace mundane tasks with intelligent, autonomous agents that scale with your business.",
    benefits: [
      { title: "Hyper Efficiency", description: "Execute workflows 100x faster.", icon: "Cpu" },
      { title: "Always On", description: "No sick days, no holidays.", icon: "Zap" },
      { title: "70% Cost Reduction", description: "Lower operational costs.", icon: "BarChart" }
    ]
  };

  const handleLiveDemoClick = () => {
    // Always open voice agent now as per latest requirement
    setVoiceAgentOpen(true);
  };

  const handleVoiceAgentFallback = () => {
    setVoiceAgentOpen(false);
    // No modal fallback anymore
  };

  return (
    <>
      {/* Voice Agent Overlay */}
      <VoiceAgentOverlay 
        isOpen={voiceAgentOpen} 
        onClose={handleVoiceAgentFallback}
      />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-violet rounded-full blur-[128px] opacity-40" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-cyan rounded-full blur-[128px] opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left pt-20 lg:pt-0">
            <Badge color="cyan">AI Automation 2.0</Badge>
            <h1 className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="block text-white mb-2">{config.hero.title.split('—')[0]}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet neon-text">
                {config.hero.title.split('—')[1] || "Always On."}
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {config.hero.subtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NeonButton onClick={handleLiveDemoClick} variant="secondary">
                <Play size={20} fill="currentColor" /> Live Demo
              </NeonButton>
              <Link to="/hire">
                <NeonButton variant="outline">
                  Meet Employees <ArrowRight size={20} />
                </NeonButton>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-6 text-gray-400 text-sm">
              <div className="flex items-center"><CheckCircle size={16} className="text-brand-cyan mr-2" /> 24/7 Availability</div>
              <div className="flex items-center"><CheckCircle size={16} className="text-brand-cyan mr-2" /> No Training Needed</div>
              <div className="flex items-center"><CheckCircle size={16} className="text-brand-cyan mr-2" /> Instant ROI</div>
            </div>
          </div>

          <div className="relative mt-10 lg:mt-0 flex justify-center">
             {/* 3D Robot Placeholder */}
             <div className="relative w-80 h-80 md:w-[500px] md:h-[500px]">
               <div className="absolute inset-0 bg-gradient-to-r from-brand-violet to-brand-cyan rounded-full blur-3xl opacity-20 animate-pulse" />
               <ImageWithFallback 
                src={config.hero.image} 
                className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_50px_rgba(6,228,218,0.3)] animate-[float_6s_ease-in-out_infinite]"
                alt="AI Robot" 
               />
               
               {/* Holographic Cards Floating */}
               <div className="absolute top-10 -left-10 glass-panel p-4 rounded-xl animate-[float_4s_ease-in-out_infinite_1s]">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-xs font-mono text-brand-cyan">Marketing Bot: Posting...</span>
                 </div>
               </div>
               
               <div className="absolute bottom-20 -right-5 glass-panel p-4 rounded-xl animate-[float_5s_ease-in-out_infinite_0.5s]">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                   <span className="text-xs font-mono text-brand-violet">Sales Bot: Lead Qualified</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <Section className="bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{homeConfig.benefitsTitle}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{homeConfig.benefitsSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeConfig.benefits.map((b, idx) => {
              const Icon = getIcon(b.icon);
              return (
                <GlassCard key={idx}>
                  <Icon className={`w-12 h-12 mb-6 ${idx === 1 ? 'text-brand-cyan' : idx === 2 ? 'text-purple-400' : 'text-brand-violet'}`} />
                  <h3 className="text-xl font-bold mb-3">{b.title}</h3>
                  <p className="text-gray-400">{b.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
};