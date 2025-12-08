
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteConfig, CustomerProfile, PricingPlan, Task } from '../types';
import { DEFAULT_CONFIG } from '../constants';
import { useLocation } from 'react-router-dom';

interface CartItem extends PricingPlan {
  billingCycle: 'monthly' | 'yearly';
}

interface ConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: SiteConfig) => void;
  resetConfig: () => void;
  loading: boolean;
  currentUser: CustomerProfile | null;
  loginUser: (profile: CustomerProfile) => void;
  logoutUser: () => void;
  cart: CartItem | null;
  addToCart: (plan: PricingPlan, billingCycle: 'monthly' | 'yearly') => void;
  removeFromCart: () => void;
  referralCode: string | null;
  updateUserProfile: (data: Partial<CustomerProfile>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children?: ReactNode }) => {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CustomerProfile | null>(null);
  const [cart, setCart] = useState<CartItem | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // Capture Referral Code
  const location = useLocation(); 
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      sessionStorage.setItem('referral_code', ref);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('site-config-v2');
    const storedUser = localStorage.getItem('customer_session');
    const storedCart = localStorage.getItem('inflow_cart');
    
    if (stored) {
      try {
        const savedConfig = JSON.parse(stored);
        setConfig({ ...DEFAULT_CONFIG, ...savedConfig, pricingSnapshot: { ...DEFAULT_CONFIG.pricingSnapshot, ...savedConfig.pricingSnapshot }, projectTemplates: savedConfig.projectTemplates || DEFAULT_CONFIG.projectTemplates });
      } catch (e) {
        console.error("Failed to parse config", e);
        setConfig(DEFAULT_CONFIG);
      }
    }

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) { console.error(e); }
    }

    if (storedCart) {
        try {
            setCart(JSON.parse(storedCart));
        } catch (e) { console.error(e); }
    }

    setLoading(false);
  }, []);

  const updateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    localStorage.setItem('site-config-v2', JSON.stringify(newConfig));
  };

  const resetConfig = () => {
    if (window.confirm("Are you sure you want to reset all data?")) {
      setConfig(DEFAULT_CONFIG);
      localStorage.setItem('site-config-v2', JSON.stringify(DEFAULT_CONFIG));
      window.location.reload(); 
    }
  };

  const loginUser = (profile: CustomerProfile) => {
    // Ensure array fields exist
    const safeProfile = { 
        ...profile, 
        tasks: profile.tasks || [],
        walletTransactions: profile.walletTransactions || [],
        creditLedger: profile.creditLedger || [],
        creditUsage: profile.creditUsage || [],
        workflowRuns: profile.workflowRuns || [] 
    };
    setCurrentUser(safeProfile);
    localStorage.setItem('customer_session', JSON.stringify(safeProfile));
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('customer_session');
    // We do NOT clear cart on logout, user might want to buy as new user
  };

  const addToCart = (plan: PricingPlan, billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    const item = { ...plan, billingCycle };
    setCart(item);
    localStorage.setItem('inflow_cart', JSON.stringify(item));
  };

  const removeFromCart = () => {
    setCart(null);
    localStorage.removeItem('inflow_cart');
  };

  const updateUserProfile = (data: Partial<CustomerProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem('customer_session', JSON.stringify(updated));
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    if (!currentUser) return;
    const newTask: Task = { ...taskData, id: Date.now().toString(), history: [], dependencies: taskData.dependencies || [] };
    const updatedUser = { ...currentUser, tasks: [...(currentUser.tasks || []), newTask] };
    setCurrentUser(updatedUser);
    localStorage.setItem('customer_session', JSON.stringify(updatedUser));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!currentUser) return;
    const updatedTasks = (currentUser.tasks || []).map(t => {
      if (t.id === taskId) {
        const history = t.history || [];
        // Track status changes
        if (updates.status && updates.status !== t.status) {
          history.push({
            timestamp: new Date().toISOString(),
            field: 'status',
            oldValue: t.status,
            newValue: updates.status
          });
        }
        return { ...t, ...updates, history };
      }
      return t;
    });
    const updatedUser = { ...currentUser, tasks: updatedTasks };
    setCurrentUser(updatedUser);
    localStorage.setItem('customer_session', JSON.stringify(updatedUser));
  };

  const deleteTask = (taskId: string) => {
    if (!currentUser) return;
    const updatedTasks = (currentUser.tasks || []).filter(t => t.id !== taskId);
    const updatedUser = { ...currentUser, tasks: updatedTasks };
    setCurrentUser(updatedUser);
    localStorage.setItem('customer_session', JSON.stringify(updatedUser));
  };

  return (
    <ConfigContext.Provider value={{ 
      config, updateConfig, resetConfig, loading, currentUser, loginUser, logoutUser, 
      cart, addToCart, removeFromCart, referralCode, updateUserProfile,
      addTask, updateTask, deleteTask
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
