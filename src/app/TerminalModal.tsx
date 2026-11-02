import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Send, Loader2, RotateCcw, ChevronRight } from "lucide-react";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "system" | "user" | "output";
  text: string;
  time: string;
}

export function TerminalModal({ isOpen, onClose }: TerminalModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "system",
      text: "Terminal siap. Ketik perintah cepat: 'help', 'tugas', 'kas', atau 'jadwal'.",
      time: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, messages]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);

    // Evaluasi perintah terminal
    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (lower === "help" || lower === "?") {
        reply =
          "Daftar Perintah Terminal:\n• tugas / tasks : Tampilkan prioritas tugas aktif\n• kas / finance : Ringkasan kesehatan kas dan transaksi\n• jadwal / meeting : Tampilkan agenda terdekat\n• clear : Bersihkan layar terminal";
      } else if (lower === "clear" || lower === "cls") {
        setMessages([
          {
            id: `init-${Date.now()}`,
            sender: "system",
            text: "Layar terminal telah dibersihkan. Sistem siap menerima perintah baru.",
            time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsProcessing(false);
        return;
      } else if (lower.includes("tugas") || lower.includes("task")) {
        reply =
          "📋 Status Deliverable & Tugas Teratas:\n1. [Tinggi] Finalisasi Deck Presentasi Evaluasi Q4\n2. [Sedang] Rekonsiliasi Faktur Retainer Klien Utama\n3. [Normal] Review Analisis Arus Kas & Runway\n\nSemua tugas tersinkronisasi di Task Manager.";
      } else if (lower.includes("kas") || lower.includes("uang") || lower.includes("finance")) {
        reply =
          "💰 Ringkasan Arus Kas & Finansial:\n• Saldo Kas Operasional: Aman (Runway ~8.4 bulan)\n• Piutang Retainer Masuk: Rp 45.000.000 (Telah dikonfirmasi)\n• Estimasi Beban Tetap Bulan Ini: Rp 18.250.000\n\nRincian penuh dapat diakses di menu Finance.";
      } else if (lower.includes("jadwal") || lower.includes("meeting") || lower.includes("rapat")) {
        reply =
          "🗓️ Agenda Mendatang Hari Ini:\n• 10:00 WIB - Strategic Alignment Call dengan Klien Korporasi\n• 14:00 WIB - Internal Sprint & Review Deliverable\n• 16:30 WIB - Rekonsiliasi Anggaran & Outward Outlook";
      } else {
        reply = `Perintah "${query}" tidak dikenali. Ketik 'help' untuk melihat daftar perintah.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `output-${Date.now()}`,
          sender: "output",
          text: reply,
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsProcessing(false);
    }, 450);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const quickPrompts = [
    "Ringkas tugas hari ini",
    "Cek saldo & kas",
    "Jadwal rapat terdekat",
    "help",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Click outside overlay to dismiss - no blur or black overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Floating Stack anchored directly above dock */}
          <div className="fixed bottom-[82px] left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="w-80 sm:w-96 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-2xl p-2.5 flex flex-col overflow-hidden cursor-default text-left select-none max-h-[75vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-2 pt-1 pb-2 border-b border-neutral-200/60 dark:border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Terminal className="size-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight flex items-center gap-1.5">
                      <span>Terminal</span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-normal px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleSend("clear")}
                    title="Bersihkan layar"
                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Message feed / Terminal output */}
              <div
                ref={scrollRef}
                className="p-2.5 space-y-2 overflow-y-auto no-scrollbar max-h-[44vh] font-mono text-xs"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "user"
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-neutral-400 mb-0.5 px-1">
                      {msg.sender === "user" ? (
                        <>
                          <span>Anda</span>
                          <span>• {msg.time}</span>
                        </>
                      ) : msg.sender === "output" ? (
                        <>
                          <ChevronRight className="size-3 text-emerald-500" />
                          <span>Terminal</span>
                          <span>• {msg.time}</span>
                        </>
                      ) : (
                        <span>Sistem • {msg.time}</span>
                      )}
                    </div>

                    <div
                      className={`p-2.5 rounded-2xl max-w-[92%] whitespace-pre-line leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : msg.sender === "output"
                          ? "bg-neutral-100/90 dark:bg-zinc-800/90 text-neutral-800 dark:text-neutral-100 border border-neutral-200/60 dark:border-zinc-700/60 rounded-bl-sm font-sans text-xs"
                          : "bg-neutral-50 dark:bg-zinc-800/50 text-neutral-500 border border-neutral-200/40 dark:border-zinc-700/40 text-[11px] font-sans"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 p-1">
                    <Loader2 className="size-3 text-emerald-500 animate-spin" />
                    <span className="text-[11px] font-sans">Memproses...</span>
                  </div>
                )}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-2 py-1.5 border-t border-neutral-200/60 dark:border-zinc-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="text-[10px] font-sans whitespace-nowrap px-2 py-1 rounded-xl bg-neutral-100/80 dark:bg-zinc-800/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-zinc-700/80 transition-colors border border-neutral-200/50 dark:border-zinc-700/50 cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={handleSubmit}
                className="p-2 border-t border-neutral-200/60 dark:border-zinc-800/60 flex items-center gap-2"
              >
                <div className="relative flex-1 flex items-center">
                  <span className="absolute left-2.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    &gt;
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ketik perintah..."
                    className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-1.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                  aria-label="Kirim"
                >
                  <Send className="size-3.5" />
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
