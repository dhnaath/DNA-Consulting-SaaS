import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  RecipeItem,
  RecipeCategory,
  RecipeDifficulty,
  RecipeIngredient,
} from '../../types';
import {
  Utensils,
  Plus,
  Search,
  Clock,
  Flame,
  Users,
  Heart,
  Star,
  ChefHat,
  LayoutGrid,
  Table as TableIcon,
  Edit3,
  Trash2,
  X,
  CheckSquare,
  BookOpen,
} from 'lucide-react';

const CATEGORIES: RecipeCategory[] = [
  'Sarapan (Breakfast)',
  'Hidangan Utama (Main Course)',
  'Sup & Sayur',
  'Camilan & Dessert',
  'Minuman & Smoothie',
  'Meal Prep & Diet',
];

const DIFFICULTIES: RecipeDifficulty[] = ['Mudah', 'Sedang', 'Chef Level'];

export const RecipeBookView: React.FC = () => {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, toggleFavoriteRecipe } = useLifeOS();

  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<RecipeDifficulty | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');

  // Active Recipe Reader / Cooking Mode Modal
  const [activeRecipe, setActiveRecipe] = useState<RecipeItem | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Add/Edit Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('Hidangan Utama (Main Course)');
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>('Mudah');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(10);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(15);
  const [servings, setServings] = useState(2);
  const [caloriesPerServing, setCaloriesPerServing] = useState(400);
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [dietaryTagsInput, setDietaryTagsInput] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'all' && r.difficulty !== selectedDifficulty) return false;
      if (showFavoritesOnly && !r.isFavorite) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = r.title.toLowerCase().includes(q);
        const inIng = r.ingredients.some((i) => i.name.toLowerCase().includes(q));
        const inTags = r.dietaryTags.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inIng && !inTags) return false;
      }
      return true;
    });
  }, [recipes, selectedCategory, selectedDifficulty, showFavoritesOnly, searchQuery]);

  // KPI Metrics
  const quickRecipesCount = useMemo(
    () => recipes.filter((r) => r.prepTimeMinutes + r.cookTimeMinutes <= 25).length,
    [recipes]
  );
  const favoriteCount = useMemo(
    () => recipes.filter((r) => r.isFavorite).length,
    [recipes]
  );
  const avgCalories = useMemo(() => {
    const withCal = recipes.filter((r) => r.caloriesPerServing);
    if (withCal.length === 0) return 0;
    return Math.round(
      withCal.reduce((acc, r) => acc + (r.caloriesPerServing || 0), 0) / withCal.length
    );
  }, [recipes]);

  const handleOpenCookingMode = (recipe: RecipeItem) => {
    setActiveRecipe(recipe);
    setCompletedSteps({});
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Hidangan Utama (Main Course)');
    setDifficulty('Mudah');
    setPrepTimeMinutes(10);
    setCookTimeMinutes(15);
    setServings(2);
    setCaloriesPerServing(380);
    setIngredientsText('Dada Ayam Fillet | 250 gram\nBawang Putih Cincang | 2 siung\nMinyak Zaitun | 1 sdm');
    setStepsText('Siapkan seluruh bahan segar dan cuci bersih.\nTumis bumbu hingga harum keemasan.\nMasak bahan utama hingga matang merata dan sajikan hangat.');
    setDietaryTagsInput('High Protein, Halal, Homemade');
    setPhotoUrl('');
    setNotes('');
    setIsFavorite(false);
    setIsEditorOpen(true);
  };

  const handleEdit = (recipe: RecipeItem) => {
    setEditingId(recipe.id);
    setTitle(recipe.title);
    setCategory(recipe.category);
    setDifficulty(recipe.difficulty);
    setPrepTimeMinutes(recipe.prepTimeMinutes);
    setCookTimeMinutes(recipe.cookTimeMinutes);
    setServings(recipe.servings);
    setCaloriesPerServing(recipe.caloriesPerServing || 350);
    setIngredientsText(
      recipe.ingredients.map((i) => `${i.name} | ${i.amount}`).join('\n')
    );
    setStepsText(recipe.steps.join('\n'));
    setDietaryTagsInput(recipe.dietaryTags.join(', '));
    setPhotoUrl(recipe.photoUrl || '');
    setNotes(recipe.notes || '');
    setIsFavorite(recipe.isFavorite);
    setIsEditorOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedIngredients: RecipeIngredient[] = ingredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|');
        return {
          name: parts[0]?.trim() || line,
          amount: parts[1]?.trim() || 'Secukupnya',
        };
      });

    const parsedSteps = stepsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedTags = dietaryTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Omit<RecipeItem, 'id'> = {
      title: title.trim(),
      category,
      difficulty,
      prepTimeMinutes: Number(prepTimeMinutes) || 5,
      cookTimeMinutes: Number(cookTimeMinutes) || 0,
      servings: Number(servings) || 1,
      caloriesPerServing: Number(caloriesPerServing) || undefined,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      dietaryTags: parsedTags,
      photoUrl: photoUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      isFavorite,
      rating: 5,
    };

    if (editingId) {
      updateRecipe(editingId, payload);
    } else {
      addRecipe(payload);
    }
    setIsEditorOpen(false);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E9E9E7] rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-orange-50/70 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-3xl shadow-xs shrink-0">
              🍳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#2F3437] tracking-tight">
                  Recipe Book
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-100/70 text-orange-800">
                  by LifeCanvas
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
                Buku resep masakan pribadi dengan takaran bahan terstruktur, panduan langkah demi
                langkah interaktif, waktu persiapan, dan informasi kalori nutrisi.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2F3437] hover:bg-black rounded-lg shadow-sm transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Resep Baru</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#F1F1EF]">
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Total Koleksi Resep</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-[#2F3437]">{recipes.length}</span>
              <span className="text-[11px] text-neutral-400">menu masakan</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Menu Praktis (≤25m)</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-emerald-700">{quickRecipesCount}</span>
              <span className="text-[11px] text-neutral-400">cepat saji sehat</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Rata-rata Kalori</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-orange-700">{avgCalories}</span>
              <span className="text-[11px] text-neutral-400">kkal / porsi</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Resep Andalan</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-rose-700">❤️ {favoriteCount}</span>
              <span className="text-[11px] text-neutral-400">favorit keluarga</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-[#E9E9E7] rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#2F3437] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            Semua Kategori ({recipes.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = recipes.filter((r) => r.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#2F3437] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-neutral-700 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#F1F1EF]">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama resep, bahan (salmon, oats, ayam)..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg text-neutral-800 focus:outline-none"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as RecipeDifficulty | 'all')}
              className="text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-700"
            >
              <option value="all">Semua Tingkat Kesulitan</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                showFavoritesOnly
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-white border-[#E9E9E7] text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  showFavoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
                }`}
              />
              <span>Favorit</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-[#E9E9E7] self-end sm:self-auto">
            <button
              onClick={() => setViewMode('gallery')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'gallery'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kartu Resep</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery View */}
      {viewMode === 'gallery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((rec) => {
            const totalMinutes = rec.prepTimeMinutes + rec.cookTimeMinutes;
            return (
              <div
                key={rec.id}
                className="bg-white border border-[#E9E9E7] hover:border-neutral-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="h-44 bg-neutral-100 relative overflow-hidden">
                    {rec.photoUrl ? (
                      <img
                        src={rec.photoUrl}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange-50 text-4xl">
                        🍲
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/90 text-neutral-800 backdrop-blur-xs">
                        {rec.category}
                      </span>
                      <button
                        onClick={() => toggleFavoriteRecipe(rec.id)}
                        className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            rec.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3
                        onClick={() => handleOpenCookingMode(rec)}
                        className="text-base font-bold leading-snug cursor-pointer hover:underline line-clamp-1"
                      >
                        {rec.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Meta Bar */}
                    <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-[#FAF9F6] border border-[#F1F1EF] rounded-xl text-center text-[11px]">
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Total Waktu</span>
                        <span className="font-bold text-neutral-800">⏱️ {totalMinutes} mnt</span>
                      </div>
                      <div className="border-x border-[#E9E9E7]">
                        <span className="text-neutral-400 block text-[10px]">Porsi Saji</span>
                        <span className="font-bold text-neutral-800">🍽️ {rec.servings} porsi</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Energi</span>
                        <span className="font-bold text-orange-700">
                          🔥 {rec.caloriesPerServing || '—'} kkal
                        </span>
                      </div>
                    </div>

                    {/* Ingredients Preview */}
                    <div>
                      <span className="text-[11px] font-semibold text-neutral-500 block mb-1">
                        Bahan Utama ({rec.ingredients.length} bahan):
                      </span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {rec.ingredients.slice(0, 4).map((ing, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-orange-50/70 text-orange-900 border border-orange-200/60 px-2 py-0.5 rounded-md"
                          >
                            {ing.name}
                          </span>
                        ))}
                        {rec.ingredients.length > 4 && (
                          <span className="text-[10px] text-neutral-400">
                            +{rec.ingredients.length - 4} lagi
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dietary Tags */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {rec.dietaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-[#F1F1EF] flex items-center justify-between bg-[#FAF9F6]/60">
                  <button
                    onClick={() => handleOpenCookingMode(rec)}
                    className="text-xs font-semibold text-[#2F3437] hover:text-orange-700 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-orange-600" />
                    <span>Buka Cara Memasak ({rec.steps.length} Langkah)</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(rec)}
                      className="p-1 text-neutral-400 hover:text-neutral-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteRecipe(rec.id)}
                      className="p-1 text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-[#E9E9E7] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-[#FAF9F6] text-neutral-500 border-b border-[#E9E9E7] font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Resep</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Kesulitan</th>
                  <th className="py-3 px-4">Waktu Masak</th>
                  <th className="py-3 px-4">Porsi</th>
                  <th className="py-3 px-4">Kalori</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F1EF]">
                {filteredRecipes.map((rec) => (
                  <tr key={rec.id} className="hover:bg-neutral-50/70">
                    <td className="py-3 px-4 font-semibold text-[#2F3437]">
                      <button
                        onClick={() => handleOpenCookingMode(rec)}
                        className="hover:text-orange-600 text-left"
                      >
                        {rec.title}
                      </button>
                    </td>
                    <td className="py-3 px-4">{rec.category}</td>
                    <td className="py-3 px-4">{rec.difficulty}</td>
                    <td className="py-3 px-4">
                      {rec.prepTimeMinutes + rec.cookTimeMinutes} menit
                    </td>
                    <td className="py-3 px-4">{rec.servings} porsi</td>
                    <td className="py-3 px-4 font-medium text-orange-700">
                      {rec.caloriesPerServing ? `${rec.caloriesPerServing} kkal` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(rec)}
                          className="p-1 text-neutral-400 hover:text-neutral-800"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteRecipe(rec.id)}
                          className="p-1 text-neutral-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Cooking Mode Modal */}
      {activeRecipe && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="p-4 sm:px-6 border-b border-[#E9E9E7] flex items-center justify-between bg-[#FAF9F6]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                  {activeRecipe.category} • {activeRecipe.difficulty}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#2F3437] mt-1">
                  {activeRecipe.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveRecipe(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-3 gap-3 bg-[#FAF9F6] p-3.5 rounded-xl border border-[#EBEAE5] text-center text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Persiapan & Masak</span>
                  <span className="font-bold text-neutral-800">
                    {activeRecipe.prepTimeMinutes}m prep + {activeRecipe.cookTimeMinutes}m cook
                  </span>
                </div>
                <div className="border-x border-[#E9E9E7]">
                  <span className="text-neutral-400 block text-[11px]">Porsi</span>
                  <span className="font-bold text-neutral-800">{activeRecipe.servings} Porsi</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Kalori / Porsi</span>
                  <span className="font-bold text-orange-700">
                    {activeRecipe.caloriesPerServing || '—'} kkal
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Ingredients Column */}
                <div className="md:col-span-5 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Daftar Bahan & Takaran
                  </h4>
                  <div className="bg-orange-50/40 border border-orange-200/70 rounded-xl p-3.5 space-y-2">
                    {activeRecipe.ingredients.map((ing, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs border-b border-orange-100 last:border-none pb-1.5 last:pb-0"
                      >
                        <span className="font-medium text-neutral-800">{ing.name}</span>
                        <span className="text-orange-900 font-semibold">{ing.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Steps Column */}
                <div className="md:col-span-7 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Langkah Memasak (Klik untuk Centang)
                  </h4>
                  <div className="space-y-2">
                    {activeRecipe.steps.map((step, idx) => {
                      const isDone = !!completedSteps[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() =>
                            setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))
                          }
                          className={`p-3 rounded-xl border text-xs leading-relaxed cursor-pointer flex items-start gap-3 transition-all ${
                            isDone
                              ? 'bg-emerald-50/50 border-emerald-200 text-neutral-400 line-through'
                              : 'bg-white border-[#E9E9E7] text-neutral-800 hover:border-neutral-300'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {activeRecipe.notes && (
                <div className="p-3.5 bg-[#FAF9F6] border border-[#E9E9E7] rounded-xl text-xs text-neutral-600">
                  <strong className="text-neutral-800">💡 Tips Dapur:</strong> {activeRecipe.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="p-4 sm:px-6 border-b border-[#E9E9E7] flex items-center justify-between bg-[#FAF9F6]">
              <h3 className="text-sm font-bold text-[#2F3437]">
                {editingId ? 'Edit Resep Masakan' : 'Tambah Resep Baru'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                  Nama Hidangan / Resep *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Grilled Salmon Lemon Herb Bowl"
                  className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-2"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as RecipeDifficulty)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-2"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Waktu Prep (Mnt)
                  </label>
                  <input
                    type="number"
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Waktu Masak (Mnt)
                  </label>
                  <input
                    type="number"
                    value={cookTimeMinutes}
                    onChange={(e) => setCookTimeMinutes(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Porsi Saji
                  </label>
                  <input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Kalori / Porsi
                  </label>
                  <input
                    type="number"
                    value={caloriesPerServing}
                    onChange={(e) => setCaloriesPerServing(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                  Bahan-bahan (1 baris per bahan, pisahkan takaran dengan tanda | )
                </label>
                <textarea
                  rows={4}
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  placeholder="Fillet Ikan Salmon | 300 gram&#10;Minyak Zaitun | 2 sdm"
                  className="w-full text-xs font-mono bg-neutral-50 border border-[#E9E9E7] rounded-lg p-3"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                  Langkah Memasak (1 baris per langkah)
                </label>
                <textarea
                  rows={4}
                  value={stepsText}
                  onChange={(e) => setStepsText(e.target.value)}
                  className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg p-3"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Tag Diet / Nutrisi (pisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={dietaryTagsInput}
                    onChange={(e) => setDietaryTagsInput(e.target.value)}
                    placeholder="High Protein, Low Carb, Halal"
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    URL Foto Makanan (Opsional)
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-1.5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E9E9E7]">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#2F3437] hover:bg-black rounded-lg"
                >
                  Simpan Resep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
