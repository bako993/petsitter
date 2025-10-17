import React from 'react';
import {View, ScrollView, ViewProps, RefreshControl} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Theme} from "@/src/theme/theme";

type ScreenWrapperProps = {
    children: React.ReactNode;
    scrollable?: boolean;
    onRefresh?: () => Promise<void> | void;
    refreshing?: boolean;
} & ViewProps;

export default function ScreenWrapper({
                                          children,
                                          scrollable = true,
                                          style,
                                          onRefresh,
                                          refreshing = false,
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
            <ScrollView
                contentContainerStyle={containerStyle}
                refreshControl={
                    onRefresh ? (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[Theme.COLORS.primary]}
                            tintColor={Theme.COLORS.primary}
                        />
                    ) : undefined
                }
                alwaysBounceVertical
                overScrollMode="always"
                {...props}
            >
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
