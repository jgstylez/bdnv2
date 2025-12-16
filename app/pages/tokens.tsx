import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { TokenPurchase, TokenLedgerEntry, RecurringPurchase, TOKEN_PRICE } from "../../types/token";
import { useResponsive } from "../../hooks/useResponsive";
import { colors, spacing } from "../../constants/theme";
import { BackButton } from "../../components/navigation/BackButton";
import {
  TokenBalanceCard,
  TokenTabs,
  TokenCertificate,
  TokenPurchaseForm,
  RecurringPurchaseManager,
  PurchaseHistoryList,
  TokenLedgerEntries,
  CertificateModal,
  RecurringConfirmModal,
} from "../../components/tokens";

// Mock data - will be replaced with actual state management
const mockPurchases: TokenPurchase[] = [
  {
    id: "1",
    userId: "user1",
    tokens: 10,
    costPerToken: TOKEN_PRICE,
    totalCost: 150.0,
    currency: "USD",
    purchaseDate: "2024-01-15T10:30:00Z",
    status: "completed",
    transactionId: "TXN-001",
    certificateUrl: "/certificates/cert-001.pdf",
  },
  {
    id: "2",
    userId: "user1",
    tokens: 5,
    costPerToken: TOKEN_PRICE,
    totalCost: 75.0,
    currency: "USD",
    purchaseDate: "2024-02-01T14:20:00Z",
    status: "completed",
    transactionId: "TXN-002",
    certificateUrl: "/certificates/cert-002.pdf",
  },
  {
    id: "3",
    userId: "user1",
    tokens: 20,
    costPerToken: TOKEN_PRICE,
    totalCost: 300.0,
    currency: "USD",
    purchaseDate: "2024-02-10T09:15:00Z",
    status: "pending",
    transactionId: "TXN-003",
  },
];

const mockLedgerEntries: TokenLedgerEntry[] = [
  {
    id: "1",
    userId: "user1",
    transactionType: "purchase",
    tokens: 10,
    balance: 10,
    date: "2024-01-15T10:30:00Z",
    description: "Token Purchase",
    relatedPurchaseId: "1",
  },
  {
    id: "2",
    userId: "user1",
    transactionType: "purchase",
    tokens: 5,
    balance: 15,
    date: "2024-02-01T14:20:00Z",
    description: "Token Purchase",
    relatedPurchaseId: "2",
  },
  {
    id: "3",
    userId: "user1",
    transactionType: "reward",
    tokens: 2,
    balance: 17,
    date: "2024-02-05T12:00:00Z",
    description: "Reward for referral",
  },
];

// Mock payment method data - in production, this would be fetched from paymentMethodId
const mockPaymentMethods: Record<string, { name: string; type: "creditcard" | "bankaccount"; last4: string; brand?: string }> = {
  "pm-001": {
    name: "Visa Card",
    type: "creditcard",
    last4: "4321",
    brand: "Visa",
  },
};

const mockRecurringPurchase: RecurringPurchase | null = {
  id: "1",
  userId: "user1",
  tokensPerPurchase: 10,
  frequency: "monthly",
  nextPurchaseDate: "2024-03-01T00:00:00Z",
  isActive: true,
  paymentMethodId: "pm-001",
  startDate: "2024-01-01T00:00:00Z",
};

export default function Tokens() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
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

  const totalTokens = mockLedgerEntries.reduce((sum, entry) => {
    if (entry.transactionType === "purchase" || entry.transactionType === "reward") {
      return sum + entry.tokens;
    }
    return sum - entry.tokens;
  }, 0);

  const handlePurchase = () => {
    router.push("/pages/payments/token-purchase");
  };

  const handleDownloadCertificate = () => {
    // In production, this would generate/download the PDF certificate
    // For now, simulate the download
    alert(`Downloading certificate for ${totalTokens} tokens...\n\nCertificate includes all token purchases and shows total tokens held.`);
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
      case "purchase":
        return "add-shopping-cart";
      case "transfer":
        return "swap-horiz";
      case "reward":
        return "stars";
      case "redemption":
        return "redeem";
      default:
        return "account-balance-wallet";
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
    if (method.type === "creditcard") {
      return `${method.brand} •••• ${method.last4}`;
    }
    return `${method.name} •••• ${method.last4}`;
  };

  const handleEditRecurring = () => {
    if (recurringPurchases) {
      setIsEditingRecurring(true);
      setEditRecurringTokens(recurringPurchases.tokensPerPurchase.toString());
      // Map "bi-weekly" to "weekly" since editFrequency doesn't support bi-weekly
      const frequency = recurringPurchases.frequency === "bi-weekly" ? "weekly" : recurringPurchases.frequency;
      setEditRecurringFrequency(frequency as "weekly" | "monthly" | "bi-monthly" | "quarterly" | "annually");
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
      setEditRecurringFrequency(recurringPurchases.frequency);
    }
  };

  const handlePauseRecurring = () => {
    if (recurringPurchases) {
      setRecurringPurchases({
        ...recurringPurchases,
        isActive: false,
      });
      alert("Recurring purchase paused");
    }
  };

  const handleResumeRecurring = () => {
    if (recurringPurchases) {
      setRecurringPurchases({
        ...recurringPurchases,
        isActive: true,
      });
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

    // Show confirmation modal
    setShowRecurringConfirmModal(true);
  };

  const handleConfirmRecurringPurchase = () => {
    const tokens = parseInt(tokenAmount) || 1;
    
    // Calculate next purchase date based on frequency
    const calculateNextDate = (frequency: string) => {
      const next = new Date();
      switch (frequency) {
        case "weekly":
          next.setDate(next.getDate() + 7);
          break;
        case "monthly":
          next.setMonth(next.getMonth() + 1);
          break;
        case "bi-monthly":
          next.setMonth(next.getMonth() + 2);
          break;
        case "quarterly":
          next.setMonth(next.getMonth() + 3);
          break;
        case "annually":
          next.setFullYear(next.getFullYear() + 1);
          break;
      }
      return next.toISOString();
    };

    // Create new recurring purchase
    const newRecurringPurchase: RecurringPurchase = {
      id: `recurring-${Date.now()}`,
      userId: "user1",
      tokensPerPurchase: tokens,
      frequency: recurringFrequency,
      nextPurchaseDate: calculateNextDate(recurringFrequency),
      isActive: true,
      paymentMethodId: "pm-001", // In production, this would be selected by user
      startDate: new Date().toISOString(),
    };

    // Update state
    setRecurringPurchases(newRecurringPurchase);
    
    // Close confirmation modal
    setShowRecurringConfirmModal(false);
    
    // Switch to Manage tab to show the new recurring purchase
    setActiveTab("manage");
    
    // Show success message
    alert(`Recurring purchase set up successfully!\n${tokens} tokens will be purchased ${getFrequencyLabel(recurringFrequency).toLowerCase()}`);
  };

  // Note: When purchases complete successfully, ledger entries are automatically created
  // One-time purchases: Creates a "purchase" transaction entry
  // Recurring purchases: Creates a "purchase" transaction entry on each successful auto-draft

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
        {/* Back Button */}
        <BackButton
          label="Back"
          to="/(tabs)/pay"
          textColor="#ffffff"
          iconColor="#ffffff"
          marginBottom={24}
        />

        {/* Two Column Layout (Desktop) or Stacked (Mobile) */}
        {isMobile ? (
          <>
            {/* Token Balance - Mobile */}
            <TokenBalanceCard
              totalTokens={totalTokens}
              onViewCertificate={handleViewCertificate}
              onDownloadCertificate={handleDownloadCertificate}
              isMobile={true}
            />

            {/* Tabs - Mobile */}
            <TokenTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Purchase Tab */}
        {activeTab === "purchase" && (
          <View>
            {/* Purchase Type Selection - Card Style */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 12,
                }}
              >
                Purchase Type
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setPurchaseType("recurring")}
                  style={{
                    flex: 1,
                    backgroundColor: purchaseType === "recurring" ? "#ba9988" : "#474747",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: purchaseType === "recurring" ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="repeat" size={32} color={purchaseType === "recurring" ? "#ffffff" : "#ba9988"} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginTop: 8,
                    }}
                  >
                    Recurring
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: purchaseType === "recurring" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)",
                      marginTop: 4,
                      textAlign: "center",
                    }}
                  >
                    Auto-renewal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPurchaseType("one-time")}
                  style={{
                    flex: 1,
                    backgroundColor: purchaseType === "one-time" ? "#ba9988" : "#474747",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: purchaseType === "one-time" ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="shopping-cart" size={32} color={purchaseType === "one-time" ? "#ffffff" : "#ba9988"} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginTop: 8,
                    }}
                  >
                    One-time
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: purchaseType === "one-time" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)",
                      marginTop: 4,
                      textAlign: "center",
                    }}
                  >
                    Single purchase
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount Selection */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Select Amount
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                  marginBottom: 12,
                }}
              >
                Select a preset amount or enter a custom amount
              </Text>
              
              {/* Preset Amount Cards */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {[1, 5, 10, 25, 50, 100].map((amount) => {
                  const selected = tokenAmount === amount.toString();
                  const totalPrice = amount * TOKEN_PRICE;
                  return (
                    <TouchableOpacity
                      key={amount}
                      onPress={() => setTokenAmount(amount.toString())}
                      style={{
                        flex: isMobile ? undefined : 1,
                        minWidth: isMobile ? "48%" : 0,
                        backgroundColor: selected ? "#ba9988" : "#474747",
                        borderRadius: 12,
                        padding: 14,
                        borderWidth: 1,
                        borderColor: selected ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: "#ffffff",
                            marginBottom: 6,
                          }}
                        >
                          {amount} Token{amount !== 1 ? "s" : ""}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: selected ? "#ffffff" : "#ba9988",
                          }}
                        >
                          ${totalPrice.toFixed(2)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Custom Amount */}
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                    marginBottom: 8,
                  }}
                >
                  Or enter custom amount
                </Text>
                <TextInput
                  value={tokenAmount}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 0;
                    if (purchaseType === "recurring" && num < 1 && text !== "") {
                      setTokenAmount("1");
                    } else {
                      setTokenAmount(text);
                    }
                  }}
                  keyboardType="number-pad"
                  placeholder={purchaseType === "recurring" ? "Enter amount (min 1)" : "Enter custom amount"}
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: "#ffffff",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>
            </View>

            {/* Frequency Selection (only for recurring) */}
            {purchaseType === "recurring" && (
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Frequency
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                    marginBottom: 12,
                  }}
                >
                  How often should tokens be purchased?
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {[
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                    { value: "bi-monthly", label: "Bi-monthly" },
                    { value: "quarterly", label: "Quarterly" },
                    { value: "annually", label: "Annually" },
                  ].map((freq) => (
                    <TouchableOpacity
                      key={freq.value}
                      onPress={() => setRecurringFrequency(freq.value as any)}
                      style={{
                        backgroundColor: recurringFrequency === freq.value ? "#ba9988" : "#474747",
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderWidth: 1,
                        borderColor: recurringFrequency === freq.value ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: "#ffffff",
                        }}
                      >
                        {freq.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Summary */}
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Tokens</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                  {parseInt(tokenAmount) || (purchaseType === "recurring" ? 1 : 0)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Price per Token</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                  ${TOKEN_PRICE.toFixed(2)}
                </Text>
              </View>
              {purchaseType === "recurring" && (
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Frequency</Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                    {getFrequencyLabel(recurringFrequency)}
                  </Text>
                </View>
              )}
              <View
                style={{
                  height: 1,
                  backgroundColor: "rgba(186, 153, 136, 0.2)",
                  marginVertical: 12,
                }}
              />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
                  {purchaseType === "recurring" ? "Total per Purchase" : "Total"}
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "700", color: "#ba9988" }}>
                  ${((parseInt(tokenAmount) || (purchaseType === "recurring" ? 1 : 0)) * TOKEN_PRICE).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Non-Refundable Disclaimer */}
            <View
              style={{
                backgroundColor: "rgba(255, 152, 0, 0.1)",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: "rgba(255, 152, 0, 0.3)",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <MaterialIcons name="info" size={20} color="#ff9800" style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 4,
                  }}
                >
                  Non-Refundable Purchase
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 18,
                  }}
                >
                  Token purchases are final and non-refundable. Upon completion, you will receive a certificate documenting your token holdings.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (purchaseType === "recurring") {
                  handleSetupRecurringPurchase();
                } else {
                  handlePurchase();
                }
              }}
              disabled={
                purchaseType === "recurring"
                  ? !tokenAmount || parseInt(tokenAmount) < 1
                  : !tokenAmount || parseInt(tokenAmount) <= 0
              }
              style={{
                backgroundColor:
                  (purchaseType === "recurring"
                    ? parseInt(tokenAmount) >= 1
                    : parseInt(tokenAmount) > 0) || (purchaseType === "recurring" && !tokenAmount)
                      ? "#ba9988"
                      : "rgba(186, 153, 136, 0.3)",
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color:
                    (purchaseType === "recurring"
                      ? parseInt(tokenAmount) >= 1
                      : parseInt(tokenAmount) > 0) || (purchaseType === "recurring" && !tokenAmount)
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.5)",
                }}
              >
                {purchaseType === "recurring" ? "Set Up Recurring Purchase" : "Make One-Time Purchase"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Manage Tab */}
        {activeTab === "manage" && (
          <View>
            {/* Token Certificate */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 16,
                }}
              >
                Token Certificate
              </Text>
              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 20,
                  padding: 24,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  marginBottom: 16,
                }}
              >
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                  {/* Certificate Preview */}
                  <TouchableOpacity
                    onPress={handleViewCertificate}
                    activeOpacity={0.8}
                    style={{
                      marginBottom: 16,
                      alignItems: "center",
                    }}
                  >
                    <TokenCertificate totalTokens={totalTokens} width={200} height={140} />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.6)",
                        marginTop: 8,
                      }}
                    >
                      Tap to view larger
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Action Buttons */}
                  <View style={{ flexDirection: "row", gap: 8, width: "100%" }}>
                    <TouchableOpacity
                      onPress={handleViewCertificate}
                      style={{
                        flex: 1,
                        backgroundColor: "#232323",
                        borderRadius: 8,
                        paddingVertical: 12,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <MaterialIcons name="visibility" size={18} color="#ba9988" style={{ marginBottom: 4 }} />
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: "#ba9988",
                        }}
                      >
                        View
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDownloadCertificate}
                      style={{
                        flex: 1,
                        backgroundColor: "#ba9988",
                        borderRadius: 8,
                        paddingVertical: 12,
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcons name="download" size={18} color="#ffffff" style={{ marginBottom: 4 }} />
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: "#ffffff",
                        }}
                      >
                        Download PDF
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Description Text */}
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.6)",
                      lineHeight: 18,
                      marginTop: 16,
                      textAlign: "center",
                    }}
                  >
                    This certificate documents your total token holdings. Each token purchase is recorded and accumulates to your total balance. Token purchases are non-refundable.
                  </Text>
                </View>
              </View>
            </View>

            {/* Active Recurring Purchases */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 16,
                }}
              >
                Active Recurring Purchases
              </Text>
              {recurringPurchases ? (
                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 20,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    marginBottom: 16,
                  }}
                >
                  {!isEditingRecurring ? (
                    <>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <View>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "700",
                              color: "#ffffff",
                              marginBottom: 4,
                            }}
                          >
                            {recurringPurchases.tokensPerPurchase} Tokens
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            {getFrequencyLabel(recurringPurchases.frequency)}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: recurringPurchases.isActive ? "rgba(186, 153, 136, 0.2)" : "rgba(255, 255, 255, 0.1)",
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: "600",
                              color: recurringPurchases.isActive ? "#ba9988" : "rgba(255, 255, 255, 0.6)",
                              textTransform: "uppercase",
                            }}
                          >
                            {recurringPurchases.isActive ? "Active" : "Paused"}
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginBottom: 16 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.7)",
                            marginBottom: 8,
                          }}
                        >
                          Payment Method
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <MaterialIcons
                            name={mockPaymentMethods[recurringPurchases.paymentMethodId]?.type === "creditcard" ? "credit-card" : "account-balance"}
                            size={20}
                            color="#ba9988"
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "600",
                              color: "#ffffff",
                            }}
                          >
                            {getPaymentMethodDisplay(recurringPurchases.paymentMethodId)}
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginBottom: 20 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.7)",
                            marginBottom: 8,
                          }}
                        >
                          Next Purchase
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#ffffff",
                          }}
                        >
                          {formatDate(recurringPurchases.nextPurchaseDate)}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                        <TouchableOpacity
                          onPress={handleEditRecurring}
                          style={{
                            flex: 1,
                            minWidth: "30%",
                            backgroundColor: "#232323",
                            borderRadius: 12,
                            paddingVertical: 12,
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: "rgba(186, 153, 136, 0.2)",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#ffffff",
                            }}
                          >
                            Edit
                          </Text>
                        </TouchableOpacity>
                        {recurringPurchases.isActive ? (
                          <TouchableOpacity
                            onPress={handlePauseRecurring}
                            style={{
                              flex: 1,
                              minWidth: "30%",
                              backgroundColor: "#232323",
                              borderRadius: 12,
                              paddingVertical: 12,
                              alignItems: "center",
                              borderWidth: 1,
                              borderColor: "rgba(255, 193, 7, 0.3)",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "600",
                                color: "#ffc107",
                              }}
                            >
                              Pause
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={handleResumeRecurring}
                            style={{
                              flex: 1,
                              minWidth: "30%",
                              backgroundColor: "#232323",
                              borderRadius: 12,
                              paddingVertical: 12,
                              alignItems: "center",
                              borderWidth: 1,
                              borderColor: "rgba(76, 175, 80, 0.3)",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "600",
                                color: "#4caf50",
                              }}
                            >
                              Resume
                            </Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={handleCancelRecurring}
                          style={{
                            flex: 1,
                            minWidth: "30%",
                            backgroundColor: "#ff4444",
                            borderRadius: 12,
                            paddingVertical: 12,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#ffffff",
                            }}
                          >
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#ffffff",
                          marginBottom: 16,
                        }}
                      >
                        Edit Recurring Purchase
                      </Text>
                      <View style={{ marginBottom: 16 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#ffffff",
                            marginBottom: 8,
                          }}
                        >
                          Tokens per Purchase
                        </Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                          {[1, 5, 10, 25, 50, 100].map((amount) => (
                            <TouchableOpacity
                              key={amount}
                              onPress={() => setEditRecurringTokens(amount.toString())}
                              style={{
                                backgroundColor: editRecurringTokens === amount.toString() ? "#ba9988" : "#232323",
                                borderRadius: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                borderWidth: 1,
                                borderColor: editRecurringTokens === amount.toString() ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: "600",
                                  color: "#ffffff",
                                }}
                              >
                                {amount}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <TextInput
                          value={editRecurringTokens}
                          onChangeText={(text) => {
                            const num = parseInt(text) || 0;
                            if (num >= 1) {
                              setEditRecurringTokens(text);
                            } else if (text === "" || text === "0") {
                              setEditRecurringTokens("1");
                            }
                          }}
                          keyboardType="number-pad"
                          placeholder="Enter amount (min 1)"
                          placeholderTextColor="rgba(255, 255, 255, 0.4)"
                          style={{
                            backgroundColor: "#232323",
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            color: "#ffffff",
                            borderWidth: 1,
                            borderColor: "rgba(186, 153, 136, 0.2)",
                          }}
                        />
                      </View>
                      <View style={{ marginBottom: 20 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#ffffff",
                            marginBottom: 8,
                          }}
                        >
                          Frequency
                        </Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                          {[
                            { value: "weekly", label: "Weekly" },
                            { value: "monthly", label: "Monthly" },
                            { value: "bi-monthly", label: "Bi-monthly" },
                            { value: "quarterly", label: "Quarterly" },
                          ].map((freq) => (
                            <TouchableOpacity
                              key={freq.value}
                              onPress={() => setEditRecurringFrequency(freq.value as any)}
                              style={{
                                backgroundColor: editRecurringFrequency === freq.value ? "#ba9988" : "#232323",
                                borderRadius: 8,
                                paddingVertical: 10,
                                paddingHorizontal: 16,
                                borderWidth: 1,
                                borderColor: editRecurringFrequency === freq.value ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                                flex: 1,
                                minWidth: "30%",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: "600",
                                  color: "#ffffff",
                                  textAlign: "center",
                                }}
                              >
                                {freq.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                      <View style={{ flexDirection: "row", gap: 12 }}>
                        <TouchableOpacity
                          onPress={handleCancelEdit}
                          style={{
                            flex: 1,
                            backgroundColor: "#232323",
                            borderRadius: 12,
                            paddingVertical: 12,
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: "rgba(186, 153, 136, 0.2)",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#ffffff",
                            }}
                          >
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleSaveRecurring}
                          style={{
                            flex: 1,
                            backgroundColor: "#ba9988",
                            borderRadius: 12,
                            paddingVertical: 12,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#ffffff",
                            }}
                          >
                            Save
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 20,
                    padding: 40,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <MaterialIcons name="repeat" size={48} color="rgba(186, 153, 136, 0.5)" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.6)",
                      textAlign: "center",
                      marginTop: 16,
                    }}
                  >
                    No active recurring purchases
                  </Text>
                </View>
              )}
            </View>

            {/* Token Ledger */}
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Token Ledger
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                  marginBottom: 16,
                  fontStyle: "italic",
                }}
              >
                All successful one-time and recurring purchases are automatically reflected here
              </Text>
              {mockLedgerEntries.map((entry) => (
                <View
                  key={entry.id}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    marginBottom: 12,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: entry.transactionType === "purchase" || entry.transactionType === "reward" ? "rgba(186, 153, 136, 0.2)" : "rgba(255, 68, 68, 0.2)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MaterialIcons
                          name={getTransactionIcon(entry.transactionType) as any}
                          size={20}
                          color={entry.transactionType === "purchase" || entry.transactionType === "reward" ? "#ba9988" : "#ff4444"}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#ffffff",
                            marginBottom: 4,
                          }}
                        >
                          {entry.description}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {formatDate(entry.date)}
                        </Text>
                      </View>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: entry.transactionType === "purchase" || entry.transactionType === "reward" ? "#ba9988" : "#ff4444",
                        }}
                      >
                        {entry.transactionType === "purchase" || entry.transactionType === "reward" ? "+" : "-"}
                        {entry.tokens}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                          marginTop: 4,
                        }}
                      >
                        Balance: {entry.balance}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
          </>
        ) : (
          <>
            {/* Desktop Two Column Layout */}
            <View
              style={{
                flexDirection: "row",
                gap: 24,
                alignItems: "flex-start",
              }}
            >
              {/* First Column - Token Balance (Sticky) */}
              <View
                style={{
                  width: "50%",
                  ...(Platform.OS === "web" && {
                    position: "sticky",
                    top: 20,
                    alignSelf: "flex-start",
                    maxHeight: "calc(100vh - 40px)",
                  }),
                }}
              >
                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 20,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 8,
                    }}
                  >
                    Total Tokens You Hold
                  </Text>
                  <Text
                    style={{
                      fontSize: 48,
                      fontWeight: "800",
                      color: "#ba9988",
                      letterSpacing: -1,
                    }}
                  >
                    {totalTokens}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.6)",
                      marginTop: 4,
                    }}
                  >
                    as of {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </Text>
                </View>
              </View>

              {/* Second Column - Tabs and Content */}
              <View style={{ width: "50%" }}>
                {/* Tabs - Desktop */}
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    padding: 4,
                    marginBottom: 24,
                  }}
                >
                  {[
                    { key: "purchase", label: "Purchase" },
                    { key: "manage", label: "Manage" },
                  ].map((tab) => (
                    <TouchableOpacity
                      key={tab.key}
                      onPress={() => setActiveTab(tab.key as any)}
                      style={{
                        flex: 1,
                        backgroundColor: activeTab === tab.key ? "#ba9988" : "transparent",
                        borderRadius: 8,
                        paddingVertical: 12,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: activeTab === tab.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Purchase Tab - Desktop */}
                {activeTab === "purchase" && (
                  <View>
                    {/* Purchase Type Selection - Card Style */}
                    <View style={{ marginBottom: 24 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 12,
                        }}
                      >
                        Purchase Type
                      </Text>
                      <View style={{ flexDirection: "row", gap: 12 }}>
                        <TouchableOpacity
                          onPress={() => setPurchaseType("recurring")}
                          style={{
                            flex: 1,
                            backgroundColor: purchaseType === "recurring" ? "#ba9988" : "#474747",
                            borderRadius: 12,
                            padding: 16,
                            borderWidth: 1,
                            borderColor: purchaseType === "recurring" ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                            alignItems: "center",
                          }}
                        >
                          <MaterialIcons name="repeat" size={32} color={purchaseType === "recurring" ? "#ffffff" : "#ba9988"} />
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#ffffff",
                              marginTop: 8,
                            }}
                          >
                            Recurring
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: purchaseType === "recurring" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)",
                              marginTop: 4,
                              textAlign: "center",
                            }}
                          >
                            Auto-renewal
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setPurchaseType("one-time")}
                          style={{
                            flex: 1,
                            backgroundColor: purchaseType === "one-time" ? "#ba9988" : "#474747",
                            borderRadius: 12,
                            padding: 16,
                            borderWidth: 1,
                            borderColor: purchaseType === "one-time" ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                            alignItems: "center",
                          }}
                        >
                          <MaterialIcons name="shopping-cart" size={32} color={purchaseType === "one-time" ? "#ffffff" : "#ba9988"} />
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#ffffff",
                              marginTop: 8,
                            }}
                          >
                            One-time
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: purchaseType === "one-time" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)",
                              marginTop: 4,
                              textAlign: "center",
                            }}
                          >
                            Single purchase
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Amount Selection */}
                    <View style={{ marginBottom: 24 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 8,
                        }}
                      >
                        Select Amount
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                          marginBottom: 12,
                        }}
                      >
                        Select a preset amount or enter a custom amount
                      </Text>
                      
                      {/* Preset Amount Cards */}
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                        {[1, 5, 10, 25, 50, 100].map((amount) => {
                          const selected = tokenAmount === amount.toString();
                          const totalPrice = amount * TOKEN_PRICE;
                          return (
                            <TouchableOpacity
                              key={amount}
                              onPress={() => setTokenAmount(amount.toString())}
                              style={{
                                flex: 1,
                                backgroundColor: selected ? "#ba9988" : "#474747",
                                borderRadius: 12,
                                padding: 14,
                                borderWidth: 1,
                                borderColor: selected ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                              }}
                            >
                              <View style={{ alignItems: "center" }}>
                                <Text
                                  style={{
                                    fontSize: 18,
                                    fontWeight: "700",
                                    color: "#ffffff",
                                    marginBottom: 2,
                                  }}
                                >
                                  {amount}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: "600",
                                    color: "rgba(255, 255, 255, 0.5)",
                                    marginBottom: 6,
                                  }}
                                >
                                  Token{amount !== 1 ? "s" : ""}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: selected ? "#ffffff" : "#ba9988",
                                  }}
                                >
                                  ${totalPrice.toFixed(2)}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      {/* Custom Amount */}
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                            marginBottom: 8,
                          }}
                        >
                          Or enter custom amount
                        </Text>
                        <TextInput
                          value={tokenAmount}
                          onChangeText={(text) => {
                            const num = parseInt(text) || 0;
                            if (purchaseType === "recurring" && num < 1 && text !== "") {
                              setTokenAmount("1");
                            } else {
                              setTokenAmount(text);
                            }
                          }}
                          keyboardType="number-pad"
                          placeholder={purchaseType === "recurring" ? "Enter amount (min 1)" : "Enter custom amount"}
                          placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          style={{
                            backgroundColor: "#474747",
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            color: "#ffffff",
                            borderWidth: 1,
                            borderColor: "rgba(186, 153, 136, 0.2)",
                          }}
                        />
                      </View>
                    </View>

                    {/* Frequency Selection (only for recurring) */}
                    {purchaseType === "recurring" && (
                      <View style={{ marginBottom: 24 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#ffffff",
                            marginBottom: 8,
                          }}
                        >
                          Frequency
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                            marginBottom: 12,
                          }}
                        >
                          How often should tokens be purchased?
                        </Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                          {[
                            { value: "weekly", label: "Weekly" },
                            { value: "monthly", label: "Monthly" },
                            { value: "bi-monthly", label: "Bi-monthly" },
                            { value: "quarterly", label: "Quarterly" },
                            { value: "annually", label: "Annually" },
                          ].map((freq) => (
                            <TouchableOpacity
                              key={freq.value}
                              onPress={() => setRecurringFrequency(freq.value as any)}
                              style={{
                                backgroundColor: recurringFrequency === freq.value ? "#ba9988" : "#474747",
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderWidth: 1,
                                borderColor: recurringFrequency === freq.value ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 13,
                                  fontWeight: "600",
                                  color: "#ffffff",
                                }}
                              >
                                {freq.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Summary */}
                    <View
                      style={{
                        backgroundColor: "#474747",
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 24,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Tokens</Text>
                        <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                          {parseInt(tokenAmount) || (purchaseType === "recurring" ? 1 : 0)}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Price per Token</Text>
                        <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                          ${TOKEN_PRICE.toFixed(2)}
                        </Text>
                      </View>
                      {purchaseType === "recurring" && (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Frequency</Text>
                          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                            {getFrequencyLabel(recurringFrequency)}
                          </Text>
                        </View>
                      )}
                      <View
                        style={{
                          height: 1,
                          backgroundColor: "rgba(186, 153, 136, 0.2)",
                          marginVertical: 12,
                        }}
                      />
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
                          {purchaseType === "recurring" ? "Total per Purchase" : "Total"}
                        </Text>
                        <Text style={{ fontSize: 20, fontWeight: "700", color: "#ba9988" }}>
                          ${((parseInt(tokenAmount) || (purchaseType === "recurring" ? 1 : 0)) * TOKEN_PRICE).toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {/* Non-Refundable Disclaimer */}
                    <View
                      style={{
                        backgroundColor: "rgba(255, 152, 0, 0.1)",
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 24,
                        borderWidth: 1,
                        borderColor: "rgba(255, 152, 0, 0.3)",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <MaterialIcons name="info" size={20} color="#ff9800" style={{ marginTop: 2 }} />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#ffffff",
                            marginBottom: 4,
                          }}
                        >
                          Non-Refundable Purchase
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.7)",
                            lineHeight: 18,
                          }}
                        >
                          Token purchases are final and non-refundable. Upon completion, you will receive a certificate documenting your token holdings.
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        if (purchaseType === "recurring") {
                          handleSetupRecurringPurchase();
                        } else {
                          handlePurchase();
                        }
                      }}
                      disabled={
                        purchaseType === "recurring"
                          ? !tokenAmount || parseInt(tokenAmount) < 1
                          : !tokenAmount || parseInt(tokenAmount) <= 0
                      }
                      style={{
                        backgroundColor:
                          (purchaseType === "recurring"
                            ? parseInt(tokenAmount) >= 1
                            : parseInt(tokenAmount) > 0) || (purchaseType === "recurring" && !tokenAmount)
                              ? "#ba9988"
                              : "rgba(186, 153, 136, 0.3)",
                        borderRadius: 12,
                        paddingVertical: 16,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color:
                            (purchaseType === "recurring"
                              ? parseInt(tokenAmount) >= 1
                              : parseInt(tokenAmount) > 0) || (purchaseType === "recurring" && !tokenAmount)
                                ? "#ffffff"
                                : "rgba(255, 255, 255, 0.5)",
                        }}
                      >
                        {purchaseType === "recurring" ? "Set Up Recurring Purchase" : "Make One-Time Purchase"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Manage Tab - Desktop */}
                {activeTab === "manage" && (
                  <View>
                    {/* Token Certificate */}
                    <View style={{ marginBottom: 32 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "700",
                          color: "#ffffff",
                          marginBottom: 16,
                        }}
                      >
                        Token Certificate
                      </Text>
                      <View
                        style={{
                          backgroundColor: "#474747",
                          borderRadius: 20,
                          padding: 24,
                          borderWidth: 1,
                          borderColor: "rgba(186, 153, 136, 0.2)",
                          marginBottom: 16,
                        }}
                      >
                        <View style={{ alignItems: "center", marginBottom: 20 }}>
                          {/* Certificate Preview */}
                          <TouchableOpacity
                            onPress={handleViewCertificate}
                            activeOpacity={0.8}
                            style={{
                              marginBottom: 16,
                              alignItems: "center",
                            }}
                          >
                            <TokenCertificate totalTokens={totalTokens} width={200} height={140} />
                            <Text
                              style={{
                                fontSize: 12,
                                color: "rgba(255, 255, 255, 0.6)",
                                marginTop: 8,
                              }}
                            >
                              Tap to view larger
                            </Text>
                          </TouchableOpacity>
                          
                          {/* Action Buttons */}
                          <View style={{ flexDirection: "row", gap: 8, width: "100%" }}>
                            <TouchableOpacity
                              onPress={handleViewCertificate}
                              style={{
                                flex: 1,
                                backgroundColor: "#232323",
                                borderRadius: 8,
                                paddingVertical: 12,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "rgba(186, 153, 136, 0.2)",
                              }}
                            >
                              <MaterialIcons name="visibility" size={18} color="#ba9988" style={{ marginBottom: 4 }} />
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: "600",
                                  color: "#ba9988",
                                }}
                              >
                                View
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={handleDownloadCertificate}
                              style={{
                                flex: 1,
                                backgroundColor: "#ba9988",
                                borderRadius: 8,
                                paddingVertical: 12,
                                alignItems: "center",
                              }}
                            >
                              <MaterialIcons name="download" size={18} color="#ffffff" style={{ marginBottom: 4 }} />
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: "600",
                                  color: "#ffffff",
                                }}
                              >
                                Download PDF
                              </Text>
                            </TouchableOpacity>
                          </View>
                          
                          {/* Description Text */}
                          <Text
                            style={{
                              fontSize: 12,
                              color: "rgba(255, 255, 255, 0.6)",
                              lineHeight: 18,
                              marginTop: 16,
                              textAlign: "center",
                            }}
                          >
                            This certificate documents your total token holdings. Each token purchase is recorded and accumulates to your total balance. Token purchases are non-refundable.
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Active Recurring Purchases */}
                    <View style={{ marginBottom: 32 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "700",
                          color: "#ffffff",
                          marginBottom: 16,
                        }}
                      >
                        Active Recurring Purchases
                      </Text>
                      {recurringPurchases ? (
                        <View
                          style={{
                            backgroundColor: "#474747",
                            borderRadius: 20,
                            padding: 24,
                            borderWidth: 1,
                            borderColor: "rgba(186, 153, 136, 0.2)",
                            marginBottom: 16,
                          }}
                        >
                          {!isEditingRecurring ? (
                            <>
                              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                                <View>
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      fontWeight: "700",
                                      color: "#ffffff",
                                      marginBottom: 4,
                                    }}
                                  >
                                    {recurringPurchases.tokensPerPurchase} Tokens
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                  >
                                    {getFrequencyLabel(recurringPurchases.frequency)}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    backgroundColor: recurringPurchases.isActive ? "rgba(186, 153, 136, 0.2)" : "rgba(255, 255, 255, 0.1)",
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 8,
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 11,
                                      fontWeight: "600",
                                      color: recurringPurchases.isActive ? "#ba9988" : "rgba(255, 255, 255, 0.6)",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {recurringPurchases.isActive ? "Active" : "Paused"}
                                  </Text>
                                </View>
                              </View>
                              <View style={{ marginBottom: 16 }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: "rgba(255, 255, 255, 0.7)",
                                    marginBottom: 8,
                                  }}
                                >
                                  Payment Method
                                </Text>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                  <MaterialIcons
                                    name={mockPaymentMethods[recurringPurchases.paymentMethodId]?.type === "creditcard" ? "credit-card" : "account-balance"}
                                    size={20}
                                    color="#ba9988"
                                  />
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      fontWeight: "600",
                                      color: "#ffffff",
                                    }}
                                  >
                                    {getPaymentMethodDisplay(recurringPurchases.paymentMethodId)}
                                  </Text>
                                </View>
                              </View>
                              <View style={{ marginBottom: 20 }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: "rgba(255, 255, 255, 0.7)",
                                    marginBottom: 8,
                                  }}
                                >
                                  Next Purchase
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: "#ffffff",
                                  }}
                                >
                                  {formatDate(recurringPurchases.nextPurchaseDate)}
                                </Text>
                              </View>
                              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                                <TouchableOpacity
                                  onPress={handleEditRecurring}
                                  style={{
                                    flex: 1,
                                    minWidth: "30%",
                                    backgroundColor: "#232323",
                                    borderRadius: 12,
                                    paddingVertical: 12,
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: "rgba(186, 153, 136, 0.2)",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      fontWeight: "600",
                                      color: "#ffffff",
                                    }}
                                  >
                                    Edit
                                  </Text>
                                </TouchableOpacity>
                                {recurringPurchases.isActive ? (
                                  <TouchableOpacity
                                    onPress={handlePauseRecurring}
                                    style={{
                                      flex: 1,
                                      minWidth: "30%",
                                      backgroundColor: "#232323",
                                      borderRadius: 12,
                                      paddingVertical: 12,
                                      alignItems: "center",
                                      borderWidth: 1,
                                      borderColor: "rgba(255, 193, 7, 0.3)",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 14,
                                        fontWeight: "600",
                                        color: "#ffc107",
                                      }}
                                    >
                                      Pause
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    onPress={handleResumeRecurring}
                                    style={{
                                      flex: 1,
                                      minWidth: "30%",
                                      backgroundColor: "#232323",
                                      borderRadius: 12,
                                      paddingVertical: 12,
                                      alignItems: "center",
                                      borderWidth: 1,
                                      borderColor: "rgba(76, 175, 80, 0.3)",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 14,
                                        fontWeight: "600",
                                        color: "#4caf50",
                                      }}
                                    >
                                      Resume
                                    </Text>
                                  </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                  onPress={handleCancelRecurring}
                                  style={{
                                    flex: 1,
                                    minWidth: "30%",
                                    backgroundColor: "#ff4444",
                                    borderRadius: 12,
                                    paddingVertical: 12,
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      fontWeight: "600",
                                      color: "#ffffff",
                                    }}
                                  >
                                    Cancel
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </>
                          ) : (
                            <>
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: "700",
                                  color: "#ffffff",
                                  marginBottom: 16,
                                }}
                              >
                                Edit Recurring Purchase
                              </Text>
                              <View style={{ marginBottom: 16 }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: "#ffffff",
                                    marginBottom: 8,
                                  }}
                                >
                                  Tokens per Purchase
                                </Text>
                                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                                  {[1, 5, 10, 25, 50, 100].map((amount) => (
                                    <TouchableOpacity
                                      key={amount}
                                      onPress={() => setEditRecurringTokens(amount.toString())}
                                      style={{
                                        backgroundColor: editRecurringTokens === amount.toString() ? "#ba9988" : "#232323",
                                        borderRadius: 8,
                                        paddingVertical: 8,
                                        paddingHorizontal: 16,
                                        borderWidth: 1,
                                        borderColor: editRecurringTokens === amount.toString() ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: 14,
                                          fontWeight: "600",
                                          color: "#ffffff",
                                        }}
                                      >
                                        {amount}
                                      </Text>
                                    </TouchableOpacity>
                                  ))}
                                </View>
                                <TextInput
                                  value={editRecurringTokens}
                                  onChangeText={(text) => {
                                    const num = parseInt(text) || 0;
                                    if (num >= 1) {
                                      setEditRecurringTokens(text);
                                    } else if (text === "" || text === "0") {
                                      setEditRecurringTokens("1");
                                    }
                                  }}
                                  keyboardType="number-pad"
                                  placeholder="Enter amount (min 1)"
                                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                                  style={{
                                    backgroundColor: "#232323",
                                    borderRadius: 12,
                                    padding: 16,
                                    fontSize: 16,
                                    color: "#ffffff",
                                    borderWidth: 1,
                                    borderColor: "rgba(186, 153, 136, 0.2)",
                                  }}
                                />
                              </View>
                              <View style={{ marginBottom: 20 }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: "#ffffff",
                                    marginBottom: 8,
                                  }}
                                >
                                  Frequency
                                </Text>
                                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                  {[
                                    { value: "weekly", label: "Weekly" },
                                    { value: "monthly", label: "Monthly" },
                                    { value: "bi-monthly", label: "Bi-monthly" },
                                    { value: "quarterly", label: "Quarterly" },
                                  ].map((freq) => (
                                    <TouchableOpacity
                                      key={freq.value}
                                      onPress={() => setEditRecurringFrequency(freq.value as any)}
                                      style={{
                                        backgroundColor: editRecurringFrequency === freq.value ? "#ba9988" : "#232323",
                                        borderRadius: 8,
                                        paddingVertical: 10,
                                        paddingHorizontal: 16,
                                        borderWidth: 1,
                                        borderColor: editRecurringFrequency === freq.value ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                                        flex: 1,
                                        minWidth: "30%",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: 14,
                                          fontWeight: "600",
                                          color: "#ffffff",
                                          textAlign: "center",
                                        }}
                                      >
                                        {freq.label}
                                      </Text>
                                    </TouchableOpacity>
                                  ))}
                                </View>
                              </View>
                              <View style={{ flexDirection: "row", gap: 12 }}>
                                <TouchableOpacity
                                  onPress={handleCancelEdit}
                                  style={{
                                    flex: 1,
                                    backgroundColor: "#232323",
                                    borderRadius: 12,
                                    paddingVertical: 12,
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: "rgba(186, 153, 136, 0.2)",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      fontWeight: "600",
                                      color: "#ffffff",
                                    }}
                                  >
                                    Cancel
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={handleSaveRecurring}
                                  style={{
                                    flex: 1,
                                    backgroundColor: "#ba9988",
                                    borderRadius: 12,
                                    paddingVertical: 12,
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      fontWeight: "600",
                                      color: "#ffffff",
                                    }}
                                  >
                                    Save
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </>
                          )}
                        </View>
                      ) : (
                        <View
                          style={{
                            backgroundColor: "#474747",
                            borderRadius: 20,
                            padding: 40,
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: "rgba(186, 153, 136, 0.2)",
                          }}
                        >
                          <MaterialIcons name="repeat" size={48} color="rgba(186, 153, 136, 0.5)" />
                          <Text
                            style={{
                              fontSize: 16,
                              color: "rgba(255, 255, 255, 0.6)",
                              textAlign: "center",
                              marginTop: 16,
                            }}
                          >
                            No active recurring purchases
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Token Ledger */}
                    <View>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "700",
                            color: "#ffffff",
                          }}
                        >
                          Token Ledger
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                          marginBottom: 16,
                          fontStyle: "italic",
                        }}
                      >
                        All successful one-time and recurring purchases are automatically reflected here
                      </Text>
                      {mockLedgerEntries.map((entry) => (
                        <View
                          key={entry.id}
                          style={{
                            backgroundColor: "#474747",
                            borderRadius: 16,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: "rgba(186, 153, 136, 0.2)",
                            marginBottom: 12,
                          }}
                        >
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                              <View
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 20,
                                  backgroundColor: entry.transactionType === "purchase" || entry.transactionType === "reward" ? "rgba(186, 153, 136, 0.2)" : "rgba(255, 68, 68, 0.2)",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <MaterialIcons
                                  name={getTransactionIcon(entry.transactionType) as any}
                                  size={20}
                                  color={entry.transactionType === "purchase" || entry.transactionType === "reward" ? "#ba9988" : "#ff4444"}
                                />
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: "#ffffff",
                                    marginBottom: 4,
                                  }}
                                >
                                  {entry.description}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: "rgba(255, 255, 255, 0.6)",
                                  }}
                                >
                                  {formatDate(entry.date)}
                                </Text>
                              </View>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: "700",
                                  color: entry.transactionType === "purchase" || entry.transactionType === "reward" ? "#ba9988" : "#ff4444",
                                }}
                              >
                                {entry.transactionType === "purchase" || entry.transactionType === "reward" ? "+" : "-"}
                                {entry.tokens}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: "rgba(255, 255, 255, 0.6)",
                                  marginTop: 4,
                                }}
                              >
                                Balance: {entry.balance}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Certificate Modal */}
      <CertificateModal
        visible={showCertificateModal}
        totalTokens={totalTokens}
        onClose={() => setShowCertificateModal(false)}
        onDownload={handleDownloadCertificate}
      />

      {/* Recurring Purchase Confirmation Modal */}
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

