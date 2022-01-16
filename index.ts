import { useEffect, useMemo, useState, useCallback } from "react";

type Serializer<T> = (object: T | undefined) => string;
type Parser<T> = (val: string) => T | undefined;
type SetterEntity<T> = React.SetStateAction<T>;
type Setter<T> = React.Dispatch<SetterEntity<T>>;
type Remover = () => void;

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
): [T, Setter<T>, Remover];
function useLocalStorage<T>(
  key: string,
  defaultValue?: undefined,
  options?: Options<T>
): [T | undefined, Setter<T | undefined>, Remover];
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

  const [shouldDelete, setShouldDelete] = useState(false);
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

  const setValueInLocalStorage = useCallback((setter: SetterEntity<T | undefined>) => {
    setShouldDelete(false);
    setValue(setter);
  }, [setValue, setShouldDelete]);

  const unsetValueInLocalStorage = useCallback(() => {
    setShouldDelete(true);
    setValue(undefined);
  }, [setValue, setShouldDelete]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateLocalStorage = () => {
      if (!shouldDelete) {
        window.localStorage.setItem(key, serializer(storedValue));
      } else {
        window.localStorage.removeItem(key);
      }
    }

    try {
      updateLocalStorage();
    } catch (e) {
      logger(e);
    }

  }, [shouldDelete, storedValue]);

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

  return [storedValue, setValueInLocalStorage, unsetValueInLocalStorage];
}

export default useLocalStorage;
