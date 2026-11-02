import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { TaskItem, PriorityLevel } from '../../types';
import {
  CheckSquare,
  Square,
  Calendar,
  Filter,
  ArrowUpDown,
  Search,
  Plus,
  Zap,
  MoreHorizontal,
  ChevronDown,
  Trash2,
} from 'lucide-react';

type TaskViewTab = 'todo' | 'due' | 'completed' | 'week';

export const TasksDatabase: React.FC = () => {
  const { tasks, toggleTask, deleteTask, openModal, searchQuery } = useLifeOS();
  const [activeTab, setActiveTab] = useState<TaskViewTab>('todo');
  const [localSearch, setLocalSearch] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [isAddingQuick, setIsAddingQuick] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Global and local search filter
      const term = (searchQuery || localSearch).toLowerCase().trim();
      if (term) {
        const matchesName = task.name.toLowerCase().includes(term);
        const matchesCat = task.category.toLowerCase().includes(term);
        if (!matchesName && !matchesCat) return false;
      }

      // Tab filtering
      if (activeTab === 'todo') {
        return !task.completed;
      }
      if (activeTab === 'completed') {
        return task.completed;
      }
      if (activeTab === 'due') {
        // Due today or soon
        return !task.completed && !!task.dueDate;
      }
      if (activeTab === 'week') {
        return true;
      }
      return true;
    });
  }, [tasks, activeTab, searchQuery, localSearch]);

  const { addTask } = useLifeOS();

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({
      name: quickTitle.trim(),
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      category: 'General',
      completed: false,
    });
    setQuickTitle('');
    setIsAddingQuick(false);
  };

  const getPriorityStyle = (priority: PriorityLevel) => {
    switch (priority) {
      case 'High':
        return 'text-rose-700 bg-rose-50 border-rose-200/60';
      case 'Medium':
        return 'text-amber-700 bg-amber-50 border-amber-200/60';
      case 'Low':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200/60';
      default:
        return 'text-neutral-600 bg-neutral-100 border-neutral-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200/70 shadow-2xs overflow-hidden select-none">
      {/* Top Header & View Tabs matching Notion */}
      <div className="px-4 pt-3 pb-2 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-semibold text-neutral-800 flex items-center gap-1.5 mr-2">
            <span>Tasks</span>
          </h2>

          {/* Segmented View Tabs */}
          <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('todo')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'todo'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <span>To-Do</span>
              <span className="text-[10px] text-neutral-400 font-mono-nums">
                ({tasks.filter((t) => !t.completed).length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('due')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'due'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <Calendar className="w-3 h-3 text-neutral-400" />
              <span>Due</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'completed'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <span>✓ Completed</span>
              <span className="text-[10px] text-neutral-400 font-mono-nums">
                ({tasks.filter((t) => t.completed).length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('week')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'week'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <span>This Week</span>
            </button>
          </div>
        </div>

        {/* Right Action Icons matching screenshot */}
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
            title="Search tasks"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          <button
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
            title="Filter"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>

          <button
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
            title="Sort"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          {/* Blue Notion "+ New ▾" button matching screenshot */}
          <button
            onClick={() => openModal('task')}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-[#2383E2] hover:bg-[#1B74C9] rounded-md shadow-2xs transition-colors ml-1"
          >
            <span>New</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>
        </div>
      </div>

      {/* Optional In-Table Search Input */}
      {showSearchInput && (
        <div className="px-4 py-1.5 bg-neutral-50/70 border-b border-neutral-100 flex items-center gap-2 text-xs">
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Filter tasks by name or category..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-transparent outline-hidden text-neutral-700 placeholder:text-neutral-400 text-xs"
            autoFocus
          />
        </div>
      )}

      {/* Database Table Headers */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-200/60 bg-neutral-50/40 text-neutral-500 font-medium">
              <th className="py-2 px-3 w-8 text-center">
                <Square className="w-3.5 h-3.5 text-neutral-300 mx-auto" />
              </th>
              <th className="py-2 px-3 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-neutral-400">Aa</span>
                  <span>Name</span>
                </span>
              </th>
              <th className="py-2 px-3 font-medium w-32 hidden sm:table-cell">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  <span>Date</span>
                </span>
              </th>
              <th className="py-2 px-3 font-medium w-28">
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-400">⊙</span>
                  <span>Priority Level</span>
                </span>
              </th>
              <th className="py-2 px-2 w-8 text-right text-neutral-300">
                <MoreHorizontal className="w-3.5 h-3.5 ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-neutral-400 text-xs">
                  No tasks found in this view. Click "+ New page" to create one.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="group hover:bg-[#F7F7F5] transition-colors"
                >
                  {/* Checkbox column */}
                  <td className="py-2 px-3 text-center align-middle">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="text-neutral-400 hover:text-neutral-700 transition-colors p-0.5"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-3.5 h-3.5 text-[#2383E2]" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600" />
                      )}
                    </button>
                  </td>

                  {/* Task Name */}
                  <td className="py-2 px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          task.completed
                            ? 'line-through text-neutral-400'
                            : 'text-neutral-800'
                        }`}
                      >
                        {task.name}
                      </span>
                      {task.notes && (
                        <span className="text-[10px] text-neutral-400 truncate max-w-[150px] hidden md:inline">
                          — {task.notes}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="py-2 px-3 text-neutral-500 font-mono-nums text-[11px] align-middle hidden sm:table-cell">
                    {task.dueDate ? (
                      <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </td>

                  {/* Priority Tag */}
                  <td className="py-2 px-3 align-middle">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getPriorityStyle(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-2 px-2 text-right align-middle">
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-600 transition-all rounded-sm"
                      title="Delete task"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom bar matching Notion '+ New page' */}
      <div className="p-2 border-t border-neutral-100 bg-[#FAF9F7]/50 flex items-center justify-between text-xs text-neutral-500">
        {isAddingQuick ? (
          <form onSubmit={handleQuickAdd} className="flex-1 flex items-center gap-2 px-1">
            <Plus className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <input
              type="text"
              placeholder="Task name..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              className="flex-1 bg-white px-2 py-1 border border-neutral-300 rounded-sm text-xs outline-hidden"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-[#2383E2] text-white text-[11px] font-medium rounded-sm"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddingQuick(false)}
              className="px-2 py-1 text-neutral-500 hover:text-neutral-700 text-[11px]"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddingQuick(true)}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors py-0.5 px-1.5 rounded-sm hover:bg-neutral-100"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-400" />
              <span>New page</span>
            </button>
            <button className="text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors hidden sm:inline">
              ≡ Edit filters
            </button>
          </div>
        )}

        <div className="text-[11px] text-neutral-400 font-mono-nums pr-2">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>
    </div>
  );
};
