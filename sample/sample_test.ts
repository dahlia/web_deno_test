import { assertEquals } from "https://deno.land/std@0.92.0/testing/asserts.ts";
import suite from "../mod.ts";

const test = suite(import.meta.url);

test("sample test", () => {
  assertEquals(1 + 2, 3);
});
