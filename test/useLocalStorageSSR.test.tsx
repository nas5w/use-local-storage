/**
 * @jest-environment node
 */
import { renderHook } from "@testing-library/react-hooks/server";
import useLocalStorage from "..";

describe("ssr", () => {
  it("doesn't fail without the window object", () => {
    const { result } = renderHook(() => useLocalStorage("foo", "bar"));
    expect(result.error).toBe(undefined);
  });
});
