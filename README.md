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

## Typescript Note

If you use `useLocalStorage` _without_ providing a default value, you should pass the type of your data as a generic:

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

# Logo Attribution

<div>Map icon in logo made by <a href="https://www.flaticon.com/authors/vectors-market" title="Vectors Market">Vectors Market</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
