import React, { useEffect } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/navigation/BackButton';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';
import {
  TokenBalanceCard,
  TokenTabs,
  CertificateModal,
  RecurringConfirmModal,
  OneTimePurchaseConfirmModal,
} from '@/components/tokens';
import { TokenPurchaseForm } from '@/components/tokens/TokenPurchaseForm';
import { useTokensPage } from '@/hooks/useTokensPage';

// Mock Data (to be removed)
import { mockLedgerEntries, mockRecurringPurchase } from '@/data/mocks/tokens';
import { RecurringPurchaseManager } from '@/components/tokens/RecurringPurchaseManager';
import { TokenLedgerEntries } from '@/components/tokens/TokenLedgerEntries';

export default function Tokens() {
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const params = useLocalSearchParams<{ tab?: string }>();
  const {
    tokenAmount, setTokenAmount,
    purchaseType, setPurchaseType,
    recurringFrequency, setRecurringFrequency,
    activeTab, setActiveTab,
    recurringPurchases,
    isEditingRecurring,
    editRecurringTokens, setEditRecurringTokens,
    editRecurringFrequency, setEditRecurringFrequency,
    showCertificateModal, setShowCertificateModal,
    showRecurringConfirmModal, setShowRecurringConfirmModal,
    showOneTimeConfirmModal, setShowOneTimeConfirmModal,
    totalTokens,
    handlePurchase,
    handleDownloadCertificate,
    handleViewCertificate,
    formatDate,
    getTransactionIcon,
    getFrequencyLabel,
    getPaymentMethodDisplay,
    handleEditRecurring,
    handleSaveRecurring,
    handleCancelEdit,
    handlePauseRecurring,
    handleResumeRecurring,
    handleCancelRecurring,
    handleSetupRecurringPurchase,
    handleConfirmRecurringPurchase,
    handleConfirmOneTimePurchase,
    TOKEN_PRICE,
  } = useTokensPage();

  // Set initial tab from URL parameter
  useEffect(() => {
    if (params.tab === 'manage' || params.tab === 'purchase') {
      setActiveTab(params.tab);
    }
  }, [params.tab, setActiveTab]);

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <BackButton
          label="Back"
          to="/(tabs)/pay"
          textColor="#ffffff"
          iconColor="#ffffff"
          marginBottom={24}
        />

        <View style={{ maxWidth: 1400, width: "100%", alignSelf: "center" }}>
          {isMobile ? (
            <>
              <TokenBalanceCard
                totalTokens={totalTokens}
                onViewCertificate={handleViewCertificate}
                onDownloadCertificate={handleDownloadCertificate}
                isMobile={true}
              />

              <TokenTabs activeTab={activeTab} onTabChange={setActiveTab} />

              {activeTab === 'purchase' && (
                <TokenPurchaseForm
                  purchaseType={purchaseType}
                  setPurchaseType={setPurchaseType}
                  tokenAmount={tokenAmount}
                  setTokenAmount={setTokenAmount}
                  recurringFrequency={recurringFrequency}
                  setRecurringFrequency={setRecurringFrequency}
                  handleSetupRecurringPurchase={handleSetupRecurringPurchase}
                  handlePurchase={handlePurchase}
                  TOKEN_PRICE={TOKEN_PRICE}
                  getFrequencyLabel={getFrequencyLabel}
                />
              )}

              {activeTab === 'manage' && (
                <View>
                  <RecurringPurchaseManager 
                    recurringPurchases={mockRecurringPurchase} // to be replaced with recurringPurchases
                    isEditingRecurring={isEditingRecurring}
                    editRecurringTokens={editRecurringTokens}
                    setEditRecurringTokens={setEditRecurringTokens}
                    editRecurringFrequency={editRecurringFrequency}
                    setEditRecurringFrequency={setEditRecurringFrequency}
                    handleEditRecurring={handleEditRecurring}
                    handleSaveRecurring={handleSaveRecurring}
                    handleCancelEdit={handleCancelEdit}
                    handlePauseRecurring={handlePauseRecurring}
                    handleResumeRecurring={handleResumeRecurring}
                    handleCancelRecurring={handleCancelRecurring}
                    getFrequencyLabel={getFrequencyLabel}
                    getPaymentMethodDisplay={getPaymentMethodDisplay}
                    formatDate={formatDate}
                  />
                  <TokenLedgerEntries 
                    ledgerEntries={mockLedgerEntries} 
                    getTransactionIcon={getTransactionIcon} 
                    formatDate={formatDate} 
                  />
                </View>
              )}
            </>
          ) : (
            <View style={{ flexDirection: "row", gap: 24, alignItems: "flex-start" }}>
              {/* Left Column: Balance Card and Tabs */}
              <View style={{ width: 400, flexShrink: 0 }}>
                <TokenBalanceCard
                  totalTokens={totalTokens}
                  onViewCertificate={handleViewCertificate}
                  onDownloadCertificate={handleDownloadCertificate}
                  isMobile={false}
                />
                <View style={{ marginTop: 24 }}>
                  <TokenTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </View>
              </View>

              {/* Right Column: Content */}
              <View style={{ flex: 1, minWidth: 0 }}>
                {activeTab === 'purchase' && (
                  <TokenPurchaseForm
                    purchaseType={purchaseType}
                    setPurchaseType={setPurchaseType}
                    tokenAmount={tokenAmount}
                    setTokenAmount={setTokenAmount}
                    recurringFrequency={recurringFrequency}
                    setRecurringFrequency={setRecurringFrequency}
                    handleSetupRecurringPurchase={handleSetupRecurringPurchase}
                    handlePurchase={handlePurchase}
                    TOKEN_PRICE={TOKEN_PRICE}
                    getFrequencyLabel={getFrequencyLabel}
                  />
                )}

                {activeTab === 'manage' && (
                  <View style={{ gap: 24 }}>
                    <RecurringPurchaseManager 
                      recurringPurchases={mockRecurringPurchase} // to be replaced with recurringPurchases
                      isEditingRecurring={isEditingRecurring}
                      editRecurringTokens={editRecurringTokens}
                      setEditRecurringTokens={setEditRecurringTokens}
                      editRecurringFrequency={editRecurringFrequency}
                      setEditRecurringFrequency={setEditRecurringFrequency}
                      handleEditRecurring={handleEditRecurring}
                      handleSaveRecurring={handleSaveRecurring}
                      handleCancelEdit={handleCancelEdit}
                      handlePauseRecurring={handlePauseRecurring}
                      handleResumeRecurring={handleResumeRecurring}
                      handleCancelRecurring={handleCancelRecurring}
                      getFrequencyLabel={getFrequencyLabel}
                      getPaymentMethodDisplay={getPaymentMethodDisplay}
                      formatDate={formatDate}
                    />
                    <TokenLedgerEntries 
                      ledgerEntries={mockLedgerEntries} 
                      getTransactionIcon={getTransactionIcon} 
                      formatDate={formatDate} 
                    />
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </OptimizedScrollView>

      <CertificateModal
        visible={showCertificateModal}
        totalTokens={totalTokens}
        onClose={() => setShowCertificateModal(false)}
        onDownload={handleDownloadCertificate}
      />

      <RecurringConfirmModal
        visible={showRecurringConfirmModal}
        tokenAmount={tokenAmount}
        frequency={recurringFrequency}
        onConfirm={handleConfirmRecurringPurchase}
        onCancel={() => setShowRecurringConfirmModal(false)}
        getFrequencyLabel={getFrequencyLabel}
      />

      <OneTimePurchaseConfirmModal
        visible={showOneTimeConfirmModal}
        tokenAmount={tokenAmount}
        onConfirm={handleConfirmOneTimePurchase}
        onCancel={() => setShowOneTimeConfirmModal(false)}
      />
    </View>
  );
}
