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
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/colors';

type RootStackParamList = {
  Home: undefined;
  Favorites: undefined;
  CourseDetail: { courseId: string };
  Cart: undefined;
};

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

// Mock favorites data
const mockFavorites = [
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
    addedDate: '2024-01-15',
    category: 'Lập trình',
    isInCart: false,
    students: 9574
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
    addedDate: '2024-01-12',
    category: 'Mobile Development',
    isInCart: true,
    students: 3241
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
    addedDate: '2024-01-10',
    category: 'Thiết kế',
    isInCart: false,
    students: 5678
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
    addedDate: '2024-01-08',
    category: 'Marketing',
    isInCart: false,
    students: 2134
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
    addedDate: '2024-01-05',
    category: 'Backend',
    isInCart: false,
    students: 1892
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
    addedDate: '2024-01-03',
    category: 'Thiết kế',
    isInCart: false,
    students: 3456
  }
];

const FavoritesScreen = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState(mockFavorites);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const categories = ['all', 'Lập trình', 'Thiết kế', 'Marketing', 'Mobile Development', 'Backend'];
  
  const sortOptions = [
    { key: 'dateAdded', label: 'Theo ngày thêm' },
    { key: 'title', label: 'Theo tên khóa học' },
    { key: 'rating', label: 'Theo đánh giá cao nhất' },
    { key: 'price', label: 'Theo giá thấp nhất' }
  ];

  const getFilteredAndSortedFavorites = () => {
    let filtered = favorites;

    // Filter by search text
    if (searchText.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        case 'dateAdded':
        default:
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      }
    });

    return filtered;
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

  const removeFromFavorites = (courseId: string) => {
    Alert.alert(
      'Xóa khỏi yêu thích',
      'Bạn có chắc muốn xóa khóa học này khỏi danh sách yêu thích?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setFavorites(prev => prev.filter(item => item.id !== courseId));
            setSelectedItems(prev => prev.filter(id => id !== courseId));
          }
        }
      ]
    );
  };

  const toggleItemSelection = (courseId: string) => {
    setSelectedItems(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const selectAll = () => {
    const filteredFavorites = getFilteredAndSortedFavorites();
    setSelectedItems(filteredFavorites.map(item => item.id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const removeSelectedItems = () => {
    Alert.alert(
      'Xóa khóa học đã chọn',
      `Bạn có chắc muốn xóa ${selectedItems.length} khóa học đã chọn khỏi danh sách yêu thích?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setFavorites(prev => prev.filter(item => !selectedItems.includes(item.id)));
            setSelectedItems([]);
          }
        }
      ]
    );
  };

  const addSelectedToCart = () => {
    const selectedCourses = favorites.filter(item => 
      selectedItems.includes(item.id) && !item.isInCart
    );
    
    if (selectedCourses.length === 0) {
      Alert.alert('Thông tin', 'Tất cả khóa học đã chọn đều có trong giỏ hàng');
      return;
    }

    setFavorites(prev => 
      prev.map(item => 
        selectedItems.includes(item.id) 
          ? { ...item, isInCart: true }
          : item
      )
    );
    
    Alert.alert(
      'Thành công', 
      `Đã thêm ${selectedCourses.length} khóa học vào giỏ hàng`
    );
    setSelectedItems([]);
  };

  const renderCourseCard = ({ item }: { item: any }) => {
    const isSelected = selectedItems.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[
          viewMode === 'grid' ? styles.gridCourseCard : styles.listCourseCard,
          isSelected && styles.selectedCard
        ]}
        onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
      >
        {/* Selection Checkbox */}
        <TouchableOpacity
          style={styles.selectionCheckbox}
          onPress={() => toggleItemSelection(item.id)}
        >
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && (
              <Ionicons name="checkmark" size={14} color={COLORS.white} />
            )}
          </View>
        </TouchableOpacity>

        <View style={viewMode === 'grid' ? styles.gridContent : styles.listContent}>
          <View style={viewMode === 'grid' ? styles.gridImageContainer : styles.listImageContainer}>
            <Image source={{ uri: item.image }} style={viewMode === 'grid' ? styles.gridImage : styles.listImage} />
            {item.tag && (
              <View style={styles.courseTag}>
                <Text style={styles.courseTagText}>{item.tag}</Text>
              </View>
            )}
          </View>

          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle} numberOfLines={viewMode === 'grid' ? 3 : 2}>
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

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cartButton]}
                onPress={() => {
                  if (item.isInCart) {
                    navigation.navigate('Cart');
                  } else {
                    setFavorites(prev => 
                      prev.map(fav => 
                        fav.id === item.id ? { ...fav, isInCart: true } : fav
                      )
                    );
                    Alert.alert('Thành công', 'Đã thêm vào giỏ hàng');
                  }
                }}
              >
                <Ionicons 
                  name={item.isInCart ? "cart" : "cart-outline"} 
                  size={16} 
                  color={item.isInCart ? COLORS.success : COLORS.primary} 
                />
                <Text style={[
                  styles.actionButtonText,
                  { color: item.isInCart ? COLORS.success : COLORS.primary }
                ]}>
                  {item.isInCart ? 'Trong giỏ hàng' : 'Thêm vào giỏ'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.removeButton]}
                onPress={() => removeFromFavorites(item.id)}
              >
                <Ionicons name="heart-dislike-outline" size={16} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowSortModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Sắp xếp theo</Text>
          <TouchableOpacity onPress={() => setShowSortModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.optionsContainer}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionItem,
                sortBy === option.key && styles.selectedOption
              ]}
              onPress={() => {
                setSortBy(option.key);
                setShowSortModal(false);
              }}
            >
              <Text style={[
                styles.optionText,
                sortBy === option.key && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
              {sortBy === option.key && (
                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Lọc theo</Text>
          <TouchableOpacity onPress={() => setShowFilterModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.optionsContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.optionItem,
                filterCategory === category && styles.selectedOption
              ]}
              onPress={() => {
                setFilterCategory(category);
                setShowFilterModal(false);
              }}
            >
              <Text style={[
                styles.optionText,
                filterCategory === category && styles.selectedOptionText
              ]}>
                {category === 'all' ? 'Tất cả danh mục' : category}
              </Text>
              {filterCategory === category && (
                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );

  const filteredFavorites = getFilteredAndSortedFavorites();

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
        <Text style={styles.headerTitle}>Yêu thích ({favorites.length})</Text>
        <TouchableOpacity 
          style={styles.viewModeButton}
          onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          <Ionicons 
            name={viewMode === 'grid' ? "list" : "grid"} 
            size={24} 
            color={COLORS.text} 
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={COLORS.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm khóa học yêu thích..."
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

      {/* Filter and Sort Bar */}
      <View style={styles.filterSortBar}>
        <View style={styles.filterSortLeft}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowSortModal(true)}
          >
            <Ionicons name="swap-vertical-outline" size={16} color={COLORS.primary} />
            <Text style={styles.filterButtonText}>Sắp xếp</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="funnel-outline" size={16} color={COLORS.primary} />
            <Text style={styles.filterButtonText}>Lọc</Text>
            {filterCategory !== 'all' && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>

        {selectedItems.length > 0 && (
          <View style={styles.selectionActions}>
            <TouchableOpacity 
              style={styles.selectionAction}
              onPress={selectedItems.length === filteredFavorites.length ? deselectAll : selectAll}
            >
              <Text style={styles.selectionActionText}>
                {selectedItems.length === filteredFavorites.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Selection Actions */}
      {selectedItems.length > 0 && (
        <View style={styles.selectedActionsBar}>
          <Text style={styles.selectedCountText}>
            Đã chọn {selectedItems.length} khóa học
          </Text>
          <View style={styles.selectedActions}>
            <TouchableOpacity 
              style={styles.selectedActionButton}
              onPress={addSelectedToCart}
            >
              <Ionicons name="cart-outline" size={16} color={COLORS.primary} />
              <Text style={styles.selectedActionText}>Thêm vào giỏ</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.selectedActionButton, styles.removeActionButton]}
              onPress={removeSelectedItems}
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
              <Text style={[styles.selectedActionText, { color: COLORS.danger }]}>
                Xóa
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Favorites List */}
      {filteredFavorites.length > 0 ? (
        <FlatList
          data={filteredFavorites}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when view mode changes
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.favoritesList,
            viewMode === 'grid' && styles.gridList
          ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="heart-outline" size={80} color={COLORS.gray400} />
          </View>
          <Text style={styles.emptyTitle}>
            {searchText || filterCategory !== 'all' 
              ? 'Không tìm thấy kết quả' 
              : 'Chưa có khóa học yêu thích'
            }
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchText || filterCategory !== 'all'
              ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
              : 'Hãy thêm các khóa học bạn quan tâm vào danh sách yêu thích'
            }
          </Text>
          {(!searchText && filterCategory === 'all') && (
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.browseButtonText}>Khám phá khóa học</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Modals */}
      {renderSortModal()}
      {renderFilterModal()}
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
  viewModeButton: {
    padding: 8,
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

  // Filter and Sort
  filterSortBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterSortLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '15',
    position: 'relative',
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  filterDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
  },
  selectionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  selectionAction: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectionActionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },

  // Selection Actions Bar
  selectedActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary + '15',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary + '30',
  },
  selectedCountText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  selectedActions: {
    flexDirection: 'row',
    gap: 16,
  },
  selectedActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  removeActionButton: {
    backgroundColor: COLORS.danger + '15',
  },
  selectedActionText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },

  // Course Cards
  favoritesList: {
    padding: 16,
  },
  gridList: {
    paddingHorizontal: 8,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  separator: {
    height: 16,
  },
  
  // List View
  listCourseCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    padding: 12,
  },
  listContent: {
    flexDirection: 'row',
    gap: 12,
  },
  listImageContainer: {
    position: 'relative',
  },
  listImage: {
    width: 100,
    height: 70,
    borderRadius: 8,
  },

  // Grid View  
  gridCourseCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    width: '48%',
    marginHorizontal: '1%',
  },
  gridContent: {
    padding: 12,
  },
  gridImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  gridImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },

  // Common Card Elements
  selectedCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  selectionCheckbox: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  courseTag: {
    position: 'absolute',
    top: 6,
    right: 6,
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
    gap: 6,
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
    flexWrap: 'wrap',
    gap: 8,
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
    flexWrap: 'wrap',
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
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 9,
    color: COLORS.white,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  cartButton: {
    flex: 1,
    backgroundColor: COLORS.primary + '15',
  },
  removeButton: {
    backgroundColor: COLORS.danger + '15',
    paddingHorizontal: 8,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '500',
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
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
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
  optionsContainer: {
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default FavoritesScreen;