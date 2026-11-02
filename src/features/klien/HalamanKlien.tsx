import { useQueries } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";
import { AppShell } from "@/app/app-shell";
import { Kosong, Pill } from "@/app/ui-bits";
import { clientsQuery, projectsQuery, rupiahRingkas } from "@/lib/data";

export function HalamanKlien() {
  const [clients, projects] = useQueries({ queries: [clientsQuery, projectsQuery] });
  const daftar = clients.data ?? [];
  const proyek = projects.data ?? [];

  return (
    <AppShell title="Workspace Klien" subtitle="Portofolio akun klien dan status kerja sama">
      {daftar.length === 0 ? (
        <Kosong pesan="Belum ada klien." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {daftar.map((k) => {
            const proyekKlien = proyek.filter((p) => p.client_id === k.id);
            return (
              <div
                key={k.id}
                className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold leading-tight group-hover:text-primary">{k.nama}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {k.industri} · KBLI {k.kbli}
                    </p>
                  </div>
                  <Pill value={k.status} />
                </div>
                <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="size-3.5" /> {k.kota}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="size-3.5" /> {k.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-3.5" /> {k.telepon}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">{proyekKlien.length} proyek</span>
                  <span className="font-medium">{rupiahRingkas(Number(k.nilai_kontrak))}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
