import { useState, useEffect, useCallback } from "react";

type UseStateHook<T> = [T | null, (value?: T | null) => void, boolean];
type UseAsyncStateHook<T> = [
  T | null,
  (value?: T | null) => void,
  boolean,
  (value: boolean) => void,
];

function useAsyncState<T>(initialValue: T | null = null): UseAsyncStateHook<T> {
  const [state, setState] = useState<T | null>(initialValue);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (initialValue !== null) {
      setState(initialValue);
      setIsReady(true);
    }
  }, [initialValue]);

  return [state, setState as (value?: T | null) => void, isReady, setIsReady];
}

export function storeStorageItemAsync(key: string, value: any) {
  if (value == null) {
    const val = localStorage.getItem(key);
    if (val) {
      localStorage.removeItem(key);
    }
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function useStorage<T>(key: string, defaultValue?: T): UseStateHook<T> {
  const [state, setState, isReady, setIsReady] = useAsyncState<T | null>(null);

  // Get
  useEffect(() => {
    const value = localStorage.getItem(key);

    if (value !== undefined) {
      setState(value === null ? null : JSON.parse(value));
    }
    setIsReady(true);
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: T | null = null) => {
      storeStorageItemAsync(key, value !== undefined ? value : null);
      setState(value);
    },
    [key],
  );

  return [
    state || (state !== undefined && defaultValue === undefined)
      ? state
      : defaultValue !== undefined
        ? defaultValue
        : null,
    setValue,
    isReady,
  ];
}
