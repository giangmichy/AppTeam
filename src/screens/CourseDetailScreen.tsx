import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Modal,
  Share,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import CustomButton from '../components/CustomButton';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  Home: undefined;
  CourseDetail: { courseId: string };
  ReviewDetail: { courseId: string };
  VideoPlayer: { videoUrl: string; title: string };
};

type CourseDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CourseDetail'>;

// Mock data for course detail
const courseData = {
  id: '1',
  title: 'Lập Trình Python Từ Cơ Bản Đến Nâng Cao Trong 30 Ngày',
  instructor: {
    id: '1',
    name: 'AI Coding',
    title: 'Senior AI Engineer',
    avatar: 'https://picsum.photos/100/100?random=instructor',
    rating: 4.8,
    students: 9574,
    courses: 2,
    bio: 'Mình từng học Kỹ sư tại năng tại Đại Học Bách khoa Hà Nội trong 2 năm. Sau đó mình đi du học và tốt nghiệp thạc sĩ vật lý tại nhân tại trường trong những ngôi trường tốt nhất tại liên bang Nga. Sau đó, mình có cơ hội làm việc trong lĩnh vực công nghệ thông tin, biến đuyên tự hình mành cảnh và hiển tại mình đang là Senior AI Engineer.',
  },
  rating: 4.9,
  reviewCount: 421,
  price: 269000,
  originalPrice: 1079000,
  discount: 75,
  image: 'https://picsum.photos/400/250?random=course',
  videoTrailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  description: 'Chinh Phục Python Trong 30 Ngày. Từ Cơ Bản Đến Nâng Cao (Tiếng Việt) - Lập trình Python',
  isBestSeller: true,
  language: 'Tiếng Việt',
  lastUpdated: '7/2025',
  duration: '15 giờ',
  articles: 9,
  resources: 3,
  certificate: true,
  lifetime: true,
  mobileAccess: true,
  requirements: [
    'Không cần kinh nghiệm lập trình - Bạn sẽ được chỉ sẽ mọi thứ cần biết',
    'Máy tính có kết nối internet',
    'Chỉ cần bạn chịu khó lắm theohe yầu cần và thực hành, bạn sẽ nắm vững kiến thức'
  ],
  content: `Chào mừng đến với khóa học: Lập Trình Python Từ Cơ Bản Đến Nâng Cao Trong 30 Ngày

GIỚI THIỆU GIẢNG VIÊN
Mình là một Senior AI Engineer, đã có nhiều năm kinh nghiệm trong lĩnh vực Machine Learning, Deep Learning, và phát triển phần mềm. Qua các dự án thực tế, mình nhận ra việc học không chỉ về lý thuyết mà còn về thực hành. Khởi đầu từ những kiến thức cơ bản, hệ thống học và hiểu bản chất vần đề. Chính vì thế, mình đã thiết kế khóa học này để đơn giản hóa kỹ thuật học Python, giúp bạn nắm vững kiến thức nhanh chóng và áp dụng được vào thực tế.

Khóa học không chỉ dừng lại ở lý thuyết, mình sẽ đồng hành cùng bạn qua từng bài học thực hành và áp dụng các kỹ thuật cũng có kiến thức cơ bản và nền tảng vững chắc để có thể thực hiện.

Và khóa học Lập Trình Python Từ Cơ Bản Đến Nâng Cao Trong 30 Ngày
Nếu bạn là người mới bắt đầu, khóa học này sẽ giúp bạn làm quen với ngôn ngữ Python và muốn hoàn thiện kỹ năng, nếu bạn đang muốn chuyển ngành sang Công nghệ thông tin để trở thành một lập trình viên thì nắm vững được các Concept lý thuyết tốt sẽ giúp bạn cung cấp cho bạn mọi thứ từ những kiến thức cơ bản nhất. Hãy luôn giữ đầu mẽ và nhẫt huyết, thành công sẽ đến với chúng ta !`,
  whatYouWillLearn: [
    'Nền tảng Python vững chắc để học tập AI, Data Science hay lập trình Web',
    'Kiến thức toàn diện về Python, bắt đầu với biến, kiểu dữ liệu, chuỗi, các phép toán',
    'Khám phá cách sử dụng cấu trúc điều khiển, vòng lặp, hàm, xử lý file',
    'Quản lý môi trường lập trình với virtual environment, quản lý các gói trong Python',
    'Các kỹ năm năng cao như xử lý, biểu thức chính quy, giúp tối ưu hoá qua trình viết code',
    'Lập trình hướng đối tượng trong Python'
  ],
  includes: [
    { icon: 'play-circle', text: '15 giờ video theo yêu cầu' },
    { icon: 'document-text', text: '9 bài viết' },
    { icon: 'cloud-download', text: '3 tài nguyên có thể tải xuống' },
    { icon: 'tv', text: 'Truy cập trên thiết bị di động và TV' },
    { icon: 'infinite', text: 'Quyền truy cập đầy đủ suốt đời' },
    { icon: 'ribbon', text: 'Giấy chứng nhận hoàn thành' }
  ]
};

// Mock curriculum data
const curriculumData = [
  {
    id: '1',
    title: 'Introduction',
    duration: '31 phút • 3 bài giảng',
    lessons: [
      { id: '1-1', title: 'Introduction - Giới thiệu giảng viên', duration: '10:30', preview: true },
      { id: '1-2', title: 'Khóa học này dành cho ai', duration: '8:45', preview: false },
      { id: '1-3', title: 'Lộ trình chinh phục Python trong 30 ngày', duration: '12:15', preview: true }
    ]
  },
  {
    id: '2',
    title: 'Cài đặt môi trường lập trình Python',
    duration: '45 phút • 5 bài giảng',
    lessons: [
      { id: '2-1', title: 'Cài đặt Python và VSCode trên Window', duration: '15:20', preview: false },
      { id: '2-2', title: 'Link tải Python và VSCode', duration: '5:30', preview: false },
      { id: '2-3', title: 'VSCode tips and tricks - Nhật Đình Phải Xem', duration: '12:45', preview: false },
      { id: '2-4', title: 'VSCode tips and tricks - Phần 2', duration: '8:30', preview: false },
      { id: '2-5', title: 'Chia sẻ - Sharing', duration: '3:15', preview: false }
    ]
  },
  {
    id: '3',
    title: 'Biến và Kiểu dữ liệu (Variables and Data types)',
    duration: '62 phút • 7 bài giảng',
    lessons: [
      { id: '3-1', title: 'Khai niệm về Biến và Kiểu dữ liệu', duration: '12:30', preview: false },
      { id: '3-2', title: 'Thực hành các kiểu dữ liệu số', duration: '15:20', preview: false },
      { id: '3-3', title: 'Cấu trúc và Kiểu dữ liệu', duration: '18:45', preview: false },
      { id: '3-4', title: 'Tổng quan về các phép toán số học', duration: '8:30', preview: true },
      { id: '3-5', title: 'Các phép toán cộng trừ nhân chia', duration: '6:45', preview: false }
    ]
  }
];

// Mock related courses
const relatedCourses = [
  {
    id: '2',
    title: 'Lập trình Python AI',
    instructor: 'AI Coding',
    rating: 4.9,
    price: 259000,
    originalPrice: 999000,
    image: 'https://picsum.photos/150/100?random=2',
    students: 945
  },
  {
    id: '3',
    title: 'Python & AI cho Phân tích dữ liệu Tài chính Kế Toán 2025',
    instructor: 'Data Academy',
    rating: 4.7,
    price: 269000,
    originalPrice: 899000,
    image: 'https://picsum.photos/150/100?random=3',
    students: 2128
  },
  {
    id: '4',
    title: 'Excel & AI trong Phân tích dữ liệu doanh nghiệp 2025',
    instructor: 'Business Pro',
    rating: 4.8,
    price: 269000,
    originalPrice: 799000,
    image: 'https://picsum.photos/150/100?random=4',
    students: 1438
  }
];

// Mock reviews data
const reviewsData = [
  {
    id: '1',
    user: {
      name: 'Võ Hoàng A.',
      avatar: 'https://picsum.photos/50/50?random=user1'
    },
    rating: 5,
    date: '1 tháng trước',
    comment: 'Rất tốt nhưng có một số phần vì dụ nữ vẫn chưa khai thác hết và số dụng thuật ngữ quên giải thích kha khó hiểu phải đem sang AI giải thích mới hiểu. Mặt khói gian kha nhiều ở các bài thự file, lớp và đối tượng, higher order function.... Nếu cải thiện chỗ này nó sẽ càng tốt hơn.'
  },
  {
    id: '2',
    user: {
      name: 'Chien N.',
      avatar: 'https://picsum.photos/50/50?random=user2'
    },
    rating: 5,
    date: '1 tháng trước',
    comment: 'khóa học này phù hợp với các bạn mới bắt đầu làm quen với Python. mặc dù là các nội dung cơ bản và mang tính giới thiệu, nhưng mình cũng đã biết được nhiều kiến thức mới từ phần 26 trở đi.'
  },
  {
    id: '3',
    user: {
      name: 'Trà N.',
      avatar: 'https://picsum.photos/50/50?random=user3'
    },
    rating: 4,
    date: '2 tháng trước',
    comment: 'Khóa học rất chi tiết và dễ hiểu. Giảng viên giải thích rất kỹ từng concept. Tuy nhiên có một số bài hơi dài, mong được chia nhỏ hơn để dễ theo dõi.'
  }
];

const CourseDetailScreen = () => {
  const navigation = useNavigation<CourseDetailScreenNavigationProp>();
  const route = useRoute();
  const { t } = useTranslation();
  
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullRequirements, setShowFullRequirements] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${courseData.title} - ${courseData.instructor.name}`,
        url: 'https://example.com/course/' + courseData.id,
      });
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddToCart = () => {
    Alert.alert(t('courseDetail.success'), t('courseDetail.addedToCart'));
  };

  const handleBuyNow = () => {
    Alert.alert(t('courseDetail.buyNow'), t('courseDetail.redirectToPayment'));
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      t('courseDetail.success'), 
      isFavorite ? t('courseDetail.removedFromFavorites') : t('courseDetail.addedToFavorites')
    );
  };

  const renderStars = (rating: number, size: number = 12) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={size} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={size} color="#FFD700" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={size} color="#FFD700" />);
    }

    return stars;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  const renderVideoSection = () => (
    <View style={styles.videoContainer}>
      <TouchableOpacity 
        style={styles.videoThumbnail}
        onPress={() => setShowVideoModal(true)}
      >
        <Image source={{ uri: courseData.image }} style={styles.videoImage} />
        <View style={styles.playButton}>
          <Ionicons name="play" size={32} color={COLORS.white} />
        </View>
        <View style={styles.previewLabel}>
          <Text style={styles.previewText}>{t('courseDetail.preview')}</Text>
        </View>
      </TouchableOpacity>
      
      {/* Header buttons */}
      <View style={styles.videoHeader}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setShowShareModal(true)}
        >
          <Ionicons name="share-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCourseInfo = () => (
    <View style={styles.courseInfoContainer}>
      <View style={styles.courseHeader}>
        {courseData.isBestSeller && (
          <View style={styles.bestSellerBadge}>
            <Text style={styles.bestSellerText}>{t('courseDetail.bestSeller')}</Text>
          </View>
        )}
        <Text style={styles.courseTitle}>{courseData.title}</Text>
        <Text style={styles.courseDescription}>{courseData.description}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{courseData.rating}</Text>
          <View style={styles.starsContainer}>
            {renderStars(courseData.rating, 14)}
          </View>
          <Text style={styles.reviewText}>({courseData.reviewCount} {t('courseDetail.reviews')})</Text>
        </View>

        <View style={styles.courseMetaContainer}>
          <View style={styles.courseMeta}>
            <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{courseData.instructor.name}</Text>
          </View>
          <View style={styles.courseMeta}>
            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{t('courseDetail.lastUpdated')} {courseData.lastUpdated}</Text>
          </View>
          <View style={styles.courseMeta}>
            <Ionicons name="globe-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{courseData.language}</Text>
          </View>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.currentPrice}>{formatPrice(courseData.price)}</Text>
        <Text style={styles.originalPrice}>{formatPrice(courseData.originalPrice)}</Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{courseData.discount}% {t('courseDetail.off')}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <CustomButton
          title={t('courseDetail.addToCart')}
          onPress={handleAddToCart}
          variant="outline"
          style={styles.addToCartButton}
        />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? COLORS.danger : COLORS.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      <CustomButton
        title={t('courseDetail.buyNow')}
        onPress={handleBuyNow}
        style={styles.buyNowButton}
      />
    </View>
  );

  const renderWhatYouWillLearn = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('courseDetail.whatYouWillLearn')}</Text>
      <View style={styles.learningPointsContainer}>
        {courseData.whatYouWillLearn.slice(0, showFullDescription ? undefined : 3).map((point, index) => (
          <View key={index} style={styles.learningPoint}>
            <Ionicons name="checkmark" size={16} color={COLORS.success} />
            <Text style={styles.learningPointText}>{point}</Text>
          </View>
        ))}
        {courseData.whatYouWillLearn.length > 3 && (
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={styles.showMoreText}>
              {showFullDescription ? t('courseDetail.showLess') : t('courseDetail.showMore')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCourseIncludes = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('courseDetail.courseIncludes')}</Text>
      <View style={styles.includesContainer}>
        {courseData.includes.map((item, index) => (
          <View key={index} style={styles.includeItem}>
            <Ionicons name={item.icon as any} size={18} color={COLORS.primary} />
            <Text style={styles.includeText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCurriculum = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('courseDetail.courseContent')}</Text>
      <Text style={styles.curriculumSubtitle}>
        {curriculumData.length} {t('courseDetail.sections')} • {courseData.duration} • {curriculumData.reduce((acc, section) => acc + section.lessons.length, 0)} {t('courseDetail.lectures')}
      </Text>
      
      <View style={styles.curriculumContainer}>
        {curriculumData.map((section) => (
          <View key={section.id} style={styles.curriculumSection}>
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.id)}
            >
              <View style={styles.sectionHeaderLeft}>
                <Ionicons 
                  name={expandedSections[section.id] ? "chevron-down" : "chevron-forward"} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
                <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
              </View>
              <Text style={styles.sectionDuration}>{section.duration}</Text>
            </TouchableOpacity>
            
            {expandedSections[section.id] && (
              <View style={styles.lessonsContainer}>
                {section.lessons.map((lesson) => (
                  <TouchableOpacity 
                    key={lesson.id} 
                    style={styles.lessonItem}
                    onPress={() => lesson.preview ? Alert.alert(t('courseDetail.preview'), lesson.title) : Alert.alert(t('courseDetail.locked'), t('courseDetail.enrollToAccess'))}
                  >
                    <View style={styles.lessonLeft}>
                      <Ionicons 
                        name={lesson.preview ? "play-circle" : "lock-closed"} 
                        size={16} 
                        color={lesson.preview ? COLORS.primary : COLORS.textSecondary} 
                      />
                      <Text style={[styles.lessonTitle, !lesson.preview && styles.lockedLesson]}>
                        {lesson.title}
                      </Text>
                    </View>
                    <View style={styles.lessonRight}>
                      {lesson.preview && (
                        <View style={styles.previewBadge}>
                          <Text style={styles.previewBadgeText}>{t('courseDetail.preview')}</Text>
                        </View>
                      )}
                      <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderRequirements = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('courseDetail.requirements')}</Text>
      <View style={styles.requirementsContainer}>
        {courseData.requirements.slice(0, showFullRequirements ? undefined : 2).map((requirement, index) => (
          <View key={index} style={styles.requirementItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.requirementText}>{requirement}</Text>
          </View>
        ))}
        {courseData.requirements.length > 2 && (
          <TouchableOpacity onPress={() => setShowFullRequirements(!showFullRequirements)}>
            <Text style={styles.showMoreText}>
              {showFullRequirements ? t('courseDetail.showLess') : t('courseDetail.showMore')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderDescription = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('courseDetail.description')}</Text>
      <Text style={styles.descriptionText} numberOfLines={showFullDescription ? undefined : 5}>
        {courseData.content}
      </Text>
      <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
        <Text style={styles.showMoreText}>
          {showFullDescription ? t('courseDetail.showLess') : t('courseDetail.showMore')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderRelatedCourses = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('courseDetail.relatedCourses')}</Text>
      <FlatList
        data={relatedCourses}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.relatedCourseCard}>
            <Image source={{ uri: item.image }} style={styles.relatedCourseImage} />
            <View style={styles.relatedCourseInfo}>
              <Text style={styles.relatedCourseTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.relatedCourseInstructor}>{item.instructor}</Text>
              <View style={styles.relatedCourseRating}>
                <Text style={styles.ratingText}>{item.rating}</Text>
                <View style={styles.starsContainer}>
                  {renderStars(item.rating, 12)}
                </View>
                <Text style={styles.studentCount}>({item.students})</Text>
              </View>
              <View style={styles.relatedCoursePricing}>
                <Text style={styles.relatedCurrentPrice}>{formatPrice(item.price)}</Text>
                <Text style={styles.relatedOriginalPrice}>{formatPrice(item.originalPrice)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.relatedCoursesList}
      />
    </View>
  );

  const renderInstructor = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('courseDetail.instructor')}</Text>
      <View style={styles.instructorContainer}>
        <View style={styles.instructorHeader}>
          <Image source={{ uri: courseData.instructor.avatar }} style={styles.instructorAvatar} />
          <View style={styles.instructorInfo}>
            <Text style={styles.instructorName}>{courseData.instructor.name}</Text>
            <Text style={styles.instructorTitle}>{courseData.instructor.title}</Text>
            <View style={styles.instructorStats}>
              <View style={styles.instructorStat}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.instructorStatText}>{courseData.instructor.rating} {t('courseDetail.instructorRating')}</Text>
              </View>
              <View style={styles.instructorStat}>
                <Ionicons name="people" size={16} color={COLORS.textSecondary} />
                <Text style={styles.instructorStatText}>{courseData.instructor.students.toLocaleString()} {t('courseDetail.students')}</Text>
              </View>
              <View style={styles.instructorStat}>
                <Ionicons name="play-circle" size={16} color={COLORS.textSecondary} />
                <Text style={styles.instructorStatText}>{courseData.instructor.courses} {t('courseDetail.courses')}</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.instructorBio} numberOfLines={3}>
          {courseData.instructor.bio}
        </Text>
        <TouchableOpacity onPress={() => setShowInstructorModal(true)}>
          <Text style={styles.viewProfileText}>{t('courseDetail.viewProfile')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.reviewsHeader}>
        <Text style={styles.sectionTitle}>{t('courseDetail.studentFeedback')}</Text>
        <View style={styles.overallRating}>
          <View style={styles.ratingDisplay}>
            <Ionicons name="star" size={24} color="#FFD700" />
            <Text style={styles.overallRatingText}>{courseData.rating}</Text>
          </View>
          <Text style={styles.reviewCountText}>
            {courseData.reviewCount} {t('courseDetail.ratings')}
          </Text>
        </View>
      </View>
      
      <FlatList
        data={reviewsData}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: item.user.avatar }} style={styles.reviewerAvatar} />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>{item.user.name}</Text>
                <View style={styles.reviewRating}>
                  {renderStars(item.rating, 14)}
                  <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
            <View style={styles.reviewActions}>
              <TouchableOpacity style={styles.reviewAction}>
                <Ionicons name="thumbs-up-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.reviewActionText}>{t('courseDetail.helpful')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reviewAction}>
                <Ionicons name="flag-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.reviewActionText}>{t('courseDetail.report')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.reviewsList}
      />
      
      <TouchableOpacity 
        style={styles.showAllReviewsButton}
        onPress={() => navigation.navigate('ReviewDetail' as any, { courseId: courseData.id })}
      >
        <Text style={styles.showAllReviewsText}>{t('courseDetail.showAllReviews')}</Text>
      </TouchableOpacity>
    </View>
  );

  // Modal Components
  const renderShareModal = () => (
    <Modal
      visible={showShareModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowShareModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{t('courseDetail.shareCourse')}</Text>
          <TouchableOpacity onPress={() => setShowShareModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.shareOptions}>
          <TouchableOpacity style={styles.shareOption} onPress={handleShare}>
            <Ionicons name="link" size={24} color={COLORS.primary} />
            <Text style={styles.shareOptionText}>{t('courseDetail.copyLink')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareOption}>
            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            <Text style={styles.shareOptionText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareOption}>
            <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            <Text style={styles.shareOptionText}>Twitter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderInstructorModal = () => (
    <Modal
      visible={showInstructorModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowInstructorModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{t('courseDetail.instructorProfile')}</Text>
          <TouchableOpacity onPress={() => setShowInstructorModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.instructorModalContent}>
          <View style={styles.instructorModalHeader}>
            <Image source={{ uri: courseData.instructor.avatar }} style={styles.instructorModalAvatar} />
            <Text style={styles.instructorModalName}>{courseData.instructor.name}</Text>
            <Text style={styles.instructorModalTitle}>{courseData.instructor.title}</Text>
            
            <View style={styles.instructorModalStats}>
              <View style={styles.instructorModalStat}>
                <Text style={styles.statNumber}>{courseData.instructor.rating}</Text>
                <Text style={styles.statLabel}>{t('courseDetail.instructorRating')}</Text>
              </View>
              <View style={styles.instructorModalStat}>
                <Text style={styles.statNumber}>{courseData.instructor.students.toLocaleString()}</Text>
                <Text style={styles.statLabel}>{t('courseDetail.students')}</Text>
              </View>
              <View style={styles.instructorModalStat}>
                <Text style={styles.statNumber}>{courseData.instructor.courses}</Text>
                <Text style={styles.statLabel}>{t('courseDetail.courses')}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.instructorModalBio}>
            <Text style={styles.instructorModalBioTitle}>{t('courseDetail.about')}</Text>
            <Text style={styles.instructorModalBioText}>{courseData.instructor.bio}</Text>
          </View>
          
          <View style={styles.instructorCourses}>
            <Text style={styles.instructorCoursesTitle}>{t('courseDetail.otherCourses')}</Text>
            {relatedCourses.slice(0, 2).map((course) => (
              <TouchableOpacity key={course.id} style={styles.instructorCourseCard}>
                <Image source={{ uri: course.image }} style={styles.instructorCourseImage} />
                <View style={styles.instructorCourseInfo}>
                  <Text style={styles.instructorCourseTitle}>{course.title}</Text>
                  <View style={styles.instructorCourseRating}>
                    <Text style={styles.ratingText}>{course.rating}</Text>
                    <View style={styles.starsContainer}>
                      {renderStars(course.rating, 12)}
                    </View>
                    <Text style={styles.studentCount}>({course.students})</Text>
                  </View>
                  <Text style={styles.instructorCoursePrice}>{formatPrice(course.price)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderVideoModal = () => (
    <Modal
      visible={showVideoModal}
      animationType="fade"
      onRequestClose={() => setShowVideoModal(false)}
    >
      <View style={styles.videoModalContainer}>
        <TouchableOpacity 
          style={styles.videoModalClose}
          onPress={() => setShowVideoModal(false)}
        >
          <Ionicons name="close" size={30} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.videoPlayer}>
          <Image source={{ uri: courseData.image }} style={styles.videoPlayerImage} />
          <View style={styles.videoPlayerOverlay}>
            <Ionicons name="play-circle" size={80} color={COLORS.white} />
            <Text style={styles.videoPlayerTitle}>{courseData.title}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {renderVideoSection()}
        {renderCourseInfo()}
        {renderWhatYouWillLearn()}
        {renderCourseIncludes()}
        {renderCurriculum()}
        {renderRequirements()}
        {renderDescription()}
        {renderRelatedCourses()}
        {renderInstructor()}
        {renderReviews()}
      </ScrollView>

      {/* Modals */}
      {renderShareModal()}
      {renderInstructorModal()}
      {renderVideoModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  
  // Video Section
  videoContainer: {
    position: 'relative',
    height: 250,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewLabel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  previewText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  videoHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Course Info Section
  courseInfoContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  courseHeader: {
    marginBottom: 20,
  },
  bestSellerBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  bestSellerText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 26,
  },
  courseDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warning,
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  courseMetaContainer: {
    gap: 8,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  originalPrice: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowButton: {
    borderRadius: 8,
  },

  // Section Container
  sectionContainer: {
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

  // What You Will Learn Section
  learningPointsContainer: {
    gap: 12,
  },
  learningPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  learningPointText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },

  // Course Includes Section
  includesContainer: {
    gap: 12,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  includeText: {
    fontSize: 14,
    color: COLORS.text,
  },

  // Curriculum Section
  curriculumSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  curriculumContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  curriculumSection: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.gray50,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  sectionDuration: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  lessonsContainer: {
    backgroundColor: COLORS.white,
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  lessonTitle: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  lockedLesson: {
    color: COLORS.textSecondary,
  },
  lessonRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lessonDuration: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  previewBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  previewBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },

  // Requirements Section
  requirementsContainer: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.text,
    marginTop: 7,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },

  // Description Section
  descriptionText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 12,
  },

  // Related Courses Section
  relatedCoursesList: {
    paddingRight: 20,
  },
  relatedCourseCard: {
    width: 280,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  relatedCourseImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  relatedCourseInfo: {
    padding: 16,
  },
  relatedCourseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 18,
  },
  relatedCourseInstructor: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  relatedCourseRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  studentCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  relatedCoursePricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  relatedCurrentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  relatedOriginalPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },

  // Instructor Section
  instructorContainer: {
    gap: 16,
  },
  instructorHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  instructorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  instructorInfo: {
    flex: 1,
    gap: 4,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  instructorTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  instructorStats: {
    gap: 4,
  },
  instructorStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  instructorStatText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  instructorBio: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  viewProfileText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 8,
  },

  // Reviews Section
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overallRating: {
    alignItems: 'center',
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overallRatingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  reviewCountText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  reviewsList: {
    paddingRight: 20,
  },
  reviewCard: {
    width: 300,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  reviewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewActionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  showAllReviewsButton: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  showAllReviewsText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  // Share Modal
  shareOptions: {
    padding: 20,
    gap: 20,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
  },
  shareOptionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },

  // Instructor Modal
  instructorModalContent: {
    flex: 1,
    padding: 20,
  },
  instructorModalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  instructorModalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  instructorModalName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  instructorModalTitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  instructorModalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  instructorModalStat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  instructorModalBio: {
    marginBottom: 24,
  },
  instructorModalBioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  instructorModalBioText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
  instructorCourses: {
    gap: 16,
  },
  instructorCoursesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  instructorCourseCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  instructorCourseImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  instructorCourseInfo: {
    flex: 1,
    gap: 4,
  },
  instructorCourseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 18,
  },
  instructorCourseRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  instructorCoursePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  // Video Modal
  videoModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoModalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayer: {
    width: width * 0.9,
    height: (width * 0.9) * (9/16),
    position: 'relative',
  },
  videoPlayerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  videoPlayerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  videoPlayerTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // Common
  showMoreText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default CourseDetailScreen;