import { getTestSuites } from './run_tests.js';

mocha.setup('tdd');

for (const [suiteName, tests] of Object.entries(getTestSuites(true))) {
  suite(suiteName, function () {
    for (const t of tests) {
      const register
        = t.only
        ? test.only
        : t.ignore
        ? test.skip
        : test;
      register(t.name, t.fn);
    }
  });
}

mocha.run();
