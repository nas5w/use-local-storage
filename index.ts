import { useCallback, useEffect, useMemo, useState } from "react";

type Serializer<T> = (object: T | undefined) => string;
type Parser<T> = (val: string) => T | undefined;

type Options<T> = {
  serializer: Serializer<T>;
  parser: Parser<T>;
};

type SetKey<T> = (key: string, value?: T) => void;

function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options?: Options<T>
): [T, (value: T) => void, SetKey<T>];
function useLocalStorage<T>(
  key: string,
  defaultValue?: undefined,
  options?: Options<T>
): [T | undefined, (value: T | undefined) => void, SetKey<T>];
function useLocalStorage<T>(
  key: string,
  defaultValue?: T,
  options?: Options<T>
) {
  const currentOptions: Options<T> = useMemo(() => {
    return (
      options || {
        serializer: JSON.stringify,
        parser: JSON.parse,
      }
    );
  }, [options]);

  const { serializer, parser } = currentOptions;

  const initial = useMemo(() => {
    return getValueOrDefaultFromLocal(key, defaultValue, parser);
  }, [key, defaultValue, parser]);

  const [keyValue, setKeyValue] = useState({
    currentKey: key,
    currentValue: initial,
  });

  const { currentKey, currentValue } = keyValue;

  const setValue = useCallback((value: T) => {
    setKeyValue(({ currentKey }) => ({ currentKey, currentValue: value }));
  }, []);

  const setKey: SetKey<T> = useCallback(
    (key, newDefaultValue) => {
      const value = getValueOrDefaultFromLocal(
        key,
        newDefaultValue ?? defaultValue,
        parser
      );
      setKeyValue({ currentValue: value, currentKey: key });
    },
    [parser, defaultValue]
  );

  useEffect(() => {
    localStorage.setItem(currentKey, serializer(currentValue));
  }, [currentKey, currentValue, serializer]);

  return [currentValue, setValue, setKey] as const;
}

function getValueOrDefaultFromLocal<T>(
  key: string,
  defaultValue: T,
  parser: Parser<T>
) {
  const result = localStorage.getItem(key);
  if (result === null) {
    return defaultValue;
  }
  try {
    return parser(result);
  } catch (e) {
    return undefined;
  }
}

export default useLocalStorage;
