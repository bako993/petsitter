import React from "react";
import { render } from "@testing-library/react-native";
import { ScrollView, View, Text } from "react-native";
import ScreenWrapper from "./ScreenWrapper";

jest.mock("react-native-safe-area-context", () => ({
    useSafeAreaInsets: jest.fn(() => ({ top: 10, bottom: 10, left: 0, right: 0 })),
}));

describe("ScreenWrapper", () => {
    it("renders children", () => {
        const { getByText } = render(
            <ScreenWrapper>
                <Text>Hello</Text>
            </ScreenWrapper>
        );

        expect(getByText("Hello")).toBeTruthy();
    });

    it("renders a ScrollView when scrollable=true", () => {
        const { UNSAFE_getByType } = render(
            <ScreenWrapper>
                <Text>Scroll</Text>
            </ScreenWrapper>
        );

        const scrollView = UNSAFE_getByType(ScrollView);
        expect(scrollView).toBeDefined();
    });

    it("applies safe area padding", () => {
        const { UNSAFE_getByType } = render(
            <ScreenWrapper>
                <Text>Content</Text>
            </ScreenWrapper>
        );

        const scrollView = UNSAFE_getByType(ScrollView);

        const styleObj = Array.isArray(scrollView.props.contentContainerStyle)
            ? scrollView.props.contentContainerStyle[0]
            : scrollView.props.contentContainerStyle;

        expect(styleObj).toMatchObject({
            paddingTop: 10,
            paddingBottom: 10,
            paddingHorizontal: 20,
        });
    });


    it("renders RefreshControl when onRefresh is provided", () => {
        const onRefreshMock = jest.fn();
        const { UNSAFE_getByType } = render(
            <ScreenWrapper onRefresh={onRefreshMock}>
                <Text>Refreshable</Text>
            </ScreenWrapper>
        );

        const scrollView = UNSAFE_getByType(ScrollView);
        expect(scrollView.props.refreshControl).toBeDefined();
    });

    it("renders a View when scrollable=false", () => {
        const { UNSAFE_getByType } = render(
            <ScreenWrapper scrollable={false}>
                <Text>Static</Text>
            </ScreenWrapper>
        );

        const view = UNSAFE_getByType(View);
        expect(view).toBeDefined();
    });
});
