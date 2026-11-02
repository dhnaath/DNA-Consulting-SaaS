import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  Sun,
  Wallet,
  Users,
  Repeat,
  Landmark,
  DollarSign,
  Stethoscope,
  Home,
  Gift,
  ShoppingCart,
  PieChart,
  Scale,
  Flame,
  FileText,
  BookMarked,
  Film,
  Utensils,
  ShieldCheck,
  Briefcase,
  Search,
  RotateCcw,
  Sparkles,
  Download,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface HeaderBannerProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const {
    workspace,
    setWorkspace,
    searchQuery,
    setSearchQuery,
    resetToDefaults,
    openModal,
  } = useLifeOS();

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(localStorage, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lifecanvas_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <header className="relative w-full overflow-hidden select-none">
      {/* Ambient Gradient Header Bar */}
      <div className="relative w-full h-36 sm:h-44 md:h-52 bg-gradient-to-b from-[#F7E7CE] via-[#FCEFDA] to-[#FBFBFA] flex flex-col items-center justify-center px-4 transition-all">
        {/* Subtle decorative glow & blurred horizon */}
        <div className="absolute inset-0 bg-radial from-amber-200/40 via-transparent to-transparent pointer-events-none" />

        {/* Top Control Bar inside banner */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
          {/* Mobile hamburger */}
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 text-neutral-700 bg-white/70 hover:bg-white backdrop-blur-sm rounded-lg border border-neutral-200/60 shadow-xs transition-colors"
            title="Toggle Menu"
            aria-label="Toggle navigation menu"
          >
            {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Quick template switcher pills */}
          <div className="flex items-center gap-1 p-1 bg-white/80 backdrop-blur-md rounded-full border border-neutral-200/70 shadow-xs max-w-full overflow-x-auto no-scrollbar">
            <button
              onClick={() => setWorkspace('life-planner')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'life-planner'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Life Planner</span>
            </button>
            <button
              onClick={() => setWorkspace('finance-os')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'finance-os'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Finance OS</span>
            </button>
            <button
              onClick={() => setWorkspace('simple-finance')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'simple-finance'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Simple Finance</span>
            </button>
            <button
              onClick={() => setWorkspace('budget-tracker')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'budget-tracker'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Budget Tracker</span>
            </button>
            <button
              onClick={() => setWorkspace('weight-tracker')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'weight-tracker'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Weight Tracker</span>
            </button>
            <button
              onClick={() => setWorkspace('habit-tracker')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'habit-tracker'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Habit Tracker</span>
            </button>
            <button
              onClick={() => setWorkspace('notes')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'notes'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes</span>
            </button>
            <button
              onClick={() => setWorkspace('journal')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'journal'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Journal</span>
            </button>
            <button
              onClick={() => setWorkspace('movie-tracker')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'movie-tracker'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Movie Tracker</span>
            </button>
            <button
              onClick={() => setWorkspace('recipe-book')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'recipe-book'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Recipe Book</span>
            </button>
            <button
              onClick={() => setWorkspace('certificate-tracker')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'certificate-tracker'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certificates</span>
            </button>
            <button
              onClick={() => setWorkspace('travel-backpack')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'travel-backpack'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Travel Backpack</span>
            </button>
            <button
              onClick={() => setWorkspace('doctor-consultation')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'doctor-consultation'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Konsultasi Dokter</span>
            </button>
            <button
              onClick={() => setWorkspace('contacts')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'contacts'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Kontak</span>
            </button>
            <button
              onClick={() => setWorkspace('subscriptions')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'subscriptions'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Subscriptions</span>
            </button>
            <button
              onClick={() => setWorkspace('assets')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'assets'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Assets</span>
            </button>
            <button
              onClick={() => setWorkspace('household-items')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'household-items'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Household Items</span>
            </button>
            <button
              onClick={() => setWorkspace('wishlist')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'wishlist'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Wishlist</span>
            </button>
            <button
              onClick={() => setWorkspace('grocery-list')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                workspace === 'grocery-list'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Grocery List</span>
            </button>
          </div>

          {/* Right utility buttons */}
          <div className="flex items-center gap-2">
            {/* Search Input on desktop */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white/80 backdrop-blur-md rounded-lg border border-neutral-200/60 shadow-xs text-xs text-neutral-600 focus-within:border-neutral-400">
              <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-28 md:w-36 bg-transparent outline-hidden text-neutral-800 placeholder:text-neutral-400 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Reset data */}
            <button
              onClick={() => {
                if (window.confirm('Reset workspace data to original template defaults?')) {
                  resetToDefaults();
                }
              }}
              className="p-1.5 text-neutral-600 bg-white/70 hover:bg-white backdrop-blur-sm rounded-lg border border-neutral-200/60 shadow-xs hover:text-neutral-900 transition-colors"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Export JSON */}
            <button
              onClick={handleExportData}
              className="p-1.5 text-neutral-600 bg-white/70 hover:bg-white backdrop-blur-sm rounded-lg border border-neutral-200/60 shadow-xs hover:text-neutral-900 transition-colors"
              title="Export JSON Backup"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Serif Title matching screenshot */}
        <div className="relative text-center mt-4">
          <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl tracking-normal text-[#2F3437] font-normal drop-shadow-xs">
            {workspace === 'life-planner' && 'Life Planner'}
            {workspace === 'finance-os' && 'Finance OS'}
            {workspace === 'simple-finance' && 'Simple Finance Tracker'}
            {workspace === 'budget-tracker' && 'Budget Tracker by LifeCanvas'}
            {workspace === 'weight-tracker' && 'Weight Tracker by LifeCanvas'}
            {workspace === 'habit-tracker' && 'Habit Tracker by LifeCanvas'}
            {workspace === 'notes' && 'Notes by LifeCanvas'}
            {workspace === 'journal' && 'Journal by LifeCanvas'}
            {workspace === 'movie-tracker' && 'Movie Tracker by LifeCanvas'}
            {workspace === 'recipe-book' && 'Recipe Book by LifeCanvas'}
            {workspace === 'certificate-tracker' && 'Certificate Tracker by LifeCanvas'}
            {workspace === 'travel-backpack' && 'Travel Backpack by LifeCanvas'}
            {workspace === 'doctor-consultation' && 'Doctor Consultation Tracker'}
            {workspace === 'contacts' && 'Kontak'}
            {workspace === 'subscriptions' && 'Subscription Tracker'}
            {workspace === 'assets' && 'Assets Tracker'}
            {workspace === 'household-items' && 'Household Items Tracker'}
            {workspace === 'wishlist' && 'Wishlist Tracker'}
            {workspace === 'grocery-list' && 'Grocery List & Pantry'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans-body mt-1">
            {workspace === 'life-planner' && 'Clean personal operating system for daily productivity & intentional living'}
            {workspace === 'finance-os' && 'Complete financial ledger, automated budgeting & multi-account cashflow'}
            {workspace === 'simple-finance' && 'Minimalist daily finance tracker by LifeCanvas: ledger, monthly cashflow & savings'}
            {workspace === 'budget-tracker' && 'Envelope budgeting system with 50/30/20 rule allocation, category envelopes & spending controls'}
            {workspace === 'weight-tracker' && 'Body weight & fitness transformation log, BMI index analysis & goal trajectory trendlines'}
            {workspace === 'habit-tracker' && 'Weekly interactive habit matrix, streak counters, completion percentages & daily routines'}
            {workspace === 'notes' && 'Personal knowledge base, project documentation, book insights & Notion-style digital notebook system'}
            {workspace === 'journal' && 'Mindful daily reflection, gratitude journal, mood tracker & personal highlights'}
            {workspace === 'movie-tracker' && 'Watchlist organizer for movies, TV shows & anime with streaming platforms, ratings & reviews'}
            {workspace === 'recipe-book' && 'Personal digital cookbook with structured ingredients, interactive cooking steps & nutrition'}
            {workspace === 'certificate-tracker' && 'Centralized vault for passports, licenses, academic degrees & automated expiry alerts'}
            {workspace === 'travel-backpack' && 'Smart trip packing checklist, cabin & luggage weight calculator & reusable trip templates'}
            {workspace === 'doctor-consultation' && 'Personal medical consultation log, prescriptions, vitals & doctor directory'}
            {workspace === 'contacts' && 'Personal CRM, relationship directory, birthdays & interaction history'}
            {workspace === 'subscriptions' && 'Recurring subscription management, renewal schedule & cost optimization'}
            {workspace === 'assets' && 'Comprehensive net worth balance sheet, wealth tracking & asset allocation'}
            {workspace === 'household-items' && 'Home inventory catalog, warranty expiration alerts & periodic maintenance care'}
            {workspace === 'wishlist' && 'Mindful wishlist planner with 30-day cooling-off rule & automated savings tracking'}
            {workspace === 'grocery-list' && 'Weekly shopping checklist, pantry inventory & automated grocery expense logging'}
          </p>
        </div>
      </div>
    </header>
  );
};
