import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Zap, Check, ChevronRight, Smartphone, QrCode, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/src/lib/auth';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const upiId = '6363536914@ybl';
  const name = 'NutriSenseAI';

  const handlePayment = (plan: any) => {
    setSelectedPlan(plan);
    const note = `Sub: ${plan.name} (${user?.email || 'User'})`;
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${plan.amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    
    // Attempt deep link
    window.location.href = upiUrl;
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        'Advanced Goal Setting'
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
        'Exclusive Meal Roadmap'
      ]
    }
  ];

  const getQrUrl = (plan: any) => {
    const note = `Sub: ${plan.name} (${user?.email || 'User'})`;
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${plan.amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  };

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
            className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-[#181E04]">
                    {selectedPlan ? 'Complete Payment' : 'Choose Plan'}
                  </h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                    {selectedPlan ? 'Scan to activate' : 'Professional Analysis'}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => selectedPlan ? setSelectedPlan(null) : onClose()} className="rounded-full -mr-2">
                  <X size={20} />
                </Button>
              </div>

              {!selectedPlan ? (
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ y: -4 }}
                      onClick={() => handlePayment(plan)}
                      className={cn(
                        "relative p-6 rounded-[32px] border-2 transition-all cursor-pointer overflow-hidden group",
                        plan.id === 'elite' ? "border-[#181E04] bg-[#181E04] text-white" : "border-accent/10 bg-accent/5"
                      )}
                    >
                      {plan.highlight && (
                        <div className="absolute top-4 right-4 bg-primary text-white text-[8px] font-black uppercase px-2 py-1 rounded-full">
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
                          Initiate Authorization <Smartphone size={14} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8 py-4">
                   <div className="flex flex-col items-center justify-center space-y-6">
                      <div className="w-full bg-black rounded-[32px] p-6 flex flex-col items-center border border-white/10 shadow-2xl relative overflow-hidden">
                         {/* PhonePe Branding Header */}
                         <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-[#5f259f] rounded-lg flex items-center justify-center">
                               <span className="text-white font-black text-xs">पे</span>
                            </div>
                            <span className="text-white font-bold tracking-tight">PhonePe</span>
                         </div>
                         
                         <div className="text-[#a048ff] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                            Accepted Here
                         </div>

                         <div className="p-3 bg-white rounded-2xl mb-6 shadow-[0_0_40px_-5px_rgba(160,72,255,0.4)]">
                            <img 
                              src={getQrUrl(selectedPlan)} 
                              alt="Payment QR"
                              className="w-44 h-44 rounded-lg"
                            />
                         </div>

                         <div className="text-center">
                            <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest mb-1">Scan any QR using PhonePe App</p>
                            <p className="text-white font-black text-xs tracking-tight">Mr Shashankan S</p>
                         </div>

                         {/* Bottom footer text */}
                         <div className="absolute bottom-2 text-[6px] text-white/20 font-medium">
                            ©2025 NutriSenseAI. All rights reserved.
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Or Copy UPI ID</p>
                      <button 
                        onClick={copyUpi}
                        className="w-full h-14 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-between px-6 group active:scale-95 transition-all"
                      >
                         <span className="font-mono text-xs font-bold text-[#181E04]">{upiId}</span>
                         {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} className="text-muted-foreground opacity-40 group-hover:opacity-100" />}
                      </button>
                   </div>

                   <Button 
                    onClick={() => setSelectedPlan(null)}
                    variant="ghost" 
                    className="w-full text-[10px] font-black uppercase tracking-widest h-12"
                   >
                    Change Plan
                   </Button>
                </div>
              )}

              <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-widest opacity-40 px-6">
                Instant activation upon verification. Invoices sent to {user?.email || 'registered gmail'}.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
