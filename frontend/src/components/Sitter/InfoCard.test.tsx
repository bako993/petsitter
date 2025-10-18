import React from "react";
import { render } from "@testing-library/react-native";
import { InfoCard } from "./InfoCard";

describe("InfoCard", () => {
    it("renders title and content correctly", () => {
        const { getByText } = render(<InfoCard title="About Me" content="I love animals" />);

        expect(getByText("About Me")).toBeTruthy();
        expect(getByText("I love animals")).toBeTruthy();
    });
});
