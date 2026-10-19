import { useEffect, useState, type CSSProperties } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

type C = { className?: string };
export type Mood = 'happy' | 'wow' | 'dizzy' | 'dance' | 'steer' | 'thumbs';

/* ---------- Captain Pip: sailor seagull ---------- */
export function Pip({ mood = 'happy', className = '', spyglass = false }: { mood?: Mood; className?: string; spyglass?: boolean }) {
  const wide = mood === 'wow' || mood === 'dance';
  return <svg viewBox="0 0 100 110" className={className} aria-hidden>
    <ellipse cx="50" cy="104" rx="22" ry="4" className="fill-navy/20" />
    <path d="M38 96v8M62 96v8" className="stroke-buoy" strokeWidth="4" strokeLinecap="round" />
    <g className={mood === 'thumbs' || mood === 'dance' ? 'animate-sway' : ''}><path d="M22 62q-14 6-12 22 10-2 16-12z" className="fill-sail stroke-navy" strokeWidth="2.5" /></g>
    <path d="M78 62q14 6 12 22-10-2-16-12z" className="fill-sail stroke-navy" strokeWidth="2.5" />
    <ellipse cx="50" cy="72" rx="28" ry="26" className="fill-sail stroke-navy" strokeWidth="3" />
    <clipPath id="jersey"><ellipse cx="50" cy="72" rx="26.5" ry="24.5" /></clipPath>
    <g clipPath="url(#jersey)">{[70, 78, 86, 94].map(y => <rect key={y} x="20" y={y} width="60" height="4" className="fill-azure" />)}</g>
    <circle cx="50" cy="40" r="22" className="fill-sail stroke-navy" strokeWidth="3" />
    {mood === 'dizzy' ? <g className="stroke-navy" strokeWidth="3" strokeLinecap="round"><path d="M38 36l7 7M45 36l-7 7M55 36l7 7M62 36l-7 7" /></g>
      : <g><circle cx="42" cy="39" r={wide ? 6.5 : 5} className="fill-sail stroke-navy" strokeWidth="2" /><circle cx="58" cy="39" r={wide ? 6.5 : 5} className="fill-sail stroke-navy" strokeWidth="2" /><circle cx="43" cy="40" r={wide ? 3.6 : 2.6} className="fill-navy" /><circle cx="59" cy="40" r={wide ? 3.6 : 2.6} className="fill-navy" /></g>}
    <circle cx="35" cy="48" r="3.5" className="fill-coral/60" /><circle cx="65" cy="48" r="3.5" className="fill-coral/60" />
    <path d={mood === 'wow' ? 'M43 47l7 12 7-12z' : 'M42 47q8 10 16 0z'} className="fill-buoy stroke-navy" strokeWidth="2" strokeLinejoin="round" />
    <g className={mood === 'thumbs' ? 'animate-wiggle' : ''} style={{ transformOrigin: '50px 22px' }}>
      <path d="M26 24q24-20 48 0v4H26z" className="fill-navy" /><rect x="22" y="26" width="56" height="7" rx="3.5" className="fill-navy" />
      <path d="M24 33q26 8 52 0" className="fill-none stroke-sun" strokeWidth="2.5" /><circle cx="50" cy="20" r="4.5" className="fill-sun stroke-sundeep" strokeWidth="1.5" />
    </g>
    {spyglass && <g transform="rotate(-25 82 62)"><rect x="74" y="56" width="24" height="9" rx="2" className="fill-sun stroke-navy" strokeWidth="2" /><rect x="94" y="54" width="6" height="13" rx="2" className="fill-brassy stroke-navy" strokeWidth="2" /></g>}
    {mood === 'dizzy' && <g className="animate-spin-fast" style={{ transformOrigin: '50px 14px' }}>{[0, 120, 240].map(a => <text key={a} x={50 + 26 * Math.cos(a * Math.PI / 180)} y={14 + 6 * Math.sin(a * Math.PI / 180)} className="fill-sun" fontSize="12" textAnchor="middle">★</text>)}</g>}
  </svg>;
}

/* ---------- Background ---------- */
function Cloud({ className = '', style }: C & { style?: CSSProperties }) {
  return <svg viewBox="0 0 120 50" className={className} style={style} aria-hidden><path d="M20 44a16 16 0 0 1 4-31 22 22 0 0 1 40-4 18 18 0 0 1 32 10 13 13 0 0 1 4 25z" className="fill-sail" /></svg>;
}
function MiniSail({ className = '', style }: C & { style?: CSSProperties }) {
  return <svg viewBox="0 0 60 50" className={className} style={style} aria-hidden><path d="M30 4v34" className="stroke-wooddeep" strokeWidth="2" /><path d="M31 6q16 14 4 30H31z" className="fill-sail animate-billow" /><path d="M29 10q-12 12-4 26h4z" className="fill-sail" /><path d="M8 38h44l-7 9H15z" className="fill-buoy stroke-navy" strokeWidth="2" /></svg>;
}
function Gull({ style }: { style?: CSSProperties }) {
  return <svg viewBox="0 0 40 14" className="animate-gull absolute h-4 w-10" style={style} aria-hidden><path d="M2 10q9-9 18 0q9-9 18 0" className="animate-flap fill-none stroke-navy" strokeWidth="2.5" strokeLinecap="round" /></svg>;
}
export function Waves({ className = '', tone = 'azure' }: C & { tone?: 'azure' | 'skyl' }) {
  return <div className={`pointer-events-none absolute inset-x-0 overflow-hidden ${className}`} aria-hidden>
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="animate-wave-slow absolute bottom-0 h-full w-[200%] opacity-60"><path d="M0 30q75-26 150 0t150 0 150 0 150 0 150 0 150 0 150 0 150 0V60H0z" className="fill-skyl" /></svg>
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="animate-wave absolute bottom-0 h-3/4 w-[200%]"><path d="M0 30q75-22 150 0t150 0 150 0 150 0 150 0 150 0 150 0 150 0V60H0z" className={tone === 'azure' ? 'fill-azure' : 'fill-skyl'} /></svg>
  </div>;
}
export function OceanBackground() {
  return <div className="ocean-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
    <div className="absolute right-[8%] top-10 h-28 w-28 rounded-full bg-sun shadow-[0_0_80px_30px_var(--sand)]" />
    {([[6, 40, 70], [22, 25, 95], [48, 50, 80], [70, 15, 110]] as const).map(([top, w, dur], i) => <Cloud key={i} className="animate-drift absolute opacity-90" style={{ top: `${top}%`, width: `${w * 4}px`, ['--dur' as string]: `${dur}s`, animationDelay: `-${i * 23}s` }} />)}
    <Gull style={{ top: '14%', ['--dur' as string]: '24s' } as CSSProperties} />
    <Gull style={{ top: '20%', ['--dur' as string]: '31s', animationDelay: '-12s' } as CSSProperties} />
    {[[78, 64, 45], [84, 90, 70], [88, 120, 100]].map(([top, size, dur], i) => <MiniSail key={i} className="animate-drift absolute" style={{ top: `${top}%`, width: size, ['--dur' as string]: `${dur}s`, animationDelay: `-${i * 30}s` }} />)}
    <Waves className="bottom-0 h-28" />
  </div>;
}

/* ---------- Anchor drop ---------- */
export function AnchorDrop({ className = '' }: C) {
  return <svg viewBox="0 0 60 120" className={`pointer-events-none ${className}`} aria-hidden>
    <g className="animate-anchor">
      {[0, 1, 2, 3, 4].map(i => <ellipse key={i} cx="30" cy={8 + i * 11} rx="4" ry="6" className="fill-none stroke-soot" strokeWidth="3" />)}
      <circle cx="30" cy="66" r="6" className="fill-none stroke-soot" strokeWidth="4" />
      <path d="M30 72v34M20 80h20" className="stroke-soot" strokeWidth="6" strokeLinecap="round" />
      <path d="M10 94q4 16 20 16t20-16" className="fill-none stroke-soot" strokeWidth="6" strokeLinecap="round" />
      <path d="M6 90l6 6 4-8zM54 90l-6 6-4-8z" className="fill-soot" />
    </g>
    <ellipse cx="30" cy="112" rx="14" ry="4" className="animate-ripple fill-none stroke-skyl" strokeWidth="2.5" />
  </svg>;
}

/* ---------- Cargo icons ---------- */
export function CoalIcon({ className = '' }: C) {
  return <svg viewBox="0 0 64 64" className={className} aria-hidden><g className="animate-bob"><path d="M12 40l6-18 16-8 16 8 4 18-12 12H22z" className="fill-soot stroke-navy" strokeWidth="2.5" strokeLinejoin="round" /><path d="M24 22l8-4 6 4" className="fill-none stroke-sail/60" strokeWidth="2" /><rect x="17" y="28" width="30" height="5" rx="2.5" className="fill-navy" /><circle cx="25" cy="30.5" r="5" className="fill-skyl stroke-navy" strokeWidth="2" /><circle cx="39" cy="30.5" r="5" className="fill-skyl stroke-navy" strokeWidth="2" /><path d="M27 42q5 4 10 0" className="fill-none stroke-sail" strokeWidth="2" strokeLinecap="round" /></g>{[[8, 14], [54, 12], [56, 50]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" className="animate-twinkle fill-soot/50" style={{ animationDelay: `${i * .4}s` }} />)}</svg>;
}
export function OreIcon({ className = '' }: C) {
  return <svg viewBox="0 0 64 64" className={className} aria-hidden><path d="M14 50l8-26 10 26zM28 52l10-36 12 36zM40 52l6-16 8 16z" className="fill-ruby stroke-navy" strokeWidth="2.5" strokeLinejoin="round" /><path d="M38 16l-4 36M22 24l-3 26" className="stroke-coral" strokeWidth="2" />{([[12, 18], [52, 22], [32, 10]] as const).map(([x, y], i) => <path key={i} d={`M${x} ${y - 5}l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z`} className="animate-twinkle fill-sun" style={{ animationDelay: `${i * .5}s` }} />)}</svg>;
}
export function WheatIcon({ className = '' }: C) {
  return <svg viewBox="0 0 64 64" className={className} aria-hidden><g className="animate-sway">{[-10, 0, 10].map(r => <g key={r} transform={`rotate(${r} 32 56)`}><path d="M32 56V16" className="stroke-sundeep" strokeWidth="3" />{[18, 25, 32].map(y => <g key={y}><ellipse cx="27" cy={y} rx="4" ry="7" transform={`rotate(-25 27 ${y})`} className="fill-sun stroke-sundeep" strokeWidth="1.5" /><ellipse cx="37" cy={y} rx="4" ry="7" transform={`rotate(25 37 ${y})`} className="fill-sun stroke-sundeep" strokeWidth="1.5" /></g>)}</g>)}<path d="M24 42q8 4 16 0M26 46l-4 8M38 46l4 8" className="fill-none stroke-ruby" strokeWidth="3.5" strokeLinecap="round" /></g></svg>;
}
export function BauxiteIcon({ className = '' }: C) {
  return <svg viewBox="0 0 64 64" className={className} aria-hidden><g className="animate-bob"><path d="M10 48l8-14 14-4 6 10-4 10z" className="fill-buoy stroke-navy" strokeWidth="2.5" strokeLinejoin="round" /><path d="M30 50l6-18 14-4 6 14-8 10z" className="fill-wood stroke-navy" strokeWidth="2.5" strokeLinejoin="round" /><circle cx="22" cy="40" r="2" className="fill-sand" /><circle cx="44" cy="38" r="2" className="fill-sand" /></g></svg>;
}

/* ---------- Vessel art ---------- */
const HULL: Record<string, [number, number]> = { Handysize: [34, 1], Supramax: [42, 2], Panamax: [50, 3], Capesize: [58, 4] };
export function VesselArt({ type, className = '' }: { type: string; className?: string }) {
  const [w, cranes] = HULL[type] ?? [46, 2]; const x = 40 - w / 2;
  return <svg viewBox="0 0 80 50" className={className} aria-hidden>
    <g className="animate-bob">
      <path d={`M${x} 30h${w}l-5 9H${x + 4}z`} className="fill-buoy stroke-navy" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x={x + w - 12} y="18" width="9" height="12" rx="2" className="fill-sail stroke-navy" strokeWidth="2" />
      <rect x={x + w - 9} y="13" width="3" height="5" className="fill-coral" />
      {Array.from({ length: cranes }, (_, i) => <rect key={i} x={x + 4 + i * 9} y="25" width="7" height="5" rx="1" className="fill-sun stroke-navy" strokeWidth="1.5" />)}
    </g>
    <path d="M0 42q10-4 20 0t20 0 20 0 20 0v8H0z" className="fill-skyl" />
  </svg>;
}

/* ---------- Boat slider thumb ---------- */
export function BoatThumb({ dir }: { dir: -1 | 0 | 1 }) {
  return <div className={`relative transition-transform duration-300 ${dir === 1 ? 'rotate-6' : dir === -1 ? '-scale-x-100 -rotate-6' : ''}`}>
    <svg viewBox="0 0 64 56" className="h-14 w-16 drop-shadow" aria-hidden>
      <path d="M32 6v34" className="stroke-wooddeep" strokeWidth="3" />
      <path d="M34 8q20 14 6 30h-6z" className={`fill-sail stroke-navy ${dir ? 'animate-billow' : ''}`} strokeWidth="2" />
      <path d="M30 12q-14 12-6 26h6z" className="fill-sail stroke-navy" strokeWidth="2" />
      <path d="M34 4l8 3-8 3z" className="fill-coral" />
      <path d="M6 40h52l-8 12H14z" className="fill-buoy stroke-navy" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="20" cy="34" r="5" className="fill-sail stroke-navy" strokeWidth="1.5" /><path d="M15 32q5-6 10 0z" className="fill-navy" />
    </svg>
    {dir !== 0 && <div className="absolute -right-1 bottom-2">{[0, 1, 2].map(i => <span key={i} className="animate-spray absolute h-1.5 w-1.5 rounded-full bg-sail" style={{ animationDelay: `${i * .2}s`, ['--dx' as string]: `${8 + i * 5}px` } as CSSProperties} />)}</div>}
  </div>;
}

/* ---------- Hold visualizer ---------- */
export function HoldVisualizer({ quantity, max }: { quantity: number; max: number }) {
  const piles = Math.max(1, Math.round((quantity / max) * 8));
  return <svg viewBox="0 0 240 70" className="h-20 w-full" aria-hidden>
    <path d="M10 20h220l-16 36H26z" className="fill-buoy stroke-navy" strokeWidth="3" strokeLinejoin="round" />
    <rect x="30" y="22" width="180" height="26" rx="4" className="fill-mist stroke-navy" strokeWidth="2" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${34 + i * 22} 48q11 -${i < piles ? 22 : 0} 22 0z`} className={`fill-soot transition-all duration-500 ${i < piles ? 'opacity-100' : 'opacity-0'}`} />)}
    <path d="M0 60q15-6 30 0t30 0 30 0 30 0 30 0 30 0 30 0 30 0v10H0z" className="fill-skyl" />
  </svg>;
}

/* ---------- Propeller ---------- */
export function Propeller({ speed }: { speed: number }) {
  return <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden><g className="animate-spin-var" style={{ ['--dur' as string]: `${(22 - speed) / 8}s` } as CSSProperties}>{[0, 120, 240].map(r => <ellipse key={r} cx="20" cy="10" rx="5" ry="9" transform={`rotate(${r} 20 20)`} className="fill-sun stroke-navy" strokeWidth="2" />)}<circle cx="20" cy="20" r="4" className="fill-navy" /></g></svg>;
}

/* ---------- Treasure chest ---------- */
export function Chest({ open, className = '' }: { open: boolean; className?: string }) {
  return <svg viewBox="0 0 64 56" className={className} aria-hidden>
    {open && [[18, 10], [32, 4], [46, 10]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" className="animate-twinkle fill-sun" style={{ animationDelay: `${i * .3}s` }} />)}
    <rect x="8" y="28" width="48" height="24" rx="4" className="fill-wood stroke-wooddeep" strokeWidth="3" />
    <g style={{ transformOrigin: '8px 28px', transform: open ? 'rotate(-28deg)' : 'none', transition: 'transform .4s cubic-bezier(.3,1.5,.5,1)' }}><path d="M8 28q0-14 24-14t24 14z" className="fill-wood stroke-wooddeep" strokeWidth="3" /></g>
    <path d="M20 28v24M44 28v24" className="stroke-sun" strokeWidth="4" /><rect x="28" y="30" width="8" height="10" rx="2" className="fill-sun stroke-wooddeep" strokeWidth="2" />
  </svg>;
}

/* ---------- Helm ---------- */
export function Helm({ className = '' }: C) {
  return <svg viewBox="0 0 40 40" className={className} aria-hidden><g className="stroke-current" strokeWidth="3" strokeLinecap="round" fill="none"><circle cx="20" cy="20" r="11" /><circle cx="20" cy="20" r="3" />{[0, 45, 90, 135].map(r => <path key={r} d="M20 3v34" transform={`rotate(${r} 20 20)`} />)}</g></svg>;
}

/* ---------- Island (idle) ---------- */
export function Island() {
  return <svg viewBox="0 0 320 200" className="h-auto w-full" aria-hidden>
    <polygon points="232,52 330,10 330,96" className="animate-beam fill-sun/40" />
    <path d="M150 150q60-50 150 0z" className="fill-sand stroke-sundeep" strokeWidth="3" />
    <path d="M222 120l6-68h8l6 68z" className="fill-sail stroke-navy" strokeWidth="3" /><path d="M223 100h18M225 80h14" className="stroke-coral" strokeWidth="6" />
    <rect x="224" y="42" width="16" height="12" rx="2" className="fill-sun stroke-navy" strokeWidth="3" /><path d="M222 42l10-10 10 10z" className="fill-coral stroke-navy" strokeWidth="3" />
    <path d="M178 140q-4-30 6-52" className="fill-none stroke-wooddeep" strokeWidth="5" /><path d="M184 88q-20-6-30 6M184 88q16-12 30-4M184 88q-6-16-20-18M184 88q12-2 18 14" className="fill-none stroke-kelp" strokeWidth="6" strokeLinecap="round" />
    <rect x="30" y="140" width="110" height="8" rx="2" className="fill-wood stroke-wooddeep" strokeWidth="2" /><path d="M44 148v30M126 148v30" className="stroke-wooddeep" strokeWidth="5" />
    <foreignObject x="58" y="74" width="66" height="70"><Pip className="h-full w-full" /></foreignObject>
    <path d="M118 112q40-30 70 8" className="fill-none stroke-wooddeep" strokeWidth="2" /><path d="M188 120v38" className="stroke-navy" strokeWidth="1" strokeDasharray="2 3" /><circle cx="188" cy="160" r="4" className="fill-coral animate-bob" />
    <path d="M0 165q20-8 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0v35H0z" className="fill-skyl" /><path d="M0 178q20-6 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0v22H0z" className="fill-azure" />
  </svg>;
}

/* ---------- Confetti ---------- */
const CONF = ['bg-sun', 'bg-coral', 'bg-kelp', 'bg-azure', 'bg-buoy'];
export function Confetti() {
  return <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden" aria-hidden>{Array.from({ length: 36 }, (_, i) => <span key={i} className={`animate-confetti absolute top-0 h-3 w-2 rounded-sm ${CONF[i % 5]}`} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 9) * .12}s` }} />)}</div>;
}

/* ---------- Loading voyage ---------- */
const STEPS = ['Shoveling coal into the boiler! 🚂💨', 'Dodging giant sea krakens in the Indian Ocean! 🐙', 'Asking the port seagulls for market tips! 🐦', 'Plotting coordinates into the AI supercomputer! 🧭'];
export function LoadingOverlay({ open }: { open: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => { if (!open) return; setStep(0); const t = setInterval(() => setStep(s => (s + 1) % STEPS.length), 1600); return () => clearInterval(t); }, [open]);
  return <Dialog open={open}><DialogContent showCloseButton={false} onEscapeKeyDown={e => e.preventDefault()} onPointerDownOutside={e => e.preventDefault()} className="card-3d max-w-lg overflow-hidden p-0">
    <DialogTitle className="sr-only">Calculating freight rates</DialogTitle><DialogDescription className="sr-only">Sending your voyage to the prediction server.</DialogDescription>
    <div className="relative h-80 overflow-hidden bg-gradient-to-b from-navy to-azure">
      <div className="absolute left-6 top-0 h-36 w-14"><AnchorDrop className="h-full w-full" /></div>
      <p className="animate-pop absolute right-8 top-8 rotate-6 font-display text-5xl font-black text-sun [-webkit-text-stroke:2px_var(--navy)]" style={{ animationDelay: '.7s' }}>SPLASH!</p>
      <div className="animate-rock absolute bottom-16 left-1/2 w-56 -translate-x-1/2">
        <svg viewBox="0 0 200 110" className="w-full" aria-hidden>
          <path d="M100 10v60" className="stroke-wooddeep" strokeWidth="4" /><path d="M103 14q40 24 10 54h-10z" className="animate-billow fill-sail stroke-navy" strokeWidth="2.5" /><path d="M97 20q-30 20-12 48h12z" className="fill-sail stroke-navy" strokeWidth="2.5" />
          <path d="M20 72h160l-22 30H42z" className="fill-buoy stroke-navy" strokeWidth="3" strokeLinejoin="round" />
          <g className="animate-spin-fast" style={{ transformOrigin: '150px 62px' }}><circle cx="150" cy="62" r="11" className="fill-none stroke-wood" strokeWidth="4" />{[0, 45, 90, 135].map(r => <path key={r} d="M150 46v32" transform={`rotate(${r} 150 62)`} className="stroke-wood" strokeWidth="3" />)}</g>
        </svg>
        <div className="absolute -top-2 right-2 h-16 w-14"><Pip mood="steer" className="h-full w-full" /></div>
      </div>
      <Waves className="bottom-0 h-20" tone="skyl" />
    </div>
    <div className="flex items-center gap-3 p-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sun"><Helm className="animate-spin-fast h-6 w-6 text-navy" /></span><p key={step} aria-live="polite" className="animate-pop rounded-2xl border-2 border-navy bg-sail px-4 py-2 text-sm font-extrabold">{STEPS[step]}</p></div>
  </DialogContent></Dialog>;
}
