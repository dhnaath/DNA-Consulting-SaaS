import { HabitTracker } from "../wira/components/HabitTracker";

export default function WaterApp() {
  return (
    <div className="flex flex-col pb-16 pt-4">
      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto space-y-8 max-w-lg">
        <HabitTracker />

        <footer className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
          <div>© 2024 Water Tracker</div>
          <div>Kesehatan & Produktivitas</div>
        </footer>
      </main>
    </div>
  );
}
