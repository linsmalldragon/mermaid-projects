import roughPackage from 'roughjs';
import type { Config } from 'roughjs/bin/core.js';
import type { RoughSVG } from 'roughjs/bin/svg.js';

interface RoughSvgFactory {
  svg: (svg: SVGSVGElement, config?: Config) => RoughSVG;
}

// RoughJS ships a default-export declaration for a CommonJS export object.
// Keep that interop correction in this source, without editing its declarations.
const rough = roughPackage as unknown as RoughSvgFactory;
export function createRoughSvg(svg: SVGSVGElement, config?: Config): RoughSVG {
  return rough.svg(svg, config);
}
