import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/CustomButton';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../navigation/AppNavigator';

const { height } = Dimensions.get('window');

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTPVerification'>;

const OTPVerificationScreen = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute();
  const { email } = route.params as { email: string };
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 số mã xác thực');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Navigate to Reset Password screen
      navigation.navigate('ResetPassword', { email, otpCode });
    } catch (error) {
      console.error('Verify OTP error:', error);
      Alert.alert('Lỗi', 'Mã xác thực không đúng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      Alert.alert('Thành công', 'Mã xác thực mới đã được gửi đến email của bạn');
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Lỗi', 'Không thể gửi lại mã. Vui lòng thử lại sau.');
    }
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
      
      {/* Background with subtle gradient */}
      <LinearGradient
        colors={[COLORS.background, '#F1F5F9']}
        style={styles.backgroundGradient}
      />

      <View style={styles.content}>
        {/* Circular Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imageCircle}>
            <LinearGradient
              colors={[COLORS.secondary, COLORS.accent]}
              style={styles.imageGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="shield-checkmark-outline" size={48} color={COLORS.white} />
            </LinearGradient>
          </View>
        </View>

        {/* Title and Subtitle */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>XÁC THỰC OTP</Text>
          <Text style={styles.subtitle}>
            Nhập mã xác thực 6 số đã được gửi đến
          </Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formCard}>
          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                autoFocus={index === 0}
                selectionColor={COLORS.primary}
              />
            ))}
          </View>

          {/* Resend Section */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Không nhận được mã?{' '}
            </Text>
            <TouchableOpacity 
              onPress={handleResend}
              disabled={!canResend}
              style={styles.resendButton}
            >
              <Text style={[
                styles.resendLink,
                !canResend && styles.resendDisabled
              ]}>
                {canResend ? 'Gửi lại' : `Gửi lại (${resendTimer}s)`}
              </Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            title="XÁC THỰC"
            onPress={handleVerify}
            loading={loading}
            style={styles.verifyButton}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
    shadowColor: COLORS.secondary,
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
  },
  emailText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    backgroundColor: COLORS.inputBackground,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resendButton: {
    padding: 4,
  },
  resendLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  resendDisabled: {
    color: COLORS.gray400,
  },
  verifyButton: {
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
});

export default OTPVerificationScreen;