import { useCallback, useEffect, useMemo, useState } from "react";

type Serializer<T> = (object: T | undefined) => string;
type Parser<T> = (val: string) => T | undefined;
type Setter<T> = React.Dispatch<React.SetStateAction<T | undefined>>;

type Options<T> = Partial<{
  serializer: Serializer<T>;
  parser: Parser<T>;
  logger: (error: any) => void;
  syncData: boolean;
}>;

function useLocalStorage<T>(
  key: string,
  defaultValue?: T,
  options?: Options<T>
): [T, Setter<T>] {
  const opts = useMemo(() => {
    return {
      serializer: JSON.stringify,
      parser: JSON.parse,
      logger: console.log,
      syncData: true,
      ...options
    };
  }, [options]);

  const { serializer, parser, logger, syncData } = opts;
  // The parser and logger are supposed to change very infrequently since
  // they are memoized above; however the key and default value are not
  // memoized in any way so we take them as params and expect the caller
  // of this function to properly depend on them
  const getValue = useCallback(
    (key, defaultValue) => {
      if (typeof window === "undefined") return defaultValue;
      try {
        const item = window.localStorage.getItem(key);
        const res = item ? parser(item) : defaultValue;

        return res;
      } catch (e) {
        logger(e);
        return defaultValue;
      }
    },
    [parser, logger]
  );

  const [storedValue, setValue] = useState(() => getValue(key, defaultValue));

  // When any of the dependencies is updated, check
  useEffect(() => {
    setValue(getValue(key, defaultValue));
  }, [getValue, key, defaultValue]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateLocalStorage = () => {
      if (storedValue === undefined) {
        if (storedValue !== defaultValue) {
          setValue(defaultValue);
        }
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, serializer(storedValue));
      }
    };

    try {
      updateLocalStorage();
    } catch (e) {
      logger(e);
    }
  }, [key, defaultValue, storedValue, logger, serializer]);

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
  }, [getValue, key, defaultValue, logger, syncData]);

  return [storedValue, setValue];
}

export default useLocalStorage;
