import React from "react";
import { render } from "@testing-library/react-native";
import { Loading } from "./Loading";
import { ActivityIndicator } from "react-native";

describe("Loading component", () => {
    it("renders ActivityIndicator", () => {
        const { getByTestId } = render(<Loading />);

        const activityIndicators = render(<Loading />).UNSAFE_queryAllByType(ActivityIndicator);
        expect(activityIndicators.length).toBe(1);
    });

    it("displays the message if provided", () => {
        const { getByText } = render(<Loading message="Loading data..." />);
        expect(getByText("Loading data...")).toBeTruthy();
    });

    it("does not display message if not provided", () => {
        const { queryByText } = render(<Loading />);
        expect(queryByText(/./)).toBeNull();
    });
});
