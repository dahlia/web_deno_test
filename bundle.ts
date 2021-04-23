import {
  fromFileUrl,
  join,
  resolve,
  toFileUrl,
} from "https://deno.land/std@0.92.0/path/mod.ts";

export async function bundleTests(
  testFiles: Set<URL>,
  outDir: URL,
): Promise<void> {
  try {
    await Deno.lstat(outDir);
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      await Deno.mkdir(outDir, { recursive: true });
    } else {
      throw e;
    }
  }

  const thisUrl: string = import.meta.url;
  const thisDir: string = thisUrl.substr(0, thisUrl.lastIndexOf("/") + 1);

  const mainFile = await Deno.makeTempFile({
    dir: fromFileUrl(outDir),
    prefix: ".bundle_main_",
    suffix: ".ts",
  });

  let bundleJs;
  try {
    const modUrl: string = thisDir + "mod.ts";
    const testImports = [...testFiles]
      .map((t: URL) => `import ${JSON.stringify(fromFileUrl(t))};`)
      .join("\n");
    const mainUrl = toFileUrl(mainFile);
    await Deno.writeTextFile(
      mainUrl,
      `
      ${testImports}
      import { getTestSuites } from ${JSON.stringify(modUrl)};
      export { getTestSuites };
      `,
    );
    const { files } = await Deno.emit(mainUrl, {
      bundle: "esm",
    });
    bundleJs = files["deno:///bundle.js"];
  } finally {
    await Deno.remove(mainFile);
  }

  const joinOutDir = (f: string) => join(fromFileUrl(outDir), f);
  const bundleJsPath = joinOutDir("run_tests.js");
  await Deno.writeTextFile(bundleJsPath, bundleJs);
  await copyFile(new URL(thisDir + "runner.js"), joinOutDir("runner.js"));
  await copyFile(new URL(thisDir + "runner.html"), joinOutDir("index.html"));
}

async function copyFile(
  fromPath: string | URL,
  toPath: string | URL,
): Promise<void> {
  if (typeof fromPath == "string" || fromPath.protocol == "file:") {
    await Deno.copyFile(fromPath, toPath);
    return;
  }

  const resp = await fetch(fromPath);
  if (resp.status >= 400) {
    throw new Deno.errors.Http(
      `${resp.status} ${resp.statusText}: ${resp.url}`,
    );
  }

  const buffer = await resp.arrayBuffer();
  await Deno.writeFile(toPath, new Uint8Array(buffer));
}
