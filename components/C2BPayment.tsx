import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { logger } from '../lib/logger';

import { SelectBusiness } from './c2b-payment/SelectBusiness';
import { AmountStep } from './c2b-payment/AmountStep';
import { PaymentMethodStep } from './c2b-payment/PaymentMethodStep';
import { ReviewStep } from './c2b-payment/ReviewStep';
import { ProcessingStep } from './c2b-payment/ProcessingStep';
import { SuccessStep } from './c2b-payment/SuccessStep';
import { BusinessSearchModal } from './c2b-payment/BusinessSearchModal';
import { FeedbackModal } from './c2b-payment/FeedbackModal';

import { Business, mockBusinesses } from '../types/business';
import { Wallet, mockWallets, Currency } from '../types/wallet';

const STEPS = [
  { id: 'business', title: 'Business' },
  { id: 'amount', title: 'Amount' },
  { id: 'method', title: 'Payment' },
  { id: 'review', title: 'Review' },
];

export const C2BPayment = () => {
  // Component State
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [amount, setAmount] = useState('');
  const [useBLKD, setUseBLKD] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Modal State
  const [isBusinessSearchVisible, setBusinessSearchVisible] = useState(false);
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Feedback State
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  // Mock Data
  const [hasBDNPlus, setHasBDNPlus] = useState(true);
  const blkdWallet = mockWallets.find(w => w.currency === 'BLKD');

  const numericAmount = useMemo(() => parseFloat(amount) || 0, [amount]);
  const serviceFee = useMemo(() => hasBDNPlus ? 0 : numericAmount * 0.1, [numericAmount, hasBDNPlus]);
  const totalAmount = useMemo(() => numericAmount + serviceFee, [numericAmount, serviceFee]);

  const blkdBalance = blkdWallet?.balance || 0;
  const blkdCoverage = useMemo(() => useBLKD ? Math.min(numericAmount, blkdBalance) : 0, [useBLKD, numericAmount, blkdBalance]);
  const remainingAfterBLKD = useMemo(() => totalAmount - blkdCoverage, [totalAmount, blkdCoverage]);

  const availableWallets = useMemo(() => mockWallets.filter(w => w.currency !== 'BLKD' && w.balance > 0), []);

  const filteredBusinesses = useMemo(() => 
    mockBusinesses.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
    ), 
  [searchQuery]);

  const resetPaymentFlow = () => {
    setCurrentStep(0);
    setSelectedBusiness(null);
    setAmount('');
    setUseBLKD(false);
    setSelectedWallet(null);
    setNote('');
    setIsProcessing(false);
    setIsSuccess(false);
    setTransactionId(null);
    setRating(0);
    setFeedback('');
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSelectBusiness = (businessId: string) => {
    const business = mockBusinesses.find(b => b.id === businessId);
    if (business) {
      setSelectedBusiness(business);
      setBusinessSearchVisible(false);
      handleNext(); // Move to amount step
    }
  };

  const handlePayment = async () => {
    setCurrentStep(STEPS.length); // Move to processing view
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call

    setTransactionId(`TXN${Date.now()}`);
    setIsProcessing(false);
    setIsSuccess(true);
  };

  const handleFeedbackSubmit = () => {
    logger.info('Feedback Submitted', { rating, feedback });
    setFeedbackVisible(false);
    resetPaymentFlow();
  };

  const isNextDisabled = () => {
    if (currentStep === 0) return !selectedBusiness;
    if (currentStep === 1) return numericAmount <= 0;
    if (currentStep === 2) return remainingAfterBLKD > 0 && !selectedWallet;
    return false;
  };

  const renderStep = () => {
    if (isProcessing) {
      return <ProcessingStep businessName={selectedBusiness?.name || ''} />;
    }
    if (isSuccess) {
      return <SuccessStep 
        businessName={selectedBusiness?.name || ''} 
        totalAmount={numericAmount}
        currency="USD"
        transactionId={transactionId}
        onShowFeedback={() => setFeedbackVisible(true)}
      />;
    }

    switch (currentStep) {
      case 0:
        return <SelectBusiness onSelect={() => setBusinessSearchVisible(true)} />;
      case 1:
        return <AmountStep 
          business={selectedBusiness}
          amount={amount}
          setAmount={setAmount}
          currency="USD"
          numericAmount={numericAmount}
          serviceFee={serviceFee}
          totalAmount={totalAmount}
          hasBDNPlus={hasBDNPlus}
          onEditBusiness={() => setCurrentStep(0)}
        />;
      case 2:
        return <PaymentMethodStep
          businessName={selectedBusiness?.name || ''}
          numericAmount={numericAmount}
          totalAmount={totalAmount}
          currency="USD"
          useBLKD={useBLKD}
          setUseBLKD={setUseBLKD}
          blkdWallet={blkdWallet}
          blkdBalance={blkdBalance}
          blkdCoverage={blkdCoverage}
          remainingAfterBLKD={remainingAfterBLKD}
          availableWallets={availableWallets}
          selectedWallet={selectedWallet}
          setSelectedWallet={setSelectedWallet}
        />;
      case 3:
        return <ReviewStep
          business={selectedBusiness}
          note={note}
          setNote={setNote}
          totalAmount={totalAmount}
          currency="USD"
          useBLKD={useBLKD}
          blkdCoverage={blkdCoverage}
          remainingAfterBLKD={remainingAfterBLKD}
          serviceFee={serviceFee}
          hasBDNPlus={hasBDNPlus}
          numericAmount={numericAmount}
          selectedWallet={selectedWallet}
        />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        {/* Header */}
        {!isProcessing && !isSuccess && (
          <View className="p-6 flex-row items-center justify-between">
            <TouchableOpacity onPress={handleBack} disabled={currentStep === 0}>
              <MaterialIcons name="arrow-back" size={24} color={currentStep > 0 ? "#ffffff" : "transparent"} />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white">Pay Business</Text>
            <TouchableOpacity onPress={resetPaymentFlow}>
               <MaterialIcons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Progress Bar */}
        {!isProcessing && !isSuccess && currentStep > 0 && (
          <View className="px-6 mb-4">
            <View className="flex-row bg-zinc-800 rounded-full h-1.5">
              <View style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%`}} className="bg-primary rounded-full" />
            </View>
          </View>
        )}

        {/* Content */}
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
          {renderStep()}
        </ScrollView>

        {/* Footer */}
        {!isProcessing && !isSuccess && currentStep > 0 && (
          <View className="p-6 border-t border-zinc-800">
            <TouchableOpacity
              onPress={currentStep === STEPS.length - 1 ? handlePayment : handleNext}
              disabled={isNextDisabled()}
              className={`rounded-full p-4 items-center justify-center ${isNextDisabled() ? 'bg-zinc-700' : 'bg-primary'}`}
            >
              {currentStep === STEPS.length - 1 ? (
                <View className="items-center">
                  <Text className={`text-lg font-bold ${isNextDisabled() ? 'text-gray-500' : 'text-white'}`}>
                    Pay
                  </Text>
                  <Text className={`text-sm font-normal ${isNextDisabled() ? 'text-gray-400' : 'text-white/90'}`}>
                    {formatCurrency(remainingAfterBLKD > 0 ? remainingAfterBLKD : totalAmount, "USD")}
                  </Text>
                </View>
              ) : (
                <Text className={`text-lg font-bold ${isNextDisabled() ? 'text-gray-500' : 'text-white'}`}>
                  Next
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Modals */}
        <BusinessSearchModal 
          visible={isBusinessSearchVisible}
          onClose={() => setBusinessSearchVisible(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredBusinesses={filteredBusinesses}
          onSelectBusiness={handleSelectBusiness}
        />
        <FeedbackModal 
          visible={isFeedbackVisible}
          onClose={() => setFeedbackVisible(false)}
          rating={rating}
          setRating={setRating}
          feedback={feedback}
          setFeedback={setFeedback}
          onSubmit={handleFeedbackSubmit}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
