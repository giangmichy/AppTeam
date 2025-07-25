import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type InputFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
};

const InputField: React.FC<InputFieldProps> = ({ value, onChangeText, placeholder, style, inputStyle }) => (
  <TextInput
    style={[styles.input, inputStyle, style]}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    autoCapitalize="none"
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
});

export default InputField; 