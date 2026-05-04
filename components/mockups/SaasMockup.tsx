import BrowserFrame from "./BrowserFrame";

const stats = [
  { label: "Active users", value: "12,481", delta: "+8.2%" },
  { label: "Revenue MRR", value: "€48.2K", delta: "+12%" },
  { label: "Churn", value: "2.1%", delta: "-0.4%" },
];

export default function SaasMockup() {
  return (
    <BrowserFrame url="app.pulse.io/dashboard">
      <div className="h-full w-full bg-[#0E1116] text-[#E6EAF2] flex">
        {/* sidebar */}
        <div className="hidden md:flex w-44 shrink-0 flex-col bg-[#0A0D12] border-r border-white/5 p-4 gap-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-6 w-6 rounded-md bg-[#FF5A1F]" />
            <span className="font-display text-sm">Pulse</span>
          </div>
          {["Overview", "Audiences", "Funnels", "Reports", "Settings"].map((it, i) => (
            <div
              key={it}
              className={`text-[11px] px-2 py-1.5 rounded-md ${
                i === 0
                  ? "bg-white/10 text-[#FAFAF7]"
                  : "text-[#E6EAF2]/55"
              }`}
            >
              {it}
            </div>
          ))}
          <div className="mt-auto rounded-md bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 p-3 text-[10px] text-[#FF5A1F]">
            Upgrade to Pro
          </div>
        </div>
        {/* main */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <div>
              <div className="text-[10px] text-[#E6EAF2]/40 font-mono">Overview / Last 30 days</div>
              <div className="font-display text-lg">Good morning, Alex.</div>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="rounded border border-white/10 px-2 py-1">Last 30d</span>
              <span className="rounded bg-[#22D3A4] text-[#0E1116] px-2 py-1 font-medium">Live</span>
            </div>
          </div>
          {/* stats */}
          <div className="grid grid-cols-3 gap-3 p-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg border border-white/5 bg-[#141A22] p-3">
                <div className="text-[9px] uppercase tracking-widest text-[#E6EAF2]/40">{s.label}</div>
                <div className="font-display text-2xl mt-1">{s.value}</div>
                <div className="text-[10px] text-[#22D3A4]">{s.delta}</div>
              </div>
            ))}
          </div>
          {/* chart */}
          <div className="px-4 pb-4 flex-1">
            <div className="rounded-lg border border-white/5 bg-[#141A22] p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs">Sessions</div>
                <div className="flex gap-1 text-[9px]">
                  <span className="rounded bg-white/5 px-2 py-0.5">D</span>
                  <span className="rounded bg-[#FF5A1F] text-[#0E1116] px-2 py-0.5 font-medium">W</span>
                  <span className="rounded bg-white/5 px-2 py-0.5">M</span>
                </div>
              </div>
              <svg viewBox="0 0 400 120" className="w-full flex-1" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,90 C40,70 60,80 100,55 C140,30 160,55 200,40 C240,25 260,60 300,30 C340,5 370,25 400,15 L400,120 L0,120 Z"
                  fill="url(#g)"
                />
                <path
                  d="M0,90 C40,70 60,80 100,55 C140,30 160,55 200,40 C240,25 260,60 300,30 C340,5 370,25 400,15"
                  fill="none"
                  stroke="#FF5A1F"
                  strokeWidth="1.5"
                  className="[stroke-dasharray:520] [stroke-dashoffset:520] animate-[chart-draw_5s_ease-in-out_infinite]"
                />
                <circle cx="300" cy="30" r="3" fill="#FF5A1F" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
