import { chromium } from "playwright";
import { existsSync } from "node:fs";
const base = process.env.XAVIC_CHECK_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ||
    (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));
page.on("response", (response) => {
  if (response.status() >= 400)
    errors.push(`${response.status()} ${response.url()}`);
});
await page.addInitScript(() => {
  window.heroLayoutShift = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      if (!entry.hadRecentInput) window.heroLayoutShift += entry.value;
  }).observe({ type: "layout-shift", buffered: true });
});
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["tablet", 1024, 900],
  ["mobile", 390, 844],
  ["small-mobile", 320, 720],
]) {
  await page.setViewportSize({ width, height });
  await page.goto(base);
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.waitForTimeout(850);
  const layout = await page.evaluate(() => {
    const rect = (selector) =>
      document.querySelector(selector).getBoundingClientRect();
    const overlaps = (a, b) =>
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top;
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      ctaOverlap: overlaps(
        rect(".hero-actions .button"),
        rect(".hero-actions .text-link"),
      ),
      artOverlap: overlaps(rect(".hero-copy"), rect(".hero-art")),
      headlineOpacity: getComputedStyle(document.querySelector(".hero h1"))
        .opacity,
      shift: window.heroLayoutShift,
    };
  });
  if (
    layout.overflow ||
    layout.ctaOverlap ||
    layout.artOverlap ||
    Number(layout.headlineOpacity) !== 1 ||
    layout.shift > 0.001
  )
    throw Error(name + ": " + JSON.stringify(layout));
  const tracks = await page
    .locator(".orbital-data-track")
    .evaluateAll((nodes) =>
      nodes.map((el) => getComputedStyle(el).animationName),
    );
  if (tracks.length !== 3 || tracks.some((name) => name === "none"))
    throw Error("Orbital data animation missing");
  const transformBefore = await page
    .locator(".orbital-data-track")
    .first()
    .evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(150);
  if (
    (await page
      .locator(".orbital-data-track")
      .first()
      .evaluate((el) => getComputedStyle(el).transform)) === transformBefore
  )
    throw Error("Orbital data points are not moving");
  await page.screenshot({ path: `/tmp/v13-${name}-hero.png` });
  console.log(
    `${name} ${width}px: readable headline, animated points, no overlap/overflow/layout shift (${layout.shift})`,
  );
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(base);
const bounds = await page.locator(".hero-art").boundingBox();
await page.mouse.move(
  bounds.x + bounds.width * 0.52,
  bounds.y + bounds.height * 0.52,
);
await page.waitForFunction(
  () => document.querySelector(".hero-art").dataset.interacting === "true",
);
const low = await page
  .locator(".hero-art")
  .evaluate((el) => Number(el.style.getPropertyValue("--core-energy")));
await page.mouse.move(
  bounds.x + bounds.width * 0.88,
  bounds.y + bounds.height * 0.8,
);
await page.waitForFunction(
  (low) =>
    Number(
      document
        .querySelector(".hero-art")
        .style.getPropertyValue("--core-energy"),
    ) > low,
  low,
);
console.log("Cursor-reactive glow intensity: passed");
await page.locator("#contact").scrollIntoViewIfNeeded();
await page.waitForFunction(
  () => document.querySelector(".hero-art").dataset.paused === "true",
);
if (
  (await page
    .locator(".orbital-data-track")
    .first()
    .evaluate((el) => getComputedStyle(el).animationPlayState)) !== "paused"
)
  throw Error("Data animation not paused off-screen");
await page.locator(".hero-actions .button").focus();
await page.keyboard.press("Tab");
if (
  (await page.evaluate(() =>
    document.activeElement?.textContent.includes("Discover the Lab"),
  )) !== true
)
  throw Error("Secondary CTA not keyboard reachable");
if (
  (await page
    .locator(".hero-actions .text-link")
    .evaluate((el) => getComputedStyle(el).outlineWidth)) === "0px"
)
  throw Error("CTA focus ring missing");
await page.keyboard.press("Enter");
await page.waitForURL("**/#about");
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(base);
const motion = await page.evaluate(() => ({
  headline: getComputedStyle(document.querySelector(".hero h1")).animationName,
  atmosphere: getComputedStyle(document.querySelector(".hero"), "::before")
    .animationName,
  tracks: [...document.querySelectorAll(".orbital-data-track")].map(
    (el) => getComputedStyle(el).animationName,
  ),
}));
if (
  motion.headline !== "none" ||
  motion.atmosphere !== "none" ||
  motion.tracks.some((name) => name !== "none")
)
  throw Error("Reduced motion failure " + JSON.stringify(motion));
console.log(
  "Off-screen data pause, CTA keyboard focus/navigation, reduced-motion headline/atmosphere/data points: passed",
);
if (errors.length) throw Error(errors.join("\n"));
console.log("Zero console/runtime/HTTP errors");
await browser.close();
