Changelog
=========

Version 0.2.0
-------------

To be released.

 -   Added `-t`/`--timeout` option to configure timeout for each `async` test
     case.  If it's omitted `async` tests are never timed out by force.
 -   Fixed an unexpected error that lack of `-o`/`--output-dir` option (which
     is required) had caused.
 -   Removed a debug-purpose `console.log()` from web test runner script
     (*runner.js*).


Version 0.1.0
-------------

Initial release.  Released at April 24, 2021.
