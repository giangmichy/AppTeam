import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../navigation/AppNavigator';

const { height } = Dimensions.get('window');

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const route = useRoute();
  const { email, otpCode } = route.params as { email: string; otpCode: string };
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Thành công', 
        'Mật khẩu đã được thay đổi thành công!',
        [
          {
            text: 'Đăng nhập ngay',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: COLORS.gray300 };
    if (password.length < 6) return { strength: 1, text: 'Yếu', color: COLORS.danger };
    if (password.length < 8) return { strength: 2, text: 'Trung bình', color: COLORS.warning };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, text: 'Mạnh', color: COLORS.success };
    }
    return { strength: 2, text: 'Trung bình', color: COLORS.warning };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Background with subtle gradient */}
      <LinearGradient
        colors={[COLORS.background, '#F1F5F9']}
        style={styles.backgroundGradient}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Circular Image */}
          <View style={styles.imageContainer}>
            <View style={styles.imageCircle}>
              <LinearGradient
                colors={[COLORS.success, '#059669']}
                style={styles.imageGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="key-outline" size={48} color={COLORS.white} />
              </LinearGradient>
            </View>
          </View>

          {/* Title and Subtitle */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>ĐẶT LẠI MẬT KHẨU</Text>
            <Text style={styles.subtitle}>
              Tạo mật khẩu mới cho tài khoản của bạn
            </Text>
          </View>

          {/* Form Container */}
          <View style={styles.formCard}>
            <CustomInput
              label="Mật khẩu mới"
              value={formData.newPassword}
              onChangeText={(value) => handleInputChange('newPassword', value)}
              placeholder="Nhập mật khẩu mới"
              secureTextEntry
              error={errors.newPassword}
              style={styles.inputContainer}
            />

            {/* Password Strength Indicator */}
            {formData.newPassword.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  <View 
                    style={[
                      styles.strengthFill, 
                      { 
                        width: `${(passwordStrength.strength / 3) * 100}%`,
                        backgroundColor: passwordStrength.color 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                  {passwordStrength.text}
                </Text>
              </View>
            )}

            <CustomInput
              label="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Nhập lại mật khẩu mới"
              secureTextEntry
              error={errors.confirmPassword}
              style={styles.inputContainer}
            />

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={formData.newPassword.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={formData.newPassword.length >= 6 ? COLORS.success : COLORS.gray400} 
                />
                <Text style={[
                  styles.requirementText,
                  formData.newPassword.length >= 6 && styles.requirementMet
                ]}>
                  Ít nhất 6 ký tự
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={/[A-Z]/.test(formData.newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={/[A-Z]/.test(formData.newPassword) ? COLORS.success : COLORS.gray400} 
                />
                <Text style={[
                  styles.requirementText,
                  /[A-Z]/.test(formData.newPassword) && styles.requirementMet
                ]}>
                  Chứa chữ hoa
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={/[0-9]/.test(formData.newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={/[0-9]/.test(formData.newPassword) ? COLORS.success : COLORS.gray400} 
                />
                <Text style={[
                  styles.requirementText,
                  /[0-9]/.test(formData.newPassword) && styles.requirementMet
                ]}>
                  Chứa số
                </Text>
              </View>
            </View>

            <CustomButton
              title="XÁC NHẬN"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />

            <CustomButton
              title="QUAY LẠI"
              onPress={goBack}
              variant="outline"
              style={([styles.backButton, {backgroundColor: '#fff', shadowColor: 'transparent', elevation: 0}] as any)}
              textStyle={([styles.backButtonText, {color: COLORS.primary}] as any)}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  strengthContainer: {
    marginBottom: 20,
    marginTop: -8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  requirementsContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  requirementMet: {
    color: COLORS.success,
  },
  submitButton: {
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 16,
  },
  backButton: {
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  backButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  imageGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ResetPasswordScreen;