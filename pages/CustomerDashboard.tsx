
import React, { useState, useEffect, useMemo } from 'react';
import { useConfig } from '../services/configContext';
import { GlassCard, NeonButton, Badge, Modal } from '../components/Shared';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Zap, CreditCard, Clock, Play, FileText, Plus, Settings, LogOut, Briefcase, CheckSquare, Trash2, Calendar, AlertCircle, Edit2, Bell, Filter, Info, Wallet, ArrowUpRight, ArrowDownLeft, ArrowUp, ArrowDown, Lock, Link as LinkIcon, Activity, Download, Globe, Shield, AlertTriangle, FileCode, ArrowRight, Terminal } from 'lucide-react';
import { Task, WalletTransaction, CreditLedgerEntry, Project, ProjectTemplate, WorkflowRun } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { currentUser, updateTask, deleteTask } = useConfig();
  if (!currentUser) return null;
  
  const project = currentUser.projects?.find(p => p.id === task.projectId);
  const allTasks = currentUser.tasks || [];
  const blockingTasks = task.dependencies?.map(depId => allTasks.find(t => t.id === depId)).filter(t => t && t.status !== 'done') || [];
  const isBlocked = blockingTasks.length > 0;
  const priority = task.priority || 'medium';
  const isDone = task.status === 'done';
  const isOverdue = React.useMemo(() => {
    if (!task.dueDate || isDone) return false;
    const today = new Date(); today.setHours(0,0,0,0);
    const due = new Date(task.dueDate); due.setHours(0,0,0,0);
    return due < today;
  }, [task.dueDate, isDone]);

  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== 'todo' && isBlocked) {
        alert(`Cannot start this task. It is waiting for: \n${blockingTasks.map(t => `- ${t?.title}`).join('\n')}`);
        return;
    }
    updateTask(task.id, { status: newStatus as any });
  };

  const priorityColors = { low: "bg-green-500/20 text-green-400 border-green-500/30", medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", high: "bg-red-500/20 text-red-400 border-red-500/30" };
  let borderClasses = "border-white/5 hover:border-brand-cyan/30";
  if (isBlocked && !isDone) borderClasses = "border-orange-500/40 bg-orange-500/5";
  if (isOverdue) borderClasses = "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]";
  if (isDone) borderClasses = "border-green-500/30";

  return (
    <div className={`bg-white/5 border rounded-lg p-4 mb-3 transition-all duration-500 group relative ${borderClasses}`}>
      <div className="flex justify-between items-start mb-2">
         <h4 className={`font-bold text-sm transition-colors flex items-center gap-2 ${isDone ? 'text-gray-400 line-through' : 'text-white'}`}>{task.title} {isBlocked && !isDone && <Lock size={12} className="text-orange-400"/>}</h4>
         <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${priorityColors[priority]}`}>{priority}</div>
      </div>
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      {isBlocked && !isDone && <div className="mb-3 px-2 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded flex items-start gap-2"><AlertCircle size={12} className="text-orange-400 mt-0.5" /><span className="text-[10px] text-orange-300">Waiting for: {blockingTasks.map(t => t?.title).join(', ')}</span></div>}
      <div className="flex flex-wrap gap-2 mb-3 items-center">
         {project && <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30"><Briefcase size={10} className="mr-1.5" />{project.name}</span>}
         {task.dueDate && <span className={`flex items-center font-bold px-2 py-1 rounded border text-[10px] ${isOverdue ? 'text-red-400 bg-red-500/10 border-red-500/30 animate-pulse' : 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20'}`}><Calendar size={12} className="mr-1" />{new Date(task.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}{isOverdue && <span className="ml-1 text-red-500">⚠️</span>}</span>}
      </div>
      <div className="pt-3 border-t border-white/5 flex gap-2 items-center justify-between">
         <select value={task.status} onChange={(e) => handleStatusChange(e.target.value)} className={`text-xs rounded px-2 py-1 border outline-none focus:border-brand-cyan transition-colors ${isDone ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-black/20 border-white/10 text-gray-300'}`}><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option></select>
         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => onEdit(task)} className="text-brand-cyan hover:text-white p-1.5 hover:bg-white/10 rounded"><Edit2 size={14} /></button><button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-300 p-1.5 hover:bg-white/10 rounded"><Trash2 size={14} /></button></div>
      </div>
    </div>
  );
};

export const CustomerDashboard = () => {
  const { currentUser, logoutUser, config, updateUserProfile, addTask, updateTask } = useConfig();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'wallet' | 'settings'>('dashboard');
  
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [selectedWorkflowTitle, setSelectedWorkflowTitle] = useState<string>('');
  const [command, setCommand] = useState('');
  const [workflowResult, setWorkflowResult] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [creditQuantity, setCreditQuantity] = useState(100);

  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(1000);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState<string>(''); 

  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [isRunLogModalOpen, setIsRunLogModalOpen] = useState(false);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({ title: '', priority: 'medium', status: 'todo', projectId: '', dueDate: '', dependencies: [] });
  const [taskProjectFilter, setTaskProjectFilter] = useState<string>('all');

  const [showNotifications, setShowNotifications] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<{id: string, type: 'alert'|'info'|'success', text: string}[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const availableWorkflows = useMemo(() => {
    return config.employees.flatMap(emp => 
      emp.n8nWorkflows.map(wf => ({
        ...wf,
        employeeName: emp.name
      }))
    );
  }, [config.employees]);

  const availableTemplates = config.projectTemplates || [];
  const currentPlan = config.pricingSnapshot.plans.find(p => p.id === currentUser?.planId) || config.pricingSnapshot.plans[0];
  const daysRemaining = currentUser ? Math.max(0, Math.ceil((new Date(currentUser.subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 0;
  const isExpired = daysRemaining <= 0;
  const creditPricePer1000 = currentPlan.additionalCreditPrice || 5000;
  const creditPricePerUnit = creditPricePer1000 / 1000;
  const currencyCode = config.razorpay?.currency || "INR";

  const openPurchaseCreditsModal = () => setIsCreditModalOpen(true);
  const handleRenewSubscription = () => setIsRenewalModalOpen(true);
  
  const selectedWorkflow = useMemo(() => {
    return availableWorkflows.find(wf => wf.title === selectedWorkflowTitle);
  }, [availableWorkflows, selectedWorkflowTitle]);

  const totalDays = 30; 
  const progressPercentage = Math.min(100, Math.max(0, (daysRemaining / totalDays) * 100));
  const expiryDateFormatted = currentUser ? new Date(currentUser.subscriptionEndDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : '';

  useEffect(() => {
    if (!currentUser) { navigate('/hire'); return; }
    const msgs: {id: string, type: 'alert'|'info'|'success', text: string}[] = [];
    if (isExpired) msgs.push({ id: 'expired', type: 'alert', text: 'Subscription Expired. Workflows Halted.' });
    else if (daysRemaining < 7) msgs.push({ id: 'exp-soon', type: 'alert', text: `Subscription expires in ${daysRemaining} days` });
    if ((currentUser.walletBalance || 0) < 500) msgs.push({ id: 'low-bal', type: 'alert', text: `Low Wallet Balance (< ${currencyCode} 500)` });
    setLocalNotifications(msgs);
  }, [currentUser, navigate, isExpired, daysRemaining, currencyCode]);

  if (!currentUser) return null;

  const currentProjectsCount = currentUser.projects?.length || 0;
  const isPlanLimitReached = currentProjectsCount >= currentPlan.maxProjects;
  
  const creditLedger = currentUser.creditLedger || [];
  const totalCreditsConsumed = creditLedger.reduce((acc, curr) => acc + (curr.creditsConsumed || 0), 0);
  const pendingCredits = creditLedger.filter(l => l.status === 'pending').reduce((acc, curr) => acc + (curr.creditsAdded || 0), 0);
  
  const handleAddProjectClick = () => {
    if (isPlanLimitReached) { setShowLimitModal(true); return; }
    setNewProjectName(''); setNewProjectType(''); setFormErrors({}); setIsProjectModalOpen(true);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) { setFormErrors({projectName: 'Project Name required'}); return; }
    if (!newProjectType) { setFormErrors({projectType: 'Please select a type'}); return; }
    
    if ((currentUser.projects?.length || 0) >= currentPlan.maxProjects) { setShowLimitModal(true); setIsProjectModalOpen(false); return; }
    
    const projectId = Date.now().toString();
    const tmpl = availableTemplates.find(t => t.id === newProjectType);
    
    let uniqueWebhook = '';
    if (tmpl?.webhookUrlTemplate) {
         const separator = tmpl.webhookUrlTemplate.includes('?') ? '&' : '?';
         uniqueWebhook = `${tmpl.webhookUrlTemplate}${separator}userId=${currentUser.id}&projectId=${projectId}`;
    }

    const newProj: Project = { 
        id: projectId, 
        name: newProjectName.trim(), 
        status: 'active', 
        templateId: newProjectType,
        webhookUrl: uniqueWebhook, 
        aiCreditCost: tmpl?.aiCreditCost || 10,
        workflowCountLimit: tmpl?.defaultWorkflowCount || 100,
        runCount: 0 
    };
    updateUserProfile({ projects: [...(currentUser.projects || []), newProj] });
    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
       const updatedProjects = (currentUser.projects || []).filter(p => p.id !== id);
       updateUserProfile({ projects: updatedProjects });
       if (activeProject === id) setActiveProject(null);
    }
  };

  const handleRunWorkflow = async () => {
    if (isExpired) { alert("SUBSCRIPTION EXPIRED. Please renew to run workflows."); return; }
    if (!activeProject) { alert("Select a project first"); return; }
    
    const project = currentUser.projects.find(p => p.id === activeProject);
    if (!project) return;

    if (!selectedWorkflowTitle) { alert("Select a workflow first"); return; }

    // Check Run Limit
    if (project.workflowCountLimit && (project.runCount || 0) >= project.workflowCountLimit) {
        alert(`Project Run Limit Reached (${project.runCount}/${project.workflowCountLimit}). Please upgrade or contact support.`);
        return;
    }

    const cost = project.aiCreditCost || 10;
    if (currentUser.aiCredits < cost) { alert(`Insufficient Credits. Cost: ${cost}, Available: ${currentUser.aiCredits}`); return; }

    setIsExecuting(true);
    setWorkflowResult(null);
    setExecutionLog(["🚀 Initializing workflow engine..."]);

    const payload = {
        projectId: project.id,
        userId: currentUser.id,
        workflow: selectedWorkflowTitle,
        input: command,
        timestamp: new Date().toISOString(),
        credits: cost
    };

    setTimeout(() => setExecutionLog(prev => [...prev, "🔐 Authenticating secure session..."]), 500);

    let responseSummary = "";
    let status: 'success' | 'failed' = 'success';

    try {
        if (project.webhookUrl && project.webhookUrl.startsWith('http')) {
            setTimeout(() => setExecutionLog(prev => [...prev, `📡 Connecting to external webhook...`]), 1000);
            
            try {
                const res = await fetch(project.webhookUrl, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentUser.id}`
                    },
                    body: JSON.stringify(payload)
                });
                
                if (res.ok) {
                    const json = await res.json().catch(() => ({ status: 'ok' }));
                    responseSummary = "Webhook Response: " + JSON.stringify(json);
                    setExecutionLog(prev => [...prev, "✅ Payload delivered. Response received."]);
                } else {
                    throw new Error(`API Error: ${res.statusText}`);
                }
            } catch (e) {
                console.warn("Webhook fetch failed", e);
                setExecutionLog(prev => [...prev, "⚠️ Connection timeout. Switching to simulation mode."]);
                await new Promise(resolve => setTimeout(resolve, 1500));
                responseSummary = "Simulation: Workflow executed successfully (Webhook unreachable in demo).";
            }
        } else {
            setTimeout(() => setExecutionLog(prev => [...prev, "⚡ Simulating local execution environment..."]), 1000);
            await new Promise(resolve => setTimeout(resolve, 2000));
            responseSummary = "Simulation: Workflow executed successfully. Data processed.";
        }
        
        setExecutionLog(prev => [...prev, "💾 Generating execution report..."]);
        setExecutionLog(prev => [...prev, `💰 Deducting ${cost} AI credits...`]);

    } catch (e) {
        status = 'failed';
        responseSummary = "Execution Failed.";
        setExecutionLog(prev => [...prev, "❌ Execution Failed."]);
    }

    const runId = 'run_' + Date.now();

    const newLedgerEntry: CreditLedgerEntry = {
        id: 'ledger_' + Date.now(),
        userId: currentUser.id,
        date: new Date().toISOString(),
        creditsAdded: 0,
        creditsConsumed: cost,
        source: 'usage',
        status: 'approved',
        description: `Run: ${project.name} - ${selectedWorkflowTitle}`
    };

    const newRunLog: WorkflowRun = {
        id: runId,
        projectId: project.id,
        templateName: availableTemplates.find(t=>t.id===project.templateId)?.name || 'Custom',
        timestamp: new Date().toISOString(),
        status: status,
        inputs: command,
        responseSummary: responseSummary,
        creditsDeducted: cost
    };

    const updatedProjects = currentUser.projects.map(p => 
        p.id === project.id ? { ...p, runCount: (p.runCount || 0) + 1 } : p
    );

    updateUserProfile({ 
        aiCredits: Math.max(0, currentUser.aiCredits - cost),
        creditLedger: [newLedgerEntry, ...(currentUser.creditLedger || [])],
        workflowRuns: [newRunLog, ...(currentUser.workflowRuns || [])],
        projects: updatedProjects
    });
    
    setIsExecuting(false);
    setWorkflowResult(status === 'success' ? `✅ Success! ${cost} Credits deducted.` : `❌ Failed.`);
  };

  const handleDownloadReport = (run: WorkflowRun) => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(run, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `report_${run.id}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  const handleTopUp = () => {
    if (topUpAmount < 100) return;
    
    // Check if configured for Razorpay
    if (config.razorpay.enabled) {
        // Trigger Razorpay logic (Assuming Script is loaded in index.html)
        const options = {
            key: config.razorpay.keyId,
            amount: topUpAmount * 100,
            currency: currencyCode,
            name: "InFlow Automation",
            description: "Wallet Top Up",
            image: "https://storage.googleapis.com/digital-employee/HOME/HOME%20NEW.png",
            handler: function(response: any) {
                updateUserProfile({ 
                    walletBalance: (currentUser.walletBalance || 0) + topUpAmount, 
                    walletTransactions: [{
                        id: response.razorpay_payment_id || 'tx_'+Date.now(), 
                        type: 'credit', 
                        amount: topUpAmount, 
                        description: 'Wallet Top Up via Razorpay', 
                        date: new Date().toISOString()
                    }, ...(currentUser.walletTransactions||[])] 
                });
                setIsTopUpModalOpen(false);
                alert("Payment Successful! Wallet Updated.");
            },
            prefill: {
                name: currentUser.name,
                email: currentUser.email,
                contact: currentUser.phone
            },
            theme: { color: "#6C28FF" }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    } else {
        // Fallback
        updateUserProfile({ walletBalance: (currentUser.walletBalance || 0) + topUpAmount, walletTransactions: [{id: 'tx_'+Date.now(), type: 'credit', amount: topUpAmount, description: 'Top Up', date: new Date().toISOString()}, ...(currentUser.walletTransactions||[])] });
        setIsTopUpModalOpen(false);
    }
  };
  
  const executePurchaseCredits = () => {
    if (creditQuantity <= 0) { alert("Invalid quantity"); return; }
    const cost = Math.ceil(creditQuantity * creditPricePerUnit);
    if ((currentUser.walletBalance || 0) < cost) { alert(`Insufficient funds. Cost is ${currencyCode} ${cost}`); return; }
    
    // Approval Logic: Small amounts (<1000) auto-approved, large amounts pending
    const isAutoApproved = creditQuantity < 1000;
    const status = isAutoApproved ? 'approved' : 'pending';

    const newTx: WalletTransaction = {
      id: 'tx_' + Date.now(),
      type: 'debit',
      amount: cost,
      description: `Purchased ${creditQuantity} AI Credits (${status})`,
      date: new Date().toISOString()
    };

    const newLedgerEntry: CreditLedgerEntry = {
        id: 'ledger_' + Date.now(),
        userId: currentUser.id,
        date: new Date().toISOString(),
        creditsAdded: creditQuantity,
        creditsConsumed: 0,
        source: 'purchase',
        status: status,
        description: isAutoApproved ? 'Wallet Purchase (Auto-Approved)' : 'Pending Admin Approval'
    };

    updateUserProfile({
      walletBalance: (currentUser.walletBalance || 0) - cost,
      // Only increment available credits if approved
      aiCredits: isAutoApproved ? currentUser.aiCredits + creditQuantity : currentUser.aiCredits,
      walletTransactions: [newTx, ...(currentUser.walletTransactions || [])],
      creditLedger: [newLedgerEntry, ...(currentUser.creditLedger || [])]
    });
    
    setIsCreditModalOpen(false);
    alert(isAutoApproved ? "Purchase successful!" : "Purchase Pending Approval.");
  };

  const handleRenew = () => {
      const cost = currentPlan.monthlyPrice * 1.18;
      if ((currentUser.walletBalance || 0) < cost) { setTopUpAmount(Math.ceil(cost - (currentUser.walletBalance || 0))); setIsTopUpModalOpen(true); return; }
      const end = new Date(currentUser.subscriptionEndDate); const newEnd = new Date(end.getTime()>Date.now()?end:new Date()); newEnd.setDate(newEnd.getDate()+30);
      updateUserProfile({ walletBalance: (currentUser.walletBalance || 0) - cost, subscriptionEndDate: newEnd.toISOString(), walletTransactions: [{id:'tx_renew_'+Date.now(), type:'debit', amount:cost, description:'Renewal', date:new Date().toISOString()}, ...(currentUser.walletTransactions||[])], subscriptionStatus: 'active' });
      setIsRenewalModalOpen(false);
  };

  const openCreateTaskModal = () => { setNewTask({ title: '', priority: 'medium', status: 'todo', projectId: taskProjectFilter !== 'all' ? taskProjectFilter : '', dueDate: new Date().toISOString(), dependencies: [] }); setEditingId(null); setFormErrors({}); setIsTaskModalOpen(true); };
  const openEditTaskModal = (task: Task) => { setNewTask(task); setEditingId(task.id); setFormErrors({}); setIsTaskModalOpen(true); };
  const handleSaveTask = (e: React.FormEvent) => { 
      e.preventDefault(); 
      if(!newTask.title) { setFormErrors({taskTitle: "Title required"}); return; }
      
      const taskPayload = {
          title: newTask.title,
          description: newTask.description || '',
          priority: (newTask.priority as any) || 'medium',
          status: (newTask.status as any) || 'todo',
          projectId: newTask.projectId || '',
          dueDate: newTask.dueDate || new Date().toISOString(),
          dependencies: newTask.dependencies || []
      } as Task;

      if(editingId) updateTask(editingId, taskPayload); 
      else addTask(taskPayload); 
      
      setIsTaskModalOpen(false); 
  };
  const toggleDependency = (id:string) => { const deps = newTask.dependencies || []; if(deps.includes(id)) setNewTask({...newTask, dependencies: deps.filter(d=>d!==id)}); else setNewTask({...newTask, dependencies: [...deps, id]}); };

  // ... (SettingsManager same as previous)
  const SettingsManager = () => {
      const [formData, setFormData] = useState({ name: currentUser.name, businessName: currentUser.businessName || '', email: currentUser.email, phone: currentUser.phone, gstNo: currentUser.gstNo || '' });
      return (
          <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <GlassCard><h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings size={20} className="text-brand-cyan"/> Profile Settings</h3><div className="space-y-4"><div><label className="text-xs text-gray-500 uppercase font-bold">Full Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white mt-1"/></div><div><label className="text-xs text-gray-500 uppercase font-bold">Business Name</label><input value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white mt-1"/></div><NeonButton onClick={() => { updateUserProfile(formData); alert("Saved!"); }} className="mt-4">Save Changes</NeonButton></div></GlassCard>
                  <GlassCard><h3 className="text-xl font-bold mb-6 flex items-center gap-2"><CreditCard size={20} className="text-brand-cyan"/> Billing & Renewal</h3><div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4"><div className="flex justify-between items-center mb-2"><span className="text-gray-400 text-sm">Active Plan</span><Badge color="cyan">{currentPlan.name}</Badge></div><div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Next Billing</span><span className={`font-bold ${daysRemaining < 7 ? 'text-red-400' : 'text-white'}`}>{new Date(currentUser.subscriptionEndDate).toLocaleDateString()} ({daysRemaining} days)</span></div></div><div className="flex gap-3"><NeonButton fullWidth onClick={() => setIsRenewalModalOpen(true)}>Renew Subscription</NeonButton><NeonButton fullWidth variant="outline" onClick={() => alert("Invoice downloaded (Mock)")}>Download Invoice</NeonButton></div></GlassCard>
              </div>
          </div>
      );
  };

  // ... (TaskManager same as previous)
  const TaskManager = () => {
    const allTasks = currentUser.tasks || [];
    const tasks = useMemo(() => { if (taskProjectFilter === 'all') return allTasks; return allTasks.filter(t => t.projectId === taskProjectFilter); }, [allTasks, taskProjectFilter]);
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
           <div className="flex items-center gap-3 w-full sm:w-auto"><div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10 w-full sm:w-auto"><Filter size={14} className="text-gray-400" /><select value={taskProjectFilter} onChange={(e) => setTaskProjectFilter(e.target.value)} className="bg-transparent text-sm text-white outline-none border-none cursor-pointer w-full sm:w-auto"><option value="all" className="bg-brand-dark">All Projects</option>{currentUser.projects?.map(p => (<option key={p.id} value={p.id} className="bg-brand-dark">{p.name}</option>))}</select></div></div>
           <NeonButton onClick={openCreateTaskModal} className="py-2 px-4 text-sm w-full sm:w-auto"><Plus size={16} className="mr-2" /> New Task</NeonButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-black/20 rounded-xl p-4 border border-white/5 min-h-[500px]"><h3 className="font-bold mb-4 text-brand-cyan">To Do</h3><div className="space-y-3">{tasks.filter(t => t.status === 'todo').map(t => <TaskCard key={t.id} task={t} onEdit={openEditTaskModal}/>)}</div></div>
           <div className="bg-black/20 rounded-xl p-4 border border-white/5 min-h-[500px]"><h3 className="font-bold mb-4 text-yellow-400">In Progress</h3><div className="space-y-3">{tasks.filter(t => t.status === 'in-progress').map(t => <TaskCard key={t.id} task={t} onEdit={openEditTaskModal}/>)}</div></div>
           <div className="bg-black/20 rounded-xl p-4 border border-white/5 min-h-[500px]"><h3 className="font-bold mb-4 text-green-400">Done</h3><div className="space-y-3">{tasks.filter(t => t.status === 'done').map(t => <TaskCard key={t.id} task={t} onEdit={openEditTaskModal}/>)}</div></div>
        </div>
      </div>
    );
  };

  // ... (WalletManager same as previous)
  const WalletManager = () => {
    const [viewMode, setViewMode] = useState<'transactions' | 'ledger'>('transactions');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

    const transactions = currentUser.walletTransactions || [];
    const ledger = currentUser.creditLedger || [];

    const sortedData = useMemo(() => {
      const data = viewMode === 'transactions' ? [...transactions] : [...ledger];
      return data.sort((a: any, b: any) => {
        let aValue = a[sortConfig.key] || '';
        let bValue = b[sortConfig.key] || '';
        if (typeof aValue === 'string') { aValue = aValue.toLowerCase(); bValue = bValue.toLowerCase(); }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }, [transactions, ledger, viewMode, sortConfig]);

    const requestSort = (key: string) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') { direction = 'desc'; }
      setSortConfig({ key, direction });
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (sortConfig.key !== column) return <ArrowDownLeft size={14} className="opacity-0 group-hover:opacity-30 ml-1 inline" />;
        return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-brand-cyan ml-1 inline" /> : <ArrowDown size={14} className="text-brand-cyan ml-1 inline" />;
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="col-span-1 md:col-span-2 bg-gradient-to-br from-brand-dark to-brand-violet/10 border border-brand-violet/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/20 rounded-full blur-[80px] -mr-10 -mt-10" />
             <div className="relative z-10">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <span className="text-gray-400 uppercase text-xs font-bold tracking-wider flex items-center gap-2 mb-2"><Wallet size={16} /> Total Balance</span>
                   <h2 className="text-5xl font-bold text-white tracking-tight">{currencyCode} {(currentUser.walletBalance || 0).toLocaleString('en-IN')}</h2>
                 </div>
                 <NeonButton onClick={() => { setTopUpAmount(1000); setIsTopUpModalOpen(true); }} className="shadow-lg">
                   <Plus size={18} className="mr-2" /> Add Funds
                 </NeonButton>
               </div>
               <div className="flex gap-4">
                 <div className="bg-black/30 rounded-lg p-3 border border-white/10 flex items-center gap-3 flex-1">
                   <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center"><ArrowDownLeft size={20} /></div>
                   <div>
                     <p className="text-xs text-gray-500">Funds Added</p>
                     <p className="font-bold text-white">{currencyCode} {transactions.filter(t => t.type === 'credit').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
                   </div>
                 </div>
                 <div className="bg-black/30 rounded-lg p-3 border border-white/10 flex items-center gap-3 flex-1">
                   <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center"><ArrowUpRight size={20} /></div>
                   <div>
                     <p className="text-xs text-gray-500">Total Spent</p>
                     <p className="font-bold text-white">{currencyCode} {transactions.filter(t => t.type === 'debit').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
                   </div>
                 </div>
               </div>
             </div>
          </GlassCard>
          
          <GlassCard className="flex flex-col justify-center border-brand-cyan/20">
             <div className="mb-4 flex justify-between items-start">
                <span className="text-xs text-brand-cyan uppercase font-bold tracking-wider flex items-center gap-2 mb-2"><Activity size={16} /> AI Credits</span>
                {pendingCredits > 0 && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/30 flex items-center gap-1"><Clock size={10}/> {pendingCredits} Pending</span>}
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                   <span className="text-gray-400 text-sm">Available</span>
                   <span className="font-bold text-xl text-brand-cyan">{currentUser.aiCredits}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                   <span className="text-gray-400 text-sm">Consumed</span>
                   <span className="font-bold text-xl text-white">{totalCreditsConsumed}</span>
                </div>
                <div className="text-[10px] text-center text-gray-500 italic mt-1">
                   *Credits carry over automatically.
                </div>
                <button onClick={openPurchaseCreditsModal} className="w-full mt-2 text-center p-3 rounded-lg bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan font-bold transition-colors">
                  Buy More Credits
                </button>
             </div>
          </GlassCard>
        </div>

        <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
           <div className="p-4 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5">
             <div className="flex items-center gap-4 bg-black/40 p-1 rounded-lg">
                <button onClick={() => setViewMode('transactions')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'transactions' ? 'bg-white/10 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>Transactions ({currencyCode})</button>
                <button onClick={() => setViewMode('ledger')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'ledger' ? 'bg-white/10 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>Credit Ledger (AI)</button>
             </div>
             <button className="text-xs text-brand-cyan hover:underline">Export CSV</button>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-white/5 text-gray-500 uppercase text-xs">
                 <tr>
                   <th className="p-4 cursor-pointer hover:text-white" onClick={() => requestSort('date')}>Date <SortIcon column="date" /></th>
                   <th className="p-4 cursor-pointer hover:text-white" onClick={() => requestSort('description')}>Description <SortIcon column="description" /></th>
                   {viewMode === 'transactions' ? (
                        <>
                            <th className="p-4 cursor-pointer hover:text-white" onClick={() => requestSort('id')}>ID <SortIcon column="id" /></th>
                            <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => requestSort('amount')}>Amount <SortIcon column="amount" /></th>
                            <th className="p-4 text-center">Status</th>
                        </>
                   ) : (
                        <>
                            <th className="p-4 cursor-pointer hover:text-white" onClick={() => requestSort('source')}>Source <SortIcon column="source" /></th>
                            <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => requestSort('creditsAdded')}>Added <SortIcon column="creditsAdded" /></th>
                            <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => requestSort('creditsConsumed')}>Consumed <SortIcon column="creditsConsumed" /></th>
                            <th className="p-4 text-center cursor-pointer hover:text-white" onClick={() => requestSort('status')}>Status <SortIcon column="status" /></th>
                        </>
                   )}
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {sortedData.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">No logs found.</td></tr>
                 ) : (
                    sortedData.map((item: any) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-gray-400 whitespace-nowrap">{new Date(item.date).toLocaleDateString()} <span className="text-xs text-gray-600 ml-1">{new Date(item.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span></td>
                        <td className="p-4 font-medium text-white">{item.description}</td>
                        {viewMode === 'transactions' ? (
                            <>
                                <td className="p-4 text-gray-500 font-mono text-xs">{item.id.split('_')[1]}</td>
                                <td className={`p-4 text-right font-bold ${item.type === 'credit' ? 'text-green-400' : 'text-white'}`}>{item.type === 'credit' ? '+' : '-'} {currencyCode} {item.amount.toLocaleString()}</td>
                                <td className="p-4 text-center"><Badge color="cyan">Success</Badge></td>
                            </>
                        ) : (
                            <>
                                <td className="p-4 capitalize text-gray-400">{item.source}</td>
                                <td className="p-4 text-right font-bold text-green-400">{item.creditsAdded > 0 ? `+${item.creditsAdded}` : '-'}</td>
                                <td className="p-4 text-right font-bold text-red-400">{item.creditsConsumed > 0 ? `-${item.creditsConsumed}` : '-'}</td>
                                <td className="p-4 text-center">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${item.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </>
                        )}
                      </tr>
                    ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-20 flex">
      {/* Sidebar - Same as previous */}
      <div className="w-64 glass-panel border-r border-white/10 hidden md:flex flex-col fixed h-full top-20 left-0 bg-black/40 z-10">
        <div className="p-6">
          <div className="w-16 h-16 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan text-2xl font-bold mb-4 border border-brand-cyan/30">
            {currentUser.name.charAt(0)}
          </div>
          <h3 className="font-bold truncate text-white">{currentUser.name}</h3>
          <p className="text-xs text-gray-400 truncate">{currentUser.businessName}</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {/* Nav Buttons */}
          <button onClick={() => setActiveTab('dashboard')} className={`w-full px-4 py-2 rounded-lg font-bold flex items-center gap-3 text-left transition-colors ${activeTab === 'dashboard' ? 'bg-brand-violet/20 text-brand-cyan border border-brand-violet/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><LayoutDashboard size={18} /> Dashboard</button>
          <button onClick={() => setActiveTab('tasks')} className={`w-full px-4 py-2 rounded-lg font-bold flex items-center gap-3 text-left transition-colors ${activeTab === 'tasks' ? 'bg-brand-violet/20 text-brand-cyan border border-brand-violet/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><CheckSquare size={18} /> Tasks</button>
          <button onClick={() => setActiveTab('wallet')} className={`w-full px-4 py-2 rounded-lg font-bold flex items-center gap-3 text-left transition-colors ${activeTab === 'wallet' ? 'bg-brand-violet/20 text-brand-cyan border border-brand-violet/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><Wallet size={18} /> Wallet</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full px-4 py-2 rounded-lg font-bold flex items-center gap-3 text-left transition-colors ${activeTab === 'settings' ? 'bg-brand-violet/20 text-brand-cyan border border-brand-violet/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><Settings size={18} /> Settings</button>
        </nav>
        <div className="p-6 border-t border-white/10">
           <button onClick={() => { logoutUser(); navigate('/'); }} className="flex items-center gap-2 text-red-400 hover:text-white text-sm transition-colors"><LogOut size={16} /> Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-8 overflow-y-auto min-h-screen relative">
         {/* Expiry Banner */}
         {isExpired && (
             <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6 flex items-center justify-between animate-pulse">
                 <div className="flex items-center gap-3">
                     <AlertTriangle size={24} />
                     <div>
                         <h3 className="font-bold">Subscription Expired</h3>
                         <p className="text-sm">Your webhooks are paused. Renew now to resume workflows.</p>
                     </div>
                 </div>
                 <NeonButton onClick={handleRenewSubscription} className="text-xs py-2 h-auto">Renew Now</NeonButton>
             </div>
         )}

         {/* Header */}
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              {activeTab === 'tasks' ? 'Task Manager' : activeTab === 'wallet' ? 'My Wallet' : activeTab === 'settings' ? 'Settings' : 'Command Center'}
            </h1>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors relative">
                <Bell size={20} />
                {(localNotifications.length > 0) && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-brand-dark animate-pulse" />}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                   <div className="p-4 border-b border-white/10 font-bold">Notifications</div>
                   <div className="max-h-64 overflow-y-auto">
                       {localNotifications.length === 0 ? <div className="p-4 text-gray-500 text-center text-sm">No new alerts.</div> : localNotifications.map(n => (
                           <div key={n.id} className="p-3 border-b border-white/5 text-sm text-gray-300">{n.text}</div>
                       ))}
                   </div>
                </div>
              )}
            </div>
         </div>

         {/* Views */}
         {activeTab === 'tasks' ? <TaskManager /> : activeTab === 'wallet' ? <WalletManager /> : activeTab === 'settings' ? <SettingsManager /> : (
            <>
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <GlassCard className="p-4 flex flex-col justify-between">
                    <span className="text-xs text-gray-400 uppercase font-bold flex items-center gap-2"><Briefcase size={14}/> Active Projects</span>
                    <div className="text-2xl font-bold mt-2 text-white">{currentProjectsCount} / {currentPlan.maxProjects}</div>
                  </GlassCard>
                  <GlassCard className="p-4 flex flex-col justify-between">
                    <span className="text-xs text-gray-400 uppercase font-bold flex items-center gap-2"><Zap size={14}/> Available Credits</span>
                    <div className="text-2xl font-bold mt-2 text-brand-cyan">{currentUser.aiCredits}</div>
                    <button onClick={openPurchaseCreditsModal} className="text-xs text-brand-cyan mt-1 hover:underline text-left font-bold">+ Buy Credits</button>
                  </GlassCard>
                  <GlassCard className="p-4 flex flex-col justify-between">
                    <span className="text-xs text-gray-400 uppercase font-bold flex items-center gap-2"><CreditCard size={14}/> Wallet Balance</span>
                    <div className="text-2xl font-bold mt-2 text-white">{currencyCode} {(currentUser.walletBalance || 0).toLocaleString('en-IN')}</div>
                    <button onClick={() => { setIsTopUpModalOpen(true); }} className="text-xs text-brand-cyan mt-1 hover:underline text-left font-bold">+ Top Up</button>
                  </GlassCard>
                  <GlassCard className={`p-4 flex flex-col justify-between ${isExpired ? 'border-red-500/50 bg-red-500/5' : ''}`}>
                    <div className="flex justify-between items-start">
                        <span className="text-xs text-gray-400 uppercase font-bold flex items-center gap-2"><Clock size={14}/> Subscription</span>
                        {daysRemaining <= 5 && !isExpired && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded animate-pulse">Expiring Soon</span>}
                    </div>
                    
                    <div className="mt-2">
                        <div className={`text-2xl font-bold ${isExpired ? 'text-red-400' : 'text-white'}`}>
                            {isExpired ? "EXPIRED" : `${daysRemaining} Days`}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {isExpired ? `Expired on ${expiryDateFormatted}` : `Renews on ${expiryDateFormatted}`}
                        </div>
                    </div>

                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ${daysRemaining < 5 ? 'bg-red-500' : 'bg-brand-cyan'}`} 
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>

                    <button onClick={() => setIsRenewalModalOpen(true)} className="text-xs text-brand-cyan mt-3 hover:underline text-left font-bold flex items-center gap-1">
                        {isExpired ? "Renew to Reactivate" : "Extend Plan"} <ArrowRight size={10} />
                    </button>
                  </GlassCard>
              </div>

              {/* Workflow Runner */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <GlassCard className={`min-h-[400px] border ${isExecuting ? 'border-brand-cyan shadow-[0_0_20px_rgba(6,228,218,0.2)]' : 'border-brand-violet/20'}`}>
                      <div className="flex items-center gap-2 mb-6">
                          <Zap className="text-brand-violet" size={24}/> 
                          <h2 className="text-xl font-bold">Run Workflow</h2>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Select Project</label>
                            <select 
                              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-cyan outline-none transition-colors"
                              value={activeProject || ''}
                              onChange={e => setActiveProject(e.target.value)}
                            >
                              <option value="">-- Choose Project --</option>
                              {currentUser.projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Select Workflow</label>
                            <select 
                              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-cyan outline-none transition-colors"
                              value={selectedWorkflowTitle}
                              onChange={e => setSelectedWorkflowTitle(e.target.value)}
                            >
                              <option value="">-- Choose Workflow --</option>
                              {availableWorkflows.map((wf, idx) => (
                                <option key={idx} value={wf.title}>{wf.employeeName}: {wf.title}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {selectedWorkflow && (
                          <div className="bg-brand-violet/10 border border-brand-violet/20 p-4 rounded-lg flex items-start gap-4 animate-in fade-in slide-in-from-top-1">
                             <div className="mt-1 p-2 bg-brand-violet/20 rounded-full"><Info size={20} className="text-brand-cyan" /></div>
                             <div className="flex-1">
                               <span className="text-xs font-bold text-brand-cyan uppercase block mb-1">Workflow Summary</span>
                               <p className="text-sm text-gray-200 leading-relaxed">{selectedWorkflow.summary}</p>
                             </div>
                          </div>
                        )}

                        <div className="relative">
                          <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">
                            {selectedWorkflow ? `Input Parameters for '${selectedWorkflow.title}'` : 'Input Parameters'}
                          </label>
                          <textarea 
                            value={command}
                            onChange={e => setCommand(e.target.value)}
                            className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono focus:border-brand-cyan outline-none resize-none transition-colors"
                            placeholder={selectedWorkflowTitle ? `Enter specific data inputs required for the ${selectedWorkflowTitle} workflow...` : "Select a workflow first to see input requirements..."}
                            disabled={!selectedWorkflowTitle}
                          />
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-xs text-gray-500">{activeProject ? `Cost: ${currentUser.projects.find(p=>p.id===activeProject)?.aiCreditCost || 10} Credits` : 'Select project to see cost'}</span>
                            <NeonButton onClick={handleRunWorkflow} disabled={!activeProject || !selectedWorkflowTitle || isExecuting}>
                              {isExecuting ? 'Running...' : <><Play size={16} className="mr-2" /> Execute Workflow</>}
                            </NeonButton>
                          </div>
                        </div>
                      </div>

                      {(isExecuting || workflowResult || executionLog.length > 0) && (
                        <div className="mt-6 p-4 bg-black/60 border border-white/10 rounded-lg font-mono text-xs max-h-40 overflow-y-auto custom-scrollbar">
                           {executionLog.map((log, i) => (
                               <div key={i} className="mb-1 text-gray-300 animate-in fade-in slide-in-from-left-2 duration-300">
                                   <span className="text-brand-cyan mr-2">$</span>{log}
                               </div>
                           ))}
                           {workflowResult && (
                               <div className={`mt-2 font-bold ${workflowResult.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                                   <span className="mr-2">{'>>'}</span>{workflowResult}
                               </div>
                           )}
                        </div>
                      )}
                    </GlassCard>

                    <GlassCard>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Recent Reports</h3>
                            <button onClick={() => setIsRunLogModalOpen(true)} className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-bold">View All <ArrowRight size={12} /></button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left text-gray-400">
                            <thead className="bg-white/5 text-gray-500 uppercase text-xs">
                              <tr><th className="p-3 rounded-l-lg">Date</th><th className="p-3">Project</th><th className="p-3">Status</th><th className="p-3 rounded-r-lg">Credits</th></tr>
                            </thead>
                            <tbody>
                              {(currentUser.workflowRuns || []).slice(0, 5).map(run => (
                                  <tr key={run.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                      <td className="p-3">{new Date(run.timestamp).toLocaleDateString()}</td>
                                      <td className="p-3">{currentUser.projects.find(p=>p.id===run.projectId)?.name || 'Unknown'}</td>
                                      <td className="p-3"><Badge color={run.status==='success'?'cyan':'violet'}>{run.status}</Badge></td>
                                      <td className="p-3 font-bold text-white">{run.creditsDeducted}</td>
                                  </tr>
                              ))}
                              {(currentUser.workflowRuns || []).length === 0 && (
                                  <tr><td colSpan={4} className="p-4 text-center text-gray-500 italic">No recent workflow runs.</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                    </GlassCard>
                  </div>

                  <div className="space-y-6">
                    <GlassCard>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold">My Projects</h3>
                          <button 
                            onClick={handleAddProjectClick} 
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-colors border ${isPlanLimitReached ? 'border-gray-700 text-gray-500 cursor-not-allowed' : 'border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/20'}`}
                            title={isPlanLimitReached ? "Plan Limit Reached" : "Add New Project"}
                          >
                            <Plus size={14}/> Add Project
                          </button>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {currentUser.projects?.length === 0 && <p className="text-gray-500 text-sm">No active projects.</p>}
                          {currentUser.projects?.map(p => (
                            <div key={p.id} className="p-3 bg-white/5 rounded-lg border border-white/5 flex flex-col gap-1">
                              <div className="flex justify-between items-center">
                                  <span className="font-bold text-sm truncate max-w-[150px]" title={p.name}>{p.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                    <button 
                                      onClick={() => handleDeleteProject(p.id)} 
                                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                      title="Delete Project"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                              </div>
                              <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-1">
                                  <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                                    {p.webhookUrl ? <span className="text-green-400">● Configured</span> : '○ No Webhook'}
                                  </span>
                                  <span className="text-[10px] text-gray-500">
                                    Runs: {p.runCount || 0} / {p.workflowCountLimit || '∞'}
                                  </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setIsRunLogModalOpen(true)} className="w-full mt-4 py-2 border border-white/10 rounded text-xs text-gray-400 hover:text-white hover:bg-white/5 flex justify-center gap-2"><FileCode size={14}/> View Run Logs</button>
                    </GlassCard>
                  </div>
              </div>
            </>
         )}
      </div>

      {/* Create Project Modal with Template Selection */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="New Project">
         <form onSubmit={handleCreateProject} className="space-y-4">
             <div>
                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Project Name</label>
                <input autoFocus value={newProjectName} onChange={e => {setNewProjectName(e.target.value); if(formErrors.projectName) setFormErrors({...formErrors, projectName:''}); }} className={`w-full bg-black/30 border ${formErrors.projectName ? 'border-red-500' : 'border-white/10'} rounded p-3 text-white focus:border-brand-cyan outline-none`} placeholder="My New Project" />
                {formErrors.projectName && <p className="text-red-400 text-xs mt-1">{formErrors.projectName}</p>}
             </div>
             <div>
                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Project Type (Template)</label>
                {formErrors.projectType && <p className="text-red-400 text-xs mb-1">{formErrors.projectType}</p>}
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {availableTemplates.map(t => (
                        <div key={t.id} onClick={() => {setNewProjectType(t.id); if(formErrors.projectType) setFormErrors({...formErrors, projectType:''}); }} className={`p-3 rounded border cursor-pointer transition-all ${newProjectType === t.id ? 'bg-brand-cyan/20 border-brand-cyan' : 'bg-black/30 border-white/10 hover:border-white/30'}`}>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-white">{t.name}</span>
                                <Badge color="violet">{t.aiCreditCost} Credits</Badge>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{t.description}</p>
                        </div>
                    ))}
                </div>
             </div>
             <div className="pt-2 flex justify-end gap-3"><NeonButton variant="outline" type="button" onClick={() => setIsProjectModalOpen(false)}>Cancel</NeonButton><NeonButton type="submit">Create Project</NeonButton></div>
         </form>
      </Modal>

      {/* Run Logs Modal */}
      <Modal isOpen={isRunLogModalOpen} onClose={() => setIsRunLogModalOpen(false)} title="Workflow Run Logs">
          <div className="space-y-4">
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                      <thead className="text-xs uppercase bg-white/5 text-gray-500"><tr><th className="p-3">Time</th><th className="p-3">Project</th><th className="p-3">Status</th><th className="p-3">Credits</th><th className="p-3">Action</th></tr></thead>
                      <tbody className="divide-y divide-white/5">
                          {(currentUser.workflowRuns || []).length === 0 ? <tr><td colSpan={5} className="p-4 text-center">No runs yet.</td></tr> : (currentUser.workflowRuns || []).map(run => (
                              <tr key={run.id} className="hover:bg-white/5">
                                  <td className="p-3 whitespace-nowrap">{new Date(run.timestamp).toLocaleDateString()}</td>
                                  <td className="p-3">{currentUser.projects.find(p=>p.id===run.projectId)?.name || 'Unknown'}</td>
                                  <td className="p-3"><Badge color={run.status==='success'?'cyan':'violet'}>{run.status}</Badge></td>
                                  <td className="p-3">{run.creditsDeducted}</td>
                                  <td className="p-3"><button onClick={() => handleDownloadReport(run)} className="text-brand-cyan hover:underline flex items-center gap-1"><Download size={14}/> Report</button></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </Modal>

      {/* Modals for Credit, TopUp, Renewal, Limit (Reused logic) */}
      <Modal isOpen={isCreditModalOpen} onClose={() => setIsCreditModalOpen(false)} title="Purchase AI Credits"><div className="space-y-4"><p>Rate: {currencyCode} {creditPricePer1000}/1000 credits</p><input type="number" value={creditQuantity} onChange={e=>setCreditQuantity(Number(e.target.value))} className="w-full bg-black/30 p-2 rounded text-white"/><NeonButton fullWidth onClick={executePurchaseCredits}>Buy</NeonButton></div></Modal>
      <Modal isOpen={isTopUpModalOpen} onClose={() => setIsTopUpModalOpen(false)} title="Top Up"><input type="number" value={topUpAmount} onChange={e=>setTopUpAmount(Number(e.target.value))} className="w-full bg-black/30 p-2 rounded text-white mb-4"/><NeonButton fullWidth onClick={handleTopUp}>Pay</NeonButton></Modal>
      <Modal isOpen={isRenewalModalOpen} onClose={() => setIsRenewalModalOpen(false)} title="Renew Subscription"><p className="mb-4">Total: {currencyCode} {(currentPlan.monthlyPrice * 1.18).toFixed(2)} (inc GST)</p><NeonButton fullWidth onClick={handleRenew}>Confirm Renewal</NeonButton></Modal>
      <Modal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} title="Limit Reached"><p>Upgrade plan to add more projects.</p></Modal>
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={editingId ? "Edit Task" : "Create New Task"}>
          <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Title</label>
                  <input value={newTask.title} onChange={e => {setNewTask({...newTask, title: e.target.value}); if(formErrors.taskTitle) setFormErrors({...formErrors, taskTitle:''});}} className={`w-full bg-black/30 border ${formErrors.taskTitle ? 'border-red-500' : 'border-white/10'} rounded p-3 text-white`} />
                  {formErrors.taskTitle && <p className="text-red-400 text-xs mt-1">{formErrors.taskTitle}</p>}
              </div>
              <div><label className="block text-xs text-gray-500 uppercase font-bold mb-1">Description</label><textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded p-3 text-white h-24"/></div>
              <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs text-gray-500 uppercase font-bold mb-1">Priority</label><select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as any})} className="w-full bg-black/30 border border-white/10 rounded p-3 text-white"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
                  <div><label className="block text-xs text-gray-500 uppercase font-bold mb-1">Due Date</label><input type="date" value={newTask.dueDate ? newTask.dueDate.split('T')[0] : ''} onChange={e => setNewTask({...newTask, dueDate: e.target.value + 'T12:00:00'})} className="w-full bg-black/30 border border-white/10 rounded p-3 text-white"/></div>
              </div>
              <div className="mb-4"><label className="block text-xs text-gray-500 uppercase font-bold mb-1">Project</label><select value={newTask.projectId || ''} onChange={e => setNewTask({...newTask, projectId: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded p-3 text-white"><option value="">-- No Project --</option>{currentUser.projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              <NeonButton fullWidth type="submit">{editingId ? "Save Changes" : "Create Task"}</NeonButton>
          </form>
      </Modal>
    </div>
  );
};
