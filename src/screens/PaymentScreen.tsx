import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import CustomButton from '../components/CustomButton';
import { COLORS } from '../constants/colors';

type RootStackParamList = {
  Payment: { orderData: any };
  Home: undefined;
  Learning: undefined;
};

type PaymentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Payment'>;

// Mock payment methods
const paymentMethods = [
  {
    id: 'momo',
    name: 'Ví MoMo',
    icon: 'wallet',
    color: '#A50064',
    description: 'Thanh toán qua ví điện tử MoMo',
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    icon: 'card',
    color: '#0068FF',
    description: 'Thanh toán qua ví điện tử ZaloPay',
  },
  {
    id: 'banking',
    name: 'Internet Banking',
    icon: 'business',
    color: '#00AA55',
    description: 'Chuyển khoản qua ngân hàng',
  },
  {
    id: 'visa',
    name: 'Thẻ Visa/MasterCard',
    icon: 'card-outline',
    color: '#1A1F71',
    description: 'Thanh toán bằng thẻ tín dụng/ghi nợ',
  },
  {
    id: 'atm',
    name: 'Thẻ ATM nội địa',
    icon: 'card',
    color: '#FF6B00',
    description: 'Thanh toán bằng thẻ ATM',
  },
];

// Mock banks
const banks = [
  { id: 'vcb', name: 'Vietcombank', color: '#007A3D' },
  { id: 'tcb', name: 'Techcombank', color: '#00A651' },
  { id: 'bidv', name: 'BIDV', color: '#003F7F' },
  { id: 'vietinbank', name: 'VietinBank', color: '#DA020E' },
  { id: 'agribank', name: 'Agribank', color: '#009639' },
  { id: 'mbbank', name: 'MB Bank', color: '#D4AF37' },
];

const PaymentScreen = () => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const route = useRoute();
  const { t } = useTranslation();
  const { orderData } = route.params as { orderData: any };

  const [selectedPayment, setSelectedPayment] = useState('momo');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
  });
  const [selectedBank, setSelectedBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsProcessing(false);
      setShowPaymentSuccess(true);
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Lỗi thanh toán', 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentSuccess(false);
    navigation.navigate('Learning');
  };

  const renderPaymentMethod = (method: any) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethod,
        selectedPayment === method.id && styles.paymentMethodSelected
      ]}
      onPress={() => setSelectedPayment(method.id)}
    >
      <View style={styles.paymentMethodLeft}>
        <View style={[styles.paymentIcon, { backgroundColor: method.color + '15' }]}>
          <Ionicons name={method.icon as any} size={24} color={method.color} />
        </View>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentName}>{method.name}</Text>
          <Text style={styles.paymentDescription}>{method.description}</Text>
        </View>
      </View>
      
      <View style={[
        styles.radioButton,
        selectedPayment === method.id && styles.radioButtonSelected
      ]}>
        {selectedPayment === method.id && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCardForm = () => (
    <View style={styles.cardForm}>
      <Text style={styles.formTitle}>Thông tin thẻ</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Số thẻ</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          value={cardInfo.number}
          onChangeText={(text) => setCardInfo({...cardInfo, number: formatCardNumber(text)})}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tên chủ thẻ</Text>
        <TextInput
          style={styles.input}
          placeholder="NGUYEN VAN AN"
          value={cardInfo.holder}
          onChangeText={(text) => setCardInfo({...cardInfo, holder: text.toUpperCase()})}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>Ngày hết hạn</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            value={cardInfo.expiry}
            onChangeText={(text) => setCardInfo({...cardInfo, expiry: formatExpiry(text)})}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            value={cardInfo.cvv}
            onChangeText={(text) => setCardInfo({...cardInfo, cvv: text})}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>
    </View>
  );

  const renderBankSelection = () => (
    <View style={styles.bankSelection}>
      <TouchableOpacity
        style={styles.bankSelector}
        onPress={() => setShowBankModal(true)}
      >
        <Text style={styles.bankSelectorLabel}>Chọn ngân hàng</Text>
        <View style={styles.bankSelectorContent}>
          {selectedBank ? (
            <>
              <Text style={styles.selectedBankName}>
                {banks.find(b => b.id === selectedBank)?.name}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
            </>
          ) : (
            <>
              <Text style={styles.bankSelectorPlaceholder}>Chọn ngân hàng của bạn</Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.orderSummary}>
      <Text style={styles.summaryTitle}>Chi tiết đơn hàng</Text>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Số lượng khóa học</Text>
        <Text style={styles.summaryValue}>{orderData.items.length}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tạm tính</Text>
        <Text style={styles.summaryValue}>{formatPrice(orderData.subtotal)}</Text>
      </View>

      {orderData.couponDiscount > 0 && (
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: COLORS.success }]}>
            Giảm giá ({orderData.appliedCoupon?.id})
          </Text>
          <Text style={[styles.summaryValue, { color: COLORS.success }]}>
            -{formatPrice(orderData.couponDiscount)}
          </Text>
        </View>
      )}

      <View style={styles.divider} />
      
      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Tổng thanh toán</Text>
        <Text style={styles.totalValue}>{formatPrice(orderData.total)}</Text>
      </View>
    </View>
  );

  const renderBankModal = () => (
    <Modal
      visible={showBankModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowBankModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Chọn ngân hàng</Text>
          <TouchableOpacity onPress={() => setShowBankModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {banks.map((bank) => (
            <TouchableOpacity
              key={bank.id}
              style={[
                styles.bankOption,
                selectedBank === bank.id && styles.bankOptionSelected
              ]}
              onPress={() => {
                setSelectedBank(bank.id);
                setShowBankModal(false);
              }}
            >
              <View style={[styles.bankIcon, { backgroundColor: bank.color }]}>
                <Ionicons name="business" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.bankName}>{bank.name}</Text>
              {selectedBank === bank.id && (
                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderPaymentSuccessModal = () => (
    <Modal
      visible={showPaymentSuccess}
      animationType="fade"
      transparent
      onRequestClose={handlePaymentSuccess}
    >
      <View style={styles.successModalOverlay}>
        <View style={styles.successModalContainer}>
          <LinearGradient
            colors={[COLORS.success, '#059669']}
            style={styles.successIcon}
          >
            <Ionicons name="checkmark" size={40} color={COLORS.white} />
          </LinearGradient>
          
          <Text style={styles.successTitle}>Thanh toán thành công! 🎉</Text>
          <Text style={styles.successMessage}>
            Bạn đã thanh toán thành công {formatPrice(orderData.total)} cho {orderData.items.length} khóa học
          </Text>
          
          <View style={styles.successActions}>
            <CustomButton
              title="Bắt đầu học ngay"
              onPress={handlePaymentSuccess}
              style={styles.successButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderProcessingModal = () => (
    <Modal
      visible={isProcessing}
      animationType="fade"
      transparent
    >
      <View style={styles.processingOverlay}>
        <View style={styles.processingContainer}>
          <View style={styles.processingIcon}>
            <Ionicons name="card" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.processingTitle}>Đang xử lý thanh toán...</Text>
          <Text style={styles.processingMessage}>
            Vui lòng không tắt ứng dụng trong quá trình thanh toán
          </Text>
        </View>
      </View>
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
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Summary */}
        {renderOrderSummary()}

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          {paymentMethods.map(renderPaymentMethod)}
        </View>

        {/* Payment Forms */}
        {(selectedPayment === 'visa' || selectedPayment === 'atm') && renderCardForm()}
        {selectedPayment === 'banking' && renderBankSelection()}

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <View style={styles.securityItem}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
            <Text style={styles.securityText}>
              Thông tin thanh toán được mã hóa SSL 256-bit
            </Text>
          </View>
          <View style={styles.securityItem}>
            <Ionicons name="lock-closed" size={20} color={COLORS.success} />
            <Text style={styles.securityText}>
              Chúng tôi không lưu trữ thông tin thẻ của bạn
            </Text>
          </View>
          <View style={styles.securityItem}>
            <Ionicons name="time" size={20} color={COLORS.info} />
            <Text style={styles.securityText}>
              Giao dịch sẽ được xử lý trong vài phút
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Payment */}
      <View style={styles.bottomPayment}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
          <Text style={styles.totalPrice}>{formatPrice(orderData.total)}</Text>
        </View>
        
        <CustomButton
          title={`Thanh toán ${formatPrice(orderData.total)}`}
          onPress={handlePayment}
          style={styles.paymentButton}
          disabled={
            isProcessing || 
            (selectedPayment === 'banking' && !selectedBank) ||
            ((selectedPayment === 'visa' || selectedPayment === 'atm') && 
             (!cardInfo.number || !cardInfo.holder || !cardInfo.expiry || !cardInfo.cvv))
          }
        />
      </View>

      {/* Modals */}
      {renderBankModal()}
      {renderPaymentSuccessModal()}
      {renderProcessingModal()}
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

  // Section Styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },

  // Order Summary
  orderSummary: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  // Payment Methods
  paymentSection: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  paymentMethodSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '05',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  // Card Form
  cardForm: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  inputRow: {
    flexDirection: 'row',
  },

  // Bank Selection
  bankSelection: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 8,
  },
  bankSelector: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
  },
  bankSelectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  bankSelectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankSelectorPlaceholder: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  selectedBankName: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },

  // Security Info
  securityInfo: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 8,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  securityText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },

  // Bottom Payment
  bottomPayment: {
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
  paymentButton: {
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

  // Bank Options
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bankOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '05',
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },

  // Success Modal
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  successActions: {
    width: '100%',
  },
  successButton: {
    borderRadius: 12,
  },

  // Processing Modal
  processingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  processingContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  processingIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  processingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  processingMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PaymentScreen;