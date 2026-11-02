import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  CheckSquare,
  Square,
  Plus,
  Flame,
  ChevronDown,
  Trash2,
  Calendar,
} from 'lucide-react';

export const HabitTracker: React.FC = () => {
  const { habits, toggleHabitToday, addHabit, deleteHabit, openModal } = useLifeOS();
  const [isAdding, setIsAdding] = useState(false);
  const [habitName, setHabitName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    addHabit(habitName);
    setHabitName('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200/70 shadow-2xs overflow-hidden select-none">
      {/* Notion tab header matching screenshot */}
      <div className="px-3.5 pt-3 pb-2 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-semibold text-neutral-800">Habit</h3>
          <div className="px-2 py-0.5 text-[11px] font-medium text-neutral-800 bg-neutral-100 rounded-md">
            Today
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Blue Notion New Button */}
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-white bg-[#2383E2] hover:bg-[#1B74C9] rounded-md shadow-2xs transition-colors"
          >
            <span>New</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>
        </div>
      </div>

      {/* Habit Body */}
      <div className="p-3">
        <div className="text-xs font-medium text-neutral-500 mb-2">
          @Today
        </div>

        <div className="space-y-1.5">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between p-1.5 rounded-md hover:bg-neutral-50 transition-colors group"
            >
              <button
                onClick={() => toggleHabitToday(habit.id)}
                className="flex items-center gap-2 text-left"
              >
                {habit.completedToday ? (
                  <CheckSquare className="w-4 h-4 text-[#2383E2] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 shrink-0" />
                )}
                <span
                  className={`text-xs ${
                    habit.completedToday
                      ? 'text-neutral-400 line-through'
                      : 'text-neutral-800 font-medium'
                  }`}
                >
                  {habit.name}
                </span>
              </button>

              <div className="flex items-center gap-2">
                {habit.streak > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] font-mono-nums text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-xs">
                    <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    <span>{habit.streak}d</span>
                  </span>
                )}
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-rose-600 p-0.5 transition-opacity"
                  title="Remove habit"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Add Habit */}
        {isAdding ? (
          <form onSubmit={handleAdd} className="mt-2 flex items-center gap-1.5">
            <input
              type="text"
              placeholder="e.g. 10m Meditation"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-neutral-300 rounded-sm outline-hidden"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-1 bg-[#2383E2] text-white text-xs rounded-sm font-medium"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-1.5 py-1 text-xs text-neutral-500"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 p-1 rounded-sm hover:bg-neutral-100 transition-colors w-full"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-400" />
            <span>New page</span>
          </button>
        )}
      </div>
    </div>
  );
};
