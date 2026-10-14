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
page.on("pageerror", (err) => errors.push(err.message));
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
await page.emulateMedia({ reducedMotion: "reduce" });
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
