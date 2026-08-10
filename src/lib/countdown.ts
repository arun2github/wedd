"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function diff(targetDate: string): CountdownParts {
  const ms = Math.max(0, new Date(targetDate).getTime() - Date.now());
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isPast: ms <= 0,
  };
}

const zeroParts: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isPast: false,
};

function partsEqual(a: CountdownParts, b: CountdownParts): boolean {
  return (
    a.days === b.days &&
    a.hours === b.hours &&
    a.minutes === b.minutes &&
    a.seconds === b.seconds &&
    a.isPast === b.isPast
  );
}

/**
 * Ticks every second toward `targetDate`, stopping cleanly once it's passed.
 * Renders zero on the server and on the client's first (hydration) pass to
 * avoid mismatches, then syncs to the real, ticking value via
 * `useSyncExternalStore` — the React-idiomatic way to read a client-only
 * external value without a raw `useEffect` + `setState` on mount.
 */
export function useCountdown(targetDate: string): CountdownParts {
  const cacheRef = useRef<CountdownParts>(zeroParts);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const tick = () => {
        const next = diff(targetDate);
        if (!partsEqual(cacheRef.current, next)) {
          cacheRef.current = next;
          onStoreChange();
        }
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    },
    [targetDate]
  );

  const getSnapshot = useCallback(() => cacheRef.current, []);
  const getServerSnapshot = useCallback(() => zeroParts, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
