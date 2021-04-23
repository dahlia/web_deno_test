export interface TestSuiteSet {
  [suiteName: string]: Deno.TestDefinition[];
}

export interface TestFunction {
  (name: string, fn: () => void | Promise<void>): void;
  (t: Deno.TestDefinition): void;
}

const $scannedTests: TestSuiteSet = {};

export default function suite(name: string): TestFunction {
  const tests: Deno.TestDefinition[] = ($scannedTests[name] ||= []);

  function test(
    t: string | Deno.TestDefinition,
    fn?: (() => void | Promise<void>),
  ): void {
    if (typeof t == "string") {
      test({ name: t, fn: fn as () => void | Promise<void> });
      return;
    }
    tests.push(t);
    if (globalThis?.Deno != null && Deno?.test != null) {
      Deno.test(t);
    }
  }

  return test;
}

/**
 * Gets all scanned tests.
 * @param Whether to omit the common prefixes from suite names.
 * @return The set of test suites.
 */
export function getTestSuites(omitCommonPrefix = false): TestSuiteSet {
  // Returns a duplicated one so that its internal object cannot be mutated
  // from external code.
  const commonPrefix = omitCommonPrefix ? getCommonSuitePrefix() : "";
  const cutLength = commonPrefix.length;
  const dup = Object.entries($scannedTests).map(
    ([suiteName, tests]) => [suiteName.substr(cutLength), Array.from(tests)]
  );
  return Object.fromEntries(dup);
}

/**
 * Finds the most longest common prefix among test suite names.  If there
 * is no common prefix at all, it returns an empty string.
 *
 * Note that if there are less than two test suites it returns an empty string.
 * @return The longest common prefix among test suite names.
 *         Can be an empty string.
 */
export function getCommonSuitePrefix(): string {
  const names = Object.keys($scannedTests);
  if (names.length <= 1) {
    return "";
  }

  const shortestName = names.reduce(
    (shortest, name) => shortest.length > name.length ? name : shortest
  );

  for (let prefixLen = shortestName.length; prefixLen >= 0; prefixLen--) {
    const candidate = shortestName.substr(0, prefixLen);
    if (names.every(n => n.substr(0, prefixLen) == candidate)) {
      return candidate;
    }
  }

  return "";
}
