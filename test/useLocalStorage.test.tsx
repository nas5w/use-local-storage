import React from "react";
import {
  fireEvent,
  getByRole,
  getByText,
  render,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import useLocalStorage from "../index";

function SimpleComponent() {
  const [data, setData] = useLocalStorage("username", "John Doe");
  return (
    <>
      <p>{data}</p>
      <button
        onClick={() => {
          setData("Burt");
        }}
      >
        Change Username
      </button>
    </>
  );
}

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it("sets localStorage based on default value", () => {
    const { container } = render(<SimpleComponent />);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      "username",
      JSON.stringify("John Doe")
    );
    expect(container.querySelector("p")).toHaveTextContent("John Doe");
  });
  it("gets localStorage value instead of default", () => {
    localStorage.setItem("username", JSON.stringify("Daffodil"));
    const { container } = render(<SimpleComponent />);
    expect(container.querySelector("p")).toHaveTextContent("Daffodil");
  });
  it("changes localstorage and state value", () => {
    localStorage.setItem("username", JSON.stringify("Daffodil"));
    const { container } = render(<SimpleComponent />);
    fireEvent.click(container.querySelector("button")!);
    expect(container.querySelector("p")).toHaveTextContent("Burt");
    expect(localStorage.__STORE__.username).toBe(JSON.stringify("Burt"));
  });
});
