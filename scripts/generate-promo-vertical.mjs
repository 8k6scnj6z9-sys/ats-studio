import { execFileSync } from "node:child_process";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const DURATION = 30;
const TOTAL_FRAMES = FPS * DURATION;

const root = process.cwd();
const outDir = path.join(root, "public", "social");
const tmpRoot = path.join(root, ".tmp", "ats-studio-promo-vertical");
const framesDir = path.join(tmpRoot, "frames");
const audioPath = path.join(tmpRoot, "music-bed.wav");
const outputVideo = path.join(outDir, "ats-studio-promo-vertical.mp4");
const outputCover = path.join(outDir, "ats-studio-promo-cover.png");
const outputReadme = path.join(outDir, "ats-studio-promo-readme.txt");

const C = {
  ink: "#070706",
  deep: "#11100e",
  panel: "#181512",
  panel2: "#211d19",
  paper: "#f4efe7",
  smoke: "#a9a098",
  muted: "#6f6760",
  line: "#34302b",
  lineSoft: "#24211e",
  flame: "#ff4b1f",
  amber: "#f0b35b",
};

const services = ["Web Design", "Web Apps", "UI/UX", "Branding"];
const processSteps = ["Estratégia", "Estrutura", "Design", "Código"];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a, b, p) {
  return a + (b - a) * p;
}

function easeOutCubic(p) {
  return 1 - Math.pow(1 - clamp(p), 3);
}

function easeInOutCubic(p) {
  p = clamp(p);
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

function easeOutBack(p) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  p = clamp(p);
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
}

function sceneProgress(t, start, end) {
  return clamp((t - start) / (end - start));
}

function sceneOpacity(t, start, end, fade = 0.65) {
  const inP = sceneProgress(t, start, start + fade);
  const outP = 1 - sceneProgress(t, end - fade, end);
  return clamp(Math.min(inP, outP));
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fmt(value, digits = 3) {
  return Number(value).toFixed(digits);
}

function frameName(frame) {
  return path.join(framesDir, `frame-${String(frame).padStart(4, "0")}.png`);
}

function background(t) {
  const scanY = ((t * 190) % (HEIGHT + 320)) - 160;
  const drift = Math.sin(t * 0.34) * 28;
  const lines = [];

  for (let x = 90; x < WIDTH; x += 90) {
    const opacity = x % 270 === 0 ? 0.22 : 0.1;
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${HEIGHT}" stroke="${C.line}" stroke-opacity="${opacity}" />`);
  }

  for (let y = 120; y < HEIGHT; y += 120) {
    const opacity = y % 360 === 0 ? 0.2 : 0.08;
    lines.push(`<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" stroke="${C.line}" stroke-opacity="${opacity}" />`);
  }

  return `
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${C.ink}" />
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgWash)" opacity="0.82" />
    <g transform="translate(${fmt(drift)}, 0)">${lines.join("")}</g>
    <rect x="0" y="${fmt(scanY)}" width="${WIDTH}" height="180" fill="url(#scan)" opacity="0.22" />
    <line x1="70" y1="96" x2="${WIDTH - 70}" y2="96" stroke="${C.line}" stroke-opacity="0.65" />
    <line x1="70" y1="${HEIGHT - 96}" x2="${WIDTH - 70}" y2="${HEIGHT - 96}" stroke="${C.line}" stroke-opacity="0.65" />
    <text x="70" y="66" fill="${C.flame}" font-size="22" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="3">ATS STUDIO</text>
    <text x="${WIDTH - 70}" y="66" text-anchor="end" fill="${C.muted}" font-size="18" font-family="Arial, Helvetica, sans-serif" letter-spacing="3">REEL / 2026</text>
  `;
}

function borderHUD(t) {
  const pulse = 0.45 + Math.sin(t * 2.2) * 0.18;
  return `
    <g fill="none" stroke="${C.flame}" stroke-width="2" stroke-opacity="${fmt(pulse)}">
      <path d="M70 150 V98 H122" />
      <path d="M1010 150 V98 H958" />
      <path d="M70 1770 V1822 H122" />
      <path d="M1010 1770 V1822 H958" />
    </g>
  `;
}

function titleText({ x, y, lines, size = 100, gap = 0.92, fill = C.paper, opacity = 1, anchor = "start" }) {
  return `
    <g opacity="${fmt(opacity)}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" text-anchor="${anchor}">
      ${lines
        .map(
          (line, i) =>
            `<text x="${x}" y="${y + i * size * gap}" font-size="${size}" fill="${fill}">${esc(line)}</text>`,
        )
        .join("")}
    </g>
  `;
}

function monoText({ x, y, text, size = 22, fill = C.smoke, opacity = 1, anchor = "start" }) {
  return `<text x="${x}" y="${y}" fill="${fill}" fill-opacity="${fmt(opacity)}" font-size="${size}" font-family="Menlo, Consolas, monospace" letter-spacing="3" text-anchor="${anchor}">${esc(text)}</text>`;
}

function pill(x, y, text, p, delay = 0) {
  const appear = easeOutBack(clamp((p - delay) / 0.26));
  const alpha = clamp((p - delay) / 0.16);
  const w = 244;
  return `
    <g transform="translate(${fmt(x)}, ${fmt(y + (1 - appear) * 35)}) scale(${fmt(0.82 + appear * 0.18)})" opacity="${fmt(alpha)}">
      <rect x="0" y="0" width="${w}" height="68" rx="34" fill="${C.panel}" stroke="${C.line}" />
      <circle cx="35" cy="34" r="6" fill="${C.flame}" />
      <text x="62" y="42" fill="${C.paper}" font-size="23" font-family="Arial, Helvetica, sans-serif" font-weight="700">${esc(text)}</text>
    </g>
  `;
}

function interfaceLines(width, height, seed = 0) {
  const rows = [];
  for (let i = 0; i < 9; i += 1) {
    const y = 78 + i * 42;
    const w = 90 + ((i * 47 + seed * 31) % 210);
    const color = i % 3 === 0 ? C.flame : C.line;
    const opacity = i % 3 === 0 ? 0.75 : 0.85;
    rows.push(`<rect x="42" y="${y}" width="${w}" height="8" rx="4" fill="${color}" opacity="${opacity}" />`);
  }
  rows.push(`<rect x="${width - 190}" y="76" width="118" height="118" rx="20" fill="${C.flame}" opacity="0.92" />`);
  rows.push(`<rect x="${width - 170}" y="232" width="96" height="${height - 300}" rx="18" fill="${C.deep}" stroke="${C.line}" />`);
  rows.push(`<path d="M${width - 150} ${height - 120} C${width - 130} ${height - 230}, ${width - 105} ${height - 175}, ${width - 86} ${height - 280}" stroke="${C.flame}" stroke-width="8" fill="none" stroke-linecap="round" />`);
  return rows.join("");
}

function mockup({ x, y, w, h, rotate = 0, skew = -8, scale = 1, opacity = 1, label = "ATSTUDIO.PT", seed = 0 }) {
  const side = 34;
  return `
    <g transform="translate(${fmt(x)} ${fmt(y)}) rotate(${fmt(rotate)}) skewX(${fmt(skew)}) scale(${fmt(scale)})" opacity="${fmt(opacity)}" filter="url(#softShadow)">
      <path d="M0 0 H${w} L${w + side} ${side} H${side} Z" fill="${C.panel2}" />
      <path d="M${w} 0 L${w + side} ${side} V${h + side} L${w} ${h} Z" fill="#0f0d0b" />
      <rect x="0" y="0" width="${w}" height="${h}" rx="28" fill="${C.paper}" />
      <rect x="18" y="18" width="${w - 36}" height="${h - 36}" rx="20" fill="${C.ink}" />
      <rect x="18" y="18" width="${w - 36}" height="48" rx="20" fill="${C.deep}" />
      <circle cx="52" cy="42" r="6" fill="${C.flame}" />
      <circle cx="76" cy="42" r="6" fill="${C.smoke}" opacity="0.5" />
      <circle cx="100" cy="42" r="6" fill="${C.smoke}" opacity="0.25" />
      <text x="${w - 46}" y="48" fill="${C.smoke}" font-size="13" font-family="Menlo, Consolas, monospace" text-anchor="end" letter-spacing="2">${esc(label)}</text>
      <rect x="42" y="100" width="${Math.max(190, w * 0.42)}" height="28" rx="14" fill="${C.paper}" opacity="0.96" />
      <rect x="42" y="146" width="${Math.max(250, w * 0.6)}" height="15" rx="8" fill="${C.smoke}" opacity="0.68" />
      <rect x="42" y="176" width="${Math.max(170, w * 0.34)}" height="15" rx="8" fill="${C.smoke}" opacity="0.35" />
      ${interfaceLines(w, h, seed)}
    </g>
  `;
}

function phoneMockup(x, y, p, opacity = 1) {
  const bob = Math.sin(p * Math.PI * 2) * 12;
  return `
    <g transform="translate(${fmt(x)} ${fmt(y + bob)}) rotate(8)" opacity="${fmt(opacity)}" filter="url(#softShadow)">
      <rect width="250" height="520" rx="54" fill="${C.paper}" />
      <rect x="14" y="14" width="222" height="492" rx="42" fill="${C.ink}" />
      <rect x="88" y="30" width="74" height="9" rx="5" fill="${C.line}" />
      <rect x="38" y="86" width="160" height="24" rx="12" fill="${C.paper}" />
      <rect x="38" y="132" width="120" height="12" rx="6" fill="${C.smoke}" opacity="0.62" />
      <rect x="38" y="190" width="174" height="146" rx="28" fill="${C.flame}" />
      <rect x="58" y="366" width="132" height="12" rx="6" fill="${C.paper}" opacity="0.9" />
      <rect x="58" y="394" width="92" height="12" rx="6" fill="${C.smoke}" opacity="0.56" />
      <rect x="38" y="440" width="72" height="38" rx="19" fill="${C.paper}" opacity="0.95" />
      <rect x="124" y="440" width="88" height="38" rx="19" fill="${C.deep}" stroke="${C.line}" />
    </g>
  `;
}

function serviceCard(x, y, index, p) {
  const delay = index * 0.12;
  const enter = easeOutBack(clamp((p - delay) / 0.28));
  const opacity = clamp((p - delay) / 0.18);
  const yOffset = (1 - enter) * 75;
  const active = Math.sin((p * 7 + index) * Math.PI) > 0;
  return `
    <g transform="translate(${fmt(x)} ${fmt(y + yOffset)})" opacity="${fmt(opacity)}">
      <rect width="410" height="172" rx="28" fill="${active ? C.paper : C.panel}" stroke="${active ? C.paper : C.line}" />
      <text x="34" y="54" fill="${active ? C.ink : C.flame}" font-size="20" font-family="Menlo, Consolas, monospace" letter-spacing="3">0${index + 1}</text>
      <text x="34" y="112" fill="${active ? C.ink : C.paper}" font-size="43" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900">${esc(services[index])}</text>
      <line x1="34" y1="138" x2="372" y2="138" stroke="${active ? C.ink : C.line}" stroke-opacity="0.55" />
    </g>
  `;
}

function processNode(x, y, index, p) {
  const active = clamp((p - index * 0.14) / 0.24);
  const r = 38 + easeOutCubic(active) * 18;
  return `
    <g opacity="${fmt(clamp(active * 1.5))}">
      <circle cx="${x}" cy="${y}" r="${fmt(r)}" fill="${C.panel}" stroke="${C.flame}" stroke-width="3" />
      <circle cx="${x}" cy="${y}" r="${fmt(8 + Math.sin(p * 14 + index) * 2)}" fill="${C.paper}" />
      <text x="${x}" y="${y + 96}" text-anchor="middle" fill="${C.paper}" font-size="26" font-family="Arial, Helvetica, sans-serif" font-weight="700">${esc(processSteps[index])}</text>
    </g>
  `;
}

function brandOpening(t) {
  const o = sceneOpacity(t, 0, 3.15, 0.55);
  const p = easeOutCubic(sceneProgress(t, 0, 2.6));
  const y = lerp(1020, 780, p);
  const studioX = lerp(540, 372, p);
  return `
    <g opacity="${fmt(o)}">
      <g transform="translate(0 ${fmt((1 - p) * 90)})">
        ${monoText({ x: 80, y: 455, text: "ESTÚDIO DIGITAL · GUARDA", fill: C.flame, opacity: p })}
        ${titleText({ x: 78, y, lines: ["ATS"], size: 252, opacity: p })}
        <text x="${fmt(studioX)}" y="${fmt(y + 200)}" fill="${C.flame}" font-size="206" font-family="Georgia, Times, serif" font-style="italic" font-weight="700">Studio</text>
        <rect x="84" y="${fmt(y + 250)}" width="${fmt(lerp(0, 685, p))}" height="3" fill="${C.flame}" />
      </g>
      <g opacity="${fmt(p * 0.85)}">
        <line x1="84" y1="1320" x2="996" y2="1320" stroke="${C.line}" />
        <text x="84" y="1376" fill="${C.smoke}" font-size="29" font-family="Arial, Helvetica, sans-serif">Websites, apps e marcas digitais profissionais.</text>
      </g>
    </g>
  `;
}

function positioning(t) {
  const o = sceneOpacity(t, 2.65, 7.15, 0.75);
  const p = easeInOutCubic(sceneProgress(t, 2.8, 7));
  const mockP = easeOutBack(sceneProgress(t, 3.05, 5.4));
  const x = lerp(920, 185, mockP);
  const y = lerp(520, 585, mockP);
  const scale = lerp(0.72, 0.98, mockP);
  const rot = lerp(-2, -8, p);
  return `
    <g opacity="${fmt(o)}">
      ${mockup({ x, y, w: 760, h: 575, rotate: rot, skew: -9, scale, opacity: 1, seed: 2 })}
      ${titleText({ x: 78, y: 1260, lines: ["Design +", "Development +", "Branding"], size: 86, gap: 0.98, opacity: easeOutCubic(sceneProgress(t, 3.6, 5.2)) })}
      ${monoText({ x: 84, y: 1562, text: "DIREÇÃO VISUAL / UX / CÓDIGO", opacity: easeOutCubic(sceneProgress(t, 4.2, 5.6)) })}
    </g>
  `;
}

function servicesScene(t) {
  const o = sceneOpacity(t, 6.8, 12.25, 0.75);
  const p = sceneProgress(t, 7, 12);
  return `
    <g opacity="${fmt(o)}">
      ${monoText({ x: 80, y: 338, text: "CAPACIDADES", fill: C.flame, opacity: easeOutCubic(sceneProgress(t, 7, 8)) })}
      ${titleText({ x: 78, y: 462, lines: ["O que", "fazemos."], size: 124, opacity: easeOutCubic(sceneProgress(t, 7.2, 8.2)) })}
      ${serviceCard(80, 790, 0, p)}
      ${serviceCard(590, 790, 1, p)}
      ${serviceCard(80, 1010, 2, p)}
      ${serviceCard(590, 1010, 3, p)}
      ${pill(80, 1378, "Next.js", p, 0.45)}
      ${pill(350, 1378, "Headless CMS", p, 0.52)}
      ${pill(80, 1474, "Motion", p, 0.59)}
      ${pill(350, 1474, "Design Systems", p, 0.66)}
    </g>
  `;
}

function mockupComposition(t) {
  const o = sceneOpacity(t, 11.8, 18.35, 0.85);
  const p = easeInOutCubic(sceneProgress(t, 12, 18));
  const desktopX = lerp(-150, 92, easeOutBack(sceneProgress(t, 12, 14)));
  const mobileX = lerp(1180, 735, easeOutBack(sceneProgress(t, 12.7, 14.7)));
  const dashY = lerp(1960, 1475, easeOutBack(sceneProgress(t, 13.2, 15.4)));
  return `
    <g opacity="${fmt(o)}">
      ${mockup({ x: desktopX, y: 420 + Math.sin(t * 1.4) * 10, w: 770, h: 630, rotate: -10 + p * 3, skew: -7, scale: 1, opacity: 0.98, seed: 6 })}
      ${phoneMockup(mobileX, 585, p, 0.96)}
      ${mockup({ x: 178, y: dashY, w: 690, h: 360, rotate: 5, skew: -5, scale: 0.92, opacity: 0.93, label: "DASHBOARD", seed: 9 })}
      ${titleText({ x: 76, y: 1190, lines: ["Tudo alinhado", "numa presença", "digital clara."], size: 78, gap: 0.98, opacity: easeOutCubic(sceneProgress(t, 13.6, 15.3)) })}
    </g>
  `;
}

function processScene(t) {
  const o = sceneOpacity(t, 17.9, 24.3, 0.8);
  const p = easeInOutCubic(sceneProgress(t, 18, 24));
  const lineDraw = easeOutCubic(sceneProgress(t, 18.5, 21.4));
  return `
    <g opacity="${fmt(o)}">
      ${monoText({ x: 80, y: 360, text: "PROCESSO", fill: C.flame, opacity: easeOutCubic(sceneProgress(t, 18, 19)) })}
      ${titleText({ x: 78, y: 512, lines: ["Estratégia", "visual.", "UX.", "Código."], size: 102, gap: 0.9, opacity: easeOutCubic(sceneProgress(t, 18.2, 19.5)) })}
      <g transform="translate(0 960)">
        <line x1="160" y1="280" x2="${fmt(160 + 760 * lineDraw)}" y2="280" stroke="${C.line}" stroke-width="4" />
        ${processNode(160, 280, 0, p)}
        ${processNode(414, 280, 1, p)}
        ${processNode(668, 280, 2, p)}
        ${processNode(920, 280, 3, p)}
      </g>
      <rect x="80" y="1616" width="${fmt(lerp(0, 920, lineDraw))}" height="3" fill="${C.flame}" />
      ${monoText({ x: 80, y: 1680, text: "CLAREZA · CONFIANÇA · EXECUÇÃO", opacity: easeOutCubic(sceneProgress(t, 20.2, 21.7)) })}
    </g>
  `;
}

function closingScene(t) {
  const o = sceneOpacity(t, 23.7, 30.1, 0.85);
  const p = easeOutCubic(sceneProgress(t, 24, 27.6));
  const cta = easeOutCubic(sceneProgress(t, 25.2, 28.2));
  return `
    <g opacity="${fmt(o)}">
      <g transform="translate(0 ${fmt((1 - p) * 80)})">
        ${titleText({ x: 78, y: 610, lines: ["Vamos criar", "a tua presença", "digital."], size: 112, gap: 0.94, opacity: p })}
        <text x="80" y="1128" fill="${C.flame}" font-size="145" font-family="Georgia, Times, serif" font-style="italic" font-weight="700" opacity="${fmt(cta)}">ATS Studio</text>
        <rect x="80" y="1194" width="${fmt(lerp(0, 680, cta))}" height="4" fill="${C.flame}" />
      </g>
      <g opacity="${fmt(cta)}">
        <rect x="80" y="1370" width="920" height="178" rx="38" fill="${C.paper}" />
        <text x="522" y="1483" fill="${C.ink}" font-size="68" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" text-anchor="end">atstudio</text>
        <circle cx="540" cy="1469" r="6.5" fill="${C.ink}" />
        <text x="558" y="1483" fill="${C.ink}" font-size="68" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" text-anchor="start">pt</text>
      </g>
      ${monoText({ x: 540, y: 1648, text: "DESIGN + DEVELOPMENT + BRANDING", anchor: "middle", fill: C.smoke, opacity: cta })}
    </g>
  `;
}

function svgFrame(frame) {
  const t = frame / FPS;
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <linearGradient id="bgWash" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#17130f" />
        <stop offset="0.42" stop-color="#070706" />
        <stop offset="0.72" stop-color="#130f0c" />
        <stop offset="1" stop-color="#2b120a" />
      </linearGradient>
      <linearGradient id="scan" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${C.flame}" stop-opacity="0" />
        <stop offset="0.5" stop-color="${C.flame}" stop-opacity="0.75" />
        <stop offset="1" stop-color="${C.flame}" stop-opacity="0" />
      </linearGradient>
      <filter id="softShadow" x="-30%" y="-30%" width="170%" height="170%">
        <feDropShadow dx="0" dy="26" stdDeviation="24" flood-color="#000000" flood-opacity="0.45"/>
      </filter>
    </defs>
    ${background(t)}
    ${brandOpening(t)}
    ${positioning(t)}
    ${servicesScene(t)}
    ${mockupComposition(t)}
    ${processScene(t)}
    ${closingScene(t)}
    ${borderHUD(t)}
  </svg>`;
}

function createWavHeader(dataBytes, sampleRate, channels, bitsPerSample) {
  const blockAlign = (channels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const buffer = Buffer.alloc(44);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataBytes, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataBytes, 40);
  return buffer;
}

function seededNoise(i) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

async function generateAudio() {
  const sampleRate = 44100;
  const channels = 2;
  const bitsPerSample = 16;
  const samples = sampleRate * DURATION;
  const pcm = Buffer.alloc(samples * channels * 2);
  const bpm = 118;
  const beat = 60 / bpm;
  const notes = [220, 277.18, 329.63, 440, 392, 329.63, 277.18, 246.94];

  for (let i = 0; i < samples; i += 1) {
    const t = i / sampleRate;
    const beatPos = t % beat;
    const halfBeatPos = t % (beat / 2);
    const bar = Math.floor(t / beat);
    const note = notes[bar % notes.length];

    const kickEnv = Math.exp(-beatPos * 24);
    const kick = Math.sin(2 * Math.PI * (54 + 42 * kickEnv) * t) * kickEnv * 0.42;
    const hatEnv = Math.exp(-halfBeatPos * 70);
    const hat = seededNoise(i) * hatEnv * 0.045;
    const arpEnv = Math.exp(-(t % (beat / 2)) * 9);
    const arp = Math.sin(2 * Math.PI * note * t) * arpEnv * 0.12;
    const pad =
      Math.sin(2 * Math.PI * 110 * t) * 0.035 +
      Math.sin(2 * Math.PI * 164.81 * t) * 0.025 +
      Math.sin(2 * Math.PI * 220 * t) * 0.02;
    const sweep = Math.sin(2 * Math.PI * (70 + t * 2.4) * t) * 0.025 * Math.sin(Math.PI * t / DURATION);
    const master = clamp(t / 1.2) * clamp((DURATION - t) / 1.4);
    const sample = clamp((kick + hat + arp + pad + sweep) * master, -0.95, 0.95);
    const left = Math.round(sample * 32767);
    const right = Math.round((sample * 0.92 + pad * 0.2) * 32767);
    const offset = i * channels * 2;
    pcm.writeInt16LE(left, offset);
    pcm.writeInt16LE(right, offset + 2);
  }

  const header = createWavHeader(pcm.length, sampleRate, channels, bitsPerSample);
  await writeFile(audioPath, Buffer.concat([header, pcm]));
}

async function renderFrame(frame) {
  await sharp(Buffer.from(svgFrame(frame)), { density: 144 })
    .resize(WIDTH, HEIGHT, { fit: "fill" })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(frameName(frame));
}

async function renderFrames() {
  const concurrency = Math.max(2, Math.min(8, Math.floor((await import("node:os")).cpus().length / 2)));
  let next = 0;

  async function worker() {
    while (next < TOTAL_FRAMES) {
      const frame = next;
      next += 1;
      await renderFrame(frame);
      if (frame % FPS === 0) {
        console.log(`Rendered ${String(frame).padStart(3, " ")} / ${TOTAL_FRAMES} frames`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

async function composeVideo() {
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-framerate",
      String(FPS),
      "-i",
      path.join(framesDir, "frame-%04d.png"),
      "-i",
      audioPath,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-r",
      String(FPS),
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      "-shortest",
      outputVideo,
    ],
    { stdio: "inherit" },
  );
}

async function writeMetadata() {
  await writeFile(
    outputReadme,
    `ATS Studio vertical promo video

File: public/social/ats-studio-promo-vertical.mp4
Cover: public/social/ats-studio-promo-cover.png
Format: 1080x1920, 30fps, 30s
Audio: generated electronic music bed
Generator: scripts/generate-promo-vertical.mjs
`,
  );
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await rm(tmpRoot, { recursive: true, force: true });
  await mkdir(framesDir, { recursive: true });

  console.log("Rendering ATS Studio vertical promo...");
  await renderFrames();
  await generateAudio();
  await composeVideo();
  await copyFile(frameName(810), outputCover);
  await writeMetadata();
  await rm(tmpRoot, { recursive: true, force: true });

  console.log(`Generated ${path.relative(root, outputVideo)}`);
  console.log(`Generated ${path.relative(root, outputCover)}`);
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
});
