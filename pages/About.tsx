
import React from 'react';
import { Section, GlassCard, ImageWithFallback } from '../components/Shared';
import { useConfig } from '../services/configContext';

export const About = () => {
  const { config } = useConfig();
  const about = config.about || { 
    title: "Building the Future of Work",
    subtitle: "We believe humans should focus on creativity and strategy, while AI handles the repetition.",
    heroImage: "https://picsum.photos/800/600?tech",
    missionTitle: "Our Mission",
    missionDescription: "To democratize enterprise-grade automation for Small and Medium Businesses (SMBs) across India. We aim to deploy 10,000 Digital Employees by 2026, saving 1 million man-hours of repetitive labor."
  };
  
  return (
    <div className="min-h-screen pt-10">
      <Section>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {about.title.split("Work")[0]}
            <span className="text-brand-cyan">Work</span>
          </h1>
          <p className="text-xl text-gray-300">{about.subtitle}</p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
           <GlassCard>
             <h3 className="text-2xl font-bold mb-4">{about.missionTitle}</h3>
             <p className="text-gray-400 leading-relaxed">
               {about.missionDescription}
             </p>
           </GlassCard>
           <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
             <ImageWithFallback src={about.heroImage} alt="Office" className="absolute inset-0 w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent opacity-60" />
           </div>
        </div>
      </Section>

      <Section className="bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Meet The Team</h2>
          {config.team.length === 0 ? (
            <div className="text-center text-gray-400">No team members added yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {config.team.map(member => (
                <GlassCard key={member.id} className="text-center group" hoverEffect={true}>
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/5 group-hover:border-brand-violet transition-colors relative">
                    <ImageWithFallback src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-brand-cyan text-sm mb-4">{member.role}</p>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-3">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((exp, i) => (
                      <span key={i} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-white/5 rounded text-gray-500">{exp}</span>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};
