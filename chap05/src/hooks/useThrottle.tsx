// src/hooks/useThrottle.ts
import { useRef, useCallback } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  const lastCall = useRef(0);

  const throttled = useCallback((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      fn(...args);
    }
  }, [fn, delay]);

  return throttled as T;
}
