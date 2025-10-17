import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@/src/theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { ICONS } from '@/src/constants/icons';

type ProgressIndicatorProps = {
    steps: string[];
    currentStep: number;
};

export default function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
    return (
        <View style={styles.wrapper}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                    <React.Fragment key={index}>
                        <View style={styles.stepBlock}>
                            <View
                                style={[
                                    styles.circle,
                                    isCompleted && styles.completedCircle,
                                    isCurrent && styles.currentCircle,
                                ]}
                            >
                                {isCompleted ? (
                                    <Ionicons
                                        name={ICONS.checkMark}
                                        size={Theme.FONTS.sizes.body}
                                        color={Theme.COLORS.success}
                                    />
                                ) : (
                                    <Text style={isCurrent ? styles.currentText : styles.stepNumber}>
                                        {index + 1}
                                    </Text>
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.label,
                                    isCurrent && styles.currentLabel,
                                    isCompleted && styles.completedLabel,
                                ]}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {step}
                            </Text>
                        </View>

                        {index < steps.length - 1 && (
                            <Ionicons
                                name="arrow-forward"
                                size={Theme.FONTS.sizes.subtitle}
                                color={isCompleted ? Theme.COLORS.success : Theme.COLORS.textSecondary}
                                style={styles.arrow}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Theme.COLORS.card,
        borderRadius: 12,
        marginVertical: Theme.SPACING.section,
        marginHorizontal: Theme.SPACING.page,
        paddingVertical: Theme.SPACING.card,
        paddingHorizontal: Theme.SPACING.section,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Theme.SHADOWS.default,
    },
    stepBlock: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: Theme.COLORS.textSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.COLORS.background,
    },
    completedCircle: {
        borderColor: Theme.COLORS.success,
    },
    currentCircle: {
        borderColor: Theme.COLORS.primary,
    },
    stepNumber: {
        color: Theme.COLORS.textSecondary,
        fontSize: Theme.FONTS.sizes.body,
        fontWeight: Theme.FONTS.weights.bold,
    },
    currentText: {
        color: Theme.COLORS.primary,
        fontWeight: Theme.FONTS.weights.bold,
    },
    label: {
        marginLeft: 6,
        fontSize: Theme.FONTS.sizes.small,
        color: Theme.COLORS.textSecondary,
        textAlign: 'center',
    },
    currentLabel: {
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.primary,
    },
    completedLabel: {
        color: Theme.COLORS.success,
    },
    arrow: {
        marginHorizontal: 4,
        alignSelf: 'center',
    },
});
