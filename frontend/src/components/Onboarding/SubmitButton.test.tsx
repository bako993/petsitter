import { render, fireEvent } from "@testing-library/react-native";
import SubmitButton from "./SubmitButton";

describe("SubmitButton", () => {
    it("renders with default title", () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<SubmitButton onPress={mockOnPress} />);

        expect(getByText("Next")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<SubmitButton onPress={mockOnPress} />);
        fireEvent.press(getByText("Next"));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("renders loading indicator when loading", () => {
        const mockOnPress = jest.fn();
        const { queryByText } = render(
            <SubmitButton onPress={mockOnPress} loading />
        );

        expect(queryByText("Next")).toBeNull();
    });

    it("does not call onPress when disabled", () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(
            <SubmitButton onPress={mockOnPress} disabled />
        );

        const buttonText = getByText("Next");
        fireEvent.press(buttonText);
        expect(mockOnPress).not.toHaveBeenCalled();
    });

    it("calls onPress when enabled", () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<SubmitButton onPress={mockOnPress} />);

        fireEvent.press(getByText("Next"));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

});

