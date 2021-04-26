Changelog
=========

Version 0.2.1
-------------

To be released.


Version 0.2.0
-------------

Released on April 26, 2021.

 -   Added `-t`/`--timeout` option to configure timeout for each `async` test
     case.  If the option is omitted `async` tests are never timed out by force.
 -   Fixed an unexpected error that lack of `-o`/`--output-dir` option (which
     is required) had caused.
 -   Removed a debug-purpose `console.log()` from web test runner script
     (*runner.js*).


Version 0.1.0
-------------

Initial release.  Released on April 24, 2021.
