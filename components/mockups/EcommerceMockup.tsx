import BrowserFrame from "./BrowserFrame";

const products = [
  { name: "Origem", region: "Etiópia", price: "14€", tone: "#C9461C", tilt: "-5deg" },
  { name: "Supreme", region: "Colômbia", price: "12€", tone: "#E8DFC9", tilt: "3deg" },
  { name: "Norte", region: "Brasil", price: "11€", tone: "#8A3E24", tilt: "-2deg" },
];

function CoffeeBag({
  name,
  region,
  tone,
  tilt,
}: {
  name: string;
  region: string;
  tone: string;
  tilt: string;
}) {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden rounded bg-gradient-to-br from-[#2a1f17] to-[#0F0A07]">
      <div className="absolute inset-0 opacity-25 mesh-bg" aria-hidden />
      <div
        className="relative flex h-[78%] w-[50%] min-w-12 flex-col items-center justify-between rounded-sm border border-[#E8DFC9]/20 bg-[#170F0A] px-2 py-3 shadow-2xl"
        style={{ transform: `rotate(${tilt})` }}
      >
        <div
          className="absolute inset-x-0 top-0 h-5 rounded-t-sm"
          style={{ backgroundColor: tone }}
          aria-hidden
        />
        <div className="relative mt-5 font-mono text-[6px] uppercase tracking-widest text-[#E8DFC9]/55">
          Norte · 250g
        </div>
        <div className="relative text-center">
          <div className="font-display text-sm md:text-lg leading-none text-[#E8DFC9]">
            {name}
          </div>
          <div className="mt-1 font-mono text-[5px] md:text-[6px] uppercase tracking-widest text-[#E8DFC9]/45">
            {region}
          </div>
        </div>
        <div className="relative h-5 w-5 rounded-full border border-[#E8DFC9]/20">
          <div
            className="absolute inset-1 rounded-full"
            style={{ backgroundColor: tone }}
          />
        </div>
      </div>
    </div>
  );
}

export default function EcommerceMockup() {
  return (
    <BrowserFrame url="nortecoffee.pt">
      <div className="h-full w-full bg-[#1A1410] text-[#E8DFC9] flex flex-col">
        {/* nav */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="font-display text-lg tracking-tight">norte<span className="text-[#C9461C]">.</span>coffee</div>
          <div className="hidden md:flex gap-5 text-[10px] uppercase tracking-widest text-[#E8DFC9]/70">
            <span>Loja</span>
            <span>Subscrição</span>
            <span>Sobre</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="rounded-full border border-white/20 px-3 py-1">Carrinho · 02</span>
          </div>
        </div>
        {/* hero */}
        <div className="flex-1 flex">
          <div className="w-1/2 p-6 md:p-10 flex flex-col justify-between">
            <div>
              <p className="font-mono text-[9px] tracking-widest text-[#C9461C] uppercase">Edição limitada · 03</p>
              <h3 className="font-display text-3xl md:text-5xl mt-3 leading-[0.95]">
                Café que sabe a <span className="italic text-[#C9461C]">manhã.</span>
              </h3>
              <p className="text-[10px] md:text-xs text-[#E8DFC9]/60 mt-3 max-w-[24ch]">
                Torrefação artesanal em Guimarães. Grão fresco entregue em 48h.
              </p>
            </div>
            <div className="self-start mt-6 rounded-full bg-[#C9461C] text-[#FAFAF7] px-4 py-2 text-[10px] tracking-widest uppercase">
              Comprar agora →
            </div>
          </div>
          <div className="w-1/2 relative bg-gradient-to-br from-[#2a1f17] to-[#0F0A07] border-l border-white/10 overflow-hidden">
            <div className="absolute inset-0 grid place-items-center">
              <div
                className="w-32 h-44 md:w-40 md:h-56 rounded-md bg-gradient-to-b from-[#2A1A10] to-[#0E0907] border border-[#C9461C]/30 flex flex-col items-center justify-between py-4 px-3 shadow-2xl rotate-[-8deg] animate-[float-y_6s_ease-in-out_infinite]"
                aria-hidden
              >
                <div className="text-[8px] tracking-widest text-[#E8DFC9]/70">NORTE · 250g</div>
                <div className="text-center">
                  <div className="font-display text-2xl text-[#E8DFC9]">Origem</div>
                  <div className="text-[8px] uppercase tracking-widest text-[#C9461C] mt-1">Etiópia</div>
                </div>
                <div className="text-[8px] text-[#E8DFC9]/50">v / 24</div>
              </div>
            </div>
          </div>
        </div>
        {/* products */}
        <div className="grid grid-cols-3 border-t border-white/10">
          {products.map((p) => (
            <div key={p.name} className="p-4 border-r last:border-r-0 border-white/10 transition-colors hover:bg-white/5">
              <div className="aspect-square mb-2">
                <CoffeeBag
                  name={p.name}
                  region={p.region}
                  tone={p.tone}
                  tilt={p.tilt}
                />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div>
                  <div className="font-display text-sm">{p.name}</div>
                  <div className="text-[#E8DFC9]/50">{p.region}</div>
                </div>
                <div className="text-[#C9461C]">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}
