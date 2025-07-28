import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import CustomButton from '../components/CustomButton';
import { COLORS } from '../constants/colors';

type RootStackParamList = {
  Checkout: undefined;
  Payment: { orderData: any };
  Cart: undefined;
  Home: undefined;
};

type CheckoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;

// Mock checkout data
const mockCheckoutData = {
  items: [
    {
      id: '1',
      title: 'Lập Trình Python Từ Cơ Bản Đến Nâng Cao',
      instructor: 'AI Coding',
      image: 'https://picsum.photos/150/100?random=1',
      price: 269000,
      originalPrice: 1079000,
      discount: 75,
    },
    {
      id: '2',
      title: 'React Native từ cơ bản đến nâng cao',
      instructor: 'Mobile Dev Academy',
      image: 'https://picsum.photos/150/100?random=2',
      price: 399000,
      originalPrice: 999000,
      discount: 60,
    }
  ],
  coupons: [
    {
      id: 'NEWUSER50',
      title: 'Ưu đãi người dùng mới',
      description: 'Giảm 50.000₫ cho đơn hàng đầu tiên',
      discount: 50000,
      type: 'fixed',
      minOrder: 200000,
    },
    {
      id: 'SAVE20',
      title: 'Giảm giá 20%',
      description: 'Giảm 20% tối đa 100.000₫',
      discount: 20,
      type: 'percentage',
      maxDiscount: 100000,
      minOrder: 300000,
    }
  ]
};

const CheckoutScreen = () => {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { t } = useTranslation();
  
  const [items, setItems] = useState(mockCheckoutData.items);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [showCoupons, setShowCoupons] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
  });
  const [showBillingModal, setShowBillingModal] = useState(false);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const calculateOriginalTotal = () => {
    return items.reduce((total, item) => total + item.originalPrice, 0);
  };

  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const subtotal = calculateSubtotal();
    if (appliedCoupon.type === 'fixed') {
      return Math.min(appliedCoupon.discount, subtotal);
    } else {
      const percentageDiscount = (subtotal * appliedCoupon.discount) / 100;
      return Math.min(percentageDiscount, appliedCoupon.maxDiscount || percentageDiscount);
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateCouponDiscount();
  };

  const calculateTotalSavings = () => {
    return calculateOriginalTotal() - calculateTotal();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const applyCoupon = (coupon?: any) => {
    const targetCoupon = coupon || mockCheckoutData.coupons.find(c => c.id === couponCode.toUpperCase());
    
    if (!targetCoupon) {
      Alert.alert('Lỗi', 'Mã giảm giá không hợp lệ');
      return;
    }

    const subtotal = calculateSubtotal();
    if (subtotal < targetCoupon.minOrder) {
      Alert.alert(
        'Không áp dụng được', 
        `Đơn hàng tối thiểu ${formatPrice(targetCoupon.minOrder)} để sử dụng mã này`
      );
      return;
    }

    setAppliedCoupon(targetCoupon);
    setCouponCode('');
    setShowCoupons(false);
    Alert.alert('Thành công', `Đã áp dụng mã giảm giá "${targetCoupon.id}"`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const removeItem = (itemId: string) => {
    Alert.alert(
      'Xóa khóa học',
      'Bạn có chắc muốn xóa khóa học này khỏi đơn hàng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => setItems(items.filter(item => item.id !== itemId))
        }
      ]
    );
  };

  const handleProceedToPayment = () => {
    if (items.length === 0) {
      Alert.alert('Đơn hàng trống', 'Vui lòng thêm khóa học vào đơn hàng');
      return;
    }

    const orderData = {
      items,
      subtotal: calculateSubtotal(),
      couponDiscount: calculateCouponDiscount(),
      total: calculateTotal(),
      appliedCoupon,
      billingInfo,
    };

    navigation.navigate('Payment' as any, { orderData });
  };

  const renderOrderItem = (item: any) => (
    <View key={item.id} style={styles.orderItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemInstructor}>{item.instructor}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
          <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% GIẢM</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Ionicons name="close" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );

  const renderCouponSection = () => (
    <View style={styles.couponSection}>
      <Text style={styles.sectionTitle}>Mã giảm giá</Text>
      
      {appliedCoupon ? (
        <View style={styles.appliedCoupon}>
          <View style={styles.appliedCouponInfo}>
            <Ionicons name="pricetag" size={20} color={COLORS.success} />
            <View style={styles.appliedCouponText}>
              <Text style={styles.appliedCouponTitle}>{appliedCoupon.title}</Text>
              <Text style={styles.appliedCouponDescription}>{appliedCoupon.description}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={removeCoupon}>
            <Ionicons name="close" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.couponInput}>
          <TextInput
            style={styles.couponTextInput}
            placeholder="Nhập mã giảm giá"
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity 
            style={styles.applyCouponButton}
            onPress={() => applyCoupon()}
          >
            <Text style={styles.applyCouponText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={styles.viewCouponsButton}
        onPress={() => setShowCoupons(true)}
      >
        <Text style={styles.viewCouponsText}>Xem mã giảm giá có sẵn</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderBillingSection = () => (
    <View style={styles.billingSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
        <TouchableOpacity onPress={() => setShowBillingModal(true)}>
          <Text style={styles.editText}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.billingInfo}>
        <View style={styles.billingRow}>
          <Ionicons name="person" size={16} color={COLORS.textSecondary} />
          <Text style={styles.billingText}>{billingInfo.fullName}</Text>
        </View>
        <View style={styles.billingRow}>
          <Ionicons name="mail" size={16} color={COLORS.textSecondary} />
          <Text style={styles.billingText}>{billingInfo.email}</Text>
        </View>
        <View style={styles.billingRow}>
          <Ionicons name="call" size={16} color={COLORS.textSecondary} />
          <Text style={styles.billingText}>{billingInfo.phone}</Text>
        </View>
        <View style={styles.billingRow}>
          <Ionicons name="location" size={16} color={COLORS.textSecondary} />
          <Text style={styles.billingText}>{billingInfo.address}</Text>
        </View>
      </View>
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.orderSummary}>
      <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tạm tính ({items.length} sản phẩm)</Text>
        <Text style={styles.summaryValue}>{formatPrice(calculateSubtotal())}</Text>
      </View>

      {appliedCoupon && (
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: COLORS.success }]}>
            Giảm giá ({appliedCoupon.id})
          </Text>
          <Text style={[styles.summaryValue, { color: COLORS.success }]}>
            -{formatPrice(calculateCouponDiscount())}
          </Text>
        </View>
      )}

      <View style={styles.divider} />
      
      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Tổng cộng</Text>
        <Text style={styles.totalValue}>{formatPrice(calculateTotal())}</Text>
      </View>

      <View style={styles.savingsInfo}>
        <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
        <Text style={styles.savingsText}>
          Bạn tiết kiệm được {formatPrice(calculateTotalSavings())}
        </Text>
      </View>
    </View>
  );

  const renderCouponsModal = () => (
    <Modal
      visible={showCoupons}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowCoupons(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Mã giảm giá có sẵn</Text>
          <TouchableOpacity onPress={() => setShowCoupons(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {mockCheckoutData.coupons.map((coupon) => {
            const subtotal = calculateSubtotal();
            const canApply = subtotal >= coupon.minOrder;
            
            return (
              <View key={coupon.id} style={styles.couponCard}>
                <View style={styles.couponCardHeader}>
                  <View style={styles.couponIcon}>
                    <Ionicons name="pricetag" size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.couponCardInfo}>
                    <Text style={styles.couponCardTitle}>{coupon.title}</Text>
                    <Text style={styles.couponCardCode}>Mã: {coupon.id}</Text>
                  </View>
                </View>
                
                <Text style={styles.couponCardDescription}>{coupon.description}</Text>
                
                <View style={styles.couponCardFooter}>
                  <Text style={styles.couponMinOrder}>
                    Đơn tối thiểu: {formatPrice(coupon.minOrder)}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.applyCouponCardButton,
                      !canApply && styles.applyCouponCardButtonDisabled
                    ]}
                    onPress={() => canApply && applyCoupon(coupon)}
                    disabled={!canApply}
                  >
                    <Text style={[
                      styles.applyCouponCardText,
                      !canApply && styles.applyCouponCardTextDisabled
                    ]}>
                      {canApply ? 'Áp dụng' : 'Không đủ điều kiện'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderBillingModal = () => (
    <Modal
      visible={showBillingModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowBillingModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Thông tin thanh toán</Text>
          <TouchableOpacity onPress={() => setShowBillingModal(false)}>
            <Text style={styles.saveText}>Lưu</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              value={billingInfo.fullName}
              onChangeText={(text) => setBillingInfo({...billingInfo, fullName: text})}
              placeholder="Nhập họ và tên"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={billingInfo.email}
              onChangeText={(text) => setBillingInfo({...billingInfo, email: text})}
              placeholder="Nhập email"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={billingInfo.phone}
              onChangeText={(text) => setBillingInfo({...billingInfo, phone: text})}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Địa chỉ</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={billingInfo.address}
              onChangeText={(text) => setBillingInfo({...billingInfo, address: text})}
              placeholder="Nhập địa chỉ"
              multiline
              numberOfLines={3}
            />
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
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.editCartText}>Sửa giỏ hàng</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Items */}
        <View style={styles.orderItemsSection}>
          <Text style={styles.sectionTitle}>Đơn hàng ({items.length} sản phẩm)</Text>
          {items.map(renderOrderItem)}
        </View>

        {/* Coupon Section */}
        {renderCouponSection()}

        {/* Billing Section */}
        {renderBillingSection()}

        {/* Order Summary */}
        {renderOrderSummary()}
      </ScrollView>

      {/* Bottom Checkout */}
      <View style={styles.bottomCheckout}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalPrice}>{formatPrice(calculateTotal())}</Text>
        </View>
        
        <CustomButton
          title="Tiến hành thanh toán"
          onPress={handleProceedToPayment}
          style={styles.checkoutButton}
        />
      </View>

      {/* Modals */}
      {renderCouponsModal()}
      {renderBillingModal()}
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
  editCartText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Section Styles
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

  // Order Items
  orderItemsSection: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 8,
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  itemImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  itemInstructor: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
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
  },

  // Coupon Section
  couponSection: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 8,
  },
  appliedCoupon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  appliedCouponInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appliedCouponText: {
    marginLeft: 12,
    flex: 1,
  },
  appliedCouponTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
  },
  appliedCouponDescription: {
    fontSize: 12,
    color: COLORS.success,
    marginTop: 2,
  },
  couponInput: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  couponTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  applyCouponButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  applyCouponText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  viewCouponsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  viewCouponsText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },

  // Billing Section
  billingSection: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 8,
  },
  billingInfo: {
    gap: 12,
  },
  billingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  billingText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },

  // Order Summary
  orderSummary: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  savingsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: COLORS.success + '15',
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '600',
  },

  // Bottom Checkout
  bottomCheckout: {
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutButton: {
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
  saveText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },

  // Coupon Cards
  couponCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  couponCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  couponIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  couponCardInfo: {
    flex: 1,
  },
  couponCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  couponCardCode: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  couponCardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  couponCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponMinOrder: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  applyCouponCardButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyCouponCardButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  applyCouponCardText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  applyCouponCardTextDisabled: {
    color: COLORS.gray500,
  },

  // Input Styles
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});

export default CheckoutScreen;