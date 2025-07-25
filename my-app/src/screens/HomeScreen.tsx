import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define navigation types
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const COLORS = {
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

const { width } = Dimensions.get('window');

// Mock data
const categories = [
  'Phát triển/Lập trình',
  'Kinh doanh',
  'Thiết kế',
  'Marketing',
  'CNTT & Phần mềm',
  'Phát triển cá nhân',
  'Phong cách sống',
  'Nhiếp ảnh',
  'Âm nhạc',
];

const allCategories = [
  { id: 1, name: 'Phát triển/Lập trình', icon: 'code-slash', color: COLORS.primary },
  { id: 2, name: 'Kinh doanh', icon: 'business', color: COLORS.success },
  { id: 3, name: 'Thiết kế', icon: 'color-palette', color: COLORS.accent },
  { id: 4, name: 'Marketing', icon: 'megaphone', color: COLORS.warning },
  { id: 5, name: 'CNTT & Phần mềm', icon: 'desktop', color: COLORS.info },
  { id: 6, name: 'Phát triển cá nhân', icon: 'person', color: COLORS.secondary },
  { id: 7, name: 'Phong cách sống', icon: 'heart', color: COLORS.danger },
  { id: 8, name: 'Nhiếp ảnh', icon: 'camera', color: COLORS.primaryDark },
  { id: 9, name: 'Âm nhạc', icon: 'musical-notes', color: COLORS.gradientStart },
  { id: 10, name: 'Ngoại ngữ', icon: 'language', color: COLORS.gradientEnd },
  { id: 11, name: 'Sức khỏe & Thể thao', icon: 'fitness', color: COLORS.success },
  { id: 12, name: 'Khoa học & Công nghệ', icon: 'flask', color: COLORS.primary },
  { id: 13, name: 'Tài chính', icon: 'card', color: COLORS.warning },
  { id: 14, name: 'Giáo dục', icon: 'school', color: COLORS.accent },
  { id: 15, name: 'Nghệ thuật', icon: 'brush', color: COLORS.secondary },
  { id: 16, name: 'Du lịch', icon: 'airplane', color: COLORS.info },
];

// Banner data
const banners = [
  {
    id: 1,
    title: 'Không ngừng phát triển',
    subtitle: 'Học các kỹ năng bạn cần để thực hiện bước tiếp theo — và từng bước sau đó. Các khóa học có giá từ 249.000 ₫. Ưu đãi sẽ kết thúc hôm nay.',
    icon: 'school',
    gradient: [COLORS.primary, COLORS.primaryDark],
  },
  {
    id: 2,
    title: 'Khóa học mới nhất',
    subtitle: 'Cập nhật xu hướng công nghệ mới nhất với hơn 1000+ khóa học chất lượng cao. Học từ chuyên gia hàng đầu với giá ưu đãi.',
    icon: 'trending-up',
    gradient: [COLORS.success, '#059669'],
  },
  {
    id: 3,
    title: 'Chứng chỉ quốc tế',
    subtitle: 'Nhận chứng chỉ được công nhận toàn cầu sau khi hoàn thành khóa học. Nâng cao giá trị CV và cơ hội nghề nghiệp.',
    icon: 'ribbon',
    gradient: [COLORS.warning, '#D97706'],
  },
  {
    id: 4,
    title: 'Học mọi lúc mọi nơi',
    subtitle: 'Truy cập khóa học 24/7 trên mọi thiết bị. Download video để học offline. Hỗ trợ học tập linh hoạt theo lịch trình của bạn.',
    icon: 'phone-portrait',
    gradient: [COLORS.accent, COLORS.secondary],
  },
];

const featuredCourses = {
  design: [
    {
      id: '1',
      title: 'Canva 101 - Làm chủ kỹ năng thiết kế Canva cho người mới',
      instructor: 'Skill Sharing School, Le Phuong Thanh, Nguyen Van A',
      rating: 4.6,
      reviews: 104,
      price: 249000,
      originalPrice: 999000,
      image: 'https://picsum.photos/200/120?random=1',
      tag: 'Bán chạy nhất'
    },
    {
      id: '2',
      title: 'Figmarketing | Khóa học figma cơ bản cho thiết kế marketing',
      instructor: 'TELOS Academy, Luu Trong Nhan',
      rating: 5.0,
      reviews: 152,
      price: 399000,
      originalPrice: 0,
      image: 'https://picsum.photos/200/120?random=2',
    },
    {
      id: '3',
      title: 'Photoshop từ cơ bản đến nâng cao',
      instructor: 'Design Academy, Tran Minh Duc',
      rating: 4.8,
      reviews: 98,
      price: 349000,
      originalPrice: 899000,
      image: 'https://picsum.photos/200/120?random=3',
    },
    {
      id: '4',
      title: 'UI/UX Design Complete Course',
      instructor: 'Tech Design School',
      rating: 4.7,
      reviews: 203,
      price: 299000,
      originalPrice: 799000,
      image: 'https://picsum.photos/200/120?random=4',
    },
    {
      id: '5',
      title: 'Illustrator Master Class',
      instructor: 'Creative Studio',
      rating: 4.5,
      reviews: 87,
      price: 279000,
      originalPrice: 699000,
      image: 'https://picsum.photos/200/120?random=5',
    }
  ],
  business: [
    {
      id: '6',
      title: 'AI Automation Cơ Bản với N8N - Làm Ngay',
      instructor: 'Nguyen Trong Quan',
      rating: 4.2,
      reviews: 47,
      price: 249000,
      originalPrice: 699000,
      image: 'https://picsum.photos/200/120?random=6',
    },
    {
      id: '7',
      title: 'Giới Thiệu Product Owner trong Mô Hình Agile - Scrum | PSPO',
      instructor: 'Nguyen Van Trung Kien',
      rating: 5.0,
      reviews: 66,
      price: 249000,
      originalPrice: 899000,
      image: 'https://picsum.photos/200/120?random=7',
    },
    {
      id: '8',
      title: 'Digital Marketing từ A-Z',
      instructor: 'Marketing Pro Academy',
      rating: 4.6,
      reviews: 156,
      price: 399000,
      originalPrice: 999000,
      image: 'https://picsum.photos/200/120?random=8',
    },
    {
      id: '9',
      title: 'Khởi nghiệp thành công',
      instructor: 'Startup Hub Vietnam',
      rating: 4.4,
      reviews: 89,
      price: 329000,
      originalPrice: 799000,
      image: 'https://picsum.photos/200/120?random=9',
    },
    {
      id: '10',
      title: 'Excel chuyên nghiệp',
      instructor: 'Office Master',
      rating: 4.8,
      reviews: 234,
      price: 199000,
      originalPrice: 499000,
      image: 'https://picsum.photos/200/120?random=10',
    }
  ],
  development: [
    {
      id: '11',
      title: 'Vỡ lòng về Amazon Web Services',
      instructor: 'Thang Nguyen',
      rating: 4.9,
      reviews: 421,
      price: 249000,
      originalPrice: 699000,
      image: 'https://picsum.photos/200/120?random=11',
    },
    {
      id: '12',
      title: 'React Native từ cơ bản đến nâng cao',
      instructor: 'Mobile Dev Academy',
      rating: 4.7,
      reviews: 198,
      price: 399000,
      originalPrice: 999000,
      image: 'https://picsum.photos/200/120?random=12',
      tag: 'Mới nhất'
    },
    {
      id: '13',
      title: 'Node.js Backend Development',
      instructor: 'Backend Masters',
      rating: 4.6,
      reviews: 167,
      price: 349000,
      originalPrice: 899000,
      image: 'https://picsum.photos/200/120?random=13',
    },
    {
      id: '14',
      title: 'Python cho Data Science',
      instructor: 'Data Academy',
      rating: 4.8,
      reviews: 289,
      price: 299000,
      originalPrice: 799000,
      image: 'https://picsum.photos/200/120?random=14',
    },
    {
      id: '15',
      title: 'Full Stack Web Development',
      instructor: 'Code School Pro',
      rating: 4.5,
      reviews: 156,
      price: 449000,
      originalPrice: 1199000,
      image: 'https://picsum.photos/200/120?random=15',
    }
  ],
  personal: [
    {
      id: '16',
      title: 'Sigmund Freud: Phân tâm học và những giấc mơ',
      instructor: 'Nguyen Thi Ngoc Ha',
      rating: 4.6,
      reviews: 113,
      price: 249000,
      originalPrice: 399000,
      image: 'https://picsum.photos/200/120?random=16',
    },
    {
      id: '17',
      title: 'Học cách học: 6 trụ cột giúp bạn học bất cứ điều gì bạn muốn',
      instructor: 'GreenLearn VCA, Soma Ann',
      rating: 4.4,
      reviews: 353,
      price: 249000,
      originalPrice: 899000,
      image: 'https://picsum.photos/200/120?random=17',
    },
    {
      id: '18',
      title: 'Kỹ năng giao tiếp và thuyết trình',
      instructor: 'Communication Masters',
      rating: 4.7,
      reviews: 192,
      price: 279000,
      originalPrice: 599000,
      image: 'https://picsum.photos/200/120?random=18',
    },
    {
      id: '19',
      title: 'Quản lý thời gian hiệu quả',
      instructor: 'Productivity Pro',
      rating: 4.5,
      reviews: 87,
      price: 199000,
      originalPrice: 499000,
      image: 'https://picsum.photos/200/120?random=19',
    },
    {
      id: '20',
      title: 'Mindfulness và Thiền định',
      instructor: 'Wellness Academy',
      rating: 4.8,
      reviews: 124,
      price: 229000,
      originalPrice: 549000,
      image: 'https://picsum.photos/200/120?random=20',
    }
  ]
};

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [user, setUser] = useState<any>(null); // Mock user state - null means not logged in
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentBannerIndex + 1) % banners.length;
      setCurrentBannerIndex(nextIndex);
      bannerScrollRef.current?.scrollTo({
        x: nextIndex * (width - 32),
        animated: true,
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [currentBannerIndex]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#FFD700" />
      );
    }

    return stars;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  const renderCourseCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.courseCard}>
      <View style={styles.courseImageContainer}>
        <Image source={{ uri: item.image }} style={styles.courseImage} />
        {item.tag && (
          <View style={styles.courseTag}>
            <Text style={styles.courseTagText}>{item.tag}</Text>
          </View>
        )}
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.courseInstructor} numberOfLines={1}>
          {item.instructor}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <View style={styles.starsContainer}>
            {renderStars(item.rating)}
          </View>
          <Text style={styles.reviewsText}>({item.reviews})</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          {item.originalPrice > 0 && (
            <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryChip = (category: string, index: number) => (
    <TouchableOpacity key={index} style={styles.categoryChip}>
      <Text style={styles.categoryChipText}>{category}</Text>
    </TouchableOpacity>
  );

  const renderCourseSection = (title: string, courses: any[], highlightWord?: string) => (
    <View style={styles.courseSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {highlightWord ? (
            <>
              <Text>Các khóa học hàng đầu về </Text>
              <Text style={styles.highlightText}>{highlightWord}</Text>
            </>
          ) : (
            title
          )}
        </Text>
      </View>
      <FlatList
        data={courses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.coursesList}
      />
    </View>
  );

  const renderCategoryModal = () => (
    <Modal
      visible={showCategoriesModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowCategoriesModal(false)}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Tất cả thể loại</Text>
          <View style={styles.placeholder} />
        </View>
        <ScrollView style={styles.modalContent}>
          <View style={styles.categoriesGrid}>
            {allCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryItem, { backgroundColor: category.color + '15' }]}
                onPress={() => {
                  setShowCategoriesModal(false);
                  // Navigate to category screen
                }}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={24} color={COLORS.white} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
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
      
      {/* Header - Compact version without "Home" title */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {user ? (
            <>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color={COLORS.white} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>John Doe</Text>
                <Text style={styles.userLevel}>Học viên</Text>
              </View>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="cart-outline" size={24} color={COLORS.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={COLORS.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm khóa học..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={COLORS.gray400}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesHeader}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map(renderCategoryChip)}
            </ScrollView>
            <TouchableOpacity
              style={styles.seeAllCategoriesButton}
              onPress={() => setShowCategoriesModal(true)}
            >
              <Text style={styles.seeAllCategoriesText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <ScrollView
            ref={bannerScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const scrollPosition = event.nativeEvent.contentOffset.x;
              const index = Math.round(scrollPosition / (width - 32));
              if (index >= 0 && index < banners.length) {
                setCurrentBannerIndex(index);
              }
            }}
            contentContainerStyle={styles.bannerScrollContainer}
          >
            {banners.map((banner, index) => (
              <View key={banner.id} style={[styles.banner, { width: width - 32 }]}>
                <View style={[styles.bannerGradient, { backgroundColor: banner.gradient[0] }]}>
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                  </View>
                  <View style={styles.bannerImagePlaceholder}>
                    <Ionicons name="school" size={40} color={COLORS.white} />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          
          {/* Banner Dots */}
          <View style={styles.bannerPagination}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor: index === currentBannerIndex ? COLORS.primary : COLORS.gray300,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Course Sections */}
        {renderCourseSection('', featuredCourses.design, 'Thiết kế')}
        {renderCourseSection('', featuredCourses.business, 'Kinh doanh')}
        {renderCourseSection('', featuredCourses.development, 'CNTT & Phần mềm')}
        {renderCourseSection('', featuredCourses.personal, 'Phát triển cá nhân')}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="star" size={24} color={COLORS.primary} />
          <Text style={[styles.navText, { color: COLORS.primary }]}>Nổi bật</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="play-circle-outline" size={24} color={COLORS.gray400} />
          <Text style={styles.navText}>Học tập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color={COLORS.gray400} />
          <Text style={styles.navText}>Yêu thích</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color={COLORS.gray400} />
          <Text style={styles.navText}>Tài khoản</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Modal */}
      {renderCategoryModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  userLevel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  loginText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    position: 'relative',
    padding: 8,
    marginLeft: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  categoriesSection: {
    marginBottom: 16,
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  seeAllCategoriesButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  seeAllCategoriesText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoryChip: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  bannerScrollContainer: {
    alignItems: 'center',
  },
  banner: {
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 0,
  },
  bannerGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 140,
  },
  bannerContent: {
    flex: 1,
    marginRight: 16,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  bannerPrice: {
    fontWeight: '600',
    color: COLORS.white,
  },
  bannerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  bannerImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  courseSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  coursesList: {
    paddingHorizontal: 16,
  },
  courseCard: {
    width: 200,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseImageContainer: {
    position: 'relative',
  },
  courseImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  courseTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  courseTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
  },
  courseInfo: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  courseInstructor: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warning,
    marginRight: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: COLORS.gray400,
    marginTop: 4,
    fontWeight: '500',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    paddingTop: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: (width - 48) / 2,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default HomeScreen;