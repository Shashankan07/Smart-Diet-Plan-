import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, Minus, X, Database, Mic, MicOff, Sparkles, Loader2, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { FOOD_DATABASE } from '@/src/data/food-database';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/src/lib/auth';
import { cn } from '@/lib/utils';
import { getFoodNutritionFromAI } from '@/src/lib/gemini';

interface FoodItem {
  id?: string;
  name: string;
  localName: string;
  cuisine: string;
  category: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  gi?: string;
  serving_size?: string;
  aiGenerated?: boolean;
  local_name?: string;
}

export const ManualFoodLog = ({ isOpen, onClose, embedded = false }: { isOpen?: boolean; onClose?: () => void; embedded?: boolean }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<FoodItem | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customServingSize, setCustomServingSize] = useState("");
  const [mealCategory, setMealCategory] = useState<string>("Lunch");
  const lastAutoSearchQuery = useRef('');

  const startListening = () => {
    interface SpeechRecognitionConstructor {
      new(): {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onstart: () => void;
        onend: () => void;
        onerror: () => void;
        onresult: (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
        start: () => void;
      };
    }

    const SpeechRecognition = (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition || 
                                (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
    };

    recognition.start();
  };

  const categories = useMemo(() => Array.from(new Set(FOOD_DATABASE.map(f => f.category))), []);

  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter(food => {
      const matchesSearch = 
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.localName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleLog = async (food: FoodItem, isAI = false) => {
    if (!user) return;
    
    // Calculate final nutrients based on quantity
    const multiplier = quantity;
    const path = 'mealLogs';
    try {
      await addDoc(collection(db, path), {
        userId: user.uid,
        foodName: food.name,
        calories: Math.round(Number(food.calories) * multiplier),
        protein: Math.round(Number(food.protein) * multiplier),
        carbs: Math.round(Number(food.carbs) * multiplier),
        fat: Math.round(Number(food.fat) * multiplier),
        fiber: Math.round(Number(food.fiber || 0) * multiplier),
        sugar: Math.round(Number(food.sugar || 0) * multiplier),
        sodium: Math.round(Number(food.sodium || 0) * multiplier),
        calcium: Math.round(Number(food.calcium || 0) * multiplier),
        iron: Math.round(Number(food.iron || 0) * multiplier),
        potassium: Math.round(Number(food.potassium || 0) * multiplier),
        mealType: mealCategory,
        servingSize: customServingSize || food.serving_size || food.servingSize,
        quantity: quantity,
        timestamp: serverTimestamp(),
        manual: true,
        aiGenerated: isAI,
        cuisine: food.cuisine || 'Global'
      });
      if (onClose) onClose();
      setAiResult(null);
      setSelectedFood(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const selectFoodForLogging = (food: FoodItem) => {
    setSelectedFood(food);
    setQuantity(1);
    setCustomServingSize(food.servingSize || food.serving_size || "");
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setAiLoading(true);
    try {
      const result = await getFoodNutritionFromAI(searchQuery);
      setAiResult(result);
    } catch (error) {
      console.error("AI Search failed:", error);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    // Auto-trigger AI search if no local results found after a short debounce
    if (searchQuery.length >= 3 && filteredFoods.length === 0 && searchQuery !== lastAutoSearchQuery.current && !aiLoading && !aiResult) {
      const timer = setTimeout(() => {
        handleAISearch();
        lastAutoSearchQuery.current = searchQuery;
      }, 1500); // 1.5s debounce to allow typing
      return () => clearTimeout(timer);
    }
    
    // Clear aiResult if search query is cleared or changed significantly
    if (searchQuery.length < 2) {
      setAiResult(null);
      lastAutoSearchQuery.current = '';
    }
  }, [searchQuery, filteredFoods.length, aiLoading, aiResult]);

  if (!embedded && !isOpen) return null;

  const content = (
    <div className={cn(
      "bg-card w-full rounded-[32px] border border-border shadow-2xl overflow-hidden flex flex-col",
      embedded ? "h-[500px] border-none shadow-none bg-transparent" : "max-w-lg max-h-[85vh]"
    )}>
      {!embedded && (
        <div className="p-6 border-b border-border flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-bold text-foreground">Find Food</h2>
            <p className="text-[10px] text-muted-foreground font-mono">[ Searching options ]</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X size={20} />
          </Button>
        </div>
      )}

      <div className={cn("p-4 space-y-4", !embedded && "bg-background/20")}>
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search biological match (Tamil/English)..." 
              className="pl-12 bg-white border-border h-14 rounded-2xl focus:ring-primary text-foreground placeholder:text-muted-foreground/50 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={startListening}
            variant="outline" 
            className={cn(
              "h-14 w-14 rounded-2xl border-border bg-white transition-all",
              isListening ? "text-primary border-primary animate-pulse" : "text-muted-foreground hover:text-primary"
            )}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scroll-show">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border transition-all",
              !selectedCategory ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white text-muted-foreground border-border hover:border-primary/50"
            )}
          >
            All Bio-Data
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border transition-all",
                selectedCategory === cat ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 overflow-y-auto">
        <div className="space-y-2 py-4">
          {selectedFood ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setSelectedFood(null)} className="rounded-full h-8 w-8">
                  <ChevronLeft size={18} />
                </Button>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-foreground">{selectedFood.name}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest leading-none">Healthy Choice</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block ml-1">How much? (Quantity)</label>
                  <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-border shadow-sm">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity(prev => Math.max(0.1, +(prev - 0.1).toFixed(1)))}
                      className="rounded-xl h-12 w-12 bg-accent/20"
                    >
                      <Minus size={18} />
                    </Button>
                    <div className="flex-1">
                      <Input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="text-center text-xl font-black border-none shadow-none focus-visible:ring-0 h-10"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity(prev => +(prev + 0.1).toFixed(1))}
                      className="rounded-xl h-12 w-12 bg-accent/20"
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block ml-1">Meal category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => (
                      <button
                        key={type}
                        onClick={() => setMealCategory(type)}
                        className={cn(
                          "py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                          mealCategory === type 
                          ? "bg-[#181E04] text-white border-[#181E04] shadow-lg shadow-black/10 scale-[1.02]" 
                          : "bg-white text-muted-foreground border-border hover:bg-accent/5"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block ml-1">Serving size (e.g. 1 plate, 200g)</label>
                  <Input 
                    value={customServingSize}
                    onChange={(e) => setCustomServingSize(e.target.value)}
                    placeholder="Describe the portion size"
                    className="h-14 rounded-2xl bg-white border-border text-sm font-bold placeholder:font-normal"
                  />
                </div>

                <Card className="bg-primary/5 border-primary/20 rounded-[24px] p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Nutrients</span>
                    <div className="text-2xl font-black text-primary tracking-tighter">
                      {Math.round(selectedFood.calories * quantity)} <span className="text-[10px] text-primary/60 font-bold uppercase">KC</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MacroBadgeCompact label="P" value={Math.round(selectedFood.protein * quantity)} color="text-blue-600" />
                    <MacroBadgeCompact label="C" value={Math.round(selectedFood.carbs * quantity)} color="text-amber-600" />
                    <MacroBadgeCompact label="F" value={Math.round(selectedFood.fat * quantity)} color="text-red-600" />
                  </div>
                </Card>

                <Button 
                  onClick={() => handleLog(selectedFood, !!selectedFood.aiGenerated)}
                  className="w-full h-16 bg-primary text-white hover:bg-primary/90 rounded-[24px] text-lg font-bold shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                  Save Food Log
                </Button>
              </div>
            </div>
          ) : (
            <>
              {aiResult && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <Sparkles size={12} className="text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Best Match</span>
                  </div>
                  <div 
                    onClick={() => selectFoodForLogging({...aiResult, aiGenerated: true})}
                    className="p-5 bg-primary/5 border border-primary/20 rounded-[24px] hover:border-primary/40 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Sparkles size={40} className="text-primary" />
                    </div>
                    <div className="flex justify-between items-center relative z-10">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-bold text-foreground leading-none">{aiResult.name}</span>
                          {aiResult.local_name && (
                            <span className="text-[10px] text-muted-foreground italic opacity-60">{aiResult.local_name}</span>
                          )}
                        </div>
                        <div className="flex gap-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                          <span>{aiResult.serving_size}</span>
                          <span className={cn(
                            "font-bold",
                            aiResult.gi === 'Low' ? "text-emerald-600" : aiResult.gi === 'High' ? "text-red-500" : "text-amber-500"
                          )}>{aiResult.gi} GI</span>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div className="text-2xl font-black text-primary tracking-tighter">
                          {aiResult.calories}
                        </div>
                        <Plus size={16} className="text-primary" />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <MacroBadgeCompact label="P" value={aiResult.protein} color="text-blue-600" />
                      <MacroBadgeCompact label="C" value={aiResult.carbs} color="text-amber-600" />
                      <MacroBadgeCompact label="F" value={aiResult.fat} color="text-red-600" />
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setAiResult(null)}
                    className="mt-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground h-auto p-1 px-2"
                  >
                    Clear AI Result
                  </Button>
                  <div className="h-[1px] w-full bg-border my-6" />
                </div>
              )}

              {filteredFoods.length > 0 ? (
                filteredFoods.map(food => (
                  <div 
                    key={food.id}
                    onClick={() => selectFoodForLogging(food)}
                    className="p-4 bg-white border border-border rounded-[20px] hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-foreground leading-none">{food.name}</span>
                          <span className="text-[9px] text-muted-foreground italic opacity-60">{food.localName}</span>
                        </div>
                        <div className="flex gap-3 text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
                          <span>{food.servingSize}</span>
                          <span className={cn(
                            "font-bold",
                            food.gi === 'Low' ? "text-emerald-600" : food.gi === 'High' ? "text-red-500" : "text-amber-500"
                          )}>{food.gi} GI</span>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div className="text-lg font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
                          {food.calories}
                        </div>
                        <Plus size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <MacroBadgeCompact label="P" value={food.protein} color="text-blue-600" />
                      <MacroBadgeCompact label="C" value={food.carbs} color="text-amber-600" />
                      <MacroBadgeCompact label="F" value={food.fat} color="text-red-600" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 px-6 bg-accent/5 rounded-[32px] border border-dashed border-accent/20">
                  <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Database size={20} className="text-muted-foreground opacity-40" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1">No Food Found</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.1em] mb-6 leading-relaxed">
                    Let's use AI to find nutritional info for "{searchQuery}"
                  </p>
                  
                  <Button 
                    onClick={handleAISearch} 
                    disabled={aiLoading || !searchQuery}
                    className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 rounded-2xl gap-3 font-bold shadow-lg"
                  >
                    {aiLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    {aiLoading ? 'AI Searching...' : 'Search with AI'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm flex items-center justify-center p-4">
      {content}
    </div>
  );
};

const MacroBadgeCompact = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
  <div className="flex items-center gap-1">
    <span className="text-[7px] font-black uppercase opacity-40">{label}:</span>
    <span className={cn("text-[10px] font-bold", color)}>{value}g</span>
  </div>
);
