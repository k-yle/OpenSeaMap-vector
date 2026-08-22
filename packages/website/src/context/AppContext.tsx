import {
  type PropsWithChildren,
  createContext,
  useMemo,
  useState,
} from 'react';
import type { Map } from 'maplibre-gl';

export interface IAppContext {
  map: Map | undefined;
  setMap: React.Dispatch<React.SetStateAction<Map | undefined>>;
}
export const AppContext = createContext<IAppContext>(undefined!);
AppContext.displayName = 'AppContext';

export const AppWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [map, setMap] = useState<Map>();

  const ctx = useMemo(() => ({ map, setMap }), [map]);

  return <AppContext value={ctx}>{children}</AppContext>;
};
