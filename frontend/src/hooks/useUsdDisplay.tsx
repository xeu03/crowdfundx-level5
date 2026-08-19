import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { USD_DISPLAY_KEY } from '../config';

interface UsdDisplayApi {
  showUsd: boolean;
  toggleUsd: () => void;
}

const UsdDisplayContext = createContext<UsdDisplayApi>({
  showUsd: false,
  toggleUsd: () => {},
});

export function useUsdDisplay(): UsdDisplayApi {
  return useContext(UsdDisplayContext);
}

/**
 * Global "show approximate USD" toggle, persisted in localStorage.
 * Requested in user feedback: "Would love USD amounts shown next to CFX."
 */
export function UsdDisplayProvider({ children }: { children: ReactNode }) {
  const [showUsd, setShowUsd] = useState(
    () => localStorage.getItem(USD_DISPLAY_KEY) === '1',
  );

  const toggleUsd = useCallback(() => {
    setShowUsd((current) => {
      const next = !current;
      localStorage.setItem(USD_DISPLAY_KEY, next ? '1' : '0');
      return next;
    });
  }, []);

  const api = useMemo(() => ({ showUsd, toggleUsd }), [showUsd, toggleUsd]);
  return <UsdDisplayContext.Provider value={api}>{children}</UsdDisplayContext.Provider>;
}
