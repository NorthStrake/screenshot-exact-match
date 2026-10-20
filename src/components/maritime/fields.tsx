import { useState, type ReactNode } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function Card({ index, title, description, children, action }: { index: string; title: string; description?: string; children: ReactNode; action?: ReactNode }) {
  return <section className="animate-fade-up rounded-2xl border bg-card shadow-[0_1px_2px_rgba(15,42,67,.05),0_12px_32px_-16px_rgba(15,42,67,.15)]">
    <header className="flex items-center gap-4 border-b px-6 py-5">
      <span className="num grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">{index}</span>
      <div className="min-w-0 flex-1"><h2 className="text-lg font-bold">{title}</h2>{description && <p className="truncate text-sm text-muted-foreground">{description}</p>}</div>
      {action}
    </header>
    <div className="grid gap-x-6 gap-y-5 p-6 sm:grid-cols-2">{children}</div>
  </section>;
}

export const inputClass = 'num h-11 w-full rounded-lg border bg-card px-3.5 text-sm font-medium outline-none transition focus:border-azure focus:ring-4 focus:ring-azure/15';
export const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold';

export function NumberField({ label, value, onChange, min, max, step = 1, unit, icon }: { label: string; value: number; onChange: (v: number) => void; min: number; max?: number; step?: number; unit?: string; icon?: ReactNode }) {
  const id = label.replaceAll(' ', '-').toLowerCase();
  return <div><label htmlFor={id} className={labelClass}>{icon}{label}</label><div className="relative"><input id={id} type="number" required value={value} min={min} max={max} step={step} onChange={e => onChange(Number(e.target.value))} className={`${inputClass} ${unit ? 'pr-20' : ''}`} />{unit && <span className="pointer-events-none absolute right-3.5 top-3 text-[11px] font-semibold text-muted-foreground">{unit}</span>}</div></div>;
}

export function SliderField({ label, value, onChange, min, max, step, readout, icon }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; readout: ReactNode; icon?: ReactNode }) {
  return <div className="sm:col-span-2">
    <div className="flex items-end justify-between gap-3"><label htmlFor={label} className={labelClass}>{icon}{label}</label><span className="num rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold">{readout}</span></div>
    <input id={label} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="mt-1 w-full accent-[var(--azure)]" />
    <div className="num flex justify-between text-[11px] text-muted-foreground"><span>{min.toLocaleString()}</span><span>{max.toLocaleString()}</span></div>
  </div>;
}

export function PortField({ label, value, onChange, ports }: { label: string; value: string; onChange: (v: string) => void; ports: { id: string; name: string; country: string }[] }) {
  const [open, setOpen] = useState(false); const [query, setQuery] = useState(''); const selected = ports.find(p => p.id === value);
  const list = ports.filter(p => `${p.name} ${p.country} ${p.id}`.toLowerCase().includes(query.toLowerCase()));
  return <div><span className={labelClass}>{label}</span>
    <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><button type="button" role="combobox" aria-label={label} aria-expanded={open} className={`${inputClass} flex items-center justify-between gap-2 text-left`}><span className="flex min-w-0 items-center gap-2"><span className="truncate font-sans font-semibold">{selected?.name}</span><span className="num shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px]">{selected?.id}</span><span className="hidden shrink-0 font-sans text-xs font-normal text-muted-foreground sm:inline">{selected?.country}</span></span><ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /></button></PopoverTrigger>
      <PopoverContent align="start" className="w-80 rounded-xl border bg-card p-0 shadow-xl"><div className="flex items-center gap-2 border-b p-3"><Search className="h-4 w-4 text-muted-foreground" /><input aria-label={`Search ${label}`} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search port or country" className="w-full bg-transparent text-sm outline-none" /></div>
        <div className="max-h-64 overflow-auto p-1.5">{list.map(p => <button key={p.id} type="button" onClick={() => { onChange(p.id); setOpen(false); setQuery(''); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition hover:bg-secondary"><Check className={`h-4 w-4 shrink-0 ${p.id === value ? 'text-azure' : 'opacity-0'}`} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{p.name}</span><span className="text-[11px] text-muted-foreground">{p.country}</span></span><span className="num text-[11px] font-medium text-azure">{p.id}</span></button>)}{!list.length && <p className="p-4 text-sm text-muted-foreground">No ports found</p>}</div>
      </PopoverContent></Popover></div>;
}
