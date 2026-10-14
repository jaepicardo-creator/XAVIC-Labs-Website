import { readFile, writeFile, mkdir } from "node:fs/promises";
const projects = JSON.parse(
  await readFile(new URL("../src/data/projects.json", import.meta.url), "utf8"),
);
const rootHtml = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
for (const project of projects) {
  const directory = new URL(
    `../dist/projects/${project.slug}/`,
    import.meta.url,
  );
  await mkdir(directory, { recursive: true });
  const html = rootHtml
    .replaceAll("./assets/", "../../assets/")
    .replaceAll('href="./xavic-emblem.svg"', 'href="../../xavic-emblem.svg"')
    .replaceAll('href="./favicon.png"', 'href="../../favicon.png"')
    .replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${escape(project.name)} | XAVIC-Labs</title>`,
    )
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${escape(project.description)}$2`,
    );
  await writeFile(new URL("index.html", directory), html);
}
console.log(
  `Generated ${projects.length} static project pages with project metadata.`,
);
