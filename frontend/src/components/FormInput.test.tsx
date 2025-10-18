import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FormInput } from "./FormInput";

describe("FormInput", () => {
    const mockOnChange = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    it("renders label and placeholder correctly", () => {
        const { getByText, getByPlaceholderText } = render(
            <FormInput
                label="Name"
                value=""
                onChange={mockOnChange}
                placeholder="Enter your name"
            />
        );

        expect(getByText("Name")).toBeTruthy();
        expect(getByPlaceholderText("Enter your name")).toBeTruthy();
    });

    it("calls onChange when typing", () => {
        const { getByPlaceholderText } = render(
            <FormInput label="Name" value="" onChange={mockOnChange} placeholder="Enter name" />
        );

        const input = getByPlaceholderText("Enter name");
        fireEvent.changeText(input, "Alice");

        expect(mockOnChange).toHaveBeenCalledWith("Alice");
    });

    it("sets multiline=true for specific labels", () => {
        const { getByPlaceholderText } = render(
            <FormInput label="Bio" value="" onChange={mockOnChange} placeholder="Your bio" />
        );

        const input = getByPlaceholderText("Your bio");
        expect(input.props.multiline).toBe(true);
    });

    it("sets multiline=false for other labels", () => {
        const { getByPlaceholderText } = render(
            <FormInput label="Name" value="" onChange={mockOnChange} placeholder="Enter name" />
        );

        const input = getByPlaceholderText("Enter name");
        expect(input.props.multiline).toBe(false);
    });

    it("applies the correct keyboardType", () => {
        const { getByPlaceholderText } = render(
            <FormInput label="Email" value="" onChange={mockOnChange} keyboardType="email-address" />
        );

        const input = getByPlaceholderText("");
        expect(input.props.keyboardType).toBe("email-address");
    });
});
