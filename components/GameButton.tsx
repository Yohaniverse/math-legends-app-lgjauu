
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, fonts } from '../styles/commonStyles';

interface GameButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'answer';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
}

const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  size = 'medium',
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'success':
        baseStyle.push(styles.success);
        break;
      case 'answer':
        baseStyle.push(styles.answer);
        break;
      default:
        baseStyle.push(styles.primary);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'answer') {
      baseStyle.push(styles.answerText);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    boxShadow: `0px 4px 8px ${colors.shadow}`,
    elevation: 4,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  medium: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.accent,
  },
  success: {
    backgroundColor: colors.success,
  },
  answer: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
  },
  text: {
    fontFamily: fonts.medium,
    color: colors.backgroundAlt,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 18,
  },
  largeText: {
    fontSize: 22,
  },
  answerText: {
    color: colors.text,
  },
});

export default GameButton;
