function PhoneFrame({ children, rotate = 0 }: { children: React.ReactNode; rotate?: number }) {
  return (
    <div
      className="relative w-[140px] md:w-[180px] aspect-[9/19] rounded-[28px] md:rounded-[36px] border-[6px] md:border-[8px] border-[#0a0a0a] bg-[#15141C] shadow-2xl overflow-hidden shrink-0"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-3 md:h-3.5 rounded-full bg-[#0a0a0a] z-10" />
      <div className="h-full w-full">{children}</div>
    </div>
  );
}

function ScreenOnboarding() {
  return (
    <div className="h-full w-full bg-gradient-to-b from-[#1A1822] via-[#15141C] to-[#0F0E15] text-[#FAFAF7] flex flex-col items-center justify-end p-4 pb-6 relative">
      <div
        className="absolute top-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-[#F4D8A8] to-[#A77BFF] blur-md opacity-90"
        aria-hidden
      />
      <div className="relative text-center mb-auto mt-12">
        <div className="font-mono text-[7px] tracking-widest text-[#A77BFF] uppercase">Lume</div>
      </div>
      <div className="relative">
        <div className="font-display text-xl leading-tight text-center mb-1">
          Respira <span className="italic text-[#F4D8A8]">devagar.</span>
        </div>
        <div className="text-[8px] text-center text-[#FAFAF7]/60 mb-4 px-2">
          5 minutos por dia. Para começar.
        </div>
        <div className="rounded-full bg-[#FAFAF7] text-[#15141C] text-[9px] py-2 text-center font-medium">
          Começar →
        </div>
      </div>
    </div>
  );
}

function ScreenSession() {
  return (
    <div className="h-full w-full bg-[#0F0E15] text-[#FAFAF7] flex flex-col items-center justify-between p-4 pt-8 pb-5 relative overflow-hidden">
      <div className="font-mono text-[7px] tracking-widest text-[#FAFAF7]/40">14:32</div>
      <div className="relative flex flex-col items-center gap-3">
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#FAFAF7" strokeOpacity="0.08" strokeWidth="2" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#A77BFF"
            strokeWidth="2.5"
            strokeDasharray="276"
            strokeDashoffset="80"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="font-display text-2xl">04:12</div>
            <div className="text-[7px] uppercase tracking-widest text-[#FAFAF7]/50">restantes</div>
          </div>
        </div>
        <div className="font-display text-sm mt-2">Calma matinal</div>
        <div className="text-[8px] text-[#FAFAF7]/50">guiada · 8 min</div>
      </div>
      <div className="flex gap-3 items-center">
        <div className="h-7 w-7 rounded-full border border-[#FAFAF7]/20 grid place-items-center text-[10px]">‹</div>
        <div className="h-9 w-9 rounded-full bg-[#A77BFF] grid place-items-center text-[#15141C] text-[10px]">▶</div>
        <div className="h-7 w-7 rounded-full border border-[#FAFAF7]/20 grid place-items-center text-[10px]">›</div>
      </div>
    </div>
  );
}

function ScreenProfile() {
  return (
    <div className="h-full w-full bg-[#15141C] text-[#FAFAF7] flex flex-col p-4 pt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[7px] uppercase tracking-widest text-[#FAFAF7]/40">Setembro</div>
          <div className="font-display text-base mt-0.5">12 dias</div>
        </div>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F4D8A8] to-[#A77BFF]" />
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array.from({ length: 21 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-sm"
            style={{
              background:
                i < 12
                  ? `rgba(167,123,255,${0.3 + (i % 5) * 0.15})`
                  : "rgba(255,255,255,0.05)",
            }}
          />
        ))}
      </div>
      <div className="rounded-lg bg-[#FAFAF7]/5 p-3 mb-2">
        <div className="text-[7px] uppercase tracking-widest text-[#A77BFF]">Hoje</div>
        <div className="font-display text-sm mt-1">Foco profundo</div>
        <div className="text-[8px] text-[#FAFAF7]/50">10 min</div>
      </div>
      <div className="rounded-lg bg-[#FAFAF7]/5 p-3">
        <div className="text-[7px] uppercase tracking-widest text-[#FAFAF7]/40">Amanhã</div>
        <div className="font-display text-sm mt-1">Sono leve</div>
      </div>
    </div>
  );
}

export default function MobileAppMockup() {
  return (
    <div className="relative w-full h-full flex items-center justify-center gap-4 md:gap-6 bg-gradient-to-br from-[#1A1822] to-[#0a0a0a] p-4 md:p-10 rounded-lg border border-white/10 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 mesh-bg"
      />
      <div className="animate-[float-y_7s_ease-in-out_infinite]">
      <PhoneFrame rotate={-6}>
        <ScreenOnboarding />
      </PhoneFrame>
      </div>
      <div className="animate-[float-y_6s_ease-in-out_infinite] [animation-delay:-1.5s]">
      <PhoneFrame rotate={0}>
        <ScreenSession />
      </PhoneFrame>
      </div>
      <div className="animate-[float-y_8s_ease-in-out_infinite] [animation-delay:-2.5s]">
      <PhoneFrame rotate={6}>
        <ScreenProfile />
      </PhoneFrame>
      </div>
    </div>
  );
}
