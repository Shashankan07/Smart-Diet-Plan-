import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Apple, 
  Droplet, 
  Plus, 
  User as UserIcon, 
  ChefHat, 
  Camera, 
  MessageSquare,
  ChevronRight,
  Loader2,
  Database,
  X,
  Zap,
  Download,
  Smartphone
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { nutritionModel, getDietCoachResponse } from '@/src/lib/gemini';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { auth, googleProvider, db, OperationType, handleFirestoreError } from '@/src/lib/firebase';
import { ManualFoodLog } from '@/src/components/manual-food-log';
import { FoodScanner } from '@/src/components/food-scanner';
import { AuthProvider, useAuth } from '@/src/lib/auth';

// --- Shared Types & Logic ---
export const calculateDailyTargets = (profile: { weight?: number | string; height?: number | string; age?: number | string; goal?: string; activityLevel?: string; gender?: string }) => {
  if (!profile || !profile.weight || !profile.height || !profile.age) {
    return { 
      calories: 2000, 
      water: 2500, 
      protein: 125, 
      carbs: 250, 
      fat: 55,
      fiber: 28,
      sodium: 2300,
      calcium: 1000,
      iron: 18
    };
  }

  const { weight, height, age, goal, activityLevel, gender = 'male' } = profile;
  
  // BMR - Mifflin-St Jeor Equation
  let bmr = (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age));
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;

  // Activity Multiplier
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725
  };
  const multiplier = (multipliers as Record<string, number>)[activityLevel as string] || 1.2;
  let tdee = bmr * multiplier;

  // Goal Adjustments
  if (goal === 'weight_loss') tdee -= 500;
  if (goal === 'muscle_gain') tdee += 300;

  const water = Number(weight) * 35; // 35ml per kg
  
  // Advanced Macro Science ratios based on selected goal
  // Ratios updated based on standard health guidelines
  let proteinMultiplier: number;
  let fatPercentage: number;

  if (goal === 'weight_loss') {
    proteinMultiplier = 2.0; // High protein for satiety during cut
    fatPercentage = 0.25;
  } else if (goal === 'muscle_gain') {
    proteinMultiplier = 2.2; // Maximum muscle synthesis
    fatPercentage = 0.20;
  } else {
    proteinMultiplier = 1.2; // RDA is 0.8, but 1.2 is healthy for active adults
    fatPercentage = 0.30;
  }

  const protein = Number(weight) * proteinMultiplier;
  const fat = (tdee * fatPercentage) / 9;
  const carbs = (tdee - (protein * 4) - (fat * 9)) / 4;

  // Micro-nutrient targets (RDIs)
  const fiber = (tdee / 1000) * 14; // 14g per 1000kcal
  const sodium = 2300; // Standard max
  const calcium = Number(age) >= 50 ? 1200 : 1000;
  const iron = gender === 'female' && Number(age) < 50 ? 18 : 8;

  return {
    calories: Math.round(tdee),
    water: Math.round(water),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    fiber: Math.round(fiber),
    sodium,
    calcium,
    iron
  };
};

const Dashboard = ({ onWaterLog }: { onWaterLog: (amount: number) => void }) => {
  const { user, profile } = useAuth();
  const [mealLogs, setMealLogs] = useState<{ id: string; calories: number; protein?: number; carbs?: number; fat?: number; foodName: string; mealType: string; timestamp: { seconds: number; nanoseconds: number; toDate: () => Date } | null; manual?: boolean; macroBreakdown?: Record<string, number>; macro_breakdown?: Record<string, number> }[]>([]);
  const [waterLogs, setWaterLogs] = useState<{ id: string; amountMl: number }[]>([]);
  const [showManualLog, setShowManualLog] = useState(false);
  const clickTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleWaterClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      // Double click: increase 500ml
      onWaterLog(500);
    } else {
      clickTimer.current = setTimeout(() => {
        // Single click: decrease 500ml
        onWaterLog(-500);
        clickTimer.current = null;
      }, 300);
    }
  };
  
  useEffect(() => {
    if (!user) return;
    
    const mealQuery = query(collection(db, 'mealLogs'), where('userId', '==', user.uid));
    const waterQuery = query(collection(db, 'waterLogs'), where('userId', '==', user.uid));
    
    const unsubMeals = onSnapshot(mealQuery, (snap) => {
      const logs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as { id: string; calories: number; protein?: number; carbs?: number; fat?: number; foodName: string; mealType: string; timestamp: { seconds: number; nanoseconds: number; toDate: () => Date } | null; manual?: boolean; macroBreakdown?: Record<string, number>; macro_breakdown?: Record<string, number> }[];
      setMealLogs(logs);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'mealLogs'));

    const unsubWater = onSnapshot(waterQuery, (snap) => {
      const logs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as { id: string; amountMl: number }[];
      setWaterLogs(logs);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'waterLogs'));

    return () => { unsubMeals(); unsubWater(); };
  }, [user]);

  const totalCalories = mealLogs.reduce((acc, current) => acc + (Number(current.calories) || 0), 0);
  const totalProtein = mealLogs.reduce((acc, current) => acc + (Number(current.protein || current.macroBreakdown?.protein || current.macro_breakdown?.protein || 0)), 0);
  const totalCarbs = mealLogs.reduce((acc, current) => acc + (Number(current.carbs || current.macroBreakdown?.carbs || current.macro_breakdown?.carbs || 0)), 0);
  const totalFat = mealLogs.reduce((acc, current) => acc + (Number(current.fat || current.macroBreakdown?.fat || current.macro_breakdown?.fat || 0)), 0);
  
  const totalFiber = mealLogs.reduce((acc, current) => acc + (Number(current.fiber || 0)), 0);
  const totalCalcium = mealLogs.reduce((acc, current) => acc + (Number(current.calcium || 0)), 0);
  const totalIron = mealLogs.reduce((acc, current) => acc + (Number(current.iron || 0)), 0);
  
  const totalWater = waterLogs.reduce((acc, current) => acc + (current.amountMl || 0), 0);
  
  const targets = calculateDailyTargets(profile);
  const calorieTarget = targets.calories;
  const waterTarget = targets.water;
  const proteinTarget = targets.protein;
  const carbsTarget = targets.carbs;
  const fatTarget = targets.fat;
  const ironTarget = targets.iron;
  const calciumTarget = targets.calcium;
  const fiberTarget = targets.fiber;

  const remainingCalories = Math.max(0, calorieTarget - totalCalories);

  const handleDeleteMeal = async (id: string) => {
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'mealLogs', id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const calorieProgress = totalCalories / calorieTarget;
  const waterProgress = totalWater / waterTarget;
  const healthScore = Math.min(100, Math.round(((Math.min(1, calorieProgress) + Math.min(1, waterProgress)) / 2) * 100));

  return (
    <div className="space-y-8 pb-32">
      {/* Header Context */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">Status: Tracking Active</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {getTimeGreeting()}, {user?.displayName?.split(' ')[0] || 'User'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowManualLog(true)}
            className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <ManualFoodLog isOpen={showManualLog} onClose={() => setShowManualLog(false)} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Main Circular Dashboard */}
        <div className="relative flex justify-center py-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative w-[280px] h-[280px] flex items-center justify-center bg-white rounded-full shadow-[0_40px_110px_-30px_rgba(24,30,4,0.2)] border-2 border-white p-1"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent/10 to-primary/5 opacity-50" />
            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center border border-accent/20">
              {/* Background Ring */}
              <svg className="absolute w-full h-full p-1 overflow-visible">
                <circle cx="50%" cy="50%" r="132" fill="none" stroke="#F0F2EA" strokeWidth="14" />
                <motion.circle 
                  cx="50%" cy="50%" r="132" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="14" 
                  strokeLinecap="round"
                  className="text-primary"
                  initial={{ strokeDasharray: "829", strokeDashoffset: "829" }}
                  animate={{ strokeDashoffset: 829 - (829 * Math.min(1, totalCalories/calorieTarget)) }}
                  transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              
              <div className="text-center space-y-1 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#181E04]/30 block">Balance</span>
                <div className="text-6xl font-black text-[#181E04] tracking-tighter leading-none">{remainingCalories}</div>
                <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-widest opacity-60">calories left</span>
              </div>
            </div>

            {/* Floating Macro Mini Rings */}
            <div className="absolute -bottom-4 flex gap-4 w-full justify-center px-4 z-20">
               <MacroArc label="P" current={totalProtein} target={proteinTarget} color="#3B82F6" />
               <MacroArc label="C" current={totalCarbs} target={carbsTarget} color="#B87739" />
               <MacroArc label="F" current={totalFat} target={fatTarget} color="#EF4444" />
            </div>
          </motion.div>
        </div>

        {/* Actionable Cards Bento */}
        <div className="grid grid-cols-2 gap-4 px-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              onClick={() => handleWaterClick()}
              className="bg-white/80 backdrop-blur-md border border-accent/20 rounded-[32px] p-6 relative overflow-hidden shadow-xl shadow-primary/5 group active:scale-95 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-primary/5 p-3 rounded-2xl group-hover:bg-primary/10 transition-colors">
                  <Droplet size={20} className="text-primary" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary/30">H2O</span>
                  <Plus size={12} className="text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-foreground tracking-tighter">{totalWater}<span className="text-[10px] uppercase font-bold opacity-30 ml-1">ml</span></div>
                <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest opacity-60 italic">Goal {waterTarget}ml</div>
              </div>
              <div className="mt-4 h-1 w-full bg-accent/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (totalWater/waterTarget)*100)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-[#181E04] border-none rounded-[32px] p-6 relative overflow-hidden shadow-2xl group active:scale-95 transition-all cursor-pointer h-full">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Zap size={20} className="text-primary" />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/30 italic">Bio-Stats</span>
              </div>
              <div className="space-y-4 relative z-10">
                 <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xl font-black text-white tracking-tighter">{totalCalcium}<span className="text-[8px] uppercase font-bold opacity-40 ml-1">mg</span></div>
                      <div className="text-[8px] font-bold uppercase text-white/60 tracking-widest">Calcium</div>
                    </div>
                    <div className="text-[8px] text-primary font-bold">{Math.round((totalCalcium/calciumTarget)*100)}%</div>
                 </div>
                 <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xl font-black text-white tracking-tighter">{totalIron}<span className="text-[8px] uppercase font-bold opacity-40 ml-1">mg</span></div>
                      <div className="text-[8px] font-bold uppercase text-white/60 tracking-widest">Iron</div>
                    </div>
                    <div className="text-[8px] text-primary font-bold">{Math.round((totalIron/ironTarget)*100)}%</div>
                 </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Recent Activity: Simple Food feed */}
      <div className="space-y-4 px-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Today's Meals</h2>
          <span className="text-[10px] font-mono p-1 bg-emerald-100 text-emerald-800 rounded">UPDATED</span>
        </div>
        
        <div className="space-y-3">
          {mealLogs.length > 0 ? (
            mealLogs.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)).map((log) => (
              <motion.div 
                layout
                key={log.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group flex items-center justify-between bg-white p-5 rounded-[28px] border border-border/40 shadow-sm hover:shadow-md transition-all active:scale-98 relative"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center border border-border group-hover:border-primary/20 transition-colors">
                     {log.manual ? <ChefHat size={22} className="text-muted-foreground" /> : <Camera size={22} className="text-primary" />}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-foreground line-clamp-1">{log.foodName}</h3>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      {log.mealType}
                      <span className="w-1 h-1 bg-border rounded-full" />
                      {log.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-black text-foreground tracking-tighter">+{log.calories}</div>
                    <div className="text-[8px] font-mono text-muted-foreground font-black uppercase opacity-60">KCAL</div>
                  </div>
                  <button 
                    onClick={() => handleDeleteMeal(log.id)}
                    className="p-2 text-red-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all active:scale-90"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center rounded-[40px] border-2 border-dashed border-border/60">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-40">Awaiting Daily Logs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MacroArc = ({ label, current, target, color }: { label: string; current: number; target: number; color: string }) => {
  const percent = Math.min(1, current / target);
  return (
    <div className="bg-white px-3 py-2 rounded-2xl border border-border/60 shadow-xl flex items-center gap-2.5">
      <div className="relative w-7 h-7 flex items-center justify-center">
        <svg className="absolute w-full h-full rotate-[-90deg]">
           <circle cx="50%" cy="50%" r="12" fill="none" stroke="#E2E4DC" strokeWidth="3" />
           <motion.circle 
             cx="50%" cy="50%" r="12" 
             fill="none" stroke={color} strokeWidth="3" 
             strokeDasharray="75" 
             initial={{ strokeDashoffset: 75 }}
             animate={{ strokeDashoffset: 75 - (75 * percent) }}
             transition={{ duration: 1 }}
           />
        </svg>
        <span className="text-[9px] font-black text-foreground">{label}</span>
      </div>
      <div className="flex flex-col -space-y-1">
        <span className="text-[14px] font-black text-foreground">{current.toFixed(0)}</span>
        <span className="text-[7px] font-bold uppercase text-muted-foreground tracking-widest">Goal: {target}g</span>
      </div>
    </div>
  );
};

// --- Landing Page ---
const Landing = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
        subscriptionStatus: 'free'
      }, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* Decorative Elements */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          y: [0, 30, 0],
          rotate: [0, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 -right-10 w-80 h-80 bg-accent/30 rounded-full blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center space-y-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] opacity-50 group-hover:opacity-80 transition-opacity"></div>
          <div className="relative w-36 h-36 bg-white rounded-[44px] flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white p-1">
            <div className="w-full h-full bg-[#181E04] rounded-[40px] flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Apple className="text-white w-14 h-14" />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-4 max-w-sm text-center"
        >
          <h1 className="text-5xl font-black tracking-tight text-[#181E04] leading-tight">
            NutriSense <span className="text-primary font-light text-primary/40 underline decoration-2 underline-offset-8 italic px-1">AI</span>
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium px-4">
            Smart AI nutrition and health tracker.<br />
            Manage your daily goals with ease.
          </p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-xs pt-8"
        >
          <Button onClick={handleLogin} className="w-full h-18 bg-[#181E04] text-white hover:bg-black rounded-[32px] text-lg font-bold shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] gap-3 transition-all hover:scale-105 active:scale-95">
            Initialize Access
            <ChevronRight size={20} className="text-primary" />
          </Button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
        >
          Health Tracker v4.0.2 // Active Mode
        </motion.p>
      </div>
    </div>
  );
};

// --- App Root ---
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showScanner, setShowScanner] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Apple className="text-primary w-12 h-12" />
      </motion.div>
    </div>
  );

  if (!user) return <Landing />;

  const handleWaterLog = async (amountMl: number = 250) => {
    try {
      await addDoc(collection(db, 'waterLogs'), {
        userId: user.uid,
        amountMl,
        loggedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'waterLogs');
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDFCFB] font-sans text-foreground flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-accent/20 to-transparent -z-0" />
      
      <main className="flex-1 p-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'home' && <Dashboard onWaterLog={handleWaterLog} />}
            {activeTab === 'plan' && <MealPlanTab />}
            {activeTab === 'chat' && <AiCoachTab />}
            {activeTab === 'profile' && <HealthSetupTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      <ManualFoodLog isOpen={false} onClose={() => {}} />

      {/* Floating Log Trigger */}
      <div className="fixed bottom-32 right-6 z-40 group">
        <Button 
          onClick={() => setShowScanner(true)} 
          size="icon" 
          className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-[0_20px_50px_-10px_rgba(184,119,57,0.4)] text-white border-none transition-all hover:scale-105 active:scale-95"
        >
          <Camera size={28} />
        </Button>
      </div>

      {showScanner && <FoodScanner onComplete={() => setShowScanner(false)} />}

      {/* Modern Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
        <nav className="max-w-md mx-auto bg-white/80 backdrop-blur-3xl border border-border/50 flex justify-around items-center p-2.5 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(24,30,4,0.1)] pointer-events-auto">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Activity size={20} />} label="Journal" />
          <NavButton active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} icon={<ChefHat size={20} />} label="Meals" />
          <div className="w-12 h-12 flex items-center justify-center text-primary/30">
            <Apple size={24} />
          </div>
          <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={20} />} label="Coach" />
          <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<UserIcon size={20} />} label="Profile" />
        </nav>
      </footer>
    </div>
  );
}

// --- Health Setup Tab ---
const HealthSetupTab = () => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    goal: 'maintenance',
    activityLevel: 'sedentary'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        age: String(profile.age || ''),
        weight: String(profile.weight || ''),
        height: String(profile.height || ''),
        gender: profile.gender || 'male',
        goal: profile.goal || 'maintenance',
        activityLevel: profile.activityLevel || 'sedentary'
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const liveTargets = calculateDailyTargets(formData);

  return (
    <div className="space-y-8 pb-32">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Health Profile</h2>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Personal Details</p>
      </div>

      <div className="grid grid-cols-2 gap-4 px-1">
        <Card className="bg-white border-none rounded-3xl p-5 shadow-sm">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Daily Target</span>
          <div className="text-2xl font-black text-foreground tracking-tighter">{liveTargets.calories} <span className="text-[10px] text-muted-foreground opacity-40">KCAL</span></div>
        </Card>
        <Card className="bg-white border-none rounded-3xl p-5 shadow-sm">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Daily Hydration</span>
          <div className="text-2xl font-black text-foreground tracking-tighter">{liveTargets.water} <span className="text-[10px] text-muted-foreground opacity-40">ML</span></div>
        </Card>
      </div>

      <div className="px-1 grid grid-cols-2 gap-3">
        <MacroGoal label="Proteins" value={liveTargets.protein} suffix="G" color="bg-blue-500" />
        <MacroGoal label="Carbs" value={liveTargets.carbs} suffix="G" color="bg-amber-500" />
        <MacroGoal label="Fats" value={liveTargets.fat} suffix="G" color="bg-red-500" />
        <MacroGoal label="Fiber" value={liveTargets.fiber} suffix="G" color="bg-emerald-500" />
        <MacroGoal label="Calcium" value={liveTargets.calcium} suffix="mg" color="bg-indigo-500" />
        <MacroGoal label="Iron" value={liveTargets.iron} suffix="mg" color="bg-rose-500" />
      </div>

      <div className="space-y-3 px-1">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Meal Strategy</h3>
        <div className="grid grid-cols-2 gap-3">
          <StrategyCard label="Breakfast" value={Math.round(liveTargets.calories * 0.25)} />
          <StrategyCard label="Lunch" value={Math.round(liveTargets.calories * 0.35)} />
          <StrategyCard label="Snacks" value={Math.round(liveTargets.calories * 0.15)} />
          <StrategyCard label="Dinner" value={Math.round(liveTargets.calories * 0.25)} />
        </div>
      </div>

      <Card className="border-none bg-white rounded-[32px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(24,30,4,0.06)]">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Age</Label>
              <Input 
                value={formData.age} 
                onChange={e => setFormData({...formData, age: e.target.value})}
                placeholder="25" 
                type="number" 
                className="bg-accent/30 border-none h-14 rounded-2xl focus:ring-primary text-foreground text-lg font-bold" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Weight (kg)</Label>
              <Input 
                value={formData.weight} 
                onChange={e => setFormData({...formData, weight: e.target.value})}
                placeholder="70" 
                type="number" 
                className="bg-accent/30 border-none h-14 rounded-2xl focus:ring-primary text-foreground text-lg font-bold" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Height (cm)</Label>
            <Input 
              value={formData.height} 
              onChange={e => setFormData({...formData, height: e.target.value})}
              placeholder="175" 
              type="number" 
              className="bg-accent/30 border-none h-14 rounded-2xl focus:ring-primary text-foreground text-lg font-bold" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Sex</Label>
            <div className="flex gap-2">
              {['male', 'female'].map((sex) => (
                <button
                  key={sex}
                  onClick={() => setFormData({...formData, gender: sex})}
                  className={cn(
                    "flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    formData.gender === sex 
                    ? "bg-primary text-white shadow-md" 
                    : "bg-accent/30 text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  {sex}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Daily Activity</Label>
            <select 
              value={formData.activityLevel}
              onChange={e => setFormData({...formData, activityLevel: e.target.value})}
              className="w-full bg-accent/30 border-none h-14 px-4 rounded-2xl text-sm font-bold text-foreground focus:outline-none appearance-none cursor-pointer"
            >
              <option value="sedentary">Mostly sitting (Office job)</option>
              <option value="light">Light exercise (1-2 days/week)</option>
              <option value="moderate">Moderate exercise (3-5 days/week)</option>
              <option value="active">Very active (Daily exercise)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Your Goal</Label>
            <select 
              value={formData.goal}
              onChange={e => setFormData({...formData, goal: e.target.value})}
              className="w-full bg-accent/30 border-none h-14 px-4 rounded-2xl text-sm font-bold text-foreground focus:outline-none appearance-none cursor-pointer"
            >
              <option value="weight_loss">Lose weight</option>
              <option value="maintenance">Stay the same weight</option>
              <option value="muscle_gain">Build muscle</option>
            </select>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full h-16 bg-primary text-white hover:bg-primary/90 rounded-[24px] text-lg font-bold shadow-lg mt-4 transition-all active:scale-95">
            {saving ? 'Saving...' : 'Update Information'}
          </Button>
          
          <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 mt-2 font-bold text-[10px] uppercase tracking-[0.2em]" onClick={() => signOut(auth)}>
            Log Out
          </Button>
        </CardContent>
      </Card>

      <InstallAppSection />

      <Card className="border-none bg-accent/20 rounded-[32px] overflow-hidden shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-2xl">
            <Zap className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Linked Apps</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Health Data Sources</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <SyncItem label="Apple Health" status="connected" />
          <SyncItem label="Fitbit" status="disconnected" />
          <SyncItem label="Oura Ring" status="disconnected" />
        </div>
      </Card>
    </div>
  );
};

const InstallAppSection = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIos(isIosDevice);

    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (isStandalone) return null;

  return (
    <Card className="border-none bg-primary/10 rounded-[40px] overflow-hidden shadow-[0_20px_50px_-20px_rgba(184,119,57,0.2)] p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-white rounded-[24px] shadow-sm">
          <Download className="text-primary" size={28} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-[#181E04] tracking-tight">Install App</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none opacity-60">Mobile Experience</p>
        </div>
      </div>

      <div className="space-y-4">
        {deferredPrompt ? (
          <Button 
            onClick={handleInstall} 
            className="w-full bg-primary text-white rounded-[24px] h-16 text-md font-black shadow-[0_15px_30px_-5px_rgba(184,119,57,0.3)] hover:bg-primary/90 transition-all active:scale-95"
          >
            Install on device
          </Button>
        ) : isIos ? (
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-[28px] border border-white/40 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone size={16} className="text-primary" />
              <p className="text-xs font-black text-[#181E04] uppercase tracking-tight">Safari Instructions</p>
            </div>
            <ol className="text-[11px] text-muted-foreground space-y-2 ml-4 list-decimal font-bold">
              <li>Tap the <span className="text-primary">"Share"</span> icon in Safari</li>
              <li>Select <span className="text-primary">"Add to Home Screen"</span></li>
            </ol>
          </div>
        ) : (
          <div className="bg-white/40 backdrop-blur-sm p-6 rounded-[28px] border border-white/20">
            <p className="text-[11px] font-black text-[#181E04]/60 uppercase tracking-widest text-center leading-relaxed">
              Open your browser menu and select <br/>
              <span className="text-primary">"Install App"</span> or <span className="text-primary">"Add to Home Screen"</span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

const MacroGoal = ({ label, value, suffix, color }: { label: string; value: number; suffix: string; color: string }) => (
  <Card className="bg-white border-none rounded-2xl p-3 shadow-sm flex flex-col items-center">
    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">{label}</span>
    <div className="flex items-center gap-1">
      <div className={cn("w-1 h-1 rounded-full", color)} />
      <div className="text-sm font-black text-foreground">{value}<span className="text-[8px] opacity-40 ml-0.5">{suffix}</span></div>
    </div>
  </Card>
)

const StrategyCard = ({ label, value }: { label: string; value: number }) => (
  <Card className="bg-white/50 border-none rounded-2xl p-3 shadow-sm flex justify-between items-center px-4">
    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
    <div className="text-sm font-black text-foreground">{value} <span className="text-[8px] opacity-30 uppercase font-bold">Kcal</span></div>
  </Card>
)

const SyncItem = ({ label, status }: { label: string; status: 'connected' | 'disconnected' }) => (
  <div className="flex justify-between items-center bg-white/60 p-4 rounded-2xl border border-accent/10">
    <span className="text-sm font-bold text-foreground">{label}</span>
    <span className={cn(
      "text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg",
      status === 'connected' ? "bg-emerald-100 text-emerald-800" : "bg-accent/30 text-muted-foreground"
    )}>
      {status}
    </span>
  </div>
);

const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "relative p-2.5 transition-all flex flex-col items-center gap-1 group active:scale-90",
      active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
    )}
  >
    <div className={cn(
      "p-2.5 rounded-2xl transition-all relative",
      active ? "bg-primary/10 shadow-inner" : "group-hover:bg-accent/50"
    )}>
      <div className="relative z-10">{icon}</div>
      {active && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute inset-0 bg-primary/20 blur-md rounded-full"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </div>
    <span className="text-[8px] font-bold tracking-widest uppercase">{label}</span>
    {active && (
      <motion.div 
        layoutId="active-dot"
        className="w-1.5 h-1.5 bg-primary rounded-full mt-1 shadow-[0_0_10px_rgba(24,30,4,0.4)]"
        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
      />
    )}
  </button>
);
const AiCoachTab = () => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'ai', text: "Bio-logical interface online. Ready to optimize your nutritional intake. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { profile } = useAuth();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getDietCoachResponse(userMsg, (profile || {}) as Record<string, unknown>, messages);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "[ ERROR: Neural link unstable. Retry transmission. ]" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-210px)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">AI Coach</h2>
        <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-1 opacity-60">Status: Real-time Nutritional Guidance</p>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 pr-4 mb-6">
        <div className="space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-[24px] text-sm leading-relaxed ${
                m.role === 'user' 
                ? 'bg-zinc-100 text-zinc-950 font-medium rounded-tr-none shadow-xl' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none shadow-lg'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl rounded-tl-none shadow-sm animate-pulse text-zinc-600 text-[10px] font-mono uppercase tracking-widest">
                [ Computing response... ]
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-4 bg-zinc-900 border border-zinc-800 p-3 rounded-[24px] shadow-2xl items-center">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Query the engine..."
          className="flex-1 bg-transparent px-3 text-sm focus:outline-none text-zinc-100 placeholder:text-zinc-600 font-medium"
        />
        <Button onClick={handleSend} size="icon" className="rounded-xl h-12 w-12 bg-primary text-zinc-950 hover:bg-orange-400">
          <ChevronRight size={24} />
        </Button>
      </div>
    </div>
  );
};

// --- Meal Plan Tab ---
const MealPlanTab = () => {
  const { profile } = useAuth();
  const [plan, setPlan] = useState<{ meals: { name: string; type: string; calories: number; protein: number; carbs: number; fat: number; benefit: string; macros?: { protein: number; carbs: number; fat: number } }[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const targets = calculateDailyTargets(profile);

  const generatePlan = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const prompt = `Generate a 1-day personalized meal plan for this user: ${JSON.stringify(profile)}. 
      Daily goal target: ${targets.calories} kcal. 
      IMPORTANT: Divide the daily intake into 4 specific categories:
      1. Breakfast (~25% of calories: ${Math.round(targets.calories * 0.25)} kcal)
      2. Lunch (~35% of calories: ${Math.round(targets.calories * 0.35)} kcal)
      3. Snacks (~15% of calories: ${Math.round(targets.calories * 0.15)} kcal)
      4. Dinner (~25% of calories: ${Math.round(targets.calories * 0.25)} kcal)

      For EACH meal define: name, type (Breakfast, Lunch, Snack, Dinner), calories, protein, carbs, fat, and a short 'benefit' tip.
      Return as a JSON object with a 'meals' array.`;
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const response = await ai.models.generateContent({
        model: nutritionModel,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      setPlan(JSON.parse(response.text || "{}"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">AI Nutrition Roadmap</h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">Personalized Goal: {targets.calories} kcal</p>
        </div>
        <div className="bg-primary/10 px-3 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20">
          Target Balanced
        </div>
      </div>

      {/* Manual Search Section - Simplified UI */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-primary" />
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Local Database</h3>
          </div>
          <span className="text-[8px] font-mono text-muted-foreground opacity-30">V.2.0.4 ONLINE</span>
        </div>
        <Card className="border-none bg-white rounded-[32px] overflow-hidden shadow-sm">
          <ManualFoodLog embedded={true} />
        </Card>
      </div>

      <div className="h-[1px] w-full bg-accent/20" />

      {/* AI Plan Section */}
      {!plan ? (
        <Card className="border-none bg-[#181E04] p-10 text-center space-y-6 rounded-[40px] overflow-hidden relative group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
            <ChefHat size={120} className="text-white" />
          </div>
          <div className="relative z-10 space-y-2">
            <h3 className="text-xl font-bold text-white leading-tight">Synthesize Your Personalized Plan</h3>
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Optimized for your bio-profile</p>
          </div>

          <Button 
            onClick={generatePlan} 
            disabled={loading} 
            className="w-full h-18 bg-primary text-white hover:bg-primary/90 rounded-[28px] font-bold uppercase tracking-widest gap-3 shadow-xl relative z-10 transition-all active:scale-95 border-none"
          >
            {loading ? <Loader2 className="animate-spin text-white" /> : <Zap size={18} />}
            {loading ? 'Synthesizing...' : 'Generate AI Blueprint'}
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {plan.meals?.map((meal, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border border-border/40 bg-white rounded-[32px] overflow-hidden group hover:border-primary/40 transition-all p-1 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                  <div className="flex min-h-[140px]">
                    <div className="w-24 bg-accent/10 rounded-[28px] flex flex-col items-center justify-center p-2 text-primary relative overflow-hidden group-hover:bg-primary/5 transition-colors m-1">
                       <ChefHat size={32} className="relative z-10 group-hover:scale-110 transition-transform opacity-60" />
                       <span className="text-[8px] font-black uppercase text-muted-foreground mt-2 tracking-tighter opacity-60 leading-none text-center">{meal.type || 'MEAL'}</span>
                    </div>
                    <CardContent className="flex-1 p-5 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="font-bold text-base text-foreground leading-tight group-hover:text-primary transition-colors">{meal.name}</div>
                        <div className="text-[10px] text-muted-foreground font-bold line-clamp-1 uppercase tracking-tighter mt-1 opacity-70 italic font-mono">{meal.benefit || (meal as unknown as { health_benefit: string }).health_benefit}</div>
                      </div>
                      <div className="flex justify-between items-end border-t border-accent/10 pt-3 mt-3">
                        <div className="text-xl font-black text-[#181E04] tracking-tighter">{meal.calories} <span className="text-[10px] text-muted-foreground opacity-30 font-bold uppercase">KCAL</span></div>
                        <div className="flex gap-2">
                           <MealMacro label="P" value={meal.protein || meal.macros?.protein} color="bg-blue-500" />
                           <MealMacro label="C" value={meal.carbs || meal.macros?.carbs} color="bg-amber-500" />
                           <MealMacro label="F" value={meal.fat || meal.macros?.fat} color="bg-red-500" />
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <Button variant="ghost" onClick={() => setPlan(null)} className="w-full h-14 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] mt-4 transition-colors">
            [ Reconfigure Strategy ]
          </Button>
        </div>
      )}
    </div>
  );
};

const MealMacro = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
  <div className="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded-lg">
    <div className={cn("w-1 h-1 rounded-full", color)} />
    <span className="text-[9px] font-black text-foreground">{value}<span className="opacity-40">{label}</span></span>
  </div>
);
