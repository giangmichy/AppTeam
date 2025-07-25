import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="school-outline" size={80} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Learning App</Text>
        <Text style={styles.subtitle}>Nền tảng học tập trực tuyến</Text>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Đăng nhập"
          onPress={navigateToLogin}
          style={styles.button}
          icon={<Ionicons name="log-in-outline" size={20} color={COLORS.white} />}
        />

        <CustomButton
          title="Đăng ký"
          onPress={navigateToRegister}
          variant="outline"
          style={styles.button}
          icon={<Ionicons name="person-add-outline" size={20} color={COLORS.primary} />}
        />

        <Text style={styles.orText}>Hoặc xem demo giao diện</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🎯 Màu chủ đạo: Nâu (Udemy style){'\n'}
          📱 Responsive design{'\n'}
          🔒 Form validation{'\n'}
          ✨ Smooth animations
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  button: {
    marginBottom: 16,
  },
  orText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default HomeScreen;