import { createFileRoute } from '@tanstack/react-router';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Anchor, ArrowRight, Droplets, Gauge, Navigation, Ship as ShipIcon, SlidersHorizontal, RotateCcw, Ship as Helm, Fan, Clock, Route as RouteIcon, TriangleAlert, Waves as WavesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Panel, PortField, NumberField, inputClass } from '@/components/maritime/fields';
import { Waves, Ship, CompassRose, CoalIcon, OreIcon, WheatIcon, BauxiteIcon, GrainIcon, HoldVisualizer, LiveSimulation } from '@/components/maritime/visuals';
import { Results } from '@/components/maritime/Results';
import { DEFAULTS, ENDPOINT, LIMITS, MARKET, PORTS, payloadFor, validateForm, type Form, type NumKey } from '@/components/maritime/model';
export const Route=createFileRoute('/')({head:()=>({meta:[{title:'Tidewise — Maritime Command Center'},{name:'description',content:'Configure dry-bulk voyages, run live voyage simulations and receive four-month freight rate forecasts in the Tidewise maritime command center.'},{property:'og:title',content:'Tidewise — Maritime Command Center'},{property:'og:description',content:'Live voyage simulation, freight forecasts and order matching for dry-bulk shipping.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Index});
const VESSELS:[string,string,number][]=[['Handysize','25k–39k DWT',1],['Supramax','50k–65k DWT',2],['Panamax','65k–85k DWT',3],['Capesize','100k–200k DWT',0]];
const CARGO:[string,(p:{className?:string})=>ReactNode][]=[['Coal',CoalIcon],['Iron Ore',OreIcon],['Wheat',WheatIcon],['Bauxite',BauxiteIcon],['Grains',GrainIcon]];
const OFFLINE='Harbor Telemetry Server Unreachable at http://localhost:8000. Start backend to receive live inferences.';
function Index(){
 const [f,setF]=useState<Form>({...DEFAULTS});const [baseline,setBaseline]=useState(true);const [loading,setLoading]=useState(false);const [result,setResult]=useState<Record<string,unknown>|null>(null);const [error,setError]=useState(false);
 const set=<K extends keyof Form>(k:K)=>(v:Form[K])=>setF(p=>({...p,[k]:v}));
 const numeric=(key:keyof typeof LIMITS,label:string,unit:string,slider=false,hint?:string,icon?:ReactNode)=>{const [min,max,step]=LIMITS[key];return <NumberField label={label} value={f[key]} onChange={set(key)} min={min} max={max} step={step} unit={unit} slider={slider} hint={hint} icon={icon}/>};
 const portName=(id:string)=>PORTS.find(p=>p.id===id)?.name??id;
 async function dispatch(){if(!validateForm(f)){toast.error('Please check the voyage parameters before dispatch.');return}setError(false);setResult(null);setLoading(true);try{const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payloadFor(f)),signal:AbortSignal.timeout(60000)});if(!response.ok)throw new Error('Request failed');const data:unknown=await response.json();if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Invalid response');setResult(data as Record<string,unknown>);toast.success('Voyage forecast received');}catch{setError(true);}finally{setLoading(false)}}
 function reset(){setF({...DEFAULTS});setBaseline(true);setResult(null);setError(false)}
 return <div className="min-h-screen">
  <header className="relative overflow-hidden border-b">
   <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
    <nav className="flex h-18 items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-primary text-primary-foreground glow-card"><Anchor className="h-5 w-5"/></span><span className="text-xl font-bold">tidewise<span className="text-interactive">.</span></span><span className="ml-6 hidden border-l pl-6 text-xs text-spray sm:block">Maritime Command Center</span></div><div className="flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1.5 text-[11px] text-muted-foreground"><span className={`h-1.5 w-1.5 rounded-full ${error?'bg-destructive':'animate-pulse bg-interactive'}`}/>Model API <span className="num hidden text-brass sm:inline">localhost:8000</span></div></nav>
    <div className="relative flex items-center justify-between gap-6 pb-16 pt-6"><div><p className="num text-[11px] tracking-[.3em] text-brass">DRY BULK • FORWARD FREIGHT</p><h1 className="mt-3 text-4xl font-bold">Maritime <span className="bg-gradient-primary bg-clip-text text-transparent">Command Center</span></h1><p className="mt-3 max-w-lg text-sm text-muted-foreground">Chart the voyage, load the manifest and launch a live simulation to forecast four months of freight rates.</p></div><CompassRose className="animate-spin-slow hidden h-32 w-32 shrink-0 drop-shadow-[0_0_20px_var(--gold)] md:block"/></div>
   </div>
   <Waves className="absolute bottom-0 h-12"/>
  </header>
  <main className="mx-auto max-w-[1440px] px-6 pb-10 pt-7 lg:px-10">
   <div className="workspace-heading mb-5 flex items-center justify-between"><div className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-interactive"/><h2 className="text-xs font-semibold tracking-widest">FLEET & VOYAGE CONFIGURATOR</h2></div><Button type="button" variant="ghost" size="sm" onClick={reset} disabled={loading} className="text-muted-foreground hover:bg-secondary hover:text-foreground"><RotateCcw/>Reset parameters</Button></div>
   <div className="grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
    <form className="workbench-form space-y-5" onSubmit={e=>{e.preventDefault();void dispatch()}}>
     <Panel icon={<Navigation className="h-4 w-4"/>} title="Voyage Trajectory & Harbor Selection" tag="01">
      <PortField label="Origin port" value={f.origin_port_id} onChange={set('origin_port_id')} ports={PORTS}/>
      <PortField label="Destination port" value={f.destination_port_id} onChange={set('destination_port_id')} ports={[...PORTS.slice(13),...PORTS.slice(0,13)]}/>
      <div className="space-y-2"><label htmlFor="route-id" className="flex items-center gap-1.5 text-xs font-medium text-label"><RouteIcon className="h-3.5 w-3.5 text-brass"/>Route code</label><input id="route-id" required value={f.route_id} onChange={e=>set('route_id')(e.target.value)} className={`${inputClass} font-semibold text-gold`}/></div>
      <div className="space-y-2"><label htmlFor="departure" className="flex items-center gap-1.5 text-xs font-medium text-label"><Clock className="h-3.5 w-3.5 text-brass"/>Departure month</label><input id="departure" required type="month" value={f.current_month} onChange={e=>set('current_month')(e.target.value)} className={inputClass}/></div>
      <div className="sm:col-span-2">{numeric('distance_nm','Voyage distance','NM',true,`${f.distance_nm.toLocaleString('en-US')} NM ≈ ${(f.distance_nm*1.852).toLocaleString('en-US',{maximumFractionDigits:0})} km`,<WavesIcon className="h-3.5 w-3.5"/>)}</div>
     </Panel>
     <Panel icon={<ShipIcon className="h-4 w-4"/>} title="Bulk Cargo & Vessel Manifest" tag="02" art={<CoalIcon className="hidden h-8 w-8 sm:block"/>}>
      <div className="space-y-2 sm:col-span-2"><span className="block text-xs font-medium text-label">Cargo type</span><div className="grid grid-cols-3 gap-2 sm:grid-cols-5">{CARGO.map(([name,Icon])=><button key={name} type="button" aria-pressed={f.type_of_cargo===name} onClick={()=>set('type_of_cargo')(name)} className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-xs transition ${f.type_of_cargo===name?'border-interactive bg-interactive/10 text-interactive glow-card':'bg-background/50 text-muted-foreground hover:border-spray/50'}`}><Icon className="h-10 w-10"/>{name}</button>)}</div></div>
      <div className="space-y-3 sm:col-span-2">{numeric('quantity_mt','Cargo quantity','MT',true,`${f.quantity_mt.toLocaleString('en-US')} MT = ${(f.quantity_mt*1000).toLocaleString('en-US')} KG`,<Anchor className="h-3.5 w-3.5"/>)}<HoldVisualizer quantity={f.quantity_mt} dwt={f.deadweight_tonnage_dwt}/></div>
      <div className="space-y-2 sm:col-span-2"><span className="block text-xs font-medium text-label">Vessel class</span><div className="grid grid-cols-2 gap-2 xl:grid-cols-4">{VESSELS.map(([name,range,cranes])=><button key={name} type="button" aria-pressed={f.vessel_type===name} onClick={()=>set('vessel_type')(name)} className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-3 transition ${f.vessel_type===name?'border-interactive bg-interactive/10 text-interactive glow-card':'bg-background/50 text-muted-foreground hover:border-spray/50'}`}><Ship cranes={cranes} className={`h-10 ${name==='Capesize'?'w-28':name==='Panamax'?'w-24':name==='Supramax'?'w-20':'w-16'}`}/><span className="text-xs font-semibold">{name}</span><span className="num text-[9px] text-muted-foreground">{range}</span></button>)}</div></div>
      {numeric('deadweight_tonnage_dwt','Deadweight tonnage','DWT',false,undefined,<Anchor className="h-3.5 w-3.5"/>)}
      {numeric('speed_knots','Cruising speed','knots',true,undefined,<Fan className="h-3.5 w-3.5"/>)}
      <div className="sm:col-span-2">{numeric('expected_arrival_hours','Travel duration window','hours',true,`≈ ${(f.expected_arrival_hours/24).toFixed(1)} days`,<Clock className="h-3.5 w-3.5"/>)}</div>
      <div className="border-t pt-4 sm:col-span-2"><p className="text-[10px] font-semibold uppercase tracking-widest text-brass">Cost constants</p></div>
      {numeric('reposition_cost_per_distance','Repositioning rate','USD / NM',false,undefined,<Droplets className="h-3.5 w-3.5"/>)}
      {numeric('idle_cost_per_day','Daily idle demurrage','USD / day',false,undefined,<Gauge className="h-3.5 w-3.5"/>)}
     </Panel>
     <section className="panel-surface overflow-hidden rounded-xl border"><div className="flex items-center gap-3 border-b px-6 py-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-interactive/10 text-interactive ring-1 ring-interactive/30"><SlidersHorizontal className="h-4 w-4"/></span><h2 className="flex-1 text-sm font-semibold">Macroeconomic Market Simulator</h2><span className="num rounded border border-gold/40 px-1.5 py-0.5 text-[10px] text-gold">03</span></div><div className="flex items-center justify-between gap-3 px-6 py-5"><label htmlFor="baseline" className="text-xs font-medium text-label">Auto-sync Baltic Market Indicators</label><Switch id="baseline" checked={baseline} onCheckedChange={v=>{setBaseline(v);if(v)setF(p=>{const next={...p};MARKET.forEach(([key])=>{next[key]=DEFAULTS[key]});next.synthetic_rate_reference=15;return next})}}/></div>{!baseline&&<div className="grid gap-5 border-t p-6 animate-in slide-in-from-top-2 sm:grid-cols-2">{MARKET.map(([key,label,min,max,step,unit])=><NumberField key={key} label={label} value={f[key]} onChange={set(key as NumKey)} min={min} max={max} step={step} unit={unit} slider/>)}<NumberField label="Synthetic historical rate reference" value={f.synthetic_rate_reference} onChange={set('synthetic_rate_reference')} min={0} step={0.01} unit="USD / tonne"/></div>}</section>
     <Button type="submit" disabled={loading} className="animate-radar-border h-auto min-h-14 w-full gap-3 whitespace-normal bg-gradient-primary px-5 py-4 text-xs font-bold tracking-wider text-primary-foreground transition hover:brightness-110 active:scale-[.99]"><Helm className="h-5 w-5"/>LAUNCH VOYAGE SIMULATION &amp; PREDICT FREIGHT RATES<ArrowRight className="ml-auto"/></Button>
     <p className="text-center text-[10px] text-muted-foreground">Freight estimates in USD · Quantities in metric tonnes</p>
    </form>
    <aside className="space-y-4 lg:sticky lg:top-6">
     {error&&!loading&&<div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-xs"><TriangleAlert className="h-5 w-5 shrink-0 text-destructive"/><p className="leading-5">{OFFLINE}</p></div>}
     {loading?<LiveSimulation origin={portName(f.origin_port_id)} destination={portName(f.destination_port_id)} route={f.route_id} distance={f.distance_nm} speed={f.speed_knots} congestion={f.destination_congestion_index}/>:<Results data={result}/>}
    </aside>
   </div>
  </main>
  <footer className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-3 border-t px-6 py-5 text-[10px] text-muted-foreground lg:px-10"><span>Tidewise / Maritime Command Center</span><span className="num text-brass">MODEL-DRIVEN · 4-MONTH HORIZON</span></footer>
 </div>;
}
