import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { GoalItem, GoalStatus } from '../../types';
import { CircularProgress } from '../common/CircularProgress';
import {
  Target,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
  Trash2,
  Calendar,
} from 'lucide-react';

const COLUMNS: { id: GoalStatus; label: string; dotColor: string }[] = [
  { id: 'not_started', label: 'Not started', dotColor: 'bg-neutral-400' },
  { id: 'in_progress', label: 'In progress', dotColor: 'bg-blue-500' },
  { id: 'done', label: 'Done', dotColor: 'bg-emerald-500' },
];

export const GoalsBoard: React.FC = () => {
  const { goals, updateGoalProgress, updateGoalStatus, deleteGoal, openModal, addGoal } = useLifeOS();
  const [quickColumn, setQuickColumn] = useState<GoalStatus | null>(null);
  const [quickTitle, setQuickTitle] = useState('');

  const handleQuickAdd = (status: GoalStatus) => {
    if (!quickTitle.trim()) return;
    addGoal({
      title: quickTitle.trim(),
      status,
      progress: status === 'done' ? 100 : status === 'in_progress' ? 25 : 0,
      category: 'Personal',
    });
    setQuickTitle('');
    setQuickColumn(null);
  };

  const handleProgressIncrement = (goal: GoalItem) => {
    let next = goal.progress + 25;
    if (next > 100) next = 0;
    updateGoalProgress(goal.id, next);
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200/70 shadow-2xs overflow-hidden select-none">
      {/* Header matching screenshot */}
      <div className="px-4 pt-3 pb-2 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-neutral-800 mr-2">
            Goals
          </h2>
          <div className="px-2.5 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-md">
            Goals
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
            <Search className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
            <Filter className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          {/* Blue Notion New Button */}
          <button
            onClick={() => openModal('goal')}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-[#2383E2] hover:bg-[#1B74C9] rounded-md shadow-2xs transition-colors ml-1"
          >
            <span>New</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>
        </div>
      </div>

      {/* Kanban Board Columns matching Notion */}
      <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#FAF9F7]/40">
        {COLUMNS.map((col) => {
          const colGoals = goals.filter((g) => g.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-neutral-100/50 rounded-lg p-2 flex flex-col min-h-[220px] border border-neutral-200/40"
            >
              {/* Column Title with count tag */}
              <div className="flex items-center justify-between px-1.5 py-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                  <span className="text-xs font-medium text-neutral-700">
                    {col.label}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono-nums">
                    {colGoals.length}
                  </span>
                </div>
              </div>

              {/* Goal Cards */}
              <div className="space-y-2 flex-1">
                {colGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-3 bg-white hover:bg-neutral-50/90 border border-neutral-200/70 rounded-md shadow-2xs transition-all group relative cursor-pointer"
                    onClick={() => handleProgressIncrement(goal)}
                    title="Click to advance progress (+25%)"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-xs font-medium text-neutral-800 leading-snug line-clamp-2">
                        {goal.title}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteGoal(goal.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-400 hover:text-rose-600 transition-opacity"
                        title="Delete goal"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Progress row */}
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono-nums mt-1">
                      <div className="flex items-center gap-1.5">
                        <CircularProgress
                          progress={goal.progress}
                          size={15}
                          strokeWidth={2}
                          color={goal.progress === 100 ? '#10B981' : '#3B82F6'}
                        />
                        <span>{goal.progress}%</span>
                      </div>

                      {goal.targetDate && (
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{goal.targetDate.slice(5)}</span>
                        </div>
                      )}
                    </div>

                    {/* Status switcher row on hover */}
                    <div
                      className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Move to:</span>
                      <div className="flex items-center gap-1">
                        {COLUMNS.filter((c) => c.id !== goal.status).map((targetCol) => (
                          <button
                            key={targetCol.id}
                            onClick={() => updateGoalStatus(goal.id, targetCol.id)}
                            className="px-1.5 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xs text-[10px] transition-colors"
                          >
                            {targetCol.label.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* + New page button at bottom of column */}
              {quickColumn === col.id ? (
                <div className="mt-2 p-1.5 bg-white border border-neutral-200 rounded-md">
                  <input
                    type="text"
                    placeholder="Goal title..."
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    className="w-full text-xs p-1 outline-hidden"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <button
                      onClick={() => setQuickColumn(null)}
                      className="px-2 py-0.5 text-[10px] text-neutral-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleQuickAdd(col.id)}
                      className="px-2 py-0.5 text-[10px] bg-[#2383E2] text-white rounded-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setQuickColumn(col.id);
                    setQuickTitle('');
                  }}
                  className="mt-2 flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 p-1.5 rounded-md hover:bg-neutral-200/50 transition-colors w-full text-left"
                >
                  <Plus className="w-3.5 h-3.5 text-neutral-400" />
                  <span>New page</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
