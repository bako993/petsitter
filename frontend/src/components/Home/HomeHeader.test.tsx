import React from "react";
import { render } from "@testing-library/react-native";
import HomeHeader from "./HomeHeader";
import { useUsers } from "@/src/hooks/useUsers";

jest.mock("@/src/hooks/useUsers");
jest.mock("@/src/components/Logo", () => {
    return () => null;
});

describe("HomeHeader Component", () => {
    const mockLoadStoredUser = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly with user", () => {
        (useUsers as jest.Mock).mockReturnValue({
            user: { name: "Bako" },
            loadStoredUser: mockLoadStoredUser,
        });

        const { getByText } = render(<HomeHeader />);
        expect(getByText("Welcome Bako!")).toBeTruthy();
        expect(getByText(/Connect with trusted, local pet sitters/i)).toBeTruthy();
        expect(mockLoadStoredUser).toHaveBeenCalledTimes(1);
    });
});
