import { useCallback, useEffect, useMemo, useState } from "react";

type Serializer<T> = (object: T | undefined) => string;
type Parser<T> = (val: string) => T | undefined;

type Options<T> = Partial<{
  serializer: Serializer<T>;
  parser: Parser<T>;
}>;

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type SetKey<T> = (key: string, value?: T) => void;

function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options?: Options<T>
): [T, Setter<T>, SetKey<T>];
function useLocalStorage<T>(
  key: string,
  defaultValue?: undefined,
  options?: Options<T>
): [T | undefined, Setter<T | undefined>, SetKey<T>];
function useLocalStorage<T>(
  key: string,
  defaultValue?: T,
  options?: Options<T>
) {
  const currentOptions = useMemo(() => {
    return {
      serializer: JSON.stringify,
      parser: JSON.parse,
      ...options,
    };
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

  const setValue = useCallback((value: Setter<T>) => {
    setKeyValue(({ currentKey, currentValue }) => ({
      currentKey,
      currentValue: typeof value === "function" ? value(currentValue) : value,
    }));
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
