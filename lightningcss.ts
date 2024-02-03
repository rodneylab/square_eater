import { debounce } from "$std/async/mod.ts";
import { relative, resolve } from "$std/path/mod.ts";
import browserslist from "browserslist";
import init, { browserslistToTargets, transform } from "lightningcss";

const __dirname = resolve();
const ignoreFiles: string[] = [];

await init();
console.log("Watching for updates...");

const targets = browserslistToTargets(
  browserslist(
    "> 0.5%, last 2 versions, Firefox >= 102, Firefox ESR, not dead",
  ),
);

async function buildStyles(path: string) {
  try {
    const css = await Deno.readTextFile(path);
    const { code: outputCss } = transform({
      filename: path,
      code: new TextEncoder().encode(css),
      minify: true,
      targets,
    });

    const outputPath = `./public/${relative(__dirname, path)}`;
    const decoder = new TextDecoder();
    await Deno.writeTextFile(outputPath, decoder.decode(outputCss));
    console.log(`Output styles: ${path}`);
  } catch (error: unknown) {
    console.error(`Error building styles for path ${path}: ${error as string}`);
  }
}

const debouncedUpdateStyles = debounce(async (path: string) => {
  const relativePath = relative(`${__dirname}/style`, path);

  if (!ignoreFiles.includes(relativePath)) {
    await buildStyles("style/styles.css");
  }
}, 200);

const watcher = Deno.watchFs(["./style/styles.css"]);
for await (const event of watcher) {
  const { paths } = event;
  paths.forEach((path) => {
    debouncedUpdateStyles(path);
  });
}

Deno.exit(0);
