import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Theme } from '@/src/theme/theme';

type LoadingProps = {
  message?: string;
  style?: object;
  fullScreen?: boolean;
};

export const Loading: React.FC<LoadingProps> = ({ message, style, fullScreen = false }) => {
  return (
    <View style={[fullScreen ? styles.fullScreenContainer : styles.overlayContainer, style]}>
      <ActivityIndicator size="large" color={Theme.COLORS.primary} />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.COLORS.background,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.COLORS.overlayBackground,
    zIndex: 999,
  },
  text: {
    marginTop: 10,
    color: Theme.COLORS.text,
  },
});
