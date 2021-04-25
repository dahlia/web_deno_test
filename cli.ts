import {
  dirname,
  fromFileUrl,
  join,
  resolve,
  toFileUrl,
} from "https://deno.land/std@0.92.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.94.0/flags/mod.ts";
import { bundleTests } from "./bundle.ts";
import { scanTestFiles } from "./scanner.ts";

const localCall = import.meta.url.startsWith("file:");

async function main(): Promise<void> {
  const opts = parse(Deno.args, {
    string: ["o", "output-dir"],
    boolean: ["h", "help"],
    "--": true,
    unknown: (option: string) => {
      if (option.startsWith("-")) {
        console.error(`Error: ${option}: No such option.`);
        Deno.exit(1);
      }

      return true;
    },
  });

  if (opts.h || opts.help) {
    console.info(
      "Usage: deno run --unstable",
      import.meta.url,
      "-o|--output-dir=DIR [DIR...] [FILE...]",
    );
    console.info(
      "It scans the current working directory (.) by default " +
        "if any DIR/FILE is not present.",
    );
    Deno.exit(0);
  }

  if (opts.o != null && opts["output-dir"] != null) {
    console.error("Error: -o/--output-dir cannot be applied multiple times.");
    Deno.exit(1);
  }

  const outputDir: string | undefined = opts["output-dir"] ?? opts.o;
  if (outputDir == null) {
    console.error("Error: -o/--output-dir is required.");
    Deno.exit(1);
  }

  const paths: Set<string> = new Set(opts["_"].map((s) => s.toString()));
  if (paths.size < 1) {
    paths.add(".");
  }

  const readPaths = new Set([".", ...paths]);
  if (localCall) {
    const projectDir = dirname(fromFileUrl(import.meta.url));
    readPaths.add(join(projectDir, "runner.html"));
    readPaths.add(join(projectDir, "runner.js"));
  } else {
    const moduleUrl = new URL(import.meta.url);
    const netPermission = await Deno.permissions.request({
      name: "net",
      host: moduleUrl.hostname,
    });
    if (netPermission.state != "granted") {
      console.error(
        `Error: Net access to ${moduleUrl.hostname} was not granted.`,
      );
    }
  }

  for (const path of readPaths) {
    const readPermission = await Deno.permissions.request({
      name: "read",
      path,
    });
    if (readPermission.state != "granted") {
      console.warn(
        `Warning: As read access to ${path} was not granted, ` +
          "it won't be scanned and excluded from test suite.",
      );
      paths.delete(path);
    }
  }

  const writePermission = await Deno.permissions.request({
    name: "write",
    path: outputDir,
  });
  if (writePermission.state != "granted") {
    console.error(`Error: Write access to ${outputDir} was not granted.`);
    Deno.exit(1);
  }

  const testFiles = await scanTestFiles(
    new Set([...paths].map((p) => toFileUrl(resolve(p)))),
  );
  await bundleTests(testFiles, toFileUrl(resolve(outputDir)));
}

if (import.meta.main) {
  await main();
}
