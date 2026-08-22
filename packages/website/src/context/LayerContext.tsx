import {
  type PropsWithChildren,
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Layer, type LayerName } from '../data/layers.js';
import { AppContext } from './AppContext.js';

// the disabled layers are stored using a bitmask in the URL
const PROP = 'l';

const getQs = () => new URLSearchParams(window.location.hash.slice(1));

export interface ILayerContext {
  hiddenLayers: number;
  toggle(layer: Layer): void;
}
export const LayerContext = createContext<ILayerContext>(undefined!);
LayerContext.displayName = 'LayerContext';

export const LayerWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { map } = use(AppContext);

  const [hiddenLayers, setHiddenLayers] = useState(
    () => +(getQs().get(PROP) || 0),
  );

  useEffect(() => {
    // sync state with URL qs
    const qs = getQs();
    if (hiddenLayers) {
      qs.set(PROP, hiddenLayers.toString());
    } else {
      qs.delete(PROP); // don't include ?hide=0
    }
    const url = new URL(window.location.href);
    url.hash = qs.toString().replaceAll('%2F', '/'); // undo URLSearchParams's annoying behaviour
    window.history.replaceState('', '', url);
  }, [hiddenLayers]);

  useEffect(() => {
    if (!map) return;

    // sync state with the map
    for (const styleLayer of map.getStyle().layers) {
      if (!('source-layer' in styleLayer)) continue;
      if (!styleLayer['source-layer']) continue;
      if (!(styleLayer['source-layer'] in Layer)) continue;

      const layerId = Layer[styleLayer['source-layer'] as LayerName];

      map.setLayoutProperty(
        styleLayer.id,
        'visibility',
        hiddenLayers & layerId ? 'none' : 'visible',
      );
    }
  }, [hiddenLayers, map]);

  const toggle = useCallback(
    (value: Layer) => setHiddenLayers((current) => current ^ value),
    [],
  );

  const ctx = useMemo(() => ({ hiddenLayers, toggle }), [hiddenLayers, toggle]);

  return <LayerContext value={ctx}>{children}</LayerContext>;
};
