import React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import useLocalStorage from "../index";

function TestComponent() {
  const [data, setData, setKey] = useLocalStorage("username", "John Doe");
  return (
    <>
      <p>{data}</p>
      <button
        id="set-data"
        onClick={() => {
          setData("Burt");
        }}
      >
        Change Username
      </button>
      <button
        id="set-key"
        onClick={() => {
          setKey("password");
        }}
      >
        Change Key 1
      </button>
      <button
        id="set-key-2"
        onClick={() => {
          setKey("password", "foobar");
        }}
      >
        Change Key 2
      </button>
    </>
  );
}

function WithCustomParser() {
  const [data] = useLocalStorage("username", "John Doe", {
    parser: (val) => JSON.parse(val) + "kraw",
  });
  return <p>{data}</p>;
}

function WithBadParser() {
  const [data] = useLocalStorage("username", "John Doe", {
    parser: () => {
      return JSON.parse((undefined as unknown) as string);
    },
  });
  return <p>{data}</p>;
}

function WithCustomSerializer() {
  const [data] = useLocalStorage("username", "John Doe", {
    serializer: (val) => JSON.stringify(val + "char"),
  });
  return <p>{data}</p>;
}

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it("sets localStorage based on default value", () => {
    const { container } = render(<TestComponent />);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      "username",
      JSON.stringify("John Doe")
    );
    expect(container.querySelector("p")).toHaveTextContent("John Doe");
  });
  it("gets localStorage value instead of default", () => {
    localStorage.setItem("username", JSON.stringify("Daffodil"));
    const { container } = render(<TestComponent />);
    expect(container.querySelector("p")).toHaveTextContent("Daffodil");
  });
  it("changes localstorage and state value", () => {
    localStorage.setItem("username", JSON.stringify("Daffodil"));
    const { container } = render(<TestComponent />);
    fireEvent.click(container.querySelector("#set-data")!);
    expect(container.querySelector("p")).toHaveTextContent("Burt");
    expect(localStorage.__STORE__.username).toBe(JSON.stringify("Burt"));
  });
  it("changes key and uses default value", () => {
    const { container } = render(<TestComponent />);
    fireEvent.click(container.querySelector("#set-key")!);
    expect(container.querySelector("p")).toHaveTextContent("John Doe");
    expect(localStorage.__STORE__.password).toBe(JSON.stringify("John Doe"));
  });
  it("changes key and uses existing localstorage value", () => {
    localStorage.setItem("password", JSON.stringify("magoo"));
    const { container } = render(<TestComponent />);
    fireEvent.click(container.querySelector("#set-key")!);
    expect(container.querySelector("p")).toHaveTextContent("magoo");
    expect(localStorage.__STORE__.password).toBe(JSON.stringify("magoo"));
  });
  it("changes key and uses a new default value", () => {
    const { container } = render(<TestComponent />);
    fireEvent.click(container.querySelector("#set-key-2")!);
    expect(container.querySelector("p")).toHaveTextContent("foobar");
    expect(localStorage.__STORE__.password).toBe(JSON.stringify("foobar"));
  });
  it("changes key and uses localstorage over a new default value", () => {
    localStorage.setItem("password", JSON.stringify("magoo"));
    const { container } = render(<TestComponent />);
    fireEvent.click(container.querySelector("#set-key-2")!);
    expect(container.querySelector("p")).toHaveTextContent("magoo");
    expect(localStorage.__STORE__.password).toBe(JSON.stringify("magoo"));
  });
  it("sets new key state and doesn't alter old key state", () => {
    localStorage.setItem("username", JSON.stringify("johndoe85"));
    localStorage.setItem("password", JSON.stringify("magoo"));
    const { container } = render(<TestComponent />);
    fireEvent.click(container.querySelector("#set-key")!);
    fireEvent.click(container.querySelector("#set-data")!);
    expect(container.querySelector("p")).toHaveTextContent("Burt");
    expect(localStorage.__STORE__.username).toBe(JSON.stringify("johndoe85"));
    expect(localStorage.__STORE__.password).toBe(JSON.stringify("Burt"));
  });
  it("uses a custom parser", () => {
    localStorage.setItem("username", JSON.stringify("johndoe85"));
    const { container } = render(<WithCustomParser />);
    expect(container.querySelector("p")).toHaveTextContent("johndoe85kraw");
  });
  it("uses a custom serializer", () => {
    render(<WithCustomSerializer />);
    expect(localStorage.__STORE__.username).toBe(
      JSON.stringify("John Doechar")
    );
  });
  it("returns undefined on parse error", () => {
    localStorage.setItem("username", "haime2");
    const { container } = render(<WithBadParser />);
    expect(container.querySelector("p")).toHaveTextContent("");
  });
});
