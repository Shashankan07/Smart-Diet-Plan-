import React, { useState } from 'react';
import { Camera, X, Loader2, Apple, CheckCircle2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '@/src/lib/auth';
import { analyzeMealImage } from '@/src/lib/gemini';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ScanResult {
  food_name?: string;
  foodName?: string;
  estimated_calories?: number | string;
  estimatedCalories?: number | string;
  healthiness_score?: number;
  healthinessScore?: number;
  estimated_portion_size?: string;
  estimatedPortionSize?: string;
  macro_breakdown?: {
    protein?: number | string;
    carbs?: number | string;
    fat?: number | string;
    fiber?: number | string;
    sugar?: number | string;
    sodium?: number | string;
  };
  macroBreakdown?: {
    protein?: number | string;
    carbs?: number | string;
    fat?: number | string;
    fiber?: number | string;
    sugar?: number | string;
    sodium?: number | string;
  };
  micronutrients?: {
    calcium?: number | string;
    iron?: number | string;
    potassium?: number | string;
    sodium?: number | string;
  };
}

export function FoodScanner({ onComplete }: { onComplete: () => void }) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const { user } = useAuth();

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const analysis = await analyzeMealImage(base64);
      setResult(analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !result) return;
    setLoading(true);
    try {
      const macros = result.macro_breakdown || result.macroBreakdown || {};
      const micros = result.micronutrients || {};
      await addDoc(collection(db, 'mealLogs'), {
        userId: user.uid,
        foodName: result.food_name || result.foodName,
        calories: Number(result.estimated_calories || result.estimatedCalories || 0),
        protein: Number(macros.protein || 0),
        carbs: Number(macros.carbs || 0),
        fat: Number(macros.fat || 0),
        fiber: Number(macros.fiber || 0),
        sugar: Number(macros.sugar || 0),
        sodium: Number(micros.sodium || macros.sodium || 0),
        calcium: Number(micros.calcium || 0),
        iron: Number(micros.iron || 0),
        potassium: Number(micros.potassium || 0),
        mealType: 'snack', // Default, can be improved
        timestamp: serverTimestamp(),
        manual: false
      });
      onComplete();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'mealLogs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-[0_30px_90px_-20px_rgba(24,30,4,0.2)] relative border border-accent/20"
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 z-10 bg-accent/40 backdrop-blur-md rounded-full text-foreground border border-accent/30" 
          onClick={onComplete}
        >
          <X size={20} />
        </Button>

        {!image ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary border border-primary/20 rotate-3">
              <Camera size={40} className="-rotate-3" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">AI Neural Scan</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">Status: Optical Ready</p>
              <p className="text-xs text-muted-foreground font-medium max-w-[200px] mx-auto leading-relaxed">Snap a photo and the AI will decompose the meal into nutritional tokens.</p>
            </div>
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
              <div className={cn(buttonVariants({ variant: 'default' }), "w-full h-14 bg-primary text-white hover:bg-primary/90 rounded-2xl text-md font-bold uppercase tracking-widest flex items-center justify-center shadow-lg")}>
                Start Scanner
              </div>
            </label>
          </div>
        ) : (
          <div className="flex flex-col h-full max-h-[85vh]">
            <div className="relative h-64 w-full bg-accent/20 overflow-hidden">
              <img src={image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-4 border-primary/30 animate-pulse pointer-events-none"></div>
            </div>
            
            <ScrollArea className="flex-1 p-6">
              {!result ? (
                <div className="space-y-6 text-center py-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground">Frame Captured</h3>
                    <p className="text-xs text-muted-foreground font-medium opacity-60 uppercase tracking-widest">Awaiting Bio-Extraction</p>
                  </div>
                  <Button onClick={handleAnalyze} disabled={loading} className="w-full h-14 bg-accent/20 text-foreground border border-accent/30 hover:bg-accent/40 rounded-2xl gap-3 font-bold transition-all shadow-sm">
                    {loading ? <Loader2 className="animate-spin" /> : <Apple size={20} className="text-primary" />}
                    {loading ? 'Processing...' : 'Run Neural Analysis'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Analysis Matrix Synchronized</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">{result.food_name || result.foodName}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Portion: {result.estimated_portion_size || result.estimatedPortionSize || 'Standard'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-accent/10 rounded-2xl border border-accent/20 shadow-inner group">
                      <div className="text-3xl font-black text-primary tracking-tighter transition-transform group-hover:scale-105">{result.estimated_calories || result.estimatedCalories}</div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Daily Inflow KCAL</div>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-2xl border border-secondary/20 shadow-inner group">
                      <div className="text-3xl font-black text-foreground tracking-tighter transition-transform group-hover:scale-105">{result.healthiness_score || result.healthinessScore}<span className="text-xs opacity-40 ml-0.5">/10</span></div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Health Efficiency</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1 opacity-60">Macro Distribution</h4>
                    <div className="flex justify-between items-center bg-white border border-accent/10 p-5 rounded-[28px] shadow-sm">
                      <MacroItem label="P" value={(result.macro_breakdown || result.macroBreakdown)?.protein} color="#3B82F6" />
                      <div className="w-[1px] h-6 bg-accent/20" />
                      <MacroItem label="C" value={(result.macro_breakdown || result.macroBreakdown)?.carbs} color="#B87739" />
                      <div className="w-[1px] h-6 bg-accent/20" />
                      <MacroItem label="F" value={(result.macro_breakdown || result.macroBreakdown)?.fat} color="#EF4444" />
                    </div>
                  </div>

                  <Button onClick={handleSave} disabled={loading} className="w-full h-16 bg-primary text-white hover:bg-primary/90 rounded-[24px] gap-3 text-lg font-bold uppercase tracking-widest shadow-xl transition-all active:scale-95 group">
                    {loading ? <Loader2 className="animate-spin text-white" /> : <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />}
                    Confirm Entry
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const MacroItem = ({ label, value, color }: { label: string; value?: number | string; color: string }) => (
  <div className="flex flex-col items-center">
    <div className="text-sm font-bold">{value || '0'}g</div>
    <div className="flex items-center gap-1">
      <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
      <span className="text-[10px] text-gray-500 uppercase font-bold">{label}</span>
    </div>
  </div>
);
