import React, { useState, useEffect, useMemo } from "react";
import { ShellHeader } from "@/app/shell-header";
import {
  Utensils,
  Clock,
  Flame,
  Search,
  Plus,
  ChefHat,
  Sparkles,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Trash2,
  ChevronRight,
  X,
  Heart,
  Package,
  BookOpen,
  AlertTriangle,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useRouterState } from "@tanstack/react-router";
import {
  KitchenPantryView,
  CookingLogView,
  FoodExpiryView,
  LeftoversManagerView,
  WeeklyMealPlannerView,
} from "./RecipesSubViews";

export type RecipeMainTab =
  | "recipes"
  | "pantry"
  | "cook-log"
  | "expiry"
  | "leftovers"
  | "meal-planner";

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeItem {
  id: string;
  title: string;
  tagline: string;
  category: "Brain Fuel & Fokus" | "Client Hosting" | "Quick Meal (<20 mnt)" | "Healthy Breakfast" | "Elixirs & Beverages";
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  baseServings: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  difficulty: "Mudah" | "Menengah" | "Mahir";
  imageUrl: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  executiveNote: string;
  isFavorite: boolean;
}

const INITIAL_RECIPES: RecipeItem[] = [
  {
    id: "rec-1",
    title: "Salmon Quinoa Bowl with Citrus Ponzu",
    tagline: "Omega-3 tinggi & serat kompleks untuk stamina kognitif sesi maraton",
    category: "Brain Fuel & Fokus",
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    baseServings: 2,
    calories: 580,
    proteinGrams: 42,
    carbsGrams: 46,
    fatGrams: 22,
    difficulty: "Mudah",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    description: "Fillet salmon liar panggang dengan lapisan quinoa hangat, alpukat mentega, edamame segar, dan saus citrus ponzu rendah sodium. Pilihan sempurna untuk makan siang tanpa menimbulkan food coma di siang hari.",
    ingredients: [
      { name: "Fillet Salmon Segar (Grade Sashimi)", amount: 300, unit: "gram" },
      { name: "Quinoa Putih & Merah Matang", amount: 200, unit: "gram" },
      { name: "Alpukat Mentega Matang", amount: 1, unit: "buah" },
      { name: "Edamame Kupas Rebus", amount: 80, unit: "gram" },
      { name: "Citrus Ponzu & Minyak Wijen Murni", amount: 3, unit: "sdm" },
      { name: "Biji Wijen Panggang", amount: 1, unit: "sdt" },
      { name: "Mentimun Jepang Iris Halus", amount: 0.5, unit: "buah" },
    ],
    instructions: [
      "Keringkan fillet salmon dengan paper towel, bumbui dengan sedikit sea salt dan lada hitam tumbuk kasar.",
      "Panaskan pan anti-lengket dengan api sedang-tinggi. Panggang salmon dengan sisi kulit menghadap bawah selama 4 menit hingga renyah, balik dan masak 2 menit lagi.",
      "Hangatkan quinoa yang telah dimasak di mangkuk saji lebar.",
      "Tata salmon panggang, irisan alpukat, edamame, dan irisan mentimun Jepang melingkari mangkuk.",
      "Siramkan saus ponzu citrus dan minyak wijen, taburi biji wijen panggang sebelum disajikan.",
    ],
    executiveNote: "Asam lemak DHA/EPA pada salmon menstimulasi neuroplastisitas dan retensi memori jangka panjang.",
    isFavorite: true,
  },
  {
    id: "rec-2",
    title: "Truffle Wild Mushroom & Arborio Risotto",
    tagline: "Hidangan elegan standar fine-dining untuk menjamu mitra strategis & makan malam",
    category: "Client Hosting",
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    baseServings: 4,
    calories: 640,
    proteinGrams: 18,
    carbsGrams: 78,
    fatGrams: 26,
    difficulty: "Menengah",
    imageUrl: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80",
    description: "Beras arborio Italia dimasak perlahan bersama kaldu jamur hutan, porcini rehidrasi, sentuhan mentega Normandia, keju Parmigiano Reggiano 24 bulan, dan drizzle minyak white truffle.",
    ingredients: [
      { name: "Beras Arborio Italia", amount: 320, unit: "gram" },
      { name: "Jamur Liar Campur (Porcini, Cremini, Chanterelle)", amount: 350, unit: "gram" },
      { name: "Kaldu Sayur / Jamur Panas", amount: 1000, unit: "ml" },
      { name: "Shallot / Bawang Merah Perancis Cincang", amount: 3, unit: "butir" },
      { name: "Mentega Tawar Normandia Dingin", amount: 45, unit: "gram" },
      { name: "Keju Parmigiano-Reggiano Parut Halus", amount: 70, unit: "gram" },
      { name: "White Truffle Oil Berkualitas", amount: 1.5, unit: "sdm" },
    ],
    instructions: [
      "Tumis jamur liar dengan sedikit olive oil hingga kecokelatan dan aromatik, sisihkan separuh untuk topping.",
      "Tumis cincangan shallot hingga transparan. Masukkan beras arborio, sangrai selama 2 menit hingga butiran beras terasa hangat.",
      "Tuangkan kaldu panas satu sendok sayur secara bertahap sambil diaduk konstan dengan gerakan angka delapan.",
      "Setelah 18 menit beras al dente, matikan api. Masukkan mentega dingin dan keju parmesan (proses mantecatura).",
      "Sajikan di piring hangat, beri topping jamur tumis dan tetesan white truffle oil di atasnya.",
    ],
    executiveNote: "Aroma earthy truffle yang kuat menciptakan atmosfer makan malam santai namun berkelas tinggi saat bernegosiasi.",
    isFavorite: true,
  },
  {
    id: "rec-3",
    title: "Ceremonial Uji Matcha & Lion's Mane Elixir",
    tagline: "Ritual pagi bebas gelisah, L-theanine murni pengganti kopi untuk konsentrasi laser",
    category: "Elixirs & Beverages",
    prepTimeMinutes: 5,
    cookTimeMinutes: 2,
    baseServings: 1,
    calories: 95,
    proteinGrams: 3,
    carbsGrams: 8,
    fatGrams: 4,
    difficulty: "Mudah",
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    description: "Matcha grade seremonial dari Kyoto dipadukan dengan ekstrak jamur Lion's Mane murni (fungi nootropik) dan susu oat barista. Memberikan energi stabil 6 jam tanpa lonjakan atau crash kafein.",
    ingredients: [
      { name: "Bubuk Ceremonial Uji Matcha Asli", amount: 2.5, unit: "gram" },
      { name: "Ekstrak Jamur Lion's Mane Organik", amount: 1, unit: "gram" },
      { name: "Air Bersih Panas (80°C, bukan mendidih)", amount: 60, unit: "ml" },
      { name: "Susu Oat Barista Hangat / Frothed", amount: 180, unit: "ml" },
      { name: "Madu Hutan Mentah Murni", amount: 1, unit: "sdt" },
      { name: "Minyak MCT Organik", amount: 0.5, unit: "sdt" },
    ],
    instructions: [
      "Ayak bubuk matcha dan lion's mane ke dalam chawan (mangkuk keramik kecil) agar tidak ada gumpalan.",
      "Tuangkan air 80°C. Gunakan chasen (whisk bambu) dengan gerakan huruf 'W' cepat selama 25 detik hingga terbentuk buih mikro hijau muda.",
      "Panaskan dan kocok susu oat hingga menghasilkan busa halus (microfoam).",
      "Tuangkan matcha pekat ke dalam cangkir saji, perlahan tambahkan susu oat hangat dan madu hutan bila diinginkan.",
    ],
    executiveNote: "Kombinasi L-Theanine dan Lion's Mane terbukti secara klinis merangsang sintesis NGF (Nerve Growth Factor) di otak.",
    isFavorite: false,
  },
  {
    id: "rec-4",
    title: "Mediterranean Grilled Herb Chicken Breast",
    tagline: "Dada ayam marinasi rempah Mediterania dengan salad tomat pusaka & feta",
    category: "Quick Meal (<20 mnt)",
    prepTimeMinutes: 8,
    cookTimeMinutes: 12,
    baseServings: 2,
    calories: 490,
    proteinGrams: 52,
    carbsGrams: 14,
    fatGrams: 18,
    difficulty: "Mudah",
    imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
    description: "Dada ayam probiotik tanpa lemak yang dimarinasi lemon zesty, rosemary segar, oregano liar, dan minyak zaitun extra virgin. Dipadukan dengan salad mentimun renyah dan crumble keju feta.",
    ingredients: [
      { name: "Dada Ayam Probiotik Fillet", amount: 400, unit: "gram" },
      { name: "Extra Virgin Olive Oil (Cold Pressed)", amount: 2, unit: "sdm" },
      { name: "Perasan Lemon Segar & Zest", amount: 1.5, unit: "sdm" },
      { name: "Rosemary & Oregano Segar Cincang", amount: 1, unit: "sdm" },
      { name: "Bawang Putih Parut Halus", amount: 2, unit: "siung" },
      { name: "Tomat Ceri Dua Warna Belah Dua", amount: 150, unit: "gram" },
      { name: "Keju Feta Yunani Crumble", amount: 40, unit: "gram" },
    ],
    instructions: [
      "Pipihkan dada ayam hingga ketebalan merata. Marinasi dengan minyak zaitun, lemon, bawang putih, rosemary, dan garam selama 10 menit.",
      "Panaskan grill pan besi cor (cast iron). Panggang dada ayam selama 5-6 menit setiap sisi hingga matang sempurna (suhu internal 74°C).",
      "Istirahatkan (rest) daging ayam selama 3 menit sebelum diiris agar sarinya tidak keluar.",
      "Campurkan tomat ceri, mentimun, keju feta, dan sisa perasan lemon di piring.",
      "Tata irisan dada ayam di atas salad dan sajikan hangat.",
    ],
    executiveNote: "Protein murni 52g per porsi mempertahankan massa otot dan metabolisme aktif di sela-sela jam kerja meja.",
    isFavorite: false,
  },
  {
    id: "rec-5",
    title: "Wagyu Beef Tataki with Ginger Ponzu Reduction",
    tagline: "Irisan tenderloin wagyu sear cepat dengan jahe muda segar & garlic chips",
    category: "Client Hosting",
    prepTimeMinutes: 12,
    cookTimeMinutes: 8,
    baseServings: 3,
    calories: 610,
    proteinGrams: 38,
    carbsGrams: 12,
    fatGrams: 42,
    difficulty: "Menengah",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    description: "Potongan daging sapi Wagyu MB7+ yang di-sear singkat di atas wajan membara untuk mengunci marbling, kemudian diiris tipis dingin dan disajikan dengan saus ponzu jahe dan keripik bawang putih emas.",
    ingredients: [
      { name: "Daging Sapi Wagyu Strip / Tenderloin MB7+", amount: 350, unit: "gram" },
      { name: "Kecap Asin Shoyu Jepang Rendah Garam", amount: 4, unit: "sdm" },
      { name: "Air Perasan Yuzu / Jeruk Nipis", amount: 2, unit: "sdm" },
      { name: "Jahe Muda Parut Segar", amount: 1, unit: "sdm" },
      { name: "Bawang Putih Iris Sangat Tipis (Garlic Chips)", amount: 4, unit: "siung" },
      { name: "Daun Bawang Iris Sangat Halus", amount: 2, unit: "batang" },
    ],
    instructions: [
      "Goreng irisan bawang putih dalam sedikit minyak hingga kuning keemasan renyah, tiriskan.",
      "Bumbui balok daging wagyu dengan garam laut Maldon kasar.",
      "Panaskan wajan baja hingga berasap tipis. Sear seluruh sisi daging masing-masing 45 detik saja. Segera celupkan ke mangkuk air es untuk menghentikan pematangan.",
      "Keringkan daging, bungkus plastik wrap, dan masukkan ke chiller selama 15 menit agar mudah diiris tipis.",
      "Iris tipis 2mm, tata rapi melingkar di piring saji, siram saus yuzu shoyu jahe, taburi daun bawang dan keripik bawang putih.",
    ],
    executiveNote: "Kualitas tekstur dan rasa wagyu tataki setara dengan ruang makan pribadi omakase di Roppongi.",
    isFavorite: true,
  },
  {
    id: "rec-6",
    title: "Overnight Rolled Oats with Chia, Berries & Cacao Nibs",
    tagline: "Sarapan otomatis no-cooking, disiapkan malam sebelumnya untuk pagi yang padat",
    category: "Healthy Breakfast",
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    baseServings: 1,
    calories: 380,
    proteinGrams: 16,
    carbsGrams: 54,
    fatGrams: 12,
    difficulty: "Mudah",
    imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80",
    description: "Rolled oats utuh direndam semalaman bersama biji chia, susu almond tanpa pemanis, dan kayu manis Ceylon. Pagi hari siap disantap dengan topping blueberry liar, kacang almond panggang, dan cacao nibs antioksidan.",
    ingredients: [
      { name: "Rolled Oats Organik Utuh", amount: 60, unit: "gram" },
      { name: "Biji Chia Hitam Organik", amount: 15, unit: "gram" },
      { name: "Susu Almond Unsweetened", amount: 180, unit: "ml" },
      { name: "Blueberry Segar / Beku", amount: 40, unit: "gram" },
      { name: "Kacang Almond Panggang Cincang", amount: 15, unit: "gram" },
      { name: "Raw Cacao Nibs Organik", amount: 1, unit: "sdt" },
      { name: "Bubuk Kayu Manis Ceylon Asli", amount: 0.5, unit: "sdt" },
    ],
    instructions: [
      "Di dalam toples kaca kedap udara, campurkan rolled oats, biji chia, bubuk kayu manis, dan susu almond.",
      "Aduk rata hingga seluruh biji chia terendam, tutup toples rapat, dan simpan di kulkas minimal 4 jam atau semalaman.",
      "Keluarkan saat pagi hari. Tambahkan blueberry segar, irisan almond panggang, dan cacao nibs renyah di atasnya.",
      "Langsung nikmati dingin atau hangatkan di microwave 45 detik bila menyukai sarapan hangat.",
    ],
    executiveNote: "Beta-glukan pada gandum menjaga kadar gula darah tetap stabil, mencegah rasa lapar hingga jam makan siang.",
    isFavorite: false,
  },
];

const LOCAL_STORAGE_KEY = "aio_recipes_data_v1";

export function RecipesView() {
  const [recipes, setRecipes] = useState<RecipeItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_RECIPES;
  });

  const routerState = useRouterState();
  const searchStr = routerState.location.searchStr;

  const [activeMainTab, setActiveMainTab] = useState<RecipeMainTab>(() => {
    const param = new URLSearchParams(searchStr || "").get("tab");
    if (param && ["recipes", "pantry", "cook-log", "expiry", "leftovers", "meal-planner"].includes(param)) {
      return param as RecipeMainTab;
    }
    return "recipes";
  });

  useEffect(() => {
    const param = new URLSearchParams(searchStr || "").get("tab");
    if (
      param &&
      ["recipes", "pantry", "cook-log", "expiry", "leftovers", "meal-planner"].includes(param) &&
      param !== activeMainTab
    ) {
      setActiveMainTab(param as RecipeMainTab);
    }
  }, [searchStr]);

  const handleMainTabChange = (t: RecipeMainTab) => {
    setActiveMainTab(t);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", t);
      window.history.replaceState(window.history.state, "", url.toString());
    } catch {}
  };

  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);
  const [servingsMultiplier, setServingsMultiplier] = useState<number>(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isCopied, setIsCopied] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding new recipe
  const [newTitle, setNewTitle] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newCategory, setNewCategory] = useState<RecipeItem["category"]>("Brain Fuel & Fokus");
  const [newPrepTime, setNewPrepTime] = useState("15");
  const [newCookTime, setNewCookTime] = useState("20");
  const [newCalories, setNewCalories] = useState("450");
  const [newProtein, setNewProtein] = useState("30");
  const [newDifficulty, setNewDifficulty] = useState<RecipeItem["difficulty"]>("Mudah");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIngredientsText, setNewIngredientsText] = useState("Salmon 200 gram\nQuinoa 150 gram\nMinyak Zaitun 2 sdm");
  const [newInstructionsText, setNewInstructionsText] = useState("Panaskan wajan dengan api sedang.\nMasak bahan utama hingga matang merata.\nSajikan selagi hangat.");
  const [newExecutiveNote, setNewExecutiveNote] = useState("Nutrisi optimal untuk menunjang performa eksekutif.");

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes));
    } catch {
      // ignore
    }
  }, [recipes]);

  // When selected recipe changes, reset multipliers and check states
  useEffect(() => {
    if (selectedRecipe) {
      setServingsMultiplier(1);
      setCheckedIngredients({});
      setCompletedSteps({});
    }
  }, [selectedRecipe]);

  const categories = [
    "Semua",
    "Brain Fuel & Fokus",
    "Client Hosting",
    "Quick Meal (<20 mnt)",
    "Healthy Breakfast",
    "Elixirs & Beverages",
  ];

  const filteredRecipes = useMemo(() => {
    return recipes.filter((rec) => {
      const matchCat = activeCategory === "Semua" || rec.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        rec.title.toLowerCase().includes(q) ||
        rec.tagline.toLowerCase().includes(q) ||
        rec.description.toLowerCase().includes(q) ||
        rec.ingredients.some((ing) => ing.name.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [recipes, activeCategory, searchQuery]);

  const totalFavorites = recipes.filter((r) => r.isFavorite).length;
  const quickMealsCount = recipes.filter((r) => r.cookTimeMinutes + r.prepTimeMinutes <= 25).length;
  const avgCalories = Math.round(
    recipes.reduce((acc, curr) => acc + curr.calories, 0) / (recipes.length || 1)
  );

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecipes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (selectedRecipe && selectedRecipe.id === id) {
      setSelectedRecipe((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const deleteRecipe = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm("Hapus resep ini dari koleksi kuliner Anda?")) {
      setRecipes((prev) => prev.filter((item) => item.id !== id));
      if (selectedRecipe?.id === id) {
        setSelectedRecipe(null);
      }
    }
  };

  const copyIngredientsToClipboard = () => {
    if (!selectedRecipe) return;
    const currentServings = selectedRecipe.baseServings * servingsMultiplier;
    const listText = [
      `🛒 DAFTAR BELANJA RESEP: ${selectedRecipe.title} (${currentServings} Porsi)`,
      `Kategori: ${selectedRecipe.category}`,
      `Total Kalori per porsi: ~${selectedRecipe.calories} kkal`,
      "",
      "BAHAN-BAHAN:",
      ...selectedRecipe.ingredients.map((ing) => {
        const scaledAmount = Math.round(ing.amount * servingsMultiplier * 10) / 10;
        return `• ${ing.name}: ${scaledAmount} ${ing.unit}`;
      }),
      "",
      `Catatan Khusus: ${selectedRecipe.executiveNote}`,
      "— All in One Culinary OS",
    ].join("\n");

    navigator.clipboard.writeText(listText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handleAddRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // parse ingredients text
    const parsedIngredients: Ingredient[] = newIngredientsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        // simple parsing
        const parts = line.split(" ");
        if (parts.length >= 3 && !isNaN(Number(parts[parts.length - 2]))) {
          const unit = parts[parts.length - 1];
          const amount = Number(parts[parts.length - 2]);
          const name = parts.slice(0, parts.length - 2).join(" ");
          return { name, amount, unit };
        }
        return { name: line, amount: 1, unit: "porsi" };
      });

    const parsedInstructions = newInstructionsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const newRecipe: RecipeItem = {
      id: `rec-${Date.now()}`,
      title: newTitle.trim(),
      tagline: newTagline.trim() || "Resep istimewa untuk produktivitas prima",
      category: newCategory,
      prepTimeMinutes: parseInt(newPrepTime, 10) || 10,
      cookTimeMinutes: parseInt(newCookTime, 10) || 15,
      baseServings: 2,
      calories: parseInt(newCalories, 10) || 450,
      proteinGrams: parseInt(newProtein, 10) || 28,
      carbsGrams: 40,
      fatGrams: 18,
      difficulty: newDifficulty,
      imageUrl:
        newImageUrl.trim() ||
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
      description: newDescription.trim() || "Resep bernutrisi tinggi untuk konsultan dan eksekutif modern.",
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : [{ name: "Bahan segar pilihan", amount: 1, unit: "paket" }],
      instructions: parsedInstructions.length > 0 ? parsedInstructions : ["Siapkan bahan.", "Masak sesuai selera.", "Sajikan."],
      executiveNote: newExecutiveNote.trim() || "Nutrisi seimbang untuk performa kognitif maksimal.",
      isFavorite: false,
    };

    setRecipes((prev) => [newRecipe, ...prev]);
    setIsAddModalOpen(false);
    // reset form
    setNewTitle("");
    setNewTagline("");
    setNewImageUrl("");
    setNewDescription("");
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Action Toolbar & Sub-Feature Tabs Portaled to Main Header */}
      <ShellHeader>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Segmented Icon Buttons for Sub-views */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            {[
              { id: "recipes", label: `Koleksi Resep (${recipes.length})`, icon: ChefHat },
              { id: "pantry", label: "Pantry Inventory", icon: Package },
              { id: "cook-log", label: "Cook Log", icon: BookOpen },
              { id: "expiry", label: "Expiry Alert", icon: AlertTriangle },
              { id: "leftovers", label: "Leftover Manager", icon: RefreshCw },
              { id: "meal-planner", label: "Meal Planner", icon: CalendarDays },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleMainTabChange(tab.id as RecipeMainTab)}
                  title={tab.label}
                  aria-label={tab.label}
                  className={cn(
                    "p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0",
                    isActive
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            title="Tambah Resep Baru"
            aria-label="Tambah Resep Baru"
            className="p-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-xs flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {activeMainTab === "pantry" && <KitchenPantryView />}
      {activeMainTab === "cook-log" && <CookingLogView />}
      {activeMainTab === "expiry" && <FoodExpiryView />}
      {activeMainTab === "leftovers" && <LeftoversManagerView />}
      {activeMainTab === "meal-planner" && <WeeklyMealPlannerView />}

      {activeMainTab === "recipes" && (
        <>
          {/* Top Banner Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Koleksi
            </span>
            <ChefHat size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{recipes.length}</p>
          <span className="text-xs text-muted-foreground">Resep Terkurasi</span>
        </div>
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Meal (&lt;25m)
            </span>
            <Clock size={18} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{quickMealsCount}</p>
          <span className="text-xs text-muted-foreground">Efisien Jam Kerja</span>
        </div>
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Rata-rata Energi
            </span>
            <Flame size={18} className="text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{avgCalories} kkal</p>
          <span className="text-xs text-muted-foreground">Kalori Terukur</span>
        </div>
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Favorit Pilihan
            </span>
            <Heart size={18} className="text-red-500 fill-red-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalFavorites}</p>
          <span className="text-xs text-muted-foreground">Bookmark Khusus</span>
        </div>
      </div>

      {/* Control Bar: Search, Category Tabs, Add Button */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari resep, bahan, atau nutrisi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Categories scrollable */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150",
                activeCategory === cat
                  ? "bg-amber-600 text-white shadow-sm shadow-amber-600/20"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-amber-600/25 shrink-0"
        >
          <Plus size={16} />
          <span>Tambah Resep</span>
        </button>
      </div>

      {/* Grid of Recipe Cards */}
      {filteredRecipes.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl p-12 text-center bg-card/40 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 text-amber-600">
            <Utensils size={28} />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Tidak ada resep ditemukan</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Coba sesuaikan kata kunci pencarian atau ganti filter kategori di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="group bg-card border border-border/80 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
            >
              {/* Image Banner with Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-border/15">
                    {recipe.category}
                  </span>
                  <button
                    onClick={(e) => toggleFavorite(recipe.id, e)}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-border/15 flex items-center justify-center text-white hover:text-red-400 transition-colors"
                    title={recipe.isFavorite ? "Hapus dari favorit" : "Simpan ke favorit"}
                  >
                    <Heart
                      size={16}
                      className={cn(recipe.isFavorite ? "fill-red-500 text-red-500" : "text-white")}
                    />
                  </button>
                </div>

                {/* Bottom stats overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-amber-300" />
                      {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mnt
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame size={13} className="text-rose-400" />
                      {recipe.calories} kkal
                    </span>
                  </div>
                  <span className="bg-amber-500/80 px-2 py-0.5 rounded text-[11px] font-medium text-white">
                    {recipe.difficulty}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-amber-600 transition-colors line-clamp-1">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {recipe.tagline}
                  </p>
                </div>

                {/* Macro pill summary */}
                <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-muted/40 rounded-lg py-1.5 px-2">
                    <span className="text-[10px] text-muted-foreground block">Protein</span>
                    <span className="font-semibold text-foreground">{recipe.proteinGrams}g</span>
                  </div>
                  <div className="bg-muted/40 rounded-lg py-1.5 px-2">
                    <span className="text-[10px] text-muted-foreground block">Karbo</span>
                    <span className="font-semibold text-foreground">{recipe.carbsGrams}g</span>
                  </div>
                  <div className="bg-muted/40 rounded-lg py-1.5 px-2">
                    <span className="text-[10px] text-muted-foreground block">Lemak</span>
                    <span className="font-semibold text-foreground">{recipe.fatGrams}g</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-amber-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Lihat Resep &amp; Takaran</span>
                  <ChevronRight size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal / Drawer */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
            {/* Modal Header with Hero Image */}
            <div className="relative h-64 w-full shrink-0 bg-muted">
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-transparent" />

              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 flex items-center justify-center transition-colors border border-border/20"
              >
                <X size={18} />
              </button>

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-600 text-white shadow-sm">
                  {selectedRecipe.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-border/20">
                  {selectedRecipe.difficulty}
                </span>
              </div>

              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                  {selectedRecipe.title}
                </h2>
                <p className="text-sm text-white/90 mt-1 max-w-2xl drop-shadow">
                  {selectedRecipe.tagline}
                </p>
              </div>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
              {/* Executive Note Box */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-sm text-foreground">
                <Sparkles size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400 text-xs uppercase tracking-wider mb-1">
                    Executive Focus Note
                  </h4>
                  <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                    {selectedRecipe.executiveNote}
                  </p>
                </div>
              </div>

              {/* Time, Servings Scaler & Nutrition Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-muted/40 p-3 rounded-xl border border-border/50 text-center">
                  <span className="text-[11px] text-muted-foreground block">Prep + Masak</span>
                  <span className="font-bold text-foreground text-sm flex items-center justify-center gap-1 mt-0.5">
                    <Clock size={14} className="text-amber-600" />
                    {selectedRecipe.prepTimeMinutes + selectedRecipe.cookTimeMinutes} mnt
                  </span>
                </div>

                <div className="bg-muted/40 p-3 rounded-xl border border-border/50 text-center">
                  <span className="text-[11px] text-muted-foreground block">Energi per Porsi</span>
                  <span className="font-bold text-foreground text-sm flex items-center justify-center gap-1 mt-0.5">
                    <Flame size={14} className="text-rose-500" />
                    {selectedRecipe.calories} kkal
                  </span>
                </div>

                {/* Servings Multiplier interactive */}
                <div className="col-span-2 bg-muted/40 p-3 rounded-xl border border-border/50 flex items-center justify-between px-4">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Kalkulator Porsi</span>
                    <span className="font-bold text-foreground text-sm">
                      {selectedRecipe.baseServings * servingsMultiplier} Porsi Saji
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
                    {[1, 2, 3, 4].map((mult) => (
                      <button
                        key={mult}
                        onClick={() => setServingsMultiplier(mult)}
                        className={cn(
                          "px-2.5 py-1 rounded text-xs font-semibold transition-colors",
                          servingsMultiplier === mult
                            ? "bg-amber-600 text-white"
                            : "hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {mult}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedRecipe.description}
              </p>

              {/* Ingredients with scaling & checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Utensils size={18} className="text-amber-600" />
                    <span>Daftar Bahan ({selectedRecipe.ingredients.length})</span>
                  </h3>
                  <button
                    onClick={copyIngredientsToClipboard}
                    className="flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Tersalin ke Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Kirim ke Shopping List</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedRecipe.ingredients.map((ing, idx) => {
                    const scaledAmount = Math.round(ing.amount * servingsMultiplier * 10) / 10;
                    const isChecked = checkedIngredients[`${selectedRecipe.id}-${idx}`];
                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          setCheckedIngredients((prev) => ({
                            ...prev,
                            [`${selectedRecipe.id}-${idx}`]: !isChecked,
                          }))
                        }
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                          isChecked
                            ? "bg-muted/20 border-border/40 text-muted-foreground line-through opacity-70"
                            : "bg-card border-border/70 hover:border-amber-500/40 text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          {isChecked ? (
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                          ) : (
                            <Circle size={16} className="text-muted-foreground shrink-0" />
                          )}
                          <span className="text-xs md:text-sm truncate">{ing.name}</span>
                        </div>
                        <span className="text-xs font-bold shrink-0 text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          {scaledAmount} {ing.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions steps */}
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <ChefHat size={18} className="text-amber-600" />
                  <span>Tahapan Memasak ({selectedRecipe.instructions.length} Langkah)</span>
                </h3>

                <div className="space-y-2.5">
                  {selectedRecipe.instructions.map((step, idx) => {
                    const isStepDone = completedSteps[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          setCompletedSteps((prev) => ({
                            ...prev,
                            [idx]: !isStepDone,
                          }))
                        }
                        className={cn(
                          "p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer",
                          isStepDone
                            ? "bg-emerald-500/5 border-emerald-500/30 text-muted-foreground"
                            : "bg-card border-border/80 hover:border-amber-500/40 text-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
                            isStepDone
                              ? "bg-emerald-500 text-white"
                              : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                          )}
                        >
                          {isStepDone ? <Check size={13} /> : idx + 1}
                        </div>
                        <p
                          className={cn(
                            "text-xs md:text-sm leading-relaxed",
                            isStepDone ? "line-through opacity-75" : ""
                          )}
                        >
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-card flex items-center justify-between">
              <button
                onClick={(e) => deleteRecipe(selectedRecipe.id, e)}
                className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 size={15} />
                <span>Hapus Resep</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(selectedRecipe.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors border",
                    selectedRecipe.isFavorite
                      ? "bg-red-50 dark:bg-red-950/40 text-red-600 border-red-200 dark:border-red-900"
                      : "bg-card text-muted-foreground border-border hover:text-foreground"
                  )}
                >
                  <Heart
                    size={15}
                    className={selectedRecipe.isFavorite ? "fill-red-500 text-red-500" : ""}
                  />
                  <span>{selectedRecipe.isFavorite ? "Tersimpan di Favorit" : "Simpan Favorit"}</span>
                </button>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipe Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <ChefHat size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">Tambah Resep Baru</h3>
                  <p className="text-xs text-muted-foreground">Catat resep nutrisi &amp; kuliner pilihan Anda</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRecipe} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Nama Hidangan / Minuman *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Barramundi Panggang Lemon Thyme"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Tagline Ringkas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Tinggi protein dan rendah karbohidrat"
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Kategori Resep
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as RecipeItem["category"])}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="Brain Fuel & Fokus">Brain Fuel &amp; Fokus</option>
                    <option value="Client Hosting">Client Hosting</option>
                    <option value="Quick Meal (<20 mnt)">Quick Meal (&lt;20 mnt)</option>
                    <option value="Healthy Breakfast">Healthy Breakfast</option>
                    <option value="Elixirs & Beverages">Elixirs &amp; Beverages</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Prep (Menit)</label>
                  <input
                    type="number"
                    value={newPrepTime}
                    onChange={(e) => setNewPrepTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Cook (Menit)</label>
                  <input
                    type="number"
                    value={newCookTime}
                    onChange={(e) => setNewCookTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Kalori (kkal)</label>
                  <input
                    type="number"
                    value={newCalories}
                    onChange={(e) => setNewCalories(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  URL Foto Hidangan (Unsplash atau Web)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Daftar Bahan (1 per baris, contoh: Dada Ayam 300 gram)
                </label>
                <textarea
                  rows={4}
                  value={newIngredientsText}
                  onChange={(e) => setNewIngredientsText(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Tahapan Memasak (1 per baris)
                </label>
                <textarea
                  rows={4}
                  value={newInstructionsText}
                  onChange={(e) => setNewInstructionsText(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Executive Note / Manfaat Nutrisi
                </label>
                <input
                  type="text"
                  placeholder="Catatan kebugaran atau pairing minuman..."
                  value={newExecutiveNote}
                  onChange={(e) => setNewExecutiveNote(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  Simpan Resep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
