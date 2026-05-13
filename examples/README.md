# Examples

`examples/demo` is a tiny repo-shaped directory with duplicate README paths.

Try it after building:

```sh
npm run build
node bin/pathprune.js check examples/demo --format text
node bin/pathprune.js check examples/demo --format json
```

PathPrune should report duplicate-path warnings and still leave the example untouched.
