import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { JournalItem } from '../../types';
import { BookOpen, ChevronDown, Plus, Trash2, Calendar, Tag, Clock } from 'lucide-react';

export const TodayJournalWidget: React.FC = () => {
  const { journals, openModal, deleteJournal, setWorkspace } = useLifeOS();
  const [selectedEntry, setSelectedEntry] = useState<JournalItem | null>(null);

  return (
    <div className="bg-white rounded-lg border border-neutral-200/70 shadow-2xs overflow-hidden select-none">
      {/* Top Header matching screenshot */}
      <div className="px-3.5 pt-3 pb-2 border-b border-neutral-100 flex items-center justify-between">
        <button
          onClick={() => setWorkspace('journal')}
          className="text-xs font-semibold text-neutral-800 hover:text-amber-600 transition-colors flex items-center gap-1.5"
          title="Buka Journal by LifeCanvas"
        >
          <span>Today's Journal</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200/60">
            Full View →
          </span>
        </button>

        <div className="flex items-center gap-1.5">
          <div className="px-2 py-0.5 text-[11px] font-medium text-neutral-800 bg-neutral-100 rounded-md">
            Today
          </div>
          <button
            onClick={() => openModal('journal')}
            className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-white bg-[#2383E2] hover:bg-[#1B74C9] rounded-md shadow-2xs transition-colors"
          >
            <span>New</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>
        </div>
      </div>

      {/* Journal Cards List */}
      <div className="p-3 space-y-2.5">
        {journals.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="p-3 bg-neutral-50/70 hover:bg-neutral-100/60 border border-neutral-200/50 rounded-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <h4 className="text-xs font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors leading-snug">
                {entry.title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteJournal(entry.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-400 hover:text-rose-600 transition-opacity"
                title="Delete journal"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            <p className="text-[11px] text-neutral-600 line-clamp-3 leading-relaxed mb-2 font-sans-body">
              {entry.content}
            </p>

            <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono-nums pt-1 border-t border-neutral-200/40">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-2.5 h-2.5" />
                <span>{entry.date}</span>
              </div>
              {entry.tag && (
                <span className="px-1.5 py-0.5 bg-neutral-200/60 text-neutral-700 rounded-xs text-[9px] font-sans-body">
                  {entry.tag}
                </span>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={() => openModal('journal')}
          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 p-1 rounded-sm transition-colors w-full"
        >
          <Plus className="w-3.5 h-3.5 text-neutral-400" />
          <span>New page</span>
        </button>
      </div>

      {/* Reader Dialog when clicked */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-sm text-xs font-medium">
                  {selectedEntry.tag}
                </span>
                <h3 className="font-serif-title text-2xl text-neutral-900 mt-2 font-normal">
                  {selectedEntry.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                  <span>{selectedEntry.date}</span>
                  <span>·</span>
                  <span>{selectedEntry.readingTime || '2 min read'}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 text-xs sm:text-sm text-neutral-700 font-sans-body leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto pr-1">
              {selectedEntry.content}
            </div>

            <div className="mt-6 pt-3 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-1.5 bg-neutral-900 text-white rounded-md text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
