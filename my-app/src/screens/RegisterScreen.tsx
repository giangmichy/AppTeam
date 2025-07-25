import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

// COLORS constant
const COLORS = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#8B5CF6',
  accent: '#A855F7',
  gradientStart: '#667EEA',
  gradientEnd: '#764BA2',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  inputBackground: '#F1F5F9',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  white: '#FFFFFF',
  black: '#000000',
};

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

const { height } = Dimensions.get('window');

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (!agreeToTerms) {
      newErrors.terms = 'Bạn phải đồng ý với điều khoản sử dụng';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigation.navigate('Login');
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Compact Header with Gradient - No duplicate back arrow */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logoContainer}>
          <Ionicons name="person-add-outline" size={28} color={COLORS.white} />
        </View>
        <Text style={styles.welcomeText}>Tạo tài khoản mới</Text>
        <Text style={styles.subtitle}>Tham gia cộng đồng học tập</Text>
      </LinearGradient>
      
      {/* Form */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <CustomInput
            label="Họ và tên"
            value={formData.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
            placeholder="Nhập họ và tên của bạn"
            leftIcon="person-outline"
            error={errors.fullName}
          />
          <CustomInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Nhập email của bạn"
            keyboardType="email-address"
            leftIcon="mail-outline"
            error={errors.email}
          />
          <CustomInput
            label="Mật khẩu"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholder="Nhập mật khẩu"
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.password}
          />
          <CustomInput
            label="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            placeholder="Nhập lại mật khẩu"
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.confirmPassword}
          />
          
          {/* Terms and Conditions */}
          <TouchableOpacity 
            style={styles.termsContainer}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
              {agreeToTerms && (
                <Ionicons name="checkmark" size={14} color={COLORS.white} />
              )}
            </View>
            <Text style={styles.termsText}>
              Tôi đồng ý với{' '}
              <Text style={styles.termsLink}>Điều khoản sử dụng</Text>
              {' '}và{' '}
              <Text style={styles.termsLink}>Chính sách bảo mật</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms && (
            <Text style={styles.errorText}>{errors.terms}</Text>
          )}
          
          <CustomButton
            title="Đăng ký"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />
          
          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.divider} />
          </View>
          
          {/* Google Register */}
          <CustomButton
            title="Đăng ký với Google"
            onPress={() => {}}
            variant="outline"
            style={([styles.googleButton, {paddingVertical: 8, borderRadius: 24, borderWidth: 2, borderColor: COLORS.primary, backgroundColor: '#fff'}] as any)}
            icon={
              <Image source={require('../../assets/images/LogoGoogle.jpg')} style={{width: 20, height: 20, marginRight: 4}} resizeMode="cover" />
            }
            textStyle={{fontWeight: '700', color: COLORS.primary}}
          />
          
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.footerLink}>Đăng nhập ngay</Text>
            </TouchableOpacity>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    minHeight: height * 0.18,
    justifyContent: 'center',
  },
  // Remove unused backButton style
  // backButton: { ... },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: '500',
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginHorizontal: 16,
    fontWeight: '500',
  },
  googleButton: {
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  googleIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleG: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4285F4',
    fontFamily: 'Roboto',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    marginTop: 8,
  },
  footerText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  footerLink: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default RegisterScreen;