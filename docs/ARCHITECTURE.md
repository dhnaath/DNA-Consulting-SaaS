# Arsitektur Aplikasi — DNA Consulting SaaS

Dokumen ini menjelaskan fondasi arsitektur lapisan non-UI yang disiapkan secara bertahap untuk mengubah aplikasi frontend monorepo (`React 19 + Vite + TypeScript + TanStack Router + Zustand`) menjadi **SaaS Konsultasi Multi-Tenant** dengan tiga peran pengguna: **Konsultan** (admin), **Mitra**, dan **Klien**.

---

## 1. Peta Tiga Area Aplikasi & Penjaga Rute Akar (`src/core/areas.ts`, `src/core/routeAccess.ts`)

Aplikasi dibagi secara konseptual ke dalam tiga area berdasarkan peran pengguna pada sesi aktif (`Session`):

| ID Area | Prefix Rute | Peran Diizinkan | Tujuan Utama |
|---|---|---|---|
| `hub` | `/` *(seluruh rute lama)* | `konsultan` | Ruang kerja penuh praktik konsultasi: manajemen klien, portofolio proyek, tugas, deliverable, dokumen, keuangan firma, valuasi/pajak, matriks strategi, dan pengaturan workspace. |
| `partner` | `/partner` | `mitra` | Ruang kerja terfokus bagi konsultan rekanan/spesialis eksternal untuk membaca proyek yang ditugaskan serta membaca/memperbarui tugas dan draf deliverable pada `session.projectIds`. |
| `portal` | `/portal` | `klien` | Portal mandiri bagi PIC perusahaan klien (`session.clientId`) untuk memantau progres proyek, mengunduh/membaca dokumen bersama, dan memberikan persetujuan (`approve`) pada deliverable. |

Fungsi standar navigasi area & konteks sesi:
- `defaultAreaFor(role)` memetakan `konsultan -> "hub"`, `mitra -> "partner"`, dan `klien -> "portal"`.
- `canEnterArea(session, area)` menjadi gerbang pemeriksaan tunggal yang dipakai oleh `resolveAccess(session, pathname)` di `src/core/routeAccess.ts`.
- `SessionContext` bersifat **fail-closed**: nilai bawaan di luar `<SessionProvider>` adalah `null` dan memanggil `useSession()` di luar provider melempar `Error` eksplisit (tidak pernah memberikan akses konsultan secara diam-diam), sementara `<SessionProvider>` mengisi `getCurrentSession()` secara sinkron pada inisialisasi `useState` render pertama sebelum `beforeLoad` router berjalan.

### Penjaga Akses di `rootRoute` (`src/router.tsx` — Batch 4)

Tanpa memindahkan atau membungkus ulang ±199 rute datar yang sudah ada, `rootRoute` menjalankan `beforeLoad` yang memanggil `resolveAccess(getCurrentSession(), location.pathname)` dan melempar `redirect()` bila akses ditolak (dengan pencegahan loop apabila tujuan pengalihan sudah sama dengan path aktif). Seluruh rute lama di luar segmen `/partner` dan `/portal` (termasuk path mirip seperti `/portalx` atau `/partnerx`) otomatis diklasifikasikan sebagai area `hub`. Pemecahan file definisi rute per area maupun pemuatan tunda (`React.lazy()`) secara sengaja **ditunda** sampai antarmuka `/partner` dan `/portal` benar-benar dibangun.

| Sesi / Peran Aktif | Area `hub` (`/`, `/wiki`, `/portalx`, dst.) | Area `partner` (`/partner`, `/partner/*`) | Area `portal` (`/portal`, `/portal/*`) | Halaman `/akses-ditolak` |
|---|---|---|---|---|
| `konsultan` *(bawaan)* | Diizinkan (`allow: true`) | Dialihkan ke `"/"` | Dialihkan ke `"/"` | Diizinkan *(rute hub)* |
| `mitra` | Dialihkan ke `"/partner"` | Diizinkan (`allow: true`) | Dialihkan ke `"/partner"` | Dialihkan ke `"/partner"` |
| `klien` | Dialihkan ke `"/portal"` | Dialihkan ke `"/portal"` | Diizinkan (`allow: true`) | Dialihkan ke `"/portal"` |
| `null` / sesi tidak valid | Dialihkan ke `"/akses-ditolak"` | Dialihkan ke `"/akses-ditolak"` | Dialihkan ke `"/akses-ditolak"` | Ditampilkan tanpa loop |

---

## 2. Alur Data Aktual (`UI -> query -> repo -> storage`)

Pada Batch 2, seluruh pembacaan dan penulisan entitas domain konsultasi di `src/lib/data.ts` (`clients`, `projects`, `tasks`, `deliverables`, `notes`, `documents`, `meetings`, `messages`) telah dipindahkan ke lapisan repository `src/core/repos/*` tanpa mengubah tanda tangan publik hook/query yang dipakai komponen UI:

```text
[ Komponen UI (HalamanKlien, HalamanCatatan, *Page.tsx, *Section.tsx) ]
        │  (tetap memanggil queryOptions publik: clientsQuery, projectsQuery, notesQuery, dst.)
        ▼
[ Adapter React Query (`src/lib/data.ts` — Batch 2) ]
        │  - Mengambil sesi aktif sinkron via `getCurrentSession()` dari `src/core/session.tsx`
        │  - Mendelegasikan baca/tulis ke repository tanpa menyentuh `localStorage` secara langsung
        ▼
[ Domain Repositories (`src/core/repos/*` — Batch 2) ]
        │  - `list(session)` menyaring koleksi melalui `scopeFor(session, resource)`
        │  - `get(session, id)` memeriksa `can(session, "read", resource, target)`
        │  - `create` / `update` / `remove` / `replaceAll` / `approve` memeriksa `can(...)`
        │    (selalu menyertakan `target.workspaceId` via `RepositoryPermissionTarget`)
        │    dan melempar `ForbiddenError` apabila ditolak
        ▼
[ Core Workspace Storage (`src/core/storage.ts` — Batch 1 s/d 3C-2) ]
        │  - Namespace wajib `${workspaceId}:${key}` (default workspace: `ws-main:<key>`)
        │  - Kebijakan **lazy read-fallback** (tanpa salin massal): membaca `${workspaceId}:${key}`
        │    lebih dulu, lalu jatuh kembali ke kunci legacy (khusus `"ws-main"`) bila kunci baru belum ada
        │  - Pembersihan sekali jalan `reconcileBulkSnapshots()` berpenjaga `ws-main:reconcile_v1`
        │    menghapus snapshot massal basi milik modul yang belum diadopsi sebelum Batch 3C-2
        ▼
[ Browser `window.localStorage` ]
```

### Pembersihan Cache React Query (`queryClient.clear()`) Saat Perpindahan Sesi
Definisi `queryOptions` publik di `src/lib/data.ts` (`clientsQuery`, `projectsQuery`, `notesQuery`, dst.) mempertahankan `queryKey` statis (`["clients"]`, `["projects"]`, dst.) agar komponen pemanggil tidak perlu diubah. Karena itu, `<SessionProvider queryClient={queryClient}>` di `src/App.tsx` **wajib dan otomatis memanggil `queryClient.clear()` (diikuti `invalidateQueries()`)** setiap kali `role`, `workspaceId`, `userId`, `clientId`, atau cakupan `projectIds` berubah. Hal ini memastikan data sesi sebelumnya tidak pernah tertinggal di memori cache React Query dan observer UI aktif langsung memuat ulang data sesuai hak sesi baru.

### Kebijakan Migrasi Storage: *Lazy Read-Fallback* + Rekonsiliasi Snapshot Sekali Jalan
1. **Tanpa Salin Massal (*No Bulk Copy*)**: Mulai Batch 3C-2, `src/core/bootstrap.ts` **tidak lagi memanggil `migrateLegacyKeys()`** (fungsi tersebut tetap dipertahankan di `src/core/storage.ts` dengan penanda tidak dipakai). Salin massal seluruh kunci lama di awal sesi dihentikan karena membuat snapshot basi pada kunci baru `ws-main:*` milik modul yang masih menulis ke kunci lama, sehingga menimpa perubahan terbaru pengguna ketika modul tersebut kelak dipindahkan.
2. ***Lazy Read-Fallback* Non-Destruktif**: `readWorkspaceOrLegacy()`, `createWorkspaceStorage()`, dan `getRaw()` selalu membaca `${workspaceId}:<tujuan>` lebih dulu; jika belum ada (pada `"ws-main"`), langsung membaca kunci legacy tanpa menulis apa pun saat membaca. Kunci baru baru tercipta ketika modul yang sudah diadopsi melakukan penulisan, sementara kunci legacy tidak pernah dihapus atau ditimpa.
3. **`reconcileBulkSnapshots(workspaceId)` Sekali Jalan**: Dipanggil oleh `src/core/bootstrap.ts` dengan penjaga idempoten `${workspaceId}:reconcile_v1`. Fungsi ini memeriksa seluruh target `LEGACY_KEY_MAP` dan `LEGACY_DYNAMIC_PREFIX_MAP` yang **tidak** terdaftar di `ADOPTED_TARGETS` (daftar target yang sudah menulis ke kunci baru sebelum Batch 3C-2: 21 store Zustand `persist` 3A/3B/3B-2, 4 store hook 3C-1, dan 5 repository `wira_consulting_*` Batch 2), lalu menghapus snapshot `ws-main:<tujuan>` yang basi agar modul yang baru dipindah membaca data terbaru dari kunci legacy. Kunci di dalam `ADOPTED_TARGETS`, kunci non-peta (`migrated_v1`, `reconcile_v1`, `prefs.lang`, `clients.consulting_v1`, `tasks.consulting_v1`), dan seluruh kunci legacy **tidak pernah disentuh**.
4. **Prioritas Bahasa**: Tombol bahasa utama (`src/app/shell/LanguageToggle.tsx`) terverifikasi menulis dan memprioritaskan `aio_lang` lebih dulu baru `appLanguage` (sedangkan `src/app/theme-lang-toggle.tsx` hanya mengelola tema). `getUnifiedLanguage()` mengikuti urutan: `ws-main:prefs.lang` -> `aio_lang` -> `appLanguage` -> `"id"`.

---

## 3. Matriks Izin (`can`) & Penyaringan Daftar (`scopeFor`) (`src/core/permissions.ts`)

Pemeriksaan per-item memakai `can(session, action, resource, target)` (dengan `target.workspaceId` wajib di semua repository), sedangkan penyaringan daftar di `repo.list(session)` memakai `scopeFor(session, resource)`.

### A. Tabel `MATRIX[role][resource]` (`can`)

Keterangan aksi: `R` = `read`, `W` = `write`, `D` = `delete`, `S` = `share`, `A` = `approve`.

| Resource | `konsultan` | `mitra` | `klien` | Aturan Cakupan Tambahan (`target`) |
|---|---|---|---|---|
| `client` | `R, W, D, S, A` | — | — | Hanya internal firma (`konsultan`). |
| `project` | `R, W, D, S, A` | `R` *(scoped)* | `R` *(scoped)* | **Mitra**: `READ_ONLY`, ID proyek wajib ada di `session.projectIds`. **Klien**: `target.clientId === session.clientId`. |
| `task` | `R, W, D, S, A` | `R, W` *(scoped)* | — | **Mitra**: `target.projectId` wajib ada di `session.projectIds`. |
| `deliverable` | `R, W, D, S, A` | `R, W` *(scoped)* | `R, A` *(scoped)* | **Mitra**: `target.projectId` ada di `session.projectIds`. **Klien**: `target.clientId === session.clientId`. |
| `document` | `R, W, D, S, A` | — | `R` *(scoped)* | **Klien**: `target.clientId === session.clientId` (dan `dibagikan_ke_klien === true` di `documentsRepo`). |
| `note` | `R, W, D, S, A` | — | — | Catatan internal konsultan. |
| `approval` | `R, W, D, S, A` | — | — | Alur persetujuan internal firma. |
| `meeting` | `R, W, D, S, A` | — | — | Jadwal & notula internal firma. |
| `finance` | `R, W, D, S, A` | — | — | Dilarang keras bagi `mitra` maupun `klien`. |
| `settings` | `R, W, D, S, A` | — | — | Konfigurasi workspace hanya untuk `konsultan`. |
| `collaboration` | `R, W, D, S, A` | — | — | Manajemen anggota, tim, role workspace, & pesan internal (`messagesRepo`). |
| `personal_tools` | `R, W, D, S, A` | — | — | Modul legacy/pribadi hanya terlihat oleh pemilik workspace (`konsultan`). |

### B. Tabel Perilaku `scopeFor(session, resource)`

| Kondisi / Peran Sesi | Resource yang `allowed: true` | Resource yang `allowed: false` | Predikat `filter(item)` |
|---|---|---|---|
| Sesi `null` / field wajib kosong (`userId`, `workspaceId`, `clientId` pada klien, atau `projectIds` kosong pada mitra) | Tidak ada *(fail-closed)* | Seluruh 12 resource | Selalu `false` (`repo.list` menghasilkan `[]`). |
| `konsultan` | Seluruh 12 resource | Tidak ada | `true` untuk seluruh item di `session.workspaceId` (tolak `workspaceId` lain). |
| `mitra` (dengan `projectIds` tidak kosong) | `project`, `task`, `deliverable` | `client`, `document`, `note`, `approval`, `meeting`, `finance`, `settings`, `collaboration`, `personal_tools` | `workspaceId` cocok **dan** `id` / `projectId` / `project_id` masuk dalam `session.projectIds`. |
| `klien` (dengan `clientId` tidak kosong) | `project`, `deliverable`, `document` | `client`, `task`, `note`, `approval`, `meeting`, `finance`, `settings`, `collaboration`, `personal_tools` | `workspaceId` cocok **dan** `clientId` / `client_id` sama persis dengan `session.clientId`. |

### Keselarasan Terminologi dengan `features/collaboration/store.ts`
Tanpa mengubah kode `collaboration/store.ts`, `COLLABORATION_ROLE_MAP` menyelaraskan tiga peran SaaS dengan role sistem yang sudah ada:
- `konsultan` <-> `role-admin` (*Workspace Administrator*) dan mencakup kapabilitas `role-finance` (*Finance Approver*).
- `mitra` <-> `role-editor` (*Standard Editor*, `read` proyek serta `read`/`write` tugas & deliverable pada proyek penugasan).
- `klien` <-> `role-viewer` (*Read-Only Stakeholder*, ditambah aksi `approve` pada `deliverable` miliknya).

---

## 4. Klasifikasi Modul: `SaaS Inti` vs `Legacy / Pribadi`

Sesuai aturan arsitektur, **tidak ada modul atau rute yang dihapus**. Modul non-konsultasi ditandai sebagai `legacy/pribadi` agar tetap berfungsi bagi pengguna lama tetapi tidak diekspos ke area `partner` maupun `portal`.

### A. Modul `SaaS Inti` (Praktik Konsultasi, Operasional Klien, & Analitik Bisnis)
- **Manajemen Klien & Hubungan**: `klien`, `people-manager`, `interaction-manager`, `komunitas` (direktori jaringan profesional).
- **Manajemen Proyek, Eksekusi, & Deliverable**: `project-manager`, `task-manager`, `kanban`, `timeline`, `milestone-manager`, `deliverable-manager`, `resource-manager`, `time-tracker`, `schedule-manager`, `workflow-manager`, `approval-manager`.
- **Dokumen, Pengetahuan, & Riset Konsultasi**: `documents`, `asset-manager`, `notes`, `wiki`, `knowledge-base`, `research-manager`, `research-frameworks`, `template-manager`, `forms`, `bookmark-manager`, `web-clipper`.
- **Komunikasi, Kolaborasi, & Pertemuan**: `collaboration`, `meeting-manager`, `calendar`, `notification-center`, `search-manager`, `reminder-manager`.
- **Keuangan Korporat, Valuasi, Pajak, & Strategi Bisnis**: `business-operations` (termasuk 100 Tools Mini MBA & 12 modul administrasi bisnis), `valuation`, `value-treated`, `tax`, `incoterms`, `matriks`, `product`, `expense-tracker` (biaya proyek/operasional), `subscription-manager` (langganan perangkat kerja firma), `statistics`, `database`.
- **Produktivitas Kerja Konsultan**: `work-productivity`, `planner`, `eisenhower`, `focus-timer`, `goal-manager`, `countdown`, `creative-workspace`, `launcher`, `standalone` (wadah peluncur).

### B. Modul `Legacy / Pribadi` (Dipertahankan Utuh, Khusus `personal_tools` Konsultan)
- **Life OS & Executive Health**: `src/life-os/` (`life_planner_os_v1_*`), `src/peh/` (Personal Executive Health / `peh_pfs_workspace_v2`), `personal-life`, `habit-tracker`, `water` (pelacak hidrasi).
- **Keluarga, Rumah Tangga, & Hiburan Pribadi**: `family-community`, `family-records`, `home-leisure` (resep, pantry, film, musik, gim, perjalanan), `society`, `public-affairs`, `social-networks`, `knowledge-learning` (flashcard/kursus pribadi), `curated`, `nonWhiteApps`.
- **Keuangan Pribadi, Syariah Personal, & Vault Pribadi**:
  - `syariah` dan `zakat` (kalkulator zakat/waris personal; dapat dipromosikan sebagian ke alat konsultasi syariah bila dibutuhkan kemudian).
  - Sub-fitur keuangan rumah tangga/pribadi di `finance`, `credit`, dan `investment` (seperti `manajemen_debts`, `bills_list`, `savings_plans`, `stocks_list`).
  - Sub-fitur personal di `wira` (`wira_passwords_vault_v2` / penyimpan kata sandi lokal, `wira_journal_entries_v2` / jurnal pribadi), sementara artefak `wira_consulting_*` akan dikonsolidasikan ke repositori domain konsultasi pada Batch 2–3.

---

## 5. Adaptor `persist` (`src/core/persistStorage.ts` & `src/core/bootstrap.ts`)

Mulai Batch 3A, modul-modul fitur berbasis Zustand `persist` dipindahkan secara bertahap ke namespace `ws-main:<kunci_tujuan>` menggunakan `createWorkspaceStorage()` dari `src/core/persistStorage.ts` tanpa mengubah `name` pada opsi `persist` maupun tanda tangan publik store.

### Cara Kerja `createWorkspaceStorage()` & Aturan Workspace Terkunci Saat Store Dibuat
1. **Workspace Terkunci Saat Pembuatan Store (Anti-Kebocoran Antar-Tenant)**:
   - `lockedWorkspaceId` ditentukan **sekali** pada saat `createWorkspaceStorage()` dipanggil (ketika store Zustand dibuat/diinisialisasi) dari `getCurrentSession()?.workspaceId ?? DEFAULT_WORKSPACE_ID` (default `"ws-main"`), lalu dipakai selamanya untuk `getItem`, `setItem`, dan `removeItem` milik store tersebut.
   - Pada `setItem`, adaptor membandingkan `lockedWorkspaceId` dengan `getCurrentSession()?.workspaceId`. Apabila sesi aktif beralih ke `workspaceId` lain saat runtime, penulisan **dibatalkan (`no-op`)** agar state memori dari workspace lama tidak bocor ke kunci workspace baru, disertai peringatan `console.warn` yang jelas di mode `DEV` (`import.meta.env.DEV`).
   - Pergantian `workspaceId` saat runtime **wajib dilakukan melalui muat ulang halaman penuh** (*full page reload*).
2. **Resolusi Kunci Tujuan**: Menerjemahkan `name` lama (mis. `"ecosystem-approval-manager-storage"`) melalui `resolveLegacyKeyTarget(name)` di `src/core/storage.ts` menjadi kunci tujuan (mis. `"approvals.ecosystem_v1"`). Jika bukan kunci legacy terdaftar, `name` dipakai apa adanya.
3. **Pembacaan Non-Destruktif (`getItem`)**:
   - Membaca `${lockedWorkspaceId}:${tujuan}` terlebih dahulu.
   - Apabila kunci baru belum tersedia di `localStorage` (pada workspace default `"ws-main"`), langsung membaca kunci lama `name` dan mengembalikan string JSON mentahnya **tanpa menulis apa pun saat membaca**.
   - Format payload string JSON `{ state, version }` dipertahankan 100% identik dengan bawaan `createJSONStorage` Zustand sehingga data lama terbaca tanpa transformasi skema.
4. **Penulisan & Penghapusan Satu Arah (`setItem` / `removeItem`)**:
   - `setItem` menulis **hanya** ke kunci baru `${lockedWorkspaceId}:${tujuan}` (selama workspace sesi cocok dengan `lockedWorkspaceId`) dan tidak pernah menyentuh kunci lama.
   - `removeItem` menghapus **hanya** kunci baru `${lockedWorkspaceId}:${tujuan}` dan tidak pernah menghapus kunci lama.
   - Seluruh operasi dibungkus `try/catch` sehingga error akses storage tidak pernah melempar exception keluar ke komponen UI.
5. **Independensi Urutan Evaluasi Modul & Bootstrap (`src/core/bootstrap.ts`)**:
   - `src/main.tsx` mengimpor `./core/bootstrap` pada baris paling pertama untuk menjalankan `reconcileBulkSnapshots()` secara idempoten satu kali di dalam `try/catch` (menggantikan `migrateLegacyKeys()` sejak Batch 3C-2).
   - Karena store Zustand maupun modul `rawStorage.ts` dapat dievaluasi pada saat `import` modul ES, baik `createWorkspaceStorage()` maupun `rawStorage` dirancang mandiri melalui mekanisme *lazy read-fallback*.

### Alat Bantu Akses Mentah `rawStorage` (`src/core/rawStorage.ts` — Batch 3C-1 & 3C-2)

Seluruh **18 modul fitur berbasis React Hook manual** (`useState` + `useEffect` + `JSON.parse`/`JSON.stringify`) beserta 1 pembaca lintas-modul di UI (`KnowledgeBaseApp.tsx`) kini memakai `getRaw(key)`, `setRaw(key, value)`, dan `removeRaw(key)` dari `src/core/rawStorage.ts`.

1. **Aturan Identik dengan `createWorkspaceStorage()`**:
   - Kunci tujuan diterjemahkan lewat `resolveLegacyKeyTarget(key) ?? key`.
   - `LOCKED_WORKSPACE_ID` dikunci **sekali** pada saat modul `rawStorage.ts` dievaluasi pertama kali (`getCurrentSession()?.workspaceId ?? DEFAULT_WORKSPACE_ID`), bukan dibaca ulang pada setiap pemanggilan fungsi.
   - `getRaw(key)` membaca `${LOCKED_WORKSPACE_ID}:<tujuan>` lebih dulu, lalu jatuh kembali ke kunci lama `key` (khusus `"ws-main"`) tanpa pernah menulis saat membaca.
   - `setRaw(key, value)` menulis **hanya** ke kunci baru `${LOCKED_WORKSPACE_ID}:<tujuan>`, serta melakukan `no-op` + `console.warn` di mode `DEV` apabila `workspaceId` sesi aktif berbeda dari `LOCKED_WORKSPACE_ID`.
   - `removeRaw(key)` menghapus **hanya** kunci baru `${LOCKED_WORKSPACE_ID}:<tujuan>` tanpa menyentuh kunci lama.
   - Seluruh akses `localStorage` dibungkus `try/catch` dan tidak pernah melempar error keluar.
2. **Catatan Perilaku Sinkronisasi pada Store Hook**:
   - Sebagian besar store berbasis React Hook (17 dari 18 store) menjalankan `useEffect(() => { setRaw(KEY, JSON.stringify(state)); }, [state])` saat komponen pertama kali dipasang (*initial mount*), sehingga kunci baru `ws-main:<tujuan>` langsung terbentuk saat mount pertama tanpa menyentuh kunci lama. Khusus `features/task-manager/store.ts`, state dimuat ke singleton tingkat modul saat evaluasi file dan `setRaw` baru dipanggil ketika aksi memutasi state (`notifyListeners`).
3. **Utang Teknis (Duplikasi Aturan `rawStorage.ts` vs `persistStorage.ts`)**:
   - Sesuai batasan isolasi Batch 3C yang melarang penyuntingan `src/core/persistStorage.ts`, mekanisme penguncian `workspaceId`, pemeriksaan `no-op` lintas-tenant di `setItem`/`setRaw`, dan urutan fallback baca diduplikasi secara eksplisit di antara `src/core/persistStorage.ts` dan `src/core/rawStorage.ts`. Penyatuan keduanya ke satu primitif internal di `src/core/` dicatat sebagai utang teknis untuk tahap perapian berikutnya.

### Peta Ketergantungan Silang Akhir Kunci `aio_*` (18 Store Hook + 1 Pengecualian UI)

Seluruh 18 store hook dan 1 pembaca lintas-modul di `KnowledgeBaseApp.tsx` telah sepenuhnya beralih ke `rawStorage` (4 store mandiri pada Batch 3C-1 dan 14 store saling terhubung + `KnowledgeBaseApp.tsx` secara serentak pada Batch 3C-2):

| Modul / File | Kunci Lama -> Kunci Baru Milik Sendiri | Membaca Kunci Milik Modul Lain (`getRaw`) | Menulis Kunci Milik Modul Lain (`setRaw`) | Batch |
|---|---|---|---|---|
| `features/habit-tracker/store.ts` | `aio_habit_tracker_data_v1` -> `ws-main:legacy.habit_tracker_v1` | — | — | **Batch 3C-1** |
| `features/reminder-manager/store.ts` | `aio_reminder_manager_data_v1` -> `ws-main:reminders.data_v1` | — | — | **Batch 3C-1** |
| `features/database/store.ts` | `aio_database_data_v1` -> `ws-main:database.data_v1` | — | — | **Batch 3C-1** |
| `features/wiki/store.ts` | `aio_wiki_data_v1` -> `ws-main:wiki.data_v1` | — | — | **Batch 3C-1** |
| `features/task-manager/store.ts` | `aio_task_manager_data_v2` -> `ws-main:tasks.manager_v2` *(khusus v2)* | — | — | **Batch 3C-2** |
| `features/project-manager/store.ts` | `aio_project_manager_data_v1` -> `ws-main:projects.manager_v1` | `tasks.manager_v1` | `tasks.manager_v1` | **Batch 3C-2** |
| `features/calendar/store.ts` | `aio_calendar_data_v1` -> `ws-main:calendar.data_v1` | `tasks.manager_v1`, `projects.manager_v1` | `tasks.manager_v1`, `projects.manager_v1` | **Batch 3C-2** |
| `features/eisenhower/store.ts` | `aio_eisenhower_matrix_data_v1` -> `ws-main:eisenhower.data_v1` | `tasks.manager_v1`, `planner.data_v1` | `tasks.manager_v1`, `planner.data_v1` | **Batch 3C-2** |
| `features/focus-timer/store.ts` | `aio_focus_timer_data_v1` -> `ws-main:focus_timer.data_v1` | `tasks.manager_v1` | `tasks.manager_v1` | **Batch 3C-2** |
| `features/kanban/store.ts` | `aio_kanban_board_data_v1` -> `ws-main:kanban.board_v1` | `tasks.manager_v1` | `tasks.manager_v1` | **Batch 3C-2** |
| `features/planner/store.ts` | `aio_planner_data_v1` -> `ws-main:planner.data_v1` | `tasks.manager_v1`, `calendar.data_v1` | `tasks.manager_v1` | **Batch 3C-2** |
| `features/timeline/store.ts` | `aio_timeline_manager_data_v1` -> `ws-main:timeline.data_v1` | `tasks.manager_v1`, `projects.manager_v1` | — | **Batch 3C-2** |
| `features/notes/store.ts` | `aio_notes_data_v1` -> `ws-main:notes.data_v1` | `tasks.manager_v1` | `tasks.manager_v1` | **Batch 3C-2** |
| `features/countdown/store.ts` | `aio_countdown_data_v1` -> `ws-main:countdown.data_v1` | `projects.manager_v1`, `calendar.data_v1` | — | **Batch 3C-2** |
| `features/documents/store.ts` | `aio_documents_data_v1` -> `ws-main:documents.data_v1` | — *(ekspor konstanta `PROJECT_STORAGE_KEY` dipertahankan)* | — | **Batch 3C-2** |
| `features/knowledge-base/store.ts` | `aio_knowledge_base_data_v1` -> `ws-main:knowledge_base.data_v1` | — *(ditulis oleh `research-manager` & `web-clipper`)* | — | **Batch 3C-2** |
| `features/knowledge-base/KnowledgeBaseApp.tsx` *(1 baris pengecualian UI)* | — | `notes.data_v1` (`getRaw("aio_notes_data_v1")` pada `availableNotesToPromote`) | — | **Batch 3C-2** |
| `features/research-manager/store.ts` | `aio_research_manager_data_v1` -> `ws-main:research.data_v1` | `knowledge_base.data_v1` | `knowledge_base.data_v1` | **Batch 3C-2** |
| `features/web-clipper/store.ts` | `aio_web_clipper_data_v1` -> `ws-main:web_clipper.data_v1` | `notes.data_v1`, `knowledge_base.data_v1`, `research.data_v1` | `notes.data_v1`, `knowledge_base.data_v1`, `research.data_v1` | **Batch 3C-2** |

> **Catatan Arsitektur Penting (Pemisahan Warisan `tasks.manager_v1` vs `tasks.manager_v2`)**:
> Terpecahnya penyimpanan tugas antara `aio_task_manager_data_v2` -> `ws-main:tasks.manager_v2` (dipakai eksklusif oleh `features/task-manager/store.ts` dengan skema v2) dan `aio_task_manager_data_v1` -> `ws-main:tasks.manager_v1` (dibaca/ditulis bersama oleh 8 modul pendamping: `project-manager`, `calendar`, `eisenhower`, `focus-timer`, `kanban`, `planner`, `timeline`, dan `notes`) adalah **perilaku warisan yang secara sengaja dipertahankan apa adanya**. Menyatukan keduanya pada tahap migrasi storage akan mengubah perilaku lintas-modul dan berisiko merusak kecocokan skema objek `Task` antar-versi. Sinkronisasi antar-modul pendamping tetap berjalan mulus melalui `window.dispatchEvent(new Event("aio_data_updated"))` dan `window.dispatchEvent(new Event("storage"))`.

### Tabel Status Migrasi Storage per Modul

| Kategori / Modul | File Store | Kunci Lama (`localStorage`) | Kunci Baru (`ws-main:*`) | Status Migrasi |
|---|---|---|---|---|
| **Zustand `persist` — Batch 3A (3 Store)** | | | | |
| Approval Manager | `src/features/approval-manager/store.ts` | `ecosystem-approval-manager-storage` | `ws-main:approvals.ecosystem_v1` | **Selesai (Batch 3A)** |
| Deliverable Manager | `src/features/deliverable-manager/store.ts` | `ecosystem-deliverable-manager-storage` | `ws-main:deliverables.ecosystem_v1` | **Selesai (Batch 3A)** |
| Interaction Manager | `src/features/interaction-manager/store.ts` | `ecosystem-interaction-manager-storage` | `ws-main:clients.interactions_v1` | **Selesai (Batch 3A)** |
| **Zustand `persist` — Batch 3B (10 Store)** | | | | |
| Asset Manager | `src/features/asset-manager/store.ts` | `ecosystem-asset-manager-storage` | `ws-main:documents.asset_manager_v1` | **Selesai (Batch 3B)** |
| Meeting Manager | `src/features/meeting-manager/store.ts` | `ecosystem-meeting-manager-storage` | `ws-main:meetings.ecosystem_v1` | **Selesai (Batch 3B)** |
| Milestone Manager | `src/features/milestone-manager/store.ts` | `ecosystem-milestone-manager-storage` | `ws-main:projects.milestones_v1` | **Selesai (Batch 3B)** |
| Notification Center | `src/features/notification-center/store.ts` | `ecosystem-notification-center-storage` | `ws-main:notifications.ecosystem_v1` | **Selesai (Batch 3B)** |
| People Manager | `src/features/people-manager/store.ts` | `ecosystem-people-manager-storage` | `ws-main:clients.people_v1` | **Selesai (Batch 3B)** |
| Resource Manager | `src/features/resource-manager/store.ts` | `ecosystem-resource-manager-storage` | `ws-main:projects.resources_v1` | **Selesai (Batch 3B)** |
| Schedule Manager | `src/features/schedule-manager/store.ts` | `ecosystem-schedule-manager-storage` | `ws-main:meetings.schedules_v1` | **Selesai (Batch 3B)** |
| Template Manager | `src/features/template-manager/store.ts` | `ecosystem-template-manager-storage` | `ws-main:templates.ecosystem_v1` | **Selesai (Batch 3B)** |
| Time Tracker | `src/features/time-tracker/store.ts` | `ecosystem-time-tracker-storage` | `ws-main:projects.time_tracker_v1` | **Selesai (Batch 3B)** |
| Workflow Manager | `src/features/workflow-manager/store.ts` | `ecosystem-workflow-manager-storage` | `ws-main:workflows.ecosystem_v1` | **Selesai (Batch 3B)** |
| **Zustand `persist` — Batch 3B-2 (8 Store)** | | | | |
| Bookmark Manager | `src/features/bookmark-manager/store.ts` | `ecosystem-bookmark-manager-storage` | `ws-main:bookmarks.ecosystem_v1` | **Selesai (Batch 3B-2)** |
| Collaboration *(aksi `workspaceId` mengikuti sesi; role hanya tampilan)* | `src/features/collaboration/store.ts` | `ecosystem-collaboration-storage` | `ws-main:collaboration.ecosystem_v1` | **Selesai (Batch 3B-2)** |
| Expense Tracker | `src/features/expense-tracker/store.ts` | `ecosystem-expense-tracker-storage` | `ws-main:finance.expense_tracker_v1` | **Selesai (Batch 3B-2)** |
| Forms | `src/features/forms/store.ts` | `ecosystem-forms-storage` | `ws-main:forms.ecosystem_v1` | **Selesai (Batch 3B-2)** |
| Goal Manager | `src/features/goal-manager/store.ts` | `ecosystem-goal-manager-storage` | `ws-main:goals.ecosystem_v1` | **Selesai (Batch 3B-2)** |
| Search Manager | `src/features/search-manager/store.ts` | `ecosystem-search-manager-storage` | `ws-main:search.ecosystem_v1` | **Selesai (Batch 3B-2)** |
| Statistics | `src/features/statistics/store.ts` | `ecosystem-statistics-storage` | `ws-main:analytics.statistics_v1` | **Selesai (Batch 3B-2)** |
| Subscription Manager | `src/features/subscription-manager/store.ts` | `ecosystem-subscription-manager-storage` | `ws-main:finance.subscriptions_ecosystem_v1` | **Selesai (Batch 3B-2)** |
| **Store Hook Mandiri (`rawStorage`) — Batch 3C-1 (4 Store)** | | | | |
| Habit Tracker | `src/features/habit-tracker/store.ts` | `aio_habit_tracker_data_v1` | `ws-main:legacy.habit_tracker_v1` | **Selesai (Batch 3C-1)** |
| Reminder Manager | `src/features/reminder-manager/store.ts` | `aio_reminder_manager_data_v1` | `ws-main:reminders.data_v1` | **Selesai (Batch 3C-1)** |
| Database | `src/features/database/store.ts` | `aio_database_data_v1` | `ws-main:database.data_v1` | **Selesai (Batch 3C-1)** |
| Wiki | `src/features/wiki/store.ts` | `aio_wiki_data_v1` | `ws-main:wiki.data_v1` | **Selesai (Batch 3C-1)** |
| **Store Hook Saling Terhubung (`rawStorage`) — Batch 3C-2 (14 Store + 1 Baris UI)** | | | | |
| Task Manager | `src/features/task-manager/store.ts` | `aio_task_manager_data_v2` | `ws-main:tasks.manager_v2` | **Selesai (Batch 3C-2)** |
| Project Manager | `src/features/project-manager/store.ts` | `aio_project_manager_data_v1` *(+ r/w `tasks.manager_v1`)* | `ws-main:projects.manager_v1` | **Selesai (Batch 3C-2)** |
| Calendar | `src/features/calendar/store.ts` | `aio_calendar_data_v1` *(+ r/w `tasks.manager_v1`, `projects.manager_v1`)* | `ws-main:calendar.data_v1` | **Selesai (Batch 3C-2)** |
| Eisenhower Matrix | `src/features/eisenhower/store.ts` | `aio_eisenhower_matrix_data_v1` *(+ r/w `tasks.manager_v1`, `planner.data_v1`)* | `ws-main:eisenhower.data_v1` | **Selesai (Batch 3C-2)** |
| Focus Timer | `src/features/focus-timer/store.ts` | `aio_focus_timer_data_v1` *(+ r/w `tasks.manager_v1`)* | `ws-main:focus_timer.data_v1` | **Selesai (Batch 3C-2)** |
| Kanban Board | `src/features/kanban/store.ts` | `aio_kanban_board_data_v1` *(+ r/w `tasks.manager_v1`)* | `ws-main:kanban.board_v1` | **Selesai (Batch 3C-2)** |
| Daily Planner | `src/features/planner/store.ts` | `aio_planner_data_v1` *(+ r/w `tasks.manager_v1`; r `calendar.data_v1`)* | `ws-main:planner.data_v1` | **Selesai (Batch 3C-2)** |
| Timeline Manager | `src/features/timeline/store.ts` | `aio_timeline_manager_data_v1` *(+ r `tasks.manager_v1`, `projects.manager_v1`)* | `ws-main:timeline.data_v1` | **Selesai (Batch 3C-2)** |
| Notes *(+ `KnowledgeBaseApp.tsx:295`)* | `src/features/notes/store.ts` | `aio_notes_data_v1` *(+ r/w `tasks.manager_v1`)* | `ws-main:notes.data_v1` | **Selesai (Batch 3C-2)** |
| Countdown | `src/features/countdown/store.ts` | `aio_countdown_data_v1` *(+ r `projects.manager_v1`, `calendar.data_v1`)* | `ws-main:countdown.data_v1` | **Selesai (Batch 3C-2)** |
| Documents | `src/features/documents/store.ts` | `aio_documents_data_v1` | `ws-main:documents.data_v1` | **Selesai (Batch 3C-2)** |
| Knowledge Base | `src/features/knowledge-base/store.ts` | `aio_knowledge_base_data_v1` | `ws-main:knowledge_base.data_v1` | **Selesai (Batch 3C-2)** |
| Research Manager | `src/features/research-manager/store.ts` | `aio_research_manager_data_v1` *(+ r/w `knowledge_base.data_v1`)* | `ws-main:research.data_v1` | **Selesai (Batch 3C-2)** |
| Web Clipper | `src/features/web-clipper/store.ts` | `aio_web_clipper_data_v1` *(+ r/w `notes.data_v1`, `knowledge_base.data_v1`, `research.data_v1`)* | `ws-main:web_clipper.data_v1` | **Selesai (Batch 3C-2)** |
| **Domain Konsultasi React Query** | `src/lib/data.ts` -> `src/core/repos/*` | `wira_consulting_*`, `wira_catatan_knowledge_v2` *(catatan UI `HalamanCatatan.tsx` masih langsung ke kunci legacy hingga batch berikutnya)* | `ws-main:{clients,projects,tasks,deliverables,notes,documents,meetings,collaboration}.*` | **Selesai (Batch 2)** |
| **Preferensi Shell (`rawStorage`) — Batch 3D-1** | 18 file di `hooks/*`, `app/*`, `routes/index.tsx`, `utils/launcherCategoryMapper.ts`, `features/finance/hooks/useLanguage.ts` | 27 kunci preferensi shell, tema, bahasa, navigasi, region, taskbar, & quick capture | `ws-main:prefs.*`, `ws-main:tasks.quick_tasks`, `ws-main:notes.quick_notes`, `ws-main:legacy.quick_*` | **Selesai (Batch 3D-1)** |
| **Modul yang Sengaja Belum Dipindah (`legacy/pribadi`)** | `features/wira/*`, `features/finance/*` *(selain `useLanguage.ts`)*, `src/life-os/*`, `src/peh/*`, `features/product/*`, `features/credit/*`, `features/matriks/*`, `features/value-treated/*`, `router.tsx` (`worksheet_<slug>`) | `aio_*` personal/kesehatan/rumah, `wira_*` personal, `life_planner_os_v1_*`, `peh_pfs_workspace_v2`, kunci keuangan polos (`bills_list`, `transactions_list`, dll.), `bizcoach_*`, `worksheet_*` | — *(tetap di kunci lama sebagai `legacy/pribadi`)* | **Tidak dipindah (`legacy/pribadi`)** |

### Preferensi Shell (`rawStorage` — Batch 3D-1)

Sebanyak 18 file shell, navigasi, tema, bahasa, region, taskbar, dan *quick capture* telah dipindahkan ke `getRaw` / `setRaw` / `removeRaw`:

| Kunci Lama | Kunci Tujuan (`ws-main:<tujuan>`) | Pemakai |
|---|---|---|
| `aio_lang`, `appLanguage` | `ws-main:prefs.lang` | `app/shell/LanguageToggle.tsx`, `features/finance/hooks/useLanguage.ts` |
| `aio_theme`, `aio_theme_preference` | `ws-main:prefs.theme`, `ws-main:prefs.theme_preference` | `app/theme-lang-toggle.tsx` |
| `aio_theme_color` | `ws-main:prefs.theme_color` | `hooks/useThemeColor.ts` |
| `aio_liquid_glass` | `ws-main:prefs.liquid_glass` | `hooks/useLiquidGlassSetting.ts` |
| `aio_progressive_blur` | `ws-main:prefs.progressive_blur` | `hooks/useProgressiveBlurSetting.ts` |
| `aio_active_mode`, `client_os_active_mode` | `ws-main:prefs.active_mode`, `ws-main:prefs.client_os_active_mode` | `app/app-shell.tsx`, `app/TaskbarModal.tsx`, `app/shell/app-dock.tsx`, `routes/index.tsx` |
| `aio_left_sidebar_75`, `aio_left_sidebar_100` | `ws-main:prefs.left_sidebar_75`, `ws-main:prefs.left_sidebar_100` | `app/app-shell.tsx` |
| `aio_region_country`, `aio_region_city`, `aio_region_timezone` | `ws-main:prefs.region_country`, `ws-main:prefs.region_city`, `ws-main:prefs.region_timezone` | `app/shell/TopPanelControlHub.tsx` |
| `aio_favorites` | `ws-main:prefs.favorites` | `hooks/useFavorites.ts` |
| `aio_recent_apps` | `ws-main:prefs.recent_apps` | `hooks/useRecentApps.ts` |
| `aio_menu_settings` | `ws-main:prefs.menu_settings` | `hooks/useMenuSettings.ts` |
| `aio_moved_cards_v1` | `ws-main:prefs.moved_cards_v1` | `hooks/useCardPageMover.tsx` |
| `wira_custom_nav_folders` | `ws-main:prefs.wira_custom_nav_folders` | `hooks/useCustomNav.ts` |
| `aio_last_launcher_page`, `aio_last_active_app`, `aio_tools_merged_to_business_v1` | `ws-main:prefs.last_launcher_page`, `ws-main:prefs.last_active_app`, `ws-main:prefs.tools_merged_to_business_v1` | `utils/launcherCategoryMapper.ts`, `routes/index.tsx` |
| `aio_taskbar_active_tasks` | `ws-main:prefs.taskbar_active_tasks` | `app/TaskbarModal.tsx` |
| `aio_quick_tasks`, `aio_quick_notes`, `aio_quick_habits`, `aio_quick_transactions` | `ws-main:tasks.quick_tasks`, `ws-main:notes.quick_notes`, `ws-main:legacy.quick_habits`, `ws-main:legacy.quick_transactions` | `app/QuickCaptureModal.tsx` |

Modul pribadi/warisan di luar daftar tersebut (`features/wira/*`, `features/finance/*` selain `useLanguage.ts`, `src/life-os/*`, `src/peh/*`, `features/product/*`, `features/credit/*`, `features/matriks/*`, `features/value-treated/*`, serta `worksheet_<slug>` di `src/router.tsx`) secara eksplisit ditandai sebagai **`legacy/pribadi`** dan tetap memakai kunci lama tanpa disentuh pada Batch 3D-1.

### Catatan Rollback (Keamanan & Konsekuensi Data Baru)
- **Aman untuk Data Pra-Migrasi**: Karena `reconcileBulkSnapshots()`, `createWorkspaceStorage()`, maupun `rawStorage` **tidak pernah menghapus atau menimpa kunci lama** (`ecosystem-*-storage`, `aio_*`, `wira_*`), melakukan rollback kode ke versi sebelum Batch 3A sepenuhnya aman — versi lama akan langsung membaca kembali data pengguna terakhir sebelum migrasi tanpa kerusakan format.
- **Keterbatasan Data Pasca-Migrasi Saat Rollback**: Setiap perubahan/mutasi baru yang dilakukan pengguna **setelah** modul dipindahkan hanya ditulis ke kunci baru `ws-main:*`. Apabila aplikasi di-rollback ke build lama yang belum mengenal `ws-main:*`, perubahan yang dibuat setelah migrasi tidak akan terlihat oleh build lama tersebut (meskipun datanya tetap tersimpan utuh di `ws-main:*` di browser pengguna).

---

## 6. Batasan (Wajib Dibaca Sebelum Produksi Multi-Tenant)

1. **Guard Frontend Bukan Keamanan Sejati**:
   Seluruh kode JavaScript/TypeScript, state Zustand, fungsi `can()`, guard rute `canEnterArea()`, serta seluruh isi `window.localStorage` berada sepenuhnya di perangkat pengguna. Pengguna teknis dapat membuka Browser DevTools untuk membaca kunci `localStorage` atau memodifikasi state di memori.
2. **Isolasi Saat Ini Bersifat Fungsional & Simulasi Multi-Peran**:
   Pemisahan `hub`, `partner`, dan `portal` di lapisan frontend bertujuan menata struktur domain, kontrak repositori, dan alur UX per peran agar siap disambungkan ke API tanpa merombak komponen.
3. **Backend Otoritatif Wajib Sebelum Menerima Klien Nyata**:
   Sebelum aplikasi digunakan oleh klien atau mitra eksternal sungguhan:
   - Autentikasi wajib dipindahkan ke server (sesi bertanda tangan kriptografis / JWT / OAuth).
   - Penyimpanan wajib dipindahkan dari `localStorage` ke database server dengan **Row-Level Security (RLS)** atau pemfilteran query wajib berbasis `workspace_id`, `client_id`, dan daftar penugasan `project_id` di sisi server.
   - Setiap mutasi (`write`, `delete`, `share`, `approve`) wajib divalidasi ulang oleh endpoint backend menggunakan aturan yang identik dengan `MATRIX` pada `src/core/permissions.ts`.
   - Data sensitif legacy seperti `wira_passwords_vault_v2` tidak boleh disimpan dalam teks terbuka di `localStorage` pada lingkungan produksi.
