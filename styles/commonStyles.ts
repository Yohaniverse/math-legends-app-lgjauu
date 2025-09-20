
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#4FC3F7',      // Light Blue - main theme
  secondary: '#1976D2',    // Dark Blue - text and accents
  accent: '#FFD54F',       // Yellow - highlights and rewards
  success: '#66BB6A',      // Green - correct answers
  background: '#F8F9FA',   // Light background
  backgroundAlt: '#FFFFFF', // White cards/containers
  text: '#1976D2',         // Dark blue text
  textLight: '#757575',    // Light gray text
  card: '#FFFFFF',         // White cards
  shadow: 'rgba(0, 0, 0, 0.1)',
  error: '#EF5350',        // Red for incorrect answers
  warning: '#FF9800',      // Orange for warnings
};

export const fonts = {
  regular: 'Nunito_400Regular',
  medium: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 8px ${colors.shadow}`,
    elevation: 4,
  },
  secondary: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 8px ${colors.shadow}`,
    elevation: 4,
  },
  success: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 8px ${colors.shadow}`,
    elevation: 4,
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: fonts.medium,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  textLight: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.backgroundAlt,
  },
  buttonTextDark: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.text,
  },
});
