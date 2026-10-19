import { useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown, Search, TowerControl } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AnchorDrop, BoatThumb } from './visuals';

const FLAGS: Record<string, string> = { Australia: '🇦🇺', Indonesia: '🇮🇩', 'South Africa': '🇿🇦', Mozambique: '🇲🇿', 'United States': '🇺🇸', 'United Arab Emirates': '🇦🇪', India: '🇮🇳' };

export function Card({ icon, title, badge, children, anchorKey, tone = 'bg-azure' }: { icon: ReactNode; title: string; badge?: ReactNode; children: ReactNode; anchorKey?: string | number; tone?: string }) {
  return <section className="card-3d relative overflow-hidden">
    <div className="pointer-events-none absolute right-16 top-0 h-28 w-10"><AnchorDrop key={anchorKey} className="h-full w-full" /></div>
    <div className={`flex items-center gap-3 border-b-4 border-navy px-6 py-4 ${tone}`}><span className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-navy bg-sun text-navy">{icon}</span><h2 className="flex-1 text-xl font-bold text-sail [text-shadow:0_2px_0_var(--navy)]">{title}</h2>{badge}</div>
    <div className="grid gap-x-6 gap-y-6 p-6 sm:grid-cols-2">{children}</div>
  </section>;
}

export const inputClass = 'num h-12 w-full rounded-2xl border-2 border-b-4 border-navy bg-sail px-4 text-base font-extrabold text-navy outline-none transition focus:border-azure focus:ring-4 focus:ring-skyl/40';
export const labelClass = 'flex items-center gap-1.5 text-sm font-black text-navy';

export function NumberField({ label, value, onChange, min, max, step = 1, unit, pip, icon }: { label: string; value: number; onChange: (v: number) => void; min: number; max?: number; step?: number; unit?: string; pip?: string; icon?: ReactNode }) {
  const id = label.replaceAll(' ', '-').toLowerCase();
  return <div className="space-y-2" data-pip={pip ?? `Careful with that ${label.toLowerCase()}, Captain!`}><label htmlFor={id} className={labelClass}>{icon}{label}</label><div className="relative"><input id={id} type="number" required value={value} min={min} max={max} step={step} onChange={e => onChange(Number(e.target.value))} className={`${inputClass} ${unit ? 'pr-24' : ''}`} />{unit && <span className="pointer-events-none absolute right-4 top-3.5 text-xs font-black text-muted-foreground">{unit}</span>}</div></div>;
}

export function BoatSlider({ label, value, onChange, min, max, step, readout, pip, icon }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; readout: ReactNode; pip: string; icon?: ReactNode }) {
  const [dir, setDir] = useState<-1 | 0 | 1>(0); const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pct = ((value - min) / (max - min)) * 100;
  const change = (v: number) => { setDir(v > value ? 1 : v < value ? -1 : 0); clearTimeout(timer.current); timer.current = setTimeout(() => setDir(0), 450); onChange(v); };
  return <div className="space-y-2 sm:col-span-2" data-pip={pip}>
    <div className="flex items-end justify-between gap-3"><span className={labelClass}>{icon}{label}</span><span className="num rounded-full border-2 border-navy bg-sun px-3 py-1 text-sm font-black">{readout}</span></div>
    <div className="relative h-20 pt-6">
      <div className="absolute inset-x-0 top-12 h-5 overflow-hidden rounded-full border-2 border-navy bg-mist"><div className="h-full bg-gradient-to-r from-skyl to-azure" style={{ width: `${pct}%` }} /></div>
      <div className="pointer-events-none absolute top-0 -translate-x-1/2 transition-[left] duration-75" style={{ left: `${pct}%` }}><BoatThumb dir={dir} /></div>
      <input type="range" aria-label={label} min={min} max={max} step={step} value={value} onChange={e => change(Number(e.target.value))} className="absolute inset-x-0 top-6 h-14 w-full cursor-grab opacity-0 active:cursor-grabbing" />
    </div>
    <div className="num flex justify-between text-xs font-bold text-muted-foreground"><span>{min.toLocaleString()}</span><span>{max.toLocaleString()}</span></div>
  </div>;
}

export function PortField({ label, value, onChange, ports }: { label: string; value: string; onChange: (v: string) => void; ports: { id: string; name: string; country: string }[] }) {
  const [open, setOpen] = useState(false); const [query, setQuery] = useState(''); const selected = ports.find(p => p.id === value);
  const list = ports.filter(p => `${p.name} ${p.country} ${p.id}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-2" data-pip={`Pick a harbor! ${selected?.name ?? ''} is lovely this time of year.`}><span className={labelClass}><TowerControl className="h-4 w-4 text-buoy" />{label}</span>
    <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><button type="button" role="combobox" aria-label={label} aria-expanded={open} className={`${inputClass} btn-3d flex items-center justify-between gap-2 text-left`}><span className="flex min-w-0 items-center gap-2"><span className="text-lg">{FLAGS[selected?.country ?? '']}</span><span className="truncate">{selected?.name}</span><span className="num rounded-full bg-mist px-2 text-[11px]">{selected?.id}</span></span><ChevronDown className="h-4 w-4 shrink-0" /></button></PopoverTrigger>
      <PopoverContent align="start" className="w-80 rounded-3xl border-2 border-b-4 border-navy bg-foam p-0"><div className="flex items-center gap-2 border-b-2 border-navy/20 p-3"><Search className="h-4 w-4" /><input aria-label={`Search ${label}`} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search city or country" className="w-full bg-transparent text-sm font-bold outline-none" /></div>
        <div className="max-h-64 overflow-auto p-2">{list.map(p => <button key={p.id} type="button" onClick={() => { onChange(p.id); setOpen(false); setQuery(''); }} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left hover:bg-mist"><Check className={`h-4 w-4 ${p.id === value ? 'text-kelp' : 'opacity-0'}`} /><span className="text-lg">{FLAGS[p.country]}</span><span className="flex-1"><span className="block text-sm font-extrabold">{p.name}</span><span className="text-[11px] font-bold text-muted-foreground">{p.country}</span></span><span className="num text-[11px] font-black text-azure">{p.id}</span></button>)}{!list.length && <p className="p-4 text-sm font-bold">No ports found 🧐</p>}</div>
      </PopoverContent></Popover></div>;
}
