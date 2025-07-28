import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Share,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Certificate: { courseId: string };
  CourseDetail: { courseId: string };
  Learning: undefined;
};

type CertificateScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Certificate'>;

// Mock certificate data
const mockCertificateData = {
  id: 'cert-001',
  studentName: 'Nguyễn Văn An',
  courseTitle: 'Lập Trình Python Từ Cơ Bản Đến Nâng Cao Trong 30 Ngày',
  instructorName: 'AI Coding',
  completionDate: '15/01/2024',
  certificateNumber: 'UC-PYTHON-2024-001234',
  totalHours: '15 giờ',
  finalScore: '95%',
  skills: [
    'Python Programming',
    'Data Structures',
    'Object-Oriented Programming',
    'File Handling',
    'Exception Handling',
    'Web Scraping'
  ]
};

const CertificateScreen = () => {
  const navigation = useNavigation<CertificateScreenNavigationProp>();
  const route = useRoute();
  const { t } = useTranslation();
  const { courseId } = route.params;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Tôi vừa hoàn thành khóa học "${mockCertificateData.courseTitle}" và nhận được chứng chỉ! 🎉\n\nChứng chỉ số: ${mockCertificateData.certificateNumber}\nĐiểm số: ${mockCertificateData.finalScore}\n\n#Learning #Certificate #Achievement`,
        title: 'Chia sẻ chứng chỉ của tôi',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Thành công', 'Chứng chỉ đã được tải xuống thành công!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải xuống chứng chỉ. Vui lòng thử lại.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewCredentials = () => {
    Alert.alert(
      'Xác thực chứng chỉ',
      `Số chứng chỉ: ${mockCertificateData.certificateNumber}\n\nBạn có thể sử dụng số này để xác thực chứng chỉ trên website của chúng tôi.`,
      [
        { text: 'Đóng', style: 'cancel' },
        { text: 'Sao chép số chứng chỉ', onPress: () => {
          // Copy to clipboard logic here
          Alert.alert('Thành công', 'Đã sao chép số chứng chỉ');
        }}
      ]
    );
  };

  const renderCertificate = () => (
    <View style={styles.certificateContainer}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.certificateGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Certificate Border */}
        <View style={styles.certificateBorder}>
          <View style={styles.certificateContent}>
            {/* Header */}
            <View style={styles.certificateHeader}>
              <View style={styles.logoContainer}>
                <Ionicons name="school" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.certificateTitle}>CHỨNG CHỈ HOÀN THÀNH</Text>
              <Text style={styles.certificateSubtitle}>CERTIFICATE OF COMPLETION</Text>
            </View>

            {/* Decorative Line */}
            <View style={styles.decorativeLine}>
              <View style={styles.decorativeCircle} />
              <View style={styles.decorativeBar} />
              <View style={styles.decorativeCircle} />
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
              <Text style={styles.presentsText}>Trao tặng cho</Text>
              <Text style={styles.studentName}>{mockCertificateData.studentName}</Text>
              
              <Text style={styles.completionText}>
                đã hoàn thành xuất sắc khóa học
              </Text>
              
              <Text style={styles.courseTitle}>
                "{mockCertificateData.courseTitle}"
              </Text>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Giảng viên:</Text>
                  <Text style={styles.detailValue}>{mockCertificateData.instructorName}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Thời lượng:</Text>
                  <Text style={styles.detailValue}>{mockCertificateData.totalHours}</Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Điểm số:</Text>
                  <Text style={styles.detailValue}>{mockCertificateData.finalScore}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Ngày hoàn thành:</Text>
                  <Text style={styles.detailValue}>{mockCertificateData.completionDate}</Text>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.certificateFooter}>
              <View style={styles.signatureSection}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>Chữ ký điện tử</Text>
                <Text style={styles.signatureTitle}>Giám đốc học thuật</Text>
              </View>
              
              <View style={styles.certificateNumber}>
                <Text style={styles.certificateNumberLabel}>Số chứng chỉ:</Text>
                <Text style={styles.certificateNumberValue}>
                  {mockCertificateData.certificateNumber}
                </Text>
              </View>
            </View>

            {/* Watermark */}
            <View style={styles.watermark}>
              <Ionicons name="ribbon" size={80} color="rgba(99, 102, 241, 0.1)" />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderSkillsSection = () => (
    <View style={styles.skillsSection}>
      <Text style={styles.skillsTitle}>Kỹ năng đã đạt được</Text>
      <View style={styles.skillsContainer}>
        {mockCertificateData.skills.map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={handleDownload}
        disabled={isDownloading}
      >
        <Ionicons 
          name={isDownloading ? "hourglass" : "download"} 
          size={20} 
          color={COLORS.white} 
        />
        <Text style={styles.primaryButtonText}>
          {isDownloading ? 'Đang tải...' : 'Tải xuống PDF'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={handleShare}
      >
        <Ionicons name="share" size={20} color={COLORS.primary} />
        <Text style={styles.secondaryButtonText}>Chia sẻ</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={handleViewCredentials}
      >
        <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
        <Text style={styles.secondaryButtonText}>Xác thực</Text>
      </TouchableOpacity>
    </View>
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
        <Text style={styles.headerTitle}>Chứng chỉ hoàn thành</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Badge */}
        <View style={styles.successBadge}>
          <LinearGradient
            colors={[COLORS.success, '#059669']}
            style={styles.successGradient}
          >
            <Ionicons name="trophy" size={32} color={COLORS.white} />
          </LinearGradient>
          <View style={styles.successContent}>
            <Text style={styles.successTitle}>Chúc mừng! 🎉</Text>
            <Text style={styles.successSubtitle}>
              Bạn đã hoàn thành xuất sắc khóa học và nhận được chứng chỉ
            </Text>
          </View>
        </View>

        {/* Certificate */}
        {renderCertificate()}

        {/* Skills Section */}
        {renderSkillsSection()}

        {/* Action Buttons */}
        {renderActionButtons()}

        {/* Additional Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>
              Chứng chỉ này có thể được xác thực trên website của chúng tôi
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={20} color={COLORS.warning} />
            <Text style={styles.infoText}>
              Chứng chỉ có hiệu lực vĩnh viễn và được công nhận quốc tế
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
            <Text style={styles.infoText}>
              Được bảo vệ bằng công nghệ blockchain để đảm bảo tính xác thực
            </Text>
          </View>
        </View>
      </ScrollView>
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
  headerRight: {
    width: 40,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Success Badge
  successBadge: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  successGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // Certificate
  certificateContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  certificateGradient: {
    padding: 3,
  },
  certificateBorder: {
    backgroundColor: COLORS.white,
    borderRadius: 13,
    padding: 2,
  },
  certificateContent: {
    backgroundColor: COLORS.white,
    borderRadius: 11,
    padding: 24,
    position: 'relative',
    minHeight: 400,
  },
  certificateHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  certificateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  certificateSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  decorativeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  decorativeCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  decorativeBar: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.primary,
    marginHorizontal: 8,
  },
  mainContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  presentsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  completionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  certificateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureSection: {
    alignItems: 'center',
    flex: 1,
  },
  signatureLine: {
    width: 100,
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 8,
  },
  signatureText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  signatureTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  certificateNumber: {
    alignItems: 'flex-end',
    flex: 1,
  },
  certificateNumberLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  certificateNumberValue: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
    zIndex: -1,
  },

  // Skills Section
  skillsSection: {
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  skillsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  skillText: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '500',
  },

  // Action Buttons
  actionButtons: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  // Info Section
  infoSection: {
    paddingHorizontal: 16,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});

export default CertificateScreen;