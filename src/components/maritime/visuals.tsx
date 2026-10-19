import { useEffect, useState } from 'react';
import { Radio, Satellite, Waves as WavesIcon, Zap, Ship as ShipLucide, BarChart3 } from 'lucide-react';

export function Waves({className=''}:{className?:string}) {
 return <div className={`pointer-events-none ${className.includes('absolute')?'':'relative'} w-full overflow-hidden ${className}`} aria-hidden>
  <svg className="animate-wave-slow absolute bottom-0 h-full w-[200%]" viewBox="0 0 2400 80" preserveAspectRatio="none"><path d="M0 28 Q150 5 300 28 T600 28 T900 28 T1200 28 T1500 28 T1800 28 T2100 28 T2400 28 V80 H0Z" className="fill-spray/15"/></svg>
  <svg className="animate-wave absolute bottom-0 h-full w-[200%]" viewBox="0 0 2400 80" preserveAspectRatio="none"><path d="M0 48 Q150 28 300 48 T600 48 T900 48 T1200 48 T1500 48 T1800 48 T2100 48 T2400 48 V80 H0Z" className="fill-interactive/20"/><path d="M0 48 Q150 28 300 48 T600 48 T900 48 T1200 48 T1500 48 T1800 48 T2100 48 T2400 48" className="fill-none stroke-foreground/50" strokeWidth="1.5" strokeDasharray="3 7"/></svg>
 </div>;
}

/** Bulk carrier silhouette with cranes, hatches, coal mounds and a Plimsoll mark. */
export function Ship({className='',cranes=3,mounds=true}:{className?:string;cranes?:number;mounds?:boolean}) {
 const hatches=[40,68,96,124];
 return <svg viewBox="0 0 220 90" className={className} aria-hidden>
  <path d="M8 46H210L190 74H32Z" className="fill-secondary stroke-spray" strokeWidth="1.2"/>
  <path d="M14 56H202" className="stroke-brass" strokeWidth="1.5"/>
  <path d="M26 66H196" className="stroke-destructive/70" strokeWidth="3"/>
  <g className="stroke-brass" strokeWidth="1"><circle cx="58" cy="60" r="3.5" className="fill-none"/><path d="M53 60h10"/></g>
  {hatches.map(x=><g key={x}><rect x={x} y="38" width="24" height="8" rx="1" className="fill-muted"/>{mounds&&<path d={`M${x+2} 38 Q${x+7} 30 ${x+12} 33 Q${x+17} 28 ${x+22} 38Z`} className="fill-coal"/>}</g>)}
  {hatches.slice(0,cranes).map(x=><path key={x} d={`M${x+26} 46V22l14 10`} className="fill-none stroke-brass" strokeWidth="1.5"/>)}
  <rect x="160" y="16" width="26" height="30" rx="1" className="fill-foreground/90"/>
  <path d="M164 24h18M164 31h18" className="stroke-secondary" strokeWidth="2.5"/>
  <rect x="176" y="6" width="6" height="10" className="fill-brass"/>
  <path d="M168 16V4" className="stroke-spray" strokeWidth="1.5"/>
 </svg>;
}

export function CompassRose({className=''}:{className?:string}) {
 const pts=Array.from({length:16},(_,i)=>i*22.5);
 return <svg viewBox="0 0 120 120" className={className} aria-hidden>
  <circle cx="60" cy="60" r="56" className="fill-none stroke-gold/60"/><circle cx="60" cy="60" r="50" className="fill-none stroke-gold/30" strokeDasharray="1 4"/>
  {pts.map((a,i)=>{const len=i%4===0?46:i%2===0?34:24;const w=i%4===0?7:i%2===0?5:3;return <path key={a} transform={`rotate(${a} 60 60)`} d={`M60 ${60-len}L${60+w} 60L60 60Z`} className={i%4===0?'fill-gold':i%2===0?'fill-brass/80':'fill-spray/60'}/>})}
  {pts.map((a,i)=>{const len=i%4===0?46:i%2===0?34:24;const w=i%4===0?7:i%2===0?5:3;return <path key={`b${a}`} transform={`rotate(${a} 60 60)`} d={`M60 ${60-len}L${60-w} 60L60 60Z`} className={i%4===0?'fill-brass':'fill-secondary'}/>})}
  <circle cx="60" cy="60" r="4" className="fill-gold stroke-background"/>
  <text x="60" y="9" textAnchor="middle" className="fill-gold text-[8px] font-bold">N</text>
 </svg>;
}

export function CoalIcon({className=''}:{className?:string}) {
 return <svg viewBox="0 0 48 48" className={className} aria-hidden>
  <path d="M6 38h36l-4 6H10Z" className="fill-brass/70"/><circle cx="14" cy="45" r="2" className="fill-gold"/><circle cx="34" cy="45" r="2" className="fill-gold"/>
  <path d="M8 38L14 24L22 28L30 18L40 30L42 38Z" className="fill-coal stroke-spray/40"/>
  <path d="M14 24L18 32L22 28M30 18L28 30L40 30M22 28L28 30" className="fill-none stroke-spray/50" strokeWidth=".8"/>
  <path d="M30 18L34 26L40 30" className="fill-foreground/15"/>
 </svg>;
}
export function OreIcon({className=''}:{className?:string}) {
 return <svg viewBox="0 0 48 48" className={className} aria-hidden><path d="M8 36L16 20L28 16L40 26L38 38L20 40Z" className="fill-destructive/60 stroke-spray/40"/><path d="M16 20L22 30L28 16M22 30L38 38M22 30L20 40" className="fill-none stroke-foreground/30" strokeWidth=".8"/></svg>;
}
export function WheatIcon({className=''}:{className?:string}) {
 return <svg viewBox="0 0 48 48" className={className} aria-hidden><path d="M24 44V10" className="stroke-gold" strokeWidth="2"/>{[14,20,26,32].map(y=><g key={y}><ellipse cx="19" cy={y} rx="4" ry="2.4" transform={`rotate(-35 19 ${y})`} className="fill-gold"/><ellipse cx="29" cy={y} rx="4" ry="2.4" transform={`rotate(35 29 ${y})`} className="fill-brass"/></g>)}</svg>;
}
export function BauxiteIcon({className=''}:{className?:string}) {
 return <svg viewBox="0 0 48 48" className={className} aria-hidden><path d="M6 40Q14 22 24 24Q34 16 42 40Z" className="fill-warning/70 stroke-spray/40"/>{[[16,34],[26,30],[33,36],[22,37]].map(([x,y])=><circle key={`${x}${y}`} cx={x} cy={y} r="2" className="fill-destructive/50"/>)}</svg>;
}
export function GrainIcon({className=''}:{className?:string}) {
 return <svg viewBox="0 0 48 48" className={className} aria-hidden><path d="M6 40Q24 14 42 40Z" className="fill-gold/80"/>{[[18,34],[24,28],[30,34],[22,36],[28,38]].map(([x,y])=><ellipse key={`${x}${y}`} cx={x} cy={y} rx="1.8" ry="1" className="fill-brass"/>)}</svg>;
}

export function Crane({className=''}:{className?:string}) {
 return <svg viewBox="0 0 40 40" className={className} aria-hidden><path d="M8 38V8h4v30M4 38h14M10 8h26M10 8l8-6M30 8v12" className="fill-none stroke-brass" strokeWidth="1.8"/><rect x="26" y="20" width="8" height="5" className="fill-interactive"/></svg>;
}

/** Cross-section of a cargo hold filled proportionally to quantity vs. DWT. */
export function HoldVisualizer({quantity,dwt}:{quantity:number;dwt:number}) {
 const pct=Math.max(0,Math.min(1,dwt>0?quantity/dwt:0));const top=78-pct*58;
 return <div className="rounded-md border bg-background/60 p-3">
  <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground"><span>Hold fill vs. DWT</span><span className="num text-brass">{(pct*100).toFixed(0)}%</span></div>
  <svg viewBox="0 0 300 90" className="h-24 w-full" aria-label={`Cargo hold ${(pct*100).toFixed(0)} percent full`}>
   <defs><clipPath id="hold"><path d="M20 10H280L262 80H38Z"/></clipPath><pattern id="coal" width="12" height="10" patternUnits="userSpaceOnUse"><rect width="12" height="10" className="fill-coal"/><path d="M0 8L4 3L8 7L12 2" className="fill-none stroke-spray/25" strokeWidth=".8"/></pattern></defs>
   <g clipPath="url(#hold)">
    <rect x="0" y="0" width="300" height="90" className="fill-secondary/60"/>
    <path d={`M0 ${top} Q40 ${top-8} 75 ${top} T150 ${top} T225 ${top} T300 ${top} V90H0Z`} fill="url(#coal)" className="transition-all duration-500"><animate attributeName="opacity" values="1;.88;1" dur="3s" repeatCount="indefinite"/></path>
   </g>
   <path d="M20 10H280L262 80H38Z" className="fill-none stroke-spray" strokeWidth="1.5"/>
   {[30,50,70].map(y=><path key={y} d={`M282 ${y}h10`} className="stroke-brass"/>)}
  </svg>
 </div>;
}

const tick=(i:number)=>`[${(0.4+i*0.45).toFixed(1)}s]`;
export function LiveSimulation({origin,destination,route,distance,speed,congestion}:{origin:string;destination:string;route:string;distance:number;speed:number;congestion:number}) {
 const lines=[
  [Satellite,`AIS link established • Route ${route} locked (${distance.toLocaleString('en-US')} NM)`],
  [WavesIcon,'Calculating hydrodynamic resistance & max draft clearance...'],
  [Zap,'Polling global bunker fuel & Baltic Dry Index futures...'],
  [ShipLucide,`Simulating ${speed.toFixed(1)} knots transit • destination congestion ${congestion.toFixed(2)}...`],
  [BarChart3,'Running 4-month forward regressors & order allocation matrix...'],
 ] as const;
 const [shown,setShown]=useState(1);
 useEffect(()=>{const t=setInterval(()=>setShown(s=>Math.min(lines.length,s+1)),450);return()=>clearInterval(t)},[lines.length]);
 return <section className="report overflow-hidden rounded-xl border border-interactive/40 bg-card glow-card" aria-live="polite">
  <div className="flex items-center gap-2 border-b px-5 py-4"><Radio className="h-4 w-4 animate-pulse text-interactive"/><h2 className="text-sm font-semibold">Live Maritime Telemetry</h2><span className="ml-auto rounded-full bg-interactive/15 px-2 py-0.5 num text-[10px] text-interactive">SIMULATING</span></div>
  <div className="relative h-44 overflow-hidden bg-gradient-to-b from-background to-secondary">
   <div className="animate-sail absolute bottom-10 w-44"><div className="relative"><div className="wake absolute -left-16 bottom-1 h-3 w-24 rounded-full"/><Ship className="animate-pitch w-44"/><span className="bow-foam absolute -right-1 bottom-0 h-3 w-5 rounded-full"/></div></div>
   <Waves className="absolute bottom-0 h-16"/>
  </div>
  <div className="relative border-y bg-background/70 p-4">
   <svg viewBox="0 0 320 130" className="h-36 w-full" aria-label={`Route chart from ${origin} to ${destination}`}>
    <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" className="fill-none stroke-border/60" strokeWidth=".5"/></pattern></defs>
    <rect width="320" height="130" fill="url(#grid)"/>
    <g transform="translate(250 34)"><circle r="28" className="fill-none stroke-interactive/30"/><circle r="18" className="fill-none stroke-interactive/30"/><circle r="6" className="animate-ping-slow fill-none stroke-interactive"/><path d="M0 0L28 0A28 28 0 0 1 14 24Z" className="animate-radar fill-interactive/25"/>{[[12,-14],[-16,10],[20,12]].map(([x,y])=><circle key={`${x}${y}`} cx={x} cy={y} r="1.6" className="fill-brass"/>)}</g>
    <path d="M30 100 C90 40 140 120 190 70 S270 60 290 100" className="route-draw fill-none stroke-interactive" strokeWidth="2" strokeDasharray="6 5"/>
    {[[30,100,origin],[290,100,destination]].map(([x,y,label])=><g key={String(label)}><circle cx={Number(x)} cy={Number(y)} r="5" className="fill-brass"/><circle cx={Number(x)} cy={Number(y)} r="9" className="animate-ping-slow fill-none stroke-brass"/><text x={Number(x)} y={Number(y)+20} textAnchor="middle" className="fill-foreground text-[9px] font-semibold">{label}</text></g>)}
    {[[110,82],[190,70]].map(([x,y])=><circle key={x} cx={x} cy={y} r="2.5" className="fill-spray"/>)}
   </svg>
  </div>
  <div className="num min-h-44 space-y-2 bg-background p-4 text-[11px]">{lines.slice(0,shown).map(([Icon,text],i)=><p key={text} className="typewriter flex items-start gap-2 text-spray"><span className="text-brass">{tick(i)}</span><Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-interactive"/><span>{text}</span></p>)}<span className="inline-block h-3 w-2 animate-pulse bg-interactive"/></div>
 </section>;
}
