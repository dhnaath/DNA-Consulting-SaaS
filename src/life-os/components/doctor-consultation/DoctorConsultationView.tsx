import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  DoctorConsultationItem,
  DoctorContactItem,
  PrescriptionMedicine,
  ConsultationStatus,
  PaymentCoverage,
} from '../../types';
import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Pill,
  HeartPulse,
  Activity,
  UserCheck,
  Search,
  Plus,
  Filter,
  Trash2,
  Edit2,
  ExternalLink,
  ChevronRight,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  Building2,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

const STATUS_BADGES: Record<ConsultationStatus, { label: string; bg: string; text: string; dot: string }> = {
  Scheduled: { label: 'Terjadwal', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Completed: { label: 'Selesai', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Follow-up Needed': { label: 'Perlu Kontrol', bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500' },
  Cancelled: { label: 'Dibatalkan', bg: 'bg-neutral-100', text: 'text-neutral-500', dot: 'bg-neutral-400' },
};

export const DoctorConsultationView: React.FC = () => {
  const {
    consultations,
    doctorContacts,
    addConsultation,
    updateConsultation,
    deleteConsultation,
    togglePrescriptionActive,
    addDoctorContact,
    deleteDoctorContact,
  } = useLifeOS();

  const [activeTab, setActiveTab] = useState<'consultations' | 'prescriptions' | 'doctors' | 'vitals'>('consultations');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Modals state
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [selectedConsultationForDetail, setSelectedConsultationForDetail] = useState<DoctorConsultationItem | null>(null);

  // Form State for New Consultation
  const [formDoctorName, setFormDoctorName] = useState('');
  const [formSpecialty, setFormSpecialty] = useState('Dokter Umum');
  const [formHospital, setFormHospital] = useState('RS Siloam');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState('10:00');
  const [formStatus, setFormStatus] = useState<ConsultationStatus>('Scheduled');
  const [formSymptoms, setFormSymptoms] = useState('');
  const [formDiagnosis, setFormDiagnosis] = useState('');
  const [formTreatmentPlan, setFormTreatmentPlan] = useState('');
  const [formFee, setFormFee] = useState('');
  const [formPaymentCoverage, setFormPaymentCoverage] = useState<PaymentCoverage>('Asuransi / BPJS');
  const [formFollowUpDate, setFormFollowUpDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formBp, setFormBp] = useState('120/80');
  const [formPulse, setFormPulse] = useState('72');
  const [formWeight, setFormWeight] = useState('68');
  const [formTemp, setFormTemp] = useState('36.5');

  // Prescriptions list in form
  const [formPrescriptions, setFormPrescriptions] = useState<Array<Omit<PrescriptionMedicine, 'id'>>>([]);
  const [newRxName, setNewRxName] = useState('');
  const [newRxDosage, setNewRxDosage] = useState('');
  const [newRxFreq, setNewRxFreq] = useState('');

  // Form State for New Doctor
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [docHospital, setDocHospital] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docSchedule, setDocSchedule] = useState('');
  const [docNotes, setDocNotes] = useState('');

  // Currency Formatter
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filtered consultations
  const filteredConsultations = useMemo(() => {
    return consultations.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const mDoc = c.doctorName.toLowerCase().includes(q);
        const mSpec = c.specialty.toLowerCase().includes(q);
        const mHosp = c.clinicHospital.toLowerCase().includes(q);
        const mSymp = c.symptoms.toLowerCase().includes(q);
        const mDiag = c.diagnosis?.toLowerCase().includes(q) || false;
        if (!mDoc && !mSpec && !mHosp && !mSymp && !mDiag) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [consultations, statusFilter, search]);

  // Upcoming scheduled appointment
  const upcomingAppointment = useMemo(() => {
    return consultations
      .filter((c) => c.status === 'Scheduled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [consultations]);

  // Active prescriptions across all consultations
  const allActivePrescriptions = useMemo(() => {
    const list: Array<{ consultation: DoctorConsultationItem; rx: PrescriptionMedicine }> = [];
    consultations.forEach((c) => {
      c.prescriptions.forEach((p) => {
        if (p.isActive) {
          list.push({ consultation: c, rx: p });
        }
      });
    });
    return list;
  }, [consultations]);

  // Total medical spend
  const totalMedicalSpend = useMemo(() => {
    return consultations.reduce((sum, c) => sum + (c.fee || 0), 0);
  }, [consultations]);

  const handleAddPrescriptionToForm = () => {
    if (!newRxName.trim()) return;
    setFormPrescriptions((prev) => [
      ...prev,
      {
        medicineName: newRxName.trim(),
        dosage: newRxDosage.trim() || '1 dosis',
        frequency: newRxFreq.trim() || '3x sehari sesudah makan',
        duration: '7 hari',
        isActive: true,
      },
    ]);
    setNewRxName('');
    setNewRxDosage('');
    setNewRxFreq('');
  };

  const handleCreateConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDoctorName.trim() || !formSymptoms.trim()) return;

    const prescriptionsWithIds: PrescriptionMedicine[] = formPrescriptions.map((p, idx) => ({
      ...p,
      id: 'rx-' + Date.now() + '-' + idx,
    }));

    addConsultation({
      doctorName: formDoctorName.trim(),
      specialty: formSpecialty.trim(),
      clinicHospital: formHospital.trim(),
      date: formDate,
      time: formTime || undefined,
      status: formStatus,
      symptoms: formSymptoms.trim(),
      diagnosis: formDiagnosis.trim() || undefined,
      treatmentPlan: formTreatmentPlan.trim() || undefined,
      prescriptions: prescriptionsWithIds,
      fee: parseFloat(formFee) || 0,
      paymentCoverage: formPaymentCoverage,
      followUpDate: formFollowUpDate || undefined,
      doctorNotes: formNotes.trim() || undefined,
      vitals: {
        bloodPressure: formBp.trim() || undefined,
        heartRate: parseInt(formPulse) || undefined,
        weight: parseFloat(formWeight) || undefined,
        temperature: parseFloat(formTemp) || undefined,
      },
    });

    // Reset Form
    setFormDoctorName('');
    setFormSymptoms('');
    setFormDiagnosis('');
    setFormTreatmentPlan('');
    setFormFee('');
    setFormNotes('');
    setFormPrescriptions([]);
    setIsConsultationModalOpen(false);
  };

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docSpecialty.trim()) return;

    addDoctorContact({
      name: docName.trim(),
      specialty: docSpecialty.trim(),
      hospitalClinic: docHospital.trim() || 'RS Rekanan',
      phone: docPhone.trim(),
      schedule: docSchedule.trim() || undefined,
      notes: docNotes.trim() || undefined,
    });

    setDocName('');
    setDocSpecialty('');
    setDocHospital('');
    setDocPhone('');
    setDocSchedule('');
    setDocNotes('');
    setIsDoctorModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Notion Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🩺</span>
            <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
              Notion Health System
            </span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl text-neutral-900 font-normal">
            Doctor Consultation Tracker
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Pelacak riwayat konsultasi medis, diagnosa dokter, resep obat & jadwal kontrol berkala
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsDoctorModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-lg transition-colors border border-neutral-200/70 shadow-2xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
            <span>+ Tambah Dokter</span>
          </button>

          <button
            onClick={() => setIsConsultationModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Catat Konsultasi</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-neutral-200/70 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Jadwal Mendatang</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-title text-2xl font-normal text-neutral-900">
            {consultations.filter((c) => c.status === 'Scheduled').length} Kunjungan
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {upcomingAppointment ? `Terdekat: ${upcomingAppointment.date}` : 'Tidak ada jadwal aktif'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/70 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Obat & Resep Aktif</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-title text-2xl font-normal text-amber-800">
            {allActivePrescriptions.length} Resep
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Sedang dalam masa konsumsi harian
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/70 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Biaya Medis Total</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-title text-2xl font-normal text-neutral-900">
            {formatIDR(totalMedicalSpend)}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Dari {consultations.length} sesi konsultasi
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/70 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Dokter Spesialis</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-title text-2xl font-normal text-neutral-900">
            {doctorContacts.length} Kontak
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Dokter keluarga & dokter rujukan
          </p>
        </div>
      </div>

      {/* Upcoming Scheduled Consultation Banner (if exists) */}
      {upcomingAppointment && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border border-blue-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Janji Temu Berikutnya
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  {upcomingAppointment.date} {upcomingAppointment.time ? `• ${upcomingAppointment.time} WIB` : ''}
                </span>
              </div>
              <h4 className="font-serif-title text-base sm:text-lg text-neutral-900 font-normal mt-0.5">
                {upcomingAppointment.doctorName} — {upcomingAppointment.specialty}
              </h4>
              <p className="text-xs text-neutral-600 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{upcomingAppointment.clinicHospital}</span>
                <span className="text-neutral-300">•</span>
                <span className="italic text-neutral-500">"{upcomingAppointment.symptoms}"</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => setSelectedConsultationForDetail(upcomingAppointment)}
              className="px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-medium rounded-lg border border-neutral-200 shadow-2xs transition-colors"
            >
              Lihat Detail & Resep
            </button>
            <button
              onClick={() => updateConsultation(upcomingAppointment.id, { status: 'Completed' })}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-2xs transition-colors"
            >
              Tandai Selesai
            </button>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-1">
        <button
          onClick={() => setActiveTab('consultations')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'consultations'
              ? 'bg-neutral-900 text-white shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Riwayat Konsultasi ({consultations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'prescriptions'
              ? 'bg-neutral-900 text-white shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Resep & Obat Aktif ({allActivePrescriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'doctors'
              ? 'bg-neutral-900 text-white shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Direktori Dokter ({doctorContacts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vitals')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'vitals'
              ? 'bg-neutral-900 text-white shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Log Tanda Vital & Lab</span>
        </button>
      </div>

      {/* Tab Content 1: Riwayat Konsultasi */}
      {activeTab === 'consultations' && (
        <div className="space-y-4">
          {/* Filter & View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cari dokter, spesialis, faskes, keluhan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-400"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-700 outline-hidden"
              >
                <option value="all">Semua Status</option>
                <option value="Scheduled">Terjadwal</option>
                <option value="Completed">Selesai</option>
                <option value="Follow-up Needed">Perlu Kontrol</option>
                <option value="Cancelled">Dibatalkan</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs self-end">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  viewMode === 'cards' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500'
                }`}
              >
                Kartu Detail
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  viewMode === 'table' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500'
                }`}
              >
                Tabel Notion
              </button>
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'table' ? (
            <div className="bg-white rounded-xl border border-neutral-200/70 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/70 text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                      <th className="py-2.5 px-3 font-medium">Tanggal</th>
                      <th className="py-2.5 px-3 font-medium">Dokter & Spesialis</th>
                      <th className="py-2.5 px-3 font-medium">Klinik / RS</th>
                      <th className="py-2.5 px-3 font-medium">Status</th>
                      <th className="py-2.5 px-3 font-medium">Keluhan & Diagnosa</th>
                      <th className="py-2.5 px-3 font-medium">Resep Obat</th>
                      <th className="py-2.5 px-3 font-medium text-right">Biaya</th>
                      <th className="py-2.5 px-3 text-right w-12">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredConsultations.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-neutral-400">
                          Tidak ada catatan konsultasi dokter yang cocok.
                        </td>
                      </tr>
                    ) : (
                      filteredConsultations.map((c) => {
                        const statusStyle = STATUS_BADGES[c.status];
                        return (
                          <tr key={c.id} className="hover:bg-neutral-50/70 group transition-colors">
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-neutral-600">
                              {c.date}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-medium text-neutral-800">{c.doctorName}</div>
                              <div className="text-[10px] text-neutral-400">{c.specialty}</div>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-neutral-600">
                              {c.clinicHospital}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border border-neutral-200/50 ${statusStyle.bg} ${statusStyle.text}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                <span>{statusStyle.label}</span>
                              </span>
                            </td>
                            <td className="py-2.5 px-3 max-w-xs">
                              <div className="font-medium text-neutral-700 line-clamp-1">
                                {c.symptoms}
                              </div>
                              {c.diagnosis && (
                                <div className="text-[11px] text-neutral-400 line-clamp-1 italic">
                                  Dx: {c.diagnosis}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              {c.prescriptions.length > 0 ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md font-medium">
                                  <Pill className="w-3 h-3 text-amber-600" />
                                  <span>{c.prescriptions.length} obat</span>
                                </span>
                              ) : (
                                <span className="text-neutral-400 text-[11px]">-</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-medium text-neutral-800">
                              {formatIDR(c.fee)}
                            </td>
                            <td className="py-2.5 px-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setSelectedConsultationForDetail(c)}
                                  className="p-1 text-neutral-400 hover:text-neutral-800 rounded-sm hover:bg-neutral-100"
                                  title="Lihat detail"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteConsultation(c.id)}
                                  className="p-1 text-neutral-400 hover:text-rose-600 rounded-sm hover:bg-neutral-100"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredConsultations.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-neutral-400 bg-white rounded-xl border border-neutral-200/70">
                  Tidak ada data konsultasi. Klik "+ Catat Konsultasi" untuk menambahkan.
                </div>
              ) : (
                filteredConsultations.map((c) => {
                  const statusStyle = STATUS_BADGES[c.status];
                  return (
                    <div
                      key={c.id}
                      className="bg-white rounded-xl border border-neutral-200/70 p-4 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border border-neutral-200/50 ${statusStyle.bg} ${statusStyle.text}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                              <span>{statusStyle.label}</span>
                            </span>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              {c.date} {c.time ? `• ${c.time}` : ''}
                            </span>
                          </div>
                          <h3 className="font-serif-title text-base font-normal text-neutral-900">
                            {c.doctorName}
                          </h3>
                          <p className="text-xs text-neutral-500">
                            {c.specialty} • <span className="font-medium text-neutral-700">{c.clinicHospital}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedConsultationForDetail(c)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg text-xs"
                            title="Detail"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteConsultation(c.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 rounded-lg text-xs"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Symptoms & Diagnosis */}
                      <div className="p-2.5 rounded-lg bg-neutral-50/80 border border-neutral-100 text-xs space-y-1.5">
                        <div>
                          <span className="text-neutral-400 text-[10px] uppercase font-semibold block">
                            Keluhan Utama
                          </span>
                          <span className="text-neutral-800 font-medium">{c.symptoms}</span>
                        </div>
                        {c.diagnosis && (
                          <div>
                            <span className="text-neutral-400 text-[10px] uppercase font-semibold block">
                              Diagnosa Dokter
                            </span>
                            <span className="text-neutral-700 italic">{c.diagnosis}</span>
                          </div>
                        )}
                        {c.treatmentPlan && (
                          <div>
                            <span className="text-neutral-400 text-[10px] uppercase font-semibold block">
                              Anjuran & Tindakan
                            </span>
                            <span className="text-neutral-600 text-[11px]">{c.treatmentPlan}</span>
                          </div>
                        )}
                      </div>

                      {/* Prescriptions preview */}
                      {c.prescriptions && c.prescriptions.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                            Resep Obat ({c.prescriptions.length})
                          </span>
                          <div className="space-y-1">
                            {c.prescriptions.map((rx) => (
                              <div
                                key={rx.id}
                                className="flex items-center justify-between text-xs py-1 px-2 rounded-md bg-amber-50/50 border border-amber-200/40"
                              >
                                <div className="flex items-center gap-1.5">
                                  <Pill className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span className="font-medium text-neutral-800">{rx.medicineName}</span>
                                  <span className="text-neutral-400 text-[11px]">({rx.dosage})</span>
                                </div>
                                <span className="text-[10px] text-neutral-500">{rx.frequency}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Vitals & Fee Footer */}
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
                          {c.vitals?.bloodPressure && (
                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded-sm font-mono">
                              BP: {c.vitals.bloodPressure}
                            </span>
                          )}
                          {c.vitals?.heartRate && (
                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded-sm font-mono">
                              HR: {c.vitals.heartRate} bpm
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-medium text-neutral-900">
                            {formatIDR(c.fee)}
                          </span>
                          <span className="block text-[10px] text-neutral-400">
                            {c.paymentCoverage}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Resep & Obat Aktif */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-800">
                Resep & Obat yang Sedang Dikonsumsi
              </h3>
              <p className="text-xs text-neutral-500">
                Pantau jadwal minum obat, frekuensi dosis, dan anjuran dokter
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full font-medium border border-amber-200">
              {allActivePrescriptions.length} Obat Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {allActivePrescriptions.length === 0 ? (
              <div className="col-span-full py-12 text-center text-neutral-400 bg-white rounded-xl border border-neutral-200">
                Tidak ada resep obat yang aktif saat ini.
              </div>
            ) : (
              allActivePrescriptions.map(({ consultation, rx }) => (
                <div
                  key={rx.id}
                  className="bg-white rounded-xl border border-neutral-200/70 p-4 shadow-2xs space-y-3 hover:border-amber-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-neutral-900">{rx.medicineName}</h4>
                        <span className="text-[11px] text-neutral-400 font-mono">{rx.dosage}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePrescriptionActive(consultation.id, rx.id)}
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                    >
                      Selesai Minum
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-50/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-neutral-600">
                      <span className="text-neutral-400">Aturan Minum:</span>
                      <span className="font-medium text-neutral-800">{rx.frequency}</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600">
                      <span className="text-neutral-400">Durasi:</span>
                      <span>{rx.duration}</span>
                    </div>
                    {rx.instructions && (
                      <p className="text-[11px] text-amber-800 italic pt-1 border-t border-neutral-200/40">
                        "{rx.instructions}"
                      </p>
                    )}
                  </div>

                  <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1">
                    <span>Resep dari: {consultation.doctorName}</span>
                    <span className="font-mono">{consultation.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content 3: Direktori Dokter */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-800">
                Direktori Dokter Spesialis Terpercaya
              </h3>
              <p className="text-xs text-neutral-500">
                Daftar kontak dokter rujukan, jadwal praktik, dan rumah sakit
              </p>
            </div>
            <button
              onClick={() => setIsDoctorModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Dokter</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctorContacts.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-neutral-200/70 p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-serif-title font-medium text-sm">
                      {doc.name.replace('dr. ', '').replace('drg. ', '').charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif-title text-base font-normal text-neutral-900">
                        {doc.name}
                      </h4>
                      <p className="text-xs text-blue-700 font-medium">{doc.specialty}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteDoctorContact(doc.id)}
                    className="text-neutral-400 hover:text-rose-600 p-1 rounded-sm"
                    title="Hapus dokter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{doc.hospitalClinic}</span>
                  </div>
                  {doc.address && (
                    <div className="flex items-start gap-2 text-[11px] text-neutral-500">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span>{doc.address}</span>
                    </div>
                  )}
                  {doc.schedule && (
                    <div className="flex items-center gap-2 text-[11px] text-neutral-700">
                      <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>Jadwal: {doc.schedule}</span>
                    </div>
                  )}
                  {doc.notes && (
                    <p className="text-[11px] text-neutral-500 italic bg-neutral-50 p-2 rounded-lg border border-neutral-100 mt-1">
                      {doc.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <a
                    href={`tel:${doc.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{doc.phone}</span>
                  </a>
                  <button
                    onClick={() => {
                      setFormDoctorName(doc.name);
                      setFormSpecialty(doc.specialty);
                      setFormHospital(doc.hospitalClinic);
                      setIsConsultationModalOpen(true);
                    }}
                    className="px-2.5 py-1 text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md"
                  >
                    Catat Janji Temu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 4: Vitals & Health Trends */}
      {activeTab === 'vitals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-800">
                Log Tanda Vital & Parameter Fisik
              </h3>
              <p className="text-xs text-neutral-500">
                Rekaman tekanan darah, denyut nadi, berat badan dan suhu tubuh saat pemeriksaan
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200/70 overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/70 text-neutral-500 uppercase text-[10px] font-semibold tracking-wider">
                  <th className="py-2.5 px-3 font-medium">Tanggal</th>
                  <th className="py-2.5 px-3 font-medium">Dokter / Faskes</th>
                  <th className="py-2.5 px-3 font-medium">Tekanan Darah (Tensi)</th>
                  <th className="py-2.5 px-3 font-medium">Detak Jantung</th>
                  <th className="py-2.5 px-3 font-medium">Berat Badan</th>
                  <th className="py-2.5 px-3 font-medium">Suhu Tubuh</th>
                  <th className="py-2.5 px-3 font-medium">Keterangan Lab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {consultations.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/70">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-neutral-600 whitespace-nowrap">
                      {c.date}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-neutral-800">{c.doctorName}</div>
                      <div className="text-[10px] text-neutral-400">{c.clinicHospital}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-neutral-800 whitespace-nowrap">
                      {c.vitals?.bloodPressure || '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-700 whitespace-nowrap">
                      {c.vitals?.heartRate ? `${c.vitals.heartRate} bpm` : '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-700 whitespace-nowrap">
                      {c.vitals?.weight ? `${c.vitals.weight} kg` : '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-700 whitespace-nowrap">
                      {c.vitals?.temperature ? `${c.vitals.temperature} °C` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600 max-w-xs truncate text-[11px]">
                      {c.labResultsSummary || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Catat Konsultasi Baru */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-neutral-200 p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h3 className="font-serif-title text-lg font-normal text-neutral-900">
                  Catat Konsultasi Medis Baru
                </h3>
              </div>
              <button
                onClick={() => setIsConsultationModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateConsultation} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Nama Dokter *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. dr. Sarah Wijaya, Sp.PD"
                    value={formDoctorName}
                    onChange={(e) => setFormDoctorName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Spesialisasi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Penyakit Dalam, Dokter Gigi, Kulit"
                    value={formSpecialty}
                    onChange={(e) => setFormSpecialty(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 font-medium mb-1">
                    Rumah Sakit / Klinik *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RS Siloam, Klinik Medika"
                    value={formHospital}
                    onChange={(e) => setFormHospital(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ConsultationStatus)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                  >
                    <option value="Scheduled">Terjadwal</option>
                    <option value="Completed">Selesai</option>
                    <option value="Follow-up Needed">Perlu Kontrol</option>
                    <option value="Cancelled">Dibatalkan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Tanggal Periksa *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Jam Praktik</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Alasan Konsultasi / Keluhan Utama *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Gejala yang dialami, rasa sakit, durasi keluhan..."
                  value={formSymptoms}
                  onChange={(e) => setFormSymptoms(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Diagnosa Dokter
                  </label>
                  <input
                    type="text"
                    placeholder="Hasil diagnosa medis dokter"
                    value={formDiagnosis}
                    onChange={(e) => setFormDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Anjuran / Rencana Terapi
                  </label>
                  <input
                    type="text"
                    placeholder="Pola makan, istirahat, pantangan"
                    value={formTreatmentPlan}
                    onChange={(e) => setFormTreatmentPlan(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                  />
                </div>
              </div>

              {/* Tanda Vital */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 space-y-2">
                <span className="font-semibold text-neutral-700 text-[11px] block">
                  Tanda Vital Pemeriksaan (Opsional)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-neutral-400">Tekanan Darah</label>
                    <input
                      type="text"
                      placeholder="120/80"
                      value={formBp}
                      onChange={(e) => setFormBp(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded-md font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400">Nadi (bpm)</label>
                    <input
                      type="number"
                      placeholder="72"
                      value={formPulse}
                      onChange={(e) => setFormPulse(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded-md font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400">Berat (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="68"
                      value={formWeight}
                      onChange={(e) => setFormWeight(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded-md font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400">Suhu (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      value={formTemp}
                      onChange={(e) => setFormTemp(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded-md font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Tambah Resep Obat */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-700 text-[11px]">
                    Resep Obat yang Diberikan ({formPrescriptions.length})
                  </span>
                </div>

                {formPrescriptions.length > 0 && (
                  <div className="space-y-1">
                    {formPrescriptions.map((rx, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-1.5 bg-white rounded-md border border-neutral-200 text-xs"
                      >
                        <span className="font-medium text-neutral-800">{rx.medicineName}</span>
                        <span className="text-neutral-500 text-[11px]">{rx.frequency}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormPrescriptions((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="text-rose-500 hover:text-rose-700 text-xs ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Nama Obat (e.g. Paracetamol 500mg)"
                    value={newRxName}
                    onChange={(e) => setNewRxName(e.target.value)}
                    className="px-2 py-1.5 bg-white border border-neutral-200 rounded-md text-xs sm:col-span-1"
                  />
                  <input
                    type="text"
                    placeholder="Dosis (e.g. 1 tablet)"
                    value={newRxDosage}
                    onChange={(e) => setNewRxDosage(e.target.value)}
                    className="px-2 py-1.5 bg-white border border-neutral-200 rounded-md text-xs"
                  />
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Frekuensi (e.g. 3x sehari)"
                      value={newRxFreq}
                      onChange={(e) => setNewRxFreq(e.target.value)}
                      className="px-2 py-1.5 bg-white border border-neutral-200 rounded-md text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddPrescriptionToForm}
                      className="px-2.5 py-1.5 bg-neutral-900 text-white rounded-md text-xs font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Biaya & Asuransi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Biaya Total (Rp)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formFee}
                    onChange={(e) => setFormFee(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Skema Pembayaran</label>
                  <select
                    value={formPaymentCoverage}
                    onChange={(e) => setFormPaymentCoverage(e.target.value as PaymentCoverage)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                  >
                    <option value="Asuransi / BPJS">Asuransi / BPJS</option>
                    <option value="Biaya Pribadi (Out of Pocket)">Biaya Pribadi (Out of Pocket)</option>
                    <option value="Reimbursement">Reimbursement Kantor</option>
                    <option value="Gratis / Faskes">Gratis / Faskes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Tanggal Kontrol Ulang</label>
                  <input
                    type="date"
                    value={formFollowUpDate}
                    onChange={(e) => setFormFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Catatan Tambahan Dokter</label>
                <textarea
                  rows={2}
                  placeholder="Catatan pantangan, hasil lab, atau instruksi khusus..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsConsultationModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 font-medium shadow-2xs"
                >
                  Simpan Catatan Konsultasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Dokter Baru */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-neutral-200 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-serif-title text-lg font-normal text-neutral-900">
                  Tambah Dokter Spesialis Baru
                </h3>
              </div>
              <button
                onClick={() => setIsDoctorModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Nama Lengkap Dokter & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="dr. Budi Santoso, Sp.A"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Spesialisasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spesialis Anak, Spesialis Jantung, Psikiater"
                  value={docSpecialty}
                  onChange={(e) => setDocSpecialty(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Rumah Sakit / Klinik Praktik
                </label>
                <input
                  type="text"
                  placeholder="e.g. RS Pondok Indah, Klinik Gigi Senopati"
                  value={docHospital}
                  onChange={(e) => setDocHospital(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Nomor Telepon / WhatsApp Janji Temu
                </label>
                <input
                  type="text"
                  placeholder="+62 812 xxxx xxxx"
                  value={docPhone}
                  onChange={(e) => setDocPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Jadwal Praktik Rutin
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senin & Rabu: 17.00 - 20.00 WIB"
                  value={docSchedule}
                  onChange={(e) => setDocSchedule(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  placeholder="Lokasi poli, rekomendasi rekan, dll."
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 font-medium shadow-2xs"
                >
                  Simpan Kontak Dokter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Konsultasi */}
      {selectedConsultationForDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-neutral-200 p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                  Detail Rekam Medis
                </span>
                <h3 className="font-serif-title text-xl font-normal text-neutral-900">
                  {selectedConsultationForDetail.doctorName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedConsultationForDetail(null)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-neutral-600">
                <div>
                  <span className="text-neutral-400 text-[10px] block">Spesialisasi</span>
                  <span className="font-medium text-neutral-800">{selectedConsultationForDetail.specialty}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">Rumah Sakit</span>
                  <span className="font-medium text-neutral-800">{selectedConsultationForDetail.clinicHospital}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">Tanggal & Jam</span>
                  <span className="font-mono text-neutral-800">
                    {selectedConsultationForDetail.date} {selectedConsultationForDetail.time || ''}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">Status</span>
                  <span className="font-medium text-neutral-800">{selectedConsultationForDetail.status}</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg space-y-2 border border-neutral-100">
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase font-semibold block">Keluhan</span>
                  <p className="text-neutral-800 font-medium">{selectedConsultationForDetail.symptoms}</p>
                </div>
                {selectedConsultationForDetail.diagnosis && (
                  <div>
                    <span className="text-neutral-400 text-[10px] uppercase font-semibold block">Diagnosa</span>
                    <p className="text-neutral-800 italic">{selectedConsultationForDetail.diagnosis}</p>
                  </div>
                )}
                {selectedConsultationForDetail.treatmentPlan && (
                  <div>
                    <span className="text-neutral-400 text-[10px] uppercase font-semibold block">Anjuran Terapi</span>
                    <p className="text-neutral-700">{selectedConsultationForDetail.treatmentPlan}</p>
                  </div>
                )}
              </div>

              {/* Prescriptions */}
              {selectedConsultationForDetail.prescriptions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-neutral-700 block">
                    Resep Obat yang Diberikan:
                  </span>
                  <div className="space-y-1.5">
                    {selectedConsultationForDetail.prescriptions.map((rx) => (
                      <div
                        key={rx.id}
                        className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/50 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-neutral-900">{rx.medicineName}</div>
                          <div className="text-[11px] text-neutral-500">
                            {rx.dosage} • {rx.frequency} ({rx.duration})
                          </div>
                          {rx.instructions && (
                            <div className="text-[10px] text-amber-800 italic">{rx.instructions}</div>
                          )}
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            rx.isActive ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          {rx.isActive ? 'Aktif' : 'Selesai'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vitals */}
              {selectedConsultationForDetail.vitals && (
                <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono text-[11px]">
                  <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                    <span className="text-[10px] text-neutral-400 block font-sans">Tensi</span>
                    <span>{selectedConsultationForDetail.vitals.bloodPressure || '-'}</span>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                    <span className="text-[10px] text-neutral-400 block font-sans">Nadi</span>
                    <span>{selectedConsultationForDetail.vitals.heartRate ? `${selectedConsultationForDetail.vitals.heartRate} bpm` : '-'}</span>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                    <span className="text-[10px] text-neutral-400 block font-sans">Berat</span>
                    <span>{selectedConsultationForDetail.vitals.weight ? `${selectedConsultationForDetail.vitals.weight} kg` : '-'}</span>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                    <span className="text-[10px] text-neutral-400 block font-sans">Suhu</span>
                    <span>{selectedConsultationForDetail.vitals.temperature ? `${selectedConsultationForDetail.vitals.temperature} °C` : '-'}</span>
                  </div>
                </div>
              )}

              {selectedConsultationForDetail.followUpDate && (
                <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-200/50 flex items-center justify-between">
                  <span className="text-blue-800 font-medium">Jadwal Kontrol Berikutnya:</span>
                  <span className="font-mono text-blue-900 font-semibold">{selectedConsultationForDetail.followUpDate}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                <span className="text-neutral-500 font-medium">Biaya Konsultasi & Obat:</span>
                <span className="font-mono text-sm font-semibold text-neutral-900">
                  {formatIDR(selectedConsultationForDetail.fee)} ({selectedConsultationForDetail.paymentCoverage})
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedConsultationForDetail(null)}
                className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
