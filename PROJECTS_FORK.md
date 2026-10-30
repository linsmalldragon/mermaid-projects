# Projects drawing engine

This source fork starts at upstream `mermaid@11.17.2`, commit `dcb694ddb58dc5ad3502e7e903cac05fd812eac3`. The upstream MIT license and attribution are retained. The private package is published as `@niuchart/mermaid-engine`; applications consume a precise published version.

Package release versions identify this fork. The engine's diagram version label uses upstreamVersion so an info diagram continues to identify its underlying Mermaid 11.17.2 engine. Hosts verify the actual parse hook rather than accepting a version label as evidence that a guard ran.

The host may supply `globalThis.__niuchartMermaidGuard` with `parsed(diagram, id)` and `fit("text", text)` callbacks. A successful diagram parse invokes `parsed` before classes, CSS or drawing. Uncached text dimension calculation invokes `fit` before measuring. Callback exceptions propagate and prevent the following operation. No hook is installed by the engine itself, and an inherited global property is ignored.

The hook positions match the independently inspected Desktop 4.4212.0 engine. The namespace belongs to this fork. The application must verify its parse callback ran and provide its own parsed-data limits, sandbox CSP, drawing meter, SVG sanitizer and rendering lifecycle; these two callbacks alone do not establish application acceptance.

Generated diagram CSS is inserted through textContent after escaping less-than characters as CSS escapes, matching the inspected drawing path. This prevents the CSS string from being parsed as SVG markup during construction.

Upstream's declaration-only RoughJS dependency patch is removed. Dependency caches and installed packages are not edited. Any needed type interoperability is maintained in this source tree and checked by the declaration build. The package is built from this source with the normal upstream build, then packed, reviewed and published to the private registry.

Build this source with the pinned Node 24.19.0 toolchain. The original generator succeeds on that toolchain; the host's Node 26 rejects the legacy schema reference URL used by its build dependency. All normal schema validation remains enabled. See the related upstream [schema URL compatibility report](https://github.com/adonisjs/ace/issues/169). This source toolchain requirement does not add Node to the browser package's runtime dependencies.

The private registry rejected the initial 17.8 MB archive with HTTP 413. The package file list therefore publishes all built JavaScript formats, lazy chunks and declarations while omitting external source maps. All formats and maps still build normally in this source checkout; emitted runtime files do not link the external maps. Release review compares every retained file with the accepted full build.
