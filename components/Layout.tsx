
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, Cpu, User, Globe, Briefcase, Phone, Video, MessageCircle, Facebook, Instagram, Youtube, Linkedin, LayoutDashboard } from 'lucide-react';
import { useConfig } from '../services/configContext';

const NavLink = ({ to, children, mobile = false, onClick }: any) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const baseClass = mobile
    ? "block w-full py-3 px-4 text-left hover:bg-white/10 rounded-lg transition-colors"
    : "relative px-3 py-2 transition-colors hover:text-brand-cyan";
  
  const activeClass = mobile
    ? "bg-brand-violet/20 text-brand-cyan border-l-4 border-brand-cyan"
    : "text-brand-cyan after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-cyan after:shadow-[0_0_10px_#06E4DA]";

  return (
    <Link to={to} className={`${baseClass} ${isActive ? activeClass : 'text-gray-300'}`} onClick={onClick}>
      {children}
    </Link>
  );
};

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { config, currentUser } = useConfig();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-white overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-brand-violet to-brand-cyan rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-brand-cyan/50 transition-all duration-300">
                {config.logo ? (
                  <img src={config.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Rocket className="text-white w-6 h-6" />
                )}
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">
                In<span className="text-brand-cyan">Flow</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium tracking-wide">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/hire">Hire Digital Employee</NavLink>
              <NavLink to="/partner">Partner</NavLink>
              <NavLink to="/webinar">Webinar</NavLink>
              
              {currentUser ? (
                <Link 
                  to="/dashboard"
                  className="ml-4 px-6 py-2.5 rounded-full bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan font-bold border border-brand-cyan/50 transition-all flex items-center gap-2"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              ) : (
                <Link 
                  to="/hire"
                  className="ml-4 px-6 py-2.5 rounded-full bg-brand-violet hover:bg-brand-violet/80 text-white font-bold shadow-[0_0_20px_rgba(108,40,255,0.4)] hover:shadow-[0_0_30px_rgba(108,40,255,0.6)] transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile Button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass-panel border-t border-white/10 absolute w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink to="/" mobile onClick={() => setIsOpen(false)}>Home</NavLink>
              <NavLink to="/about" mobile onClick={() => setIsOpen(false)}>About</NavLink>
              <NavLink to="/hire" mobile onClick={() => setIsOpen(false)}>Hire Me</NavLink>
              <NavLink to="/partner" mobile onClick={() => setIsOpen(false)}>Partner</NavLink>
              <NavLink to="/jobs" mobile onClick={() => setIsOpen(false)}>Jobs</NavLink>
              <NavLink to="/faq" mobile onClick={() => setIsOpen(false)}>FAQ</NavLink>
              <NavLink to="/contact" mobile onClick={() => setIsOpen(false)}>Contact</NavLink>
              <NavLink to="/webinar" mobile onClick={() => setIsOpen(false)}>Webinar</NavLink>
              {currentUser ? (
                <NavLink to="/dashboard" mobile onClick={() => setIsOpen(false)}>Dashboard</NavLink>
              ) : (
                <NavLink to="/admin" mobile onClick={() => setIsOpen(false)}>Partner Login</NavLink>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Floating WhatsApp Button */}
      {config.contact.whatsapp && (
        <a
          href={config.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:shadow-[0_0_30px_rgba(37,211,102,0.7)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 flex items-center justify-center group"
          title="Chat on WhatsApp"
        >
          <MessageCircle size={28} className="text-white fill-current" />
          <span className="absolute right-full mr-3 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us
          </span>
        </a>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Rocket className="text-brand-cyan w-6 h-6" />
                <span className="text-xl font-bold">InFlow</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {config.tagline}
              </p>
              <div className="flex space-x-4">
                {config.contact.social?.facebook && (
                  <a href={config.contact.social.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-colors cursor-pointer" aria-label="Facebook">
                    <Facebook size={16} />
                  </a>
                )}
                {config.contact.social?.instagram && (
                  <a href={config.contact.social.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E4405F] hover:text-white flex items-center justify-center transition-colors cursor-pointer" aria-label="Instagram">
                    <Instagram size={16} />
                  </a>
                )}
                {config.contact.social?.youtube && (
                  <a href={config.contact.social.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition-colors cursor-pointer" aria-label="YouTube">
                    <Youtube size={16} />
                  </a>
                )}
                {config.contact.social?.linkedin && (
                  <a href={config.contact.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-colors cursor-pointer" aria-label="LinkedIn">
                    <Linkedin size={16} />
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-brand-cyan transition-colors">About Us</Link></li>
                <li><Link to="/about" className="hover:text-brand-cyan transition-colors">Team</Link></li>
                <li><Link to="/jobs" className="hover:text-brand-cyan transition-colors">Careers</Link></li>
                <li><Link to="/partner" className="hover:text-brand-cyan transition-colors">Become a Partner</Link></li>
                <li><Link to="/admin" className="hover:text-brand-cyan transition-colors">Partner Login</Link></li>
                <li><Link to="/webinar" className="hover:text-brand-cyan transition-colors">Webinar</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/hire" className="hover:text-brand-cyan transition-colors">Marketing Employee</Link></li>
                <li><Link to="/hire" className="hover:text-brand-cyan transition-colors">Sales Employee</Link></li>
                <li><Link to="/hire" className="hover:text-brand-cyan transition-colors">HR Employee</Link></li>
                <li><Link to="/hire" className="hover:text-brand-cyan transition-colors">Finance Employee</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/faq" className="hover:text-brand-cyan transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-brand-cyan transition-colors">Contact Us</Link></li>
                <li className="flex items-start space-x-3 pt-2">
                  <span className="text-brand-cyan mt-1">✉</span>
                  <span>{config.contact.email}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-brand-cyan mt-1">📞</span>
                  <span>{config.contact.phone}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} InFlow Automation. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
              <Link to="/admin" className="text-brand-violet hover:text-white font-bold">Admin Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
