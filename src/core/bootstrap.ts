import { reconcileBulkSnapshots } from "./storage";

/**
 * Bootstrap satu kali sebelum pohon modul aplikasi utama dieksekusi di `src/main.tsx` (import pertama).
 *
 * Sejak Batch 3C-2:
 * - `migrateLegacyKeys()` TIDAK lagi dipanggil agar modul yang belum dipindah tidak meninggalkan
 *   salinan massal basi di namespace `ws-main:*`; pembacaan lazy (`ws-main:<tujuan>` lalu fallback
 *   kunci lama) sudah mencukupi.
 * - `reconcileBulkSnapshots()` dijalankan satu kali (dijaga `ws-main:reconcile_v1`) sebelum store
 *   mana pun dimuat untuk membersihkan salinan massal basi pada target yang belum ada di
 *   `ADOPTED_TARGETS`, tanpa pernah menyentuh kunci lama maupun data `ADOPTED_TARGETS`.
 */
try {
  reconcileBulkSnapshots();
} catch {
  // Jangan pernah menggagalkan render aplikasi apabila akses localStorage dibatasi browser
}
