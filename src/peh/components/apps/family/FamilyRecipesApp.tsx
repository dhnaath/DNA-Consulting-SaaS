import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { FamilyRecipeItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const FamilyRecipesApp: React.FC = () => {
  const { familyRecipes, addFamilyRecipe, deleteFamilyRecipe, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<FamilyRecipeItem | null>(null);
  const [servingMultiplier, setServingMultiplier] = useState<number>(1);

  // Form states
  const [recipeTitle, setRecipeTitle] = useState('');
  const [originPerson, setOriginPerson] = useState('');
  const [category, setCategory] = useState<FamilyRecipeItem['category']>('Lauk Utama');
  const [servings, setServings] = useState<number>(4);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(45);
  const [ingredientsText, setIngredientsText] = useState('');
  const [cookingStepsText, setCookingStepsText] = useState('');
  const [secretTip, setSecretTip] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeTitle.trim() || !originPerson.trim()) return;

    const ingredients = ingredientsText
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean);

    const cookingSteps = cookingStepsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addFamilyRecipe({
      recipeTitle: recipeTitle.trim(),
      originPerson: originPerson.trim(),
      category,
      servings: Number(servings) || 4,
      prepTimeMinutes: Number(prepTimeMinutes) || 30,
      ingredients,
      cookingSteps,
      secretTip: secretTip.trim() || undefined,
    });

    setRecipeTitle('');
    setOriginPerson('');
    setIngredientsText('');
    setCookingStepsText('');
    setSecretTip('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Icon name="UtensilsCrossed" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Resep Warisan Keluarga
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Buku resep rahasia leluhur, takaran bahan, dan pengubah porsi masak otomatis untuk hajatan/reuni.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tulis Resep Leluhur</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('recipes')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'recipes'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Book" size={14} />
          <span>Buku Resep Leluhur ({familyRecipes.length})</span>
        </button>
      </div>

      {/* Main Grid */}
      {familyRecipes.length === 0 ? (
        <EmptyState
          iconName="Utensils"
          title="Belum Ada Resep Keluarga"
          description="Buku resep Anda masih bersih tanpa data dummy. Catat resep rendang nenek, rawon khas ibu, atau sambal warisan keluarga."
          actionLabel="Tulis Resep Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyRecipes.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                    {r.category}
                  </span>
                  <span className="text-xs text-neutral-500">⏱ {r.prepTimeMinutes} Menit</span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-white">{r.recipeTitle}</h3>
                <p className="text-xs text-neutral-500 mb-3">Warisan dari: <strong className="text-neutral-800 dark:text-neutral-200">{r.originPerson}</strong> ({r.servings} Porsi Normal)</p>

                {/* Secret Tip Banner */}
                {r.secretTip && (
                  <div className="p-3 mb-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                    <Icon name="Sparkles" size={14} className="shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <span className="font-bold">Tips Rahasia: </span>
                      <span>{r.secretTip}</span>
                    </div>
                  </div>
                )}

                {/* Ingredients snippet */}
                <div className="text-xs text-neutral-600 dark:text-neutral-300 mb-3">
                  <span className="font-semibold block mb-1 text-neutral-900 dark:text-white">Bahan Utama ({r.ingredients.length}):</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-500">
                    {r.ingredients.slice(0, 4).map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                    {r.ingredients.length > 4 && <li>dan {r.ingredients.length - 4} bahan lainnya...</li>}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedRecipe(r);
                    setServingMultiplier(1);
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon name="Scale" size={13} />
                  <span>Skala Porsi ({r.servings} porsi)</span>
                </button>

                <button
                  onClick={() => deleteFamilyRecipe(r.id)}
                  className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Hapus resep"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Feature Modal: Portion Scaler */}
      {selectedRecipe && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRecipe(null)}
          title={`Kalkulator Porsi Masak: ${selectedRecipe.recipeTitle}`}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-between text-xs">
              <span>Porsi Awal: <strong>{selectedRecipe.servings} Porsi</strong></span>
              <div className="flex items-center gap-2">
                <span>Skala Penggali:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 5, 10].map((mult) => (
                    <button
                      key={mult}
                      onClick={() => setServingMultiplier(mult)}
                      className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer ${
                        servingMultiplier === mult
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      {mult}x ({selectedRecipe.servings * mult} Porsi)
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold mb-2 text-neutral-900 dark:text-white">
                Kebutuhan Bahan untuk {selectedRecipe.servings * servingMultiplier} Porsi:
              </h4>
              <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1.5 max-h-60 overflow-y-auto">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="text-xs flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                    <span className="text-neutral-700 dark:text-neutral-300">{ing}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {servingMultiplier > 1 ? `x${servingMultiplier} takaran` : '1x takaran'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold"
              >
                Tutup Kalkulator
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Add Recipe */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tulis Resep Warisan Leluhur">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Judul Resep</label>
              <input
                type="text"
                required
                value={recipeTitle}
                onChange={(e) => setRecipeTitle(e.target.value)}
                placeholder="Contoh: Rendang Daging Padang Asli"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Sosok Pemilik Resep</label>
              <input
                type="text"
                required
                value={originPerson}
                onChange={(e) => setOriginPerson(e.target.value)}
                placeholder="Contoh: Nenek Siti Aminah"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Lauk Utama">Lauk Utama</option>
                <option value="Sup & Kuah">Sup & Kuah</option>
                <option value="Kue & Camilan Tradisional">Kue & Camilan Tradisional</option>
                <option value="Sambal & Bumbu Khas">Sambal & Bumbu Khas</option>
                <option value="Minuman Herbal">Minuman Herbal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Standar Porsi</label>
              <input
                type="number"
                min="1"
                required
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Waktu Masak (Menit)</label>
              <input
                type="number"
                min="5"
                required
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Daftar Bahan & Takaran (Satu baris per bahan)
            </label>
            <textarea
              rows={3}
              required
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="1 kg Daging Sapi Gandik&#10;1 Liter Santan Kental&#10;5 Lembar Daun Jeruk Purut"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Langkah-langkah Memasak (Satu baris per langkah)
            </label>
            <textarea
              rows={3}
              required
              value={cookingStepsText}
              onChange={(e) => setCookingStepsText(e.target.value)}
              placeholder="1. Tumis bumbu halus hingga harum&#10;2. Masukkan daging dan aduk hingga berubah warna&#10;3. Tuang santan dan masak dengan api kecil"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Tips Rahasia Leluhur (Kunci Kelezatan)
            </label>
            <input
              type="text"
              value={secretTip}
              onChange={(e) => setSecretTip(e.target.value)}
              placeholder="Contoh: Gunakan kelapa parut sangrai tumbuk untuk aroma gurih khas"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              Simpan Resep
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
