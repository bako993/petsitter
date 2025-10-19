import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { OfferingsSection } from "./OfferingsSection";

jest.mock("@expo/vector-icons", () => ({
    Ionicons: "Ionicons",
}));

describe("OfferingsSection", () => {
    const mockOfferings = [
        { id: 1, offering_type: "Walking", price: 10, duration: "30 min", conditions: "Small dogs only" },
        { id: 2, offering_type: "Feeding", price: 5, duration: "15 min" },
    ];

    it("renders all offerings", () => {
        const { getByText } = render(<OfferingsSection offerings={mockOfferings} />);
        expect(getByText("Services")).toBeTruthy();
        expect(getByText("Walking")).toBeTruthy();
        expect(getByText("Feeding")).toBeTruthy();
    });

    it("shows hint text when there are offerings", () => {
        const { getByText } = render(<OfferingsSection offerings={mockOfferings} />);
        expect(getByText("Tap a service for more details")).toBeTruthy();
    });

    it("renders 'No services offered' when offerings is empty", () => {
        const { getByText, queryByText } = render(<OfferingsSection offerings={[]} />);
        expect(getByText("No services offered")).toBeTruthy();
        expect(queryByText("Tap a service for more details")).toBeNull();
    });

    it("shows details when a service is pressed", () => {
        const { getByText } = render(<OfferingsSection offerings={mockOfferings} />);
        fireEvent.press(getByText("Walking"));
        expect(getByText("Price: $10")).toBeTruthy();
        expect(getByText("Duration: 30 min")).toBeTruthy();
        expect(getByText("Conditions: Small dogs only")).toBeTruthy();
    });

});
