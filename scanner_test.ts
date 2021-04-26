import { scanTestFiles } from "./scanner.ts";
import { resolve, toFileUrl } from "https://deno.land/std@0.92.0/path/mod.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.92.0/testing/asserts.ts";
import suite from "./mod.ts";

const test = suite(import.meta.url);

function errorName(error: Error | Set<URL>): string {
  return error.toString().split(":")[0];
}

test("scanTestFiles()", async () => {
  try {
    await scanTestFiles("not-found");
    assert(
      false,
      "Expected Deno.errors.NotFound to be thrown, but caught no error at all.",
    );
  } catch (notFound) {
    assert(
      !(notFound instanceof Deno.errors.PermissionDenied),
      `Expected Deno.errors.NotFound instance, not ${errorName(notFound)}; ` +
        "it seems Deno is not allowed to read the current workding directory " +
        "(.)",
    );
    assert(
      notFound instanceof Deno.errors.NotFound,
      `Expected Deno.errors.NotFound instance, not ${errorName(notFound)}`,
    );
  }

  try {
    await scanTestFiles("/permission-denied");
    assert(
      false,
      "Expected Deno.errors.PermissionDenied to be thrown, " +
        "but caught no error at all.",
    );
  } catch (permissionDenied) {
    assert(
      !(permissionDenied instanceof Deno.errors.NotFound),
      "Expected Deno.errors.PermissionDenied instance, not " +
        errorName(permissionDenied) +
        "; it seems Deno is allowed to read any directory including root (/)",
    );
    assert(
      permissionDenied instanceof Deno.errors.PermissionDenied,
      "Expected Deno.errors.PermissionDenied instance, not " +
        errorName(permissionDenied),
    );
  }

  const testFiles = await scanTestFiles(".");
  assert(
    testFiles instanceof Set,
    `Expected Set<string>, not ${errorName(testFiles)}`,
  );
  assertEquals(
    testFiles,
    new Set<URL>([
      toFileUrl(resolve("bundle_test.ts")),
      toFileUrl(resolve("scanner_test.ts")),
      toFileUrl(resolve("sample/sample_test.ts")),
    ]),
  );

  assertEquals(
    await scanTestFiles(new Set<URL>([toFileUrl(resolve("."))])),
    testFiles,
  );
});
