Contributor guide
=================

How to run tests
----------------

~~~~ bash
$ deno test --unstable --allow-read=.
Check file:///.../$deno$test.ts
running 5 tests
test scanTestFiles() ... ok (44ms)
test Timeout.from() ... ok (3ms)
test Timeout.toString() ... ok (1ms)
test sample test ... ok (1ms)
test timeout test ... ok (2005ms)

test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (2054ms)
~~~~
