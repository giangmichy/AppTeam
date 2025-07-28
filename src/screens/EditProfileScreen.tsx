import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { COLORS } from '../constants/colors';

type RootStackParamList = {
  EditProfile: undefined;
  Account: undefined;
};

type EditProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

// Mock user data
const mockUserData = {
  id: '1',
  avatar: 'https://picsum.photos/200/200?random=user',
  fullName: 'Nguyễn Văn An',
  email: 'nguyenvanan@email.com',
  phone: '0123456789',
  dateOfBirth: '15/03/1995',
  gender: 'male',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  bio: 'Tôi là một lập trình viên đam mê học hỏi những công nghệ mới. Hiện tại đang làm việc tại một công ty công nghệ và luôn muốn phát triển kỹ năng của mình.',
  occupation: 'Lập trình viên',
  company: 'Tech Company Ltd.',
  website: 'https://github.com/nguyenvanan',
  interests: ['Lập trình', 'Công nghệ', 'Thiết kế', 'Du lịch'],
};

const EditProfileScreen = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { t } = useTranslation();
  
  const [userInfo, setUserInfo] = useState(mockUserData);
  const [isLoading, setSaveLoading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);

  const genderOptions = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' },
  ];

  const availableInterests = [
    'Lập trình', 'Công nghệ', 'Thiết kế', 'Marketing', 'Kinh doanh',
    'Du lịch', 'Nhiếp ảnh', 'Âm nhạc', 'Thể thao', 'Nấu ăn',
    'Đọc sách', 'Phim ảnh', 'Game', 'Nghệ thuật', 'Khoa học'
  ];

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Thành công', 'Thông tin đã được cập nhật thành công!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAvatarChange = () => {
    setShowAvatarModal(true);
  };

  const selectAvatarOption = (option: string) => {
    setShowAvatarModal(false);
    if (option === 'camera') {
      Alert.alert('Chụp ảnh', 'Tính năng chụp ảnh sẽ được cập nhật sớm');
    } else if (option === 'gallery') {
      Alert.alert('Chọn từ thư viện', 'Tính năng chọn ảnh sẽ được cập nhật sớm');
    } else if (option === 'remove') {
      setUserInfo({...userInfo, avatar: ''});
    }
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = userInfo.interests;
    if (currentInterests.includes(interest)) {
      setUserInfo({
        ...userInfo,
        interests: currentInterests.filter(i => i !== interest)
      });
    } else {
      setUserInfo({
        ...userInfo,
        interests: [...currentInterests, interest]
      });
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
      <TouchableOpacity onPress={handleSave} disabled={isLoading}>
        <Text style={[styles.saveText, isLoading && { opacity: 0.5 }]}>
          {isLoading ? 'Đang lưu...' : 'Lưu'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAvatarSection = () => (
    <View style={styles.avatarSection}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.avatarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={handleAvatarChange}
        >
          {userInfo.avatar ? (
            <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color={COLORS.white} />
            </View>
          )}
          <View style={styles.cameraButton}>
            <Ionicons name="camera" size={16} color={COLORS.white} />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.avatarHint}>Nhấn để thay đổi ảnh đại diện</Text>
      </LinearGradient>
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
      
      <CustomInput
        label="Họ và tên"
        value={userInfo.fullName}
        onChangeText={(text) => setUserInfo({...userInfo, fullName: text})}
        placeholder="Nhập họ và tên"
        leftIcon="person-outline"
      />

      <CustomInput
        label="Email"
        value={userInfo.email}
        onChangeText={(text) => setUserInfo({...userInfo, email: text})}
        placeholder="Nhập email"
        keyboardType="email-address"
        leftIcon="mail-outline"
      />

      <CustomInput
        label="Số điện thoại"
        value={userInfo.phone}
        onChangeText={(text) => setUserInfo({...userInfo, phone: text})}
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
        leftIcon="call-outline"
      />

      <CustomInput
        label="Ngày sinh"
        value={userInfo.dateOfBirth}
        onChangeText={(text) => setUserInfo({...userInfo, dateOfBirth: text})}
        placeholder="DD/MM/YYYY"
        leftIcon="calendar-outline"
      />

      <TouchableOpacity 
        style={styles.genderSelector}
        onPress={() => setShowGenderModal(true)}
      >
        <View style={styles.genderSelectorContent}>
          <Ionicons name="person-outline" size={20} color={COLORS.gray400} />
          <View style={styles.genderSelectorText}>
            <Text style={styles.genderLabel}>Giới tính</Text>
            <Text style={styles.genderValue}>
              {genderOptions.find(g => g.value === userInfo.gender)?.label || 'Chọn giới tính'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderContactInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
      
      <CustomInput
        label="Địa chỉ"
        value={userInfo.address}
        onChangeText={(text) => setUserInfo({...userInfo, address: text})}
        placeholder="Nhập địa chỉ"
        leftIcon="location-outline"
        multiline
        numberOfLines={2}
      />

      <CustomInput
        label="Website"
        value={userInfo.website}
        onChangeText={(text) => setUserInfo({...userInfo, website: text})}
        placeholder="https://example.com"
        keyboardType="url"
        leftIcon="globe-outline"
      />
    </View>
  );

  const renderProfessionalInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin nghề nghiệp</Text>
      
      <CustomInput
        label="Nghề nghiệp"
        value={userInfo.occupation}
        onChangeText={(text) => setUserInfo({...userInfo, occupation: text})}
        placeholder="Nhập nghề nghiệp"
        leftIcon="briefcase-outline"
      />

      <CustomInput
        label="Công ty"
        value={userInfo.company}
        onChangeText={(text) => setUserInfo({...userInfo, company: text})}
        placeholder="Nhập tên công ty"
        leftIcon="business-outline"
      />

      <CustomInput
        label="Giới thiệu bản thân"
        value={userInfo.bio}
        onChangeText={(text) => setUserInfo({...userInfo, bio: text})}
        placeholder="Viết vài dòng giới thiệu về bản thân..."
        leftIcon="document-text-outline"
        multiline
        numberOfLines={4}
      />
    </View>
  );

  const renderInterestsSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sở thích</Text>
        <TouchableOpacity onPress={() => setShowInterestsModal(true)}>
          <Text style={styles.editText}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.interestsContainer}>
        {userInfo.interests.length > 0 ? (
          userInfo.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noInterestsText}>Chưa có sở thích nào được chọn</Text>
        )}
      </View>
    </View>
  );

  const renderAvatarModal = () => (
    <Modal
      visible={showAvatarModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowAvatarModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Thay đổi ảnh đại diện</Text>
          <TouchableOpacity onPress={() => setShowAvatarModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.avatarOptions}>
          <TouchableOpacity 
            style={styles.avatarOption}
            onPress={() => selectAvatarOption('camera')}
          >
            <View style={styles.avatarOptionIcon}>
              <Ionicons name="camera" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.avatarOptionText}>Chụp ảnh</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.avatarOption}
            onPress={() => selectAvatarOption('gallery')}
          >
            <View style={styles.avatarOptionIcon}>
              <Ionicons name="images" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.avatarOptionText}>Chọn từ thư viện</Text>
          </TouchableOpacity>

          {userInfo.avatar && (
            <TouchableOpacity 
              style={styles.avatarOption}
              onPress={() => selectAvatarOption('remove')}
            >
              <View style={[styles.avatarOptionIcon, { backgroundColor: COLORS.danger + '15' }]}>
                <Ionicons name="trash" size={24} color={COLORS.danger} />
              </View>
              <Text style={[styles.avatarOptionText, { color: COLORS.danger }]}>Xóa ảnh</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderGenderModal = () => (
    <Modal
      visible={showGenderModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowGenderModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Chọn giới tính</Text>
          <TouchableOpacity onPress={() => setShowGenderModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.modalContent}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.genderOption,
                userInfo.gender === option.value && styles.genderOptionSelected
              ]}
              onPress={() => {
                setUserInfo({...userInfo, gender: option.value});
                setShowGenderModal(false);
              }}
            >
              <Text style={[
                styles.genderOptionText,
                userInfo.gender === option.value && styles.genderOptionTextSelected
              ]}>
                {option.label}
              </Text>
              {userInfo.gender === option.value && (
                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderInterestsModal = () => (
    <Modal
      visible={showInterestsModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowInterestsModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Chọn sở thích</Text>
          <TouchableOpacity onPress={() => setShowInterestsModal(false)}>
            <Text style={styles.saveText}>Xong</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <Text style={styles.interestsHint}>
            Chọn các lĩnh vực bạn quan tâm để chúng tôi có thể gợi ý khóa học phù hợp
          </Text>
          
          <View style={styles.interestsGrid}>
            {availableInterests.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestOptionTag,
                  userInfo.interests.includes(interest) && styles.interestOptionTagSelected
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[
                  styles.interestOptionText,
                  userInfo.interests.includes(interest) && styles.interestOptionTextSelected
                ]}>
                  {interest}
                </Text>
                {userInfo.interests.includes(interest) && (
                  <Ionicons name="checkmark" size={16} color={COLORS.white} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {renderHeader()}

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderAvatarSection()}
        {renderBasicInfo()}
        {renderContactInfo()}
        {renderProfessionalInfo()}
        {renderInterestsSection()}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomButton}>
        <CustomButton
          title="Lưu thay đổi"
          onPress={handleSave}
          loading={isLoading}
          style={styles.saveButton}
        />
      </View>

      {/* Modals */}
      {renderAvatarModal()}
      {renderGenderModal()}
      {renderInterestsModal()}
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
  saveText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: COLORS.white,
  },
  avatarGradient: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  avatarHint: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
  },

  // Section Styles
  section: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Gender Selector
  genderSelector: {
    marginBottom: 20,
  },
  genderSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  genderSelectorText: {
    flex: 1,
    marginLeft: 12,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  genderValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  // Interests
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  interestText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  noInterestsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },

  // Bottom Button
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButton: {
    borderRadius: 12,
  },

  // Modal Styles
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
  modalContent: {
    flex: 1,
    padding: 16,
  },

  // Avatar Options
  avatarOptions: {
    padding: 20,
    gap: 16,
  },
  avatarOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarOptionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },

  // Gender Options
  genderOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 8,
  },
  genderOptionSelected: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  genderOptionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  genderOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Interests Modal
  interestsHint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestOptionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  interestOptionTagSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  interestOptionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  interestOptionTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default EditProfileScreen;