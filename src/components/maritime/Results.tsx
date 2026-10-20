import { AlertTriangle, Anchor, BadgeCheck, Download, FileText } from 'lucide-react';
import portDusk from '@/assets/port-dusk.jpg';

type Json = Record<string, unknown>;
const get = (o: unknown, ...keys: string[]): unknown => { if (!o || typeof o !== 'object') return undefined; for (const key of keys) { const value = (o as Json)[key]; if (value !== null && value !== undefined) return value; } return undefined; };
const show = (value: unknown, usd = false) => value === undefined || value === null || value === '' ? '—' : typeof value === 'number' ? `${usd ? '$' : ''}${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : String(value);
const object = (v: unknown): Json => v && typeof v === 'object' && !Array.isArray(v) ? v as Json : {};

export function Results({ data, error }: { data: Json | null; error: boolean }) {
  if (!data) return <section className="report animate-fade-up overflow-hidden rounded-2xl border bg-card shadow-[0_1px_2px_rgba(15,42,67,.05),0_12px_32px_-16px_rgba(15,42,67,.15)]">
    <div className="relative h-44">
      <img src={portDusk} alt="Container port at dusk" loading="lazy" width={1600} height={1008} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
      <span className={`absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide text-sail backdrop-blur ${error ? 'bg-coral/90' : 'bg-navy/60'}`}><span className={`h-1.5 w-1.5 rounded-full ${error ? 'bg-sail' : 'animate-pulse bg-teal'}`} />{error ? 'SERVER OFFLINE' : 'MODEL STANDBY'}</span>
      <p className="absolute bottom-4 left-5 text-lg font-bold text-sail">Forecast results</p>
    </div>
    {error ? <div className="flex items-start gap-3 p-6"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-coral" /><div><h3 className="font-bold">Prediction server unreachable</h3><p className="mt-1 text-sm text-muted-foreground">Start your model at <span className="num">http://localhost:8000</span> and run the forecast again. No rates are shown until the server responds.</p></div></div>
      : <div className="flex items-start gap-3 p-6"><Anchor className="mt-0.5 h-5 w-5 shrink-0 text-azure" /><div><h3 className="font-bold">Awaiting dispatch</h3><p className="mt-1 text-sm text-muted-foreground">Configure the voyage and run the forecast to see four-month forward freight rates, allocation and cost breakdown.</p></div></div>}
  </section>;

  const alloc = object(get(data, 'allocation', 'optimal_allocation', 'fleet_allocation', 'order_matching') ?? data);
  const raw = get(data, 'forecast', 'forecasts', 'freight_forecast', 'monthly_forecast'); const forecast = Array.isArray(raw) ? raw : [];
  const status = String(get(alloc, 'status', 'allocation_status') ?? ''); const eligible = /^eligible$/i.test(status.trim());
  const total = get(alloc, 'total_cost', 'net_cost', 'total_optimized_cost') ?? get(data, 'total_estimated_freight_cost');
  const rows = forecast.slice(0, 4).map((m, i) => [show(get(m, 'horizon_month', 'month') ?? `Month +${i + 1}`), show(get(m, 'freight_rate', 'predicted_rate', 'rate_usd_per_tonne'), true), show(get(m, 'total_cost', 'total_freight_cost'), true), show(get(m, 'arrival_date', 'estimated_arrival_date'))]);
  const costs: [string, unknown, boolean][] = [['Repositioning cost', get(alloc, 'reposition_cost', 'repositioning_cost'), true], ['Idle demurrage days', get(alloc, 'idle_days', 'demurrage_days'), false], ['Idle demurrage cost', get(alloc, 'idle_cost', 'idle_surcharge'), true]];
  function exportCsv() { const values = [['Voyage report'], ['Matched order', show(get(alloc, 'order_id', 'matched_order_id'))], ['Status', status], [], ['Horizon month', 'Predicted rate (USD/tonne)', 'Total freight (USD)', 'Expected arrival date'], ...rows, [], ...costs.map(([l, v, usd]) => [l, show(v, usd)]), ['Net minimized cost', show(total, true)]]; const csv = values.map(row => row.map(v => { const safe = /^[=+@\-\t\r]/.test(v) ? `'${v}` : v; return `"${safe.replaceAll('"', '""')}"`; }).join(',')).join('\r\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); const a = document.createElement('a'); a.href = url; a.download = 'tidewise-voyage-report.csv'; a.click(); URL.revokeObjectURL(url); }

  return <section className="report animate-fade-up overflow-hidden rounded-2xl border bg-card shadow-[0_1px_2px_rgba(15,42,67,.05),0_12px_32px_-16px_rgba(15,42,67,.15)]">
    <div className="flex items-center justify-between border-b px-6 py-4">
      <h2 className="text-lg font-bold">Forecast results</h2>
      {status && <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${eligible ? 'bg-teal/10 text-teal' : 'bg-amber/10 text-amber'}`}><BadgeCheck className="h-3.5 w-3.5" />{eligible ? 'ELIGIBLE SHIPMENT' : status.toUpperCase()}</span>}
    </div>
    <div className="grid grid-cols-2 divide-x border-b">
      <div className="p-5"><p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Net minimized cost</p><p className="num mt-1 text-2xl font-bold text-primary">{show(total, true)}</p></div>
      <div className="p-5"><p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Matched order</p><p className="num mt-1 text-2xl font-bold">{show(get(alloc, 'order_id', 'matched_order_id'))}</p></div>
    </div>
    <div className="p-6 pt-5">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">4-month forward rates</h3>
      {rows.length ? <div className="overflow-hidden rounded-xl border"><table className="w-full text-sm">
        <thead><tr className="bg-secondary text-left text-[11px] uppercase tracking-wider text-muted-foreground"><th className="px-3 py-2 font-semibold">Month</th><th className="px-3 py-2 text-right font-semibold">Rate / t</th><th className="px-3 py-2 text-right font-semibold">Freight</th><th className="hidden px-3 py-2 text-right font-semibold sm:table-cell">ETA</th></tr></thead>
        <tbody>{rows.map(([m, rate, cost, date], i) => <tr key={i} className="animate-fade-up border-t transition hover:bg-secondary/50" style={{ animationDelay: `${i * .08}s` }}><td className="num px-3 py-2.5 font-medium">{m}</td><td className="num px-3 py-2.5 text-right font-bold text-azure">{rate}</td><td className="num px-3 py-2.5 text-right">{cost}</td><td className="num hidden px-3 py-2.5 text-right text-muted-foreground sm:table-cell">{date}</td></tr>)}</tbody>
      </table></div> : <p className="text-sm text-muted-foreground">No forecast rows returned.</p>}
    </div>
    <div className="mx-6 mb-2 rounded-xl bg-secondary/60 p-4">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Fleet allocation</h3>
      <dl className="space-y-1.5">{costs.map(([label, value, usd]) => <div key={label} className="flex justify-between text-sm"><dt className="text-muted-foreground">{label}</dt><dd className="num font-medium">{show(value, usd)}</dd></div>)}<div className="flex justify-between border-t pt-1.5 text-sm font-bold"><dt>Net minimized cost</dt><dd className="num text-teal">{show(total, true)}</dd></div></dl>
    </div>
    <div className="report-controls flex gap-3 p-6 pt-4"><button type="button" onClick={exportCsv} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-navy"><Download className="h-4 w-4" />Export CSV</button><button type="button" aria-label="Print voyage report as PDF" onClick={() => window.print()} className="grid w-11 place-items-center rounded-lg border transition hover:bg-secondary"><FileText className="h-4 w-4" /></button></div>
    <details className="report-controls px-6 pb-5 text-xs"><summary className="cursor-pointer font-medium text-muted-foreground">Model response</summary><pre className="num mt-2 max-h-56 overflow-auto rounded-lg bg-secondary p-3">{JSON.stringify(data, null, 2)}</pre></details>
  </section>;
}
