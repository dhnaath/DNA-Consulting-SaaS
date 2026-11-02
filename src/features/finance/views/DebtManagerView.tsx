import { useState, useEffect } from "react";
import { HomeView as CreditCardDashboard } from "../components/HomeView";
import { AddCardView } from "../components/AddCardView";
import { CardSettingsView } from "../components/CardSettingsView";

export function DebtManagerView({ onBack, forceView }: { onBack: () => void; forceView?: string }) {
  const [view, setView] = useState("dashboard"); // dashboard, addCard, emiCalculator, cardSettings
  const [editDebtId, setEditDebtId] = useState<string | null>(null);

  useEffect(() => {
    if (forceView) {
      setView(forceView);
    }
  }, [forceView]);

  // Handle internal navigation for credit card features
  if (view === "addCard") {
    return (
      <AddCardView
        onBack={() => {
          setView("dashboard");
          setEditDebtId(null);
        }}
        editDebtId={editDebtId}
      />
    );
  }

  if (view === "cardSettings") {
    return <CardSettingsView onBack={() => setView("dashboard")} />;
  }

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <CreditCardDashboard
        onNavigate={setView}
        onBack={onBack}
        onEditDebt={(id) => {
          setEditDebtId(id);
          setView("addCard");
        }}
        fixedTab="kredit"
        customTitle="Beban Liabilitas"
      />
    </div>
  );
}
