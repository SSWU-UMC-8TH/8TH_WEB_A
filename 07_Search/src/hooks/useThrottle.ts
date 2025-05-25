import { useRef, useCallback } from "react";

function useThrottle<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const lastCallTime = useRef(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCallTime.current >= delay) {
      lastCallTime.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}

export default useThrottle;
