
import React, { useState, useEffect } from 'react';
import { Section, GlassCard, NeonButton, ImageWithFallback } from '../components/Shared';
import { Video, User, CheckCircle, Calendar, Clock, ExternalLink } from 'lucide-react';
import { useConfig } from '../services/configContext';

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const target = new Date(targetDate).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate]);

  const Box = ({ label, value }: any) => (
    <div className="flex flex-col items-center p-4 bg-black/40 border border-brand-cyan/30 rounded-lg min-w-[80px]">
      <span className="text-3xl font-bold text-brand-cyan">{String(value).padStart(2, '0')}</span>
      <span className="text-xs text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-4 justify-center mt-8 flex-wrap">
      <Box label="Days" value={timeLeft.days} />
      <Box label="Hours" value={timeLeft.hours} />
      <Box label="Mins" value={timeLeft.minutes} />
      <Box label="Secs" value={timeLeft.seconds} />
    </div>
  );
};

export const Webinar = () => {
  const { config, updateConfig } = useConfig();
  const { webinar } = config;
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');

  if (!webinar) return <div>Loading...</div>;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all fields.");
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsRegistered(true);
      setError('');
      
      // Update filled spots locally for effect
      const newFilled = (webinar.spots.filled || 0) + 1;
      updateConfig({
        ...config,
        webinar: {
          ...webinar,
          spots: { ...webinar.spots, filled: newFilled }
        }
      });
    }, 800);
  };

  const addToCalendar = () => {
    const startDate = new Date(webinar.scheduledDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration default

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const url = new URL("https://www.google.com/calendar/render");
    url.searchParams.append("action", "TEMPLATE");
    url.searchParams.append("text", webinar.title);
    url.searchParams.append("dates", `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`);
    url.searchParams.append("details", `${webinar.subtitle}\n\nHost: ${webinar.speaker.name}\n\nJoin Link: ${window.location.href}`);
    url.searchParams.append("location", "Online Webinar");
    url.searchParams.append("sf", "true");
    url.searchParams.append("output", "xml");

    window.open(url.toString(), "_blank");
  };

  return (
    <div className="min-h-screen pt-10">
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-red-500/20 text-red-400 text-sm font-bold tracking-wider mb-6 animate-pulse">
            ● LIVE WEBINAR
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {webinar.title.split("Digital Employees").length > 1 ? (
              <>
                {webinar.title.split("Digital Employees")[0]}
                <br />
                <span className="text-brand-violet">Digital Employees</span>
                {webinar.title.split("Digital Employees")[1]}
              </>
            ) : (
              webinar.title
            )}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{webinar.subtitle}</p>
          
          <Countdown targetDate={webinar.scheduledDate} />

          <div className="mt-12 flex justify-center">
             <div className="w-full max-w-2xl bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-video relative group cursor-pointer">
                {webinar.videoUrl && webinar.videoUrl.includes('youtube') ? (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-colors z-10" onClick={() => window.open(webinar.videoUrl, '_blank')}>
                     <div className="w-20 h-20 rounded-full bg-brand-cyan flex items-center justify-center pl-1 text-black shadow-[0_0_30px_rgba(6,228,218,0.5)] group-hover:scale-110 transition-transform">
                       <Video size={32} fill="currentColor" />
                     </div>
                   </div>
                ) : (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-colors z-10">
                     <div className="w-20 h-20 rounded-full bg-brand-cyan flex items-center justify-center pl-1 text-black shadow-[0_0_30px_rgba(6,228,218,0.5)] group-hover:scale-110 transition-transform">
                       <Video size={32} fill="currentColor" />
                     </div>
                   </div>
                )}
                <ImageWithFallback src={webinar.previewImage} alt="Webinar Preview" className="w-full h-full object-cover opacity-60" />
             </div>
          </div>
        </div>
      </Section>

      <Section className="bg-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">What You Will Learn</h2>
            <ul className="space-y-4">
              {webinar.topics.map((item, i) => (
                <li key={i} className="flex items-start">
                   <div className="w-6 h-6 rounded-full bg-brand-violet/20 text-brand-violet flex items-center justify-center mr-4 mt-1 text-sm font-bold flex-shrink-0">{i+1}</div>
                   <span className="text-lg text-gray-300">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center space-x-4 p-4 glass-panel rounded-xl">
               <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-cyan">
                 <ImageWithFallback src={webinar.speaker.image} alt={webinar.speaker.name} className="w-full h-full object-cover" />
               </div>
               <div>
                 <p className="font-bold text-white">Hosted by {webinar.speaker.name}</p>
                 <p className="text-sm text-brand-cyan">{webinar.speaker.role}</p>
               </div>
            </div>
          </div>

          <GlassCard>
            <h3 className="text-2xl font-bold mb-6 text-center">
              {isRegistered ? "You're All Set!" : "Reserve Your Spot"}
            </h3>
            
            {isRegistered ? (
              <div className="text-center py-8 animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h4 className="text-xl font-bold mb-2">Registration Confirmed</h4>
                <p className="text-gray-400 mb-6">We've sent the details to <span className="text-white">{formData.email}</span>.</p>
                
                <div className="bg-white/5 p-4 rounded-lg text-left mb-6 border border-white/10">
                  <div className="flex items-center mb-2 text-sm text-gray-300">
                    <Calendar size={16} className="mr-2 text-brand-cyan" /> {new Date(webinar.scheduledDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock size={16} className="mr-2 text-brand-cyan" /> {new Date(webinar.scheduledDate).toLocaleTimeString()}
                  </div>
                </div>

                <NeonButton fullWidth onClick={addToCalendar} className="group">
                  Add to Calendar <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </NeonButton>
                
                <p className="text-xs text-gray-500 mt-4 italic">
                  * Confirmation email simulation only (No backend configured).
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleRegister}>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    type="text" 
                    className="w-full bg-black/30 border border-white/10 rounded p-3 focus:border-brand-cyan outline-none text-white" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Business Email</label>
                  <input 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    type="email" 
                    className="w-full bg-black/30 border border-white/10 rounded p-3 focus:border-brand-cyan outline-none text-white" 
                    placeholder="john@company.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Mobile Number</label>
                  <input 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    type="tel" 
                    className="w-full bg-black/30 border border-white/10 rounded p-3 focus:border-brand-cyan outline-none text-white" 
                    placeholder="+91" 
                  />
                </div>
                
                {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                
                <NeonButton fullWidth className="mt-4">Register Now</NeonButton>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Limited to {webinar.spots.total} spots. {webinar.spots.filled} filled.
                </p>
              </form>
            )}
          </GlassCard>
        </div>
      </Section>
    </div>
  );
};
