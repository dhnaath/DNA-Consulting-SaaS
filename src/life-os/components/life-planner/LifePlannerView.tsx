import React, { useRef } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { TasksDatabase } from './TasksDatabase';
import { FinanceTable } from './FinanceTable';
import { GoalsBoard } from './GoalsBoard';
import { HabitTracker } from './HabitTracker';
import { MonthMetricsWidget } from './MonthMetricsWidget';
import { TodayJournalWidget } from './TodayJournalWidget';
import { useLifeOS } from '../../context/LifeOSContext';

export const LifePlannerView: React.FC = () => {
  const tasksRef = useRef<HTMLDivElement>(null);
  const financeRef = useRef<HTMLDivElement>(null);
  const habitsRef = useRef<HTMLDivElement>(null);
  const goalsRef = useRef<HTMLDivElement>(null);
  const journalRef = useRef<HTMLDivElement>(null);

  const handleScrollTo = (section: string) => {
    const map: Record<string, React.RefObject<HTMLDivElement | null>> = {
      tasks: tasksRef,
      finance: financeRef,
      habits: habitsRef,
      goals: goalsRef,
      journal: journalRef,
    };
    const target = map[section]?.current;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 transition-all">
      {/* 3-Column Layout matching Screenshot 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Sidebar + Budgets) */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-6">
          <LeftSidebar onSelectSection={handleScrollTo} />
        </div>

        {/* Center Main Column (Tasks, Finance, Goals) */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-6">
          {/* Tasks Database */}
          <div ref={tasksRef} id="section-tasks">
            <TasksDatabase />
          </div>

          {/* Finance Database */}
          <div ref={financeRef} id="section-finance">
            <FinanceTable />
          </div>

          {/* Goals Kanban Board */}
          <div ref={goalsRef} id="section-goals">
            <GoalsBoard />
          </div>
        </div>

        {/* Right Column (Habits, Month Metrics, Journal) */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-6">
          {/* Habit Tracker */}
          <div ref={habitsRef} id="section-habits">
            <HabitTracker />
          </div>

          {/* Month Metrics */}
          <MonthMetricsWidget />

          {/* Today's Journal */}
          <div ref={journalRef} id="section-journal">
            <TodayJournalWidget />
          </div>
        </div>
      </div>
    </div>
  );
};
