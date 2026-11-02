import React from 'react';
import { AppShell } from '@/app/app-shell';
import { CommodityDashboardSection } from '@/routes/commodity-dashboard';

export function NationalIndicesDashboard() {
  return (
    <AppShell
      title="10 Indeks Pembangunan & 100 Komoditas"
      subtitle="Dashboard Terpadu 10 Indikator Kesejahteraan Nasional & 100 Komoditas Acuan Menuju Indonesia Emas 2045"
    >
      <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 space-y-6">
        <CommodityDashboardSection defaultNavTab="national_indices" />
      </div>
    </AppShell>
  );
}
