import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { Theme } from '@/src/theme/theme';

type Props = {
    onRefresh: () => Promise<void> | void;
    refreshing?: boolean;
    children: React.ReactNode;
};

export default function PullToRefresh({ onRefresh, refreshing = false, children }: Props) {
    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[Theme.COLORS.primary]}
                    tintColor={Theme.COLORS.primary}
                />
            }
        >
            {children}
        </ScrollView>
    );
}
