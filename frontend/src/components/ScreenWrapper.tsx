import React from 'react';
import { View, ScrollView, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenWrapperProps = {
    children: React.ReactNode;
    scrollable?: boolean;
} & ViewProps;

export default function ScreenWrapper({
                                          children,
                                          scrollable = true,
                                          style,
                                          ...props
                                      }: ScreenWrapperProps) {
    const insets = useSafeAreaInsets();

    const containerStyle = [
        { paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingHorizontal: 20,
            flexGrow: 1,
        },
        style,
    ];

    if (scrollable) {
        return (
            <ScrollView contentContainerStyle={containerStyle} {...props}>
                {children}
            </ScrollView>
        );
    }

    return (
        <View style={[{ flex: 1 }, containerStyle]} {...props}>
            {children}
        </View>
    );
}
