export const COLOUR_PATTERNS = {
  horizontal: true,
  vertical: true,
  diagonal: true,
  squared: true,
  border: true,
  cross: true,
  saltire: true,
} satisfies Record<string, true>;
export type ColourPattern = keyof typeof COLOUR_PATTERNS;

export const isColourPattern = (
  str: string | undefined,
): str is ColourPattern => !!str && str in COLOUR_PATTERNS;

// top-to-bottom, then left-to-right, then background, then border.
export function createPattern(colours: string[], colourPattern: ColourPattern) {
  // the ID is to de-duplicate identical patterns
  const patternId = `pattern-${colourPattern}-${btoa(colours.join('-')).replaceAll(/\W/g, '')}`;

  switch (colourPattern) {
    case 'horizontal': {
      const pattern = (
        <pattern
          id={patternId}
          width={1}
          height={1}
          patternContentUnits="objectBoundingBox"
        >
          {colours.map((colour, i) => (
            <rect
              x={0}
              y={i / colours.length}
              width={1}
              height={1 / colours.length}
              fill={colour}
            />
          ))}
        </pattern>
      );
      return { patternId, pattern };
    }

    case 'diagonal':
    case 'vertical': {
      const pattern = (
        <pattern
          id={patternId}
          width={1}
          height={1}
          patternContentUnits="objectBoundingBox"
          patternTransform={colourPattern === 'diagonal' ? 'rotate(45)' : ''}
        >
          {colours.map((colour, i) => (
            <rect
              x={i / colours.length}
              y={0}
              width={1 / colours.length}
              height={1}
              fill={colour}
            />
          ))}
        </pattern>
      );
      return { patternId, pattern };
    }

    case 'squared': {
      const pattern = (
        <pattern
          id={patternId}
          width={1}
          height={1}
          patternContentUnits="objectBoundingBox"
        >
          <rect
            x={0}
            y={0}
            width=".5"
            height=".5"
            fill={colours[0] || 'none'}
          />
          <rect
            x=".5"
            y={0}
            width=".5"
            height=".5"
            fill={colours[1] || colours[0] || 'none'}
          />
          <rect
            x=".5"
            y=".5"
            width=".5"
            height=".5"
            fill={colours[2] || colours[0] || 'none'}
          />
          <rect
            x={0}
            y=".5"
            width=".5"
            height=".5"
            fill={colours[3] || colours[1] || colours[0] || 'none'}
          />
        </pattern>
      );
      return { patternId, pattern };
    }

    case 'border': {
      const pattern = (
        <defs>
          <pattern
            id={patternId}
            width={1}
            height={1}
            patternContentUnits="objectBoundingBox"
          >
            <rect
              x={0}
              y={0}
              width={1}
              height={1}
              fill={colours[0] || 'none'}
            />
            <rect
              x={1 / 3}
              y={1 / 3}
              width={1 / 3}
              height={1 / 3}
              fill={colours[1] || 'none'}
            />
          </pattern>
        </defs>
      );
      return { patternId, pattern };
    }

    case 'cross':
    case 'saltire': {
      const path =
        colourPattern === 'cross'
          ? 'M0 .4V.6H.4V1H.6V.6H1V.4H.6V0H.4V.4z'
          : 'M.2172.0757.0757.2172.3586.5.0757.7828.2172.9243.5.6414.7828.9243.9243.7828.6414.5.9243.2172.7828.0757.5.3586z';
      const pattern = (
        <pattern
          id={patternId}
          width={1}
          height={1}
          patternContentUnits="objectBoundingBox"
        >
          <rect x={0} y={0} width={1} height={1} fill={colours[0] || 'none'} />
          <path d={path} fill={colours[1] || 'none'} />
        </pattern>
      );
      return { patternId, pattern };
    }

    default: {
      return colourPattern satisfies never;
    }
  }
}
