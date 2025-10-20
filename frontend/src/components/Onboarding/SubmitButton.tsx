import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Theme } from '@/src/theme/theme';

type Props = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
};

export default function SubmitButton({
  onPress,
  loading = false,
  disabled = false,
  title = 'Next',
}: Props) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: disabled ? Theme.COLORS.card : Theme.COLORS.primary,
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 16,
        alignItems: 'center',
      }}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Theme.COLORS.background} />
      ) : (
        <Text
          style={{
            color: Theme.COLORS.background,
            fontSize: Theme.FONTS.sizes.body,
            fontWeight: Theme.FONTS.weights.bold,
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
