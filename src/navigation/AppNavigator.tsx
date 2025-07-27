import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import OTPVerificationScreen from "../screens/OTPVerificationScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import CourseDetailScreen from "../screens/CourseDetailScreen";
import ReviewDetailScreen from "../screens/ReviewDetailScreen";
import CartScreen from "../screens/CartScreen";
import AccountScreen from "../screens/AccountScreen";
import NotificationScreen from "../screens/NotificationScreen";
import LearningScreen from "../screens/LearningScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  ResetPassword: { email: string; otpCode: string };
  CourseDetail: { courseId: string };
  ReviewDetail: { courseId: string };
  Cart: undefined;
  Account: undefined;
  Notification: undefined;
  Learning: undefined;
  Favorites: undefined;
  VideoPlayer: { videoUrl: string; title: string };
  Certificate: { courseId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen}
        options={{
          presentation: 'card',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="ReviewDetail" 
        component={ReviewDetailScreen}
        options={{
          presentation: 'card',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          presentation: 'card',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Account" 
        component={AccountScreen}
        options={{
          presentation: 'card',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Notification" 
        component={NotificationScreen}
        options={{
          presentation: 'card',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Learning" 
        component={LearningScreen}
        options={{
          presentation: 'card',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          presentation: 'card',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;