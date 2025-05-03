// hooks/useLocalStorage.ts
import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const getItem = (): T => {
    try {
      const storedValue = localStorage.getItem(key);
      if (!storedValue || storedValue === 'undefined') {
        return initialValue;
      }
      return JSON.parse(storedValue) as T;
    } catch (error) {
      console.error(`Error getting localStorage key “${key}”:`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getItem);

  const setItem = (value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  const removeItem = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key “${key}”:`, error);
    }
  };

  return {
    storedValue,
    setItem,
    removeItem,
    getItem,
  };
}
