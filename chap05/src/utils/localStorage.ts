
export const getLocalStorage = (key: string): string | null => {
    return window.localStorage.getItem(key);
  };
  
  export const setLocalStorage = (key: string, value: string): void => {
    window.localStorage.setItem(key, value);
  };
  
  export const removeLocalStorage = (key: string): void => {
    window.localStorage.removeItem(key);
  };
  