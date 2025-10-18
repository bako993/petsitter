import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AppDropdown from "./AppDropdown";

jest.mock("react-native-dropdown-picker", () => {
    const React = require("react");
    const { View, Text } = require("react-native");

    return ({ value, items, placeholder, disabled, setValue }: any) => (
        <View testID="dropdown">
            <Text testID="value">{value || placeholder}</Text>
            {!disabled && (
                <Text
                    testID="first-item"
                    onPress={() => setValue(() => items[0].value)}
                >
                    {items[0].label}
                </Text>
            )}
        </View>
    );
});

describe("AppDropdown", () => {
    const mockItems = [
        { label: "Option A", value: "a" },
        { label: "Option B", value: "b" },
    ];
    const mockOnChange = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    it("renders label and placeholder text", () => {
        const { getByText } = render(
            <AppDropdown
                label="Select Category"
                items={mockItems}
                value=""
                onChange={mockOnChange}
            />
        );

        expect(getByText("Select Category")).toBeTruthy();
        expect(getByText("Select an option")).toBeTruthy();
    });

    it("calls onChange when selecting an item", () => {
        const { getByTestId } = render(
            <AppDropdown items={mockItems} value="" onChange={mockOnChange} />
        );

        fireEvent.press(getByTestId("first-item"));
        expect(mockOnChange).toHaveBeenCalledWith("a");
    });

    it("does not render selectable item when disabled", () => {
        const { queryByTestId } = render(
            <AppDropdown
                items={mockItems}
                value=""
                onChange={mockOnChange}
                disabled
            />
        );

        expect(queryByTestId("first-item")).toBeNull();
    });
});
