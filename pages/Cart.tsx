
import React, { useState } from 'react';
import { useConfig } from '../services/configContext';
import { Section, GlassCard, NeonButton } from '../components/Shared';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Lock, Trash2, CheckCircle, CreditCard, ArrowRight, AlertCircle } from 'lucide-react';

export const Cart = () => {
  const { cart, currentUser, loginUser, removeFromCart, referralCode, config } = useConfig();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!cart) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <GlassCard className="text-center p-12 max-w-md">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
             <CreditCard size={32} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Select a Digital Employee plan to get started with automation.</p>
          <NeonButton onClick={() => navigate('/hire')}>Browse Plans</NeonButton>
        </GlassCard>
      </div>
    );
  }

  const validateAuth = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    
    if (!password) newErrors.password = "Password is required";
    else if (authMode === 'signup' && password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAuth()) return;

    // Simulate Auth
    const mockUser: any = {
      id: 'cust_' + Date.now(),
      email: email,
      name: email.split('@')[0],
      planId: cart.id,
      subscriptionStatus: 'active',
      subscriptionEndDate: new Date().toISOString(), // Will be updated on payment
      walletBalance: 0,
      aiCredits: cart.aiCredits,
      projects: [],
      tasks: [],
      workflowsRemaining: 0,
      authMethod: 'email'
    };
    loginUser(mockUser);
  };

  const handleGoogleAuth = () => {
    // Simulate Google Auth Provider
    const mockGoogleUser: any = {
      id: 'google_' + Date.now(),
      email: 'google_user@example.com',
      name: 'Google User',
      planId: cart.id,
      subscriptionStatus: 'active',
      subscriptionEndDate: new Date().toISOString(),
      walletBalance: 0,
      aiCredits: cart.aiCredits,
      projects: [],
      tasks: [],
      workflowsRemaining: 0,
      authMethod: 'google'
    };
    loginUser(mockGoogleUser);
  };

  const price = cart.billingCycle === 'yearly' ? cart.yearlyPrice : cart.monthlyPrice;
  const gstAmount = price * 0.18;
  const totalAmount = price + gstAmount;
  const currencyCode = config.razorpay?.currency || "INR";

  const handlePayment = () => {
    if (!currentUser) return;

    const options = {
      key: config.razorpay.keyId || "rzp_test_12345678", 
      amount: Math.round(totalAmount * 100), // Amount in smallest currency unit
      currency: currencyCode,
      name: "InFlow Automation",
      description: `Subscription: ${cart.name} Plan (${cart.billingCycle})`,
      image: "https://storage.googleapis.com/digital-employee/HOME/HOME%20NEW.png",
      handler: function(response: any) {
        console.log("Payment Successful", response);
        navigate('/onboarding');
      },
      prefill: {
        name: currentUser.name,
        email: currentUser.email,
        contact: currentUser.phone || "9999999999"
      },
      theme: {
        color: "#6C28FF"
      }
    };

    if ((window as any).Razorpay && config.razorpay.enabled) {
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
      rzp1.on('payment.failed', function (response: any){
        alert("Payment Failed: " + response.error.description);
      });
    } else {
      // Fallback for demo without script or if script fails to load
      const confirmSim = window.confirm(`Razorpay SDK not loaded/disabled. Simulate successful payment of ${currencyCode} ${totalAmount.toFixed(2)}?`);
      if (confirmSim) {
          setTimeout(() => navigate('/onboarding'), 1000);
      }
    }
  };

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-20">
      <Section>
        {/* Step Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-white/10 -z-10" />
                <div className={`flex items-center gap-2 bg-brand-dark px-4 ${currentUser ? 'text-green-400' : 'text-brand-cyan'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentUser ? 'bg-green-500 text-black' : 'bg-brand-cyan text-black'}`}>
                        {currentUser ? <CheckCircle size={18}/> : '1'}
                    </div>
                    <span className="font-bold">Create Account</span>
                </div>
                <div className={`flex items-center gap-2 bg-brand-dark px-4 ${currentUser ? 'text-brand-cyan' : 'text-gray-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentUser ? 'bg-brand-cyan text-black' : 'bg-white/10 text-gray-400'}`}>2</div>
                    <span className="font-bold">Review & Pay</span>
                </div>
            </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Auth or Payment Method */}
          <div>
             {!currentUser ? (
               <GlassCard>
                 <h2 className="text-2xl font-bold mb-6">{authMode === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
                 
                 <div className="space-y-4">
                    <button onClick={handleGoogleAuth} className="w-full bg-white text-black font-bold py-3 rounded flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-lg">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Sign up with Google
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1"/>
                        <span className="text-gray-500 text-xs uppercase">Or with Email</span>
                        <div className="h-px bg-white/10 flex-1"/>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                            <input 
                                type="email" 
                                required 
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
                                required 
                                value={password} 
                                onChange={e=>{setPassword(e.target.value); if(errors.password) setErrors({...errors, password: ''})}} 
                                placeholder="Password" 
                                className={`w-full bg-black/30 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded p-3 pl-10 text-white focus:border-brand-cyan outline-none transition-colors`}
                            />
                        </div>
                        {errors.password && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={10} className="mr-1"/> {errors.password}</p>}
                        
                        <NeonButton fullWidth>{authMode === 'signup' ? 'Create Account' : 'Log In'}</NeonButton>
                    </form>
                 </div>

                 <div className="mt-6 text-center text-sm">
                   <button onClick={() => setAuthMode(authMode==='login'?'signup':'login')} className="text-brand-cyan hover:underline">
                     {authMode === 'signup' ? 'Already have an account? Log In' : 'New user? Sign Up'}
                   </button>
                 </div>
               </GlassCard>
             ) : (
               <GlassCard>
                 <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                        <User size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Logged in as</h3>
                        <p className="text-gray-400">{currentUser.email}</p>
                    </div>
                 </div>
                 
                 <h3 className="text-lg font-bold mb-4">Select Payment Method</h3>
                 <div className="space-y-3">
                    <label className="flex items-center gap-4 p-4 rounded-lg border border-brand-cyan/50 bg-brand-cyan/10 cursor-pointer">
                        <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-brand-cyan" />
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-1 rounded"><img src="https://razorpay.com/assets/razorpay-glyph.svg" className="w-6 h-6" alt="Razorpay"/></div>
                            <div>
                                <p className="font-bold">Razorpay Secure</p>
                                <p className="text-xs text-gray-400">Credit Card, Debit Card, UPI, NetBanking</p>
                            </div>
                        </div>
                    </label>
                    <label className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-black/20 opacity-50 cursor-not-allowed">
                        <input type="radio" name="payment" disabled className="w-5 h-5" />
                        <div className="flex items-center gap-3">
                            <CreditCard size={24} />
                            <div>
                                <p className="font-bold">International Cards (Stripe)</p>
                                <p className="text-xs text-gray-500">Coming Soon</p>
                            </div>
                        </div>
                    </label>
                 </div>
               </GlassCard>
             )}
          </div>

          {/* Right: Order Summary */}
          <div>
            <GlassCard className="border-brand-violet/50 sticky top-24">
               <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                   <h2 className="text-xl font-bold">Order Summary</h2>
                   <button onClick={removeFromCart} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 hover:bg-white/5 px-2 py-1 rounded transition-colors">
                       <Trash2 size={14} /> Remove Item
                   </button>
               </div>
               
               <div className="flex justify-between items-start mb-6">
                 <div>
                    <span className="font-bold text-lg text-brand-cyan block">{cart.name} Plan</span>
                    <span className="text-xs text-gray-400 capitalize">{cart.billingCycle} Subscription</span>
                 </div>
                 <div className="text-right">
                    <div className="font-bold text-xl">{currencyCode} {formatCurrency(price)}</div>
                    <span className="text-xs text-gray-500">{cart.billingCycle === 'monthly' ? '/ month' : '/ year'}</span>
                 </div>
               </div>
               
               <ul className="text-sm text-gray-400 space-y-3 mb-8 bg-white/5 p-4 rounded-lg">
                 <li className="flex items-center"><CheckCircle size={14} className="mr-2 text-brand-violet"/> {cart.maxProjects} Projects Included</li>
                 <li className="flex items-center"><CheckCircle size={14} className="mr-2 text-brand-violet"/> {cart.aiCredits} AI Credits / mo</li>
                 <li className="flex items-center"><CheckCircle size={14} className="mr-2 text-brand-violet"/> All standard features</li>
               </ul>

               <div className="space-y-3 pt-4 mb-8">
                 <div className="flex justify-between text-gray-400">
                   <span>Subtotal</span>
                   <span>{currencyCode} {formatCurrency(price)}</span>
                 </div>
                 <div className="flex justify-between text-gray-400">
                   <span>GST (18%)</span>
                   <span>{currencyCode} {formatCurrency(gstAmount)}</span>
                 </div>
                 <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10 mt-2">
                   <span>Total Payable</span>
                   <span>{currencyCode} {formatCurrency(totalAmount)}</span>
                 </div>
               </div>
               
               {referralCode && (
                 <div className="mb-6 p-2 bg-brand-cyan/10 text-brand-cyan text-xs text-center rounded border border-brand-cyan/20">
                   Referral Code Applied: <b>{referralCode}</b>
                 </div>
               )}

               <NeonButton fullWidth onClick={handlePayment} disabled={!currentUser} className="py-4 text-lg">
                 {currentUser ? (
                     <>Pay {currencyCode} {formatCurrency(totalAmount)} <ArrowRight size={20}/></>
                 ) : (
                     <>Log In to Checkout</>
                 )}
               </NeonButton>
               
               <div className="mt-4 flex flex-col items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                      <ShieldCheck size={14} /> Secure SSL Encrypted Payment
                  </div>
                  <p>By purchasing, you agree to our Terms of Service.</p>
               </div>
            </GlassCard>
          </div>
        </div>
      </Section>
    </div>
  );
};
