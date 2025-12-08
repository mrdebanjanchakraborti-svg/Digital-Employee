import React from 'react';
import { Section, GlassCard, NeonButton } from '../components/Shared';
import { useConfig } from '../services/configContext';
import { DollarSign, Briefcase, Share2 } from 'lucide-react';

export const Partner = () => {
  const { config } = useConfig();
  const { partnerPage } = config;

  return (
    <div className="min-h-screen pt-10">
      <Section>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{partnerPage.headline}</h1>
          <p className="text-xl text-gray-300">{partnerPage.subtext}</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <GlassCard className="border-t-4 border-t-brand-cyan">
            <Share2 className="w-12 h-12 text-brand-cyan mb-6" />
            <h3 className="text-2xl font-bold mb-2">Referral Partner</h3>
            <p className="text-3xl font-bold text-white mb-6">10% <span className="text-base text-gray-400 font-normal">Monthly Recurring</span></p>
            <p className="text-gray-400 mb-8">{partnerPage.referralPartner.description}</p>
            <ul className="space-y-2 mb-8 text-sm text-gray-300">
              <li>• No technical skills required</li>
              <li>• Simple referral link tracking</li>
              <li>• Monthly payouts</li>
            </ul>
            <NeonButton variant="outline" fullWidth onClick={() => window.location.href = partnerPage.applyLink}>Apply Now</NeonButton>
          </GlassCard>

          <GlassCard className="border-t-4 border-t-brand-violet relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1 bg-brand-violet text-xs font-bold uppercase">Best Value</div>
            <Briefcase className="w-12 h-12 text-brand-violet mb-6" />
            <h3 className="text-2xl font-bold mb-2">Channel Partner</h3>
            <p className="text-3xl font-bold text-white mb-6">30% <span className="text-base text-gray-400 font-normal">Setup</span> + 20% <span className="text-base text-gray-400 font-normal">Recurring</span></p>
            <p className="text-gray-400 mb-8">{partnerPage.channelPartner.description}</p>
            <ul className="space-y-2 mb-8 text-sm text-gray-300">
              <li>• White-label options</li>
              <li>• Dedicated support manager</li>
              <li>• Sales training & assets</li>
            </ul>
            <NeonButton fullWidth onClick={() => window.location.href = partnerPage.applyLink}>Become a Partner</NeonButton>
          </GlassCard>
        </div>

        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Why Partner With Us?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {partnerPage.benefits.map((b, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/5 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};
