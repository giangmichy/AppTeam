import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/colors';

type RootStackParamList = {
  ReviewDetail: { courseId: string };
  CourseDetail: { courseId: string };
};

type ReviewDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReviewDetail'>;

// Extended mock reviews data
const allReviewsData = [
  {
    id: '1',
    user: {
      name: 'Võ Hoàng A.',
      avatar: 'https://picsum.photos/50/50?random=user1'
    },
    rating: 5,
    date: '1 tháng trước',
    comment: 'Rất tốt nhưng có một số phần vì dụ nữ vẫn chưa khai thác hết và số dụng thuật ngữ quên giải thích kha khó hiểu phải đem sang AI giải thích mới hiểu. Mặt khói gian kha nhiều ở các bài thự file, lớp và đối tượng, higher order function.... Nếu cải thiện chỗ này nó sẽ càng tốt hơn.',
    helpful: 12,
    replies: [
      {
        id: 'r1',
        user: 'AI Coding',
        role: 'instructor',
        date: '1 tháng trước',
        comment: 'Thank bạn nhiều đã ủng hộ ạ. Mình sẽ cải thiện thêm ạ, bạn nói rất hay và những phần đó khó hơn các phần khác lại. Chúc bạn tốt ngày vui vẻ.'
      }
    ]
  },
  {
    id: '2',
    user: {
      name: 'Chien N.',
      avatar: 'https://picsum.photos/50/50?random=user2'
    },
    rating: 5,
    date: '1 tháng trước',
    comment: 'khóa học này phù hợp với các bạn mới bắt đầu làm quen với Python. mặc dù là các nội dung cơ bản và mang tính giới thiệu, nhưng mình cũng đã biết được nhiều kiến thức mới từ phần 26 trở đi.',
    helpful: 8,
    replies: []
  },
  {
    id: '3',
    user: {
      name: 'Trà N.',
      avatar: 'https://picsum.photos/50/50?random=user3'
    },
    rating: 4,
    date: '2 tháng trước',
    comment: 'Khóa học rất chi tiết và dễ hiểu. Giảng viên giải thích rất kỹ từng concept. Tuy nhiên có một số bài hơi dài, mong được chia nhỏ hơn để dễ theo dõi.',
    helpful: 15,
    replies: []
  },
  {
    id: '4',
    user: {
      name: 'Minh Hoàng',
      avatar: 'https://picsum.photos/50/50?random=user4'
    },
    rating: 5,
    date: '2 tháng trước',
    comment: 'Excellent course! Rất phù hợp cho người mới bắt đầu. Code examples rất thực tế và dễ áp dụng. Đặc biệt phần về web scraping và data analysis rất hữu ích cho công việc hiện tại của mình.',
    helpful: 20,
    replies: []
  },
  {
    id: '5',
    user: {
      name: 'Thu Hương',
      avatar: 'https://picsum.photos/50/50?random=user5'
    },
    rating: 4,
    date: '3 tháng trước',
    comment: 'Khóa học tốt, giảng viên nhiệt tình. Chỉ có điều mong muốn có thêm bài tập thực hành nhiều hơn để củng cố kiến thức. Video chất lượng HD rất rõ nét.',
    helpful: 6,
    replies: []
  },
  {
    id: '6',
    user: {
      name: 'Đức Anh',
      avatar: 'https://picsum.photos/50/50?random=user6'
    },
    rating: 5,
    date: '3 tháng trước',
    comment: 'Tuyệt vời! Từ không biết gì về lập trình đến giờ có thể tự viết được những script Python đơn giản. Cảm ơn thầy rất nhiều. Chắc chắn sẽ tiếp tục học các khóa nâng cao.',
    helpful: 25,
    replies: [
      {
        id: 'r2',
        user: 'AI Coding',
        role: 'instructor',
        date: '3 tháng trước',
        comment: 'Cảm ơn bạn rất nhiều! Rất vui khi thấy bạn đã có thể áp dụng được kiến thức vào thực tế. Chúc bạn học tập tốt!'
      }
    ]
  },
  {
    id: '7',
    user: {
      name: 'Quỳnh Anh',
      avatar: 'https://picsum.photos/50/50?random=user7'
    },
    rating: 3,
    date: '4 tháng trước',
    comment: 'Nội dung ổn nhưng giọng nói hơi đơn điệu, đôi lúc khó tập trung. Mong thầy có thể cải thiện phần này. Kiến thức thì rất đầy đủ và chi tiết.',
    helpful: 3,
    replies: []
  },
  {
    id: '8',
    user: {
      name: 'Văn Thành',
      avatar: 'https://picsum.photos/50/50?random=user8'
    },
    rating: 5,
    date: '4 tháng trước',
    comment: 'Perfect cho ai muốn chuyển ngành sang IT. Mình đã apply được job Python developer sau khi hoàn thành khóa học này và khóa nâng cao. Highly recommended!',
    helpful: 30,
    replies: []
  },
  {
    id: '9',
    user: {
      name: 'Hải Yến',
      avatar: 'https://picsum.photos/50/50?random=user9'
    },
    rating: 4,
    date: '5 tháng trước',
    comment: 'Rất bổ ích! Đặc biệt là phần OOP và exception handling. Giảng viên giải thích rất dễ hiểu. Chỉ mong có thêm project thực tế để practice.',
    helpful: 11,
    replies: []
  },
  {
    id: '10',
    user: {
      name: 'Thanh Tùng',
      avatar: 'https://picsum.photos/50/50?random=user10'
    },
    rating: 5,
    date: '5 tháng trước',
    comment: 'Best Python course ever! Từ cơ bản đến nâng cao đều được giải thích rất kỹ. Support group cũng rất active và helpful. Worth every penny!',
    helpful: 18,
    replies: []
  }
];

const ratingBreakdown = {
  5: 78,
  4: 20,
  3: 2,
  2: 0,
  1: 0
};

const ReviewDetailScreen = () => {
  const navigation = useNavigation<ReviewDetailScreenNavigationProp>();
  const route = useRoute();
  const { t } = useTranslation();
  const { courseId } = route.params as { courseId: string };
  
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [expandedReviews, setExpandedReviews] = useState<{ [key: string]: boolean }>({});
  const [helpfulReviews, setHelpfulReviews] = useState<{ [key: string]: boolean }>({});

  const filterOptions = [
    { key: 'all', label: t('reviews.all') },
    { key: '4+', label: '4.0+' },
    { key: '3+', label: '3.0+' },
    { key: '<3', label: '< 3.0' },
  ];

  const getFilteredReviews = () => {
    let filtered = allReviewsData;

    // Filter by rating
    if (selectedFilter === '4+') {
      filtered = filtered.filter(review => review.rating >= 4);
    } else if (selectedFilter === '3+') {
      filtered = filtered.filter(review => review.rating >= 3);
    } else if (selectedFilter === '<3') {
      filtered = filtered.filter(review => review.rating < 3);
    }

    // Filter by search text
    if (searchText.trim()) {
      filtered = filtered.filter(review => 
        review.comment.toLowerCase().includes(searchText.toLowerCase()) ||
        review.user.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const toggleHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const renderStars = (rating: number, size: number = 14) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons 
          key={i} 
          name={i <= rating ? "star" : "star-outline"} 
          size={size} 
          color="#FFD700" 
        />
      );
    }
    return stars;
  };

  const calculateOverallRating = () => {
    const totalReviews = Object.values(ratingBreakdown).reduce((a, b) => a + b, 0);
    const weightedSum = Object.entries(ratingBreakdown).reduce((sum, [rating, count]) => {
      return sum + (parseInt(rating) * count);
    }, 0);
    return (weightedSum / totalReviews).toFixed(1);
  };

  const renderRatingBreakdown = () => (
    <View style={styles.ratingBreakdownContainer}>
      <View style={styles.overallRatingSection}>
        <View style={styles.ratingDisplay}>
          <Ionicons name="star" size={32} color="#FFD700" />
          <Text style={styles.overallRatingText}>{calculateOverallRating()}</Text>
        </View>
        <Text style={styles.ratingSubtext}>
          {Object.values(ratingBreakdown).reduce((a, b) => a + b, 0)} {t('reviews.ratings')}
        </Text>
      </View>
      
      <View style={styles.ratingBars}>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingBreakdown[star as keyof typeof ratingBreakdown];
          const total = Object.values(ratingBreakdown).reduce((a, b) => a + b, 0);
          const percentage = (count / total) * 100;
          
          return (
            <View key={star} style={styles.ratingBar}>
              <Text style={styles.ratingBarLabel}>{star}</Text>
              <Ionicons name="star" size={12} color="#FFD700" />
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${percentage}%` }]} />
              </View>
              <Text style={styles.ratingBarCount}>{percentage.toFixed(0)}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderReviewCard = ({ item }: { item: any }) => {
    const isExpanded = expandedReviews[item.id];
    const isHelpful = helpfulReviews[item.id];
    const shouldShowExpand = item.comment.length > 200;
    
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Image source={{ uri: item.user.avatar }} style={styles.reviewerAvatar} />
          <View style={styles.reviewerInfo}>
            <Text style={styles.reviewerName}>{item.user.name}</Text>
            <View style={styles.reviewRating}>
              <View style={styles.starsContainer}>
                {renderStars(item.rating)}
              </View>
              <Text style={styles.reviewDate}>{item.date}</Text>
            </View>
          </View>
        </View>
        
        <Text 
          style={styles.reviewComment}
          numberOfLines={isExpanded ? undefined : 4}
        >
          {item.comment}
        </Text>
        
        {shouldShowExpand && (
          <TouchableOpacity onPress={() => toggleReviewExpansion(item.id)}>
            <Text style={styles.expandText}>
              {isExpanded ? t('reviews.showLess') : t('reviews.readMore')}
            </Text>
          </TouchableOpacity>
        )}

        {/* Instructor Replies */}
        {item.replies && item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {item.replies.map((reply: any) => (
              <View key={reply.id} style={styles.replyCard}>
                <View style={styles.replyHeader}>
                  <View style={styles.instructorBadge}>
                    <Ionicons name="person" size={12} color={COLORS.white} />
                    <Text style={styles.instructorBadgeText}>{t('reviews.instructor')}</Text>
                  </View>
                  <Text style={styles.replyDate}>{reply.date}</Text>
                </View>
                <Text style={styles.replyComment}>{reply.comment}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.reviewActions}>
          <TouchableOpacity 
            style={styles.reviewAction}
            onPress={() => toggleHelpful(item.id)}
          >
            <Ionicons 
              name={isHelpful ? "thumbs-up" : "thumbs-up-outline"} 
              size={16} 
              color={isHelpful ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text style={[
              styles.reviewActionText,
              isHelpful && { color: COLORS.primary }
            ]}>
              {t('reviews.helpful')} ({item.helpful + (isHelpful ? 1 : 0)})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.reviewAction}>
            <Ionicons name="flag-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.reviewActionText}>{t('reviews.report')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredReviews = getFilteredReviews();

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
        <Text style={styles.headerTitle}>{t('reviews.studentFeedback')}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Rating Breakdown */}
      {renderRatingBreakdown()}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={COLORS.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('reviews.searchReviews')}
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={COLORS.gray400}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.gray400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContainer}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterButton,
                selectedFilter === option.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(option.key)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === option.key && styles.filterButtonTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Info */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {filteredReviews.length} {t('reviews.reviewsFound')}
          {searchText ? ` ${t('reviews.for')} "${searchText}"` : ''}
        </Text>
      </View>

      {/* Reviews List */}
      <FlatList
        data={filteredReviews}
        renderItem={renderReviewCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.reviewsList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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

  // Rating Breakdown
  ratingBreakdownContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  overallRatingSection: {
    alignItems: 'center',
    minWidth: 80,
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  overallRatingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  ratingSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  ratingBars: {
    flex: 1,
    gap: 8,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBarLabel: {
    fontSize: 12,
    color: COLORS.text,
    width: 8,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  ratingBarCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 32,
    textAlign: 'right',
  },

  // Search
  searchContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },

  // Filter
  filterContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 16,
  },
  filterScrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  filterButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },

  // Results
  resultsInfo: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  // Reviews List
  reviewsList: {
    padding: 16,
  },
  separator: {
    height: 16,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  expandText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 8,
  },

  // Replies
  repliesContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  replyCard: {
    backgroundColor: COLORS.gray50,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  instructorBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
  replyDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  replyComment: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },

  // Actions
  reviewActions: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  reviewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewActionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default ReviewDetailScreen;