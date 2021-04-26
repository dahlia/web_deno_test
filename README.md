<!-- deno-fmt-ignore-file -->

web_deno_test: Run your tests on Deno and web browsers at a time
================================================================

[![GitHub Actions Status][GitHub Actions Status Badge]][GitHub Actions Status]

This script enables your test suite to run on Deno and web browsers at a time.

[GitHub Actions Status Badge]: https://github.com/dahlia/web_deno_test/actions/workflows/test.yaml/badge.svg
[GitHub Actions Status]: https://github.com/dahlia/web_deno_test/actions/workflows/test.yaml


How to write tests
------------------

You need to use the `suite()` function from *mod.ts*:

~~~~ typescript
import { assertEquals } from "https://deno.land/std@0.92.0/testing/asserts.ts";
import suite from "https://deno.land/x/web_deno_test/mod.ts";

const test = suite(import.meta.url);

test("1 plus 2 equals 3", () => {
  assertEquals(1 + 2, 3);
});
~~~~


How to run tests on Deno
------------------------

The standard Deno test command works:

~~~~ bash
$ deno test
Check file:///.../$deno$test.ts
running 1 tests
test 1 plus 2 equals 3 ... ok (3ms)

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (3ms)
~~~~


How to run tests on web browsers
--------------------------------

The *cli.ts* script scans test files and turns them into [Mocha]-based
tests:

~~~~ bash
$ deno run \
    --unstable \
    --allow-read=. \
    --allow-write=tests/ \
    --allow-net \
    https://deno.land/x/web_deno_test/cli.ts \
    --output-dir tests/ \
    .
Check .../cli.ts
~~~~

Note that the script requires `--unstable` API as of Deno 1.9.

The built *index.html* should be opened through `http:`/`https:` (not `file:`)
on web browser due to security policies:

~~~~ bash
$ deno run \
    --allow-net \
    --allow-read=. \
    https://deno.land/std/http/file_server.ts \
    tests/
~~~~

Then, open <http://0.0.0.0:4507/> on your web browser.  It will run your tests:

![Tests ran on web browser.](https://i.imgur.com/1vcuuVC.png)


[Mocha]: https://mochajs.org/
