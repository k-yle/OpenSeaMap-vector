import type { JSX as DOM } from 'react';

/** @internal - this should not be published to npm */
declare global {
  namespace JSX {
    type IntrinsicElements = DOM.IntrinsicElements;
    type Element = DOM.Element;
  }
  namespace React {
    // lint rules are wrong, this is the only way to hack
    // the react component defintions.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-wrapper-object-types
    export interface CSSProperties extends String {}
  }
}

export interface Tags {
  [key: string]: string;
}

export interface Defs {
  [id: string]: React.ReactNode;
}

/**
 * this represents a portion of an SVG
 * which is still under construction
 */
export interface CompositeSvg {
  svg: React.ReactNode;
  defs?: Defs;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Transform {
  translateX: number;
  translateY: number;
  rotate: number;
}
