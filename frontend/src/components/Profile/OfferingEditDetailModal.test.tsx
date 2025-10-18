import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OfferingEditDetailModal from "./OfferingEditDetailModal";

jest.mock("@/src/components/BaseEditModal", () => {
    return ({ children, onSave, onClose, visible }: any) => {
        if (!visible) return null;
        const RN = require("react-native");
        return (
            <RN.View>
                {children}
                <RN.TouchableOpacity testID="save-button" onPress={onSave} />
                <RN.TouchableOpacity testID="close-button" onPress={onClose} />
            </RN.View>
        );
    };
});

jest.mock("@/src/components/AppDropdown", () => {
    return ({ value, onChange, testID }: any) => {
        const RN = require("react-native");
        return <RN.TextInput testID={testID || "dropdown"} value={value} onChangeText={onChange} />;
    };
});

describe("OfferingEditDetailModal", () => {
    const mockOnClose = jest.fn();
    const mockOnSaved = jest.fn();

    const testOffering = {
        id: 1,
        profile_id: 101,
        offering_type: "Dog Walking",
        price: 20,
        duration: 30,
        conditions: ["Friendly with dogs"],
    };

    it("renders inputs with initial values", () => {
        const { getByPlaceholderText } = render(
            <OfferingEditDetailModal
                visible
                offering={testOffering}
                onClose={mockOnClose}
                onOfferingSaved={mockOnSaved}
            />
        );

        expect(getByPlaceholderText("Price").props.value).toBe("20");
        expect(getByPlaceholderText("Duration").props.value).toBe("30");
        expect(getByPlaceholderText("Conditions").props.value).toBe("Friendly with dogs");
    });

    it("calls onOfferingSaved and onClose when save is pressed", () => {
        const { getByTestId } = render(
            <OfferingEditDetailModal
                visible
                offering={testOffering}
                onClose={mockOnClose}
                onOfferingSaved={mockOnSaved}
            />
        );

        fireEvent.press(getByTestId("save-button"));

        expect(mockOnSaved).toHaveBeenCalledWith({
            offering_type: "Dog Walking",
            price: 20,
            duration: 30,
            conditions: ["Friendly with dogs"],
        });
        expect(mockOnClose).toHaveBeenCalled();
    });

    it("calls onClose when close button is pressed", () => {
        const { getByTestId } = render(
            <OfferingEditDetailModal
                visible
                offering={testOffering}
                onClose={mockOnClose}
                onOfferingSaved={mockOnSaved}
            />
        );

        fireEvent.press(getByTestId("close-button"));
        expect(mockOnClose).toHaveBeenCalled();
    });
});
