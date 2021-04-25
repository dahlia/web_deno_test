import {
  assertEquals,
  assertNotEquals,
  assertThrows,
} from "https://deno.land/std@0.92.0/testing/asserts.ts";
import { Timeout } from "./bundle.ts";
import suite from "./mod.ts";

const test = suite(import.meta.url);

test("Timeout.from()", () => {
  assertThrows(() => Timeout.from("invalid"), Error, "Invalid timeout format");
  const empty = Timeout.from(undefined);
  assertEquals(empty, undefined);
  const v100 = Timeout.from("100");
  assertNotEquals(v100, undefined);
  assertEquals(v100?.value, 100);
  assertEquals(v100?.unit, "ms");
  const v2s = Timeout.from("2s");
  assertNotEquals(v2s, undefined);
  assertEquals(v2s?.value, 2);
  assertEquals(v2s?.unit, "s");
  const v2000ms = Timeout.from("2000ms");
  assertNotEquals(v2000ms, undefined);
  assertEquals(v2000ms?.value, 2000);
  assertEquals(v2000ms?.unit, "ms");
});

test("Timeout.toString()", () => {
  const v2s = new Timeout(2, "s");
  assertEquals(v2s.toString(), "2s");
  const v2000ms = new Timeout(2000, "ms");
  assertEquals(v2000ms.toString(), "2000");
});
