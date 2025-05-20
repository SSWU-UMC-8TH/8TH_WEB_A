import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, delay = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const remaining = delay - (now - lastExecuted.current);

    if (remaining <= 0) {
      lastExecuted.current = now;
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, remaining);

      return () => clearTimeout(timerId);
    }
  }, [value]);

  return throttledValue;
}

export default useThrottle;
