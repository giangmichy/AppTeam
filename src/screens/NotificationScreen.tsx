import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Switch,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/colors';

type RootStackParamList = {
  Home: undefined;
  Notification: undefined;
  CourseDetail: { courseId: string };
  Account: undefined;
};

type NotificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notification'>;

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'course_update',
    title: 'Khóa học được cập nhật',
    message: 'Khóa học "Lập Trình Python Từ Cơ Bản Đến Nâng Cao" đã có video mới',
    courseId: '1',
    courseThumbnail: 'https://picsum.photos/60/60?random=1',
    time: '2 phút trước',
    isRead: false,
    priority: 'normal'
  },
  {
    id: '2',
    type: 'certificate',
    title: 'Chứng chỉ hoàn thành',
    message: 'Chúc mừng! Bạn đã hoàn thành khóa học "React Native từ cơ bản đến nâng cao"',
    courseId: '2',
    courseThumbnail: 'https://picsum.photos/60/60?random=2',
    time: '1 giờ trước',
    isRead: false,
    priority: 'high'
  },
  {
    id: '3',
    type: 'discount',
    title: 'Ưu đãi đặc biệt',
    message: 'Giảm 70% cho tất cả khóa học thiết kế. Chỉ còn 2 ngày!',
    time: '3 giờ trước',
    isRead: true,
    priority: 'high'
  },
  {
    id: '4',
    type: 'course_reminder',
    title: 'Nhắc nhở học tập',
    message: 'Bạn chưa học tiếp khóa "UI/UX Design Complete Course" hôm nay',
    courseId: '3',
    courseThumbnail: 'https://picsum.photos/60/60?random=3',
    time: '5 giờ trước',
    isRead: true,
    priority: 'normal'
  },
  {
    id: '5',
    type: 'assignment',
    title: 'Bài tập mới',
    message: 'Giảng viên đã giao bài tập mới cho khóa "Python cho Data Science"',
    courseId: '4',
    courseThumbnail: 'https://picsum.photos/60/60?random=4',
    time: '1 ngày trước',
    isRead: true,
    priority: 'normal'
  },
  {
    id: '6',
    type: 'system',
    title: 'Cập nhật ứng dụng',
    message: 'Phiên bản mới 2.1.0 đã có sẵn với nhiều tính năng thú vị',
    time: '2 ngày trước',
    isRead: true,
    priority: 'low'
  },
  {
    id: '7',
    type: 'instructor_message',
    title: 'Tin nhắn từ giảng viên',
    message: 'AI Coding đã trả lời câu hỏi của bạn trong khóa học Python',
    courseId: '1',
    courseThumbnail: 'https://picsum.photos/60/60?random=5',
    time: '3 ngày trước',
    isRead: true,
    priority: 'normal'
  }
];

const NotificationScreen = () => {
  const navigation = useNavigation<NotificationScreenNavigationProp>();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    courseUpdates: true,
    assignments: true,
    reminders: true,
    promotions: false,
    instructorMessages: true,
    systemUpdates: true
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course_update':
        return 'play-circle';
      case 'certificate':
        return 'ribbon';
      case 'discount':
        return 'pricetag';
      case 'course_reminder':
        return 'time';
      case 'assignment':
        return 'document-text';
      case 'system':
        return 'settings';
      case 'instructor_message':
        return 'chatbubble';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return COLORS.danger;
    switch (type) {
      case 'course_update':
        return COLORS.primary;
      case 'certificate':
        return COLORS.warning;
      case 'discount':
        return COLORS.success;
      case 'course_reminder':
        return COLORS.info;
      case 'assignment':
        return COLORS.accent;
      case 'system':
        return COLORS.textSecondary;
      case 'instructor_message':
        return COLORS.secondary;
      default:
        return COLORS.primary;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const handleNotificationPress = (notification: any) => {
    markAsRead(notification.id);
    
    if (notification.courseId) {
      navigation.navigate('CourseDetail', { courseId: notification.courseId });
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotificationItem = (notification: any) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationContent}>
        <View style={[
          styles.notificationIcon,
          { backgroundColor: getNotificationColor(notification.type, notification.priority) + '15' }
        ]}>
          <Ionicons
            name={getNotificationIcon(notification.type) as any}
            size={20}
            color={getNotificationColor(notification.type, notification.priority)}
          />
        </View>

        <View style={styles.notificationText}>
          <Text style={[
            styles.notificationTitle,
            !notification.isRead && styles.unreadTitle
          ]}>
            {notification.title}
          </Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>

        {notification.courseThumbnail && (
          <Image 
            source={{ uri: notification.courseThumbnail }} 
            style={styles.courseThumbnail}
          />
        )}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNotification(notification.id)}
        >
          <Ionicons name="close" size={16} color={COLORS.gray400} />
        </TouchableOpacity>
      </View>

      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const renderSettingsModal = () => (
    <Modal
      visible={showSettings}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowSettings(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{t('notifications.settings')}</Text>
          <TouchableOpacity onPress={() => setShowSettings(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.settingsContent}>
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>{t('notifications.courseNotifications')}</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t('notifications.courseUpdates')}</Text>
                <Text style={styles.settingDescription}>{t('notifications.courseUpdatesDesc')}</Text>
              </View>
              <Switch
                value={notificationSettings.courseUpdates}
                onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, courseUpdates: value }))}
                trackColor={{ false: COLORS.gray300, true: COLORS.primary + '50' }}
                thumbColor={notificationSettings.courseUpdates ? COLORS.primary : COLORS.gray400}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t('notifications.assignments')}</Text>
                <Text style={styles.settingDescription}>{t('notifications.assignmentsDesc')}</Text>
              </View>
              <Switch
                value={notificationSettings.assignments}
                onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, assignments: value }))}
                trackColor={{ false: COLORS.gray300, true: COLORS.primary + '50' }}
                thumbColor={notificationSettings.assignments ? COLORS.primary : COLORS.gray400}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t('notifications.reminders')}</Text>
                <Text style={styles.settingDescription}>{t('notifications.remindersDesc')}</Text>
              </View>
              <Switch
                value={notificationSettings.reminders}
                onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, reminders: value }))}
                trackColor={{ false: COLORS.gray300, true: COLORS.primary + '50' }}
                thumbColor={notificationSettings.reminders ? COLORS.primary : COLORS.gray400}
              />
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>{t('notifications.marketingNotifications')}</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t('notifications.promotions')}</Text>
                <Text style={styles.settingDescription}>{t('notifications.promotionsDesc')}</Text>
              </View>
              <Switch
                value={notificationSettings.promotions}
                onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, promotions: value }))}
                trackColor={{ false: COLORS.gray300, true: COLORS.primary + '50' }}
                thumbColor={notificationSettings.promotions ? COLORS.primary : COLORS.gray400}
              />
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>{t('notifications.otherNotifications')}</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t('notifications.instructorMessages')}</Text>
                <Text style={styles.settingDescription}>{t('notifications.instructorMessagesDesc')}</Text>
              </View>
              <Switch
                value={notificationSettings.instructorMessages}
                onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, instructorMessages: value }))}
                trackColor={{ false: COLORS.gray300, true: COLORS.primary + '50' }}
                thumbColor={notificationSettings.instructorMessages ? COLORS.primary : COLORS.gray400}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t('notifications.systemUpdates')}</Text>
                <Text style={styles.settingDescription}>{t('notifications.systemUpdatesDesc')}</Text>
              </View>
              <Switch
                value={notificationSettings.systemUpdates}
                onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, systemUpdates: value }))}
                trackColor={{ false: COLORS.gray300, true: COLORS.primary + '50' }}
                thumbColor={notificationSettings.systemUpdates ? COLORS.primary : COLORS.gray400}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setShowSettings(true)}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Action Bar */}
      {unreadCount > 0 && (
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={styles.markAllReadButton}
            onPress={markAllAsRead}
          >
            <Ionicons name="checkmark-done" size={16} color={COLORS.primary} />
            <Text style={styles.markAllReadText}>{t('notifications.markAllRead')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.length > 0 ? (
          <View style={styles.notificationsList}>
            {notifications.map(renderNotificationItem)}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="notifications-outline" size={80} color={COLORS.gray400} />
            </View>
            <Text style={styles.emptyTitle}>{t('notifications.empty')}</Text>
            <Text style={styles.emptySubtitle}>{t('notifications.emptyDesc')}</Text>
          </View>
        )}
      </ScrollView>

      {/* Settings Modal */}
      {renderSettingsModal()}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  unreadBadge: {
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },

  // Action Bar
  actionBar: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  markAllReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-end',
  },
  markAllReadText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },

  // Notifications List
  notificationsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  notificationItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    flex: 1,
    gap: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.gray400,
  },
  courseThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  deleteButton: {
    padding: 4,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  settingsContent: {
    flex: 1,
    paddingVertical: 16,
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    marginBottom: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default NotificationScreen;