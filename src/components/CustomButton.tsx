import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../theme';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  style,
  disabled,
  ...rest
}) => {
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  const buttonStyle = [
    styles.button,
    isSecondary && styles.buttonSecondary,
    isOutline && styles.buttonOutline,
    (disabled || loading) && styles.buttonDisabled,
    style,
  ];

  const textStyle = [
    styles.text,
    isSecondary && styles.textSecondary,
    isOutline && styles.textOutline,
    disabled && styles.textDisabled,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={buttonStyle}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isOutline ? Colors.primary : '#FFFFFF'}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: Spacing.sm,
  },
  buttonSecondary: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    ...Typography.button,
    color: '#FFFFFF',
  },
  textSecondary: {
    color: Colors.text,
  },
  textOutline: {
    color: Colors.primary,
  },
  textDisabled: {
    color: Colors.textSecondary,
  },
});
