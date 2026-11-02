import React from 'react';
import { usePEH } from '../../context/PEHContext';
import { ECOSYSTEM_COMPARISON } from '../../data/appRegistry';
import { Icon } from '../common/Icon';

export const EcosystemComparison: React.FC = () => {
  const { setActiveWorkspace, navigateTo } = usePEH();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Editorial Header */}
      <div className="pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1 rounded bg-neutral-100 text-neutral-800">
            <Icon name="ArrowLeftRight" size={16} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Arsitektur & Filosofi Sistem Triad
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Matriks Komparasi: PEH vs PFS vs POO
        </h1>
        <p className="text-sm text-neutral-600 mt-1 max-w-3xl leading-relaxed">
          Tiga pilar holistik yang mengintegrasikan fondasi pribadi & domestik (PEH), jejaring silaturahmi & keluarga (PFS),
          serta eksekusi profesional, alur bisnis & kepemilikan modal berharga (POO).
        </p>
      </div>

      {/* 3 Side-by-Side Hero Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PEH Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-300 transition-colors shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-neutral-100 text-neutral-900 font-bold text-xs font-mono">
                  PEH
                </span>
                <div>
                  <h2 className="text-sm font-bold text-neutral-900">Personal, Essentials, and Household</h2>
                  <div className="text-[11px] text-neutral-500">Dimensi Privat & Domestik</div>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-neutral-700">
              <div>
                <span className="font-semibold text-neutral-900 block mb-0.5">Pertanyaan Inti:</span>
                <p className="text-neutral-600 italic leading-relaxed">
                  "Bagaimana saya menata rutinitas diri, mengamankan sandi & berkas vital, serta merawat perabotan dan hunian fisik?"
                </p>
              </div>

              <div>
                <span className="font-semibold text-neutral-900 block mb-1">Cakupan Domain (3 Kategori):</span>
                <ul className="space-y-1 text-neutral-600 list-disc list-inside">
                  <li><strong className="text-neutral-800">Personal:</strong> Habit, Jurnal/Mood, Target Sasaran</li>
                  <li><strong className="text-neutral-800">Essentials:</strong> Brankas Kunci, Dokumen Fisik, Radar Langganan</li>
                  <li><strong className="text-neutral-800">Household:</strong> Stok Dapur, Jadwal Servis AC, Piket & Iuran</li>
                </ul>
              </div>

              <div>
                <span className="font-semibold text-neutral-900 block mb-0.5">Karakteristik Data:</span>
                <p className="text-neutral-600">
                  Operasional privat, fungsional harian, dan ketertiban satu unit rumah.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100">
            <button
              onClick={() => {
                setActiveWorkspace('peh');
                navigateTo('overview');
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              <span>Buka PEH Workspace</span>
              <Icon name="ArrowRight" size={13} />
            </button>
          </div>
        </div>

        {/* PFS Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-300 transition-colors shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs font-mono">
                  PFS
                </span>
                <div>
                  <h2 className="text-sm font-bold text-neutral-900">People, Family, and Society</h2>
                  <div className="text-[11px] text-neutral-500">Dimensi Sosial & Kekerabatan</div>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-neutral-700">
              <div>
                <span className="font-semibold text-neutral-900 block mb-0.5">Pertanyaan Inti:</span>
                <p className="text-neutral-600 italic leading-relaxed">
                  "Bagaimana saya merawat silaturahmi dengan relasi, menjaga rekam medis & silsilah keluarga, serta berkontribusi di warga?"
                </p>
              </div>

              <div>
                <span className="font-semibold text-neutral-900 block mb-1">Cakupan Domain (3 Kategori):</span>
                <ul className="space-y-1 text-neutral-600 list-disc list-inside">
                  <li><strong className="text-neutral-800">People:</strong> CRM Kontak, Ulang Tahun/Hari Jadi, Ide Kado</li>
                  <li><strong className="text-neutral-800">Family:</strong> Silsilah Trah, Profil Darah & Alergi, Acara Arisan</li>
                  <li><strong className="text-neutral-800">Society:</strong> Kontak RT/RW & Ronda, Relawan, Donasi & Zakat</li>
                </ul>
              </div>

              <div>
                <span className="font-semibold text-neutral-900 block mb-0.5">Karakteristik Data:</span>
                <p className="text-neutral-600">
                  Relasional, kolektif, berbasis empati dan kepedulian antarsesama.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100">
            <button
              onClick={() => {
                setActiveWorkspace('pfs');
                navigateTo('overview');
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-emerald-900 bg-emerald-100/80 border border-emerald-200 rounded-lg hover:bg-emerald-200/70 transition-colors shadow-xs cursor-pointer"
            >
              <span>Buka PFS Workspace</span>
              <Icon name="ArrowRight" size={13} />
            </button>
          </div>
        </div>

        {/* POO Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-300 transition-colors shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs font-mono">
                  POO
                </span>
                <div>
                  <h2 className="text-sm font-bold text-neutral-900">Productivity, Operations, and Ownership</h2>
                  <div className="text-[11px] text-neutral-500">Dimensi Eksekusi & Modal Bisnis</div>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-neutral-700">
              <div>
                <span className="font-semibold text-neutral-900 block mb-0.5">Pertanyaan Inti:</span>
                <p className="text-neutral-600 italic leading-relaxed">
                  "Bagaimana saya menuntaskan proyek berdampak, membakukan pipeline operasional vendor, dan menguasai kepemilikan aset bernilai?"
                </p>
              </div>

              <div>
                <span className="font-semibold text-neutral-900 block mb-1">Cakupan Domain (3 Kategori):</span>
                <ul className="space-y-1 text-neutral-600 list-disc list-inside">
                  <li><strong className="text-neutral-800">Productivity:</strong> Proyek & Deadline, Matriks Eisenhower, Pustaka SOP</li>
                  <li><strong className="text-neutral-800">Operations:</strong> Pipeline Alur Kerja, Kontrak Vendor/SLA, Log Insiden</li>
                  <li><strong className="text-neutral-800">Ownership:</strong> Aset Modal/Mesin, Lisensi Hak IP & Domain, Cap Table Saham</li>
                </ul>
              </div>

              <div>
                <span className="font-semibold text-neutral-900 block mb-0.5">Karakteristik Data:</span>
                <p className="text-neutral-600">
                  Strategis, kuantitatif, berorientasi nilai komersial & legalitas kepemilikan.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100">
            <button
              onClick={() => {
                setActiveWorkspace('poo');
                navigateTo('overview');
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-amber-950 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors shadow-xs cursor-pointer"
            >
              <span>Buka POO Workspace</span>
              <Icon name="ArrowRight" size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Deep Dive Comparative Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <h3 className="text-sm font-bold text-neutral-900">Tabel Komparasi Aspek Triad Kunci</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Perbandingan mendalam dimensi, pertanyaan panduan, dan sinergi antar-ketiga ekosistem.
          </p>
        </div>

        <div className="divide-y divide-neutral-100 text-xs">
          {ECOSYSTEM_COMPARISON.map((comp, idx) => (
            <div key={idx} className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Aspek Analisis
                </div>
                <h4 className="text-sm font-bold text-neutral-900">{comp.aspect}</h4>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-100">
                <div className="text-[11px] font-semibold text-neutral-700 font-mono mb-1">
                  PEH (Personal, Essentials, Household)
                </div>
                <div className="font-semibold text-neutral-900 mb-1">{comp.peh.focus}</div>
                <p className="text-neutral-600 mb-2 leading-relaxed">{comp.peh.question}</p>
                <div className="text-[11px] text-neutral-500 font-mono">
                  Contoh: {comp.peh.exampleData}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <div className="text-[11px] font-semibold text-emerald-800 font-mono mb-1">
                  PFS (People, Family, Society)
                </div>
                <div className="font-semibold text-neutral-900 mb-1">{comp.pfs.focus}</div>
                <p className="text-neutral-600 mb-2 leading-relaxed">{comp.pfs.question}</p>
                <div className="text-[11px] text-emerald-700 font-mono">
                  Contoh: {comp.pfs.exampleData}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-100">
                <div className="text-[11px] font-semibold text-amber-900 font-mono mb-1">
                  POO (Productivity, Operations, Ownership)
                </div>
                <div className="font-semibold text-neutral-900 mb-1">{comp.poo.focus}</div>
                <p className="text-neutral-600 mb-2 leading-relaxed">{comp.poo.question}</p>
                <div className="text-[11px] text-amber-800 font-mono">
                  Contoh: {comp.poo.exampleData}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
