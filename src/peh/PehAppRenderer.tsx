import React from "react";
import { AppShell } from "../app/app-shell";

// Personal Apps
import { HabitsApp } from "./components/apps/personal/HabitsApp";
import { JournalApp } from "./components/apps/personal/JournalApp";
import { GoalsApp } from "./components/apps/personal/GoalsApp";
import { ReadingApp } from "./components/apps/personal/ReadingApp";
import { FitnessApp } from "./components/apps/personal/FitnessApp";
import { SleepApp } from "./components/apps/personal/SleepApp";

// Essentials Apps
import { VaultApp } from "./components/apps/essentials/VaultApp";
import { DocumentsApp } from "./components/apps/essentials/DocumentsApp";
import { SubscriptionsApp } from "./components/apps/essentials/SubscriptionsApp";
import { BudgetApp } from "./components/apps/essentials/BudgetApp";
import { InsuranceApp } from "./components/apps/essentials/InsuranceApp";

// Household Apps
import { ChoresApp } from "./components/apps/household/ChoresApp";
import { MaintenanceApp } from "./components/apps/household/MaintenanceApp";
import { PantryApp } from "./components/apps/household/PantryApp";
import { PlantsApp } from "./components/apps/household/PlantsApp";
import { VehiclesApp } from "./components/apps/household/VehiclesApp";

// Family Apps
import { FamilyTreeApp } from "./components/apps/family/FamilyTreeApp";
import { FamilyHealthApp } from "./components/apps/family/FamilyHealthApp";
import { FamilyRecipesApp } from "./components/apps/family/FamilyRecipesApp";
import { TraditionsApp } from "./components/apps/family/TraditionsApp";
import { FamilyBudgetApp } from "./components/apps/family/FamilyBudgetApp";
import { PetCareApp } from "./components/apps/family/PetCareApp";

// Operations Apps
import { WorkflowsApp } from "./components/apps/operations/WorkflowsApp";
import { VendorsApp } from "./components/apps/operations/VendorsApp";
import { IncidentsApp } from "./components/apps/operations/IncidentsApp";
import { ProcurementApp } from "./components/apps/operations/ProcurementApp";
import { ComplianceApp } from "./components/apps/operations/ComplianceApp";

// Ownership Apps
import { AssetsApp } from "./components/apps/ownership/AssetsApp";
import { IpLicensesApp } from "./components/apps/ownership/IpLicensesApp";
import { CapTableApp } from "./components/apps/ownership/CapTableApp";
import { InvestmentsApp } from "./components/apps/ownership/InvestmentsApp";
import { RealEstateApp } from "./components/apps/ownership/RealEstateApp";

// People Apps
import { ContactsApp } from "./components/apps/people/ContactsApp";
import { MilestonesApp } from "./components/apps/people/MilestonesApp";
import { GiftsApp } from "./components/apps/people/GiftsApp";
import { IntroductionsApp } from "./components/apps/people/IntroductionsApp";
import { MentorshipApp } from "./components/apps/people/MentorshipApp";

// Productivity Apps
import { KnowledgeApp } from "./components/apps/productivity/KnowledgeApp";
import { MeetingsApp } from "./components/apps/productivity/MeetingsApp";
import { ProjectsApp } from "./components/apps/productivity/ProjectsApp";
import { TasksApp } from "./components/apps/productivity/TasksApp";
import { TimeAuditApp } from "./components/apps/productivity/TimeAuditApp";

// Society Apps
import { CivicApp } from "./components/apps/society/CivicApp";
import { VolunteeringApp } from "./components/apps/society/VolunteeringApp";
import { CharityApp } from "./components/apps/society/CharityApp";
import { CommunityEventsApp } from "./components/apps/society/CommunityEventsApp";
import { AdvocacyApp } from "./components/apps/society/AdvocacyApp";

// Dashboards
import { GlobalOverview } from "./components/dashboard/GlobalOverview";
import { InnovationsHub } from "./components/dashboard/InnovationsHub";
import { EcosystemComparison } from "./components/dashboard/EcosystemComparison";

function wrapWithShell(title: string, subtitle: string, Component: React.ComponentType) {
  return function ShellWrappedView() {
    return (
      <AppShell title={title} subtitle={subtitle}>
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 py-4 space-y-6">
          <Component />
        </div>
      </AppShell>
    );
  };
}

// Export Wrapped Views
export const PehHabitsView = wrapWithShell("Habit & Rutinitas", "Pelacak kebiasaan harian & konsistensi ritme hidup", HabitsApp);
export const PehJournalView = wrapWithShell("Jurnal & Mood", "Ruang refleksi privat, pencatatan suasana hati & pemikiran harian", JournalApp);
export const PehGoalsView = wrapWithShell("Target & Sasaran", "Peta jalan sasaran jangka pendek & panjang dengan tahapan checkpoint", GoalsApp);
export const PehReadingView = wrapWithShell("Buku & Bahan Bacaan", "Pelacak target membaca buku, kutipan inspiratif & rak bacaan", ReadingApp);
export const PehFitnessView = wrapWithShell("Latihan & Olahraga", "Log sesi latihan fisik, kalori, intensitas detak & kalkulator 1RM", FitnessApp);
export const PehSleepView = wrapWithShell("Tidur & Pemulihan", "Kualitas tidur, jam istirahat malam & kalkulator sleep debt", SleepApp);

export const PehVaultView = wrapWithShell("Brankas Sandi & Kunci", "Penyimpanan aman kredensial, kunci akses, PIN & catatan sensitif", VaultApp);
export const PehDocumentsView = wrapWithShell("Dokumen & Garansi", "Sentralisasi berkas legal, kartu garansi fisik & polis aktif", DocumentsApp);
export const PehSubscriptionsView = wrapWithShell("Langganan & Tagihan", "Pantau biaya berulang, siklus tagihan & proyeksi anggaran tahunan", SubscriptionsApp);
export const PehBudgetView = wrapWithShell("Anggaran & Alokasi", "Perencanaan pos belanja, batas limit bulanan & evaluasi pengeluaran", BudgetApp);
export const PehInsuranceView = wrapWithShell("Asuransi & Polis", "Portofolio perlindungan jiwa, kesehatan, kendaraan & klaim", InsuranceApp);

export const PehChoresView = wrapWithShell("Tugas Domestik & Kebersihan", "Distribusi tanggung jawab kebersihan rumah & ceklis berkala", ChoresApp);
export const PehMaintenanceView = wrapWithShell("Perbaikan & Servis Rumah", "Jadwal servis AC, pipa, kelistrikan & log vendor tukang", MaintenanceApp);
export const PehPantryView = wrapWithShell("Dapur & Stok Bahan Makanan", "Inventaris bahan pangan, bumbu dapur & radar kedaluwarsa", PantryApp);
export const PehPlantsView = wrapWithShell("Tanaman & Kebun", "Jadwal penyiraman, pemupukan, repotting & log kesehatan flora", PlantsApp);
export const PehVehiclesView = wrapWithShell("Kendaraan & Otomotif", "Log servis berkala, pajak STNK, ganti oli & efisiensi BBM", VehiclesApp);

export const PehFamilyTreeView = wrapWithShell("Silsilah & Keluarga Besar", "Pohon keluarga interaktif, generasi leluhur & direktori kontak", FamilyTreeApp);
export const PehFamilyHealthView = wrapWithShell("Kesehatan Keluarga", "Profil golongan darah, riwayat alergi, obat rutin & kontak darurat", FamilyHealthApp);
export const PehFamilyRecipesView = wrapWithShell("Resep Warisan Keluarga", "Buku resep turun-temurun, kalkulator porsi & bumbu khas", FamilyRecipesApp);
export const PehTraditionsView = wrapWithShell("Acara & Tradisi Bersama", "Kalender reuni keluarga, tradisi tahunan & kas acara", TraditionsApp);
export const PehFamilyBudgetView = wrapWithShell("Tabungan & Dana Keluarga", "Pos dana terarah, kalkulator pendidikan anak & tabungan bersama", FamilyBudgetApp);
export const PehPetCareView = wrapWithShell("Hewan Peliharaan & Anabul", "Profil anabul, riwayat vaksinasi, jadwal vet & log berat badan", PetCareApp);

export const PehWorkflowsView = wrapWithShell("Alur Kerja & Pipeline", "Otomasi proses bisnis, tahapan eksekusi & pipeline operasional", WorkflowsApp);
export const PehVendorsView = wrapWithShell("Vendor & Rekanan Bisnis", "Direktori pihak ketiga, evaluasi SLA kontrak & log kemitraan", VendorsApp);
export const PehIncidentsView = wrapWithShell("Log Masalah & Insiden", "Pencatatan gangguan operasional, resolusi & analisis akar masalah", IncidentsApp);
export const PehProcurementView = wrapWithShell("Pengadaan & Pembelian", "Alur pengajuan belanja, Purchase Orders & matriks otorisasi", ProcurementApp);
export const PehComplianceView = wrapWithShell("Kepatuhan & Regulasi", "Audit standar industri, checklist sertifikasi & jadwal perizinan", ComplianceApp);

export const PehAssetsView = wrapWithShell("Aset Modal & Inventaris", "Daftar inventaris bernilai tinggi, penempatan & depresiasi", AssetsApp);
export const PehIpLicensesView = wrapWithShell("Hak Cipta & Lisensi IP", "Manajemen merek dagang, lisensi software, domain & paten", IpLicensesApp);
export const PehCapTableView = wrapWithShell("Struktur Saham & Ekuitas", "Tabel pemegang saham (Cap Table), persentase kepemilikan & vesting", CapTableApp);
export const PehInvestmentsView = wrapWithShell("Portofolio Investasi", "Alokasi aset instrumen pasar modal, yield dividen & reksadana", InvestmentsApp);
export const PehRealEstateView = wrapWithShell("Properti & Lahan Komersial", "Portofolio tanah, bangunan komersial, penyewa & kalkulator cap rate", RealEstateApp);

export const PehContactsView = wrapWithShell("Buku Kontak & Relasi", "Direktori relasi profesional, personal, riwayat interaksi & tag", ContactsApp);
export const PehMilestonesView = wrapWithShell("Milestone Relasi & Ulang Tahun", "Pengingat momen penting, anniversary & hari lahir rekanan", MilestonesApp);
export const PehGiftsView = wrapWithShell("Ide Kado & Tanda Kasih", "Pencatat preferensi bingkisan, riwayat kado & anggaran apresiasi", GiftsApp);
export const PehIntroductionsView = wrapWithShell("Jejaring & Perkenalan", "Log mediasi relasi dua arah, pembuka kolaborasi & follow-up", IntroductionsApp);
export const PehMentorshipView = wrapWithShell("Bimbingan & Mentoring", "Catatan sesi konsultasi, roadmap bimbingan karir & action items", MentorshipApp);

export const PehKnowledgeView = wrapWithShell("Pustaka SOP & Playbook", "Dokumentasi standar operasional, artikel panduan & panduan kerja", KnowledgeApp);
export const PehMeetingsView = wrapWithShell("Notulensi Rapat & Keputusan", "Pencatatan agenda rapat, keputusan konsensus & daftar PIC", MeetingsApp);
export const PehProjectsView = wrapWithShell("Proyek & Inisiatif Kerja", "Papan perencanaan multi-proyek, progres tahapan & deliverable", ProjectsApp);
export const PehTasksView = wrapWithShell("Tugas & Manajemen Waktu", "Daftar to-do berorientasi prioritas, delegasi tugas & tenggat", TasksApp);
export const PehTimeAuditView = wrapWithShell("Audit Waktu & Deep Work", "Pelacakan alokasi jam kerja produktif, analisis distraksi & ritme fokus", TimeAuditApp);

export const PehCivicView = wrapWithShell("Warga & Lingkungan RT/RW", "Direktori pengurus sipil, jadwal ronda, kas warga & zonasi fasilitas", CivicApp);
export const PehVolunteeringView = wrapWithShell("Relawan & Aksi Sosial", "Pencatat jam kontribusi sosial, komunitas pegiat & program sosial", VolunteeringApp);
export const PehCharityView = wrapWithShell("Filantropi & Donasi", "Rekapitulasi donasi sosial, komitmen zakat & laporan dampak", CharityApp);
export const PehCommunityEventsView = wrapWithShell("Acara & Agenda Komunitas", "Kalender kegiatan publik, kepanitiaan acara & daftar hadir", CommunityEventsApp);
export const PehAdvocacyView = wrapWithShell("Aspirasi & Laporan Fasum", "Pelaporan fasilitas umum, status penanganan & eskalasi keluhan", AdvocacyApp);

export const PehGlobalOverviewView = wrapWithShell("Ecosystem Overview", "Pusat dasbor holistik integrasi seluruh pilar kehidupan & bisnis", GlobalOverview);
export const PehInnovationsHubView = wrapWithShell("Innovations Hub", "Eksplorasi modul mutakhir, matriks korelasi & fitur lanjutan", InnovationsHub);
export const PehEcosystemComparisonView = wrapWithShell("Ecosystem Comparison", "Perbandingan komprehensif arsitektur PEH, PFS, dan POO", EcosystemComparison);
