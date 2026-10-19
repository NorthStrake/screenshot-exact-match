const wavePath = (h: number, amp: number) =>
  `M0 ${h} Q 150 ${h - amp} 300 ${h} T 600 ${h} T 900 ${h} T 1200 ${h} T 1500 ${h} T 1800 ${h} T 2100 ${h} T 2400 ${h} V 200 H 0 Z`;

export function Waves({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none relative h-32 w-full overflow-hidden ${className}`} aria-hidden>
      <svg className="animate-wave-slow absolute bottom-0 h-full w-[200%]" viewBox="0 0 2400 200" preserveAspectRatio="none">
        <path d={wavePath(90, 30)} className="fill-primary/10" />
      </svg>
      <svg className="animate-wave absolute bottom-0 h-full w-[200%]" viewBox="0 0 2400 200" preserveAspectRatio="none">
        <path d={wavePath(120, 24)} className="fill-accent/10" />
      </svg>
      <svg className="animate-wave-slow absolute bottom-0 h-full w-[200%] [animation-direction:reverse]" viewBox="0 0 2400 200" preserveAspectRatio="none">
        <path d={wavePath(150, 18)} className="fill-abyss/80" />
      </svg>
    </div>
  );
}

export function Ship({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 90" className={className} aria-hidden>
      <rect x="40" y="22" width="22" height="16" rx="1" className="fill-primary" />
      <rect x="64" y="22" width="22" height="16" rx="1" className="fill-accent" />
      <rect x="88" y="22" width="22" height="16" rx="1" className="fill-primary/70" />
      <rect x="112" y="22" width="22" height="16" rx="1" className="fill-accent/70" />
      <rect x="52" y="6" width="22" height="16" rx="1" className="fill-accent/80" />
      <rect x="76" y="6" width="22" height="16" rx="1" className="fill-primary/80" />
      <rect x="100" y="6" width="22" height="16" rx="1" className="fill-accent" />
      <rect x="150" y="4" width="26" height="34" rx="2" className="fill-foreground" />
      <rect x="155" y="10" width="16" height="5" className="fill-ocean" />
      <path d="M10 40 H 205 L 188 72 H 30 Z" className="fill-ocean stroke-primary" strokeWidth="2" />
      <path d="M22 56 H 196" className="stroke-destructive/70" strokeWidth="3" />
    </svg>
  );
}

export function Compass({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="46" className="fill-none stroke-primary/30" strokeWidth="1" />
      <circle cx="50" cy="50" r="34" className="fill-none stroke-primary/20" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M50 6 L56 50 L50 94 L44 50 Z" className="fill-primary/40" />
      <path d="M6 50 L50 44 L94 50 L50 56 Z" className="fill-accent/30" />
      <path d="M50 6 L56 50 L44 50 Z" className="fill-primary" />
      <circle cx="50" cy="50" r="3" className="fill-foreground" />
    </svg>
  );
}

export function Radar({ size = 220 }: { size?: number }) {
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border border-primary/25" />
      <div className="absolute inset-[15%] rounded-full border border-primary/20" />
      <div className="absolute inset-[32%] rounded-full border border-primary/15" />
      <div className="animate-sweep absolute inset-0 rounded-full [background:conic-gradient(from_0deg,transparent_0deg,transparent_300deg,var(--primary)_360deg)] opacity-40" />
      <div className="animate-sonar absolute inset-[35%] rounded-full border-2 border-accent/60" />
      <Compass className="absolute inset-[22%]" />
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/80 p-6 backdrop-blur-md animate-in fade-in">
      <div className="glass w-full max-w-xl overflow-hidden rounded-2xl">
        <div className="relative h-56 overflow-hidden">
          <div className="absolute right-8 top-6 h-16 w-16">
            <div className="animate-sonar absolute inset-0 rounded-full border-2 border-accent" />
            <div className="animate-sonar absolute inset-0 rounded-full border-2 border-primary [animation-delay:1.2s]" />
            <div className="absolute inset-[40%] rounded-full bg-accent" />
          </div>
          <div className="animate-sail absolute bottom-16 w-full">
            <Ship className="animate-bob w-40" />
          </div>
          <Waves className="absolute bottom-0 h-24" />
        </div>
        <div className="space-y-3 p-6">
          <p className="text-sm font-semibold tracking-wide">Simulating Route Trajectory &amp; Market Yields...</p>
          <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
            <div className="animate-progress h-full rounded-full bg-gradient-primary shadow-glow" />
          </div>
          <p className="num text-xs text-muted-foreground">POST → http://localhost:8000/predict</p>
        </div>
      </div>
    </div>
  );
}
