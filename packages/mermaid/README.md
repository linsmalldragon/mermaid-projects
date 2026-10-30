# @niuchart/mermaid-engine

Private source fork of Mermaid 11.17.2 for the Projects Markdown renderer. Upstream source: `mermaid-js/mermaid`, tag `mermaid@11.17.2`, commit `dcb694ddb58dc5ad3502e7e903cac05fd812eac3`. The MIT license and upstream attribution are included.

The host can provide `globalThis.__niuchartMermaidGuard`:

```ts
interface MermaidRenderGuard {
  parsed?: (diagram: Diagram, id: string) => void;
  fit?: (kind: "text", text: string) => void;
}
```

`parsed` runs after a successful parse and before classes, CSS and drawing. `fit` runs before an uncached text measurement. Callback errors propagate. The engine inserts generated CSS as text with less-than characters escaped. The hook positions and CSS behavior follow the inspected Desktop 4.4212.0 engine; the namespace belongs to this fork.

The host must provide and verify parsed-data limits, sandbox CSP, drawing measurements, SVG sanitization and lifecycle ownership. These callbacks alone are not a complete diagram renderer. The package release version identifies this fork; info diagrams retain the underlying engine version, 11.17.2.

The source build uses pinned Node 24.19.0 and pnpm 10.30.3. No installed dependency files or package caches are patched. Source and release notes are maintained in the private `linsmalldragon/mermaid-projects` repository.

The registry package includes every built JavaScript format, lazy diagram chunk and TypeScript declaration. External source maps remain in the source build and are omitted from publication to fit the private registry's request-size limit. The external maps are not linked by the emitted runtime files.
