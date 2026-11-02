import React from "react";
import { AppShell } from "../app/app-shell";
import { ActionModals } from "./components/modals/ActionModals";

// LifeOS Views
import { LifePlannerView } from "./components/life-planner/LifePlannerView";
import { FinanceOSView } from "./components/finance-os/FinanceOSView";
import { SimpleFinanceView } from "./components/simple-finance/SimpleFinanceView";
import { BudgetTrackerView } from "./components/budget-tracker/BudgetTrackerView";
import { WeightTrackerView } from "./components/weight-tracker/WeightTrackerView";
import { DoctorConsultationView } from "./components/doctor-consultation/DoctorConsultationView";
import { HouseholdTrackerView } from "./components/household/HouseholdTrackerView";
import { WishlistView } from "./components/wishlist/WishlistView";
import { GroceryListView } from "./components/grocery/GroceryListView";
import { MovieTrackerView } from "./components/movie-tracker/MovieTrackerView";
import { RecipeBookView } from "./components/recipe-book/RecipeBookView";
import { CertificateTrackerView } from "./components/certificate-tracker/CertificateTrackerView";
import { TravelBackpackView } from "./components/travel-backpack/TravelBackpackView";
import { NotesView } from "./components/notes/NotesView";
import { JournalView } from "./components/journal/JournalView";
import { HabitTrackerView } from "./components/habit-tracker/HabitTrackerView";
import { ContactsView } from "./components/contacts/ContactsView";
import { SubscriptionTrackerView } from "./components/subscriptions/SubscriptionTrackerView";
import { AssetsTrackerView } from "./components/assets/AssetsTrackerView";

function wrapLifeWithShell(title: string, subtitle: string, Component: React.ComponentType) {
  return function LifeShellWrappedView() {
    return (
      <AppShell title={title} subtitle={subtitle}>
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 py-4 space-y-6">
          <Component />
        </div>
        <ActionModals />
      </AppShell>
    );
  };
}

// Export Wrapped Views
export const LifeOSPlannerView = wrapLifeWithShell(
  "Life Planner Hub",
  "Dasbor eksekutif holistik: sasaran, habit, tugas, keuangan, dan jurnal refleksi harian",
  LifePlannerView
);

export const LifeOSFinanceView = wrapLifeWithShell(
  "Finance OS",
  "Sistem keuangan mendalam: multi-akun, arus kas masuk/keluar, visualisasi donut & tren bulanan",
  FinanceOSView
);

export const LifeOSSimpleFinanceView = wrapLifeWithShell(
  "Keuangan Sederhana",
  "Pencatatan cepat kas harian, dompet digital, dan log mutasi transaksi instan",
  SimpleFinanceView
);

export const LifeOSBudgetView = wrapLifeWithShell(
  "Budget Tracker 50/30/20",
  "Aturan alokasi anggaran: 50% Kebutuhan Pokok, 30% Keinginan, 20% Tabungan & Utang",
  BudgetTrackerView
);

export const LifeOSWeightView = wrapLifeWithShell(
  "Weight & Body Metric Tracker",
  "Pelacak komposisi tubuh, indeks massa tubuh (BMI), body fat, massa otot & target berat badan",
  WeightTrackerView
);

export const LifeOSDoctorView = wrapLifeWithShell(
  "Konsultasi Dokter & Rekam Medis",
  "Pencatatan sesi dokter, resep obat, tensi darah, jadwal kontrol, biaya & direktori spesialis",
  DoctorConsultationView
);

export const LifeOSHouseholdView = wrapLifeWithShell(
  "Inventaris Rumah & Elektronik",
  "Pendataan perabotan hunian, status garansi aktif, kondisi barang, dan log servis berkala",
  HouseholdTrackerView
);

export const LifeOSWishlistView = wrapLifeWithShell(
  "Wishlist & Tabungan Impian",
  "Daftar impian terencana, refleksi mindful spending, celengan akumulasi dana & prioritas",
  WishlistView
);

export const LifeOSGroceryView = wrapLifeWithShell(
  "Daftar Belanja & Sembako",
  "Perencanaan belanja supermarket, siklus restock mingguan/bulanan & estimasi biaya",
  GroceryListView
);

export const LifeOSMovieView = wrapLifeWithShell(
  "Movie & Series Tracker",
  "Watchlist film, serial TV, dokumenter, platform streaming, rating & ulasan pribadi",
  MovieTrackerView
);

export const LifeOSRecipeView = wrapLifeWithShell(
  "Buku Resep & Dapur",
  "Koleksi resep masakan, takaran bahan, porsi, kalori, dan petunjuk langkah memasak",
  RecipeBookView
);

export const LifeOSCertificateView = wrapLifeWithShell(
  "Sertifikat & Dokumen Legal",
  "Pelacak sertifikasi profesional, ijazah, paspor/visa, SIM/STNK, dan lokasi fisik brankas",
  CertificateTrackerView
);

export const LifeOSTravelView = wrapLifeWithShell(
  "Travel Backpack & Packing List",
  "Daftar perlengkapan perjalanan, estimasi bobot bagasi kabin/bagasi, dan rencana trip",
  TravelBackpackView
);

export const LifeOSNotesView = wrapLifeWithShell(
  "Catatan & Notebooks",
  "Buku catatan terstruktur lintas kategori: kerja, pribadi, buku, ide & teknologi",
  NotesView
);

export const LifeOSJournalView = wrapLifeWithShell(
  "Jurnal Refleksi Harian",
  "Catatan pemikiran harian, syukur (*gratitude*), cuaca, dan evaluasi suasana hati",
  JournalView
);

export const LifeOSHabitsView = wrapLifeWithShell(
  "Pelacak Habit & Konsistensi",
  "Ritme kebiasaan harian, konsistensi mingguan, dan rekapitulasi streak positif",
  HabitTrackerView
);

export const LifeOSContactsView = wrapLifeWithShell(
  "Buku Kontak & Relasi",
  "Direktori jejaring personal & profesional, frekuensi sapa, dan catatan relasi",
  ContactsView
);

export const LifeOSSubscriptionsView = wrapLifeWithShell(
  "Langganan & Tagihan Rutin",
  "Pemantauan siklus biaya berulang bulanan/tahunan, kategori layanan, dan pengingat",
  SubscriptionTrackerView
);

export const LifeOSAssetsView = wrapLifeWithShell(
  "Pelacak Aset & Portofolio",
  "Pencatatan aset modal, nilai perolehan, taksiran nilai pasar kini, dan kategori aset",
  AssetsTrackerView
);
