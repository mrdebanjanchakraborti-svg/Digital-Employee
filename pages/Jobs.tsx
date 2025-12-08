import React from 'react';
import { useConfig } from '../services/configContext';
import { Section, GlassCard, Badge, NeonButton } from '../components/Shared';
import { MapPin, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';

export const Jobs = () => {
  const { config } = useConfig();

  const getApplyUrl = (link: string, title: string) => {
    if (!link) return '#';
    const cleanLink = link.trim();
    // Check if it is a mailto link and doesn't already have a subject
    if (cleanLink.toLowerCase().startsWith('mailto:') && !cleanLink.toLowerCase().includes('subject=')) {
      const separator = cleanLink.includes('?') ? '&' : '?';
      return `${cleanLink}${separator}subject=${encodeURIComponent(`Application for ${title}`)}`;
    }
    return cleanLink;
  };

  return (
    <div className="min-h-screen pt-10">
      <Section>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge>Careers</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-6">Join the <span className="text-brand-cyan">AI Revolution</span></h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Build the workforce of tomorrow. We are looking for innovators, thinkers, and doers.
          </p>
        </div>

        {/* Why Work With Us */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
           {[
             { title: "Cutting-edge AI", icon: "🚀", desc: "Work with the latest LLMs and automation tech." },
             { title: "100% Training", icon: "📚", desc: "We invest in your growth with dedicated courses." },
             { title: "Remote-First", icon: "🌍", desc: "Work from anywhere in India or the world." },
             { title: "Performance Bonuses", icon: "💎", desc: "High rewards for high impact work." },
             { title: "Rapid Growth", icon: "📈", desc: "Fast-track career paths in a booming industry." },
             { title: "Great Culture", icon: "🤝", desc: "Collaborative, innovative, and fun team." }
           ].map((item, idx) => (
             <GlassCard key={idx} className="text-center" hoverEffect>
               <div className="text-4xl mb-4">{item.icon}</div>
               <h3 className="text-lg font-bold mb-2">{item.title}</h3>
               <p className="text-sm text-gray-400">{item.desc}</p>
             </GlassCard>
           ))}
        </div>

        {/* Job Listings */}
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
          {config.jobs.length === 0 && (
            <div className="text-center text-gray-400 py-10 bg-white/5 rounded-xl border border-white/5">
              No open positions at the moment. Please check back later.
            </div>
          )}
          
          {config.jobs.map((job) => {
            const applyUrl = getApplyUrl(job.applyLink, job.title);
            const isMailto = applyUrl.toLowerCase().startsWith('mailto:');

            return (
              <GlassCard key={job.id} className="relative group overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                      <span className="flex items-center"><MapPin size={16} className="mr-1" /> {job.location}</span>
                      <span className="flex items-center"><DollarSign size={16} className="mr-1" /> {job.salary}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-brand-violet uppercase tracking-wider mb-3">Responsibilities</h4>
                        <ul className="space-y-2">
                          {job.responsibilities.map((r, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-300">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-violet mr-2 flex-shrink-0" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-brand-cyan uppercase tracking-wider mb-3">Desired Profile</h4>
                        <ul className="space-y-2">
                          {job.desiredProfile.map((p, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-300">
                              <CheckCircle size={14} className="text-brand-cyan mr-2 mt-0.5 flex-shrink-0" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-48 flex-shrink-0 flex flex-col gap-3">
                    <a 
                      href={applyUrl} 
                      target={isMailto ? undefined : "_blank"} 
                      rel={isMailto ? undefined : "noreferrer"}
                    >
                      <NeonButton fullWidth>Apply Now</NeonButton>
                    </a>
                    <p className="text-xs text-center text-gray-500">via Email/Form</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* General Application */}
        <div className="max-w-3xl mx-auto mt-24 text-center">
          <GlassCard className="bg-brand-violet/10 border-brand-violet/30">
            <h3 className="text-2xl font-bold mb-4">Don't see a fit?</h3>
            <p className="text-gray-300 mb-6">
              We are always looking for talent. Send your CV directly to our HR team and we will keep you on file for future openings.
            </p>
            <a href="mailto:careers@inflow.co.in?subject=General%20Application" className="inline-flex items-center justify-center text-brand-cyan font-bold hover:text-white transition-colors">
              careers@inflow.co.in <ArrowRight size={18} className="ml-2" />
            </a>
          </GlassCard>
        </div>
      </Section>
    </div>
  );
};