
import React, { useState } from 'react';
import { useConfig } from '../services/configContext';
import { Section, GlassCard, Badge, NeonButton } from '../components/Shared';
import { Mail, Phone, MapPin, Send, MessageCircle, Facebook, Instagram, Youtube, Linkedin, AlertCircle } from 'lucide-react';

export const Contact = () => {
  const { config } = useConfig();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    if (val.length > 0) {
        setFormData({ ...formData, phone: '+91-' + val });
    } else {
        setFormData({ ...formData, phone: '' });
    }
    // Clear error on change
    if (errors.phone) setErrors({...errors, phone: ''});
  };

  const handleChange = (field: string, value: string) => {
      setFormData({ ...formData, [field]: value });
      if (errors[field]) setErrors({...errors, [field]: ''});
  };

  const validateForm = () => {
      const newErrors: Record<string, string> = {};
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) {
          newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
      }
      
      // Check if phone matches +91-XXXXXXXXXX
      if (!formData.phone.trim()) {
          newErrors.phone = "Phone number is required";
      } else if (formData.phone.length < 14) { // +91- + 10 digits = 14 chars
          newErrors.phone = "Please enter a valid 10-digit mobile number";
      }

      if (!formData.message.trim()) newErrors.message = "Message cannot be empty";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitted(true);
    setTimeout(() => {
       alert(`Thank you ${formData.name}! We have received your message.`);
       setSubmitted(false);
       setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-10">
      <Section>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge>Get In Touch</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-6">Contact <span className="text-brand-cyan">Us</span></h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready to automate your business? Reach out to us today.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
             <GlassCard>
               <h3 className="text-2xl font-bold mb-6 text-brand-violet">Contact Information</h3>
               <div className="space-y-6">
                 <div className="flex items-start">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 mr-4">
                      <Mail className="text-brand-cyan" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-1">Email</p>
                      <a href={`mailto:${config.contact.email}`} className="text-lg font-medium hover:text-brand-cyan transition-colors">{config.contact.email}</a>
                    </div>
                 </div>
                 
                 <div className="flex items-start">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 mr-4">
                      <Phone className="text-brand-cyan" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-1">Phone</p>
                      <a href={`tel:${config.contact.phone}`} className="text-lg font-medium hover:text-brand-cyan transition-colors">{config.contact.phone}</a>
                    </div>
                 </div>

                 <div className="flex items-start">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 mr-4">
                      <MapPin className="text-brand-cyan" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-1">Office</p>
                      <p className="text-lg font-medium text-gray-300">{config.contact.address}</p>
                    </div>
                 </div>
               </div>

               <div className="mt-8 pt-8 border-t border-white/10">
                 <p className="text-sm text-gray-400 mb-4 uppercase font-bold tracking-wider">Follow Us</p>
                 <div className="flex gap-4">
                    {config.contact.social?.facebook && <a href={config.contact.social.facebook} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded hover:bg-[#1877F2] transition-colors"><Facebook size={20}/></a>}
                    {config.contact.social?.instagram && <a href={config.contact.social.instagram} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded hover:bg-[#E4405F] transition-colors"><Instagram size={20}/></a>}
                    {config.contact.social?.youtube && <a href={config.contact.social.youtube} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded hover:bg-[#FF0000] transition-colors"><Youtube size={20}/></a>}
                    {config.contact.social?.linkedin && <a href={config.contact.social.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded hover:bg-[#0A66C2] transition-colors"><Linkedin size={20}/></a>}
                 </div>
               </div>
             </GlassCard>
          </div>

          {/* Form */}
          <GlassCard>
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Your Name</label>
                  <input 
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className={`w-full bg-black/30 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded p-3 text-white focus:border-brand-cyan outline-none transition-colors`} 
                    placeholder="John Doe" 
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={10} className="mr-1"/> {errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                  <input 
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full bg-black/30 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded p-3 text-white focus:border-brand-cyan outline-none transition-colors`} 
                    placeholder="+91-9876543210" 
                  />
                  {errors.phone && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={10} className="mr-1"/> {errors.phone}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className={`w-full bg-black/30 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded p-3 text-white focus:border-brand-cyan outline-none transition-colors`} 
                  placeholder="john@example.com" 
                />
                {errors.email && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={10} className="mr-1"/> {errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Message</label>
                <textarea 
                  value={formData.message}
                  onChange={e => handleChange('message', e.target.value)}
                  className={`w-full bg-black/30 border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded p-3 text-white focus:border-brand-cyan outline-none transition-colors min-h-[120px]`} 
                  placeholder="How can we help you?" 
                />
                {errors.message && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={10} className="mr-1"/> {errors.message}</p>}
              </div>

              <NeonButton fullWidth className="mt-2">
                {submitted ? 'Sending...' : 'Send Message'} <Send size={18} className="ml-2" />
              </NeonButton>
            </form>
          </GlassCard>
        </div>
      </Section>
    </div>
  );
};
