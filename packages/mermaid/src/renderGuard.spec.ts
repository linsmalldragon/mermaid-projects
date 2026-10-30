import { afterEach, describe, expect, it, vi } from 'vitest';
import mermaid from './mermaid.js';
import { calculateTextDimensions } from './utils.js';
import { createRoughSvg } from './rendering-util/roughInterop.js';

afterEach(() => {
  vi.restoreAllMocks();
  Reflect.deleteProperty(globalThis, '__niuchartMermaidGuard');
  document.body.replaceChildren();
});

describe('host drawing guard at engine boundaries', () => {
  it('draws through the source RoughJS interop without a dependency patch', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const drawn = createRoughSvg(svg).circle(0, 0, 10);
    expect(drawn.localName).toBe('g');
    expect(drawn.childElementCount).toBeGreaterThan(0);
  });
  it('passes the actual parsed diagram before SVG drawing can start', async () => {
    const refused = new Error('Host rejected the parsed diagram');
    const parsed = vi.fn((diagram, id) => {
      expect(id).toBe('guarded-flow');
      expect(diagram.type).toBe('flowchart-v2');
      expect(diagram.text).toContain('A-->B');
      expect(diagram.db.getData().nodes).toHaveLength(2);
      throw refused;
    });
    globalThis.__niuchartMermaidGuard = { parsed };
    mermaid.initialize({ startOnLoad: false, htmlLabels: false, suppressErrorRendering: true });
    const container = document.body.appendChild(document.createElement('div'));
    await expect(mermaid.render('guarded-flow', 'graph TD;A-->B', container)).rejects.toBe(refused);
    expect(parsed).toHaveBeenCalledOnce();
  });

  it('does not describe an unsuccessful parse as a successful diagram', async () => {
    const parsed = vi.fn();
    globalThis.__niuchartMermaidGuard = { parsed };
    mermaid.initialize({ startOnLoad: false, suppressErrorRendering: true });
    const container = document.body.appendChild(document.createElement('div'));
    await expect(
      mermaid.render('guarded-invalid', 'not a diagram type', container)
    ).rejects.toThrow();
    expect(parsed).not.toHaveBeenCalled();
  });

  it('lets the host refuse text before SVG text measurement', () => {
    const refused = new Error('Host text budget exhausted');
    const fit = vi.fn(() => {
      throw refused;
    });
    globalThis.__niuchartMermaidGuard = { fit };
    expect(() => calculateTextDimensions('guarded unique measurement', {})).toThrow(refused);
    expect(fit).toHaveBeenCalledWith('text', 'guarded unique measurement');
    expect(document.body.childElementCount).toBe(0);
  });

  it('inserts diagram CSS as text with escaped less-than characters', async () => {
    const stopped = new Error('Stop after inspecting generated CSS');
    let css: string | null = null;
    const container = document.body.appendChild(document.createElement('div'));
    globalThis.__niuchartMermaidGuard = {
      parsed: (diagram) => {
        vi.spyOn(diagram.renderer, 'draw').mockImplementation(() => {
          css = container.querySelector('svg > style')?.textContent ?? null;
          return Promise.reject(stopped);
        });
      },
    };
    mermaid.initialize({
      startOnLoad: false,
      htmlLabels: false,
      suppressErrorRendering: true,
      themeCSS: '.node::before { content: "<probe>"; }',
    });
    await expect(mermaid.render('guarded-style', 'graph TD;A-->B', container)).rejects.toBe(
      stopped
    );
    expect(css).toContain('\\3c probe>');
    expect(css).not.toContain('<probe>');
  });

  it('charges the calculation rather than a memoized text measurement', () => {
    const fit = vi.fn();
    globalThis.__niuchartMermaidGuard = { fit };
    expect(calculateTextDimensions('', { fontFamily: 'guard-owned-empty' })).toEqual({
      width: 0,
      height: 0,
    });
    expect(calculateTextDimensions('', { fontFamily: 'guard-owned-empty' })).toEqual({
      width: 0,
      height: 0,
    });
    expect(fit).toHaveBeenCalledTimes(1);
  });
});
