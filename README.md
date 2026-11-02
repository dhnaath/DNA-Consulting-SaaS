# DNA Consulting SaaS (`dna-consulting-saas`)

Aplikasi ruang kerja konsultasi bisnis & manajemen (klien, proyek, tugas, deliverable,
dokumen, keuangan, valuasi, pajak, matriks strategi, serta 100 Tools Mini MBA).

Aplikasi ini saat ini berjalan murni di sisi frontend (**React 19 + Vite + TypeScript + TanStack Router + Zustand**) dengan penyimpanan lokal di `localStorage` dan sedang ditata bertahap menuju arsitektur SaaS multi-tenant tiga peran (`konsultan`, `mitra`, `klien`).

## Menjalankan

Prasyarat: Node.js 20+ (atau Bun).

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # pemeriksaan tipe TypeScript (tsc --noEmit)
npm run build    # hasil build produksi ke dist/
```

## Struktur Utama

```text
docs/
  ARCHITECTURE.md                 Peta 3 area (hub/partner/portal), matriks izin, & alur data
src/
  main.tsx, App.tsx, router.tsx   Entry point dan definisi rute aplikasi
  core/                           Fondasi SaaS non-UI: storage, session, permissions, areas
  app/                            Shell UI: sidebar, header, dock, modal global
  routes/                         Halaman launcher dan dashboard komoditas
  features/<nama-fitur>/          Satu folder per modul (UI, store Zustand, types)
  hooks/, lib/, config/, data/    Utilitas, profil sementara, dan konfigurasi navigasi
  life-os/, peh/                  Modul produktivitas & kesehatan pribadi (legacy)
```

Lihat [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) untuk rincian matriks hak akses, strategi migrasi kunci `localStorage`, klasifikasi modul `SaaS inti` vs `legacy/pribadi`, serta batasan keamanan sisi klien.
