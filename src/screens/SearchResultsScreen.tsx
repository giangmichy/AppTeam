import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/colors';

type RootStackParamList = {
  SearchResults: { query?: string; category?: string };
  CourseDetail: { courseId: string };
  Home: undefined;
};

type SearchResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchResults'>;

// Mock search results data
const mockSearchResults = [
  {
    id: '1',
    title: 'Lập Trình Python Từ Cơ Bản Đến Nâng Cao Trong 30 Ngày',
    instructor: 'AI Coding',
    rating: 4.9,
    reviewCount: 421,
    price: 269000,
    originalPrice: 1079000,
    discount: 75,
    image: 'https://picsum.photos/200/120?random=1',
    duration: '15 giờ',
    level: 'Cơ bản',
    tag: 'Bán chạy nhất',
    students: 9574,
    category: 'Lập trình',
    updatedDate: '2024-01-15',
  },
  {
    id: '2',
    title: 'React Native từ cơ bản đến nâng cao',
    instructor: 'Mobile Dev Academy',
    rating: 4.7,
    reviewCount: 198,
    price: 399000,
    originalPrice: 999000,
    discount: 60,
    image: 'https://picsum.photos/200/120?random=2',
    duration: '20 giờ',
    level: 'Trung cấp',
    tag: 'Mới nhất',
    students: 3241,
    category: 'Mobile Development',
    updatedDate: '2024-01-12',
  },
  {
    id: '3',
    title: 'UI/UX Design Complete Course',
    instructor: 'Tech Design School',
    rating: 4.8,
    reviewCount: 203,
    price: 299000,
    originalPrice: 799000,
    discount: 63,
    image: 'https://picsum.photos/200/120?random=3',
    duration: '18 giờ',
    level: 'Cơ bản',
    students: 5678,
    category: 'Thiết kế',
    updatedDate: '2024-01-10',
  },
  {
    id: '4',
    title: 'Digital Marketing từ A-Z',
    instructor: 'Marketing Pro Academy',
    rating: 4.6,
    reviewCount: 156,
    price: 399000,
    originalPrice: 999000,
    discount: 60,
    image: 'https://picsum.photos/200/120?random=4',
    duration: '22 giờ',
    level: 'Trung cấp',
    students: 2134,
    category: 'Marketing',
    updatedDate: '2024-01-08',
  },
  {
    id: '5',
    title: 'Node.js Backend Development',
    instructor: 'Backend Masters',
    rating: 4.5,
    reviewCount: 167,
    price: 349000,
    originalPrice: 899000,
    discount: 61,
    image: 'https://picsum.photos/200/120?random=5',
    duration: '16 giờ',
    level: 'Nâng cao',
    students: 1892,
    category: 'Backend',
    updatedDate: '2024-01-05',
  },
  {
    id: '6',
    title: 'Photoshop từ cơ bản đến nâng cao',
    instructor: 'Design Academy',
    rating: 4.4,
    reviewCount: 89,
    price: 249000,
    originalPrice: 699000,
    discount: 64,
    image: 'https://picsum.photos/200/120?random=6',
    duration: '14 giờ',
    level: 'Cơ bản',
    students: 3456,
    category: 'Thiết kế',
    updatedDate: '2024-01-03',
  },
];

// Filter options
const priceRanges = [
  { id: 'free', label: 'Miễn phí', min: 0, max: 0 },
  { id: 'under-300k', label: 'Dưới 300.000₫', min: 0, max: 300000 },
  { id: '300k-500k', label: '300.000₫ - 500.000₫', min: 300000, max: 500000 },
  { id: 'above-500k', label: 'Trên 500.000₫', min: 500000, max: Infinity },
];

const levels = ['Tất cả', 'Cơ bản', 'Trung cấp', 'Nâng cao'];
const durations = ['Tất cả', 'Dưới 5 giờ', '5-15 giờ', 'Trên 15 giờ'];
const sortOptions = [
  { id: 'relevance', label: 'Liên quan nhất' },
  { id: 'rating', label: 'Đánh giá cao nhất' },
  { id: 'newest', label: 'Mới nhất' },
  { id: 'price-low', label: 'Giá thấp nhất' },
  { id: 'price-high', label: 'Giá cao nhất' },
  { id: 'most-enrolled', label: 'Đăng ký nhiều nhất' },
];

const SearchResultsScreen = () => {
  const navigation = useNavigation<SearchResultsScreenNavigationProp>();
  const route = useRoute();
  const { t } = useTranslation();
  
  const { query: initialQuery = '', category: initialCategory = '' } = route.params || {};
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState(mockSearchResults);
  const [filteredResults, setFilteredResults] = useState(mockSearchResults);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Tất cả');
  const [selectedDuration, setSelectedDuration] = useState('Tất cả');
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [minRating, setMinRating] = useState(0);
  
  // Modal states
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    applyFiltersAndSort();
  }, [selectedPriceRange, selectedLevel, selectedDuration, selectedSort, minRating, searchQuery]);

  const applyFiltersAndSort = () => {
    let filtered = [...results];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (selectedPriceRange) {
      const priceRange = priceRanges.find(p => p.id === selectedPriceRange);
      if (priceRange) {
        filtered = filtered.filter(course => 
          course.price >= priceRange.min && course.price <= priceRange.max
        );
      }
    }

    // Level filter
    if (selectedLevel !== 'Tất cả') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Duration filter
    if (selectedDuration !== 'Tất cả') {
      filtered = filtered.filter(course => {
        const hours = parseInt(course.duration);
        switch (selectedDuration) {
          case 'Dưới 5 giờ':
            return hours < 5;
          case '5-15 giờ':
            return hours >= 5 && hours <= 15;
          case 'Trên 15 giờ':
            return hours > 15;
          default:
            return true;
        }
      });
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(course => course.rating >= minRating);
    }

    // Sort
    switch (selectedSort) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'most-enrolled':
        filtered.sort((a, b) => b.students - a.students);
        break;
      default:
        // relevance - keep original order
        break;
    }

    setFilteredResults(filtered);
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const clearFilters = () => {
    setSelectedPriceRange('');
    setSelectedLevel('Tất cả');
    setSelectedDuration('Tất cả');
    setMinRating(0);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedPriceRange) count++;
    if (selectedLevel !== 'Tất cả') count++;
    if (selectedDuration !== 'Tất cả') count++;
    if (minRating > 0) count++;
    return count;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
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

  const renderCourseCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
    >
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
        <Text style={styles.courseInstructor}>{item.instructor}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <View style={styles.starsContainer}>
            {renderStars(item.rating)}
          </View>
          <Text style={styles.reviewText}>({item.reviewCount})</Text>
        </View>

        <View style={styles.courseMetaContainer}>
          <View style={styles.courseMeta}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{item.duration}</Text>
          </View>
          <View style={styles.courseMeta}>
            <Ionicons name="bar-chart-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{item.level}</Text>
          </View>
          <View style={styles.courseMeta}>
            <Ionicons name="people-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{item.students}</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
          {item.originalPrice > 0 && (
            <>
              <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}% GIẢM</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFiltersModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilters(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Bộ lọc</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.applyText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Khoảng giá</Text>
            {priceRanges.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.filterOption,
                  selectedPriceRange === range.id && styles.filterOptionSelected
                ]}
                onPress={() => setSelectedPriceRange(
                  selectedPriceRange === range.id ? '' : range.id
                )}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedPriceRange === range.id && styles.filterOptionTextSelected
                ]}>
                  {range.label}
                </Text>
                {selectedPriceRange === range.id && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Level */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Cấp độ</Text>
            {levels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.filterOption,
                  selectedLevel === level && styles.filterOptionSelected
                ]}
                onPress={() => setSelectedLevel(level)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedLevel === level && styles.filterOptionTextSelected
                ]}>
                  {level}
                </Text>
                {selectedLevel === level && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Duration */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Thời lượng</Text>
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.filterOption,
                  selectedDuration === duration && styles.filterOptionSelected
                ]}
                onPress={() => setSelectedDuration(duration)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedDuration === duration && styles.filterOptionTextSelected
                ]}>
                  {duration}
                </Text>
                {selectedDuration === duration && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Rating */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Đánh giá tối thiểu</Text>
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.filterOption,
                  minRating === rating && styles.filterOptionSelected
                ]}
                onPress={() => setMinRating(minRating === rating ? 0 : rating)}
              >
                <View style={styles.ratingOption}>
                  <Text style={[
                    styles.filterOptionText,
                    minRating === rating && styles.filterOptionTextSelected
                  ]}>
                    {rating}
                  </Text>
                  <View style={styles.starsContainer}>
                    {renderStars(rating, 14)}
                  </View>
                  <Text style={styles.ratingOptionText}>trở lên</Text>
                </View>
                {minRating === rating && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSort}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowSort(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <View style={styles.placeholder} />
          <Text style={styles.modalTitle}>Sắp xếp theo</Text>
          <TouchableOpacity onPress={() => setShowSort(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterOption,
                selectedSort === option.id && styles.filterOptionSelected
              ]}
              onPress={() => {
                setSelectedSort(option.id);
                setShowSort(false);
              }}
            >
              <Text style={[
                styles.filterOptionText,
                selectedSort === option.id && styles.filterOptionTextSelected
              ]}>
                {option.label}
              </Text>
              {selectedSort === option.id && (
                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderEmptyResults = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="search-outline" size={80} color={COLORS.gray400} />
      </View>
      <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
      <Text style={styles.emptySubtitle}>
        Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc
      </Text>
      <TouchableOpacity 
        style={styles.clearFiltersButton}
        onPress={clearFilters}
      >
        <Text style={styles.clearFiltersText}>Xóa bộ lọc</Text>
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
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={COLORS.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor={COLORS.gray400}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.gray400} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Filter and Sort Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="funnel-outline" size={16} color={COLORS.primary} />
          <Text style={styles.filterButtonText}>Lọc</Text>
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSort(true)}
        >
          <Ionicons name="swap-vertical-outline" size={16} color={COLORS.primary} />
          <Text style={styles.sortButtonText}>
            {sortOptions.find(s => s.id === selectedSort)?.label}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredResults.length} kết quả
          {searchQuery ? ` cho "${searchQuery}"` : ''}
        </Text>
        
        {getActiveFiltersCount() > 0 && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFiltersLink}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results List */}
      {filteredResults.length > 0 ? (
        <FlatList
          data={filteredResults}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshing={isLoading}
          onRefresh={() => handleSearch(searchQuery)}
        />
      ) : (
        renderEmptyResults()
      )}

      {/* Modals */}
      {renderFiltersModal()}
      {renderSortModal()}
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },

  // Filter Bar
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary + '15',
    borderRadius: 20,
    gap: 6,
    position: 'relative',
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary + '15',
    borderRadius: 20,
    gap: 6,
  },
  sortButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },

  // Results Header
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  resultsCount: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  clearFiltersLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },

  // Results List
  resultsList: {
    padding: 16,
  },
  separator: {
    height: 16,
  },
  courseCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  courseImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  courseImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
  },
  courseTag: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  courseTagText: {
    fontSize: 8,
    fontWeight: '600',
    color: COLORS.white,
  },
  courseInfo: {
    flex: 1,
    gap: 4,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 18,
  },
  courseInstructor: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warning,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  courseMetaContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  originalPrice: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  discountText: {
    fontSize: 9,
    color: COLORS.white,
    fontWeight: '600',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
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
  clearText: {
    fontSize: 14,
    color: COLORS.danger,
    fontWeight: '500',
  },
  applyText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },

  // Filter Options
  filterSection: {
    marginBottom: 32,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingOptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default SearchResultsScreen;