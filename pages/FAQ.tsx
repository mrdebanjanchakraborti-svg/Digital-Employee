
import React, { useState } from 'react';
import { useConfig } from '../services/configContext';
import { Section, GlassCard, Badge, NeonButton } from '../components/Shared';
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';

export const FAQ = () => {
  const { config } = useConfig();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <div className="min-h-screen pt-10">
      <Section>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge>Support</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-6">Frequently Asked <span className="text-brand-cyan">Questions</span></h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about hiring and managing Digital Employees.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {config.faq.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-white/5 rounded-xl">No FAQs available at the moment.</div>
          ) : (
            config.faq.map((item, idx) => (
              <GlassCard 
                key={idx} 
                className={`cursor-pointer transition-all duration-300 ${openIndex === idx ? 'border-brand-violet/50 bg-white/10' : 'bg-white/5 border-transparent'}`}
                onClick={() => toggle(idx)}
                hoverEffect={false}
              >
                <div className="flex justify-between items-center">
                  <h3 className={`font-bold text-lg ${openIndex === idx ? 'text-brand-cyan' : 'text-white'}`}>{item.question}</h3>
                  <div className={`p-2 rounded-full transition-colors ${openIndex === idx ? 'bg-brand-violet text-white' : 'bg-white/10 text-gray-400'}`}>
                    {openIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </div>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-300 leading-relaxed border-t border-white/10 pt-4">
                    {item.answer}
                  </p>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        <div className="max-w-3xl mx-auto mt-16 text-center">
          <p className="text-gray-400 mb-6">Still have questions?</p>
          <div className="flex justify-center gap-4">
             <a href={`mailto:${config.contact.email}`}>
               <NeonButton variant="outline"><HelpCircle size={18} /> Email Support</NeonButton>
             </a>
             {config.contact.whatsapp && (
               <a href={config.contact.whatsapp} target="_blank" rel="noreferrer">
                 <NeonButton variant="secondary"><MessageCircle size={18} /> Chat on WhatsApp</NeonButton>
               </a>
             )}
          </div>
        </div>
      </Section>
    </div>
  );
};
