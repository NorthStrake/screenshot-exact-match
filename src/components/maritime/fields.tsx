import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export function Panel({ icon, title, tag, children, collapsible, defaultOpen = true }: {
  icon: ReactNode; title: string; tag: string; children: ReactNode; collapsible?: boolean; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="glass glass-hover rounded-2xl">
      <button
        type="button"
        onClick={() => collapsible && setOpen(!open)}
        className={`flex w-full items-center gap-3 p-5 text-left ${collapsible ? "cursor-pointer" : "cursor-default"}`}
      >
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">{icon}</span>
        <div className="flex-1">
          <p className="num text-[10px] uppercase tracking-[0.2em] text-primary">{tag}</p>
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        {collapsible && <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>
      {open && <div className="grid gap-5 border-t px-5 pb-5 pt-4 sm:grid-cols-2 animate-in fade-in">{children}</div>}
    </section>
  );
}

const fmt = (v: number, step: number) =>
  v.toLocaleString("en-US", { maximumFractionDigits: step < 1 ? (step < 0.1 ? 2 : 1) : 0, minimumFractionDigits: step < 1 ? (step < 0.1 ? 2 : 1) : 0 });

export function SliderField({ label, value, onChange, min, max, step, prefix = "", unit = "", hint, input }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number;
  prefix?: string; unit?: string; hint?: string; input?: boolean;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        {input ? (
          <input
            type="number" min={min} max={max} step={step} value={value}
            onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
            className="num w-28 rounded-md border bg-abyss/60 px-2 py-1 text-right text-sm text-foreground outline-none focus:border-primary"
          />
        ) : (
          <span className="num text-sm text-foreground">{prefix}{fmt(value, step)}{unit && <span className="ml-1 text-muted-foreground">{unit}</span>}</span>
        )}
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v ?? min)} />
      {hint && <p className="num text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border bg-abyss/60 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:shadow-glow"
      >
        {options.map((o) => <option key={o.value} value={o.value} className="bg-popover">{o.label}</option>)}
      </select>
    </div>
  );
}

export function PortField({ label, value, onChange, ports }: {
  label: string; value: string; onChange: (v: string) => void; ports: { name: string; country: string; flag: string }[];
}) {
  const id = label.replace(/\s/g, "-");
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        list={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search port…"
        className="w-full rounded-lg border bg-abyss/60 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:shadow-glow"
      />
      <datalist id={id}>
        {ports.map((p) => <option key={p.name} value={p.name}>{p.flag} {p.country}</option>)}
      </datalist>
    </div>
  );
}

export function Pills({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="space-y-2 sm:col-span-2">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="grid grid-cols-2 gap-1 rounded-xl border bg-abyss/60 p-1 sm:grid-cols-4">
        {options.map((o) => (
          <button
            key={o} type="button" onClick={() => onChange(o)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${value === o ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"}`}
          >{o}</button>
        ))}
      </div>
    </div>
  );
}
