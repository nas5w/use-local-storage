import React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import useLocalStorage from "../index";

function TestComponent() {
  const [data, setData] = useLocalStorage("username", "John Doe");
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
        id="set-data-callback"
        onClick={() => {
          setData((data) => data + "foo");
        }}
      >
        Change Username
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

function WithCustomSerializer() {
  const [data] = useLocalStorage("username", "John Doe", {
    serializer: (val) => JSON.stringify(val + "char"),
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

function WithBadSerializer() {
  const [data] = useLocalStorage("username", "John Doe", {
    serializer: () => {
      return JSON.parse((undefined as unknown) as string);
    },
  });
  return <p>{data}</p>;
}

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, "error");
    jest.spyOn(console, "log");
    // @ts-ignore jest.spyOn adds this functionallity
    console.log.mockImplementation(() => null);
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.log.mockRestore();
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore();
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
  it("changes localstorage and state value using callback", () => {
    localStorage.setItem("username", JSON.stringify("Daffodil"));
    const { container } = render(<TestComponent />);
    fireEvent.click(container.querySelector("#set-data-callback")!);
    expect(container.querySelector("p")).toHaveTextContent("Daffodilfoo");
    expect(localStorage.__STORE__.username).toBe(JSON.stringify("Daffodilfoo"));
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
  it("handles malformed local storage data", () => {
    localStorage.setItem("username", JSON.stringify("some data"));
    const { container } = render(<WithBadParser />);
    expect(console.log).toBeCalled();
    expect(container.querySelector("p")).toHaveTextContent("John Doe");
  });
  it("handles bad serializer", () => {
    const { container } = render(<WithBadSerializer />);
    expect(console.log).toBeCalled();
  });
});
