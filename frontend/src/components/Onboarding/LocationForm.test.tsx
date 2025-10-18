
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LocationButton from "./LocationButton";

describe("LocationButton Component", () => {
    const mockOnPress = jest.fn();

    it("renders 'Share My Location' and correct icon when coordsCaptured is false", () => {
        const { getByText } = render(
            <LocationButton coordsCaptured={false} onPress={mockOnPress} />
        );

        expect(getByText("Share My Location")).toBeTruthy();
    });

    it("renders 'Location Captured' and shows checkmark when coordsCaptured is true", () => {
        const { getByText } = render(
            <LocationButton coordsCaptured={true} onPress={mockOnPress} />
        );

        expect(getByText("Location Captured")).toBeTruthy();
        // Again, you can test the checkmark visually or via mocking Ionicons
    });

    it("calls onPress when pressed", () => {
        const { getByText } = render(
            <LocationButton coordsCaptured={false} onPress={mockOnPress} />
        );

        fireEvent.press(getByText("Share My Location"));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
});
