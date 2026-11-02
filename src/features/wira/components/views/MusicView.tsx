import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Search,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  playlist: "Deep Work" | "Lo-Fi Beats" | "Klasik & Piano" | "Synthwave Sprint" | "Nature Ambient";
  duration: string;
  durationSeconds: number;
  bpm: number;
  energy: "Low" | "Medium" | "High";
  coverUrl: string;
  isLiked: boolean;
}

const INITIAL_TRACKS: MusicTrack[] = [
  {
    id: "track-1",
    title: "Alpha State Concentration (432Hz)",
    artist: "Brainwave Acoustics",
    album: "Binaural Flow Suite",
    playlist: "Deep Work",
    duration: "4:30",
    durationSeconds: 270,
    bpm: 60,
    energy: "Low",
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80",
    isLiked: true,
  },
  {
    id: "track-2",
    title: "Financial Model Midnight Oil",
    artist: "Komorebi Beats",
    album: "Tokyo Workspace Vol. 4",
    playlist: "Lo-Fi Beats",
    duration: "2:45",
    durationSeconds: 165,
    bpm: 78,
    energy: "Medium",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    isLiked: true,
  },
  {
    id: "track-3",
    title: "Nuvole Bianche - Reflection Suite",
    artist: "Elysian Ensemble",
    album: "Minimalist Piano Harmonies",
    playlist: "Klasik & Piano",
    duration: "5:12",
    durationSeconds: 312,
    bpm: 64,
    energy: "Low",
    coverUrl: "https://images.unsplash.com/photo-1520523839898-50712825e3a7?auto=format&fit=crop&w=600&q=80",
    isLiked: false,
  },
  {
    id: "track-4",
    title: "Cybernetic Velocity (Overdrive)",
    artist: "Neon Circuit",
    album: "Sprint Deadline 2026",
    playlist: "Synthwave Sprint",
    duration: "3:50",
    durationSeconds: 230,
    bpm: 128,
    energy: "High",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    isLiked: true,
  },
  {
    id: "track-5",
    title: "Rainfall Over Bamboo Forest",
    artist: "Earth Soundscapes Lab",
    album: "Natural Biophony",
    playlist: "Nature Ambient",
    duration: "6:20",
    durationSeconds: 380,
    bpm: 50,
    energy: "Low",
    coverUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
    isLiked: false,
  },
  {
    id: "track-6",
    title: "Coffee Steam & Keyboard Clicks",
    artist: "Chilled Cow Studio",
    album: "Study With Me",
    playlist: "Lo-Fi Beats",
    duration: "3:10",
    durationSeconds: 190,
    bpm: 82,
    energy: "Medium",
    coverUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    isLiked: false,
  },
];

export function MusicView() {
  const [tracks, setTracks] = useState<MusicTrack[]>(() => {
    try {
      const saved = localStorage.getItem("aio_music_tracks_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_TRACKS;
  });

  const [currentTrackId, setCurrentTrackId] = useState<string>(tracks[0]?.id || "track-1");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressSec, setProgressSec] = useState<number>(45);
  const [volume, setVolume] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("Semua");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New track form
  const [newTrack, setNewTrack] = useState({
    title: "",
    artist: "",
    album: "",
    playlist: "Deep Work" as MusicTrack["playlist"],
    duration: "3:30",
    bpm: 72,
    energy: "Low" as MusicTrack["energy"],
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80",
  });

  // Audio synthesis reference for ambient background sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem("aio_music_tracks_v1", JSON.stringify(tracks));
    } catch (e) {
      console.error("Failed to save tracks", e);
    }
  }, [tracks]);

  // Player progress simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Ambient sound generator when playing
  useEffect(() => {
    if (isPlaying) {
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            audioCtxRef.current = new AudioContextClass();
          }
        }
        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }

        if (audioCtxRef.current && !oscRef.current) {
          const ctx = audioCtxRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(108, ctx.currentTime); // Low warm theta tone

          const volVal = isMuted ? 0 : (volume / 100) * 0.04;
          gain.gain.setValueAtTime(volVal, ctx.currentTime);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();

          oscRef.current = osc;
          gainRef.current = gain;
        } else if (gainRef.current && audioCtxRef.current) {
          const volVal = isMuted ? 0 : (volume / 100) * 0.04;
          gainRef.current.gain.setValueAtTime(volVal, audioCtxRef.current.currentTime);
        }
      } catch (err) {
        // audio context handling fallback
      }
    } else {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {}
        oscRef.current = null;
        gainRef.current = null;
      }
    }

    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {}
        oscRef.current = null;
        gainRef.current = null;
      }
    };
  }, [isPlaying, volume, isMuted]);

  const activeTrack = useMemo(() => {
    return tracks.find((t) => t.id === currentTrackId) || tracks[0];
  }, [tracks, currentTrackId]);

  const filteredTracks = useMemo(() => {
    return tracks.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q);
      const matchPlaylist =
        selectedPlaylist === "Semua" || t.playlist === selectedPlaylist;
      return matchSearch && matchPlaylist;
    });
  }, [tracks, searchQuery, selectedPlaylist]);

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isLiked: !t.isLiked } : t))
    );
  };

  const handleSelectTrack = (track: MusicTrack) => {
    if (currentTrackId === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrackId(track.id);
      setIsPlaying(true);
      setProgressSec(0);
    }
  };

  const handleNextTrack = () => {
    const idx = tracks.findIndex((t) => t.id === currentTrackId);
    const nextIdx = (idx + 1) % tracks.length;
    setCurrentTrackId(tracks[nextIdx].id);
    setProgressSec(0);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    const idx = tracks.findIndex((t) => t.id === currentTrackId);
    const prevIdx = (idx - 1 + tracks.length) % tracks.length;
    setCurrentTrackId(tracks[prevIdx].id);
    setProgressSec(0);
    setIsPlaying(true);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Hapus lagu ini dari daftar putar?")) {
      const updated = tracks.filter((t) => t.id !== id);
      setTracks(updated);
      if (currentTrackId === id && updated.length > 0) {
        setCurrentTrackId(updated[0].id);
      }
    }
  };

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleCreateTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrack.title.trim() || !newTrack.artist.trim()) {
      alert("Mohon masukkan judul lagu dan nama artis.");
      return;
    }

    const t: MusicTrack = {
      id: `track-${Date.now()}`,
      title: newTrack.title,
      artist: newTrack.artist,
      album: newTrack.album || "Custom Single",
      playlist: newTrack.playlist,
      duration: newTrack.duration,
      durationSeconds: 210,
      bpm: Number(newTrack.bpm) || 75,
      energy: newTrack.energy,
      coverUrl: newTrack.coverUrl,
      isLiked: false,
    };

    setTracks([t, ...tracks]);
    setShowAddModal(false);
    setNewTrack({
      title: "",
      artist: "",
      album: "",
      playlist: "Deep Work",
      duration: "3:30",
      bpm: 72,
      energy: "Low",
      coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full flex flex-col space-y-7 pb-36">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-500/10 text-teal-600 rounded-xl">
              <Music size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Music & Deep Work Station</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Stasiun audio fokus untuk sesi pemodelan finansial, penulisan proposal intensif, dan istirahat restoratif.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-teal-700 transition-colors shadow-md shadow-teal-600/20"
          >
            <Plus size={16} />
            <span>Tambah Lagu</span>
          </button>
        </div>
      </div>

      {/* Featured Vinyl / Player Hero Section */}
      {activeTrack && (
        <div className="bg-gradient-to-r from-teal-950 via-border to-border text-white rounded-3xl p-6 sm:p-8 border border-teal-900/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 z-10">
            {/* Spinning Disc Effect when Playing */}
            <div className="relative w-36 h-36 shrink-0 rounded-2xl overflow-hidden shadow-2xl group border border-border/10">
              <img
                src={activeTrack.coverUrl}
                alt={activeTrack.title}
                referrerPolicy="no-referrer"
                className={cn(
                  "w-full h-full object-cover transition-transform duration-700",
                  isPlaying ? "scale-105" : ""
                )}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-teal-500 hover:bg-teal-400 text-foreground flex items-center justify-center shadow-lg transition-transform active:scale-95"
                >
                  {isPlaying ? <Pause size={22} className="fill-current" /> : <Play size={22} className="ml-1 fill-current" />}
                </button>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  {activeTrack.playlist}
                </span>
                <span className="text-xs text-teal-200/80 font-mono">
                  {activeTrack.bpm} BPM • Energi {activeTrack.energy}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold leading-tight line-clamp-1">
                {activeTrack.title}
              </h2>
              <p className="text-sm text-teal-100/70 mt-1">
                {activeTrack.artist} — <span className="italic">{activeTrack.album}</span>
              </p>

              {/* Animated Equalizer Wave Bars when playing */}
              <div className="flex items-end gap-1 h-5 mt-4 justify-center sm:justify-start">
                {[40, 75, 100, 60, 85, 45, 90, 70, 95, 55, 80].map((h, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1 rounded-full bg-teal-400 transition-all duration-300",
                      isPlaying ? "animate-pulse" : "opacity-30"
                    )}
                    style={{
                      height: isPlaying ? `${Math.max(20, (h * ((i % 3) + 1)) % 100)}%` : "25%",
                    }}
                  />
                ))}
                <span className="text-[11px] text-teal-300 ml-2 font-mono">
                  {isPlaying ? "Active Audio Waveform" : "Player Siap"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={(e) => toggleLike(activeTrack.id, e)}
              className="p-3 rounded-full bg-card/10 hover:bg-card/20 text-white transition-colors"
              title="Sukai Trek Ini"
            >
              <Heart
                size={20}
                className={cn(
                  activeTrack.isLiked ? "fill-rose-500 text-rose-500" : ""
                )}
              />
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lagu, komposer, atau album..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-card border border-border text-foreground outline-hidden focus:border-teal-500 placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["Semua", "Deep Work", "Lo-Fi Beats", "Klasik & Piano", "Synthwave Sprint", "Nature Ambient"].map(
            (pl) => (
              <button
                key={pl}
                onClick={() => setSelectedPlaylist(pl)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap border",
                  selectedPlaylist === pl
                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                )}
              >
                {pl}
              </button>
            )
          )}
        </div>
      </div>

      {/* Tracks Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Daftar Trek Audio ({filteredTracks.length})
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            Tersukai: {tracks.filter((t) => t.isLiked).length}
          </span>
        </div>

        <div className="divide-y divide-border/60">
          {filteredTracks.map((track, idx) => {
            const isCurrent = currentTrackId === track.id;
            const isThisPlaying = isCurrent && isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => handleSelectTrack(track)}
                className={cn(
                  "p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 transition-colors cursor-pointer group",
                  isCurrent ? "bg-teal-500/5 font-medium" : "hover:bg-accent/40"
                )}
              >
                {/* Index & Cover */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <span className="text-xs text-muted-foreground w-4 text-center font-mono">
                    {idx + 1}
                  </span>

                  <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
                        isThisPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {isThisPlaying ? (
                        <Pause size={16} className="text-white fill-white" />
                      ) : (
                        <Play size={16} className="text-white fill-white ml-0.5" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={cn(
                        "text-sm font-bold truncate",
                        isCurrent ? "text-teal-600 dark:text-teal-400" : "text-foreground"
                      )}
                    >
                      {track.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                </div>

                {/* Playlist & Album (Desktop) */}
                <div className="hidden md:flex items-center gap-2 w-1/3 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-semibold text-muted-foreground shrink-0">
                    {track.playlist}
                  </span>
                  <span className="truncate">{track.album}</span>
                </div>

                {/* Duration & Like */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                  <span className="font-mono text-[11px]">{track.duration}</span>

                  <button
                    onClick={(e) => toggleLike(track.id, e)}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Heart
                      size={16}
                      className={cn(track.isLiked ? "fill-rose-500 text-rose-500" : "")}
                    />
                  </button>

                  <button
                    onClick={(e) => handleDelete(track.id, e)}
                    className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Music Bar */}
      {activeTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border p-3 sm:p-4 shadow-2xl">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left Track Info */}
            <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
              <img
                src={activeTrack.coverUrl}
                alt={activeTrack.title}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                  {activeTrack.title}
                </h4>
                <p className="text-[11px] text-muted-foreground truncate">{activeTrack.artist}</p>
              </div>
            </div>

            {/* Center Controls */}
            <div className="flex flex-col items-center gap-1 w-full sm:w-1/3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevTrack}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipBack size={18} />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward size={18} />
                </button>
              </div>

              {/* Scrubber */}
              <div className="flex items-center gap-2 w-full max-w-xs text-[10px] text-muted-foreground font-mono">
                <span>{formatSec(progressSec)}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-teal-600 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (progressSec / activeTrack.durationSeconds) * 100
                      )}%`,
                    }}
                  />
                </div>
                <span>{activeTrack.duration}</span>
              </div>
            </div>

            {/* Right Volume Controls */}
            <div className="hidden sm:flex items-center justify-end gap-3 w-1/3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setIsMuted(false);
                }}
                className="w-24 h-1.5 bg-muted rounded-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Track Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Music size={20} className="text-teal-600" />
                <h3 className="text-lg font-bold text-foreground">Tambah Trek Musik Baru</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Tutup ✕
              </button>
            </div>

            <form onSubmit={handleCreateTrack} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Judul Lagu *
                </label>
                <input
                  type="text"
                  required
                  value={newTrack.title}
                  onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                  placeholder="misal: Focus State Frequency"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Artis / Komposer *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTrack.artist}
                    onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
                    placeholder="misal: Max Richter"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Album / Single
                  </label>
                  <input
                    type="text"
                    value={newTrack.album}
                    onChange={(e) => setNewTrack({ ...newTrack, album: e.target.value })}
                    placeholder="misal: Sleep Piano"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Kategori Playlist
                  </label>
                  <select
                    value={newTrack.playlist}
                    onChange={(e) =>
                      setNewTrack({
                        ...newTrack,
                        playlist: e.target.value as MusicTrack["playlist"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-teal-500"
                  >
                    <option value="Deep Work">Deep Work</option>
                    <option value="Lo-Fi Beats">Lo-Fi Beats</option>
                    <option value="Klasik & Piano">Klasik & Piano</option>
                    <option value="Synthwave Sprint">Synthwave Sprint</option>
                    <option value="Nature Ambient">Nature Ambient</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Durasi
                  </label>
                  <input
                    type="text"
                    value={newTrack.duration}
                    onChange={(e) => setNewTrack({ ...newTrack, duration: e.target.value })}
                    placeholder="3:45"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    BPM
                  </label>
                  <input
                    type="number"
                    value={newTrack.bpm}
                    onChange={(e) => setNewTrack({ ...newTrack, bpm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-border hover:bg-muted text-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/20"
                >
                  Simpan Lagu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
