import { CloudSun } from "lucide-react";

export function WeatherView() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-card/50 p-8">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <CloudSun size={32} className="text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No location set</h3>
        <p className="text-muted-foreground mt-2 max-w-md text-center">
          Search for a city to see the weather.
        </p>
      </div>
    </div>
  );
}
