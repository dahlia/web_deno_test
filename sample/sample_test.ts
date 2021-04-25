import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.92.0/testing/asserts.ts";
import suite from "../mod.ts";

const test = suite(import.meta.url);

test("sample test", () => {
  assertEquals(1 + 2, 3);
});

test("timeout test", async () => {
  const t = +Date.now();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const t2 = +Date.now();
  assert(t + 2000 <= t2);
});
