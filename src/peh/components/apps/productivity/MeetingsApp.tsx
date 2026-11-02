import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { MeetingItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const MeetingsApp: React.FC = () => {
  const { meetings, addMeeting, toggleMeetingActionItem, deleteMeeting, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [meetingTitle, setMeetingTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendeesText, setAttendeesText] = useState('');
  const [objective, setObjective] = useState('');
  const [keyDecisionsText, setKeyDecisionsText] = useState('');
  const [actionItemsText, setActionItemsText] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim() || !objective.trim()) return;

    const attendees = attendeesText
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const keyDecisions = keyDecisionsText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const actionItems = actionItemsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|').map((p) => p.trim());
        return {
          task: parts[0] || line,
          assignee: parts[1] || 'Tim',
          dueDate: parts[2] || new Date().toISOString().split('T')[0],
          isCompleted: false,
        };
      });

    addMeeting({
      meetingTitle: meetingTitle.trim(),
      date,
      attendees,
      objective: objective.trim(),
      keyDecisions,
      actionItems,
      durationMinutes: Number(durationMinutes) || 30,
      notes: notes.trim() || undefined,
    });

    setMeetingTitle('');
    setAttendeesText('');
    setObjective('');
    setKeyDecisionsText('');
    setActionItemsText('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const totalActionItems = meetings.reduce((acc, curr) => acc + curr.actionItems.length, 0);
  const completedActionItems = meetings.reduce(
    (acc, curr) => acc + curr.actionItems.filter((a) => a.isCompleted).length,
    0
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200 dark:border-amber-900/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Icon name="FileCheck" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              Notulensi & Keputusan Rapat
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Ringkasan objektif pertemuan, poin kesepakatan final, dan pelacak komitmen PIC.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tulis Notulensi Rapat</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-amber-200/60 dark:border-amber-900/40 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('meeting-list')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'meeting-list'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="FileText" size={14} />
          <span>Daftar Notulensi ({meetings.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('action-items')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'action-items'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="ListTodo" size={14} />
          <span>Action Items & PIC ({completedActionItems}/{totalActionItems})</span>
        </button>
      </div>

      {/* List */}
      {meetings.length === 0 ? (
        <EmptyState
          iconName="FileCheck"
          title="Belum Ada Notulensi Rapat"
          description="Arsip rapat Anda masih bersih tanpa data dummy. Catat ringkasan rapat internal tim, diskusi bersama klien, atau sesi evaluasi mingguan."
          actionLabel="Tulis Notulensi Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {meetings.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:border-amber-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-stone-400">📅 {m.date} ({m.durationMinutes} menit)</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white">{m.meetingTitle}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">🎯 <strong>Objektif:</strong> {m.objective}</p>
                </div>

                <button
                  onClick={() => deleteMeeting(m.id)}
                  className="self-end sm:self-auto p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Hapus notulensi"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>

              {/* Attendees */}
              {m.attendees.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
                  <span className="text-stone-500">Hadir:</span>
                  {m.attendees.map((att, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px]"
                    >
                      {att}
                    </span>
                  ))}
                </div>
              )}

              {/* Key Decisions */}
              {m.keyDecisions.length > 0 && (
                <div className="p-3 mb-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                    ⚡ Kesepakatan & Keputusan Final:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-700 dark:text-stone-300">
                    {m.keyDecisions.map((dec, idx) => (
                      <li key={idx}>{dec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Items Interactive Checklist */}
              {m.actionItems.length > 0 && (
                <div className="border-t border-stone-100 dark:border-stone-800 pt-3">
                  <span className="text-xs font-bold text-stone-900 dark:text-white block mb-2">
                    Action Items & Tanggung Jawab:
                  </span>
                  <div className="space-y-1.5">
                    {m.actionItems.map((act, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleMeetingActionItem(m.id, idx)}
                        className={`p-2 rounded-lg text-xs flex items-center justify-between border cursor-pointer transition-colors ${
                          act.isCompleted
                            ? 'bg-stone-50 dark:bg-stone-800/30 border-stone-200 text-stone-400 line-through'
                            : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={act.isCompleted}
                            readOnly
                            className="rounded text-amber-600 pointer-events-none"
                          />
                          <span>{act.task}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="font-semibold text-amber-700 dark:text-amber-300">{act.assignee}</span>
                          <span>(Due: {act.dueDate})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Meeting */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tulis Notulensi Rapat Baru">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Judul Rapat</label>
            <input
              type="text"
              required
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Contoh: All-Hands Mingguan, Kickoff Proyek Mobile App"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Tanggal</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Durasi (Menit)</label>
              <input
                type="number"
                min="5"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Tujuan / Objektif Utama Rapat</label>
            <input
              type="text"
              required
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Menentukan arsitektur backend dan pembagian modul Q4"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Daftar Hadir (Pisahkan dengan koma)</label>
            <input
              type="text"
              value={attendeesText}
              onChange={(e) => setAttendeesText(e.target.value)}
              placeholder="Budi, Siti, Andre, Clara"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Kesepakatan / Keputusan Final (Satu baris per keputusan)
            </label>
            <textarea
              rows={2}
              value={keyDecisionsText}
              onChange={(e) => setKeyDecisionsText(e.target.value)}
              placeholder="1. Memilih Postgres sebagai basis data utama&#10;2. Batas waktu rilis fase 1 pada 15 Oktober"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Action Items (Format: Tugas | PIC | Tenggat Tanggal)
            </label>
            <textarea
              rows={2}
              value={actionItemsText}
              onChange={(e) => setActionItemsText(e.target.value)}
              placeholder="Setup server dev | Budi | 2026-10-01&#10;Finalisasi UI wireframe | Siti | 2026-10-03"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
            >
              Simpan Notulensi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
