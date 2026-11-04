// Notifies IndexNow search engines (Bing, Yandex, Seznam, Naver…) of every URL in the sitemap.
// Google does not use IndexNow: submit the sitemap in Google Search Console instead.
// Usage: node scripts/indexnow.mjs [https://atstudio.pt]
const host = new URL(process.argv[2] ?? "https://atstudio.pt");
const key = "57060eba22d66a2a2ac77deead200517"; // public by design, served at /57060eba22d66a2a2ac77deead200517.txt

const xml = await (await fetch(new URL("/sitemap.xml", host))).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => new URL(u).host === host.host);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: host.host, key, keyLocation: new URL(`/${key}.txt`, host).href, urlList: urls }),
});
console.log(`IndexNow: ${urls.length} URLs -> HTTP ${res.status}`);
if (res.status >= 400) process.exit(1);
