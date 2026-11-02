import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { PriorityLevel } from '../../types';
import { X, DollarSign, Calendar, Tag, ArrowRightLeft, BookOpen, Target, CheckSquare, Landmark } from 'lucide-react';

export const ActionModals: React.FC = () => {
  const {
    activeModal,
    closeModal,
    addTransaction,
    addTask,
    addJournal,
    addGoal,
    addAccount,
    transferFunds,
    addContact,
    addSubscription,
    addAsset,
    accounts,
  } = useLifeOS();

  // Form states
  const [txName, setTxName] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txDate, setTxDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [txCategory, setTxCategory] = useState('Food & Dining');
  const [txAccount, setTxAccount] = useState(accounts[0]?.id || 'acc-1');

  // Task form state
  const [taskName, setTaskName] = useState('');
  const [taskDate, setTaskDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('Medium');
  const [taskCategory, setTaskCategory] = useState('General');
  const [taskNotes, setTaskNotes] = useState('');

  // Journal form state
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalTag, setJournalTag] = useState('Personal');

  // Goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('Career');
  const [goalDate, setGoalDate] = useState('');
  const [goalStatus, setGoalStatus] = useState<'not_started' | 'in_progress' | 'done'>('in_progress');

  // Transfer form state
  const [transferSource, setTransferSource] = useState(accounts[0]?.id || '');
  const [transferTarget, setTransferTarget] = useState(accounts[1]?.id || '');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');

  // Account form state
  const [accName, setAccName] = useState('');
  const [accInstitution, setAccInstitution] = useState('');
  const [accType, setAccType] = useState<'Checking' | 'Savings' | 'Investment' | 'Cash'>('Checking');
  const [accBalance, setAccBalance] = useState('');

  // Contact form state
  const [conName, setConName] = useState('');
  const [conNickname, setConNickname] = useState('');
  const [conCategory, setConCategory] = useState<any>('Teman');
  const [conRole, setConRole] = useState('');
  const [conCompany, setConCompany] = useState('');
  const [conPhone, setConPhone] = useState('');
  const [conEmail, setConEmail] = useState('');
  const [conBirthday, setConBirthday] = useState('');
  const [conTags, setConTags] = useState('');
  const [conNotes, setConNotes] = useState('');

  // Subscription form state
  const [subName, setSubName] = useState('');
  const [subAmount, setSubAmount] = useState('');
  const [subCycle, setSubCycle] = useState<'monthly' | 'yearly' | 'weekly'>('monthly');
  const [subCategory, setSubCategory] = useState<any>('Entertainment');
  const [subNextDate, setSubNextDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [subPayMethod, setSubPayMethod] = useState('Waverly Bank (••4912)');
  const [subAutoRenew, setSubAutoRenew] = useState(true);
  const [subNotes, setSubNotes] = useState('');

  // Asset form state
  const [astName, setAstName] = useState('');
  const [astCategory, setAstCategory] = useState<any>('Investasi');
  const [astInstitution, setAstInstitution] = useState('');
  const [astDate, setAstDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [astPrice, setAstPrice] = useState('');
  const [astCurrentVal, setAstCurrentVal] = useState('');
  const [astLiquidity, setAstLiquidity] = useState<'High' | 'Medium' | 'Low'>('High');
  const [astNotes, setAstNotes] = useState('');

  if (!activeModal) return null;

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(txAmount);
    if (!txName.trim() || isNaN(amount) || amount <= 0) return;

    addTransaction({
      type: 'expense',
      name: txName.trim(),
      amount,
      date: txDate,
      category: txCategory,
      accountId: txAccount,
    });
    setTxName('');
    setTxAmount('');
    closeModal();
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(txAmount);
    if (!txName.trim() || isNaN(amount) || amount <= 0) return;

    addTransaction({
      type: 'income',
      name: txName.trim(),
      amount,
      date: txDate,
      category: txCategory,
      accountId: txAccount,
    });
    setTxName('');
    setTxAmount('');
    closeModal();
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    addTask({
      name: taskName.trim(),
      dueDate: taskDate,
      priority: taskPriority,
      category: taskCategory,
      completed: false,
      notes: taskNotes.trim() || undefined,
    });
    setTaskName('');
    setTaskNotes('');
    closeModal();
  };

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalTitle.trim() || !journalContent.trim()) return;

    addJournal({
      title: journalTitle.trim(),
      content: journalContent.trim(),
      tag: journalTag,
    });
    setJournalTitle('');
    setJournalContent('');
    closeModal();
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    addGoal({
      title: goalTitle.trim(),
      status: goalStatus,
      progress: goalStatus === 'done' ? 100 : goalStatus === 'in_progress' ? 25 : 0,
      targetDate: goalDate || undefined,
      category: goalCategory,
    });
    setGoalTitle('');
    closeModal();
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0 || transferSource === transferTarget) return;

    transferFunds(transferSource, transferTarget, amount, transferNote);
    setTransferAmount('');
    setTransferNote('');
    closeModal();
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseFloat(accBalance) || 0;
    if (!accName.trim()) return;

    addAccount({
      name: accName.trim(),
      institution: accInstitution.trim() || accName.trim(),
      type: accType,
      balance,
      color: '#2563EB',
    });
    setAccName('');
    setAccInstitution('');
    setAccBalance('');
    closeModal();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conName.trim()) return;

    const tagsArray = conTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addContact({
      name: conName.trim(),
      nickname: conNickname.trim() || undefined,
      category: conCategory,
      role: conRole.trim() || 'Professional',
      company: conCompany.trim() || undefined,
      phone: conPhone.trim() || '-',
      email: conEmail.trim() || '-',
      birthday: conBirthday.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : ['Contact'],
      notes: conNotes.trim() || undefined,
      favorite: false,
    });
    setConName('');
    setConNickname('');
    setConRole('');
    setConCompany('');
    setConPhone('');
    setConEmail('');
    setConBirthday('');
    setConTags('');
    setConNotes('');
    closeModal();
  };

  const handleSubscriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(subAmount);
    if (!subName.trim() || isNaN(amount) || amount <= 0) return;

    addSubscription({
      name: subName.trim(),
      amount,
      billingCycle: subCycle,
      category: subCategory,
      nextBilling: subNextDate,
      paymentMethod: subPayMethod.trim() || undefined,
      autoRenew: subAutoRenew,
      status: 'active',
      notes: subNotes.trim() || undefined,
    });
    setSubName('');
    setSubAmount('');
    setSubNotes('');
    closeModal();
  };

  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(astPrice) || 0;
    const currentVal = parseFloat(astCurrentVal) || price;
    if (!astName.trim()) return;

    addAsset({
      name: astName.trim(),
      category: astCategory,
      institution: astInstitution.trim() || 'Pribadi / Fisik',
      acquiredDate: astDate,
      purchasePrice: price,
      currentValue: currentVal,
      liquidity: astLiquidity,
      notes: astNotes.trim() || undefined,
    });
    setAstName('');
    setAstPrice('');
    setAstCurrentVal('');
    setAstInstitution('');
    setAstNotes('');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
          <h3 className="font-serif-title text-xl text-neutral-900 font-normal">
            {activeModal === 'expense' && 'New Expense'}
            {activeModal === 'income' && 'New Income'}
            {activeModal === 'task' && 'New Task'}
            {activeModal === 'journal' && 'New Journal Entry'}
            {activeModal === 'goal' && 'New Goal'}
            {activeModal === 'transfer' && 'Transfer Funds'}
            {activeModal === 'account' && 'Add Account'}
            {activeModal === 'contact' && 'Tambah Kontak Baru'}
            {activeModal === 'subscription' && 'Tambah Langganan Baru'}
            {activeModal === 'asset' && 'Tambah Aset Portofolio'}
          </h3>
          <button
            onClick={closeModal}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Expense / Income Form */}
        {(activeModal === 'expense' || activeModal === 'income') && (
          <form
            onSubmit={activeModal === 'expense' ? handleExpenseSubmit : handleIncomeSubmit}
            className="space-y-3 text-xs"
          >
            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Description / Title
              </label>
              <input
                type="text"
                required
                placeholder={activeModal === 'expense' ? 'e.g. Grocery Store, Coffee...' : 'e.g. Consulting, Digital sales...'}
                value={txName}
                onChange={(e) => setTxName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden font-mono-nums focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Category
                </label>
                {activeModal === 'expense' ? (
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                  >
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Bills & Utilities">Bills & Utilities</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Groceries">Groceries</option>
                  </select>
                ) : (
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                  >
                    <option value="Salary">Salary</option>
                    <option value="Ecommerce">Ecommerce</option>
                    <option value="Digital Products">Digital Products</option>
                    <option value="Affiliates">Affiliates</option>
                    <option value="Real Estate">Real Estate</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Account
                </label>
                <select
                  value={txAccount}
                  onChange={(e) => setTxAccount(e.target.value)}
                  className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2383E2] hover:bg-[#1B74C9] text-white font-medium rounded-md shadow-2xs transition-colors"
              >
                Save {activeModal === 'expense' ? 'Expense' : 'Income'}
              </button>
            </div>
          </form>
        )}

        {/* Task Form */}
        {activeModal === 'task' && (
          <form onSubmit={handleTaskSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Task Name
              </label>
              <input
                type="text"
                required
                placeholder="What needs to be done?"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Priority
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as PriorityLevel)}
                  className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Notes & Context (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Details, subtasks, or checklist..."
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden resize-none focus:border-neutral-900"
              />
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2383E2] hover:bg-[#1B74C9] text-white font-medium rounded-md shadow-2xs transition-colors"
              >
                Create Task
              </button>
            </div>
          </form>
        )}

        {/* Journal Form */}
        {activeModal === 'journal' && (
          <form onSubmit={handleJournalSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Session Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Evening Reflection, Learning Notes..."
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Category Tag
              </label>
              <select
                value={journalTag}
                onChange={(e) => setJournalTag(e.target.value)}
                className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
              >
                <option value="Personal">Personal</option>
                <option value="Learning">Learning</option>
                <option value="Finance">Finance</option>
                <option value="Career">Career</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Reflection & Thoughts
              </label>
              <textarea
                rows={5}
                required
                placeholder="Write your entry here..."
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden font-sans-body resize-none focus:border-neutral-900"
              />
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2383E2] hover:bg-[#1B74C9] text-white font-medium rounded-md shadow-2xs transition-colors"
              >
                Save Journal
              </button>
            </div>
          </form>
        )}

        {/* Transfer Form */}
        {activeModal === 'transfer' && (
          <form onSubmit={handleTransferSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Source Account
                </label>
                <select
                  value={transferSource}
                  onChange={(e) => setTransferSource(e.target.value)}
                  className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (${acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Target Account
                </label>
                <select
                  value={transferTarget}
                  onChange={(e) => setTransferTarget(e.target.value)}
                  className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (${acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Transfer Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden font-mono-nums focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Memo / Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Monthly emergency fund allocation"
                value={transferNote}
                onChange={(e) => setTransferNote(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
              />
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2383E2] hover:bg-[#1B74C9] text-white font-medium rounded-md shadow-2xs transition-colors"
              >
                Execute Transfer
              </button>
            </div>
          </form>
        )}

        {/* Goal Form */}
        {activeModal === 'goal' && (
          <form onSubmit={handleGoalSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Goal Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Build emergency fund, Run 10k..."
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Initial Status
                </label>
                <select
                  value={goalStatus}
                  onChange={(e) => setGoalStatus(e.target.value as any)}
                  className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                >
                  <option value="not_started">Not Started (0%)</option>
                  <option value="in_progress">In Progress (25%)</option>
                  <option value="done">Completed (100%)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2383E2] hover:bg-[#1B74C9] text-white font-medium rounded-md shadow-2xs transition-colors"
              >
                Save Goal
              </button>
            </div>
          </form>
        )}

        {/* Account Form */}
        {activeModal === 'account' && (
          <form onSubmit={handleAccountSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Account Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chase Sapphire, Vanguard Index..."
                value={accName}
                onChange={(e) => setAccName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Type
                </label>
                <select
                  value={accType}
                  onChange={(e) => setAccType(e.target.value as any)}
                  className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                >
                  <option value="Checking">Checking</option>
                  <option value="Savings">Savings</option>
                  <option value="Investment">Investment</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Starting Balance ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={accBalance}
                  onChange={(e) => setAccBalance(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden font-mono-nums focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2383E2] hover:bg-[#1B74C9] text-white font-medium rounded-md shadow-2xs transition-colors"
              >
                Add Account
              </button>
            </div>
          </form>
        )}

        {/* Contact Form */}
        {activeModal === 'contact' && (
          <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Budi Santoso"
                  value={conName}
                  onChange={(e) => setConName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  placeholder="e.g. Budi"
                  value={conNickname}
                  onChange={(e) => setConNickname(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Kategori Relasi
                </label>
                <select
                  value={conCategory}
                  onChange={(e) => setConCategory(e.target.value)}
                  className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                >
                  <option value="Teman">Teman</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Rekan Kerja">Rekan Kerja</option>
                  <option value="Klien">Klien</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Vendor">Vendor</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Pekerjaan / Jabatan
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Designer"
                  value={conRole}
                  onChange={(e) => setConRole(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Perusahaan / Instansi
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tech Studio"
                  value={conCompany}
                  onChange={(e) => setConCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Tanggal Lahir (Ultah)
                </label>
                <input
                  type="date"
                  value={conBirthday}
                  onChange={(e) => setConBirthday(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="+62 812-..."
                  value={conPhone}
                  onChange={(e) => setConPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden font-mono-nums focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={conEmail}
                  onChange={(e) => setConEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden font-mono-nums focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Tags (pisahkan koma)
              </label>
              <input
                type="text"
                placeholder="e.g. Fintech, Advisory, Coffee"
                value={conTags}
                onChange={(e) => setConTags(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Catatan Kolaborasi & Hubungan
              </label>
              <textarea
                rows={2}
                placeholder="Catatan topik obrolan terakhir atau rencana proyek..."
                value={conNotes}
                onChange={(e) => setConNotes(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden resize-none focus:border-neutral-900"
              />
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2383E2] hover:bg-[#1B74C9] text-white font-medium rounded-md shadow-2xs transition-colors"
              >
                Simpan Kontak
              </button>
            </div>
          </form>
        )}

        {/* Subscription Form */}
        {activeModal === 'subscription' && (
          <form onSubmit={handleSubscriptionSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Nama Layanan *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Netflix, ChatGPT Plus, Spotify..."
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Biaya Berlangganan ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={subAmount}
                  onChange={(e) => setSubAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden font-mono-nums focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Siklus Penagihan
                </label>
                <select
                  value={subCycle}
                  onChange={(e) => setSubCycle(e.target.value as any)}
                  className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                >
                  <option value="monthly">Bulanan (Monthly)</option>
                  <option value="yearly">Tahunan (Yearly)</option>
                  <option value="weekly">Mingguan (Weekly)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Kategori
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value as any)}
                  className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                >
                  <option value="Entertainment">Entertainment & Streaming</option>
                  <option value="Productivity">Productivity & AI</option>
                  <option value="Cloud Storage">Cloud Storage & Backup</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Utilities">Utilities & Security</option>
                  <option value="Education">Education & Courses</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Jatuh Tempo Berikutnya
                </label>
                <input
                  type="date"
                  required
                  value={subNextDate}
                  onChange={(e) => setSubNextDate(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Metode Pembayaran
              </label>
              <input
                type="text"
                placeholder="e.g. Waverly Bank (••4912), Apple Pay, CC"
                value={subPayMethod}
                onChange={(e) => setSubPayMethod(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="autoRenewCheck"
                checked={subAutoRenew}
                onChange={(e) => setSubAutoRenew(e.target.checked)}
                className="rounded-xs border-neutral-300"
              />
              <label htmlFor="autoRenewCheck" className="text-xs text-neutral-700 cursor-pointer">
                Perpanjangan Otomatis (Auto-Renew)
              </label>
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Catatan (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Paket keluarga shared 5 orang..."
                value={subNotes}
                onChange={(e) => setSubNotes(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
              />
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2383E2] hover:bg-[#1B74C9] text-white font-medium rounded-md shadow-2xs transition-colors"
              >
                Simpan Langganan
              </button>
            </div>
          </form>
        )}

        {/* Asset Form */}
        {activeModal === 'asset' && (
          <form onSubmit={handleAssetSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Nama Aset *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apartemen Studio BSD, Saham BBCA, Bitcoin..."
                value={astName}
                onChange={(e) => setAstName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Kelas Aset
                </label>
                <select
                  value={astCategory}
                  onChange={(e) => setAstCategory(e.target.value)}
                  className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                >
                  <option value="Investasi">Investasi / Pasar Modal</option>
                  <option value="Property">Property & Real Estate</option>
                  <option value="Kas & Bank">Kas & Tabungan</option>
                  <option value="Kripto">Kripto & Digital Asset</option>
                  <option value="Kendaraan">Kendaraan</option>
                  <option value="Elektronik & Gadget">Elektronik & Gadget</option>
                  <option value="Logam Mulia">Logam Mulia (Emas)</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Tingkat Likuiditas
                </label>
                <select
                  value={astLiquidity}
                  onChange={(e) => setAstLiquidity(e.target.value as any)}
                  className="w-full px-2.5 py-2 border border-neutral-300 rounded-md outline-hidden bg-white focus:border-neutral-900"
                >
                  <option value="High">Tinggi (Cair &lt; 24 jam)</option>
                  <option value="Medium">Sedang (Cair hitungan hari/minggu)</option>
                  <option value="Low">Rendah (Properti/Aset Tetap)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Harga Beli Awal ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={astPrice}
                  onChange={(e) => setAstPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden font-mono-nums focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Nilai Pasar Saat Ini ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={astCurrentVal}
                  onChange={(e) => setAstCurrentVal(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden font-mono-nums focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Institusi / Lokasi Simpan
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stockbit, Safe Deposit Box, SHM..."
                  value={astInstitution}
                  onChange={(e) => setAstInstitution(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Tanggal Akuisisi / Beli
                </label>
                <input
                  type="date"
                  value={astDate}
                  onChange={(e) => setAstDate(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">
                Catatan Aset (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Detail spesifikasi, asuransi, atau nomor sertifikat..."
                value={astNotes}
                onChange={(e) => setAstNotes(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md outline-hidden resize-none focus:border-neutral-900"
              />
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2383E2] hover:bg-[#1B74C9] text-white font-medium rounded-md shadow-2xs transition-colors"
              >
                Simpan Aset
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
