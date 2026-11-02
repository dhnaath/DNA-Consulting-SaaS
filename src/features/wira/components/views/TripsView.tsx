import React, { useState, useEffect, useMemo } from "react";
import {
  Plane,
  Calendar,
  MapPin,
  Building,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Search,
  DollarSign,
  ChevronRight,
  X,
  Luggage,
  Compass,
  Sparkles,
  Globe,
} from "lucide-react";
import { cn } from "../../lib/utils";

export type TripStatus = "Mendatang" | "Sedang Berlangsung" | "Selesai";
export type TripCategory = "Business & Client" | "Strategic Retreat" | "Industrial Research" | "Conference";

export interface ItineraryItem {
  day: number;
  date: string;
  title: string;
  activities: string[];
}

export interface PackingItem {
  id: string;
  item: string;
  category: "Dokumen & Finansial" | "Tech & Hardware" | "Busana & Etika" | "Personal & Health";
  isPacked: boolean;
}

export interface Trip {
  id: string;
  destination: string;
  city: string;
  country: string;
  category: TripCategory;
  startDate: string;
  endDate: string;
  durationDays: number;
  status: TripStatus;
  hotelName: string;
  flightCode: string;
  allocatedBudget: number; // in IDR
  actualSpent: number; // in IDR
  purpose: string;
  heroImageUrl: string;
  itinerary: ItineraryItem[];
  checklist: PackingItem[];
  notes: string;
}

const INITIAL_TRIPS: Trip[] = [
  {
    id: "trip-1",
    destination: "Singapura M&A Summit & Regional Partner Briefing",
    city: "Singapura",
    country: "Singapura",
    category: "Business & Client",
    startDate: "12 Okt 2026",
    endDate: "16 Okt 2026",
    durationDays: 5,
    status: "Mendatang",
    hotelName: "The Ritz-Carlton Millenia, Marina Bay",
    flightCode: "Singapore Airlines SQ 957 (CGK - SIN)",
    allocatedBudget: 45000000,
    actualSpent: 32500000,
    purpose: "Negosiasi term sheet syndicated investment, bilateral dinner dengan Managing Partner regional venture funds, dan evaluasi kepatuhan M&A cross-border.",
    heroImageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80",
    itinerary: [
      {
        day: 1,
        date: "12 Okt 2026",
        title: "Kedatangan, Check-in & Internal Team Pre-briefing",
        activities: [
          "10:15 - Mendarat di Bandara Changi (Terminal 3)",
          "12:00 - Check-in The Ritz-Carlton Millenia & Unpack",
          "15:00 - Konsolidasi draft NDA & spreadsheet model di Club Lounge",
          "19:00 - Casual dinner di Marina Bay Sands Promenade",
        ],
      },
      {
        day: 2,
        date: "13 Okt 2026",
        title: "Sesi Negosiasi Term Sheet & Advisory Round",
        activities: [
          "09:00 - Pertemuan 1: Temasek Shophouse Advisory Board",
          "13:00 - Working lunch bersama Legal Counsel Rajah & Tann",
          "15:30 - Presentasi Financial Synergy Valuation Model",
          "19:30 - Private Executive Dining di Raffles Hotel",
        ],
      },
      {
        day: 3,
        date: "14 Okt 2026",
        title: "Keynote Regional M&A Summit 2026",
        activities: [
          "08:30 - Registrasi & VIP Networking Breakfast di Suntec Convention",
          "10:30 - Panel Diskusi: Cross-Border Liquidity & ESG Compliance",
          "14:00 - 1-on-1 breakout session bersama General Partners",
          "17:30 - Cocktail Reception & Bilateral Exchange",
        ],
      },
      {
        day: 4,
        date: "15 Okt 2026",
        title: "Finalisasi Draft Kontrak & Site Visit",
        activities: [
          "10:00 - Site inspection di Innovation Hub One-North",
          "14:00 - Review klausul indemnitas & escrow account bersama notaris",
          "17:00 - Debriefing hasil diskusi bersama tim Jakarta via video conference",
        ],
      },
      {
        day: 5,
        date: "16 Okt 2026",
        title: "Check-out & Kepulangan ke Jakarta",
        activities: [
          "11:00 - Check-out hotel & transfer ke Changi Airport Jewel",
          "14:40 - Penerbangan SQ 964 kembali ke Bandara Soekarno-Hatta",
          "15:30 - Tiba di Jakarta, arsipkan tanda terima biaya perjalanan dinas",
        ],
      },
    ],
    checklist: [
      { id: "c1", item: "Paspor Asli (Masa berlaku > 6 bulan)", category: "Dokumen & Finansial", isPacked: true },
      { id: "c2", item: "Singapore Arrival Card (SGAC online submit)", category: "Dokumen & Finansial", isPacked: true },
      { id: "c3", item: "Kartu Kredit Korporat & SGD Cash S$1,500", category: "Dokumen & Finansial", isPacked: true },
      { id: "c4", item: "MacBook Pro + MagSafe 140W Charger", category: "Tech & Hardware", isPacked: true },
      { id: "c5", item: "Universal UK Adapter Plug (Type G)", category: "Tech & Hardware", isPacked: false },
      { id: "c6", item: "Setelan Jas Formal Navy Tailored & Sepatu Kulit Oxford", category: "Busana & Etika", isPacked: true },
      { id: "c7", item: "Noise-Cancelling Headphones (Sony WH-1000XM5)", category: "Tech & Hardware", isPacked: false },
      { id: "c8", item: "Hardcopy Executive Summary & Kartu Nama Embossed", category: "Dokumen & Finansial", isPacked: false },
    ],
    notes: "Ingat untuk menukarkan tanda terima valuta asing (SGD) di portal expense report paling lambat 3 hari kerja setelah kepulangan.",
  },
  {
    id: "trip-2",
    destination: "Bali Q4 Strategic Executive Retreat & AOP Alignment",
    city: "Ubud, Bali",
    country: "Indonesia",
    category: "Strategic Retreat",
    startDate: "22 Sep 2026",
    endDate: "26 Sep 2026",
    durationDays: 5,
    status: "Sedang Berlangsung",
    hotelName: "Mandapa, a Ritz-Carlton Reserve, Ubud",
    flightCode: "Garuda Indonesia GA 408 (CGK - DPS)",
    allocatedBudget: 28000000,
    actualSpent: 24800000,
    purpose: "Penyusunan Annual Operating Plan (AOP) 2027, refleksi kepemimpinan dewan mitra, dan perumusan matriks alokasi modal lima tahunan di tengah suasana alam tenang.",
    heroImageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
    itinerary: [
      {
        day: 1,
        date: "22 Sep 2026",
        title: "Kedatangan di Ngurah Rai & Transfer ke Ubud Sanctuary",
        activities: [
          "09:30 - Mendarat di DPS, VIP pickup ke Ubud via highway Mandara",
          "12:30 - Tiba di Mandapa Reserve, welcome herbal elixir & check-in villa",
          "16:00 - Sesi santai pembuka: Mind clearing & pemaparan agenda 5 hari",
          "19:00 - Welcome dinner organik di tepi Sungai Ayung",
        ],
      },
      {
        day: 2,
        date: "23 Sep 2026",
        title: "Audit Kinerja Portofolio & Retrospektif 2026",
        activities: [
          "07:00 - Sesi morning yoga & pernapasan fokus",
          "09:00 - Evaluasi pencapaian OKR tahun berjalan & margin kontribusi per divisi",
          "14:00 - Analisis SWOT mendalam terhadap kompetisi teknologi digital",
          "18:00 - Sunset walk di persawahan Campuhan",
        ],
      },
      {
        day: 3,
        date: "24 Sep 2026",
        title: "Perumusan Visi 2027 & Blueprint Transformasi",
        activities: [
          "08:30 - Workshop pemodelan skenario ekonomi makro suku bunga",
          "13:30 - Desain struktur organisasi agile & retensi key partners",
          "17:00 - Sesi penulisan memo strategis dewan direksi",
        ],
      },
    ],
    checklist: [
      { id: "cb1", item: "Tiket Garuda e-ticket & Boarding Pass DPS", category: "Dokumen & Finansial", isPacked: true },
      { id: "cb2", item: "Pakaian Linen Smart Casual & Sandal Santai", category: "Busana & Etika", isPacked: true },
      { id: "cb3", item: "iPad Pro & Apple Pencil untuk diagram arsitektur", category: "Tech & Hardware", isPacked: true },
      { id: "cb4", item: "Buku Jurnal Kulit Blank & Fountain Pen", category: "Dokumen & Finansial", isPacked: true },
    ],
    notes: "Sesi retreat di Mandapa Reserve didesain semi-digital detox; ponsel disimpan selama workshop berlangsung untuk memaksimalkan fokus.",
  },
  {
    id: "trip-3",
    destination: "Tokyo Robotics & Smart Industrial Automation Study",
    city: "Tokyo",
    country: "Jepang",
    category: "Industrial Research",
    startDate: "04 Nov 2026",
    endDate: "10 Nov 2026",
    durationDays: 7,
    status: "Mendatang",
    hotelName: "Palace Hotel Tokyo, Marunouchi",
    flightCode: "All Nippon Airways ANA NH 856 (CGK - HND)",
    allocatedBudget: 68000000,
    actualSpent: 41000000,
    purpose: "Studi komparasi otomasi pabrik generasi berikutnya, pertemuan dengan eksekutif Fanuc & Keyence, serta kunjungan ke fasilitas logistik otonom di Yokohama.",
    heroImageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    itinerary: [
      {
        day: 1,
        date: "04 Nov 2026",
        title: "Penerbangan Malam & Kedatangan Haneda Pagi Hari",
        activities: [
          "06:30 - Mendarat di Tokyo Haneda Airport",
          "08:00 - Airport Limousine ke Marunouchi, drop bagasi di Palace Hotel",
          "10:00 - Pertemuan pembuka dengan Kamar Dagang & Industri Jepang-Indonesia",
          "14:00 - Observasi penerapan IoT di stasiun Tokyo central hub",
        ],
      },
      {
        day: 2,
        date: "05 Nov 2026",
        title: "Kunjungan Laboratorium Presisi & Robotics Demo",
        activities: [
          "09:00 - Shinkansen ke fasilitas demonstrasi robotika industri",
          "11:00 - Studi siklus pemeliharaan prediktif berbasis computer vision",
          "15:00 - Tanya jawab engineering & kalkulasi ROI CAPEX mesin",
        ],
      },
    ],
    checklist: [
      { id: "ct1", item: "Paspor dengan Visa Jepang / e-Visa", category: "Dokumen & Finansial", isPacked: true },
      { id: "ct2", item: "Kartu Suica / Pasmo Digital di Apple Wallet", category: "Dokumen & Finansial", isPacked: true },
      { id: "ct3", item: "Pocket WiFi / eSIM Roaming Unlimited Data", category: "Tech & Hardware", isPacked: false },
      { id: "ct4", item: "Coat Hangat Wol & Thermal Innerwear (Suhu 11°C)", category: "Busana & Etika", isPacked: false },
    ],
    notes: "Pastikan membawa omiyage (buah tangan khas Indonesia) saat mengunjungi kantor mitra di Tokyo sebagai etika bisnis lokal.",
  },
  {
    id: "trip-4",
    destination: "London Global Capital Markets & Sovereign Wealth Forum",
    city: "London",
    country: "Inggris",
    category: "Conference",
    startDate: "15 Jul 2026",
    endDate: "21 Jul 2026",
    durationDays: 7,
    status: "Selesai",
    hotelName: "The Ned London, City of London",
    flightCode: "British Airways BA 102 (CGK - LHR via DOH)",
    allocatedBudget: 85000000,
    actualSpent: 81200000,
    purpose: "Roundtable dewan sovereign wealth fund internasional, pembahasan hilirisasi komoditas mineral hijau, dan penjajakan obligasi hijau berkelanjutan di LSE.",
    heroImageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80",
    itinerary: [
      {
        day: 1,
        date: "15 Jul 2026",
        title: "Ketibaan di London Heathrow & Check-in",
        activities: [
          "14:00 - Tiba di LHR Terminal 5, transfer via Heathrow Express",
          "16:30 - Check-in The Ned Hotel di pusat finansial City of London",
          "19:00 - Informal meeting dengan investment banker mitra",
        ],
      },
      {
        day: 2,
        date: "16 Jul 2026",
        title: "Roundtable Sovereign Wealth Fund di Mayfair",
        activities: [
          "09:30 - Sesi roundtable tertutup: Transisi Energi & Alokasi Modal Negara Berkembang",
          "14:00 - Kunjungan ke London Stock Exchange Paternoster Square",
          "19:30 - Dinner resmi di Guildhall",
        ],
      },
    ],
    checklist: [
      { id: "cl1", item: "Standard Visitor Visa UK Hardcopy & Paspor", category: "Dokumen & Finansial", isPacked: true },
      { id: "cl2", item: "Payung Kompak Berkualitas & Jas Hujan Tipis", category: "Personal & Health", isPacked: true },
    ],
    notes: "Laporan studi kasus dan ringkasan notulensi sovereign wealth fund telah diarsipkan ke direktori kurasi manajemen.",
  },
];

const LOCAL_STORAGE_KEY = "aio_trips_data_v1";

export function TripsView() {
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TRIPS;
  });

  const [activeStatus, setActiveStatus] = useState<string>("Semua");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new trip
  const [newDestination, setNewDestination] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newCategory, setNewCategory] = useState<TripCategory>("Business & Client");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newDays, setNewDays] = useState("4");
  const [newStatus, setNewStatus] = useState<TripStatus>("Mendatang");
  const [newHotel, setNewHotel] = useState("");
  const [newFlight, setNewFlight] = useState("");
  const [newBudget, setNewBudget] = useState("35000000");
  const [newPurpose, setNewPurpose] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trips));
    } catch {
      // ignore
    }
  }, [trips]);

  const categories = [
    "Semua",
    "Business & Client",
    "Strategic Retreat",
    "Industrial Research",
    "Conference",
  ];

  const statuses = ["Semua", "Mendatang", "Sedang Berlangsung", "Selesai"];

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // status
      if (activeStatus !== "Semua" && trip.status !== activeStatus) return false;

      // category
      if (activeCategory !== "Semua" && trip.category !== activeCategory) return false;

      // search
      const q = searchQuery.toLowerCase();
      if (
        q &&
        !trip.destination.toLowerCase().includes(q) &&
        !trip.city.toLowerCase().includes(q) &&
        !trip.country.toLowerCase().includes(q) &&
        !trip.purpose.toLowerCase().includes(q) &&
        !trip.hotelName.toLowerCase().includes(q)
      ) {
        return false;
      }

      return true;
    });
  }, [trips, activeStatus, activeCategory, searchQuery]);

  // Statistics
  const totalTrips = trips.length;
  const activeTripsCount = trips.filter(
    (t) => t.status === "Mendatang" || t.status === "Sedang Berlangsung"
  ).length;
  const totalBudget = trips.reduce((sum, t) => sum + (t.allocatedBudget || 0), 0);
  const totalActual = trips.reduce((sum, t) => sum + (t.actualSpent || 0), 0);

  const toggleChecklistItem = (tripId: string, itemId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updatedChecklist = t.checklist.map((c) =>
          c.id === itemId ? { ...c, isPacked: !c.isPacked } : c
        );
        return { ...t, checklist: updatedChecklist };
      })
    );

    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip((prev) => {
        if (!prev) return null;
        const updated = prev.checklist.map((c) =>
          c.id === itemId ? { ...c, isPacked: !c.isPacked } : c
        );
        return { ...prev, checklist: updated };
      });
    }
  };

  const deleteTrip = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm("Hapus perjalanan ini dari rencana dinas Anda?")) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
      if (selectedTrip?.id === id) setSelectedTrip(null);
    }
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestination.trim()) return;

    const budgetNum = parseInt(newBudget.replace(/\D/g, ""), 10) || 25000000;

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      destination: newDestination.trim(),
      city: newCity.trim() || "Destinasi Bisnis",
      country: newCountry.trim() || "Indonesia",
      category: newCategory,
      startDate: newStartDate.trim() || "Segera Ditentukan",
      endDate: newEndDate.trim() || "Segera Ditentukan",
      durationDays: parseInt(newDays, 10) || 4,
      status: newStatus,
      hotelName: newHotel.trim() || "Akomodasi Bintang 5 Terpilih",
      flightCode: newFlight.trim() || "Penerbangan Kelas Bisnis",
      allocatedBudget: budgetNum,
      actualSpent: 0,
      purpose: newPurpose.trim() || "Perjalanan dinas strategis konsultasi dan pertemuan mitra.",
      heroImageUrl:
        newImageUrl.trim() ||
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80",
      itinerary: [
        {
          day: 1,
          date: newStartDate || "Hari 1",
          title: "Kedatangan, Check-in & Briefing Internal",
          activities: [
            "Tiba di bandara tujuan & transportasi darat",
            "Check-in hotel & koordinasi materi presentasi",
            "Makan malam persiapan bersama tim eksekutif",
          ],
        },
        {
          day: 2,
          date: newEndDate || "Hari 2",
          title: "Sesi Pertemuan Klien & Negosiasi",
          activities: [
            "Meeting formal dengan dewan direksi / mitra kerja",
            "Review klausul kesepakatan dan langkah eksekusi",
          ],
        },
      ],
      checklist: [
        { id: `c-${Date.now()}-1`, item: "Paspor / Identitas Resmi & Tiket", category: "Dokumen & Finansial", isPacked: true },
        { id: `c-${Date.now()}-2`, item: "Laptop Kerja & Charger GaN", category: "Tech & Hardware", isPacked: true },
        { id: `c-${Date.now()}-3`, item: "Busana Bisnis Formal & Sepatu Resmi", category: "Busana & Etika", isPacked: false },
        { id: `c-${Date.now()}-4`, item: "Kartu Nama & Dokumen Penawaran", category: "Dokumen & Finansial", isPacked: false },
      ],
      notes: "Catat seluruh pengeluaran selama perjalanan untuk proses reimbursement.",
    };

    setTrips((prev) => [newTrip, ...prev]);
    setIsAddModalOpen(false);

    // reset
    setNewDestination("");
    setNewCity("");
    setNewCountry("");
    setNewHotel("");
    setNewFlight("");
    setNewPurpose("");
    setNewImageUrl("");
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Rencana Dinas
            </span>
            <Compass size={18} className="text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalTrips}</p>
          <span className="text-xs text-muted-foreground">{activeTripsCount} aktif / mendatang</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Alokasi Anggaran
            </span>
            <DollarSign size={18} className="text-emerald-500" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-foreground mt-2">
            {formatIDR(totalBudget)}
          </p>
          <span className="text-xs text-muted-foreground">Total Budget Disiapkan</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Realisasi Biaya
            </span>
            <Building size={18} className="text-blue-500" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {formatIDR(totalActual)}
          </p>
          <span className="text-xs text-muted-foreground">Realisasi &amp; Komitmen</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Destinasi Strategis
            </span>
            <Globe size={18} className="text-teal-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {new Set(trips.map((t) => t.city)).size} Kota
          </p>
          <span className="text-xs text-muted-foreground">Jangkauan Regional &amp; Global</span>
        </div>
      </div>

      {/* Controls Bar: Search, Status Tabs, Category Filter, Plan Button */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari destinasi, kota, atau hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setActiveStatus(st)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                  activeStatus === st
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-600/25 shrink-0"
          >
            <Plus size={16} />
            <span>Rencanakan Perjalanan</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-border/50 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150",
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Trip Cards */}
      {filteredTrips.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl p-12 text-center bg-card/40 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-600">
            <Plane size={28} />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Tidak ada perjalanan dinas</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Sesuaikan pencarian atau jadwalkan rencana perjalanan dinas baru dengan tombol di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTrips.map((trip) => {
            const packedItems = trip.checklist.filter((c) => c.isPacked).length;
            const packingPct =
              trip.checklist.length > 0
                ? Math.round((packedItems / trip.checklist.length) * 100)
                : 100;

            return (
              <div
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                className="group bg-card border border-border/80 hover:border-indigo-500/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
              >
                {/* Image Banner with Badge */}
                <div className="relative h-52 w-full overflow-hidden bg-muted">
                  <img
                    src={trip.heroImageUrl}
                    alt={trip.destination}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-border/15">
                      {trip.category}
                    </span>
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm",
                        trip.status === "Sedang Berlangsung"
                          ? "bg-emerald-500 text-white"
                          : trip.status === "Mendatang"
                          ? "bg-blue-600 text-white"
                          : "bg-card text-foreground"
                      )}
                    >
                      {trip.status}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
                      <MapPin size={13} />
                      <span>{trip.city}, {trip.country}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1 line-clamp-1 drop-shadow-sm">
                      {trip.destination}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {trip.purpose}
                  </p>

                  {/* Schedule & Flight bar */}
                  <div className="bg-muted/40 rounded-xl p-3 border border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-indigo-500 shrink-0" />
                      <span className="text-muted-foreground font-medium truncate">
                        {trip.startDate} - {trip.endDate} ({trip.durationDays} hari)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Plane size={14} className="text-blue-500 shrink-0" />
                      <span className="text-muted-foreground font-medium truncate">
                        {trip.flightCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 col-span-1 sm:col-span-2 pt-1 border-t border-border/40">
                      <Building size={14} className="text-amber-500 shrink-0" />
                      <span className="text-foreground font-semibold truncate">
                        {trip.hotelName}
                      </span>
                    </div>
                  </div>

                  {/* Budget & Packing Progress */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/60 text-xs">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Estimasi Biaya</span>
                      <span className="font-bold text-foreground text-sm">
                        {formatIDR(trip.allocatedBudget)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Kesiapan Dokumen</span>
                        <span className="font-bold text-indigo-600">{packingPct}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${packingPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Hint */}
                  <div className="pt-2 flex items-center justify-between text-xs text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>Lihat Rencana Hari ke Hari &amp; Checklist</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Trip Drawer / Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
            {/* Hero Image in Modal */}
            <div className="relative h-60 w-full shrink-0 bg-muted">
              <img
                src={selectedTrip.heroImageUrl}
                alt={selectedTrip.destination}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-black/50 to-transparent" />

              <button
                onClick={() => setSelectedTrip(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 flex items-center justify-center transition-colors border border-border/20"
              >
                <X size={18} />
              </button>

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-sm">
                  {selectedTrip.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md border border-border/20">
                  {selectedTrip.status}
                </span>
              </div>

              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-1.5 text-xs text-indigo-200 font-medium">
                  <MapPin size={14} />
                  <span>{selectedTrip.city}, {selectedTrip.country}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md mt-1">
                  {selectedTrip.destination}
                </h2>
              </div>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
              {/* Purpose & Objective Box */}
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-indigo-700 dark:text-indigo-400 text-xs uppercase tracking-wider mb-1">
                    Tujuan &amp; Objektif Strategis
                  </h4>
                  <p className="text-xs md:text-sm leading-relaxed text-foreground">
                    {selectedTrip.purpose}
                  </p>
                </div>
              </div>

              {/* Travel Logistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-muted/40 p-3 rounded-xl border border-border/50">
                  <span className="text-[11px] text-muted-foreground block">Jadwal Perjalanan</span>
                  <span className="font-bold text-foreground text-xs md:text-sm mt-0.5 block">
                    {selectedTrip.startDate} - {selectedTrip.endDate}
                  </span>
                  <span className="text-[11px] text-indigo-600 font-medium">
                    {selectedTrip.durationDays} Hari Operasional
                  </span>
                </div>

                <div className="bg-muted/40 p-3 rounded-xl border border-border/50">
                  <span className="text-[11px] text-muted-foreground block">Penerbangan</span>
                  <span className="font-bold text-foreground text-xs md:text-sm mt-0.5 block truncate">
                    {selectedTrip.flightCode}
                  </span>
                  <span className="text-[11px] text-muted-foreground">Kelas Bisnis Eksekutif</span>
                </div>

                <div className="bg-muted/40 p-3 rounded-xl border border-border/50">
                  <span className="text-[11px] text-muted-foreground block">Hotel &amp; Akomodasi</span>
                  <span className="font-bold text-foreground text-xs md:text-sm mt-0.5 block truncate">
                    {selectedTrip.hotelName}
                  </span>
                  <span className="text-[11px] text-muted-foreground">Kamar Eksekutif</span>
                </div>

                <div className="bg-muted/40 p-3 rounded-xl border border-border/50">
                  <span className="text-[11px] text-muted-foreground block">Alokasi Anggaran</span>
                  <span className="font-bold text-foreground text-xs md:text-sm mt-0.5 block">
                    {formatIDR(selectedTrip.allocatedBudget)}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    Realisasi: {formatIDR(selectedTrip.actualSpent)}
                  </span>
                </div>
              </div>

              {/* Day by Day Itinerary */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-600" />
                  <span>Agenda &amp; Itinerari Hari ke Hari</span>
                </h3>

                <div className="space-y-3">
                  {selectedTrip.itinerary.map((dayPlan) => (
                    <div
                      key={dayPlan.day}
                      className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2.5"
                    >
                      <div className="flex items-center justify-between border-b border-border/50 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-lg">
                            Hari {dayPlan.day}
                          </span>
                          <span className="text-xs font-bold text-foreground">{dayPlan.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          {dayPlan.date}
                        </span>
                      </div>

                      <ul className="space-y-1.5 pl-1">
                        {dayPlan.activities.map((act, i) => (
                          <li
                            key={i}
                            className="text-xs text-muted-foreground flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Packing & Document Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Luggage size={18} className="text-indigo-600" />
                    <span>Daftar Kesiapan Dokumen &amp; Perlengkapan ({selectedTrip.checklist.length})</span>
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Klik untuk menandai barang siap
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTrip.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(selectedTrip.id, item.id)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                        item.isPacked
                          ? "bg-emerald-500/5 border-emerald-500/30 text-muted-foreground"
                          : "bg-card border-border/80 hover:border-indigo-500/40 text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {item.isPacked ? (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        ) : (
                          <Circle size={16} className="text-muted-foreground shrink-0" />
                        )}
                        <span
                          className={cn(
                            "text-xs md:text-sm truncate",
                            item.isPacked ? "line-through opacity-75" : ""
                          )}
                        >
                          {item.item}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedTrip.notes && (
                <div className="bg-muted/30 p-4 rounded-2xl border border-border text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground block mb-1">
                    Catatan Logistik &amp; Reimbursement:
                  </span>
                  {selectedTrip.notes}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-card flex items-center justify-between">
              <button
                onClick={(e) => deleteTrip(selectedTrip.id, e)}
                className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 size={15} />
                <span>Hapus Rencana</span>
              </button>

              <button
                onClick={() => setSelectedTrip(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm"
              >
                Tutup Itinerari
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Trip Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Plane size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">Rencanakan Perjalanan Baru</h3>
                  <p className="text-xs text-muted-foreground">Jadwalkan perjalanan dinas, retreat, atau studi lapangan</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTrip} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Nama / Tajuk Perjalanan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kuala Lumpur FinTech Round & Board Presentation"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Kota Tujuan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kuala Lumpur"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Negara Tujuan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Malaysia"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Kategori Perjalanan
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TripCategory)}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                  >
                    <option value="Business & Client">Business &amp; Client</option>
                    <option value="Strategic Retreat">Strategic Retreat</option>
                    <option value="Industrial Research">Industrial Research</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Status Perjalanan
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TripStatus)}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                  >
                    <option value="Mendatang">Mendatang</option>
                    <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Tanggal Mulai</label>
                  <input
                    type="text"
                    placeholder="20 Nov 2026"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Tanggal Selesai</label>
                  <input
                    type="text"
                    placeholder="24 Nov 2026"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Durasi (Hari)</label>
                  <input
                    type="number"
                    value={newDays}
                    onChange={(e) => setNewDays(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Hotel &amp; Akomodasi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Grand Hyatt Kuala Lumpur"
                    value={newHotel}
                    onChange={(e) => setNewHotel(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Penerbangan / Transportasi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Malaysia Airlines MH 710"
                    value={newFlight}
                    onChange={(e) => setNewFlight(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Alokasi Anggaran (Rp)
                </label>
                <input
                  type="number"
                  placeholder="30000000"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Tujuan &amp; Objektif Strategis
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsikan agenda utama, mitra yang ditemui, dan hasil yang diharapkan..."
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  URL Foto Banner (Unsplash / Web)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  Jadwalkan Perjalanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
