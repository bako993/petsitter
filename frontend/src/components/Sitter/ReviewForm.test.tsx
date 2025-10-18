import React from "react";
import { render } from "@testing-library/react-native";
import { ReviewCard } from "./ReviewCard";

jest.mock("@expo/vector-icons", () => ({
    Ionicons: "Ionicons",
}));

describe("ReviewCard", () => {
    it("renders username, rating stars, and comment", () => {
        const { getByText } = render(
            <ReviewCard userName="Alice" rating={4} comment="Great service!" />
        );

        expect(getByText("Alice")).toBeTruthy();
        expect(getByText("Great service!")).toBeTruthy();
    });

    it("shows 'Unknown User' when no username is provided", () => {
        const { getByText } = render(<ReviewCard rating={5} comment="Perfect!" />);
        expect(getByText("Unknown User")).toBeTruthy();
    });
});
