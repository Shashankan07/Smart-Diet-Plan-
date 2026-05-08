export interface FoodItem {
  id: string;
  name: string;
  localName: string;
  cuisine: string;
  category: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  potassium: number;
  gi: string;
}

export const FOOD_DATABASE: FoodItem[] = [
  // --- TAMIL NADU BREAKFAST ---
  { id: 'tn-idli', name: 'Idli', localName: 'இட்லி', cuisine: 'Tamil Nadu', category: 'Breakfast', servingSize: '2 pcs (100g)', calories: 120, protein: 4.0, carbs: 24, fat: 1.0, fiber: 1.5, sugar: 0.5, sodium: 250, potassium: 90, gi: 'High' },
  { id: 'tn-dosa', name: 'Plain Dosa', localName: 'தோசை', cuisine: 'Tamil Nadu', category: 'Breakfast', servingSize: '1 med (100g)', calories: 200, protein: 4.0, carbs: 34, fat: 6, fiber: 2, sugar: 1, sodium: 300, potassium: 120, gi: 'High' },
  { id: 'tn-pongal', name: 'Ven Pongal', localName: 'வேண் பொங்கல்', cuisine: 'Tamil Nadu', category: 'Breakfast', servingSize: '1 bowl (200g)', calories: 300, protein: 7, carbs: 45, fat: 10, fiber: 3, sugar: 1, sodium: 600, potassium: 180, gi: 'Medium' },
  { id: 'tn-appam', name: 'Appam', localName: 'ஆப்பம்', cuisine: 'Tamil Nadu', category: 'Breakfast', servingSize: '2 pcs (120g)', calories: 240, protein: 4, carbs: 44, fat: 4, fiber: 2, sugar: 2, sodium: 300, potassium: 140, gi: 'High' },
  { id: 'tn-idiyappam', name: 'Idiyappam', localName: 'இடியாப்பம்', cuisine: 'Tamil Nadu', category: 'Breakfast', servingSize: '3 nests (150g)', calories: 270, protein: 5, carbs: 58, fat: 1.5, fiber: 2, sugar: 1, sodium: 200, potassium: 150, gi: 'High' },
  { id: 'tn-uthappam', name: 'Uthappam', localName: 'உத்தப்பம்', cuisine: 'Tamil Nadu', category: 'Breakfast', servingSize: '1 large (150g)', calories: 270, protein: 6, carbs: 40, fat: 9, fiber: 3, sugar: 2, sodium: 450, potassium: 220, gi: 'High' },
  { id: 'tn-adai', name: 'Adai', localName: 'அடை', cuisine: 'Tamil Nadu', category: 'Breakfast', servingSize: '1 med (120g)', calories: 270, protein: 11, carbs: 35, fat: 8, fiber: 6, sugar: 2, sodium: 350, potassium: 320, gi: 'Low-Med' },
  { id: 'tn-upma', name: 'Rava Upma', localName: 'ரவா உப்புமா', cuisine: 'Tamil Nadu', category: 'Breakfast', servingSize: '1 bowl (150g)', calories: 250, protein: 6, carbs: 40, fat: 7, fiber: 2.5, sugar: 2, sodium: 500, potassium: 140, gi: 'Med-High' },
  { id: 'tn-paniyaram', name: 'Kuzhi Paniyaram', localName: 'குழி பணியாரம்', cuisine: 'Tamil Nadu', category: 'Breakfast', servingSize: '8 pcs (200g)', calories: 380, protein: 10, carbs: 52, fat: 12, fiber: 3, sugar: 2, sodium: 700, potassium: 260, gi: 'High' },
  { id: 'tn-ragi-dosa', name: 'Ragi Dosa', localName: 'ராகி தோசை', cuisine: 'Tamil Nadu', category: 'Breakfast', servingSize: '1 med (100g)', calories: 200, protein: 5, carbs: 35, fat: 3, fiber: 4, sugar: 1, sodium: 300, potassium: 180, gi: 'Medium' },

  // --- TAMIL NADU LUNCH ---
  { id: 'tn-rice', name: 'Steamed Rice', localName: 'சோறு', cuisine: 'Tamil Nadu', category: 'Lunch', servingSize: '1 cup (180g)', calories: 240, protein: 4, carbs: 53, fat: 0.5, fiber: 0.6, sugar: 0, sodium: 5, potassium: 55, gi: 'High' },
  { id: 'tn-sambar-sadam', name: 'Sambar Sadam', localName: 'சாம்பார் சாதம்', cuisine: 'Tamil Nadu', category: 'Lunch', servingSize: '300g', calories: 330, protein: 10, carbs: 60, fat: 5, fiber: 8, sugar: 6, sodium: 800, potassium: 500, gi: 'Medium' },
  { id: 'tn-lemon-rice', name: 'Lemon Rice', localName: 'எலுமிச்சை சாதம்', cuisine: 'Tamil Nadu', category: 'Lunch', servingSize: '200g', calories: 350, protein: 6, carbs: 60, fat: 10, fiber: 3, sugar: 2, sodium: 650, potassium: 140, gi: 'High' },
  { id: 'tn-puli-rice', name: 'Tamarind Rice', localName: 'புளியோதரை', cuisine: 'Tamil Nadu', category: 'Lunch', servingSize: '200g', calories: 420, protein: 7, carbs: 65, fat: 13, fiber: 4, sugar: 6, sodium: 900, potassium: 180, gi: 'High' },
  { id: 'tn-curd-rice', name: 'Curd Rice', localName: 'தயிர் சாதம்', cuisine: 'Tamil Nadu', category: 'Lunch', servingSize: '250g', calories: 310, protein: 8, carbs: 48, fat: 8, fiber: 1, sugar: 6, sodium: 700, potassium: 350, gi: 'Medium' },
  { id: 'tn-chicken-chettinad', name: 'Chettinad Chicken', localName: 'செட்டிநாடு சிக்கன்', cuisine: 'Tamil Nadu', category: 'Lunch', servingSize: '150g', calories: 280, protein: 24, carbs: 6, fat: 16, fiber: 2, sugar: 2, sodium: 700, potassium: 360, gi: 'Low' },

  // --- TAMIL NADU DINNER ---
  { id: 'tn-dosa-dinner', name: 'Masala Dosa', localName: 'மசாலா தோசை', cuisine: 'Tamil Nadu', category: 'Dinner', servingSize: '1 large', calories: 350, protein: 6, carbs: 45, fat: 12, fiber: 4, sugar: 2, sodium: 600, potassium: 450, gi: 'High' },
  { id: 'tn-parotta', name: 'Parotta (2pcs) + Salna', localName: 'பரோட்டா + சால்னா', cuisine: 'Tamil Nadu', category: 'Dinner', servingSize: '2 parottas', calories: 550, protein: 12, carbs: 75, fat: 22, fiber: 3, sugar: 4, sodium: 1200, potassium: 300, gi: 'High' },
  { id: 'tn-kothu-parotta', name: 'Veg Kothu Parotta', localName: 'வெஜ் கொத்து பரோட்டா', cuisine: 'Tamil Nadu', category: 'Dinner', servingSize: '250g', calories: 480, protein: 10, carbs: 65, fat: 20, fiber: 5, sugar: 4, sodium: 1100, potassium: 350, gi: 'High' },
  { id: 'tn-chapati-veg', name: 'Chapati (2pcs) + Veg Kurma', localName: 'சப்பாத்தி + வெஜ் குருமா', cuisine: 'Tamil Nadu', category: 'Dinner', servingSize: '2 chapatis + 150g kurma', calories: 380, protein: 12, carbs: 55, fat: 12, fiber: 8, sugar: 4, sodium: 800, potassium: 450, gi: 'Low' },
  { id: 'tn-mini-tiffin', name: 'Mini Tiffin', localName: 'மினி டிபன்', cuisine: 'Tamil Nadu', category: 'Dinner', servingSize: '1 set', calories: 750, protein: 18, carbs: 110, fat: 28, fiber: 8, sugar: 10, sodium: 1500, potassium: 600, gi: 'High' },
  { id: 'tn-egg-dosai', name: 'Egg Dosai', localName: 'முட்டை தோசை', cuisine: 'Tamil Nadu', category: 'Dinner', servingSize: '1 large', calories: 280, protein: 12, carbs: 32, fat: 12, fiber: 2, sugar: 1, sodium: 450, potassium: 250, gi: 'Medium' },

  // --- KERALA SPECIALS ---
  { id: 'kl-puttu', name: 'Puttu', localName: 'പുട്ട്', cuisine: 'Kerala', category: 'Breakfast', servingSize: '150g', calories: 280, protein: 6, carbs: 58, fat: 3, fiber: 4, sugar: 0.5, sodium: 150, potassium: 110, gi: 'Medium' },
  { id: 'kl-appam-stew', name: 'Appam + Veg Stew', localName: 'അപ്പം + വെജിറ്റബിൾ സ്റ്റൂ', cuisine: 'Kerala', category: 'Breakfast', servingSize: '450g', calories: 450, protein: 10, carbs: 75, fat: 12, fiber: 4, sugar: 4, sodium: 700, potassium: 600, gi: 'High' },
  { id: 'kl-avial', name: 'Avial', localName: 'അവിയൽ', cuisine: 'Kerala', category: 'Lunch', servingSize: '200g', calories: 260, protein: 6, carbs: 20, fat: 16, fiber: 6, sugar: 4, sodium: 600, potassium: 450, gi: 'Low' },

  // --- KARNATAKA SPECIALS ---
  { id: 'ka-bisi-bele-bath', name: 'Bisi Bele Bath', localName: 'ಬಿಸಿ ಬೇಳೆ பாத்', cuisine: 'Karnataka', category: 'Lunch', servingSize: '300g', calories: 420, protein: 12, carbs: 70, fat: 10, fiber: 10, sugar: 6, sodium: 900, potassium: 450, gi: 'Medium' },
  { id: 'ka-ragi-mudde', name: 'Ragi Mudde', localName: 'ರಾಗಿ ಮುದ್ದೆ', cuisine: 'Karnataka', category: 'Lunch', servingSize: '1 ball', calories: 200, protein: 5, carbs: 45, fat: 1, fiber: 6, sugar: 0, sodium: 20, potassium: 180, gi: 'Low' },

  // --- ANDHRA SPECIALS ---
  { id: 'ap-biryani', name: 'Hyderabadi Biryani', localName: 'బిర్యానీ', cuisine: 'Andhra', category: 'Lunch', servingSize: '350g', calories: 800, protein: 32, carbs: 95, fat: 28, fiber: 3, sugar: 4, sodium: 1300, potassium: 450, gi: 'Medium' },
  { id: 'ap-pesarattu', name: 'Pesarattu', localName: 'పెసరట్టు', cuisine: 'Andhra', category: 'Breakfast', servingSize: '1 dosa', calories: 320, protein: 14, carbs: 45, fat: 8, fiber: 10, sugar: 2, sodium: 600, potassium: 400, gi: 'Medium' },

  // --- SNACKS ---
  { id: 'snack-vada', name: 'Medu Vada', localName: 'உளுந்து வடை', cuisine: 'Tamil Nadu', category: 'Snack', servingSize: '2 pcs', calories: 310, protein: 10, carbs: 24, fat: 18, fiber: 4, sugar: 1, sodium: 600, potassium: 300, gi: 'Medium' },
  { id: 'snack-pakoda', name: 'Onion Pakoda', localName: 'வெங்காய பக்கோடா', cuisine: 'India', category: 'Snack', servingSize: '100g', calories: 450, protein: 8, carbs: 40, fat: 30, fiber: 5, sugar: 4, sodium: 700, potassium: 300, gi: 'Medium' },
  { id: 'snack-sundal', name: 'Channa Sundal', localName: 'கொண்டைக்கடலை சுண்டல்', cuisine: 'Tamil Nadu', category: 'Snack', servingSize: '150g', calories: 230, protein: 10, carbs: 35, fat: 6, fiber: 8, sugar: 4, sodium: 350, potassium: 420, gi: 'Low' },

  // --- RAWS/BASE ---
  { id: 'base-egg', name: 'Whole Egg', localName: 'முட்டை', cuisine: 'Global', category: 'Protein', servingSize: '1 large', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 0.6, sodium: 124, potassium: 126, gi: 'Low' },
  { id: 'base-chicken', name: 'Chicken Breast', localName: 'கோழி மார்பு', cuisine: 'Global', category: 'Protein', servingSize: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, potassium: 256, gi: 'Low' },
  { id: 'base-salmon', name: 'Salmon', localName: 'சால்மன்', cuisine: 'Global', category: 'Protein', servingSize: '100g', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 59, potassium: 363, gi: 'Low' },

  // --- VEGETABLES ---
  { id: 'veg-spinach', name: 'Spinach', localName: 'கீரை', cuisine: 'Global', category: 'Vegetables', servingSize: '100g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79, potassium: 558, gi: 'Low' },
  { id: 'veg-potato', name: 'Potato', localName: 'உருளைக்கிழங்கு', cuisine: 'Global', category: 'Vegetables', servingSize: '100g', calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8, sodium: 6, potassium: 421, gi: 'High' },

  // --- GLOBAL FAVORITES ---
  { id: 'global-burger', name: 'Cheeseburger + Fries', localName: 'Burger', cuisine: 'USA', category: 'Fast Food', servingSize: '1 meal', calories: 950, protein: 30, carbs: 95, fat: 48, fiber: 7, sugar: 10, sodium: 1600, potassium: 600, gi: 'High' },
  { id: 'global-pizza', name: 'Pizza Margherita', localName: 'Pizza', cuisine: 'Italy', category: 'Fast Food', servingSize: '1/2 pie', calories: 650, protein: 24, carbs: 72, fat: 26, fiber: 4, sugar: 8, sodium: 1400, potassium: 450, gi: 'High' },
  { id: 'global-tacos', name: 'Tacos al Pastor', localName: 'Tacos', cuisine: 'Mexico', category: 'Fast Food', servingSize: '3 tacos', calories: 600, protein: 28, carbs: 60, fat: 28, fiber: 6, sugar: 8, sodium: 1200, potassium: 550, gi: 'Medium' },
  
  // --- ADDITIONAL GLOBAL ---
  { id: 'global-sushi', name: 'Salmon Sushi Roll', localName: 'Sushi', cuisine: 'Japan', category: 'Japanese', servingSize: '8 pcs', calories: 350, protein: 12, carbs: 45, fat: 12, fiber: 2, sugar: 4, sodium: 800, potassium: 250, gi: 'Medium' },
  { id: 'global-ramen', name: 'Tonkotsu Ramen', localName: 'Ramen', cuisine: 'Japan', category: 'Japanese', servingSize: '1 bowl', calories: 600, protein: 25, carbs: 65, fat: 28, fiber: 4, sugar: 2, sodium: 1800, potassium: 400, gi: 'High' },
  { id: 'global-pad-thai', name: 'Pad Thai', localName: 'Pad Thai', cuisine: 'Thailand', category: 'Thai', servingSize: '300g', calories: 550, protein: 15, carbs: 80, fat: 18, fiber: 3, sugar: 12, sodium: 1200, potassium: 300, gi: 'High' },
  { id: 'global-hummus', name: 'Hummus & Pita', localName: 'Hummus', cuisine: 'Middle East', category: 'Snack', servingSize: '150g', calories: 380, protein: 10, carbs: 45, fat: 12, fiber: 8, sugar: 2, sodium: 600, potassium: 350, gi: 'Low' },
  
  // --- ADDITIONAL INDIAN REGIONAL ---
  { id: 'north-paneer-butter', name: 'Paneer Butter Masala', localName: 'பனீர் பட்டர் மசாலா', cuisine: 'North India', category: 'Lunch/Dinner', servingSize: '200g', calories: 450, protein: 15, carbs: 12, fat: 38, fiber: 2, sugar: 6, sodium: 800, potassium: 300, gi: 'Medium' },
  { id: 'north-dal-makhani', name: 'Dal Makhani', localName: 'தால் மக்கானி', cuisine: 'North India', category: 'Lunch/Dinner', servingSize: '200g', calories: 320, protein: 12, carbs: 28, fat: 16, fiber: 8, sugar: 2, sodium: 700, potassium: 450, gi: 'Low' },
  { id: 'north-chole-bhature', name: 'Chole Bhature', localName: 'சோலே பட்டூரே', cuisine: 'North India', category: 'Breakfast/Lunch', servingSize: '2 bhature + chole', calories: 850, protein: 18, carbs: 90, fat: 45, fiber: 12, sugar: 4, sodium: 1400, potassium: 500, gi: 'High' },
  { id: 'west-vada-pav', name: 'Vada Pav', localName: 'வடா பாவ்', cuisine: 'West India', category: 'Snack', servingSize: '1 pc', calories: 300, protein: 6, carbs: 40, fat: 12, fiber: 3, sugar: 2, sodium: 600, potassium: 200, gi: 'High' },
  { id: 'east-rosogolla', name: 'Rosogolla', localName: 'ரசகுல்லா', cuisine: 'East India', category: 'Dessert', servingSize: '2 pcs', calories: 250, protein: 4, carbs: 50, fat: 5, fiber: 0, sugar: 45, sodium: 40, potassium: 60, gi: 'High' },
  
  // --- RAW INGREDIENTS / BASICS ---
  { id: 'raw-white-rice', name: 'White Rice (raw)', localName: 'வெள்ளை அரிசி', cuisine: 'Global', category: 'Grain', servingSize: '100g', calories: 360, protein: 6.6, carbs: 79, fat: 0.6, fiber: 0.4, sugar: 0, sodium: 1, potassium: 115, gi: 'High' },
  { id: 'raw-brown-rice', name: 'Brown Rice', localName: 'கைக்குத்தல் அரிசி', cuisine: 'Global', category: 'Grain', servingSize: '100g', calories: 357, protein: 7.5, carbs: 76, fat: 2.7, fiber: 3.5, sugar: 0, sodium: 4, potassium: 268, gi: 'Low' },
  { id: 'raw-basmati-rice', name: 'Basmati Rice', localName: 'பாஸ்மதி அரிசி', cuisine: 'Global', category: 'Grain', servingSize: '100g', calories: 349, protein: 8, carbs: 78, fat: 0.7, fiber: 0.5, sugar: 0, sodium: 2, potassium: 110, gi: 'Low' },
  { id: 'raw-oats', name: 'Oats (rolled)', localName: 'ஓட்ஸ்', cuisine: 'Global', category: 'Grain', servingSize: '100g', calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 10, sugar: 0, sodium: 2, potassium: 429, gi: 'Medium' },
  { id: 'raw-quinoa', name: 'Quinoa', localName: 'குயினோவா', cuisine: 'Global', category: 'Grain', servingSize: '100g', calories: 368, protein: 14, carbs: 64, fat: 6, fiber: 7, sugar: 0, sodium: 5, potassium: 563, gi: 'Low' },
  { id: 'raw-ragi', name: 'Ragi (Finger Millet)', localName: 'ராகி', cuisine: 'India', category: 'Grain', servingSize: '100g', calories: 328, protein: 7.7, carbs: 72, fat: 1.5, fiber: 3.6, sugar: 0, sodium: 11, potassium: 408, gi: 'Medium' },
  { id: 'raw-wheat', name: 'Whole Wheat (Atta)', localName: 'கோதுமை மாவு', cuisine: 'Global', category: 'Grain', servingSize: '100g', calories: 340, protein: 13, carbs: 71, fat: 2.5, fiber: 12, sugar: 0.4, sodium: 2, potassium: 405, gi: 'Low' },
  
  // --- FRUITS ---
  { id: 'fruit-banana', name: 'Banana', localName: 'வாழைப்பழம்', cuisine: 'Global', category: 'Fruit', servingSize: '1 med (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, sodium: 1, potassium: 422, gi: 'Medium' },
  { id: 'fruit-apple', name: 'Apple', localName: 'ஆப்பிள்', cuisine: 'Global', category: 'Fruit', servingSize: '1 med (182g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 2, potassium: 195, gi: 'Low' },
  { id: 'fruit-mango', name: 'Mango', localName: 'மாம்பழம்', cuisine: 'Global', category: 'Fruit', servingSize: '1 cup (165g)', calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, sugar: 23, sodium: 2, potassium: 277, gi: 'Low' },
  { id: 'fruit-papaya', name: 'Papaya', localName: 'பப்பாளி', cuisine: 'Global', category: 'Fruit', servingSize: '1 cup (145g)', calories: 62, protein: 0.7, carbs: 16, fat: 0.4, fiber: 2.5, sugar: 11, sodium: 12, potassium: 264, gi: 'Medium' },
  
  // --- DAIRY ---
  { id: 'dairy-milk', name: 'Milk (Full Fat)', localName: 'பால்', cuisine: 'Global', category: 'Dairy', servingSize: '250ml', calories: 150, protein: 8, carbs: 12, fat: 8, fiber: 0, sugar: 12, sodium: 100, potassium: 350, gi: 'Low' },
  { id: 'dairy-paneer', name: 'Paneer', localName: 'பனீர்', cuisine: 'India', category: 'Dairy', servingSize: '100g', calories: 265, protein: 18, carbs: 1.2, fat: 20, fiber: 0, sugar: 0, sodium: 18, potassium: 110, gi: 'Low' },
  { id: 'dairy-curd', name: 'Curd/Yogurt', localName: 'தயிர்', cuisine: 'India', category: 'Dairy', servingSize: '100g', calories: 60, protein: 3, carbs: 4.5, fat: 3, fiber: 0, sugar: 4.5, sodium: 40, potassium: 150, gi: 'Low' },

  // --- SEAFOOD ---
  { id: 'sea-prawns', name: 'Prawns/Shrimp', localName: 'இறால்', cuisine: 'Global', category: 'Protein', servingSize: '100g', calories: 99, protein: 24, carbs: 0, fat: 0.3, fiber: 0, sugar: 0, sodium: 111, potassium: 259, gi: 'Low' },
  
  // --- PULSES/LEGUMES ---
  { id: 'pulse-chickpeas', name: 'Chickpeas (boiled)', localName: 'கொண்டைக்கடலை', cuisine: 'Global', category: 'Pulse', servingSize: '100g', calories: 164, protein: 9, carbs: 27, fat: 2.6, fiber: 8, sugar: 4.8, sodium: 24, potassium: 291, gi: 'Low' },
  { id: 'pulse-moong-dal', name: 'Moong Dal (cooked)', localName: 'பாசிப்பருப்பு', cuisine: 'India', category: 'Pulse', servingSize: '100g', calories: 105, protein: 7, carbs: 19, fat: 0.4, fiber: 4.5, sugar: 2, sodium: 2, potassium: 250, gi: 'Low' },

  // --- NORTH INDIAN DINNER ---
  { id: 'ni-butter-chicken', name: 'Butter Chicken', localName: 'பட்டர் சிக்கன்', cuisine: 'North India', category: 'Dinner', servingSize: '200g', calories: 450, protein: 28, carbs: 10, fat: 34, fiber: 2, sugar: 6, sodium: 950, potassium: 400, gi: 'Medium' },
  { id: 'ni-naan-garlic', name: 'Garlic Naan', localName: 'பூண்டு நான்', cuisine: 'North India', category: 'Dinner', servingSize: '1 pc (90g)', calories: 280, protein: 8, carbs: 48, fat: 6, fiber: 2, sugar: 3, sodium: 450, potassium: 120, gi: 'High' },
  { id: 'ni-roti-phulka', name: 'Phulka / Roti', localName: 'ரொட்டி', cuisine: 'North India', category: 'Dinner', servingSize: '1 pc (30g)', calories: 85, protein: 3, carbs: 18, fat: 0.5, fiber: 3, sugar: 0, sodium: 2, potassium: 90, gi: 'Low' },
  { id: 'ni-palak-paneer', name: 'Palak Paneer', localName: 'பாலக் பனீர்', cuisine: 'North India', category: 'Dinner', servingSize: '200g', calories: 290, protein: 14, carbs: 8, fat: 22, fiber: 5, sugar: 2, sodium: 700, potassium: 550, gi: 'Low' },
  { id: 'ni-bhindi-masala', name: 'Bhindi Masala', localName: 'வெண்டைக்காய் மசாலா', cuisine: 'North India', category: 'Lunch', servingSize: '150g', calories: 160, protein: 4, carbs: 12, fat: 12, fiber: 6, sugar: 2, sodium: 500, potassium: 450, gi: 'Low' },
  { id: 'ni-aloo-gobi', name: 'Aloo Gobi', localName: 'ஆலூ கோபி', cuisine: 'North India', category: 'Lunch', servingSize: '150g', calories: 180, protein: 5, carbs: 22, fat: 9, fiber: 5, sugar: 3, sodium: 600, potassium: 500, gi: 'Medium' },
  
  // --- CHINESE (INDIAN STYLE) ---
  { id: 'chi-veg-noodles', name: 'Veg Hakka Noodles', localName: 'வெஜ் நூடுல்ஸ்', cuisine: 'Indo-Chinese', category: 'Dinner', servingSize: '250g', calories: 420, protein: 10, carbs: 65, fat: 14, fiber: 4, sugar: 4, sodium: 1200, potassium: 300, gi: 'High' },
  { id: 'chi-gobi-manchurian', name: 'Gobi Manchurian', localName: 'கோபி மஞ்சூரியன்', cuisine: 'Indo-Chinese', category: 'Dinner', servingSize: '150g', calories: 320, protein: 6, carbs: 35, fat: 18, fiber: 3, sugar: 8, sodium: 1100, potassium: 250, gi: 'High' },
  { id: 'chi-fried-rice', name: 'Veg Fried Rice', localName: 'வெஜ் பிரைடு ரைஸ்', cuisine: 'Indo-Chinese', category: 'Lunch', servingSize: '250g', calories: 450, protein: 8, carbs: 75, fat: 14, fiber: 4, sugar: 2, sodium: 1100, potassium: 280, gi: 'High' },
  
  // --- CONTINENTAL / WESTERN ---
  { id: 'west-pasta-alfredo', name: 'Pasta Alfredo', localName: 'பாஸ்தா', cuisine: 'Italian', category: 'Dinner', servingSize: '300g', calories: 650, protein: 18, carbs: 75, fat: 32, fiber: 4, sugar: 4, sodium: 900, potassium: 350, gi: 'High' },
  { id: 'west-grilled-chicken', name: 'Grilled Chicken & Veggies', localName: 'கிரில் சிக்கன்', cuisine: 'Western', category: 'Dinner', servingSize: '1 plate', calories: 450, protein: 45, carbs: 20, fat: 18, fiber: 8, sugar: 4, sodium: 800, potassium: 850, gi: 'Low' },
  { id: 'west-caesar-salad', name: 'Caesar Salad', localName: 'சாலட்', cuisine: 'Western', category: 'Lunch', servingSize: '1 bowl', calories: 350, protein: 12, carbs: 15, fat: 28, fiber: 3, sugar: 2, sodium: 900, potassium: 220, gi: 'Medium' },
  { id: 'west-sandwich-sub', name: 'Veggie Sub Sandwich', localName: 'சாண்ட்விச்', cuisine: 'Western', category: 'Lunch', servingSize: '6 inch', calories: 320, protein: 10, carbs: 55, fat: 8, fiber: 6, sugar: 8, sodium: 800, potassium: 300, gi: 'Medium' },

  // --- MORE TAMIL NADU LUNCH/DINNER ---
  { id: 'tn-fish-curry', name: 'Meen Kuzhambu', localName: 'மீன் குழம்பு', cuisine: 'Tamil Nadu', category: 'Lunch', servingSize: '200g', calories: 250, protein: 22, carbs: 8, fat: 14, fiber: 2, sugar: 2, sodium: 850, potassium: 450, gi: 'Low' },
  { id: 'tn-mutton-chukka', name: 'Mutton Chukka', localName: 'மட்டன் சுக்கா', cuisine: 'Tamil Nadu', category: 'Dinner', servingSize: '150g', calories: 380, protein: 26, carbs: 4, fat: 28, fiber: 1, sugar: 1, sodium: 900, potassium: 400, gi: 'Low' },
  { id: 'tn-veg-biryani', name: 'Veg Biryani', localName: 'வெஜ் பிரியாணி', cuisine: 'Tamil Nadu', category: 'Lunch', servingSize: '300g', calories: 450, protein: 12, carbs: 75, fat: 15, fiber: 8, sugar: 4, sodium: 1000, potassium: 500, gi: 'Medium' },
  { id: 'tn-rasam', name: 'Rasam', localName: 'இரசம்', cuisine: 'Tamil Nadu', category: 'Lunch', servingSize: '150ml', calories: 60, protein: 1.5, carbs: 8, fat: 2, fiber: 1, sugar: 1, sodium: 500, potassium: 250, gi: 'Low' },
  
  // --- HEALTH & DIET ---
  { id: 'diet-quinoa-bowl', name: 'Quinoa Veggie Bowl', localName: 'குயினோவா', cuisine: 'Global', category: 'Lunch', servingSize: '300g', calories: 320, protein: 12, carbs: 45, fat: 12, fiber: 10, sugar: 4, sodium: 400, potassium: 650, gi: 'Low' },
  { id: 'diet-sprouted-salad', name: 'Sprouted Moong Salad', localName: 'முளைகட்டிய பயறு', cuisine: 'India', category: 'Snack', servingSize: '150g', calories: 180, protein: 12, carbs: 28, fat: 2, fiber: 8, sugar: 4, sodium: 150, potassium: 450, gi: 'Low' },
  { id: 'diet-oats-khichdi', name: 'Oats Veggie Khichdi', localName: 'ஓட்ஸ் கிச்சடி', cuisine: 'India', category: 'Dinner', servingSize: '250g', calories: 280, protein: 10, carbs: 45, fat: 8, fiber: 10, sugar: 2, sodium: 600, potassium: 400, gi: 'Medium' },
  
  // --- BEVERAGES ---
  { id: 'bev-filter-coffee', name: 'Filter Coffee', localName: 'காபி', cuisine: 'Tamil Nadu', category: 'Beverage', servingSize: '150ml', calories: 80, protein: 3, carbs: 12, fat: 3, fiber: 0, sugar: 10, sodium: 40, potassium: 150, gi: 'Low' },
  { id: 'bev-masala-chai', name: 'Masala Chai', localName: 'டீ', cuisine: 'India', category: 'Beverage', servingSize: '150ml', calories: 90, protein: 3, carbs: 14, fat: 3, fiber: 0, sugar: 12, sodium: 45, potassium: 160, gi: 'Low' },
  { id: 'bev-tender-coconut', name: 'Tender Coconut Water', localName: 'இளநீர்', cuisine: 'Global', category: 'Beverage', servingSize: '300ml', calories: 60, protein: 2, carbs: 15, fat: 0, fiber: 0, sugar: 12, sodium: 250, potassium: 600, gi: 'Low' },
  { id: 'bev-butter-milk', name: 'Neer Mor (Buttermilk)', localName: 'நீர் மோர்', cuisine: 'Tamil Nadu', category: 'Beverage', servingSize: '200ml', calories: 40, protein: 2, carbs: 4, fat: 2, fiber: 1, sugar: 3, sodium: 350, potassium: 200, gi: 'Low' },
  { id: 'bev-green-tea', name: 'Green Tea', localName: 'கிரீன் டீ', cuisine: 'Global', category: 'Beverage', servingSize: '200ml', calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 5, potassium: 30, gi: 'Low' },
  
  // --- MORE FRUITS & NUTS ---
  { id: 'fruit-guava', name: 'Guava', localName: 'கொய்யா', cuisine: 'Global', category: 'Fruit', servingSize: '100g', calories: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5, sugar: 9, sodium: 2, potassium: 417, gi: 'Low' },
  { id: 'fruit-pomegranate', name: 'Pomegranate', localName: 'மாதளம்', cuisine: 'Global', category: 'Fruit', servingSize: '100g', calories: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4, sugar: 14, sodium: 3, potassium: 236, gi: 'Low' },
  { id: 'nut-almonds', name: 'Almonds', localName: 'பாதாம்', cuisine: 'Global', category: 'Protein', servingSize: '30g', calories: 170, protein: 6, carbs: 6, fat: 15, fiber: 3.5, sugar: 1, sodium: 1, potassium: 200, gi: 'Low' },
  { id: 'nut-walnuts', name: 'Walnuts', localName: 'அக்ரூட்', cuisine: 'Global', category: 'Protein', servingSize: '30g', calories: 185, protein: 4, carbs: 4, fat: 18, fiber: 2, sugar: 1, sodium: 1, potassium: 125, gi: 'Low' },
  
  // --- MORE BREAKFAST ---
  { id: 'tn-wheat-upma', name: 'Wheat Upma', localName: 'கோதுமை உப்புமா', cuisine: 'Tamil Nadu', category: 'Breakfast', servingSize: '150g', calories: 220, protein: 8, carbs: 38, fat: 5, fiber: 6, sugar: 2, sodium: 450, potassium: 280, gi: 'Low-Med' },
  { id: 'tn-semiya-upma', name: 'Semiya Upma', localName: 'சேமியா உப்புமா', cuisine: 'Tamil Nadu', category: 'Breakfast', servingSize: '150g', calories: 260, protein: 5, carbs: 48, fat: 6, fiber: 2, sugar: 2, sodium: 500, potassium: 120, gi: 'High' },

  // --- KOREAN ---
  { id: 'kr-bibimbap', name: 'Bibimbap', localName: '비빔밥', cuisine: 'Korean', category: 'Lunch', servingSize: '400g', calories: 550, protein: 22, carbs: 85, fat: 12, fiber: 8, sugar: 6, sodium: 1200, potassium: 650, gi: 'Medium' },
  { id: 'kr-kimchi-jjigae', name: 'Kimchi Jjigae', localName: '김치찌개', cuisine: 'Korean', category: 'Lunch/Dinner', servingSize: '350g', calories: 350, protein: 25, carbs: 15, fat: 20, fiber: 6, sugar: 4, sodium: 1800, potassium: 500, gi: 'Low' },
  { id: 'kr-bulgogi', name: 'Beef Bulgogi', localName: '불고기', cuisine: 'Korean', category: 'Dinner', servingSize: '200g', calories: 420, protein: 35, carbs: 20, fat: 22, fiber: 2, sugar: 15, sodium: 950, potassium: 450, gi: 'Medium' },

  // --- VIETNAMESE ---
  { id: 'vn-pho-beef', name: 'Beef Pho', localName: 'Phở Bò', cuisine: 'Vietnamese', category: 'Lunch/Dinner', servingSize: '1 bowl (500g)', calories: 450, protein: 30, carbs: 60, fat: 10, fiber: 3, sugar: 4, sodium: 1500, potassium: 400, gi: 'Medium' },
  { id: 'vn-banh-mi', name: 'Banh Mi', localName: 'Bánh Mì', cuisine: 'Vietnamese', category: 'Lunch', servingSize: '1 sandwich', calories: 500, protein: 18, carbs: 65, fat: 20, fiber: 4, sugar: 8, sodium: 1100, potassium: 300, gi: 'High' },

  // --- MEDITERRANEAN / MIDDLE EASTERN ---
  { id: 'me-falafel-wrap', name: 'Falafel Wrap', localName: 'فلافل', cuisine: 'Middle Eastern', category: 'Lunch', servingSize: '300g', calories: 580, protein: 18, carbs: 75, fat: 22, fiber: 12, sugar: 6, sodium: 950, potassium: 600, gi: 'Medium' },
  { id: 'me-gyro', name: 'Lamb Gyro', localName: 'Γύρος', cuisine: 'Greek', category: 'Lunch/Dinner', servingSize: '350g', calories: 750, protein: 35, carbs: 65, fat: 38, fiber: 5, sugar: 6, sodium: 1400, potassium: 550, gi: 'High' },
  { id: 'me-shakshuka', name: 'Shakshuka', localName: 'شكشوكة', cuisine: 'Middle Eastern', category: 'Breakfast', servingSize: '300g', calories: 350, protein: 16, carbs: 20, fat: 24, fiber: 6, sugar: 10, sodium: 800, potassium: 600, gi: 'Low' },

  // --- EUROPEAN ---
  { id: 'eu-paella', name: 'Seafood Paella', localName: 'Paella', cuisine: 'Spanish', category: 'Dinner', servingSize: '400g', calories: 650, protein: 35, carbs: 85, fat: 18, fiber: 5, sugar: 4, sodium: 1200, potassium: 700, gi: 'Medium' },
  { id: 'eu-ratatouille', name: 'Ratatouille', localName: 'Ratatouille', cuisine: 'French', category: 'Lunch', servingSize: '250g', calories: 180, protein: 4, carbs: 22, fat: 10, fiber: 8, sugar: 10, sodium: 450, potassium: 600, gi: 'Low' },
  { id: 'eu-croissant', name: 'Butter Croissant', localName: 'Croissant', cuisine: 'French', category: 'Breakfast', servingSize: '1 pc (60g)', calories: 270, protein: 5, carbs: 28, fat: 16, fiber: 1, sugar: 4, sodium: 300, potassium: 80, gi: 'High' },

  // --- AMERICAN / MODERN ---
  { id: 'us-avocado-toast', name: 'Avocado Toast & Egg', localName: 'Avocado Toast', cuisine: 'Western', category: 'Breakfast', servingSize: '1 serving', calories: 380, protein: 14, carbs: 32, fat: 24, fiber: 10, sugar: 3, sodium: 550, potassium: 650, gi: 'Low' },
  { id: 'us-pancakes', name: 'Buttermilk Pancakes', localName: 'Pancakes', cuisine: 'American', category: 'Breakfast', servingSize: '3 pcs', calories: 450, protein: 10, carbs: 75, fat: 12, fiber: 2, sugar: 15, sodium: 800, potassium: 250, gi: 'High' },
  { id: 'us-burrito', name: 'Chicken Burrito', localName: 'Burrito', cuisine: 'Mexican-American', category: 'Lunch/Dinner', servingSize: '1 large', calories: 850, protein: 45, carbs: 90, fat: 35, fiber: 15, sugar: 6, sodium: 1800, potassium: 800, gi: 'Medium' },

  // --- MORE PROTEIN / VEGAN ---
  { id: 'v-tofu-stir-fry', name: 'Tofu Stir Fry', localName: 'Tofu', cuisine: 'Chinese', category: 'Lunch/Dinner', servingSize: '300g', calories: 320, protein: 22, carbs: 15, fat: 18, fiber: 6, sugar: 4, sodium: 800, potassium: 500, gi: 'Low' },
  { id: 'v-tempeh-buddha-bowl', name: 'Tempeh Buddha Bowl', localName: 'Tempeh', cuisine: 'Western', category: 'Lunch', servingSize: '350g', calories: 450, protein: 28, carbs: 55, fat: 16, fiber: 14, sugar: 4, sodium: 600, potassium: 900, gi: 'Low' },
  { id: 'd-greek-yogurt', name: 'Greek Yogurt (Plain)', localName: 'Greek Yogurt', cuisine: 'Global', category: 'Dairy', servingSize: '170g', calories: 100, protein: 18, carbs: 6, fat: 0.7, fiber: 0, sugar: 6, sodium: 60, potassium: 240, gi: 'Low' },

  // --- MORE SNACKS ---
  { id: 'sn-popcorn', name: 'Air-Popped Popcorn', localName: 'Popcorn', cuisine: 'Global', category: 'Snack', servingSize: '3 cups (24g)', calories: 95, protein: 3, carbs: 19, fat: 1, fiber: 3.5, sugar: 0.2, sodium: 2, potassium: 80, gi: 'Medium' },
  { id: 'sn-granola-bar', name: 'Granola Bar', localName: 'Granola Bar', cuisine: 'Global', category: 'Snack', servingSize: '1 bar (40g)', calories: 180, protein: 4, carbs: 28, fat: 6, fiber: 3, sugar: 10, sodium: 140, potassium: 120, gi: 'Medium' },
  { id: 'sn-cottage-cheese', name: 'Cottage Cheese', localName: 'Cottage Cheese', cuisine: 'Global', category: 'Snack', servingSize: '150g', calories: 120, protein: 16, carbs: 5, fat: 4, fiber: 0, sugar: 4, sodium: 500, potassium: 150, gi: 'Low' }
];
