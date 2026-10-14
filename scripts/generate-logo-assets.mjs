import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
const root = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const svg = await readFile(root + "/public/xavic-emblem.svg", "utf8");
const inner = svg.slice(svg.indexOf(">") + 1, svg.lastIndexOf("</svg>"));
await writeFile(
  root + "/public/xavic-wordmark.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 96" role="img" aria-labelledby="wordmark-title"><title id="wordmark-title">XAVIC-Labs</title><svg width="96" height="96" viewBox="0 0 960 960">${inner}</svg><text x="115" y="60" fill="#EAF2FF" font-family="system-ui,sans-serif" font-size="32" font-weight="750" letter-spacing="2">XAVIC</text><text x="245" y="59" fill="#EAF2FF" opacity=".7" font-family="system-ui,sans-serif" font-size="20" letter-spacing="1">/ LABS</text></svg>\n`,
);
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ||
    (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
for (const [size, destination] of [
  [1024, root + "/public/xavic-emblem.png"],
  [32, root + "/public/favicon.png"],
  [16, "/tmp/v12-logo-16.png"],
  [64, "/tmp/v12-logo-64.png"],
  [256, "/tmp/v12-logo-256.png"],
]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  );
  await page
    .locator("svg")
    .screenshot({ path: destination, omitBackground: true });
  console.log(`${destination}: ${size}px transparent SVG rasterization`);
}
await browser.close();
