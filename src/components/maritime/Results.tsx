import { Anchor, BadgeCheck, CalendarDays, Download, FileText, Fuel, Gauge, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompassRose, Waves } from './visuals';
type Json=Record<string,unknown>;
const get=(o:unknown,...keys:string[]):unknown=>{if(!o||typeof o!=='object')return undefined;for(const key of keys){const value=(o as Json)[key];if(value!==null&&value!==undefined)return value}return undefined};
const show=(value:unknown,usd=false)=>value===undefined||value===null||value===''?'—':typeof value==='number'?`${usd?'$':''}${value.toLocaleString('en-US',{maximumFractionDigits:2})}`:String(value);
const object=(v:unknown):Json=>v&&typeof v==='object'&&!Array.isArray(v)?v as Json:{};
const PARTICLES=[[12,30],[28,70],[44,20],[62,80],[78,40],[88,65],[20,50],[70,15]];

export function Results({data}:{data:Json|null}) {
 if(!data)return <section className="report relative overflow-hidden rounded-xl border panel-surface">
  <div className="flex items-center justify-between border-b px-5 py-4"><h2 className="text-sm font-semibold">Voyage Prediction Console</h2><span className="flex items-center gap-1.5 num text-[10px] text-brass"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass"/>STANDBY</span></div>
  <div className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden px-7 py-10 text-center">
   <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden><defs><pattern id="chart" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" className="fill-none stroke-border" strokeWidth=".6"/></pattern></defs><rect width="100%" height="100%" fill="url(#chart)"/></svg>
   {PARTICLES.map(([x,y],i)=><span key={i} className="animate-float absolute h-1.5 w-1.5 rounded-full bg-interactive/70" style={{left:`${x}%`,top:`${y}%`,animationDelay:`${i*0.6}s`}}/>)}
   <span className="absolute left-6 top-6 num text-[9px] text-spray/70">32°55′S 151°47′E</span><span className="absolute bottom-16 right-6 num text-[9px] text-spray/70">20°16′N 86°40′E</span>
   <CompassRose className="animate-spin-slow relative h-40 w-40 drop-shadow-[0_0_18px_var(--gold)]"/>
   <h3 className="relative mt-6 text-sm font-bold tracking-[.2em] text-gold">VOYAGE DISPATCH STANDBY</h3>
   <p className="relative mt-3 max-w-xs text-xs leading-6 text-muted-foreground">Configure harbor parameters and launch real-time simulation.</p>
  </div>
  <Waves className="absolute bottom-0 h-12"/>
 </section>;
 const alloc=object(get(data,'allocation','optimal_allocation','fleet_allocation','order_matching')??data);const diag=object(get(data,'diagnostics','kpis','voyage_diagnostics','metrics')??data);const raw=get(data,'forecast','forecasts','freight_forecast','monthly_forecast');const forecast=Array.isArray(raw)?raw:[];
 const status=String(get(alloc,'status','allocation_status')??'');const eligible=/^eligible$/i.test(status.trim());
 const total=get(alloc,'total_cost','net_cost','total_optimized_cost')??get(data,'total_estimated_freight_cost');
 const rows=forecast.slice(0,4).map((m,i)=>[show(get(m,'horizon_month','month')??`Month +${i+1}`),show(get(m,'freight_rate','predicted_rate','rate_usd_per_tonne'),true),show(get(m,'total_cost','total_freight_cost'),true),show(get(m,'arrival_date','estimated_arrival_date'))]);
 const util=get(diag,'capacity_utilization','dwt_utilization');const utilPct=typeof util==='number'?Math.min(100,util<=1?util*100:util):null;
 const costs=[['Repositioning surcharge',get(alloc,'reposition_cost','repositioning_cost')],['Demurrage / idle days',get(alloc,'idle_days','demurrage_days')],['Idle cost',get(alloc,'idle_cost','idle_surcharge')]];
 function exportCsv(){const values=[['Voyage report'],['Days at sea',show(get(diag,'transit_days','days_at_sea','transit_time_days'))],['Matched order',show(get(alloc,'order_id','matched_order_id'))],['Status',status],[],['Horizon month','Predicted rate (USD/tonne)','Total freight (USD)','Expected arrival date'],...rows,[],...costs.map(([label,value])=>[String(label),show(value)]),['Net minimized cost',show(total,true)]];const csv=values.map(row=>row.map(v=>{const safe=/^[=+@\-\t\r]/.test(v)?`'${v}`:v;return `"${safe.replaceAll('"','""')}"`}).join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='tidewise-voyage-report.csv';a.click();URL.revokeObjectURL(url)}
 return <section className="report overflow-hidden rounded-xl border panel-surface animate-in fade-in duration-500">
  <div className="flex items-center justify-between border-b px-5 py-4"><h2 className="text-sm font-semibold">Voyage Prediction Console</h2><span className="num text-[10px] text-interactive">MODEL RESPONSE</span></div>
  <div className="p-5"><h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">4-Month Freight Rate Forecast</h3>
   {rows.length?<div className="grid grid-cols-2 gap-3">{rows.map(([m,rate,cost,date],i)=><div key={i} className="rounded-lg border border-interactive/30 bg-background/60 p-3 glow-card"><p className="num text-[10px] text-brass">{m}</p><p className="num mt-1 text-lg font-semibold text-interactive">{rate}<span className="ml-1 text-[9px] text-muted-foreground">/t</span></p><p className="num text-[11px]">{cost}</p><p className="mt-1 flex items-center gap-1 num text-[10px] text-muted-foreground"><CalendarDays className="h-3 w-3"/>{date}</p></div>)}</div>:<p className="text-xs text-muted-foreground">No forecast rows returned.</p>}
  </div>
  <div className="mx-5 rounded-lg border border-gold/40 bg-background/50 p-4"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-semibold"><Anchor className="h-4 w-4 text-gold"/>Optimal Order Matching</span><span className="num rounded bg-gold/15 px-2 py-0.5 text-[10px] text-gold">{show(get(alloc,'order_id','matched_order_id'))}</span></div>
   <dl className="mt-3 space-y-2">{costs.map(([label,value])=><div key={String(label)} className="flex justify-between text-xs"><dt className="text-muted-foreground">{String(label)}</dt><dd className="num">{show(value,String(label)!=='Demurrage / idle days')}</dd></div>)}<div className="flex justify-between border-t pt-2 text-sm font-semibold"><dt>Net minimized cost</dt><dd className="num text-interactive">{show(total,true)}</dd></div></dl>
   {status&&<span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest ${eligible?'bg-interactive/15 text-interactive glow-card':'bg-brass/15 text-brass'}`}><BadgeCheck className="h-3.5 w-3.5"/>{status.toUpperCase()}</span>}
  </div>
  <div className="grid grid-cols-2 gap-3 p-5">{[[Fuel,'Fuel efficiency score',show(get(diag,'fuel_efficiency_score','fuel_efficiency'))],[Timer,'Days at sea',show(get(diag,'transit_days','days_at_sea','transit_time_days'))]].map(([Icon,label,value])=>{const I=Icon as typeof Fuel;return <div key={String(label)} className="rounded-lg border bg-background/50 p-3"><I className="h-4 w-4 text-brass"/><p className="mt-2 text-[10px] text-muted-foreground">{String(label)}</p><p className="num text-base">{String(value)}</p></div>})}
   <div className="col-span-2 rounded-lg border bg-background/50 p-3"><p className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><Gauge className="h-3.5 w-3.5 text-brass"/>DWT capacity utilization <span className="num ml-auto text-foreground">{utilPct===null?'—':`${utilPct.toFixed(1)}%`}</span></p><div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-gradient-primary" style={{width:`${utilPct??0}%`}}/></div></div>
  </div>
  <div className="report-controls flex gap-2 border-t p-5"><Button variant="outline" size="sm" onClick={exportCsv} className="flex-1 bg-transparent"><Download/>Export CSV</Button><Button variant="outline" size="icon" aria-label="Export voyage report as PDF" onClick={()=>window.print()} className="bg-transparent"><FileText/></Button></div>
  <details className="report-controls border-t px-5 py-3"><summary className="cursor-pointer text-[10px] text-muted-foreground">Model response</summary><pre className="num mt-3 max-h-64 overflow-auto text-[10px]">{JSON.stringify(data,null,2)}</pre></details>
 </section>;
}
