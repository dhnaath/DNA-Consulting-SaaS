import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { ChoreItem, SharedExpenseItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const ChoresApp: React.FC = () => {
  const {
    chores,
    toggleChoreDone,
    deleteChore,
    addChore,
    sharedExpenses,
    addSharedExpense,
    toggleExpenseSettled,
    deleteSharedExpense,
    activeSubMenu,
    setActiveSubMenu,
  } = usePEH();

  const [isChoreModalOpen, setIsChoreModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  // Form states: Chore
  const [choreTitle, setChoreTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [frequency, setFrequency] = useState<ChoreItem['frequency']>('Mingguan');
  const [room, setRoom] = useState<ChoreItem['room']>('Seluruh Rumah');

  // Form states: Shared Expense
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitMembers, setSplitMembers] = useState('');
  const [dueDate, setDueDate] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleChoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!choreTitle.trim()) return;

    addChore({
      title: choreTitle.trim(),
      assignee: assignee.trim() || 'Diri Sendiri',
      frequency,
      room,
    });

    setChoreTitle('');
    setAssignee('');
    setIsChoreModalOpen(false);
  };

  const handleBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billTitle.trim() || !billAmount) return;

    const members = splitMembers
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    addSharedExpense({
      title: billTitle.trim(),
      amount: Number(billAmount) || 0,
      paidBy: paidBy.trim() || 'Saya',
      splitWith: members.length > 0 ? members : ['Semua Penghuni'],
      dueDate: dueDate || todayStr,
      isSettled: false,
    });

    setBillTitle('');
    setBillAmount('');
    setPaidBy('');
    setSplitMembers('');
    setDueDate('');
    setIsBillModalOpen(false);
  };

  // Metrics derived from real records
  const totalBillsAmount = sharedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const settledBillsAmount = sharedExpenses
    .filter((e) => e.isSettled)
    .reduce((sum, item) => sum + item.amount, 0);
  const pendingBillsAmount = totalBillsAmount - settledBillsAmount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 text-neutral-800">
              <Icon name="Sparkles" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Tugas & Iuran Rumah
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Pembagian piket harian rumah dan pencatatan split tagihan utilitas keluarga.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsChoreModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <Icon name="Plus" size={13} />
            <span>Tugas Piket</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBillModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
          >
            <Icon name="Plus" size={14} />
            <span>Tagihan Bersama</span>
          </button>
        </div>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'chore-board', label: 'Piket Rumah', count: chores.length },
            { id: 'utilities', label: 'Tagihan & Utilitas', count: sharedExpenses.length },
            { id: 'summary', label: 'Rekap Kas & Pelunasan' },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'chore-board');
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubMenu(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {chores.length === 0 && sharedExpenses.length === 0 ? (
        <EmptyState
          iconName="Sparkles"
          title="Belum ada tugas piket maupun tagihan rumah"
          description="Atur rutinitas kebersihan rumah atau catat tagihan listrik PLN, air PAM, dan internet bersama tanpa placeholder dummy."
          actionLabel="Buat Tugas Piket"
          onAction={() => setIsChoreModalOpen(true)}
          secondaryLabel="Catat Tagihan Bersama"
          onSecondaryAction={() => setIsBillModalOpen(true)}
        />
      ) : (
        <>
          {/* Chore Board View */}
          {(activeSubMenu === 'chore-board' || !activeSubMenu) && (
            <div className="space-y-4">
              {chores.length === 0 ? (
                <EmptyState
                  iconName="CheckSquare"
                  title="Belum ada tugas piket"
                  description="Tambahkan tugas rutin rumah tangga seperti menyiram tanaman, membuang sampah, atau menyapu lantai."
                  actionLabel="Tambah Tugas Piket"
                  onAction={() => setIsChoreModalOpen(true)}
                />
              ) : (
                <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
                  {chores.map((chore) => {
                    const isDoneToday = chore.lastCompletedDate === todayStr;

                    return (
                      <div
                        key={chore.id}
                        className={`p-4 flex items-center justify-between transition-colors ${
                          isDoneToday ? 'bg-neutral-50/50' : 'hover:bg-neutral-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleChoreDone(chore.id)}
                            className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                              isDoneToday
                                ? 'bg-neutral-900 text-white'
                                : 'border border-neutral-300 hover:border-neutral-500 bg-white'
                            }`}
                          >
                            {isDoneToday && <Icon name="Check" size={13} className="stroke-[2.5]" />}
                          </button>

                          <div className="min-w-0">
                            <h4
                              className={`text-sm font-medium truncate ${
                                isDoneToday ? 'line-through text-neutral-400' : 'text-neutral-900'
                              }`}
                            >
                              {chore.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                              <span>PJ: {chore.assignee}</span>
                              <span aria-hidden="true">·</span>
                              <span>Area: {chore.room}</span>
                              <span aria-hidden="true">·</span>
                              <span>{chore.frequency}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteChore(chore.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Shared Utilities & Expenses View */}
          {activeSubMenu === 'utilities' && (
            <div className="space-y-4">
              {sharedExpenses.length === 0 ? (
                <EmptyState
                  iconName="DollarSign"
                  title="Belum ada tagihan bersama yang dicatat"
                  description="Catat tagihan listrik PLN, air PAM, WiFi, atau iuran keamanan lingkungan."
                  actionLabel="Catat Tagihan"
                  onAction={() => setIsBillModalOpen(true)}
                />
              ) : (
                <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
                  {sharedExpenses.map((bill) => (
                    <div
                      key={bill.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-900 text-sm">{bill.title}</span>
                          <span
                            className={`text-xs ${
                              bill.isSettled ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'
                            }`}
                          >
                            · {bill.isSettled ? 'Sudah Lunas' : 'Belum Lunas'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 flex-wrap">
                          <span>Talangan: {bill.paidBy}</span>
                          <span aria-hidden="true">·</span>
                          <span>Bagi dengan: {bill.splitWith.join(', ')}</span>
                          <span aria-hidden="true">·</span>
                          <span>Tenggat: {bill.dueDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-bold text-neutral-900 font-mono tabular-nums">
                            Rp {bill.amount.toLocaleString('id-ID')}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleExpenseSettled(bill.id)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                            bill.isSettled
                              ? 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200/80'
                              : 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800'
                          }`}
                        >
                          {bill.isSettled ? 'Batal Lunas' : 'Tandai Lunas'}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteSharedExpense(bill.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settlement & Kas Summary */}
          {activeSubMenu === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <div className="text-xs text-neutral-500">Total Tagihan Rumah</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">
                    Rp {totalBillsAmount.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <div className="text-xs text-neutral-500">Tagihan Sudah Lunas</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">
                    Rp {settledBillsAmount.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <div className="text-xs text-neutral-500">Sisa Tagihan Belum Lunas</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">
                    Rp {pendingBillsAmount.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-semibold text-neutral-800">
                  Rincian Pelunasan Berdasarkan Talangan
                </h4>
                {sharedExpenses.length === 0 ? (
                  <div className="py-4 text-center text-xs text-neutral-400">
                    Belum ada pengeluaran bersama yang tercatat.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sharedExpenses.map((bill) => (
                      <div
                        key={bill.id}
                        className="flex items-center justify-between text-xs py-2 border-b border-neutral-100 last:border-0"
                      >
                        <div>
                          <span className="font-medium text-neutral-900">{bill.title}</span>
                          <span className="text-neutral-500 ml-2">
                            (Dibayar oleh {bill.paidBy} untuk {bill.splitWith.join(', ')})
                          </span>
                        </div>
                        <div className="font-mono tabular-nums font-semibold text-neutral-900">
                          Rp {bill.amount.toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Chore Modal */}
      <Modal
        isOpen={isChoreModalOpen}
        onClose={() => setIsChoreModalOpen(false)}
        title="Tambah Tugas Piket Rumah"
        subtitle="Tetapkan penanggung jawab dan alokasi ruangan."
        maxWidth="md"
      >
        <form onSubmit={handleChoreSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Tugas Piket *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Menyapu dan Pel Lantai, Kuras Bak Kamar Mandi"
              value={choreTitle}
              onChange={(e) => setChoreTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Penanggung Jawab (PJ)
              </label>
              <input
                type="text"
                placeholder="Misal: Ayah, Ibu, Anak Pertama"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Area / Ruangan</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="Dapur">Dapur</option>
                <option value="Ruang Tengah">Ruang Tengah</option>
                <option value="Halaman">Halaman</option>
                <option value="Kamar Mandi">Kamar Mandi</option>
                <option value="Seluruh Rumah">Seluruh Rumah</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Frekuensi Piket</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
            >
              <option value="Harian">Harian</option>
              <option value="2 Hari Sekali">2 Hari Sekali</option>
              <option value="Mingguan">Mingguan</option>
              <option value="Dua Mingguan">Dua Mingguan</option>
              <option value="Bulanan">Bulanan</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsChoreModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Simpan Tugas
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Bill Modal */}
      <Modal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        title="Catat Tagihan & Utilitas Rumah"
        subtitle="Hitung split iuran bersama antar penghuni rumah."
        maxWidth="md"
      >
        <form onSubmit={handleBillSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Tagihan *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Token Listrik PLN, WiFi IndiHome, Iuran Sampah & RT"
              value={billTitle}
              onChange={(e) => setBillTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Nominal Tagihan (Rp) *
              </label>
              <input
                type="number"
                required
                placeholder="Misal: 450000"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Ditalangi / Dibayar Oleh
              </label>
              <input
                type="text"
                placeholder="Misal: Kakak, Saya"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Bagi Dengan (Pisahkan koma)
              </label>
              <input
                type="text"
                placeholder="Semua, Penghuni Kamar 1, 2"
                value={splitMembers}
                onChange={(e) => setSplitMembers(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Tenggat Jatuh Tempo
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsBillModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Simpan Tagihan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
