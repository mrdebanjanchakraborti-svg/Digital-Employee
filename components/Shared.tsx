
import React, { useState, useEffect } from 'react';
import { X, Check, ImageOff } from 'lucide-react';

export const Section = ({ className = "", children, id }: any) => (
  <section id={id} className={`py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${className}`}>
    {children}
  </section>
);

export const GlassCard = ({ className = "", children, hoverEffect = true }: any) => (
  <div className={`glass-panel rounded-2xl p-6 md:p-8 transition-all duration-300 ${hoverEffect ? 'hover:transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,228,218,0.15)] hover:border-brand-cyan/30' : ''} ${className}`}>
    {children}
  </div>
);

export const Badge = ({ children, color = "violet" }: any) => {
  const styles = color === "violet" 
    ? "bg-brand-violet/20 text-brand-violet border-brand-violet/30" 
    : "bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30";
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles}`}>
      {children}
    </span>
  );
};

export const NeonButton = ({ children, variant = "primary", onClick, className = "", fullWidth = false }: any) => {
  const base = "relative overflow-hidden rounded-lg font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-brand-violet text-white shadow-[0_0_20px_rgba(108,40,255,0.4)] hover:shadow-[0_0_30px_rgba(108,40,255,0.6)] hover:bg-brand-violet/90",
    secondary: "bg-brand-cyan text-black shadow-[0_0_20px_rgba(6,228,218,0.4)] hover:shadow-[0_0_30px_rgba(6,228,218,0.6)] hover:bg-brand-cyan/90",
    outline: "bg-transparent border border-brand-cyan text-brand-cyan hover:bg-brand-cyan/10"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${base} ${variants[variant as keyof typeof variants]} ${fullWidth ? 'w-full' : ''} px-6 py-3 ${className}`}
    >
      {children}
    </button>
  );
};

export const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-brand-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-white neon-text">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ImageWithFallback = ({ src, alt, className, ...props }: any) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setErrored(false);
  }, [src]);

  const handleError = () => {
    if (!errored) {
      setErrored(true);
      // Using a reliable placeholder service
      setImgSrc("https://placehold.co/600x600/1a103c/FFF?text=Image+Not+Found"); 
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export const RobotAvatar = ({ src, alt, className = "" }: any) => (
  <div className={`relative group ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-tr from-brand-violet to-brand-cyan rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
    <ImageWithFallback 
      src={src} 
      alt={alt} 
      className="relative z-10 w-full h-full object-cover rounded-full border-2 border-white/20 group-hover:border-brand-cyan transition-colors"
    />
  </div>
);
