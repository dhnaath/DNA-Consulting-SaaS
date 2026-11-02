import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { Plus, ArrowDownLeft, ArrowUpRight, CheckSquare, BookOpen } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const { openModal } = useLifeOS();

  const actions = [
    { label: 'New Expense', icon: ArrowDownLeft, action: () => openModal('expense') },
    { label: 'New Income', icon: ArrowUpRight, action: () => openModal('income') },
    { label: 'New Task', icon: CheckSquare, action: () => openModal('task') },
    { label: 'New Journal', icon: BookOpen, action: () => openModal('journal') },
  ];

  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1 mb-2">
        Quick Actions
      </h3>
      <div className="space-y-1">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={act.action}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200/70 rounded-md shadow-2xs hover:border-neutral-300 transition-colors text-left group"
            >
              <span className="p-1 rounded-sm bg-neutral-100 text-neutral-500 group-hover:text-neutral-900 group-hover:bg-neutral-200 transition-colors">
                <Icon className="w-3 h-3" />
              </span>
              <span className="font-medium">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
