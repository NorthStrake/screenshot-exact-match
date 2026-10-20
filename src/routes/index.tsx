import { createFileRoute } from '@tanstack/react-router';
import { useState, type ComponentType } from 'react';
import { toast } from 'sonner';
import { ArrowUpRight, Boxes, CalendarDays, Clock, Coins, Fuel, Gauge, Gem, Map, Mountain, RotateCcw, Ship as ShipIcon, Wheat } from 'lucide-react';
import { Card, NumberField, PortField, SliderField, inputClass, labelClass } from '@/components/maritime/fields';
import { LoadingOverlay, Logo } from '@/components/maritime/visuals';
import { Results } from '@/components/maritime/Results';
import { DEFAULTS, ENDPOINT, LIMITS, MARKET, PORTS, payloadFor, validateForm, type Form, type NumKey } from '@/components/maritime/model';
import heroVessel from '@/assets/hero-vessel.jpg';

export const Route = createFileRoute('/')({ head: () => ({ meta: [{ title: 'Tidewise — Dry-Bulk Freight Intelligence' }, { name: 'description', content: 'Plan a dry-bulk voyage and generate four-month forward freight rate forecasts, fleet allocation and cost breakdowns from your prediction model.' }, { property: 'og:title', content: 'Tidewise — Dry-Bulk Freight Intelligence' }, { property: 'og:description', content: 'Voyage planning with four-month forward freight rate forecasts, fleet allocation and cost breakdowns.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }), component: Index });

const VESSELS: [string, string][] = [['Handysize', '25k–39k DWT'], ['Supramax', '50k–65k DWT'], ['Panamax', '65k–85k DWT'], ['Capesize', '100k–200k DWT']];
const CARGO: [string, ComponentType<{ className?: string }>][] = [['Coal', Fuel], ['Iron Ore', Mountain], ['Wheat', Wheat], ['Bauxite', Gem]];
const OFFLINE = 'The prediction server at http://localhost:8000 is unreachable. Start it and run the forecast again.';

function Index() {
  const [f, setF] = useState<Form>({ ...DEFAULTS });
  const [benchmarks, setBenchmarks] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState(false);

  const set = <K extends keyof Form>(k: K) => (v: Form[K]) => setF(p => ({ ...p, [k]: v }));

  async function dispatch() {
    if (!validateForm(f)) { toast.error('Some voyage parameters are out of range. Please review the highlighted limits.'); return; }
    setError(false); setResult(null); setLoading(true);
    try {
      const response = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payloadFor(f)), signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error('Request failed');
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid response');
      setResult(data as Record<string, unknown>); toast.success('Forecast received from the model.');
    } catch { setError(true); toast.error(OFFLINE); }
    finally { setLoading(false); }
  }
  function reset() { setF({ ...DEFAULTS }); setBenchmarks(true); setResult(null); setError(false); toast.info('Parameters reset to defaults.'); }
  const [qMin, qMax, qStep] = LIMITS.quantity_mt; const [dMin, dMax, dStep] = LIMITS.distance_nm; const [sMin, sMax, sStep] = LIMITS.speed_knots;

  return <div className="min-h-screen">
    <header className="no-print sticky top-0 z-40 border-b bg-card/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Logo className="h-5 w-5" /></span><div><p className="text-lg font-bold leading-none">Tidewise</p><p className="text-[11px] font-medium text-muted-foreground">Dry-bulk freight intelligence</p></div></div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold sm:flex"><span className={`h-1.5 w-1.5 rounded-full ${error ? 'bg-coral' : 'animate-pulse bg-teal'}`} />Model server <span className="num font-normal text-muted-foreground">localhost:8000</span></span>
          <button type="button" onClick={reset} disabled={loading} className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:bg-secondary disabled:opacity-60"><RotateCcw className="h-3.5 w-3.5" />Reset</button>
        </div>
      </div>
    </header>

    <section className="no-print relative overflow-hidden">
      <img src={heroVessel} alt="Bulk carrier at sea" width={1920} height={1088} className="animate-kenburns absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/55 to-navy/15" />
      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <p className="animate-fade-up text-xs font-bold uppercase tracking-[0.25em] text-sail/70">Freight rate forecasting</p>
        <h1 className="animate-fade-up mt-4 max-w-2xl text-4xl font-bold leading-tight text-sail sm:text-5xl" style={{ animationDelay: '.1s' }}>Charter with confidence, four months ahead.</h1>
        <p className="animate-fade-up mt-4 max-w-xl text-base text-sail/80" style={{ animationDelay: '.2s' }}>Configure a voyage and let your prediction model return forward freight rates, fleet allocation and a full cost breakdown.</p>
        <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-6" style={{ animationDelay: '.3s' }}>
          <a href="#planner" className="flex items-center gap-2 rounded-lg bg-sail px-5 py-3 text-sm font-bold text-navy transition hover:bg-sail/90">Plan a voyage <ArrowUpRight className="h-4 w-4" /></a>
          <div className="flex gap-6 text-sail/85">{[['4-month', 'horizon'], ['20', 'ports'], ['4', 'vessel classes']].map(([v, l]) => <span key={l} className="text-xs font-medium"><span className="num mr-1.5 text-base font-bold text-sail">{v}</span>{l}</span>)}</div>
        </div>
      </div>
    </section>

    <main id="planner" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-12">
      <div className="grid items-start gap-8 lg:grid-cols-[3fr_2fr]">
        <form className="no-print space-y-8" onSubmit={e => { e.preventDefault(); void dispatch(); }}>
          <Card index="01" title="Voyage route" description="Origin, destination and schedule">
            <PortField label="Origin port" value={f.origin_port_id} onChange={set('origin_port_id')} ports={PORTS} />
            <PortField label="Destination port" value={f.destination_port_id} onChange={set('destination_port_id')} ports={[...PORTS.slice(13), ...PORTS.slice(0, 13)]} />
            <div><label htmlFor="route-id" className={labelClass}><Map className="h-3.5 w-3.5 text-azure" />Route code</label><input id="route-id" required value={f.route_id} onChange={e => set('route_id')(e.target.value)} className={inputClass} /></div>
            <div><label htmlFor="departure" className={labelClass}><CalendarDays className="h-3.5 w-3.5 text-azure" />Departure month</label><input id="departure" type="month" required value={f.current_month} onChange={e => set('current_month')(e.target.value)} className={inputClass} /></div>
            <SliderField label="Voyage distance" value={f.distance_nm} onChange={set('distance_nm')} min={dMin} max={dMax} step={dStep} readout={<>{f.distance_nm.toLocaleString()} NM · {Math.round(f.distance_nm * 1.852).toLocaleString()} km</>} />
          </Card>

          <Card index="02" title="Cargo & vessel" description="Commodity, tonnage and operating costs">
            <div className="sm:col-span-2"><span className={labelClass}><Boxes className="h-3.5 w-3.5 text-azure" />Cargo type</span><div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">{CARGO.map(([name, Icon]) => { const on = f.type_of_cargo === name; return <button key={name} type="button" aria-pressed={on} onClick={() => set('type_of_cargo')(name)} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${on ? 'border-azure bg-azure/10 text-azure' : 'bg-card hover:border-azure/50'}`}><Icon className="h-4 w-4" />{name}</button>; })}</div></div>
            <SliderField label="Cargo quantity" value={f.quantity_mt} onChange={set('quantity_mt')} min={qMin} max={qMax} step={qStep} readout={<>{f.quantity_mt.toLocaleString()} MT = {(f.quantity_mt * 1000).toLocaleString()} kg</>} />
            <div className="sm:col-span-2"><span className={labelClass}><ShipIcon className="h-3.5 w-3.5 text-azure" />Vessel class</span><div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">{VESSELS.map(([name, range]) => { const on = f.vessel_type === name; return <button key={name} type="button" aria-pressed={on} onClick={() => set('vessel_type')(name)} className={`rounded-lg border px-3 py-2.5 text-center transition ${on ? 'border-azure bg-azure/10' : 'bg-card hover:border-azure/50'}`}><span className={`block text-sm font-semibold ${on ? 'text-azure' : ''}`}>{name}</span><span className="num text-[11px] text-muted-foreground">{range}</span></button>; })}</div></div>
            <NumberField label="Deadweight tonnage" value={f.deadweight_tonnage_dwt} onChange={set('deadweight_tonnage_dwt')} min={LIMITS.deadweight_tonnage_dwt[0]} max={LIMITS.deadweight_tonnage_dwt[1]} unit="DWT" icon={<Gauge className="h-3.5 w-3.5 text-azure" />} />
            <NumberField label="Arrival window" value={f.expected_arrival_hours} onChange={set('expected_arrival_hours')} min={LIMITS.expected_arrival_hours[0]} max={LIMITS.expected_arrival_hours[1]} step={LIMITS.expected_arrival_hours[2]} unit="hours" icon={<Clock className="h-3.5 w-3.5 text-azure" />} />
            <SliderField label="Cruising speed" value={f.speed_knots} onChange={set('speed_knots')} min={sMin} max={sMax} step={sStep} readout={`${f.speed_knots.toFixed(1)} kn`} />
            <NumberField label="Daily idle cost" value={f.idle_cost_per_day} onChange={set('idle_cost_per_day')} min={LIMITS.idle_cost_per_day[0]} max={LIMITS.idle_cost_per_day[1]} step={LIMITS.idle_cost_per_day[2]} unit="USD / day" icon={<Coins className="h-3.5 w-3.5 text-azure" />} />
            <NumberField label="Reposition cost" value={f.reposition_cost_per_distance} onChange={set('reposition_cost_per_distance')} min={LIMITS.reposition_cost_per_distance[0]} max={LIMITS.reposition_cost_per_distance[1]} step={LIMITS.reposition_cost_per_distance[2]} unit="USD / NM" icon={<Coins className="h-3.5 w-3.5 text-azure" />} />
          </Card>

          <Card index="03" title="Market scenario" description="Macroeconomic indicators feeding the model" action={<label className="flex cursor-pointer items-center gap-2 text-xs font-semibold"><span className="text-muted-foreground">Automated benchmarks</span><button type="button" role="switch" aria-checked={benchmarks} onClick={() => setBenchmarks(b => !b)} className={`relative h-6 w-11 rounded-full transition ${benchmarks ? 'bg-teal' : 'bg-border'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-sail shadow transition-all ${benchmarks ? 'left-[22px]' : 'left-0.5'}`} /></button></label>}>
            {benchmarks ? <p className="text-sm text-muted-foreground sm:col-span-2">Automated benchmarks are applied — all {MARKET.length} market indicators are sent at their default reference values. Turn the switch off to tune them manually.</p>
              : <>{MARKET.map(([key, label, min, max, step, unit]) => <div key={key}><div className="flex items-baseline justify-between"><label htmlFor={key} className={labelClass}>{label}</label><span className="num text-xs font-semibold">{f[key].toLocaleString()} <span className="font-normal text-muted-foreground">{unit}</span></span></div><input id={key} type="range" min={min} max={max} step={step} value={f[key]} onChange={e => set(key as NumKey)(Number(e.target.value))} className="w-full accent-[var(--azure)]" /></div>)}<NumberField label="Rate reference" value={f.synthetic_rate_reference} onChange={set('synthetic_rate_reference')} min={0} step={0.01} unit="USD / tonne" /></>}
          </Card>

          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-base font-bold text-primary-foreground shadow-[0_8px_24px_-8px_rgba(15,42,67,.5)] transition hover:bg-navy disabled:opacity-70">
            Run forecast <ArrowUpRight className="h-5 w-5" />
          </button>
        </form>
        <aside className="space-y-4 lg:sticky lg:top-20"><Results data={result} error={error && !loading} /></aside>
      </div>
    </main>

    <footer className="no-print border-t py-6 text-center text-xs text-muted-foreground">Tidewise · forecasts are generated solely by your local model at <span className="num">localhost:8000</span></footer>
    <LoadingOverlay open={loading} />
  </div>;
}
