import { StyleSheet } from 'react-native';
import { Theme } from '@/src/theme/theme';

export const authStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: Theme.SPACING.page },
  label: { marginBottom: 5, color: Theme.COLORS.text, fontWeight: Theme.FONTS.weights.semiBold },
  input: {
    borderWidth: 1,
    borderColor: Theme.COLORS.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: Theme.SPACING.section,
    fontSize: Theme.FONTS.sizes.body,
  },
  button: {
    backgroundColor: Theme.COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: Theme.SPACING.section,
    ...Theme.SHADOWS.default,
  },
  buttonText: {
    color: Theme.COLORS.background,
    fontSize: Theme.FONTS.sizes.body,
    fontWeight: Theme.FONTS.weights.bold,
  },
  linkText: {
    color: Theme.COLORS.primary,
    fontSize: Theme.FONTS.sizes.body,
    fontWeight: Theme.FONTS.weights.semiBold,
    textAlign: 'center',
    marginTop: Theme.SPACING.section,
  },
});
