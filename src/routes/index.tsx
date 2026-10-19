import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Anchor, BarChart3, Compass as CompassIcon, Container, Navigation, Ship as ShipIcon, Waves as WavesIcon } from "lucide-react";
import { Panel, Pills, PortField, SelectField, SliderField } from "@/components/maritime/fields";
import { LoadingOverlay, Ship, Waves } from "@/components/maritime/visuals";
import { Results } from "@/components/maritime/Results";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tidewise — Maritime Freight Intelligence" },
      { name: "description", content: "Forecast 4-month dry-bulk freight rates and optimal vessel allocation for any voyage." },
      { property: "og:title", content: "Tidewise — Maritime Freight Intelligence" },
      { property: "og:description", content: "Forecast 4-month dry-bulk freight rates and optimal vessel allocation for any voyage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ENDPOINT = "http://localhost:8000/predict";

const PORTS = [
  ["Newcastle", "Australia", "🇦🇺"], ["Port Hedland", "Australia", "🇦🇺"], ["Gladstone", "Australia", "🇦🇺"],
  ["Samarinda", "Indonesia", "🇮🇩"], ["Banjarmasin", "Indonesia", "🇮🇩"], ["Tanjung Bara", "Indonesia", "🇮🇩"],
  ["Richards Bay", "South Africa", "🇿🇦"], ["Saldanha Bay", "South Africa", "🇿🇦"], ["Maputo", "Mozambique", "🇲🇿"],
  ["Beira", "Mozambique", "🇲🇿"], ["Norfolk", "USA", "🇺🇸"], ["New Orleans", "USA", "🇺🇸"], ["Mina Saqr", "UAE", "🇦🇪"],
  ["Paradip", "India", "🇮🇳"], ["Visakhapatnam", "India", "🇮🇳"], ["Gangavaram", "India", "🇮🇳"], ["Dhamra", "India", "🇮🇳"],
  ["Haldia", "India", "🇮🇳"], ["Gopalpur", "India", "🇮🇳"], ["Krishnapatnam", "India", "🇮🇳"],
].map(([name = "", country = "", flag = ""]) => ({ name, country, flag }));

const ROUTES = Array.from({ length: 108 }, (_, i) => `RTE_${String(i + 1).padStart(3, "0")}`).map((r) => ({ value: r, label: r }));
const CARGO = [
  { value: "coal", label: "⚫ Coal" }, { value: "iron_ore", label: "🟤 Iron Ore" }, { value: "wheat", label: "🌾 Wheat" },
  { value: "bauxite", label: "🟠 Bauxite" }, { value: "grain", label: "🌽 Grain" },
];

const DEFAULTS = {
  origin_port_id: "Newcastle", destination_port_id: "Paradip", route_id: "RTE_001", distance_nm: 10000, current_month: "2026-10",
  type_of_cargo: "coal", quantity_mt: 60000, expected_arrival_hours: 2400,
  vessel_type: "Panamax", deadweight_tonnage_dwt: 82406, speed_knots: 14, loa_m: 300, draft_m: 16.5, beam_m: 45,
  idle_cost_per_day: 5000, reposition_cost_per_distance: 1.5,
  bunker_fuel_price_usd_per_tonne: 620, fuel_price_usd_per_tonne: 682, brent_crude_price_usd_per_barrel: 82.5,
  relevant_commodity_price_usd_per_tonne: 120, coal_price_usd_per_tonne: 95, iron_ore_price_usd_per_tonne: 88,
  wheat_price_usd_per_tonne: 225, usd_inr_exchange_rate: 84.5, shipping_market_index: 1650,
  global_bulk_cargo_demand_index: 1.05, global_shipping_capacity_index: 0.98, seasonal_demand_index: 1,
  origin_congestion_index: 0.32, destination_congestion_index: 0.45, synthetic_rate_reference: 15,
};
type Form = typeof DEFAULTS;
type NumKey = { [K in keyof Form]: Form[K] extends number ? K : never }[keyof Form];

const MARKET: [NumKey, string, number, number, number, string?, string?][] = [
  ["bunker_fuel_price_usd_per_tonne", "Bunker Fuel Price", 400, 750, 1, "$", "/t"],
  ["fuel_price_usd_per_tonne", "Vessel Fuel Price", 450, 750, 1, "$", "/t"],
  ["brent_crude_price_usd_per_barrel", "Brent Crude", 50, 110, 0.5, "$", "/bbl"],
  ["relevant_commodity_price_usd_per_tonne", "Relevant Commodity Price", 70, 180, 1, "$", "/t"],
  ["coal_price_usd_per_tonne", "Coal Price", 70, 180, 1, "$", "/t"],
  ["iron_ore_price_usd_per_tonne", "Iron Ore Price", 70, 150, 1, "$", "/t"],
  ["wheat_price_usd_per_tonne", "Wheat Price", 150, 350, 1, "$", "/t"],
  ["usd_inr_exchange_rate", "USD / INR", 80, 95, 0.1, "₹"],
  ["shipping_market_index", "Shipping Market Index", 500, 3000, 10],
  ["global_bulk_cargo_demand_index", "Global Bulk Demand Index", 0.5, 1.5, 0.01],
  ["global_shipping_capacity_index", "Global Capacity Index", 0.5, 1.5, 0.01],
  ["seasonal_demand_index", "Seasonal Demand Index", 0.5, 1.5, 0.01],
  ["origin_congestion_index", "Origin Congestion", 0.1, 0.8, 0.01],
  ["destination_congestion_index", "Destination Congestion", 0.1, 0.8, 0.01],
  ["synthetic_rate_reference", "Synthetic Rate Reference", 5, 40, 0.5, "$", "/t"],
];

function Index() {
  const [f, setF] = useState<Form>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const set = <K extends keyof Form>(k: K) => (v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  async function dispatch() {
    const payload = { ...f, current_month: `${f.current_month}-01`, quantity_kg: f.quantity_mt * 1000 };
    setLoading(true);
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResult(await res.json());
      toast.success("Prediction received");
    } catch {
      toast.error(`Backend connection offline at ${ENDPOINT}. Please start your FastAPI/Flask server.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      {loading && <LoadingOverlay />}

      <header className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-6 pt-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow"><Anchor className="h-5 w-5" /></span>
              <span className="text-lg font-bold tracking-tight">Tidewise</span>
            </div>
            <span className="num flex items-center gap-2 rounded-full border bg-abyss/50 px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />localhost:8000
            </span>
          </nav>
          <div className="mt-12 grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="num text-xs uppercase tracking-[0.3em] text-primary">Dry-bulk freight intelligence</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                Chart the rate <span className="text-gradient">before you sail.</span>
              </h1>
              <p className="mt-4 max-w-xl text-muted-foreground">Forecast four months of freight yields and match the optimal vessel to every cargo order — from Newcastle to Paradip.</p>
            </div>
            <Ship className="animate-bob hidden w-full max-w-sm justify-self-end md:block" />
          </div>
        </div>
        <Waves className="-mt-10" />
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 pb-12 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-5">
          <Panel icon={<Navigation className="h-4 w-4" />} tag="Panel A" title="Voyage & Route Configuration">
            <PortField label="Origin Port" value={f.origin_port_id} onChange={set("origin_port_id")} ports={PORTS} />
            <PortField label="Destination Port" value={f.destination_port_id} onChange={set("destination_port_id")} ports={PORTS} />
            <SelectField label="Route Identifier" value={f.route_id} onChange={set("route_id")} options={ROUTES} />
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Observation / Departure Month</label>
              <input type="month" value={f.current_month} onChange={(e) => set("current_month")(e.target.value)}
                className="num w-full rounded-lg border bg-abyss/60 px-3 py-2 text-sm text-foreground outline-none [color-scheme:dark] focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <SliderField label="Voyage Distance (NM)" value={f.distance_nm} onChange={set("distance_nm")} min={100} max={20000} step={50} input />
            </div>
          </Panel>

          <Panel icon={<Container className="h-4 w-4" />} tag="Panel B" title="Cargo & Order Demands">
            <SelectField label="Cargo Type" value={f.type_of_cargo} onChange={set("type_of_cargo")} options={CARGO} />
            <SliderField label="Cargo Quantity" value={f.quantity_mt} onChange={set("quantity_mt")} min={1000} max={180000} step={500} unit="MT"
              hint={`${(f.quantity_mt * 1000).toLocaleString("en-US")} kg`} />
            <div className="sm:col-span-2">
              <SliderField label="Expected Arrival Window" value={f.expected_arrival_hours} onChange={set("expected_arrival_hours")} min={24} max={30000} step={24} unit="hrs"
                hint={`≈ ${(f.expected_arrival_hours / 24).toFixed(0)} days`} />
            </div>
          </Panel>

          <Panel icon={<ShipIcon className="h-4 w-4" />} tag="Panel C" title="Vessel Specifications & Constraints">
            <Pills label="Vessel Class" value={f.vessel_type} onChange={set("vessel_type")} options={["Capesize", "Panamax", "Supramax", "Handysize"]} />
            <SliderField label="Deadweight Tonnage (DWT)" value={f.deadweight_tonnage_dwt} onChange={set("deadweight_tonnage_dwt")} min={20000} max={200000} step={1000} input />
            <SliderField label="Vessel Speed" value={f.speed_knots} onChange={set("speed_knots")} min={10} max={20} step={0.1} unit="kn" />
            <SliderField label="Daily Idle Cost" value={f.idle_cost_per_day} onChange={set("idle_cost_per_day")} min={500} max={10000} step={100} prefix="$" unit="/day" />
            <SliderField label="Repositioning Cost" value={f.reposition_cost_per_distance} onChange={set("reposition_cost_per_distance")} min={0.5} max={5} step={0.05} prefix="$" unit="/nm" />
          </Panel>

          <Panel icon={<CompassIcon className="h-4 w-4" />} tag="Advanced" title="Port Physical Clearance Limits" collapsible defaultOpen={false}>
            <SliderField label="Length Overall (LOA)" value={f.loa_m} onChange={set("loa_m")} min={150} max={350} step={1} unit="m" />
            <SliderField label="Loaded Draft" value={f.draft_m} onChange={set("draft_m")} min={9} max={22} step={0.1} unit="m" />
            <SliderField label="Beam Width" value={f.beam_m} onChange={set("beam_m")} min={25} max={55} step={0.5} unit="m" />
          </Panel>

          <Panel icon={<BarChart3 className="h-4 w-4" />} tag="Panel D" title="Macroeconomic & Market Indicators" collapsible defaultOpen={false}>
            {MARKET.map(([k, label, min, max, step, prefix, unit]) => (
              <SliderField key={k} label={label} value={f[k]} onChange={set(k)} min={min} max={max} step={step} prefix={prefix ?? ""} unit={unit ?? ""} />
            ))}
          </Panel>

          <button type="button" onClick={dispatch} disabled={loading}
            className="animate-shine group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-primary px-6 py-5 text-sm font-bold tracking-[0.12em] text-primary-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60">
            <CompassIcon className="h-5 w-5 transition-transform duration-700 group-hover:rotate-180" />
            DISPATCH FREIGHT SIMULATION &amp; PREDICTION
          </button>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Results data={result} />
        </aside>
      </main>

      <footer className="relative">
        <Waves className="rotate-180 opacity-60" />
        <p className="flex items-center justify-center gap-2 pb-8 text-xs text-muted-foreground"><WavesIcon className="h-3.5 w-3.5" />Tidewise Maritime Intelligence</p>
      </footer>
    </div>
  );
}
