import type { Diagram } from './Diagram.js';

/** Optional host callbacks run before diagram drawing and uncached text measurement. */
export interface MermaidRenderGuard {
  parsed?: (diagram: Diagram, id: string) => void;
  fit?: (kind: 'text', text: string) => void;
}

declare global {
  var __niuchartMermaidGuard: MermaidRenderGuard | undefined;
}

function hostGuard(): MermaidRenderGuard | undefined {
  return Object.hasOwn(globalThis, '__niuchartMermaidGuard')
    ? globalThis.__niuchartMermaidGuard
    : undefined;
}

export function notifyParsedDiagram(diagram: Diagram, id: string): void {
  const guard = hostGuard();
  if (typeof guard?.parsed === 'function') {
    guard.parsed(diagram, id);
  }
}

export function notifyTextMeasurement(text: string): void {
  const guard = hostGuard();
  if (typeof guard?.fit === 'function') {
    guard.fit('text', text);
  }
}
