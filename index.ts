import React, { useEffect, useMemo, useState, useCallback } from "react";

type Serializer<T> = (object: T | undefined) => string;
type Parser<T> = (val: string) => T | undefined;
type SetterEntity<T> = React.SetStateAction<T>;
type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type Options<T> = Partial<{
  serializer: Serializer<T>;
  parser: Parser<T>;
  logger: (error: any) => void;
  syncData: boolean;
}>;

function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options?: Options<T>
): [T, Setter<T>];
function useLocalStorage<T>(
  key: string,
  defaultValue?: undefined,
  options?: Options<T>
): [T | undefined, Setter<T | undefined>];
function useLocalStorage<T>(
  key: string,
  defaultValue?: T,
  options?: Options<T>
) {
  const opts = useMemo(() => {
    return {
      serializer: JSON.stringify,
      parser: JSON.parse,
      logger: console.log,
      syncData: true,
      ...options,
    };
  }, [options]);

  const { serializer, parser, logger, syncData } = opts;

  const [storedValue, setValue] = useState(() => {
    if (typeof window === "undefined") return defaultValue;

    try {
      const item = window.localStorage.getItem(key);
      const res: T = item ? parser(item) : defaultValue;
      return res;
    } catch (e) {
      logger(e);
      return defaultValue;
    }
  });

  const setValueInLocalStorage = useCallback((setterEntity: SetterEntity<T | undefined>) => {
    if (typeof window === "undefined") return;

    const isFunction = !!setterEntity && typeof setterEntity === "function";
    // @ts-ignore
    const newValue = isFunction ? setterEntity(storedValue) : setterEntity;

    try {
      window.localStorage.setItem(key, serializer(newValue));
      setValue(setterEntity);
    } catch (e) {
      logger(e);
    }
  }, [key, logger, storedValue, setValue]);

  useEffect(() => {
    setValueInLocalStorage(storedValue);
  }, []);

  useEffect(() => {
    if (!syncData) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== window.localStorage) return;

      try {
        setValue(e.newValue ? parser(e.newValue) : undefined);
      } catch (e) {
        logger(e);
      }
    };

    if (typeof window === "undefined") return;

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, syncData]);

  return [storedValue, setValueInLocalStorage];
}

export default useLocalStorage;
