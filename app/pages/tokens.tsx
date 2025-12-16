import React from 'react';
import { View, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useResponsive } from '../../hooks/useResponsive';
import { BackButton } from '../../components/navigation/BackButton';
import {
  TokenBalanceCard,
  TokenTabs,
  CertificateModal,
  RecurringConfirmModal,
} from '../../components/tokens';
import { TokenPurchaseForm } from '../../components/tokens/TokenPurchaseForm';
import { useTokensPage } from '../../hooks/useTokensPage';

// Mock Data (to be removed)
import { mockLedgerEntries, mockPurchases, mockRecurringPurchase } from '../../data/mocks/tokens';
import { RecurringPurchaseManager } from '../../components/tokens/RecurringPurchaseManager';
import { PurchaseHistoryList } from '../../components/tokens/PurchaseHistoryList';
import { TokenLedgerEntries } from '../../components/tokens/TokenLedgerEntries';

export default function Tokens() {
  const { width } = useWindowDimensions();
  const { isMobile, paddingHorizontal } = useResponsive();
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
    TOKEN_PRICE,
  } = useTokensPage();

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        <BackButton
          label="Back"
          to="/(tabs)/pay"
          textColor="#ffffff"
          iconColor="#ffffff"
          marginBottom={24}
        />

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
                <PurchaseHistoryList purchases={mockPurchases} />
                <TokenLedgerEntries 
                  ledgerEntries={mockLedgerEntries} 
                  getTransactionIcon={getTransactionIcon} 
                  formatDate={formatDate} 
                />
              </View>
            )}
          </>
        ) : (
          <>
            {/* Desktop Layout Here */}
          </>
        )}
      </ScrollView>

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
    </View>
  );
}
