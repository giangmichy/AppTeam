import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

type CustomInputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const containerStyle: ViewStyle = {
    marginBottom: 20,
    ...style,
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: multiline ? "flex-start" : "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: error
      ? COLORS.danger
      : isFocused
      ? COLORS.primary
      : COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: multiline ? 12 : 0,
    minHeight: multiline ? undefined : 56,
    shadowColor: error ? COLORS.danger : isFocused ? COLORS.primary : "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isFocused ? 0.1 : 0.05,
    shadowRadius: isFocused ? 8 : 4,
    elevation: isFocused ? 4 : 2,
  };

  const labelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 4,
  };

  const textInputStyle: TextStyle = {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: multiline ? 0 : 16,
    textAlignVertical: multiline ? "top" : "center",
    fontWeight: "500",
    ...inputStyle,
  };

  const errorStyle: TextStyle = {
    fontSize: 13,
    color: COLORS.danger,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  };

  const iconStyle = {
    marginRight: leftIcon ? 12 : 0,
    marginLeft: rightIcon && !secureTextEntry ? 12 : 0,
  };

  const animatedBorderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <Animated.View
        style={[
          inputContainerStyle,
          !error && { borderColor: animatedBorderColor },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={22}
            color={
              error
                ? COLORS.danger
                : isFocused
                ? COLORS.primary
                : COLORS.gray400
            }
            style={iconStyle}
          />
        )}
        <TextInput
          style={textInputStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray400}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={COLORS.primary}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={iconStyle}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={COLORS.gray400}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightIconPress} style={iconStyle}>
            <Ionicons
              name={rightIcon}
              size={22}
              color={
                error
                  ? COLORS.danger
                  : isFocused
                  ? COLORS.primary
                  : COLORS.gray400
              }
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};

export default CustomInput;
