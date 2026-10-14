import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
const base = process.env.XAVIC_CHECK_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ||
    (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("response", (response) => {
  if (response.status() >= 400)
    errors.push(`${response.status()} ${response.url()}`);
});
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
  ["small-mobile", 320, 720],
]) {
  await page.setViewportSize({ width, height });
  for (const route of [
    "",
    "projects/kath/",
    "projects/aria/",
    "projects/xavic/",
    "projects/zyro/",
    "projects/jae/",
  ]) {
    await page.goto(new URL(route, base).href);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll("img.brand-mark")].length === 2 &&
        [...document.querySelectorAll("img.brand-mark")].every(
          (img) => img.complete && img.naturalWidth > 0,
        ),
    );
    if (
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )
    )
      throw Error(`${name}/${route}: overflow`);
    const links = page.getByRole("link", {
      name: "XAVIC-Labs home",
      exact: true,
    });
    if ((await links.count()) !== 2)
      throw Error("Accessible brand links missing");
    for (const icon of await page
      .locator('link[rel="icon"]')
      .evaluateAll((nodes) => nodes.map((node) => node.href))) {
      if (!(await page.request.get(icon)).ok())
        throw Error("Broken favicon: " + icon);
    }
    if (!route)
      await page.screenshot({ path: `/tmp/v12-${name}-homepage.png` });
    if (route === "projects/kath/")
      await page.screenshot({ path: `/tmp/v12-${name}-kath.png` });
  }
  console.log(
    `${name}: homepage and all five pages; two accessible wordmarks, loaded logos/favicons, no overflow`,
  );
}
const svg = new URL("xavic-emblem.svg", base).href;
await page.setViewportSize({ width: 600, height: 400 });
await page.setContent(
  `<style>body{margin:0;padding:24px;background:#0B0F1A;color:#EAF2FF;font:14px system-ui}section{display:flex;align-items:start;gap:20px}figure{margin:0}figcaption{margin-top:12px}</style><section>${[16, 32, 64, 256].map((size) => `<figure><img src="${svg}" width="${size}" height="${size}" alt="XAVIC-Labs emblem at ${size}px"><figcaption>${size}px</figcaption></figure>`).join("")}</section>`,
);
await page.waitForFunction(() =>
  [...document.images].every(
    (image) => image.complete && image.naturalWidth > 0,
  ),
);
await page.screenshot({ path: "/tmp/v12-logo-sizes.png" });
console.log("SVG rendering: 16, 32, 64, 256 pixels on official midnight navy");
const png = await readFile(
  new URL("../public/xavic-emblem.png", import.meta.url),
);
if (!png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
  throw Error("Invalid PNG");
if (
  png.readUInt32BE(16) !== 1024 ||
  png.readUInt32BE(20) !== 1024 ||
  png[25] !== 6
)
  throw Error("PNG must be 1024px RGBA");
console.log("High-resolution PNG: 1024 x 1024 RGBA; transparent canvas");
await page.setContent(
  `<style>body{margin:0;background:#0B0F1A}</style><img src="${new URL("xavic-wordmark.svg", base)}" width="390" height="96" alt="XAVIC-Labs horizontal logo">`,
);
await page.waitForFunction(
  () => document.images[0].complete && document.images[0].naturalWidth > 0,
);
await page.screenshot({ path: "/tmp/v12-wordmark.png" });
if (errors.length) throw Error(errors.join("\n"));
console.log("Horizontal SVG rendered; zero console, runtime, or HTTP errors");
await browser.close();
