import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTranslation } from 'react-i18next';
import CustomButton from '../components/CustomButton';
import { COLORS } from '../constants/colors';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Account: undefined;
  EditProfile: undefined;
  MyCourses: undefined;
  Certificates: undefined;
  Downloads: undefined;
  BecomeInstructor: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

type AccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Account'>;

// Mock user data
const mockUser = {
  id: '1',
  name: 'Vương Ngô',
  email: 'vuongngo1993@gmail.com',
  avatar: 'https://picsum.photos/120/120?random=user',
  isInstructor: false,
  coursesEnrolled: 12,
  certificatesEarned: 8,
  totalLearningHours: 45.5,
  memberSince: '2023',
  points: 2450,
  level: 'Intermediate',
};

const AccountScreen = () => {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const { t } = useTranslation();
  const [user, setUser] = useState(mockUser);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleBecomeInstructor = () => {
    Alert.alert('Trở thành giảng viên', 'Bạn sẽ được chuyển đến trang đăng ký giảng viên');
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    Alert.alert('Đăng xuất thành công', 'Hẹn gặp lại bạn!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Login'),
      },
    ]);
  };

  const menuItems = [
    {
      section: 'Học tập',
      items: [
        {
          id: 'my-courses',
          title: 'Khóa học của tôi',
          subtitle: `${user.coursesEnrolled} khóa học`,
          icon: 'play-circle',
          color: COLORS.primary,
          onPress: () => Alert.alert('Khóa học của tôi', 'Danh sách khóa học đã đăng ký'),
        },
        {
          id: 'certificates',
          title: 'Chứng chỉ',
          subtitle: `${user.certificatesEarned} chứng chỉ`,
          icon: 'ribbon',
          color: COLORS.warning,
          onPress: () => Alert.alert('Chứng chỉ', 'Danh sách chứng chỉ đã nhận'),
        },
        {
          id: 'downloads',
          title: 'Tải xuống',
          subtitle: 'Video đã tải',
          icon: 'download',
          color: COLORS.success,
          onPress: () => Alert.alert('Tải xuống', 'Danh sách video đã tải'),
        },
        {
          id: 'wishlist',
          title: 'Danh sách yêu thích',
          subtitle: 'Khóa học đã lưu',
          icon: 'heart',
          color: COLORS.danger,
          onPress: () => Alert.alert('Danh sách yêu thích', 'Khóa học đã thêm vào yêu thích'),
        },
      ],
    },
    {
      section: 'Giảng dạy',
      items: [
        {
          id: 'become-instructor',
          title: 'Trở thành giảng viên',
          subtitle: 'Chia sẻ kiến thức của bạn',
          icon: 'school',
          color: COLORS.accent,
          onPress: handleBecomeInstructor,
          highlight: true,
        },
      ],
    },
    {
      section: 'Cài đặt',
      items: [
        {
          id: 'notifications',
          title: 'Thông báo',
          subtitle: 'Quản lý thông báo',
          icon: 'notifications',
          color: COLORS.info,
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled,
        },
        {
          id: 'language',
          title: 'Ngôn ngữ',
          subtitle: 'Tiếng Việt',
          icon: 'language',
          color: COLORS.secondary,
          onPress: () => Alert.alert('Ngôn ngữ', 'Chọn ngôn ngữ hiển thị'),
        },
        {
          id: 'dark-mode',
          title: 'Chế độ tối',
          subtitle: 'Giao diện tối',
          icon: 'moon',
          color: COLORS.gray600,
          hasSwitch: true,
          switchValue: darkModeEnabled,
          onSwitchChange: setDarkModeEnabled,
        },
      ],
    },
    {
      section: 'Hỗ trợ',
      items: [
        {
          id: 'help',
          title: 'Trợ giúp & Hỗ trợ',
          subtitle: 'FAQ, Liên hệ',
          icon: 'help-circle',
          color: COLORS.primaryLight,
          onPress: () => Alert.alert('Trợ giúp', 'Trang hỗ trợ và FAQ'),
        },
        {
          id: 'privacy',
          title: 'Chính sách bảo mật',
          subtitle: 'Quyền riêng tư',
          icon: 'shield-checkmark',
          color: COLORS.success,
          onPress: () => Alert.alert('Chính sách bảo mật', 'Thông tin bảo mật dữ liệu'),
        },
        {
          id: 'terms',
          title: 'Điều khoản sử dụng',
          subtitle: 'Quy định dịch vụ',
          icon: 'document-text',
          color: COLORS.textSecondary,
          onPress: () => Alert.alert('Điều khoản', 'Các điều khoản và quy định'),
        },
      ],
    },
  ];

  const renderUserInfo = () => (
    <View style={styles.userInfoContainer}>
      <View
        style={styles.userGradient}
      >
        <View style={styles.userHeader}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleEditProfile}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.userLevel}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.levelText}>{user.level}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.coursesEnrolled}</Text>
            <Text style={styles.statLabel}>Khóa học</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.certificatesEarned}</Text>
            <Text style={styles.statLabel}>Chứng chỉ</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.totalLearningHours}h</Text>
            <Text style={styles.statLabel}>Học tập</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.points}</Text>
            <Text style={styles.statLabel}>Điểm</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, item.highlight && styles.highlightMenuItem]}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
          <Ionicons name={item.icon as any} size={22} color={item.color} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={[styles.menuItemTitle, item.highlight && styles.highlightText]}>
            {item.title}
          </Text>
          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      
      <View style={styles.menuItemRight}>
        {item.hasSwitch ? (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange}
            trackColor={{ false: COLORS.gray300, true: COLORS.primary + '50' }}
            thumbColor={item.switchValue ? COLORS.primary : COLORS.gray400}
          />
        ) : (
          <>
            {item.highlight && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderLogoutModal = () => (
    <Modal
      visible={showLogoutModal}
      animationType="fade"
      transparent
      onRequestClose={() => setShowLogoutModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalIcon}>
            <Ionicons name="log-out-outline" size={32} color={COLORS.danger} />
          </View>
          
          <Text style={styles.modalTitle}>Đăng xuất</Text>
          <Text style={styles.modalMessage}>
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
          </Text>
          
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowLogoutModal(false)}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tài khoản</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Info */}
        {renderUserInfo()}
        
        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          {menuItems.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.sectionTitle}>{section.section}</Text>
              <View style={styles.sectionItems}>
                {section.items.map(renderMenuItem)}
              </View>
            </View>
          ))}
          
          {/* Logout Button */}
          <View style={styles.logoutSection}>
            <TouchableOpacity
              style={styles.logoutMenuItem}
              onPress={() => setShowLogoutModal(true)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: COLORS.danger + '15' }]}>
                  <Ionicons name="log-out-outline" size={22} color={COLORS.danger} />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={[styles.menuItemTitle, { color: COLORS.danger }]}>
                    Đăng xuất
                  </Text>
                  <Text style={styles.menuItemSubtitle}>Thoát khỏi tài khoản</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 EduApp. All rights reserved.</Text>
        </View>
      </ScrollView>

      {/* Logout Modal */}
      {renderLogoutModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    paddingTop: 20,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerPlaceholder: {
    width: 24,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  
  // User Info
  userInfoContainer: {
    marginTop: 5,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  userGradient: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
  },
  userLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Menu
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionItems: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  highlightMenuItem: {
    backgroundColor: COLORS.accent + '08',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  highlightText: {
    color: COLORS.accent,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  
  // Logout Section
  logoutSection: {
    marginBottom: 24,
  },
  logoutMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Version
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: COLORS.gray400,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.danger + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.gray100,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default AccountScreen;