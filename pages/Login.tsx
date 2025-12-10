
import React, { useState } from 'react';
import { useConfig } from '../services/configContext';
import { Section, GlassCard, NeonButton } from '../components/Shared';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { loginUser } = useConfig();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
      const newErrors: Record<string, string> = {};
      if (!email.trim()) {
          newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
          newErrors.email = "Invalid email format";
      }
      if (!password) newErrors.password = "Password is required";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate DB Lookup / API Call
    setTimeout(() => {
        const mockUser: any = {
            id: 'cust_returning_' + Date.now(),
            email: email,
            name: email.split('@')[0],
            planId: 'pro',
            subscriptionStatus: 'active',
            subscriptionEndDate: new Date(Date.now() + 86400000 * 15).toISOString(),
            walletBalance: 2500,
            aiCredits: 450,
            projects: [
                { id: 'p1', name: 'Legacy Project', status: 'active', aiCreditCost: 10, runCount: 50, workflowCountLimit: 100 }
            ],
            tasks: [],
            walletTransactions: [],
            creditLedger: [],
            workflowRuns: []
        };
        loginUser(mockUser);
        navigate('/dashboard');
        setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockUser: any = {
            id: 'google_returning_' + Date.now(),
            email: 'demo.user@gmail.com',
            name: 'Demo User',
            planId: 'starter',
            subscriptionStatus: 'active',
            subscriptionEndDate: new Date(Date.now() + 86400000 * 5).toISOString(),
            walletBalance: 0,
            aiCredits: 100,
            projects: [],
            tasks: [],
            walletTransactions: [],
            creditLedger: [],
            workflowRuns: []
        };
        loginUser(mockUser);
        navigate('/dashboard');
        setIsLoading(false);
      }, 1000);
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <Section className="w-full max-w-md">
        <GlassCard>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400">Log in to manage your digital workforce.</p>
          </div>

          <button onClick={handleGoogleLogin} className="w-full bg-white text-black font-bold py-3 rounded flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-lg mb-6">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Log in with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-white/10 flex-1"/>
                <span className="text-gray-500 text-xs uppercase">Or with Email</span>
                <div className="h-px bg-white/10 flex-1"/>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                <input 
                    type="email" 
                    value={email} 
                    onChange={e=>{setEmail(e.target.value); if(errors.email) setErrors({...errors, email: ''})}} 
                    placeholder="Email Address" 
                    className={`w-full bg-black/30 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded p-3 pl-10 text-white focus:border-brand-cyan outline-none transition-colors`}
                />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={10} className="mr-1"/> {errors.email}</p>}

            <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                <input 
                    type="password" 
                    value={password} 
                    onChange={e=>{setPassword(e.target.value); if(errors.password) setErrors({...errors, password: ''})}} 
                    placeholder="Password" 
                    className={`w-full bg-black/30 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded p-3 pl-10 text-white focus:border-brand-cyan outline-none transition-colors`}
                />
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={10} className="mr-1"/> {errors.password}</p>}
            
            <div className="text-right">
                <a href="#" className="text-xs text-gray-400 hover:text-brand-cyan">Forgot Password?</a>
            </div>

            <NeonButton fullWidth disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Log In'} <LogIn size={18} className="ml-2"/>
            </NeonButton>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account? <Link to="/hire" className="text-brand-cyan hover:underline font-bold">Get Started</Link>
          </div>
        </GlassCard>
      </Section>
    </div>
  );
};
