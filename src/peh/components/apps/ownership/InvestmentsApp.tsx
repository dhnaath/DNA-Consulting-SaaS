import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { InvestmentItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const InvestmentsApp: React.FC = () => {
  const { investments, addInvestment, updateInvestmentPrice, deleteInvestment, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterClass, setFilterClass] = useState<string>('Semua');

  // Form state
  const [assetName, setAssetName] = useState('');
  const [assetClass, setAssetClass] = useState<InvestmentItem['assetClass']>('Saham Publik');
  const [unitsHeld, setUnitsHeld] = useState<number>(100);
  const [averageBuyPrice, setAverageBuyPrice] = useState<number>(5000);
  const [currentPrice, setCurrentPrice] = useState<number>(5500);
  const [annualDividendYieldPercent, setAnnualDividendYieldPercent] = useState<number>(4.5);
  const [brokerOrCustodian, setBrokerOrCustodian] = useState('');
  const [notes, setNotes] = useState('');

  // Price update modal
  const [editingItem, setEditingItem] = useState<InvestmentItem | null>(null);
  const [newCurrentPrice, setNewCurrentPrice] = useState<number>(0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim() || !brokerOrCustodian.trim()) return;

    addInvestment({
      assetName: assetName.trim(),
      assetClass,
      unitsHeld: Number(unitsHeld) || 0,
      averageBuyPrice: Number(averageBuyPrice) || 0,
      currentPrice: Number(currentPrice) || 0,
      annualDividendYieldPercent: Number(annualDividendYieldPercent) || 0,
      brokerOrCustodian: brokerOrCustodian.trim(),
      lastValuationDate: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
    });

    setAssetName('');
    setBrokerOrCustodian('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const handleUpdatePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateInvestmentPrice(editingItem.id, Number(newCurrentPrice));
    setEditingItem(null);
  };

  const filteredInvestments = investments.filter((item) => {
    return filterClass === 'Semua' || item.assetClass === filterClass;
  });

  const totalCost = investments.reduce((acc, curr) => acc + curr.unitsHeld * curr.averageBuyPrice, 0);
  const totalMarketValue = investments.reduce((acc, curr) => acc + curr.unitsHeld * curr.currentPrice, 0);
  const unrealizedGain = totalMarketValue - totalCost;
  const unrealizedGainPercent = totalCost > 0 ? ((unrealizedGain / totalCost) * 100).toFixed(2) : '0';
  const totalEstimatedAnnualDividend = investments.reduce((acc, curr) => {
    const yieldPct = curr.annualDividendYieldPercent || 0;
    return acc + (curr.unitsHeld * curr.currentPrice * yieldPct) / 100;
  }, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200 dark:border-amber-900/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Icon name="TrendingUp" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              Portofolio Investasi & Treasury
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Pelacak instrumen SBN, saham publik, reksadana, dan kalkulator estimasi dividen.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Aset Investasi</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-amber-200/60 dark:border-amber-900/40 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('portfolio')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'portfolio'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="Briefcase" size={14} />
          <span>Portofolio Aset ({investments.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('dividend-calc')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'dividend-calc'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="Calculator" size={14} />
          <span>Kalkulator Imbal Hasil (Yield)</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('allocation')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'allocation'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="PieChart" size={14} />
          <span>Alokasi Kelas Aset</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50">
          <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Total Modal Masuk</p>
          <p className="text-base font-bold text-stone-900 dark:text-white mt-1">
            Rp {totalCost.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50">
          <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Nilai Pasar Terkini</p>
          <p className="text-base font-bold text-stone-900 dark:text-white mt-1">
            Rp {totalMarketValue.toLocaleString('id-ID')}
          </p>
        </div>
        <div
          className={`p-3.5 rounded-xl border ${
            unrealizedGain >= 0
              ? 'border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/20'
              : 'border-rose-200/80 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/20'
          }`}
        >
          <p
            className={`text-[11px] font-medium ${
              unrealizedGain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            Floating P/L
          </p>
          <p
            className={`text-base font-bold mt-1 ${
              unrealizedGain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {unrealizedGain >= 0 ? '+' : ''}Rp {unrealizedGain.toLocaleString('id-ID')} ({unrealizedGainPercent}%)
          </p>
        </div>
        <div className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/20">
          <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">Estimasi Dividen / Thn</p>
          <p className="text-base font-bold text-amber-600 dark:text-amber-400 mt-1">
            Rp {Math.round(totalEstimatedAnnualDividend).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* View: Dividend Calc */}
      {activeSubMenu === 'dividend-calc' && (
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-white">Proyeksi Passive Income & Kupon</h3>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Berdasarkan bobot portofolio aktif, Anda berpotensi menerima sekitar{' '}
            <strong className="text-amber-700 dark:text-amber-300">
              Rp {Math.round(totalEstimatedAnnualDividend / 12).toLocaleString('id-ID')}
            </strong>{' '}
            per bulan atau{' '}
            <strong className="text-amber-700 dark:text-amber-300">
              Rp {Math.round(totalEstimatedAnnualDividend).toLocaleString('id-ID')}
            </strong>{' '}
            per tahun dari kupon obligasi pemerintah dan dividen emiten saham.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-500">Filter Kelas:</span>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300"
        >
          <option value="Semua">Semua Kelas Aset</option>
          <option value="Saham Publik">Saham Publik</option>
          <option value="Obligasi / SBN">Obligasi / SBN</option>
          <option value="Reksadana">Reksadana</option>
          <option value="Emas & Komoditas">Emas & Komoditas</option>
          <option value="Deposito / Kas">Deposito / Kas</option>
        </select>
      </div>

      {/* List */}
      {filteredInvestments.length === 0 ? (
        <EmptyState
          iconName="TrendingUp"
          title="Portofolio Masih Bersih"
          description="Catat alokasi investasi korporat atau treasury Anda untuk memantau valuasi dan estimasi imbal hasil berkala."
          actionLabel="Tambah Instrumen Investasi"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInvestments.map((item) => {
            const cost = item.unitsHeld * item.averageBuyPrice;
            const marketVal = item.unitsHeld * item.currentPrice;
            const pl = marketVal - cost;
            const plPct = cost > 0 ? ((pl / cost) * 100).toFixed(2) : '0';

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        {item.assetClass}
                      </span>
                      <h3 className="font-semibold text-sm text-stone-900 dark:text-white mt-1.5">
                        {item.assetName}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400">Kustodian / Broker: {item.brokerOrCustodian}</p>
                    </div>
                    <button
                      onClick={() => deleteInvestment(item.id)}
                      className="text-stone-400 hover:text-rose-500 p-1 rounded transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>

                  <div className="mt-3 text-xs space-y-1.5 text-stone-600 dark:text-stone-400">
                    <div className="flex items-center justify-between">
                      <span>Jumlah Unit / Lembar:</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {item.unitsHeld.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Harga Rata-Rata Beli:</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        Rp {item.averageBuyPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Harga Pasar Terkini:</span>
                      <span className="font-semibold text-stone-900 dark:text-white">
                        Rp {item.currentPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
                      <span>Total Nilai Pasar:</span>
                      <span className="font-bold text-stone-900 dark:text-white">
                        Rp {marketVal.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Gain / Loss:</span>
                      <span className={`font-semibold ${pl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {pl >= 0 ? '+' : ''}Rp {pl.toLocaleString('id-ID')} ({plPct}%)
                      </span>
                    </div>
                    {item.annualDividendYieldPercent ? (
                      <div className="flex items-center justify-between">
                        <span>Estimasi Kupon/Dividen:</span>
                        <span className="font-medium text-amber-600 dark:text-amber-400">
                          {item.annualDividendYieldPercent}% / thn
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {item.notes && (
                    <p className="mt-2 text-xs italic text-stone-500 bg-stone-50 dark:bg-stone-950/40 p-2 rounded">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">
                    Valuasi: {item.lastValuationDate}
                  </span>
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setNewCurrentPrice(item.currentPrice);
                    }}
                    className="text-xs px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium transition-colors cursor-pointer"
                  >
                    Update Harga Pasar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Update Price Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={`Update Harga Pasar: ${editingItem?.assetName}`}
      >
        <form onSubmit={handleUpdatePriceSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Harga Pasar Terkini per Unit (Rp) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={newCurrentPrice}
              onChange={(e) => setNewCurrentPrice(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
            >
              Simpan Harga Baru
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Instrumen Investasi Baru">
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Nama Aset / Ticker / Seri *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: BBCA (Bank Central Asia) atau ORI024"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Kelas Aset</label>
              <select
                value={assetClass}
                onChange={(e) => setAssetClass(e.target.value as InvestmentItem['assetClass'])}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Saham Publik">Saham Publik</option>
                <option value="Obligasi / SBN">Obligasi / SBN</option>
                <option value="Reksadana">Reksadana</option>
                <option value="Emas & Komoditas">Emas & Komoditas</option>
                <option value="Deposito / Kas">Deposito / Kas</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Broker / Sekuritas / Kustodian *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Mandiri Sekuritas / Bareksa / BCA"
                value={brokerOrCustodian}
                onChange={(e) => setBrokerOrCustodian(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Jumlah Unit / Lembar</label>
              <input
                type="number"
                min="1"
                required
                value={unitsHeld}
                onChange={(e) => setUnitsHeld(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Harga Beli Rata-Rata (Rp)</label>
              <input
                type="number"
                min="0"
                required
                value={averageBuyPrice}
                onChange={(e) => setAverageBuyPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Harga Pasar Terkini (Rp)</label>
              <input
                type="number"
                min="0"
                required
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Estimasi Yield Kupon/Dividen Tahunan (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={annualDividendYieldPercent}
              onChange={(e) => setAnnualDividendYieldPercent(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Catatan Strategi</label>
            <textarea
              rows={2}
              placeholder="Contoh: Rencana hold jangka panjang 5 tahun untuk dividen reinvestment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
            >
              Simpan Instrumen
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
