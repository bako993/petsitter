import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";
import AuthGate from "./AuthGate";
import * as SecureStore from "expo-secure-store";
import { Loading } from "@/src/components/Loading";

jest.mock("expo-secure-store");

jest.mock("@/src/components/Loading", () => {
    const React = require("react");
    const { Text } = require("react-native");
    return {
        Loading: () => <Text>Loading...</Text>,
    };
});


const mockGetItemAsync = SecureStore.getItemAsync as jest.Mock;

describe("AuthGate", () => {
    beforeEach(() => jest.clearAllMocks());

    it("renders Loading component while checking auth", () => {
        mockGetItemAsync.mockImplementation(() => new Promise(() => {})); // never resolves

        const { getByText } = render(<AuthGate>{() => <></>}</AuthGate>);
        expect(getByText("Loading...")).toBeTruthy();
    });

    it("renders children with isLoggedIn=true when token exists", async () => {
        mockGetItemAsync.mockResolvedValue("mock-token");

        const { getByText } = render(
            <AuthGate>
                {(isLoggedIn) =>
                    isLoggedIn ? <Text>Welcome</Text> : <Text>Please Login</Text>
                }
            </AuthGate>
        );

        await waitFor(() => {
            expect(getByText("Welcome")).toBeTruthy();
        });
    });

    it("renders children with isLoggedIn=false when no token", async () => {
        mockGetItemAsync.mockResolvedValue(null);

        const { getByText } = render(
            <AuthGate>
                {(isLoggedIn) =>
                    isLoggedIn ? <Text>Welcome</Text> : <Text>Please Login</Text>
                }
            </AuthGate>
        );

        await waitFor(() => {
            expect(getByText("Please Login")).toBeTruthy();
        });
    });

    it("handles errors gracefully and sets loading=false", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        mockGetItemAsync.mockRejectedValue(new Error("Storage error"));

        const { getByText } = render(
            <AuthGate>
                {(isLoggedIn) =>
                    isLoggedIn ? <Text>Welcome</Text> : <Text>Please Login</Text>
                }
            </AuthGate>
        );

        await waitFor(() => {
            expect(getByText("Please Login")).toBeTruthy();
        });

        consoleErrorSpy.mockRestore();
    });
});
