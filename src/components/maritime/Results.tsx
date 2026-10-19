import { BadgeCheck, CalendarDays, Download, FileText, Trophy } from 'lucide-react';
import { Chest, Confetti, Island, Pip, Waves } from './visuals';

type Json = Record<string, unknown>;
const get = (o: unknown, ...keys: string[]): unknown => { if (!o || typeof o !== 'object') return undefined; for (const key of keys) { const value = (o as Json)[key]; if (value !== null && value !== undefined) return value; } return undefined; };
const show = (value: unknown, usd = false) => value === undefined || value === null || value === '' ? '—' : typeof value === 'number' ? `${usd ? '$' : ''}${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : String(value);
const object = (v: unknown): Json => v && typeof v === 'object' && !Array.isArray(v) ? v as Json : {};
const TONES = ['bg-sun border-sundeep', 'bg-coral border-ruby', 'bg-skyl border-azure', 'bg-kelp border-kelpdeep'];

export function Results({ data, error }: { data: Json | null; error: boolean }) {
  if (!data) return <section className="card-3d report relative overflow-hidden">
    <div className="flex items-center justify-between border-b-4 border-navy bg-sun px-5 py-4"><h2 className="text-xl font-bold">Treasure Island Lookout</h2><span className="rounded-full border-2 border-navy bg-sail px-3 py-0.5 text-xs font-black">{error ? 'OFFLINE' : 'STANDBY'}</span></div>
    {error ? <div className="flex flex-col items-center px-6 py-10 text-center"><Pip mood="dizzy" className="h-36 w-36" /><h3 className="mt-3 text-xl font-bold text-ruby">The harbor server is napping! 😴</h3><p className="mt-2 max-w-xs text-sm font-bold text-muted-foreground">Start your model at http://localhost:8000 and set sail again for real rates.</p></div>
      : <div className="px-4 pb-6 pt-2 text-center"><Island /><h3 className="mt-2 text-2xl font-bold">Ready to Set Sail, Captain!</h3><p className="mx-auto mt-2 max-w-sm text-sm font-bold text-muted-foreground">Configure your cargo and launch the voyage simulation to reveal forward freight rates!</p></div>}
  </section>;

  const alloc = object(get(data, 'allocation', 'optimal_allocation', 'fleet_allocation', 'order_matching') ?? data);
  const raw = get(data, 'forecast', 'forecasts', 'freight_forecast', 'monthly_forecast'); const forecast = Array.isArray(raw) ? raw : [];
  const status = String(get(alloc, 'status', 'allocation_status') ?? ''); const eligible = /^eligible$/i.test(status.trim());
  const total = get(alloc, 'total_cost', 'net_cost', 'total_optimized_cost') ?? get(data, 'total_estimated_freight_cost');
  const rows = forecast.slice(0, 4).map((m, i) => [show(get(m, 'horizon_month', 'month') ?? `Month +${i + 1}`), show(get(m, 'freight_rate', 'predicted_rate', 'rate_usd_per_tonne'), true), show(get(m, 'total_cost', 'total_freight_cost'), true), show(get(m, 'arrival_date', 'estimated_arrival_date'))]);
  const costs: [string, unknown, boolean][] = [['Repositioning cost', get(alloc, 'reposition_cost', 'repositioning_cost'), true], ['Idle demurrage days', get(alloc, 'idle_days', 'demurrage_days'), false], ['Idle demurrage cost', get(alloc, 'idle_cost', 'idle_surcharge'), true]];
  function exportCsv() { const values = [['Voyage report'], ['Matched order', show(get(alloc, 'order_id', 'matched_order_id'))], ['Status', status], [], ['Horizon month', 'Predicted rate (USD/tonne)', 'Total freight (USD)', 'Expected arrival date'], ...rows, [], ...costs.map(([l, v, usd]) => [l, show(v, usd)]), ['Net minimized cost', show(total, true)]]; const csv = values.map(row => row.map(v => { const safe = /^[=+@\-\t\r]/.test(v) ? `'${v}` : v; return `"${safe.replaceAll('"', '""')}"`; }).join(',')).join('\r\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); const a = document.createElement('a'); a.href = url; a.download = 'tidewise-voyage-report.csv'; a.click(); URL.revokeObjectURL(url); }

  return <section className="card-3d report relative overflow-hidden">
    <Confetti />
    <div className="relative flex items-center gap-3 border-b-4 border-navy bg-kelp px-5 py-3"><Pip mood="dance" className="animate-dance h-14 w-14" /><h2 className="flex-1 text-xl font-bold text-sail [text-shadow:0_2px_0_var(--navy)]">Land ho! Your forecast</h2></div>
    <div className="p-5"><h3 className="mb-3 text-sm font-black uppercase tracking-wider">4-Month Horizon Treasure</h3>
      {rows.length ? <div className="grid grid-cols-2 gap-3">{rows.map(([m, rate, cost, date], i) => <div key={i} className={`animate-pop rounded-3xl border-2 border-b-[6px] p-3 ${TONES[i]}`} style={{ animationDelay: `${i * .12}s` }}>
        <div className="flex items-center justify-between"><span className="rounded-full bg-sail px-2 text-xs font-black">Month +{i + 1}</span><Chest open className="h-8 w-8" /></div>
        <p className="num mt-1 text-[11px] font-bold">{m}</p><p className="num text-2xl font-black">{rate}<span className="text-xs"> / tonne</span></p><p className="num text-sm font-extrabold">{cost}</p>
        <p className="num mt-1 flex items-center gap-1 text-xs font-bold"><CalendarDays className="animate-bob h-3.5 w-3.5" />{date}</p></div>)}</div>
        : <p className="text-sm font-bold text-muted-foreground">No forecast rows returned.</p>}
    </div>
    <div className="relative mx-5 rounded-3xl border-2 border-b-[6px] border-navy bg-sand p-4">
      <div className="flex items-center justify-between"><span className="flex items-center gap-2 font-display text-lg font-bold"><Trophy className="h-5 w-5 text-buoy" />Fleet Allocation</span><span className="num rounded-full border-2 border-navy bg-sail px-3 py-0.5 text-xs font-black">{show(get(alloc, 'order_id', 'matched_order_id'))}</span></div>
      <dl className="mt-3 space-y-2">{costs.map(([label, value, usd]) => <div key={label} className="flex justify-between text-sm font-bold"><dt>{label}</dt><dd className="num">{show(value, usd)}</dd></div>)}<div className="flex justify-between border-t-2 border-dashed border-navy pt-2 font-black"><dt>Net minimized cost</dt><dd className="num text-kelpdeep">{show(total, true)}</dd></div></dl>
      {status && <span className={`animate-stamp mt-4 inline-flex items-center gap-1.5 rounded-xl border-4 px-4 py-1.5 font-display text-base font-bold tracking-wider ${eligible ? 'border-kelpdeep bg-kelp text-sail' : 'border-buoy bg-sail text-buoy'}`}><BadgeCheck className="h-5 w-5" />{eligible ? 'ELIGIBLE SHIPMENT' : status.toUpperCase()}</span>}
    </div>
    <div className="report-controls flex gap-3 p-5 pb-16"><button type="button" onClick={exportCsv} className="btn-3d flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-azure bg-skyl py-2.5 font-black text-navy"><Download className="h-4 w-4" />Export CSV</button><button type="button" aria-label="Print voyage report as PDF" onClick={() => window.print()} className="btn-3d grid w-12 place-items-center rounded-2xl border-2 border-sundeep bg-sun text-navy"><FileText className="h-4 w-4" /></button></div>
    <details className="report-controls relative z-10 mx-5 -mt-12 mb-14 text-xs font-bold"><summary className="cursor-pointer text-muted-foreground">Model response</summary><pre className="num mt-2 max-h-56 overflow-auto rounded-2xl bg-sail p-3">{JSON.stringify(data, null, 2)}</pre></details>
    <Waves className="bottom-0 h-10" />
  </section>;
}
