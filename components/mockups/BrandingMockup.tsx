export default function BrandingMockup() {
  return (
    <div className="relative w-full h-full bg-[#0F0F0E] text-[#D8D3C7] rounded-lg border border-white/10 overflow-hidden p-6 md:p-10 flex items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #D8D3C7 1px, transparent 1px), linear-gradient(to bottom, #D8D3C7 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative grid grid-cols-12 gap-3 md:gap-4 w-full max-w-3xl">
        {/* big logo card */}
        <div className="col-span-12 md:col-span-7 aspect-[4/3] rounded-md md:rounded-lg bg-[#D8D3C7] text-[#0F0F0E] flex flex-col p-4 md:p-6 justify-between transition-transform duration-700 hover:-translate-y-2">
          <div className="font-mono text-[8px] tracking-widest uppercase">Atelier · Marquês</div>
          <div className="flex items-end justify-between">
            <div className="font-display text-[15vw] md:text-[8vw] leading-[0.85] tracking-tight">
              A<span className="italic">m</span>
            </div>
            <div className="text-right text-[8px] md:text-[10px] font-mono leading-tight">
              <div>Estabelecido</div>
              <div className="font-display text-base">2009</div>
            </div>
          </div>
        </div>

        {/* business card */}
        <div className="col-span-7 md:col-span-5 aspect-[16/10] rounded-md bg-[#7A7164] text-[#FAFAF7] p-3 md:p-4 flex flex-col justify-between rotate-[-3deg] shadow-xl">
          <div>
            <div className="font-display text-base md:text-xl">Atelier Marquês</div>
            <div className="font-mono text-[7px] md:text-[8px] uppercase tracking-widest text-[#FAFAF7]/60">
              arquitetura
            </div>
          </div>
          <div className="text-[7px] md:text-[8px] font-mono leading-relaxed">
            Rua Garrett 14, 2º
            <br />
            1200-203 Lisboa
            <br />
            +351 21 000 0000
          </div>
        </div>

        {/* palette */}
        <div className="col-span-5 md:col-span-3 rounded-md overflow-hidden flex flex-col">
          <div className="flex-1 bg-[#0F0F0E]" />
          <div className="flex-1 bg-[#7A7164]" />
          <div className="flex-1 bg-[#D8D3C7]" />
          <div className="flex-1 bg-[#FAFAF7]" />
          <div className="bg-[#1A1A1A] text-[#D8D3C7] text-[7px] md:text-[8px] font-mono px-2 py-1.5 uppercase tracking-widest">
            Palette · 04
          </div>
        </div>

        {/* mark */}
        <div className="col-span-5 md:col-span-3 aspect-square rounded-md bg-[#0F0F0E] border border-[#D8D3C7]/20 flex items-center justify-center">
          <svg viewBox="0 0 80 80" className="w-2/3 h-2/3 text-[#D8D3C7]">
            <path
              d="M10 65 L40 12 L70 65"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M22 50 L58 50" fill="none" stroke="currentColor" strokeWidth="2" />
            <text
              x="40"
              y="44"
              textAnchor="middle"
              fontFamily="serif"
              fontStyle="italic"
              fontSize="20"
              fill="currentColor"
            >
              m
            </text>
          </svg>
        </div>

        {/* type spec */}
        <div className="col-span-7 md:col-span-6 rounded-md border border-[#D8D3C7]/15 p-3 md:p-4 bg-[#13130F]">
          <div className="font-mono text-[7px] md:text-[8px] uppercase tracking-widest text-[#D8D3C7]/50">
            Tipografia
          </div>
          <div className="font-display text-2xl md:text-4xl leading-none mt-1 text-[#D8D3C7]">
            Aa Bb Cc <span className="italic">Mm</span>
          </div>
          <div className="mt-2 flex gap-3 text-[8px] md:text-[10px] font-mono text-[#D8D3C7]/60">
            <span>Display · Fraunces</span>
            <span>Body · Inter</span>
          </div>
        </div>
      </div>
    </div>
  );
}
