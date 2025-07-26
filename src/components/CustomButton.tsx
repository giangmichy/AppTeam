import React from "react";
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../constants/colors";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "small" | "medium" | "large";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    };

    // Size styles
    const sizeStyles: { [key in ButtonSize]: ViewStyle } = {
      small: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 },
      medium: { paddingHorizontal: 24, paddingVertical: 12, minHeight: 48 },
      large: { paddingHorizontal: 32, paddingVertical: 16, minHeight: 56 },
    };

    // Variant styles
    const variantStyles: { [key in ButtonVariant]: ViewStyle } = {
      primary: {
        backgroundColor: disabled ? COLORS.gray300 : COLORS.primary,
      },
      secondary: {
        backgroundColor: disabled ? COLORS.gray200 : COLORS.accent,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: disabled ? COLORS.gray300 : COLORS.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: "600",
      textAlign: "center",
    };

    // Size text styles
    const sizeTextStyles: { [key in ButtonSize]: TextStyle } = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    // Variant text styles
    const variantTextStyles: { [key in ButtonVariant]: TextStyle } = {
      primary: { color: COLORS.white },
      secondary: { color: COLORS.white },
      outline: { color: disabled ? COLORS.gray400 : COLORS.primary },
    };

    return {
      ...baseStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? COLORS.primary : COLORS.white}
          style={{ marginRight: 8 }}
        />
      )}
      {icon && !loading && <>{icon}</>}
      <Text
        style={[
          getTextStyle(),
          textStyle,
          icon && !loading ? { marginLeft: 8 } : undefined,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
