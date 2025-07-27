import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Home: undefined;
  Learning: undefined;
  CourseDetail: { courseId: string };
  VideoPlayer: { videoUrl: string; title: string };
  Certificate: { courseId: string };
};

type LearningScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Learning'>;

// Mock enrolled courses data
const mockEnrolledCourses = [
  {
    id: '1',
    title: 'Lập Trình Python Từ Cơ Bản Đến Nâng Cao',
    instructor: 'AI Coding',
    image: 'https://picsum.photos/300/180?random=1',
    progress: 75,
    totalLessons: 45,
    completedLessons: 34,
    lastWatched: '2024-01-15',
    totalDuration: '15h 30m',
    watchedDuration: '11h 40m',
    status: 'in_progress',
    nextLesson: {
      id: 'lesson-35',
      title: 'Advanced Functions và Lambda',
      duration: '12:30'
    },
    category: 'Lập trình'
  },
  {
    id: '2',
    title: 'React Native từ cơ bản đến nâng cao',
    instructor: 'Mobile Dev Academy',
    image: 'https://picsum.photos/300/180?random=2',
    progress: 45,
    totalLessons: 52,
    completedLessons: 23,
    lastWatched: '2024-01-12',
    totalDuration: '20h 15m',
    watchedDuration: '9h 10m',
    status: 'in_progress',
    nextLesson: {
      id: 'lesson-24',
      title: 'Navigation với React Navigation',
      duration: '18:45'
    },
    category: 'Mobile Development'
  },
  {
    id: '3',
    title: 'UI/UX Design Complete Course',
    instructor: 'Tech Design School',
    image: 'https://picsum.photos/300/180?random=3',
    progress: 100,
    totalLessons: 38,
    completedLessons: 38,
    lastWatched: '2024-01-08',
    totalDuration: '18h 00m',
    watchedDuration: '18h 00m',
    status: 'completed',
    certificateAvailable: true,
    category: 'Thiết kế'
  },
  {
    id: '4',
    title: 'Node.js Backend Development',
    instructor: 'Backend Masters',
    image: 'https://picsum.photos/300/180?random=4',
    progress: 20,
    totalLessons: 41,
    completedLessons: 8,
    lastWatched: '2024-01-10',
    totalDuration: '16h 45m',
    watchedDuration: '3h 20m',
    status: 'in_progress',
    nextLesson: {
      id: 'lesson-9',
      title: 'Express.js Routing',
      duration: '15:20'
    },
    category: 'Backend'
  },
  {
    id: '5',
    title: 'Digital Marketing từ A-Z',
    instructor: 'Marketing Pro Academy',
    image: 'https://picsum.photos/300/180?random=5',
    progress: 90,
    totalLessons: 35,
    completedLessons: 32,
    lastWatched: '2024-01-14',
    totalDuration: '12h 30m',
    watchedDuration: '11h 15m',
    status: 'in_progress',
    nextLesson: {
      id: 'lesson-33',
      title: 'Social Media Analytics',
      duration: '22:10'
    },
    category: 'Marketing'
  }
];

// Mock recent activity
const mockRecentActivity = [
  {
    id: '1',
    type: 'lesson_completed',
    title: 'Hoàn thành bài học',
    description: 'Functions và Parameters trong Python',
    courseTitle: 'Lập Trình Python Từ Cơ Bản Đến Nâng Cao',
    time: '2 giờ trước',
    icon: 'checkmark-circle'
  },
  {
    id: '2',
    type: 'certificate_earned',
    title: 'Nhận chứng chỉ',
    description: 'UI/UX Design Complete Course',
    time: '1 ngày trước',
    icon: 'ribbon'
  },
  {
    id: '3',
    type: 'course_started',
    title: 'Bắt đầu khóa học',
    description: 'Digital Marketing từ A-Z',
    time: '3 ngày trước',
    icon: 'play'
  }
];

const LearningScreen = () => {
  const navigation = useNavigation<LearningScreenNavigationProp>();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('all');
  const [showStats, setShowStats] = useState(false);

  const tabs = [
    { key: 'all', label: t('learning.allCourses') },
    { key: 'in_progress', label: t('learning.inProgress') },
    { key: 'completed', label: t('learning.completed') }
  ];

  const getFilteredCourses = () => {
    if (selectedTab === 'all') return mockEnrolledCourses;
    return mockEnrolledCourses.filter(course => course.status === selectedTab);
  };

  const getTotalStats = () => {
    const totalCourses = mockEnrolledCourses.length;
    const completedCourses = mockEnrolledCourses.filter(c => c.status === 'completed').length;
    const inProgressCourses = mockEnrolledCourses.filter(c => c.status === 'in_progress').length;
    const totalWatchTime = mockEnrolledCourses.reduce((total, course) => {
      const duration = parseFloat(course.watchedDuration.replace('h', '').replace('m', ''));
      return total + duration;
    }, 0);
    
    return { totalCourses, completedCourses, inProgressCourses, totalWatchTime };
  };

  const renderCourseCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
    >
      <View style={styles.courseImageContainer}>
        <Image source={{ uri: item.image }} style={styles.courseImage} />
        <View style={styles.progressOverlay}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
        
        {item.status === 'completed' && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
          </View>
        )}
      </View>

      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.courseInstructor}>{item.instructor}</Text>
        
        <View style={styles.courseStats}>
          <View style={styles.courseStat}>
            <Ionicons name="play-circle-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.courseStatText}>
              {item.completedLessons}/{item.totalLessons} {t('learning.lessons')}
            </Text>
          </View>
          <View style={styles.courseStat}>
            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.courseStatText}>{item.watchedDuration}</Text>
          </View>
        </View>

        {item.status === 'completed' ? (
          <TouchableOpacity
            style={styles.certificateButton}
            onPress={() => navigation.navigate('Certificate' as any, { courseId: item.id })}
          >
            <Ionicons name="ribbon" size={16} color={COLORS.warning} />
            <Text style={styles.certificateButtonText}>{t('learning.viewCertificate')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('VideoPlayer' as any, { 
              videoUrl: 'sample-url', 
              title: item.nextLesson?.title || '' 
            })}
          >
            <Ionicons name="play" size={16} color={COLORS.white} />
            <Text style={styles.continueButtonText}>
              {t('learning.continue')}: {item.nextLesson?.title}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderRecentActivity = () => (
    <View style={styles.activitySection}>
      <Text style={styles.sectionTitle}>{t('learning.recentActivity')}</Text>
      <View style={styles.activityList}>
        {mockRecentActivity.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={[styles.activityIcon, getActivityIconStyle(activity.type)]}>
              <Ionicons
                name={activity.icon as any}
                size={16}
                color={getActivityIconColor(activity.type)}
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              {activity.courseTitle && (
                <Text style={styles.activityCourse}>{activity.courseTitle}</Text>
              )}
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const getActivityIconStyle = (type: string) => {
    switch (type) {
      case 'lesson_completed':
        return { backgroundColor: COLORS.success + '15' };
      case 'certificate_earned':
        return { backgroundColor: COLORS.warning + '15' };
      case 'course_started':
        return { backgroundColor: COLORS.primary + '15' };
      default:
        return { backgroundColor: COLORS.gray100 };
    }
  };

  const getActivityIconColor = (type: string) => {
    switch (type) {
      case 'lesson_completed':
        return COLORS.success;
      case 'certificate_earned':
        return COLORS.warning;
      case 'course_started':
        return COLORS.primary;
      default:
        return COLORS.textSecondary;
    }
  };

  const renderStatsModal = () => {
    const stats = getTotalStats();
    
    return (
      <Modal
        visible={showStats}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowStats(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('learning.learningStats')}</Text>
            <TouchableOpacity onPress={() => setShowStats(false)}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.statsContent}>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryDark]}
                  style={styles.statGradient}
                >
                  <Ionicons name="library" size={32} color={COLORS.white} />
                  <Text style={styles.statNumber}>{stats.totalCourses}</Text>
                  <Text style={styles.statLabel}>{t('learning.totalCourses')}</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[COLORS.success, '#059669']}
                  style={styles.statGradient}
                >
                  <Ionicons name="checkmark-circle" size={32} color={COLORS.white} />
                  <Text style={styles.statNumber}>{stats.completedCourses}</Text>
                  <Text style={styles.statLabel}>{t('learning.completed')}</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[COLORS.warning, '#D97706']}
                  style={styles.statGradient}
                >
                  <Ionicons name="play-circle" size={32} color={COLORS.white} />
                  <Text style={styles.statNumber}>{stats.inProgressCourses}</Text>
                  <Text style={styles.statLabel}>{t('learning.inProgress')}</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[COLORS.accent, COLORS.secondary]}
                  style={styles.statGradient}
                >
                  <Ionicons name="time" size={32} color={COLORS.white} />
                  <Text style={styles.statNumber}>{Math.round(stats.totalWatchTime)}h</Text>
                  <Text style={styles.statLabel}>{t('learning.watchTime')}</Text>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.progressSection}>
              <Text style={styles.progressSectionTitle}>{t('learning.courseProgress')}</Text>
              {mockEnrolledCourses.filter(c => c.status === 'in_progress').map((course) => (
                <View key={course.id} style={styles.progressItem}>
                  <Text style={styles.progressCourseTitle} numberOfLines={1}>
                    {course.title}
                  </Text>
                  <View style={styles.progressInfo}>
                    <View style={styles.progressBarContainer}>
                      <View style={[styles.progressBarFill, { width: `${course.progress}%` }]} />
                    </View>
                    <Text style={styles.progressPercentage}>{course.progress}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const filteredCourses = getFilteredCourses();

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
        <Text style={styles.headerTitle}>{t('learning.title')}</Text>
        <TouchableOpacity 
          style={styles.statsButton}
          onPress={() => setShowStats(true)}
        >
          <Ionicons name="bar-chart-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Overview Stats */}
      <View style={styles.overviewContainer}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={styles.overviewGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.overviewContent}>
            <Text style={styles.overviewTitle}>{t('learning.welcomeBack')}</Text>
            <Text style={styles.overviewSubtitle}>{t('learning.continueJourney')}</Text>
            
            <View style={styles.quickStats}>
              <View style={styles.quickStat}>
                <Text style={styles.quickStatNumber}>{mockEnrolledCourses.length}</Text>
                <Text style={styles.quickStatLabel}>{t('learning.enrolledCourses')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.quickStat}>
                <Text style={styles.quickStatNumber}>
                  {mockEnrolledCourses.filter(c => c.status === 'completed').length}
                </Text>
                <Text style={styles.quickStatLabel}>{t('learning.completed')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.quickStat}>
                <Text style={styles.quickStatNumber}>
                  {Math.round(mockEnrolledCourses.reduce((total, course) => {
                    const duration = parseFloat(course.watchedDuration.replace('h', '').replace('m', ''));
                    return total + duration;
                  }, 0))}h
                </Text>
                <Text style={styles.quickStatLabel}>{t('learning.totalHours')}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                selectedTab === tab.key && styles.activeTab
              ]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab.key && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Courses List */}
        {filteredCourses.length > 0 ? (
          <View style={styles.coursesContainer}>
            {filteredCourses.map((course) => (
              <View key={course.id}>
                {renderCourseCard({ item: course })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="school-outline" size={80} color={COLORS.gray400} />
            </View>
            <Text style={styles.emptyTitle}>{t('learning.noCourses')}</Text>
            <Text style={styles.emptySubtitle}>{t('learning.noCoursesDesc')}</Text>
          </View>
        )}

        {/* Recent Activity */}
        {selectedTab === 'all' && renderRecentActivity()}
      </ScrollView>

      {/* Stats Modal */}
      {renderStatsModal()}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statsButton: {
    padding: 8,
  },

  // Overview
  overviewContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  overviewGradient: {
    padding: 20,
  },
  overviewContent: {
    alignItems: 'center',
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  overviewSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
  },
  quickStat: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Tabs
  tabsContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabsScrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Courses
  coursesContainer: {
    padding: 16,
    gap: 16,
  },
  courseCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  courseImageContainer: {
    position: 'relative',
  },
  courseImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  progressOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },
  progressText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 4,
  },
  courseInfo: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  courseInstructor: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  courseStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  courseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseStatText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  certificateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warning + '15',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  certificateButtonText: {
    color: COLORS.warning,
    fontSize: 14,
    fontWeight: '600',
  },

  // Activity Section
  activitySection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  activityList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  activityCourse: {
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 11,
    color: COLORS.gray400,
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
  statsContent: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  progressSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
  },
  progressSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressCourseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    minWidth: 32,
  },
});

export default LearningScreen;