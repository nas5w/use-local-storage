import React from "react";
import { render } from '@testing-library/react'
import useLocalStorage from "../index";

function SimpleComponent() {
    const [data] = useLocalStorage("username", "John Doe");
    return <>{data}</>
}

describe("useLocalStorage", () => {
    beforeEach(() => {
        localStorage.clear();
    })

    it("sets localStorage based on default value", () => {
        render(<SimpleComponent />);
        expect(localStorage.getItem).toHaveBeenLastCalledWith("username")
        expect(localStorage.setItem).toHaveBeenLastCalledWith("username", JSON.stringify("John Doe"))
    })
})
