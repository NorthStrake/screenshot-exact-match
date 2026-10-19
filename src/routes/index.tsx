import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from 'react';
import { toast } from 'sonner';
import { CalendarDays, Clock, Coins, Gauge, Map, Package, RotateCcw, Ship as ShipIcon } from 'lucide-react';
import { BoatSlider, Card, NumberField, PortField, inputClass, labelClass } from '@/components/maritime/fields';
import { BauxiteIcon, Chest, CoalIcon, Helm, HoldVisualizer, LoadingOverlay, OceanBackground, OreIcon, Pip, Propeller, VesselArt, WheatIcon, type Mood } from '@/components/maritime/visuals';
import { Results } from '@/components/maritime/Results';
import { DEFAULTS, ENDPOINT, LIMITS, MARKET, PORTS, payloadFor, validateForm, type Form, type NumKey } from '@/components/maritime/model';

export const Route = createFileRoute('/')({ head: () => ({ meta: [{ title: 'Tidewise — Set Sail with Captain Pip' }, { name: 'description', content: 'Plan a dry-bulk voyage with Captain Pip and get four-month freight rate forecasts from your prediction model.' }, { property: 'og:title', content: 'Tidewise — Set Sail with Captain Pip' }, { property: 'og:description', content: 'A playful voyage planner for freight rate forecasts, fleet allocation and cargo manifests.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }), component: Index });

const VESSELS: [string, string][] = [['Handysize', '25k–39k DWT'], ['Supramax', '50k–65k DWT'], ['Panamax', '65k–85k DWT'], ['Capesize', '100k–200k DWT']];
const CARGO: [string, (p: { className?: string }) => ReactNode][] = [['Coal', CoalIcon], ['Iron Ore', OreIcon], ['Wheat', WheatIcon], ['Bauxite', BauxiteIcon]];
const OFFLINE = 'Blimey! The harbor server at http://localhost:8000 is taking a nap! Wake it up to get real rates!';

function Index() {
  const [f, setF] = useState<Form>({ ...DEFAULTS }); const [chest, setChest] = useState(false); const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null); const [error, setError] = useState(false); const [spin, setSpin] = useState(0);
  const [pip, setPip] = useState<{ top: number; left: number; say: string; mood: Mood; spy: boolean }>({ top: 0, left: 0, say: 'Ahoy! I\'m Captain Pip. Let\'s plan a voyage!', mood: 'happy', spy: false });
  const wrap = useRef<HTMLDivElement>(null); const moodTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const portName = (id: string) => PORTS.find(p => p.id === id)?.name ?? id;

  const react = (say: string, mood: Mood = 'wow') => { setPip(p => ({ ...p, say, mood })); clearTimeout(moodTimer.current); moodTimer.current = setTimeout(() => setPip(p => ({ ...p, mood: 'happy' })), 1400); };
  const set = <K extends keyof Form>(k: K) => (v: Form[K]) => {
    setF(p => ({ ...p, [k]: v }));
    if (k === 'quantity_mt') react(Number(v) > 100000 ? `Blimey! ${Number(v).toLocaleString()} tonnes of ${f.type_of_cargo.toLowerCase()}?! That's a heavy haul, Captain!` : `${Number(v).toLocaleString()} tonnes — nice and tidy!`, Number(v) > 100000 ? 'wow' : 'thumbs');
    else if (k === 'destination_port_id') react(`Smooth sailing ahead to ${portName(String(v))}!`, 'thumbs');
    else if (k === 'origin_port_id') react(`Anchors aweigh from ${portName(String(v))}!`, 'thumbs');
    else if (k === 'speed_knots') react(Number(v) > 17 ? 'Whoa, full steam ahead! Hold my cap!' : 'Steady as she goes.', Number(v) > 17 ? 'wow' : 'thumbs');
    else if (k === 'type_of_cargo' || k === 'vessel_type') react(`${String(v)}? Aye aye, excellent choice!`, 'thumbs');
  };
  const follow = (e: SyntheticEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-pip]'); const box = wrap.current; if (!el || !box) return;
    const a = el.getBoundingClientRect(), b = box.getBoundingClientRect();
    setPip(p => ({ ...p, top: a.top - b.top - 70, left: Math.min(a.left - b.left + a.width - 90, b.width - 90), spy: true, say: el.dataset['pip'] === p.say ? p.say : (el.dataset['pip'] ?? p.say) }));
  };
  useEffect(() => () => clearTimeout(moodTimer.current), []);

  async function dispatch() {
    setSpin(s => s + 1);
    if (!validateForm(f)) { toast.error('Arr, some voyage numbers are off the charts. Please check them!'); return; }
    setError(false); setResult(null); setLoading(true);
    try {
      const response = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payloadFor(f)), signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error('Request failed');
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid response');
      setResult(data as Record<string, unknown>); react('Hooray! The treasure map is ready! 🎉', 'dance'); toast.success('Land ho! Forecast received.');
    } catch { setError(true); setPip(p => ({ ...p, mood: 'dizzy', say: 'Ooh, my head… the harbor server is asleep!' })); toast.error(OFFLINE); }
    finally { setLoading(false); }
  }
  function reset() { setF({ ...DEFAULTS }); setChest(false); setResult(null); setError(false); react('Fresh charts, Captain! Back to the defaults.', 'thumbs'); }
  const [qMin, qMax, qStep] = LIMITS.quantity_mt; const [dMin, dMax, dStep] = LIMITS.distance_nm; const [sMin, sMax, sStep] = LIMITS.speed_knots;

  return <div className="relative min-h-screen">
    <OceanBackground />
    <header className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 pt-6 lg:px-10">
      <div className="flex items-center gap-3"><span className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-b-4 border-navy bg-sun"><Pip className="h-12 w-12" /></span><div><p className="font-display text-3xl font-bold leading-none">tidewise</p><p className="text-xs font-black text-muted-foreground">Voyages with Captain Pip</p></div></div>
      <span className="flex items-center gap-2 rounded-full border-2 border-b-4 border-navy bg-foam px-4 py-1.5 text-xs font-black"><span className={`h-2.5 w-2.5 rounded-full ${error ? 'bg-coral' : 'animate-pulse bg-kelp'}`} />Harbor server <span className="num hidden text-azure sm:inline">localhost:8000</span></span>
    </header>
    <div className="mx-auto max-w-[1400px] px-6 pb-4 pt-8 text-center lg:px-10"><h1 className="text-4xl font-bold text-sail [text-shadow:0_3px_0_var(--navy)] sm:text-5xl">The Captain's Voyage Manifest</h1><p className="mx-auto mt-3 max-w-xl text-base font-extrabold">Chart your route, load your cargo and let the model reveal four months of freight rates!</p></div>

    <main className="mx-auto max-w-[1400px] px-6 pb-40 pt-4 lg:px-10">
      <div className="workspace-heading mb-4 flex justify-end"><button type="button" onClick={reset} disabled={loading} className="btn-3d flex items-center gap-2 rounded-2xl border-2 border-navy bg-foam px-4 py-2 text-sm font-black"><RotateCcw className="h-4 w-4" />Reset</button></div>
      <div className="grid items-start gap-8 lg:grid-cols-[3fr_2fr]">
        <div ref={wrap} className="relative" onFocusCapture={follow} onPointerOver={follow}>
          <div className="pip-layer pointer-events-none absolute z-30 hidden w-[90px] transition-all duration-500 ease-out sm:block" style={{ top: pip.top, left: pip.left }}>
            <div key={pip.say} className="animate-pop absolute bottom-full right-10 mb-1 w-56 rounded-2xl border-2 border-b-4 border-navy bg-sail px-3 py-2 text-xs font-extrabold">{pip.say}<span className="absolute -bottom-2 right-4 h-3 w-3 rotate-45 border-b-2 border-r-2 border-navy bg-sail" /></div>
            <Pip mood={pip.mood} spyglass={pip.spy} className={`h-20 w-20 ${pip.mood === 'dance' ? 'animate-dance' : 'animate-bob'}`} />
          </div>
          <form className="workbench-form space-y-8 pt-24 sm:pt-20" onSubmit={e => { e.preventDefault(); void dispatch(); }}>
            <Card icon={<Map className="h-5 w-5" />} title="Voyage Route" anchorKey={`${f.origin_port_id}-${f.destination_port_id}`} badge={<span className="num rounded-full border-2 border-navy bg-sun px-3 py-1 text-xs font-black">{f.route_id}</span>}>
              <PortField label="Origin port" value={f.origin_port_id} onChange={set('origin_port_id')} ports={PORTS} />
              <PortField label="Destination port" value={f.destination_port_id} onChange={set('destination_port_id')} ports={[...PORTS.slice(13), ...PORTS.slice(0, 13)]} />
              <div className="space-y-2" data-pip="Every voyage needs a route code. Arr!"><label htmlFor="route-id" className={labelClass}>Route code</label><input id="route-id" required value={f.route_id} onChange={e => set('route_id')(e.target.value)} className={inputClass} /></div>
              <div className="space-y-2" data-pip="When do we cast off, Captain?"><label htmlFor="departure" className={labelClass}><CalendarDays className="h-4 w-4 text-coral" />Departure month</label><input id="departure" type="month" required value={f.current_month} onChange={e => set('current_month')(e.target.value)} className={`${inputClass} bg-sand`} /></div>
              <BoatSlider label="Voyage distance" value={f.distance_nm} onChange={set('distance_nm')} min={dMin} max={dMax} step={dStep} pip="Drag the boat to chart how far we sail!" readout={<>{f.distance_nm.toLocaleString()} NM · {Math.round(f.distance_nm * 1.852).toLocaleString()} km</>} />
            </Card>

            <Card icon={<Package className="h-5 w-5" />} title="Cargo & Ship Manifest" tone="bg-buoy">
              <div className="space-y-2 sm:col-span-2" data-pip="What are we hauling today?"><span className={labelClass}>Cargo type</span><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{CARGO.map(([name, Icon]) => { const on = f.type_of_cargo === name; return <button key={name} type="button" aria-pressed={on} onClick={() => set('type_of_cargo')(name)} className={`btn-3d flex flex-col items-center rounded-3xl border-2 p-3 font-black ${on ? 'border-sundeep bg-sun' : 'border-navy/40 bg-sail'}`}><Icon className="h-14 w-14" />{name}</button>; })}</div></div>
              <BoatSlider label="Cargo quantity" value={f.quantity_mt} onChange={set('quantity_mt')} min={qMin} max={qMax} step={qStep} pip="Load 'er up! Watch the hold fill." readout={<>{f.quantity_mt.toLocaleString()} MT = {(f.quantity_mt * 1000).toLocaleString()} kg</>} />
              <div className="rounded-3xl border-2 border-navy/30 bg-mist p-2 sm:col-span-2"><HoldVisualizer quantity={f.quantity_mt} max={qMax} /></div>
              <div className="space-y-2 sm:col-span-2" data-pip="Pick your trusty vessel!"><span className={labelClass}><ShipIcon className="h-4 w-4 text-azure" />Vessel class</span><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{VESSELS.map(([name, range]) => { const on = f.vessel_type === name; return <button key={name} type="button" aria-pressed={on} onClick={() => set('vessel_type')(name)} className={`btn-3d rounded-3xl border-2 p-2 text-center ${on ? 'border-azure bg-skyl' : 'border-navy/40 bg-sail'}`}><VesselArt type={name} className="h-14 w-full" /><span className="block font-black">{name}</span><span className="num text-[11px] font-bold">{range}</span></button>; })}</div></div>
              <div className="space-y-2" data-pip="Deadweight — how much she can carry!"><NumberField label="Deadweight tonnage" value={f.deadweight_tonnage_dwt} onChange={set('deadweight_tonnage_dwt')} min={LIMITS.deadweight_tonnage_dwt[0]} max={LIMITS.deadweight_tonnage_dwt[1]} unit="DWT" icon={<Gauge className="h-4 w-4 text-buoy" />} /><div className="h-3 overflow-hidden rounded-full border-2 border-navy bg-sail"><div className="h-full bg-sun" style={{ width: `${Math.min(100, (f.deadweight_tonnage_dwt / LIMITS.deadweight_tonnage_dwt[1]) * 100)}%` }} /></div></div>
              <div className="space-y-2" data-pip="Knots! Faster burns more fuel, mind you."><div className="flex items-center justify-between"><label htmlFor="speed" className={labelClass}>Cruising speed</label><Propeller speed={f.speed_knots} /></div><input id="speed" type="range" min={sMin} max={sMax} step={sStep} value={f.speed_knots} onChange={e => set('speed_knots')(Number(e.target.value))} className="w-full accent-[var(--kelp)]" /><p className="num text-center text-lg font-black">{f.speed_knots.toFixed(1)} kn</p></div>
              <NumberField label="Daily idle cost" value={f.idle_cost_per_day} onChange={set('idle_cost_per_day')} min={LIMITS.idle_cost_per_day[0]} max={LIMITS.idle_cost_per_day[1]} step={LIMITS.idle_cost_per_day[2]} unit="USD / day" icon={<Coins className="h-4 w-4 text-sundeep" />} pip="Idle days cost doubloons!" />
              <NumberField label="Reposition cost" value={f.reposition_cost_per_distance} onChange={set('reposition_cost_per_distance')} min={LIMITS.reposition_cost_per_distance[0]} max={LIMITS.reposition_cost_per_distance[1]} step={LIMITS.reposition_cost_per_distance[2]} unit="USD / NM" icon={<Coins className="h-4 w-4 text-sundeep" />} pip="Sailing empty to the pickup ain't free." />
              <NumberField label="Arrival window" value={f.expected_arrival_hours} onChange={set('expected_arrival_hours')} min={LIMITS.expected_arrival_hours[0]} max={LIMITS.expected_arrival_hours[1]} step={LIMITS.expected_arrival_hours[2]} unit="hours" icon={<Clock className="h-4 w-4 text-coral" />} pip="How long until we must arrive?" />
            </Card>

            <section className="card-3d overflow-hidden">
              <button type="button" aria-expanded={chest} onClick={() => { setChest(o => !o); react(chest ? 'Locking the treasure chest!' : 'Ooh, market secrets inside!', chest ? 'thumbs' : 'wow'); }} className="flex w-full items-center gap-4 border-b-4 border-navy bg-wood px-6 py-4 text-left" data-pip="Open the chest to tweak market indicators!">
                <Chest open={chest} className="h-14 w-14" /><span className="flex-1"><span className="block font-display text-xl font-bold text-sail [text-shadow:0_2px_0_var(--wooddeep)]">The Captain's Treasure Chest</span><span className="text-xs font-bold text-sand">Market indicators · {chest ? 'tap to close' : 'tap to unlock'}</span></span>
              </button>
              {chest && <div className="grid gap-5 p-6 animate-in slide-in-from-top-2 sm:grid-cols-2">{MARKET.map(([key, label, min, max, step, unit]) => <div key={key} className="space-y-1" data-pip={`${label}: keep an eye on it!`}><div className="flex justify-between text-sm font-black"><label htmlFor={key}>{label}</label><span className="num">{f[key].toLocaleString()} <span className="text-[11px] text-muted-foreground">{unit}</span></span></div><input id={key} type="range" min={min} max={max} step={step} value={f[key]} onChange={e => set(key as NumKey)(Number(e.target.value))} className="w-full accent-[var(--sundeep)]" /></div>)}<NumberField label="Rate reference" value={f.synthetic_rate_reference} onChange={set('synthetic_rate_reference')} min={0} step={0.01} unit="USD / tonne" pip="A handy historical rate reference." /></div>}
            </section>

            <button type="submit" disabled={loading} className="btn-3d flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-b-[6px] border-kelpdeep bg-kelp px-5 py-4 font-display text-xl font-bold text-sail shadow-lg disabled:opacity-70" data-pip="Press it! Press it! ⛵">
              <Helm key={spin} className={`h-8 w-8 ${spin ? 'animate-spin-fast' : ''}`} />⛵ SET SAIL &amp; CALCULATE FREIGHT RATES!
            </button>
          </form>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-6"><Results data={result} error={error && !loading} /></aside>
      </div>
    </main>
    <LoadingOverlay open={loading} />
  </div>;
}
