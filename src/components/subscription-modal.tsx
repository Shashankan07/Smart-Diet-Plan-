import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Zap, Check, Smartphone, CheckCircle2, Loader2, ArrowRight, Copy, CheckCircle, QrCode, Timer, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/src/lib/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { QRCodeSVG } from 'qrcode.react';

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
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [utr, setUtr] = useState('');
  const [utrError, setUtrError] = useState('');
  
  const upiId = '6363536914@ybl';
  const name = 'NutriSenseAI';

  // Timer logic
  useEffect(() => {
    let timer: any;
    if (selectedPlan && timeLeft > 0 && !isSuccess) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedPlan, timeLeft, isSuccess]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && selectedPlan && !isSuccess && !isVerifying) {
        // Automatic verification when user returns to app
        handleVerify();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [selectedPlan, isSuccess, isVerifying]);

  const getUpiUrl = (plan: any) => {
    const userIdentifier = user?.email || user?.phoneNumber || user?.uid || 'Paid_User';
    const note = `Sub: ${plan.name} (${userIdentifier})`;
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${plan.amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setTimeLeft(300); // Reset timer
    const upiUrl = getUpiUrl(plan);
    
    // Robust redirection for Android/Mobile
    window.location.href = upiUrl;
    
    const link = document.createElement('a');
    link.href = upiUrl;
    link.click();
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!user || !selectedPlan) return;
    
    if (!utr || utr.length < 12) {
      setUtrError('Please enter the 12-digit Transaction ID (UTR)');
      return;
    }
    setUtrError('');
    setIsVerifying(true);
    
    // Simulate payment verification delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      // Update Firestore with the UTR for admin approval
      await setDoc(doc(db, 'users', user.uid), {
        subscriptionStatus: selectedPlan.id,
        subscriptionAmount: selectedPlan.amount,
        subscriptionDate: serverTimestamp(),
        utr: utr,
        isPaid: false, // Wait for admin to check UTR
        pendingApproval: true,
        trialExpires: null 
      }, { merge: true });
      
      setIsSuccess(true);
    } catch (error) {
      console.error("Verification submission failed:", error);
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
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-[#181E04]">
                    {isSuccess ? 'Payment Success' : selectedPlan ? 'Final Step' : 'Upgrade Plan'}
                  </h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                    {isSuccess ? 'Welcome to Premium' : selectedPlan ? 'Scan & Pay Securely' : 'Choose Your Analysis Level'}
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
                            <h3 className="text-sm font-black tracking-tight uppercase opacity-60">{plan.name}</h3>
                            <div className="text-3xl font-black tracking-tighter">
                              {plan.price}
                              <span className="text-[10px] uppercase font-bold opacity-40 ml-1 mt-1 block italic">{plan.period}</span>
                            </div>
                          </div>
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                            plan.id === 'pro' ? "bg-white text-blue-500" : "bg-white/10 text-primary"
                          )}>
                            {plan.id === 'pro' ? <Zap size={24} /> : <Crown size={24} />}
                          </div>
                        </div>

                        <ul className="space-y-2 pt-2 border-t border-current opacity-20" />
                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-[11px] font-medium opacity-80">
                              <div className={cn(
                                "w-4 h-4 rounded-full flex items-center justify-center shrink-0 shadow-inner",
                                plan.id === 'elite' ? "bg-white/10" : "bg-blue-500/10"
                              )}>
                                <Check size={10} className={plan.id === 'elite' ? "text-primary" : "text-blue-500"} />
                              </div>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className={cn(
                          "flex items-center justify-center gap-2 w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-md active:scale-95",
                          plan.id === 'elite' ? "bg-primary text-white" : "bg-[#181E04] text-white"
                        )}>
                          Unlock Fast Access <ArrowRight size={14} />
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
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/20"
                   >
                     <CheckCircle2 size={48} />
                   </motion.div>
                   <div className="space-y-2 px-4">
                      <h3 className="text-2xl font-black text-[#181E04]">UTR Submitted</h3>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                        We're verifying your transaction ID: <span className="font-mono font-bold text-[#181E04]">{utr}</span>. 
                        Your premium features will activate within 15-30 minutes.
                      </p>
                   </div>
                   <Button onClick={onClose} className="rounded-2xl h-12 bg-[#181E04] text-white px-8 uppercase font-black tracking-widest text-[10px]">
                     Back to Analysis
                   </Button>
                </div>
              ) : (
                <div className="space-y-6 pt-2 pb-4">
                   {/* Payment Controls */}
                   <div className="flex justify-center flex-col items-center space-y-4">
                      {/* QR Code Section */}
                      <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/5 rounded-[40px] blur-2xl group-hover:bg-primary/10 transition-all" />
                        <div className="relative p-6 bg-white rounded-[40px] shadow-xl border border-accent/10">
                           <QRCodeSVG 
                             value={getUpiUrl(selectedPlan)}
                             size={180}
                             level="H"
                             includeMargin={false}
                           />
                        </div>
                        {/* QR Badge */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#181E04] text-white py-1 px-3 rounded-full flex items-center gap-2 shadow-lg border border-white/10">
                           <QrCode size={12} className="text-primary" />
                           <span className="text-[9px] font-black uppercase tracking-widest">Scan to Pay</span>
                        </div>
                      </div>

                      {/* Timer */}
                      <div className="flex flex-col items-center space-y-1">
                        <div className={cn(
                          "flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-widest transition-colors",
                          timeLeft < 60 ? "bg-red-50 text-red-500 border-red-200 animate-pulse" : "bg-accent/5 text-muted-foreground border-accent/10"
                        )}>
                           <Timer size={14} />
                           Session Expires: {formatTime(timeLeft)}
                        </div>
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Auto-Verifying every 3s</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="bg-accent/5 rounded-3xl p-5 border border-accent/10 flex items-center justify-between group cursor-pointer" onClick={copyUpi}>
                         <div className="space-y-0.5">
                           <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">UPI ID</p>
                           <p className="text-xs font-mono font-bold text-[#181E04]">{upiId}</p>
                         </div>
                         <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                           copied ? "bg-green-500 text-white" : "bg-white shadow-sm text-accent transition-transform group-active:scale-90"
                         )}>
                           {copied ? <Check size={16} /> : <Copy size={16} />}
                         </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#181E04] ml-2">Enter Transaction ID (UTR)</label>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="12-digit UTR Number"
                            value={utr}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                              setUtr(val);
                            }}
                            className={cn(
                              "w-full h-14 bg-accent/5 border rounded-2xl px-5 font-mono text-sm font-bold transition-all outline-none",
                              utrError ? "border-red-500 bg-red-50" : "border-accent/10 focus:border-primary focus:bg-white"
                            )}
                          />
                          {utr.length === 12 && !utrError && (
                            <CheckCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
                          )}
                        </div>
                        {utrError && <p className="text-[10px] font-bold text-red-500 ml-2">{utrError}</p>}
                        <p className="text-[8px] font-medium text-muted-foreground ml-2 opacity-60">Usually found in payment history of GPay/PhonePe.</p>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
                         <div className="flex items-center gap-2 text-blue-700">
                            <Info size={14} className="shrink-0" />
                            <p className="text-[9px] font-black uppercase tracking-widest">How to Connect Business</p>
                         </div>
                         <p className="text-[9px] font-medium text-blue-700/80 leading-relaxed italic">
                           For Production: Connect a Payment Gateway (Razorpay/Stripe) to use real webhooks for 100% automated verification.
                         </p>
                      </div>

                      <Button 
                        onClick={handleVerify}
                        disabled={isVerifying}
                        className="w-full h-16 bg-[#181E04] text-white rounded-3xl font-black uppercase tracking-[0.2em] gap-3 shadow-xl hover:bg-black active:scale-95 transition-all text-[11px]"
                      >
                         {isVerifying ? (
                           <>
                             <Loader2 size={16} className="animate-spin text-primary" />
                             Processing Neural Link...
                           </>
                         ) : (
                           <>
                             I've Completed Payment
                             <ArrowRight size={16} />
                           </>
                         )}
                      </Button>
                   </div>
                </div>
              )}

              <div className="pt-2">
                <p className="text-[8px] text-center text-muted-foreground font-bold uppercase tracking-[0.25em] opacity-30 px-6 leading-relaxed">
                  Encryption active • Secure Node • v2.4.1
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

