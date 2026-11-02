import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Play,
  Square,
  Plus,
  ListTodo,
  FileText,
  BookmarkCheck,
  Search,
  Filter,
  Layers,
  ExternalLink,
  UserCheck,
  UserX,
  Trash2,
  BarChart3,
} from "lucide-react";
import { useMeetingStore } from "./store";
import { ActionItemStatus, AgendaStatus, ParticipantRole } from "./types";
import { useShellSections } from "@/app/shell-sections";
import { ShellHeader } from "@/app/shell-header";

type ViewTab = "detail" | "upcoming" | "actions" | "decisions" | "series" | "stats";

export function MeetingManagerApp() {
  const {
    meetings,
    series,
    selectedMeetingId,
    setSelectedMeetingId,
    createMeeting,
    startMeeting,
    endMeeting,
    addAgendaItem,
    updateAgendaStatus,
    addNote,
    deleteNote,
    addDecision,
    deleteDecision,
    addActionItem,
    updateActionItemStatus,
    convertActionToTask,
    toggleParticipantAttendance,
    addParticipant,
  } = useMeetingStore();

  const [activeTab, setActiveTab] = useState<ViewTab>("detail");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // New Meeting Modal
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStartTime, setNewStartTime] = useState("2026-09-25T10:00");
  const [newEndTime, setNewEndTime] = useState("2026-09-25T11:00");
  const [newLocation, setNewLocation] = useState("Meeting Room Virtual");
  const [newSeriesId, setNewSeriesId] = useState("");

  // Live note / decision / action inputs
  const [newNoteText, setNewNoteText] = useState("");
  const [newDecisionText, setNewDecisionText] = useState("");
  const [newDecisionRationale, setNewDecisionRationale] = useState("");
  const [newActionText, setNewActionText] = useState("");
  const [newActionAssignee, setNewActionAssignee] = useState("");
  const [newActionDueDate, setNewActionDueDate] = useState("2026-09-28");
  const [newAgendaTopic, setNewAgendaTopic] = useState("");
  const [newAgendaMins, setNewAgendaMins] = useState(15);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [newParticipantRole, setNewParticipantRole] = useState<ParticipantRole>("required");

  // Active meeting
  const currentMeeting = useMemo(() => {
    return meetings.find((m) => m.id === selectedMeetingId) || meetings[0] || null;
  }, [meetings, selectedMeetingId]);

  // Filtered meetings
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      const matchSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.notes.some((n) => n.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.decisions.some((d) => d.statement.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [meetings, searchQuery, statusFilter]);

  // Statistics calculation per spec
  const stats = useMemo(() => {
    const totalMeetings = meetings.length;
    const completed = meetings.filter((m) => m.status === "completed").length;
    const allActions = meetings.flatMap((m) => m.actionItems);
    const totalActions = allActions.length;
    const doneActions = allActions.filter((a) => a.status === "done").length;
    const actionCompletionRate = totalActions > 0 ? Math.round((doneActions / totalActions) * 100) : 0;

    const allDecisions = meetings.flatMap((m) => m.decisions);
    const avgDecisions = totalMeetings > 0 ? (allDecisions.length / totalMeetings).toFixed(1) : "0";

    const allParticipants = meetings.flatMap((m) => m.participants);
    const attendedCount = allParticipants.filter((p) => p.attended).length;
    const attendanceRate = allParticipants.length > 0 ? Math.round((attendedCount / allParticipants.length) * 100) : 0;

    const overdueActions = allActions.filter((a) => {
      if (a.status === "done" || a.status === "cancelled" || !a.dueDate) return false;
      return new Date(a.dueDate) < new Date("2026-09-24");
    }).length;

    return {
      totalMeetings,
      completed,
      totalActions,
      doneActions,
      actionCompletionRate,
      totalDecisions: allDecisions.length,
      avgDecisions,
      attendanceRate,
      overdueActions,
    };
  }, [meetings]);

  useShellSections([
    { id: "detail", label: "Meeting Workspace", icon: FileText, active: activeTab === "detail", onSelect: () => setActiveTab("detail") },
    { id: "upcoming", label: `All Meetings (${meetings.length})`, icon: Calendar, active: activeTab === "upcoming", onSelect: () => setActiveTab("upcoming") },
    { id: "actions", label: `Action Items (${stats.totalActions})`, icon: ListTodo, active: activeTab === "actions", onSelect: () => setActiveTab("actions") },
    { id: "decisions", label: "Decision Log", icon: BookmarkCheck, active: activeTab === "decisions", onSelect: () => setActiveTab("decisions") },
    { id: "series", label: "Series", icon: Layers, active: activeTab === "series", onSelect: () => setActiveTab("series") },
    { id: "stats", label: "Analytics", icon: BarChart3, active: activeTab === "stats", onSelect: () => setActiveTab("stats") },
  ]);

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createMeeting({
      title: newTitle,
      status: "scheduled",
      scheduledStartTime: new Date(newStartTime).toISOString(),
      scheduledEndTime: new Date(newEndTime).toISOString(),
      location: newLocation,
      seriesId: newSeriesId || undefined,
      agendaItems: [
        { id: `ag-${Date.now()}-1`, meetingId: "", order: 1, topic: "Opening & Alignment", status: "pending", estimatedMinutes: 10 },
        { id: `ag-${Date.now()}-2`, meetingId: "", order: 2, topic: "Core Discussion Items", status: "pending", estimatedMinutes: 30 },
      ],
      notes: [],
      decisions: [],
      actionItems: [],
      participants: [
        { id: `p-${Date.now()}`, meetingId: "", personId: "u-self", name: "You (Organizer)", role: "organizer", attended: true },
      ],
    });

    setNewTitle("");
    setIsNewMeetingOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header Actions in Floating Pill */}
      <ShellHeader>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* View Tab Switchers - Compact Segmented Icon Pills */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            {[
              { id: "detail", label: "Meeting Workspace", icon: FileText },
              { id: "upcoming", label: `All Meetings (${meetings.length})`, icon: Calendar },
              { id: "actions", label: `Action Items (${stats.totalActions})`, icon: ListTodo },
              { id: "decisions", label: "Decision Log", icon: BookmarkCheck },
              { id: "series", label: "Series", icon: Layers },
              { id: "stats", label: "Analytics", icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ViewTab)}
                  title={tab.label}
                  aria-label={tab.label}
                  className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsNewMeetingOpen(true)}
            title="Jadwalkan Meeting Baru"
            aria-label="Schedule Meeting"
            className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Top Header Bar */}
      <div className="border-b border-border bg-background/70 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              #19 Meeting Manager
            </span>
            <span className="text-xs text-muted-foreground">Structured Meeting Lifecycle • Before, During & After</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-3">
            Meeting Manager
            {currentMeeting && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                currentMeeting.status === "in_progress"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                  : currentMeeting.status === "completed"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              }`}>
                {currentMeeting.status === "in_progress" ? "● LIVE IN PROGRESS" : currentMeeting.status.toUpperCase()}
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-auto p-6">
        {/* TAB 1: WORKSPACE / DETAIL */}
        {activeTab === "detail" && currentMeeting && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Meeting Info, Agenda, Participants */}
            <div className="lg:col-span-4 space-y-6">
              {/* Meeting Selector / Summary Card */}
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Current Session</span>
                  <div className="flex items-center gap-2">
                    {currentMeeting.status !== "in_progress" && currentMeeting.status !== "completed" && (
                      <button
                        onClick={() => startMeeting(currentMeeting.id)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs font-semibold transition"
                      >
                        <Play className="w-3.5 h-3.5" /> Start Meeting
                      </button>
                    )}
                    {currentMeeting.status === "in_progress" && (
                      <button
                        onClick={() => endMeeting(currentMeeting.id)}
                        className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3 py-1 rounded text-xs font-semibold transition"
                      >
                        <Square className="w-3.5 h-3.5" /> End Meeting
                      </button>
                    )}
                  </div>
                </div>

                <h2 className="text-lg font-bold text-white mb-2">{currentMeeting.title}</h2>

                <div className="space-y-2 text-xs text-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>
                      {new Date(currentMeeting.scheduledStartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                      {new Date(currentMeeting.scheduledEndTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {currentMeeting.location && (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 flex items-center justify-center font-bold text-indigo-400">@</span>
                      <span>{currentMeeting.location}</span>
                    </div>
                  )}
                  {currentMeeting.eventId && (
                    <div className="flex items-center gap-2 text-indigo-400">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Linked Calendar Event: #{currentMeeting.eventId}</span>
                    </div>
                  )}
                </div>

                {/* Switch meeting quick dropdown */}
                <div className="mt-4 pt-4 border-t border-border">
                  <label className="text-xs text-muted-foreground block mb-1">Switch Active Meeting:</label>
                  <select
                    value={currentMeeting.id}
                    onChange={(e) => setSelectedMeetingId(e.target.value)}
                    className="w-full bg-foreground border border-border text-xs rounded-lg px-2.5 py-1.5 text-background"
                  >
                    {meetings.map((m) => (
                      <option key={m.id} value={m.id}>
                        [{m.status}] {m.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Agenda (Before Phase) */}
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <h3 className="font-semibold text-sm text-white">1. Agenda (Before)</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">{currentMeeting.agendaItems.length} topics</span>
                </div>

                <div className="space-y-2 mb-4">
                  {currentMeeting.agendaItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 bg-card/60 border border-border/50 rounded-lg flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-indigo-400 font-bold">#{idx + 1}</span>
                          <span className="font-medium text-foreground">{item.topic}</span>
                        </div>
                        {item.ownerName && (
                          <div className="text-muted-foreground text-[11px]">Led by: {item.ownerName} ({item.estimatedMinutes || 15}m)</div>
                        )}
                      </div>
                      <select
                        value={item.status}
                        onChange={(e) => updateAgendaStatus(currentMeeting.id, item.id, e.target.value as AgendaStatus)}
                        className={`text-[11px] rounded px-1.5 py-0.5 border ${
                          item.status === "discussed"
                            ? "bg-emerald-950/60 border-emerald-700 text-emerald-300"
                            : item.status === "skipped"
                            ? "bg-card border-border text-muted-foreground"
                            : "bg-blue-950/60 border-blue-700 text-blue-300"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="discussed">Discussed</option>
                        <option value="skipped">Skipped</option>
                        <option value="deferred">Deferred</option>
                      </select>
                    </div>
                  ))}
                </div>

                {/* Add Agenda Item */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New agenda topic..."
                    value={newAgendaTopic}
                    onChange={(e) => setNewAgendaTopic(e.target.value)}
                    className="flex-1 bg-foreground border border-border rounded-lg px-2.5 py-1.5 text-xs text-background"
                  />
                  <input
                    type="number"
                    value={newAgendaMins}
                    onChange={(e) => setNewAgendaMins(Number(e.target.value))}
                    className="w-14 bg-foreground border border-border rounded-lg px-2 py-1.5 text-xs text-center text-background"
                    title="Estimated minutes"
                  />
                  <button
                    onClick={() => {
                      if (!newAgendaTopic.trim()) return;
                      addAgendaItem(currentMeeting.id, {
                        order: currentMeeting.agendaItems.length + 1,
                        topic: newAgendaTopic,
                        estimatedMinutes: newAgendaMins,
                        status: "pending",
                      });
                      setNewAgendaTopic("");
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Participants */}
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    Participants & Attendance
                  </h3>
                  <span className="text-xs text-indigo-400 font-medium">
                    {currentMeeting.participants.filter((p) => p.attended).length}/{currentMeeting.participants.length} Present
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {currentMeeting.participants.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => toggleParticipantAttendance(currentMeeting.id, p.personId)}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-card/60 hover:bg-card cursor-pointer border border-border/50 transition text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {p.attended ? (
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <UserX className="w-4 h-4 text-muted-foreground" />
                        )}
                        <div>
                          <div className={`font-medium ${p.attended ? "text-white" : "text-muted-foreground line-through"}`}>
                            {p.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{p.role}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        p.attended ? "bg-emerald-500/20 text-emerald-300" : "bg-card text-muted-foreground"
                      }`}>
                        {p.attended ? "Attended" : "Absent"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add participant */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Participant name..."
                    value={newParticipantName}
                    onChange={(e) => setNewParticipantName(e.target.value)}
                    className="flex-1 bg-foreground border border-border rounded-lg px-2.5 py-1.5 text-xs text-background"
                  />
                  <select
                    value={newParticipantRole}
                    onChange={(e) => setNewParticipantRole(e.target.value as ParticipantRole)}
                    className="bg-foreground border border-border text-xs rounded-lg px-2 py-1.5 text-background"
                  >
                    <option value="required">Required</option>
                    <option value="optional">Optional</option>
                    <option value="notetaker">Notetaker</option>
                  </select>
                  <button
                    onClick={() => {
                      if (!newParticipantName.trim()) return;
                      addParticipant(currentMeeting.id, {
                        personId: `usr-${Date.now()}`,
                        name: newParticipantName,
                        role: newParticipantRole,
                        attended: true,
                      });
                      setNewParticipantName("");
                    }}
                    className="bg-foreground hover:bg-muted-foreground/30 text-background px-3 py-1.5 rounded-lg text-xs"
                  >
                    Invite
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Notes (During), Decisions, Action Items (After) */}
            <div className="lg:col-span-8 space-y-6">
              {/* During: Real-Time Notes & Discussions */}
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      2. Live Meeting Notes (During)
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground">{currentMeeting.notes.length} note entries</span>
                </div>

                <div className="flex gap-2 mb-4">
                  <textarea
                    rows={2}
                    placeholder="Type live notes, discussions, points raised during meeting..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 bg-foreground border border-border rounded-lg p-2.5 text-xs text-background placeholder-muted-foreground focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => {
                      if (!newNoteText.trim()) return;
                      addNote(currentMeeting.id, {
                        content: newNoteText,
                        authorId: "u-self",
                        authorName: "You",
                      });
                      setNewNoteText("");
                    }}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-semibold self-end"
                  >
                    Add Note
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {currentMeeting.notes.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-xs italic">
                      No live notes taken yet. Use the box above during the meeting.
                    </div>
                  ) : (
                    currentMeeting.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-lg bg-card/50 border border-border/60 flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="text-foreground whitespace-pre-wrap">{note.content}</div>
                          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
                            <span className="font-medium text-amber-400">{note.authorName}</span>
                            <span>•</span>
                            <span>{note.timestamp}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteNote(currentMeeting.id, note.id)}
                          className="text-muted-foreground hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* During: Explicit Decisions Log */}
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                      <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                      Explicit Decisions (#84 Decision Journal Sync)
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">{currentMeeting.decisions.length} recorded</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4">
                  <div className="md:col-span-6">
                    <input
                      type="text"
                      placeholder="Decision statement (e.g. Approved architecture choice)..."
                      value={newDecisionText}
                      onChange={(e) => setNewDecisionText(e.target.value)}
                      className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-xs text-background"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      placeholder="Rationale / reason..."
                      value={newDecisionRationale}
                      onChange={(e) => setNewDecisionRationale(e.target.value)}
                      className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-xs text-background"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      onClick={() => {
                        if (!newDecisionText.trim()) return;
                        addDecision(currentMeeting.id, {
                          statement: newDecisionText,
                          rationale: newDecisionRationale,
                          decidedBy: "All Stakeholders",
                        });
                        setNewDecisionText("");
                        setNewDecisionRationale("");
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-semibold"
                    >
                      Record
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {currentMeeting.decisions.map((dec) => (
                    <div
                      key={dec.id}
                      className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          {dec.statement}
                        </div>
                        {dec.rationale && (
                          <div className="text-foreground text-[11px] italic pl-5">Rationale: {dec.rationale}</div>
                        )}
                        <div className="text-[11px] text-muted-foreground pl-5">
                          Decided by: <span className="text-foreground">{dec.decidedBy}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteDecision(currentMeeting.id, dec.id)}
                        className="text-muted-foreground hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* After: Action Items & Task Manager Conversion */}
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                      <ListTodo className="w-4 h-4 text-purple-400" />
                      3. Action Items & Follow-up (After)
                    </h3>
                  </div>
                  <span className="text-xs text-purple-400 font-medium">
                    {currentMeeting.actionItems.filter((a) => a.status === "done").length}/{currentMeeting.actionItems.length} Resolved
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4">
                  <div className="md:col-span-5">
                    <input
                      type="text"
                      placeholder="Follow-up action item description..."
                      value={newActionText}
                      onChange={(e) => setNewActionText(e.target.value)}
                      className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-xs text-background"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      placeholder="Assignee (e.g. Andi Pratama)..."
                      value={newActionAssignee}
                      onChange={(e) => setNewActionAssignee(e.target.value)}
                      className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-xs text-background"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="date"
                      value={newActionDueDate}
                      onChange={(e) => setNewActionDueDate(e.target.value)}
                      className="w-full bg-foreground border border-border rounded-lg px-2 py-2 text-xs text-background"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      onClick={() => {
                        if (!newActionText.trim()) return;
                        addActionItem(currentMeeting.id, {
                          description: newActionText,
                          assigneeName: newActionAssignee || "Unassigned",
                          dueDate: newActionDueDate,
                          status: "open",
                        });
                        setNewActionText("");
                        setNewActionAssignee("");
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-xs font-semibold"
                    >
                      Assign Action
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {currentMeeting.actionItems.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-xs italic">
                      No action items created yet. Add deliverables or follow-ups for post-meeting execution.
                    </div>
                  ) : (
                    currentMeeting.actionItems.map((act) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-lg bg-card/60 border border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-medium text-foreground flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              act.status === "done" ? "bg-emerald-400" : act.status === "in_progress" ? "bg-amber-400" : "bg-purple-400"
                            }`} />
                            {act.description}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span>Assignee: <strong className="text-foreground">{act.assigneeName || "Unassigned"}</strong></span>
                            {act.dueDate && <span>Due: {act.dueDate}</span>}
                            {act.linkedTaskId && (
                              <span className="text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/30">
                                🔗 Task #{act.linkedTaskId}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={act.status}
                            onChange={(e) => updateActionItemStatus(currentMeeting.id, act.id, e.target.value as ActionItemStatus)}
                            className="bg-card border border-border text-xs rounded px-2 py-1 text-foreground"
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          {!act.linkedTaskId && (
                            <button
                              onClick={() => convertActionToTask(currentMeeting.id, act.id)}
                              className="flex items-center gap-1 bg-indigo-600/80 hover:bg-indigo-600 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition"
                              title="Convert to Task in Task Manager (#01)"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Convert to Task
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALL MEETINGS */}
        {activeTab === "upcoming" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-background p-4 rounded-xl border border-border">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search meetings by title, notes, decisions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-foreground border border-border rounded-lg px-3 py-1.5 text-xs text-background w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-foreground border border-border rounded-lg px-3 py-1.5 text-xs text-background"
                >
                  <option value="all">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMeetings.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMeetingId(m.id);
                    setActiveTab("detail");
                  }}
                  className="bg-background border border-border hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer transition shadow-sm space-y-4 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                      m.status === "in_progress"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : m.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    }`}>
                      {m.status}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {new Date(m.scheduledStartTime).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white group-hover:text-indigo-400 transition">{m.title}</h3>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{new Date(m.scheduledStartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    {m.location && <div className="truncate">📍 {m.location}</div>}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                    <span>{m.participants.length} attendees</span>
                    <span>{m.actionItems.length} action items</span>
                    <span>{m.decisions.length} decisions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ACTION ITEMS BOARD */}
        {activeTab === "actions" && (
          <div className="space-y-6">
            <div className="bg-background border border-border rounded-xl p-5">
              <h2 className="text-lg font-bold text-white mb-1">Cross-Meeting Action Items Board</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Every action item serves as a bridge to execution. Convert actions to formal Tasks in Task Manager (#01).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["open", "in_progress", "done"].map((colStatus) => {
                  const items = meetings.flatMap((m) =>
                    m.actionItems
                      .filter((a) => a.status === colStatus)
                      .map((act) => ({ ...act, meetingTitle: m.title, meetingId: m.id }))
                  );
                  return (
                    <div key={colStatus} className="bg-background/60 border border-border rounded-xl p-4 flex flex-col">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                        <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                          {colStatus.replace("_", " ")} ({items.length})
                        </span>
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          colStatus === "done" ? "bg-emerald-400" : colStatus === "in_progress" ? "bg-amber-400" : "bg-purple-400"
                        }`} />
                      </div>

                      <div className="space-y-3 flex-1 overflow-y-auto">
                        {items.length === 0 ? (
                          <div className="text-xs text-muted-foreground italic text-center py-8">No items</div>
                        ) : (
                          items.map((act) => (
                            <div
                              key={act.id}
                              className="bg-background border border-border hover:border-border p-3.5 rounded-lg space-y-2 text-xs"
                            >
                              <div className="font-medium text-foreground">{act.description}</div>
                              <div className="text-[11px] text-muted-foreground">From: {act.meetingTitle}</div>
                              <div className="flex items-center justify-between pt-2 border-t border-border/80 text-[11px]">
                                <span className="text-foreground">👤 {act.assigneeName}</span>
                                {act.dueDate && <span className="text-indigo-400">📅 {act.dueDate}</span>}
                              </div>

                              <div className="flex items-center justify-between pt-1">
                                {act.linkedTaskId ? (
                                  <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                                    Linked: #{act.linkedTaskId}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => convertActionToTask(act.meetingId, act.id)}
                                    className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-0.5 rounded font-semibold"
                                  >
                                    + Convert to Task
                                  </button>
                                )}

                                <select
                                  value={act.status}
                                  onChange={(e) =>
                                    updateActionItemStatus(act.meetingId, act.id, e.target.value as ActionItemStatus)
                                  }
                                  className="text-[10px] bg-card border border-border text-foreground rounded px-1.5 py-0.5"
                                >
                                  <option value="open">Open</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="done">Done</option>
                                </select>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DECISION LOG */}
        {activeTab === "decisions" && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Consolidated Decision Log</h2>
              <p className="text-xs text-muted-foreground">
                Audit trail of explicit decisions agreed upon in meetings. Can be referenced into Decision Journal (#84).
              </p>
            </div>

            <div className="space-y-3">
              {meetings.flatMap((m) =>
                m.decisions.map((dec) => ({ ...dec, meetingTitle: m.title, meetingId: m.id }))
              ).length === 0 ? (
                <div className="text-xs text-muted-foreground italic py-8 text-center">No decisions recorded yet.</div>
              ) : (
                meetings
                  .flatMap((m) => m.decisions.map((dec) => ({ ...dec, meetingTitle: m.title, meetingId: m.id })))
                  .map((dec) => (
                    <div
                      key={dec.id}
                      className="p-4 rounded-xl bg-card/40 border border-border/60 flex flex-wrap items-start justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="font-semibold text-sm text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          {dec.statement}
                        </div>
                        {dec.rationale && (
                          <div className="text-foreground pl-6 italic">Rationale: {dec.rationale}</div>
                        )}
                        <div className="flex items-center gap-4 pl-6 text-[11px] text-muted-foreground pt-1">
                          <span>Session: <strong className="text-foreground">{dec.meetingTitle}</strong></span>
                          <span>Decided by: <strong className="text-foreground">{dec.decidedBy}</strong></span>
                          <span>Timestamp: {new Date(dec.decidedAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">
                        Audited Decision
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: MEETING SERIES */}
        {activeTab === "series" && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Recurring Meeting Series</h2>
                <p className="text-xs text-muted-foreground">
                  Standardized cadences with pre-configured agenda templates and longitudinal action item tracking.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {series.map((s) => (
                <div key={s.id} className="bg-background border border-border rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {s.recurrence}
                    </span>
                    <span className="text-xs text-muted-foreground">{s.meetingIds.length} sessions tracked</span>
                  </div>

                  <h3 className="font-bold text-white text-base">{s.title}</h3>

                  <div>
                    <span className="text-xs text-muted-foreground font-semibold block mb-2">Default Agenda Template:</span>
                    <ul className="space-y-1.5">
                      {s.defaultAgendaTemplate?.map((tmpl, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-foreground bg-background p-2 rounded border border-border">
                          <span className="font-mono text-indigo-400 font-bold">#{idx + 1}</span>
                          <span>{tmpl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: STATISTICS */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Total Meetings</span>
                <div className="text-2xl font-bold text-white mt-1">{stats.totalMeetings}</div>
                <div className="text-[11px] text-emerald-400 mt-1">{stats.completed} sessions completed</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Action Completion</span>
                <div className="text-2xl font-bold text-purple-400 mt-1">{stats.actionCompletionRate}%</div>
                <div className="text-[11px] text-muted-foreground mt-1">{stats.doneActions} of {stats.totalActions} done</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Decisions / Meeting</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.avgDecisions}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{stats.totalDecisions} total decisions</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Attendance Rate</span>
                <div className="text-2xl font-bold text-blue-400 mt-1">{stats.attendanceRate}%</div>
                <div className="text-[11px] text-amber-400 mt-1">{stats.overdueActions} overdue actions</div>
              </div>
            </div>

            <div className="bg-background border border-border rounded-xl p-6">
              <h3 className="font-bold text-white text-base mb-2">Meeting Ecosystem Integration Architecture</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Meeting Manager (#19) maintains clear boundaries: Calendar (#02) owns scheduling and invitations;
                Task Manager (#01) executes converted Action Items; People Manager (#35) manages attendee contact profiles;
                and Decision Journal (#84) stores strategic long-term decisions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {isNewMeetingOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Schedule New Structured Meeting</h3>

            <form onSubmit={handleCreateMeeting} className="space-y-4 text-xs">
              <div>
                <label className="block text-foreground mb-1 font-medium">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Strategy Review"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground mb-1 font-medium">Start Time</label>
                  <input
                    type="datetime-local"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-1 font-medium">End Time</label>
                  <input
                    type="datetime-local"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground mb-1 font-medium">Location / Link</label>
                <input
                  type="text"
                  placeholder="e.g. Meeting Room 2 / Google Meet"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
              </div>

              <div>
                <label className="block text-foreground mb-1 font-medium">Recurring Series (Optional)</label>
                <select
                  value={newSeriesId}
                  onChange={(e) => setNewSeriesId(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                >
                  <option value="">None (One-off Meeting)</option>
                  {series.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.recurrence})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewMeetingOpen(false)}
                  className="px-4 py-2 rounded-lg bg-card hover:bg-card text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Create Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
