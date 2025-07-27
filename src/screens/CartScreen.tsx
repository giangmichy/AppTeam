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
  Cart: undefined;
  CourseDetail: { courseId: string };
  Checkout: undefined;
};

type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

// Mock cart data
const mockCartItems = [
  {
    id: '1',
    title: 'Lập Trình Python Từ Cơ Bản Đến Nâng Cao Trong 30 Ngày',
    instructor: 'AI Coding',
    rating: 4.9,
    reviewCount: 421,
    price: 269000,
    originalPrice: 1079000,
    discount: 75,
    image: 'https://picsum.photos/150/100?random=1',
    duration: '15 giờ',
    tag: 'Bán chạy nhất',
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
    image: 'https://picsum.photos/150/100?random=2',
    duration: '20 giờ',
    tag: 'Mới nhất',
  },
  {
    id: '3',
    title: 'UI/UX Design Complete Course',
    instructor: 'Tech Design School',
    rating: 4.7,
    reviewCount: 203,
    price: 299000,
    originalPrice: 799000,
    discount: 63,
    image: 'https://picsum.photos/150/100?random=3',
    duration: '18 giờ',
  },
];

const CartScreen = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [selectedItems, setSelectedItems] = useState<string[]>(mockCartItems.map(item => item.id));

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' ₫';
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

  const calculateTotalOriginal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.originalPrice, 0);
  };

  const calculateTotalDiscount = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price, 0);
  };

  const calculateTotalSavings = () => {
    return calculateTotalOriginal() - calculateTotalDiscount();
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  const removeFromCart = (itemId: string) => {
    Alert.alert(
      'Xóa khỏi giỏ hàng',
      'Bạn có chắc muốn xóa khóa học này khỏi giỏ hàng?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setCartItems(prev => prev.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert('Chưa chọn sản phẩm', 'Vui lòng chọn ít nhất một khóa học để thanh toán');
      return;
    }
    // Navigate to checkout screen
    Alert.alert('Thanh toán', `Thanh toán ${selectedItems.length} khóa học được chọn`);
  };

  const renderCartItem = (item: any) => (
    <View key={item.id} style={styles.cartItem}>
      <View style={styles.cartItemContent}>
        {/* Checkbox */}
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => toggleItemSelection(item.id)}
        >
          <View style={[
            styles.checkbox, 
            selectedItems.includes(item.id) && styles.checkboxSelected
          ]}>
            {selectedItems.includes(item.id) && (
              <Ionicons name="checkmark" size={14} color={COLORS.white} />
            )}
          </View>
        </TouchableOpacity>

        {/* Course Content */}
        <TouchableOpacity 
          style={styles.courseContentContainer}
          onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.courseImage} />
            {item.tag && (
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{item.tag}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.instructor}>{item.instructor}</Text>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{item.rating}</Text>
              <View style={styles.starsContainer}>
                {renderStars(item.rating)}
              </View>
              <Text style={styles.reviewText}>({item.reviewCount})</Text>
            </View>

            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{item.duration}</Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
              <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}% GIẢM</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Remove Button */}
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="cart-outline" size={80} color={COLORS.gray400} />
      </View>
      <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
      <Text style={styles.emptySubtitle}>Hãy thêm một số khóa học vào giỏ hàng để bắt đầu học tập</Text>
      <CustomButton
        title="Tiếp tục mua sắm"
        onPress={() => navigation.navigate('Home')}
        style={styles.continueShoppingButton}
      />
    </View>
  );

  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Giá gốc</Text>
        <Text style={styles.summaryValue}>{formatPrice(calculateTotalOriginal())}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Giảm giá</Text>
        <Text style={[styles.summaryValue, { color: COLORS.success }]}>
          -{formatPrice(calculateTotalSavings())}
        </Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Tổng cộng</Text>
        <Text style={styles.totalValue}>{formatPrice(calculateTotalDiscount())}</Text>
      </View>

      <View style={styles.savingsContainer}>
        <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
        <Text style={styles.savingsText}>
          Bạn tiết kiệm {formatPrice(calculateTotalSavings())}
        </Text>
      </View>
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
        <Text style={styles.headerTitle}>
          Giỏ hàng ({cartItems.length})
        </Text>
        <TouchableOpacity onPress={toggleSelectAll}>
          <Text style={styles.selectAllText}>
            {selectedItems.length === cartItems.length ? 'Bỏ chọn' : 'Chọn tất cả'}
          </Text>
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.cartItemsContainer}>
              {cartItems.map(renderCartItem)}
            </View>
          </ScrollView>

          {/* Bottom Summary & Checkout - Fixed position */}
          {selectedItems.length > 0 && (
            <View style={styles.bottomContainer}>
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Tóm tắt đơn hàng ({selectedItems.length} sản phẩm)</Text>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Giá gốc</Text>
                  <Text style={styles.summaryValue}>{formatPrice(calculateTotalOriginal())}</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Giảm giá</Text>
                  <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                    -{formatPrice(calculateTotalSavings())}
                  </Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Tổng cộng</Text>
                  <Text style={styles.totalValue}>{formatPrice(calculateTotalDiscount())}</Text>
                </View>

                <View style={styles.savingsContainer}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.savingsText}>
                    Bạn tiết kiệm {formatPrice(calculateTotalSavings())}
                  </Text>
                </View>
              </View>
              
              <CustomButton
                title={`Tiến hành thanh toán (${selectedItems.length})`}
                onPress={handleCheckout}
                style={styles.checkoutButton}
              />
            </View>
          )}
        </>
      )}
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
    minWidth: 80,
  },
  selectAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Scroll Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cartItemsContainer: {
    padding: 16,
    gap: 16,
  },

  // Cart Item
  cartItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartItemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  courseContentContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  checkboxContainer: {
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  imageContainer: {
    position: 'relative',
  },
  courseImage: {
    width: 100,
    height: 70,
    borderRadius: 8,
  },
  tagBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
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
  instructor: {
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
  metaInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
  removeButton: {
    padding: 8,
    marginTop: 4,
  },

  // Empty Cart
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
    marginBottom: 32,
  },
  continueShoppingButton: {
    minWidth: 200,
  },

  // Bottom Summary - Fixed position
  bottomContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 16,
    paddingBottom: 24,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 8,
    backgroundColor: COLORS.success + '15',
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  checkoutButton: {
    borderRadius: 12,
  },
});

export default CartScreen;