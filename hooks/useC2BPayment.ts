import { useState, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Wallet as WalletType, Currency } from '../types/wallet';
import { ReviewReason, REVIEW_REASONS } from '../types/review';
import { calculateConsumerTotalWithFee, checkBDNPlusSubscription } from '../lib/fees';
import { mockWallets, mockBusinesses, allBusinesses } from '../data/mock';

export type PaymentStep = 'select-business' | 'amount' | 'payment-method' | 'review' | 'processing' | 'success';

export const useC2BPayment = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ businessId?: string; amount?: string; currency?: Currency }>();

  const [step, setStep] = useState<PaymentStep>(params.businessId ? 'amount' : 'select-business');
  const [amount, setAmount] = useState(params.amount || '0');
  const [currency, setCurrency] = useState<Currency>((params.currency as Currency) || 'USD');
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [useBLKD, setUseBLKD] = useState(false);
  const [note, setNote] = useState('');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(params.businessId || null);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [businessSearchQuery, setBusinessSearchQuery] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [selectedReasons, setSelectedReasons] = useState<ReviewReason[]>([]);

  const business = useMemo(() => (selectedBusinessId ? mockBusinesses[selectedBusinessId] : null), [selectedBusinessId]);
  const numericAmount = useMemo(() => parseFloat(amount) || 0, [amount]);

  const filteredBusinesses = useMemo(() =>
    allBusinesses.filter((b) =>
      b.name.toLowerCase().includes(businessSearchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(businessSearchQuery.toLowerCase())
    ), [businessSearchQuery]);

  const hasBDNPlus = useMemo(() => checkBDNPlusSubscription('current-user-id'), []);

  const feeCalculation = useMemo(() => calculateConsumerTotalWithFee(numericAmount, currency, hasBDNPlus), [numericAmount, currency, hasBDNPlus]);
  const serviceFee = feeCalculation.serviceFee;
  const totalAmount = feeCalculation.total;

  const blkdWallet = useMemo(() => mockWallets.find((w) => w.type === 'myimpact' && w.currency === 'BLKD'), []);
  const blkdBalance = useMemo(() => (blkdWallet ? (blkdWallet.availableBalance || blkdWallet.balance) : 0), [blkdWallet]);

  const blkdCoverage = useMemo(() => (useBLKD && blkdBalance > 0 ? Math.min(blkdBalance, totalAmount) : 0), [useBLKD, blkdBalance, totalAmount]);
  const remainingAfterBLKD = useMemo(() => totalAmount - blkdCoverage, [totalAmount, blkdCoverage]);

  const availableWallets = useMemo(() =>
    mockWallets.filter(
      (w) => w.type !== 'myimpact' && w.currency === currency && (w.availableBalance || w.balance) >= remainingAfterBLKD
    ), [currency, remainingAfterBLKD]);

  const handleSelectBusiness = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setShowBusinessModal(false);
    setBusinessSearchQuery('');
  };

  const handleProceed = () => {
    if (step === 'select-business') {
      if (!business) {
        alert('Please select a business');
        return;
      }
      setStep('amount');
      return;
    }
    if (step === 'amount') {
      if (numericAmount <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      if (availableWallets.length === 0 && remainingAfterBLKD > 0) {
        alert(`No ${currency} wallets with sufficient balance`);
        return;
      }
      setStep('payment-method');
    } else if (step === 'payment-method') {
      if (remainingAfterBLKD > 0 && !selectedWallet) {
        alert('Please select a payment method');
        return;
      }
      setStep('review');
    } else if (step === 'review') {
      handleProcessPayment();
    }
  };

  const handleGoBack = () => {
    switch (step) {
      case 'review':
        setStep('payment-method');
        break;
      case 'payment-method':
        setStep('amount');
        break;
      case 'amount':
        // If there was a businessId in params, going back should navigate back.
        if (params.businessId) {
          router.back();
        } else {
          setStep('select-business');
        }
        break;
      case 'select-business':
      default:
        router.back();
        break;
    }
  };

  const handleProcessPayment = () => {
    setStep('processing');
    setTimeout(() => {
      const newTransactionId = `TXN-${Date.now()}`;
      setTransactionId(newTransactionId);
      setStep('success');
    }, 2000);
  };

  const handleComplete = () => {
    router.push('/pages/transactions');
  };

  const handleSubmitFeedback = () => {
    if (feedbackRating > 0) {
      console.log('Feedback submitted:', {
        businessId: business?.id,
        rating: feedbackRating,
        selectedReasons,
        comment: feedbackComment,
      });
      alert('Thank you for your feedback!');
    }
    setShowFeedbackModal(false);
    setFeedbackRating(0);
    setFeedbackComment('');
    setSelectedReasons([]);
  };

  return {
    // State
    step,
    setStep,
    amount,
    setAmount,
    currency,
    selectedWallet,
    setSelectedWallet,
    useBLKD,
    setUseBLKD,
    note,
    setNote,
    transactionId,
    selectedBusinessId,
    setSelectedBusinessId,
    showBusinessModal,
    setShowBusinessModal,
    businessSearchQuery,
    setBusinessSearchQuery,
    showFeedbackModal,
    setShowFeedbackModal,
    feedbackRating,
    setFeedbackRating,
    feedbackComment,
    setFeedbackComment,
    selectedReasons,
    setSelectedReasons,

    // Derived State
    business,
    numericAmount,
    filteredBusinesses,
    hasBDNPlus,
    serviceFee,
    totalAmount,
    blkdWallet,
    blkdBalance,
    blkdCoverage,
    remainingAfterBLKD,
    availableWallets,
    REVIEW_REASONS,

    // Handlers
    handleSelectBusiness,
    handleProceed,
    handleGoBack,
    handleProcessPayment,
    handleComplete,
    handleSubmitFeedback,
  };
};
