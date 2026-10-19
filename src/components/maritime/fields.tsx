import { useState, type ReactNode } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Crane, Waves } from './visuals';

const FLAGS:Record<string,string>={Australia:'🇦🇺',Indonesia:'🇮🇩','South Africa':'🇿🇦',Mozambique:'🇲🇿','United States':'🇺🇸','United Arab Emirates':'🇦🇪',India:'🇮🇳'};

export function Panel({icon,title,tag,children,extra,art}:{icon:ReactNode;title:string;tag:string;children:ReactNode;extra?:ReactNode;art?:ReactNode}) {
 return <section className="panel-surface relative overflow-hidden rounded-xl border">
  <div className="relative flex items-center gap-3 border-b px-6 py-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-interactive/10 text-interactive ring-1 ring-interactive/30">{icon}</span><h2 className="flex-1 text-sm font-semibold tracking-wide">{title}</h2>{art}<span className="num rounded border border-gold/40 px-1.5 py-0.5 text-[10px] text-gold">{tag}</span></div>
  {extra}<div className="relative grid gap-x-5 gap-y-5 p-6 pb-10 sm:grid-cols-2">{children}</div>
  <Waves className="absolute bottom-0 h-6 opacity-70"/>
 </section>;
}
export const inputClass = 'num h-11 w-full rounded-md border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-interactive focus:ring-2 focus:ring-interactive/20';
export function NumberField({label,value,onChange,min,max,step=1,unit,hint,slider=false,icon}:{label:string;value:number;onChange:(v:number)=>void;min:number;max?:number;step?:number;unit?:string;hint?:string | undefined;slider?:boolean;icon?:ReactNode}) {
 const id=label.replaceAll(' ','-');
 return <div className="space-y-2"><label htmlFor={id} className="flex items-center gap-1.5 text-xs font-medium text-label">{icon&&<span className="text-brass">{icon}</span>}{label}</label><div className="relative"><input id={id} type="number" required value={value} min={min} max={max} step={step} onChange={e=>onChange(Number(e.target.value))} className={`${inputClass} ${unit?'pr-24':''}`} />{unit&&<span className="pointer-events-none absolute right-3 top-3 text-[11px] text-muted-foreground">{unit}</span>}</div>{slider&&max!==undefined&&<Slider aria-label={`${label} slider`} value={[value]} min={min} max={max} step={step} onValueChange={([v])=>onChange(v??min)} className="py-1"/>}{hint&&<p className="num text-[10px] text-muted-foreground">{hint}</p>}</div>;
}
export function PortField({label,value,onChange,ports}:{label:string;value:string;onChange:(v:string)=>void;ports:{id:string;name:string;country:string}[]}) {
 const [open,setOpen]=useState(false);const [query,setQuery]=useState('');const selected=ports.find(p=>p.id===value);
 const list=ports.filter(p=>`${p.name} ${p.country} ${p.id}`.toLowerCase().includes(query.toLowerCase()));
 return <div className="space-y-2"><label className="flex items-center gap-1.5 text-xs font-medium text-label"><Crane className="h-4 w-4"/>{label}</label><Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><Button type="button" variant="outline" role="combobox" aria-label={label} aria-expanded={open} className="h-11 w-full justify-between border-border bg-background/60 px-3 font-normal hover:bg-secondary"><span className="flex min-w-0 items-center gap-2"><span>{FLAGS[selected?.country??'']}</span><span className="truncate">{selected?.name}</span><span className="num truncate text-[10px] text-brass">{selected?.id}</span></span><ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground"/></Button></PopoverTrigger><PopoverContent align="start" className="w-80 border-border bg-secondary p-0"><div className="flex items-center gap-2 border-b p-3"><Search className="h-4 w-4 text-muted-foreground"/><input aria-label={`Search ${label}`} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search city or country" className="w-full bg-transparent text-sm outline-none"/></div><div className="max-h-64 overflow-auto p-1">{list.map(p=><Button key={p.id} type="button" variant="ghost" onClick={()=>{onChange(p.id);setOpen(false);setQuery('')}} className="h-auto w-full justify-start gap-2 py-2 hover:bg-accent"><Check className={`h-3 w-3 ${p.id===value?'text-interactive':'opacity-0'}`}/><span>{FLAGS[p.country]}</span><span className="flex-1 text-left"><span className="block text-xs">{p.name}</span><span className="text-[10px] font-normal text-muted-foreground">{p.country}</span></span><span className="num text-[10px] font-normal text-brass">{p.id}</span></Button>)}{!list.length&&<p className="p-4 text-xs text-muted-foreground">No ports found</p>}</div></PopoverContent></Popover></div>;
}
