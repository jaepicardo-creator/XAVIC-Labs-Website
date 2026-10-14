import { chromium } from "playwright";
import { existsSync } from "node:fs";
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
page.on("pageerror", (err) => errors.push(err.message));
page.on("response", (response) => {
  if (response.status() >= 400)
    errors.push(`${response.status()} ${response.url()}`);
});
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["tablet", 1024, 900],
  ["compact-tablet", 768, 1024],
  ["mobile", 390, 844],
  ["small-mobile", 320, 720],
]) {
  await page.setViewportSize({ width, height });
  await page.goto(process.env.XAVIC_CHECK_URL || "http://127.0.0.1:4173/");
  await page.getByRole("heading", { level: 1 }).waitFor();
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  ) {
    console.log(
      await page.evaluate(() =>
        [...document.querySelectorAll("*")]
          .filter((el) => el.getBoundingClientRect().right > innerWidth)
          .map((el) => ({
            tag: el.tagName,
            class: el.className,
            width: el.getBoundingClientRect().width,
          }))
          .slice(0, 15),
      ),
    );
    throw new Error(`${name}: horizontal overflow`);
  }
  if (name.includes("mobile")) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("link", { name: "Projects", exact: true }).click();
    if (
      (await page
        .getByRole("button", { name: "Open menu" })
        .getAttribute("aria-expanded")) !== "false"
    )
      throw new Error("Menu failed to close");
  }
  await page.screenshot({ path: `/tmp/xavic-${name}.png`, fullPage: true });
  console.log(`${name}: rendered, no horizontal overflow`);
}
for (const [slug, name] of [
  ["kath", "K.A.T.H."],
  ["aria", "A.R.I.A."],
  ["xavic", "XAVIC"],
  ["zyro", "Zyro"],
  ["jae", "Jae"],
]) {
  await page
    .getByRole("link", { name: `View ${name} project`, exact: true })
    .click();
  await page.getByRole("heading", { name, exact: true, level: 1 }).waitFor();
  await page.reload();
  await page.getByRole("heading", { name, exact: true, level: 1 }).waitFor();
  if (!(await page.title().then((title) => title.startsWith(name))))
    throw new Error("Missing project title");
  await page.getByRole("link", { name: /Back to projects/ }).click();
  await page.getByRole("heading", { level: 1 }).waitFor();
  console.log(`${name}: static route, reload, metadata, back link passed`);
}
await page.getByLabel("Your name").fill("Reviewer");
await page.getByLabel("Email address").fill("reviewer@example.com");
await page.getByLabel("Your message").fill("An idea for the laboratory");
const outbound = [];
page.on("request", (r) => {
  if (r.method() === "POST") outbound.push(r.url());
});
await page.getByRole("button", { name: /Preview contact request/ }).click();
if (
  !(await page.getByRole("status").textContent()).includes(
    "has not been sent",
  ) ||
  outbound.length
)
  throw new Error("Contact preview failed");
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(process.env.XAVIC_CHECK_URL || "http://127.0.0.1:4173/");
await page.locator(".hero-art").waitFor();
const bounds = await page.locator(".hero-art").boundingBox();
await page.mouse.move(
  bounds.x + bounds.width * 0.8,
  bounds.y + bounds.height * 0.65,
);
await page.waitForFunction(
  () => document.querySelector(".hero-art").dataset.interacting === "true",
);
if (
  !(await page
    .locator(".orbital-stage")
    .evaluate((el) => el.style.getPropertyValue("--core-x")))
)
  throw new Error("Desktop core did not respond");
await page.mouse.move(0, 0);
await page.waitForFunction(
  () => !document.querySelector(".hero-art").dataset.interacting,
);
await page.locator("#contact").scrollIntoViewIfNeeded();
await page.waitForFunction(
  () => document.querySelector(".hero-art").dataset.paused === "true",
);
await page.locator(".hero-art").scrollIntoViewIfNeeded();
await page.waitForFunction(
  () => document.querySelector(".hero-art").dataset.paused === "false",
);
const minimumContrast = await page.evaluate(() => {
  const linear = (x) => {
    x /= 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  const lum = (rgb) =>
    0.2126 * linear(rgb[0]) + 0.7152 * linear(rgb[1]) + 0.0722 * linear(rgb[2]);
  // Conservative lighter backdrop than the flat dark surfaces being sampled.
  const bg = lum([32, 38, 56]);
  return Math.min(
    ...[
      ...document.querySelectorAll(
        "p,.nav a,.eyebrow,.project-status,.art-label,.coordinate,.hero-foot,.concept-badge,.project-id,.footer-note,.muted",
      ),
    ].map((el) => {
      const rgb = getComputedStyle(el)
        .color.match(/[\d.]+/g)
        .slice(0, 3)
        .map(Number);
      const fg = lum(rgb);
      return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    }),
  );
});
if (minimumContrast < 4.5)
  throw new Error(`Secondary text contrast below AA: ${minimumContrast}`);
console.log(
  `Desktop pointer/reset, off-screen animation pause, secondary text contrast: passed (minimum ${minimumContrast.toFixed(2)}:1 against conservative dark backdrop)`,
);
const touch = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const touchPage = await touch.newPage();
await touchPage.goto(process.env.XAVIC_CHECK_URL || "http://127.0.0.1:4173/");
await touchPage.locator(".core").waitFor();
if (
  (await touchPage
    .locator(".core")
    .evaluate((el) => getComputedStyle(el).animationName)) === "none"
)
  throw new Error("Mobile animation missing");
await touchPage.locator(".hero-art").dispatchEvent("pointermove", {
  pointerType: "touch",
  clientX: 200,
  clientY: 700,
});
if (await touchPage.locator(".hero-art").getAttribute("data-interacting"))
  throw new Error("Touch should not enable cursor effects");
await touch.close();
await page.emulateMedia({ reducedMotion: "reduce" });
if (
  (await page
    .locator(".orbital-stage")
    .evaluate((el) => getComputedStyle(el).transform)) !== "none"
)
  throw new Error("Reduced motion retained pointer transform");
for (const selector of [".orbit-one", ".orbit-two", ".orbit-three"])
  if (
    (await page
      .locator(selector)
      .evaluate((el) => getComputedStyle(el).animationName)) !== "none"
  )
    throw new Error("Reduced motion retained orbit animation");
if (
  (await page
    .locator(".core")
    .evaluate((el) => getComputedStyle(el, "::after").animationName)) !== "none"
)
  throw new Error("Reduced motion retained glow animation");
console.log(
  "Touch autoplay and reduced motion for cursor/orbits/pulse/glow: passed",
);

if (
  (await page
    .locator(".core")
    .evaluate((el) => getComputedStyle(el).animationName)) !== "none"
)
  throw new Error("Reduced motion ignored");
if (errors.length) throw new Error(errors.join("\n"));
console.log(
  "Contact preview and reduced motion passed; zero browser runtime or HTTP errors",
);
await browser.close();
