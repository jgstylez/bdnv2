import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import {
  TokenPurchase, 
  TokenLedgerEntry, 
  RecurringPurchase, 
  TOKEN_PRICE 
} from '../types/token';
import { mockLedgerEntries as importedMockLedgerEntries } from '../data/mocks/tokens';

// Mock data that will be replaced with API calls
const mockPurchases: TokenPurchase[] = [];
const mockLedgerEntries: TokenLedgerEntry[] = importedMockLedgerEntries;
const mockPaymentMethods: Record<string, { name: string; type: "creditcard" | "bankaccount"; last4: string; brand?: string }> = {};
const mockRecurringPurchase: RecurringPurchase | null = null;

export const useTokensPage = () => {
  const router = useRouter();
  const [tokenAmount, setTokenAmount] = useState("10");
  const [purchaseType, setPurchaseType] = useState<"one-time" | "recurring">("recurring");
  const [recurringFrequency, setRecurringFrequency] = useState<"weekly" | "monthly" | "bi-monthly" | "quarterly" | "annually">("monthly");
  const [activeTab, setActiveTab] = useState<"purchase" | "manage">("purchase");
  const [recurringPurchases, setRecurringPurchases] = useState<RecurringPurchase | null>(mockRecurringPurchase);
  const [isEditingRecurring, setIsEditingRecurring] = useState(false);
  const [editRecurringTokens, setEditRecurringTokens] = useState("10");
  const [editRecurringFrequency, setEditRecurringFrequency] = useState<"weekly" | "monthly" | "bi-monthly" | "quarterly" | "annually">("monthly");
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showRecurringConfirmModal, setShowRecurringConfirmModal] = useState(false);
  const [showOneTimeConfirmModal, setShowOneTimeConfirmModal] = useState(false);

  const totalTokens = useMemo(() => {
    if (mockLedgerEntries.length === 0) return 0;
    // Since all entries are purchases now, use the highest balance
    // which represents the current total after all transactions
    return Math.max(...mockLedgerEntries.map(entry => entry.balance), 0);
  }, [mockLedgerEntries]);

  const handlePurchase = () => {
    const tokens = parseInt(tokenAmount) || 0;
    if (tokens <= 0) {
      alert("Please enter a valid number of tokens");
      return;
    }
    setShowOneTimeConfirmModal(true);
  };

  const handleConfirmOneTimePurchase = () => {
    setShowOneTimeConfirmModal(false);
    router.push("/pages/payments/token-purchase");
  };

  const handleDownloadCertificate = () => {
    alert(`Downloading certificate for ${totalTokens} tokens...`);
  };

  const handleViewCertificate = () => {
    setShowCertificateModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase": return "add-shopping-cart";
      case "transfer": return "swap-horiz";
      case "reward": return "stars";
      case "redemption": return "redeem";
      default: return "account-balance-wallet";
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      "weekly": "Weekly",
      "monthly": "Monthly",
      "bi-monthly": "Bi-monthly",
      "quarterly": "Quarterly",
      "annually": "Annually",
    };
    return labels[frequency] || frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  const getPaymentMethodDisplay = (paymentMethodId: string) => {
    const method = mockPaymentMethods[paymentMethodId];
    if (!method) return "Payment Method";
    return method.type === "creditcard" ? `${method.brand} •••• ${method.last4}` : `${method.name} •••• ${method.last4}`;
  };

  const handleEditRecurring = () => {
    if (recurringPurchases) {
      setIsEditingRecurring(true);
      setEditRecurringTokens(recurringPurchases.tokensPerPurchase.toString());
      const frequency = recurringPurchases.frequency === "bi-weekly" ? "weekly" : recurringPurchases.frequency;
      setEditRecurringFrequency(frequency as any);
    }
  };

  const handleSaveRecurring = () => {
    if (recurringPurchases) {
      setRecurringPurchases({
        ...recurringPurchases,
        tokensPerPurchase: parseInt(editRecurringTokens) || 1,
        frequency: editRecurringFrequency,
      });
      setIsEditingRecurring(false);
      alert("Recurring purchase updated successfully");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingRecurring(false);
    if (recurringPurchases) {
      setEditRecurringTokens(recurringPurchases.tokensPerPurchase.toString());
      setEditRecurringFrequency(recurringPurchases.frequency as any);
    }
  };

  const handlePauseRecurring = () => {
    if (recurringPurchases) {
      setRecurringPurchases({ ...recurringPurchases, isActive: false });
      alert("Recurring purchase paused");
    }
  };

  const handleResumeRecurring = () => {
    if (recurringPurchases) {
      setRecurringPurchases({ ...recurringPurchases, isActive: true });
      alert("Recurring purchase resumed");
    }
  };

  const handleCancelRecurring = () => {
    if (confirm("Are you sure you want to cancel this recurring purchase?")) {
      setRecurringPurchases(null);
      alert("Recurring purchase cancelled");
    }
  };

  const handleSetupRecurringPurchase = () => {
    const tokens = parseInt(tokenAmount) || 1;
    if (tokens < 1) {
      alert("Please enter at least 1 token");
      return;
    }
    setShowRecurringConfirmModal(true);
  };

  const handleConfirmRecurringPurchase = () => {
    const tokens = parseInt(tokenAmount) || 1;
    const calculateNextDate = (frequency: string) => {
      const next = new Date();
      switch (frequency) {
        case "weekly": next.setDate(next.getDate() + 7); break;
        case "monthly": next.setMonth(next.getMonth() + 1); break;
        case "bi-monthly": next.setMonth(next.getMonth() + 2); break;
        case "quarterly": next.setMonth(next.getMonth() + 3); break;
        case "annually": next.setFullYear(next.getFullYear() + 1); break;
      }
      return next.toISOString();
    };

    const nextPurchaseDate = calculateNextDate(recurringFrequency);

    const newRecurringPurchase: RecurringPurchase = {
      id: `recurring-${Date.now()}`,
      userId: "user1",
      tokensPerPurchase: tokens,
      frequency: recurringFrequency,
      nextPurchaseDate: nextPurchaseDate,
      isActive: true,
      paymentMethodId: "pm-001",
      startDate: new Date().toISOString(),
    };

    setRecurringPurchases(newRecurringPurchase);
    setShowRecurringConfirmModal(false);
    
    // Navigate to success page instead of showing alert
    router.push({
      pathname: "/pages/tokens/recurring-success",
      params: {
        tokens: tokens.toString(),
        frequency: recurringFrequency,
        nextPurchaseDate: nextPurchaseDate,
      },
    });
  };

  return {
    tokenAmount, setTokenAmount,
    purchaseType, setPurchaseType,
    recurringFrequency, setRecurringFrequency,
    activeTab, setActiveTab,
    recurringPurchases, setRecurringPurchases,
    isEditingRecurring, setIsEditingRecurring,
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
    mockLedgerEntries, // will be removed after API integration
    mockPurchases, // will be removed after API integration
    TOKEN_PRICE, // will be removed after API integration
  };
};
