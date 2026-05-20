import { spawn, execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const DURATION = 30;
const TOTAL_FRAMES = FPS * DURATION;
const VIEWPORT = { width: 540, height: 960 };
const DEVICE_SCALE_FACTOR = 2;

const root = process.cwd();
const outDir = path.join(root, "public", "social");
const tmpRoot = path.join(root, ".tmp", "ats-studio-website-reel");
const framesDir = path.join(tmpRoot, "frames");
const capturesDir = path.join(tmpRoot, "captures");
const outputVideo = path.join(outDir, "ats-studio-website-reel.mp4");
const outputCover = path.join(outDir, "ats-studio-website-reel-cover.png");
const outputReadme = path.join(outDir, "ats-studio-website-reel-readme.txt");

const C = {
  ink: "#070706",
  paper: "#f4efe7",
  smoke: "#a9a098",
  flame: "#ff4b1f",
  line: "#34302b",
};

const scenes = [
  { key: "hero", label: "ATS Studio", selector: "body", start: 0, end: 4, zoom: 0.055, y: 0 },
  { key: "positioning", label: "Presença digital profissional", selector: "body", start: 4, end: 9, zoom: 0.07, y: 0.12, scrollTop: 520 },
  { key: "work", label: "Trabalho selecionado", selector: "#work", start: 9, end: 15, zoom: 0.06, y: 0.2 },
  { key: "services", label: "Design + Development + Branding", selector: "#services", start: 15, end: 21, zoom: 0.06, y: 0.24 },
  { key: "process", label: "Processo com clareza", selector: "#process", start: 21, end: 26, zoom: 0.055, y: 0.18 },
  { key: "contact", label: "atstudio.pt", selector: "#contact", start: 26, end: 30, zoom: 0.05, y: 0.24 },
];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function easeInOutCubic(p) {
  p = clamp(p);
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

function easeOutCubic(p) {
  return 1 - Math.pow(1 - clamp(p), 3);
}

function sceneProgress(t, start, end) {
  return clamp((t - start) / (end - start));
}

function frameName(frame) {
  return path.join(framesDir, `frame-${String(frame).padStart(4, "0")}.png`);
}

function capturePath(key) {
  return path.join(capturesDir, `${key}.png`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function findPort(start = 4327) {
  for (let port = start; port < start + 80; port += 1) {
    if (await isPortFree(port)) return port;
  }
  throw new Error(`No free port found from ${start}`);
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

async function waitForServer(url, child) {
  const started = Date.now();
  let lastError = "";

  while (Date.now() - started < 90000) {
    if (child.exitCode !== null) {
      throw new Error(`Next dev server exited early with code ${child.exitCode}`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await sleep(1000);
  }

  throw new Error(`Timed out waiting for ${url}. Last error: ${lastError}`);
}

async function startNextServer(port) {
  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
  if (!existsSync(nextBin)) {
    throw new Error(`Missing Next.js binary at ${nextBin}`);
  }

  const child = spawn(process.execPath, [nextBin, "dev", "--webpack", "-p", String(port), "-H", "127.0.0.1"], {
    cwd: root,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => {
    const line = chunk.toString().trim();
    if (line) console.log(`[next] ${line}`);
  });
  child.stderr.on("data", (chunk) => {
    const line = chunk.toString().trim();
    if (line) console.error(`[next] ${line}`);
  });

  const url = `http://127.0.0.1:${port}/pt`;
  await waitForServer(url, child);
  return { child, url };
}

async function stopNextServer(child) {
  if (!child || child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    sleep(5000).then(() => {
      if (child.exitCode === null) child.kill("SIGKILL");
    }),
  ]);
}

async function captureWebsite(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    isMobile: true,
    hasTouch: false,
    colorScheme: "dark",
    reducedMotion: "no-preference",
  });

  await page.addInitScript(() => {
    window.localStorage.setItem(
      "ats_cookie_consent_v1",
      JSON.stringify({ essential: true, analytics: false, updatedAt: new Date().toISOString() }),
    );
  });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.addStyleTag({
    content: `
      html { scroll-behavior: auto !important; }
      body { overscroll-behavior: none !important; }
      [aria-label*="cookies" i], [aria-label*="cookie" i] { display: none !important; }
      body.has-custom-cursor > div[aria-hidden].pointer-events-none { display: none !important; }
    `,
  });
  await page.waitForTimeout(2400);

  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const maxScroll = Math.max(0, pageHeight - VIEWPORT.height);

  for (const scene of scenes) {
    const targetTop =
      typeof scene.scrollTop === "number"
        ? scene.scrollTop
        : await page.evaluate(
            ({ selector, fallbackRatio }) => {
              if (selector === "body") {
                return document.documentElement.scrollHeight * fallbackRatio;
              }
              const element = document.querySelector(selector);
              if (!element) return document.documentElement.scrollHeight * fallbackRatio;
              const rect = element.getBoundingClientRect();
              return window.scrollY + rect.top;
            },
            { selector: scene.selector, fallbackRatio: scene.y },
          );

    const scrollTop = clamp(targetTop - VIEWPORT.height * scene.y, 0, maxScroll);
    await page.evaluate((top) => window.scrollTo(0, top), scrollTop);
    await page.waitForTimeout(1300);
    await page.screenshot({ path: capturePath(scene.key), fullPage: false, animations: "allow" });
    console.log(`Captured ${scene.key} at scroll ${Math.round(scrollTop)}`);
  }

  await browser.close();
}

function captionOverlay(scene, t, p) {
  const entering = easeOutCubic(clamp(p / 0.24));
  const leaving = 1 - easeOutCubic(clamp((p - 0.78) / 0.22));
  const opacity = clamp(Math.min(entering, leaving));
  const y = 1528 + (1 - entering) * 38;
  const scanX = ((t * 210) % (WIDTH + 260)) - 130;

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${C.ink}" stop-opacity="0.18" />
          <stop offset="0.5" stop-color="${C.ink}" stop-opacity="0" />
          <stop offset="1" stop-color="${C.ink}" stop-opacity="0.78" />
        </linearGradient>
        <linearGradient id="scan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="${C.flame}" stop-opacity="0" />
          <stop offset="0.5" stop-color="${C.flame}" stop-opacity="0.42" />
          <stop offset="1" stop-color="${C.flame}" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#shade)" />
      <rect x="${scanX}" y="0" width="260" height="${HEIGHT}" fill="url(#scan)" opacity="0.18" />
      <g fill="none" stroke="${C.flame}" stroke-width="2" stroke-opacity="0.84">
        <path d="M64 144 V92 H118" />
        <path d="M1016 144 V92 H962" />
        <path d="M64 1776 V1828 H118" />
        <path d="M1016 1776 V1828 H962" />
      </g>
      <g opacity="${opacity}">
        <rect x="70" y="${y - 80}" width="940" height="146" rx="28" fill="${C.ink}" fill-opacity="0.68" stroke="${C.line}" />
        <circle cx="112" cy="${y - 26}" r="8" fill="${C.flame}" />
        <text x="140" y="${y - 14}" fill="${C.paper}" font-size="42" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900">${escapeSvg(scene.label)}</text>
        <text x="140" y="${y + 32}" fill="${C.smoke}" font-size="18" font-family="Menlo, Consolas, monospace" letter-spacing="3">atstudio.pt</text>
      </g>
    </svg>`);
}

function escapeSvg(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sceneForTime(t) {
  return scenes.find((scene) => t >= scene.start && t < scene.end) ?? scenes.at(-1);
}

async function renderFrame(frame) {
  const t = frame / FPS;
  const scene = sceneForTime(t);
  const p = sceneProgress(t, scene.start, scene.end);
  const eased = easeInOutCubic(p);
  const imagePath = capturePath(scene.key);
  const scale = 1 + scene.zoom * eased;
  const scaledW = Math.ceil(WIDTH * scale);
  const scaledH = Math.ceil(HEIGHT * scale);
  const maxLeft = scaledW - WIDTH;
  const maxTop = scaledH - HEIGHT;
  const left = Math.round(maxLeft * (scene.key === "contact" ? 0.5 : 0.35 + Math.sin(t * 0.8) * 0.12));
  const top = Math.round(maxTop * (0.18 + eased * 0.7));

  const base = await sharp(imagePath)
    .resize(scaledW, scaledH, { fit: "fill" })
    .extract({
      left: clamp(left, 0, maxLeft),
      top: clamp(top, 0, maxTop),
      width: WIDTH,
      height: HEIGHT,
    })
    .modulate({ brightness: 0.82, saturation: 1.04 })
    .png()
    .toBuffer();

  await sharp(base)
    .composite([{ input: captionOverlay(scene, t, p), left: 0, top: 0 }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(frameName(frame));
}

async function renderFrames() {
  let next = 0;
  const concurrency = 6;

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
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-r",
      String(FPS),
      "-an",
      outputVideo,
    ],
    { stdio: "inherit" },
  );
}

async function writeMetadata() {
  await writeFile(
    outputReadme,
    `ATS Studio real website vertical reel

File: public/social/ats-studio-website-reel.mp4
Cover: public/social/ats-studio-website-reel-cover.png
Format: 1080x1920, 30fps, 30s
Audio: none
Source: real local website captures from /pt
Generator: scripts/generate-website-reel.mjs
`,
  );
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await rm(tmpRoot, { recursive: true, force: true });
  await mkdir(framesDir, { recursive: true });
  await mkdir(capturesDir, { recursive: true });

  const port = await findPort();
  let server;

  try {
    server = await startNextServer(port);
    console.log(`Capturing ${server.url}`);
    await captureWebsite(server.url);
    await renderFrames();
    await composeVideo();
    await copyFile(frameName(810), outputCover);
    await writeMetadata();
  } finally {
    if (server?.child) await stopNextServer(server.child);
    await rm(tmpRoot, { recursive: true, force: true });
  }

  console.log(`Generated ${path.relative(root, outputVideo)}`);
  console.log(`Generated ${path.relative(root, outputCover)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
