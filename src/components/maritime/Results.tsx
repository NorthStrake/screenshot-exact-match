import { Anchor, CalendarClock, Gauge, Ship as ShipIcon } from "lucide-react";
import { Radar } from "./visuals";

type Json = Record<string, unknown>;
const get = (o: unknown, ...keys: string[]): unknown => {
  if (!o || typeof o !== "object") return undefined;
  for (const k of keys) if (k in (o as Json)) return (o as Json)[k];
  return undefined;
};
const show = (v: unknown, opts: { usd?: boolean; dec?: number } = {}) => {
  if (v === undefined || v === null || v === "") return "—";
  if (typeof v === "number") return (opts.usd ? "$" : "") + v.toLocaleString("en-US", { maximumFractionDigits: opts.dec ?? 2 });
  return String(v);
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-abyss/50 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="num mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

export function Results({ data }: { data: Json | null }) {
  if (!data) {
    return (
      <div className="glass flex flex-col items-center rounded-2xl p-8 text-center">
        <Radar />
        <p className="mt-6 text-lg font-semibold">Awaiting Voyage Parameters</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Configure the shipment details and dispatch simulation to forecast 4-month freight rates &amp; optimal vessel allocation.
        </p>
      </div>
    );
  }

  const forecastRaw = get(data, "forecast", "forecasts", "freight_forecast", "monthly_forecast");
  const forecast = Array.isArray(forecastRaw) ? forecastRaw : [];
  const alloc = (get(data, "allocation", "optimal_allocation", "fleet_allocation") as Json) ?? data;
  const diag = (get(data, "diagnostics", "kpis", "voyage_diagnostics") as Json) ?? data;
  const status = String(get(alloc, "status", "allocation_status") ?? "");
  const eligible = /eligible/i.test(status);
  const util = Number(get(diag, "utilization_ratio", "cargo_utilization", "utilization"));
  const utilPct = Number.isFinite(util) ? Math.min(100, util <= 1 ? util * 100 : util) : null;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="glass rounded-2xl p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><CalendarClock className="h-4 w-4 text-primary" />4-Month Freight Rate Forecast Horizon</h3>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => {
            const m = forecast[i];
            return (
              <div key={i} className="rounded-xl border bg-abyss/50 p-3">
                <p className="num text-[10px] uppercase tracking-widest text-primary">Month +{i + 1}</p>
                <p className="num mt-2 text-xl font-semibold">{show(get(m, "freight_rate", "predicted_rate", "rate_usd_per_tonne"), { usd: true })}<span className="text-xs text-muted-foreground">/t</span></p>
                <p className="num mt-1 text-xs text-muted-foreground">{show(get(m, "total_cost", "total_freight_cost"), { usd: true, dec: 0 })}</p>
                <p className="num text-xs text-muted-foreground">{show(get(m, "arrival_date", "estimated_arrival_date"))}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold"><ShipIcon className="h-4 w-4 text-primary" />Optimal Order &amp; Fleet Allocation</h3>
          {status && (
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${eligible ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
              <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />{status}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Matched Order ID" value={show(get(alloc, "order_id", "matched_order_id"))} />
          <Stat label="Repositioning Cost" value={show(get(alloc, "reposition_cost", "repositioning_cost"), { usd: true, dec: 0 })} />
          <Stat label="Idle Days" value={show(get(alloc, "idle_days"))} />
          <Stat label="Idle Surcharge" value={show(get(alloc, "idle_cost", "idle_surcharge"), { usd: true, dec: 0 })} />
          <div className="col-span-2 rounded-xl border border-primary/30 bg-primary/10 p-3">
            <p className="text-[11px] text-muted-foreground">Combined Total Optimized Cost</p>
            <p className="num text-gradient mt-1 text-2xl font-bold">{show(get(alloc, "total_cost", "total_optimized_cost"), { usd: true, dec: 0 })}</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Gauge className="h-4 w-4 text-primary" />Voyage Diagnostics &amp; KPIs</h3>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Transit Time (days)" value={show(get(diag, "transit_days", "transit_time_days"), { dec: 1 })} />
          <Stat label="Route Efficiency Score" value={show(get(diag, "route_efficiency_score", "efficiency_score"))} />
          <div className="col-span-2 rounded-xl border bg-abyss/50 p-3">
            <div className="flex justify-between text-[11px] text-muted-foreground"><span>DWT vs Cargo Utilization</span><span className="num">{utilPct === null ? "—" : `${utilPct.toFixed(1)}%`}</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full rounded-full bg-gradient-primary shadow-glow transition-all duration-700" style={{ width: `${utilPct ?? 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      <details className="glass rounded-2xl p-5">
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold"><Anchor className="h-4 w-4 text-primary" />Raw response</summary>
        <pre className="num mt-3 max-h-72 overflow-auto rounded-lg bg-abyss/70 p-3 text-xs text-muted-foreground">{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  );
}
