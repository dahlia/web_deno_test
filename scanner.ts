import {
  fromFileUrl,
  isAbsolute,
  join,
  resolve,
  toFileUrl,
} from "https://deno.land/std@0.92.0/path/mod.ts";

/**
 * The filename pattern to find JavaScript/TypeScript test files, which have
 * `_test`/`.test` suffixes.  The pattern is equivalent to the pattern
 * `deno test` command uses for scanning test files.
 */
export const testFilenamePattern = /[_.]test\.(?:js|mjs|ts|jsx|tsx)$/;

/**
 * Scans test files.
 */
export async function scanTestFiles(
  paths: Set<URL> | URL | string,
): Promise<Set<URL>> {
  if (typeof paths == "string") {
    paths = isAbsolute(paths) ? paths : resolve(paths);
    return scanTestFiles(toFileUrl(paths));
  }
  if (paths instanceof Set) {
    const result = new Set<URL>();
    for (const path of paths) {
      const files = await scanTestFiles(path);
      if (files instanceof Error) return files;
      for (const file of files) {
        result.add(file);
      }
    }
    return result;
  }

  const path = paths;
  const pathStat: Deno.FileInfo = await Deno.lstat(path);
  if (pathStat.isDirectory) {
    const result = new Set<URL>();
    for await (const entry of Deno.readDir(path)) {
      const entryPath = toFileUrl(join(fromFileUrl(path), entry.name));
      if (entry.isDirectory) {
        const files = await scanTestFiles(entryPath);
        if (files instanceof Error) return files;
        for (const file of files) {
          result.add(file);
        }
      } else if (entry.name.match(testFilenamePattern)) {
        result.add(entryPath);
      }
    }
    return result;
  }

  return new Set<URL>([path]);
}

