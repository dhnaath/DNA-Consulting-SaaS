import { Shield, Users, Heart } from "lucide-react";

export default function IslamicInsurance() {
  return (
    <div className="w-full flex flex-col gap-8">
      <section className="bg-card border border-black/5 p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
        <div className="lg:w-1/3 flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
            <Shield className="w-6 h-6 text-foreground" />
            <h2 className="text-2xl font-semibold italic text-foreground">
              Prinsip Asuransi Syariah
            </h2>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed space-y-4">
            <p>
              Asuransi syariah (Asuransi Ta'awuni) dibangun di atas pilar tolong-menolong,
              solidaritas, dan saling menanggung antar sesama peserta. Berbeda dengan asuransi
              konvensional yang memindahkan risiko (transfer of risk), asuransi syariah membagi
              risiko (sharing of risk) bersama.
            </p>
          </div>
        </div>

        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-black/5 p-6 flex flex-col hover:border-border/40 transition-colors duration-300">
            <Shield className="w-8 h-8 text-foreground mb-4" />
            <h3 className="font-semibold italic text-xl text-foreground mb-2">Ta'min</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              Perlindungan / Rasa Aman
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Prinsip memberikan perlindungan dan ketenangan (rasa aman) dari berbagai risiko dan
              ketidakpastian. Dalam Islam, ikhtiar untuk meminimalisir risiko melalui cara yang
              halal sangat dianjurkan.
            </p>
          </div>

          <div className="bg-card border border-black/5 p-6 flex flex-col hover:border-border/40 transition-colors duration-300">
            <Users className="w-8 h-8 text-foreground mb-4" />
            <h3 className="font-semibold italic text-xl text-foreground mb-2">Takaful</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              Saling Menanggung
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Saling memikul beban atau tanggung jawab. Apabila salah satu peserta mengalami
              musibah, maka peserta lain turut menanggungnya melalui dana kebajikan (tabarru') yang
              telah dikumpulkan.
            </p>
          </div>

          <div className="bg-card border border-black/5 p-6 flex flex-col hover:border-border/40 transition-colors duration-300">
            <Heart className="w-8 h-8 text-foreground mb-4" />
            <h3 className="font-semibold italic text-xl text-foreground mb-2">Tadhamun</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              Solidaritas
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Asas kebersamaan dan rasa solidaritas yang tinggi di antara para peserta. Kesediaan
              untuk saling menanggung risiko dibangun di atas rasa persaudaraan untuk membantu yang
              sedang kesulitan.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-card border border-black/5 p-6 md:p-8 grid grid-cols-1 gap-6 w-full">
        <div className="text-xs md:text-sm text-muted-foreground italic border-l border-border/40 pl-4 md:pl-6 py-2">
          <p className="leading-relaxed">
            “Perumpamaan orang-orang mukmin dalam hal saling mencintai, menyayangi, dan mengasihi
            adalah bagaikan satu tubuh. Jika ada salah satu anggota tubuh yang sakit, maka seluruh
            tubuh akan ikut terjaga (tidak bisa tidur) dan demam.”
          </p>
          <span className="block mt-3 not-italic font-bold text-[10px] uppercase tracking-[0.1em] opacity-60">
            — HR. Bukhari dan Muslim
          </span>
        </div>
      </section>
    </div>
  );
}
