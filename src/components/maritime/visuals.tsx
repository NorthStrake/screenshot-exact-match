import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

/* ---------- Brand mark: minimal compass ---------- */
export function Logo({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <circle cx="16" cy="16" r="13.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M21.5 10.5l-3.4 7.1-7.6 3.9 3.4-7.1z" fill="currentColor" />
    <circle cx="16" cy="16" r="1.7" className="fill-card" />
  </svg>;
}

/* ---------- Loading overlay ---------- */
const STEPS = ['Connecting to port telemetry & route API…', 'Calculating DWT draft constraints & transit lags…', 'Simulating 4-month forward charter index…'];
export function LoadingOverlay({ open }: { open: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => { if (!open) return; setStep(0); const t = setInterval(() => setStep(s => (s + 1) % STEPS.length), 1400); return () => clearInterval(t); }, [open]);
  return <Dialog open={open}><DialogContent showCloseButton={false} onEscapeKeyDown={e => e.preventDefault()} onPointerDownOutside={e => e.preventDefault()} className="max-w-md border-none p-8 shadow-2xl">
    <DialogTitle className="sr-only">Running forecast model</DialogTitle><DialogDescription className="sr-only">Sending your voyage to the prediction server.</DialogDescription>
    <div className="flex flex-col items-center text-center">
      <div className="relative grid h-16 w-16 place-items-center">
        <span className="animate-ping-soft absolute inset-0 rounded-full bg-azure/30" />
        <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground"><Logo className="h-8 w-8" /></span>
      </div>
      <p className="mt-5 text-lg font-bold">Running forecast model</p>
      <p key={step} aria-live="polite" className="animate-fade-up mt-1.5 min-h-5 text-sm text-muted-foreground">{STEPS[step]}</p>
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary"><div className="animate-progress h-full w-2/5 rounded-full bg-azure" /></div>
      <p className="num mt-4 text-xs text-muted-foreground">localhost:8000/predict</p>
    </div>
  </DialogContent></Dialog>;
}
