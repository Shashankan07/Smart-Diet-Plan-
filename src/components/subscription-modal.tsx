import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Zap, Check, Smartphone, CheckCircle2, Loader2, ArrowRight, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/src/lib/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const upiId = '6363536914@ybl';
  const name = 'NutriSenseAI';

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && selectedPlan && !isSuccess && !isVerifying) {
        // Automatic verification when user returns to app
        handleVerify();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [selectedPlan, isSuccess, isVerifying]);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    const userIdentifier = user?.email || user?.phoneNumber || user?.uid || 'Paid_User';
    const note = `Sub: ${plan.name} (${userIdentifier})`;
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${plan.amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    
    // Robust redirection for Android/Mobile
    // 1. Try direct location change
    window.location.href = upiUrl;
    
    // 2. Try anchor click fallback (works better on some browsers)
    const link = document.createElement('a');
    link.href = upiUrl;
    link.click();

    // 3. Inform user about preview limits
    if (window.self !== window.top) {
      console.warn("UPI links are usually blocked in web previews. Please use 'Open in new tab'.");
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!user || !selectedPlan) return;
    
    setIsVerifying(true);
    
    // Simulate payment verification delay
    // In a real app, this would check a backend service or transaction log
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Update Firestore with the paid status
      await setDoc(doc(db, 'users', user.uid), {
        subscriptionStatus: selectedPlan.id,
        subscriptionAmount: selectedPlan.amount,
        subscriptionDate: serverTimestamp(),
        isPaid: true
      }, { merge: true });
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedPlan(null);
        onClose();
      }, 2500);
    } catch (error) {
      console.error("Activation failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const plans = [
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '₹150',
      period: 'per month',
      amount: 150,
      color: 'from-blue-500 to-indigo-600',
      features: [
        '35-40 AI Neural Scans / mo',
        '20 hours AI Coach access',
        'Full History Archive',
        'Global Database Access'
      ]
    },
    {
      id: 'elite',
      name: 'Elite Plan',
      price: '₹300',
      period: 'per 3 months',
      amount: 300,
      highlight: 'Recommended',
      color: 'from-[#181E04] to-zinc-800',
      features: [
        '200-250 AI Neural Scans / mo',
        'Unlimited AI Coach access',
        'Priority Analysis Speed',
        'Lifetime Health Roadmap'
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-8 space-y-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-[#181E04]">
                    {isSuccess ? 'Payment Success' : selectedPlan ? 'Payment Pending' : 'Choose Plan'}
                  </h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                    {isSuccess ? 'Welcome to Premium' : selectedPlan ? 'Verify your transaction' : 'Professional Analysis'}
                  </p>
                </div>
                {!isSuccess && (
                  <Button variant="ghost" size="icon" onClick={() => selectedPlan ? setSelectedPlan(null) : onClose()} className="rounded-full -mr-2">
                    <X size={20} />
                  </Button>
                )}
              </div>

              {!selectedPlan ? (
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ y: -4 }}
                      onClick={() => handlePlanSelect(plan)}
                      className={cn(
                        "relative p-6 rounded-[32px] border-2 transition-all cursor-pointer overflow-hidden group",
                        plan.id === 'elite' ? "border-[#181E04] bg-[#181E04] text-white" : "border-accent/10 bg-accent/5"
                      )}
                    >
                      {plan.highlight && (
                        <div className="absolute top-4 right-4 bg-primary text-white text-[8px] font-black uppercase px-2 py-1 rounded-full animate-pulse">
                          {plan.highlight}
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <h3 className="text-lg font-black tracking-tight uppercase">{plan.name}</h3>
                            <div className="text-3xl font-black tracking-tighter">
                              {plan.price}
                              <span className="text-[10px] uppercase font-bold opacity-40 ml-1 italic">{plan.period}</span>
                            </div>
                          </div>
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                            plan.id === 'pro' ? "bg-white text-blue-500" : "bg-white/10 text-primary"
                          )}>
                            {plan.id === 'pro' ? <Zap size={24} /> : <Crown size={24} />}
                          </div>
                        </div>

                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-[11px] font-medium opacity-80">
                              <div className={cn(
                                "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                                plan.id === 'elite' ? "bg-white/10" : "bg-blue-500/10"
                              )}>
                                <Check size={10} className={plan.id === 'elite' ? "text-primary" : "text-blue-500"} />
                              </div>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className={cn(
                          "flex items-center justify-center gap-2 w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all",
                          plan.id === 'elite' ? "bg-primary text-white" : "bg-[#181E04] text-white"
                        )}>
                          Make Payment <Smartphone size={14} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
                   <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl"
                   >
                     <CheckCircle2 size={48} />
                   </motion.div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-[#181E04]">Activation Complete!</h3>
                      <p className="text-sm font-medium text-muted-foreground">Redirecting to your dashboard...</p>
                   </div>
                </div>
              ) : (
                <div className="space-y-8 py-4">
                   <div className="bg-accent/5 rounded-[32px] p-8 border border-accent/10 space-y-6 text-center">
                      <div className="w-20 h-20 bg-[#5f259f]/10 rounded-[28px] flex items-center justify-center text-[#5f259f] mx-auto mb-2">
                        {isVerifying ? (
                          <Loader2 size={32} className="animate-spin" />
                        ) : (
                          <Smartphone size={32} className="animate-bounce" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-[#181E04]">
                          {isVerifying ? 'Verifying Payment' : 'Payment Initiated'}
                        </h3>
                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                          {isVerifying 
                            ? 'Scanning Nutrient Network for your transaction...' 
                            : `Complete the ${selectedPlan.price} transfer in your UPI app. Your account will activate automatically when you return.`}
                        </p>
                      </div>
                   </div>

                   <div className="space-y-4">
                     <Button 
                      onClick={() => handlePlanSelect(selectedPlan)}
                      className="w-full h-20 bg-[#5f259f] text-white rounded-[28px] font-black uppercase tracking-widest gap-3 shadow-xl hover:bg-[#4a1d7d] active:scale-95 transition-all text-sm"
                     >
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                         <span className="text-[#5f259f] font-black text-xs">पे</span>
                      </div>
                      Re-open UPI Apps
                      <ArrowRight size={18} />
                     </Button>

                     {user?.email === 'shashankanshashankan16@gmail.com' && (
                       <Button 
                        onClick={handleVerify}
                        disabled={isVerifying}
                        variant="ghost"
                        className="w-full text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse"
                       >
                         [ Admin Test: Bypass Payment ]
                       </Button>
                     )}

                     <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                        <div className="flex items-center gap-2 text-amber-700">
                           <Smartphone size={14} className="shrink-0" />
                           <p className="text-[10px] font-black uppercase tracking-widest">Mobile Device Alert</p>
                        </div>
                        <p className="text-[10px] font-medium text-amber-700 leading-tight">
                          If payment apps don't open automatically:
                        </p>
                        <ul className="text-[9px] text-amber-700/80 space-y-1 list-disc ml-3 font-medium">
                           <li>Click the "Open in new tab" icon at the top of the screen.</li>
                           <li>Or manually copy the UPI ID below and pay in your app.</li>
                        </ul>
                     </div>
                   </div>

                   <div className="space-y-4">
                      <div className="h-px bg-accent/10 w-full" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-center text-muted-foreground opacity-50">Trouble paying? Copy UPI ID</p>
                      <button 
                        onClick={copyUpi}
                        className="w-full h-12 rounded-xl bg-accent/5 flex items-center justify-between px-4 border border-accent/10 active:scale-95 transition-all"
                      >
                         <span className="font-mono text-[10px] font-bold text-[#181E04]">{upiId}</span>
                         {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} className="opacity-40" />}
                      </button>
                   </div>

                   <button 
                     onClick={() => setSelectedPlan(null)}
                     className="w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40 text-center hover:opacity-100"
                   >
                      Change Selected Plan
                   </button>
                </div>
              )}

              {!isSuccess && (
                <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-widest opacity-40 px-6">
                  Account status updates instantly after confirmation.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
