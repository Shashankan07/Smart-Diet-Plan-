import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Zap, Check, ChevronRight, Smartphone } from 'lucide-react';
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
  
  const handlePayment = async (plan: 'pro' | 'elite', amount: number, period: string) => {
    // Generate UPI URL
    const upiId = '6363536914@ybl';
    const name = 'NutriSenseAI';
    const note = `Subscription: ${plan.toUpperCase()} ${period}`;
    const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    // Open UPI payment app (deep link)
    window.location.href = upiUrl;

    // For demo purposes/testing: In a real app, you would wait for verification/webhook
    // Here we'll simulate an instant upgrade (for testing or if the user confirms manually)
    /*
    if (user) {
      await setDoc(doc(db, 'users', user.uid), {
        subscriptionStatus: plan,
        subscriptionDate: serverTimestamp(),
        subscriptionAmount: amount
      }, { merge: true });
    }
    */
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
      highlight: 'Best Value',
      color: 'from-[#181E04] to-zinc-800',
      features: [
        '200-250 AI Neural Scans / mo',
        'Unlimited AI Coach access',
        'Priority Analysis Speed',
        'Exclusive Meal Roadmap'
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-[#181E04]">Upgrade Plan</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">Professional Analysis</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full -mr-2">
                  <X size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -4 }}
                    className={cn(
                      "relative p-6 rounded-[32px] border-2 transition-all cursor-pointer overflow-hidden group",
                      plan.id === 'elite' ? "border-[#181E04] bg-[#181E04] text-white" : "border-accent/10 bg-accent/5"
                    )}
                    onClick={() => handlePayment(plan.id as any, plan.amount, plan.period)}
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
                        "flex items-center justify-center gap-2 w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all group-hover:scale-[1.02]",
                        plan.id === 'elite' ? "bg-primary text-white" : "bg-[#181E04] text-white"
                      )}>
                        Select with UPI <Smartphone size={14} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-widest opacity-40 px-6">
                Instant activation upon payment verification. Invoices sent to registered gmail.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
