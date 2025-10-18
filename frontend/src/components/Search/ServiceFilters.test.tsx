import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ServiceFilters from "./ServiceFilters";

describe("ServiceFilters", () => {
    const mockServices = ["dog_walking", "sitting", "grooming"];
    const mockSetSelectedService = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders all service buttons", () => {
        const { getByText } = render(
            <ServiceFilters
                services={mockServices}
                selectedService={null}
                setSelectedService={mockSetSelectedService}
            />
        );

        mockServices.forEach((service) => {
            expect(getByText(service)).toBeTruthy();
        });
    });

    it("calls setSelectedService with correct service when pressed", () => {
        const { getByText } = render(
            <ServiceFilters
                services={mockServices}
                selectedService={null}
                setSelectedService={mockSetSelectedService}
            />
        );

        fireEvent.press(getByText("dog_walking"));
        expect(mockSetSelectedService).toHaveBeenCalledWith("dog_walking");
    });

    it("deselects service when pressing the same one again", () => {
        const { getByText } = render(
            <ServiceFilters
                services={mockServices}
                selectedService="dog_walking"
                setSelectedService={mockSetSelectedService}
            />
        );

        fireEvent.press(getByText("dog_walking"));
        expect(mockSetSelectedService).toHaveBeenCalledWith(null);
    });
});
