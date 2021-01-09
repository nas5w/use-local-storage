![useLocalStorage React hook](./logo.png)

A flexible React Hook for using Local Storage.

<hr />

# Installation

Install with npm

```bash
npm i uselocalstorage
```

Install with yarn

```bash
yarn add uselocalstorage
```

# Basic Usage

In its most basic form, the `useLocalStorage` hook just needs the Local Storage `key` you wish to use. However, it's advised that you also provde a default value as a second argument in the event that they `key` does not yet exist in Local Storage.

The following usage will persist the `username` variable in a `"name"` key in Local Storage. It will have a default/initial value of an empty string `""`.

```jsx
import useLocalStorage from "uselocalstorage";

function MyComponent() {
  const [username, setUsername] = useLocalStorage("name", "");

  return (
    <>
      <input
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
    </>
  );
}
```

**Note:** By default, the `useLocalStorage` hook uses `JSON.stringify` and `JSON.parse` to serialize and parse the data, respectively. A custom serializer and/or parser can be configured if desired (discussed below in the Advanced Usage section).

## Typescript Use

The type of `username` will be inferred from your default value. In this case, the type of `string` will be inferred.

If you use `useLocalStorage` _without_ providing a default value, or you simply want to specify that `username` is actually of a different type, you should pass the type of your data as a generic:

```tsx
import useLocalStorage from "uselocalstorage";

function MyComponent() {
  const [username, setUsername] = useLocalStorage<string>("name");

  return (
    <>
      <input
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
    </>
  );
}
```

# Advanced Usage

The `useLocalStorage` hook has a couple other features:

- Ability to change keys
- Ability to use a custom parser and/or serializer

## Changing Keys

The `useLocalStorage` hook returns a function as a third array element that lets you set a new `key` with an option (but recommended) second argument for the default value.

```jsx
import useLocalStorage from "uselocalstorage";

function MyComponent() {
  const [data, setData, setKey] = useLocalStorage("name", "");

  return (
    <>
      <input
        value={data}
        onChange={(e) => {
          setData(e.target.value);
        }}
      />
      <button
        onClick={() => {
          setKey("email", "");
        }}
      >
        Switch to Email
      </button>
    </>
  );
}
```

### Typescript Usage

The `setKey` function works fine if your new `key` is of the same type as your original `key`; however, the `useLocalStorage` hook does not currently support switching keys if the new value is of a different type. Please file an issue if you'd like to contribute this enhancement!

## Using a Different Serializer and/or Parser

the `useLocalStorage` hook takes an optional third `options` argument. This allows you to configure a custom serializer and/or parser if you need to use something other than `JSON.stringify` and `JSON.parse`.

```javascript
const options = {
  serializer: (obj) => {
    /* Serialize logic */
    return someString;
  },
  parser: (str) => {
    /* Parse logic */
    return parsedObject;
  },
};

const [data, setData] = useLocalStorage("data", { foo: "bar" }, options);
```

# Logo Attribution

<div>Map icon in logo made by <a href="https://www.flaticon.com/authors/vectors-market" title="Vectors Market">Vectors Market</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
