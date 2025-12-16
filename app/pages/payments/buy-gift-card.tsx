import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Platform, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useResponsive } from "../../../hooks/useResponsive";
import { GiftCardType, GiftCardOrderFormData } from "../../../types/gift-card-order";
import { Wallet } from "../../../types/wallet";
import { PaymentMethodSelector } from "../../../components/checkout/PaymentMethodSelector";
import { formatCurrency } from "../../../lib/international";
import { DateTimePickerComponent } from "../../../components/forms/DateTimePicker";
import { BusinessPlaceholder } from "../../../components/BusinessPlaceholder";

// Mock user data for recipient search
const mockUsers = [
  { id: "user-1", name: "Jane Smith", email: "jane.smith@example.com" },
  { id: "user-2", name: "Michael Johnson", email: "michael.j@example.com" },
  { id: "user-3", name: "Sarah Williams", email: "sarah.w@example.com" },
  { id: "user-4", name: "David Brown", email: "david.brown@example.com" },
];

// Mock merchants for merchant-specific gift cards
const mockMerchants = [
  { id: "merchant-1", name: "Soul Food Kitchen", category: "Restaurant" },
  { id: "merchant-2", name: "Black Excellence Barbershop", category: "Services" },
  { id: "merchant-3", name: "African Heritage Books", category: "Retail" },
  { id: "merchant-4", name: "Black History E-Books", category: "Digital" },
  { id: "merchant-5", name: "Crown Beauty Salon", category: "Beauty & Wellness" },
  { id: "merchant-6", name: "Urban Tech Solutions", category: "Technology" },
];

// Predefined gift card amounts
const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

export default function BuyGiftCard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState<GiftCardOrderFormData>({
    type: "universal",
    amount: 50,
    sendImmediately: true,
  });
  const [recipientSearchQuery, setRecipientSearchQuery] = useState("");
  const [merchantSearchQuery, setMerchantSearchQuery] = useState("");
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [recipientEmailInput, setRecipientEmailInput] = useState("");
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useBLKD, setUseBLKD] = useState(false);
  const [step, setStep] = useState<"form" | "review" | "processing" | "success">("form");

  // Mock wallets
  useEffect(() => {
    const mockWallets: Wallet[] = [
      {
        id: "1",
        type: "primary",
        name: "Primary",
        currency: "USD",
        balance: 1250.75,
        isActive: true,
        isDefault: true,
      },
      {
        id: "2",
        type: "myimpact",
        name: "MyImpact Rewards",
        currency: "BLKD",
        balance: 3420,
        isActive: true,
      },
    ];
    setWallets(mockWallets);
    const defaultWallet = mockWallets.find((w) => w.isDefault);
    if (defaultWallet) {
      setSelectedWalletId(defaultWallet.id);
    }
  }, []);

  const filteredRecipients = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(recipientSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(recipientSearchQuery.toLowerCase())
  );

  const filteredMerchants = mockMerchants.filter((merchant) =>
    merchant.name.toLowerCase().includes(merchantSearchQuery.toLowerCase())
  );

  const handleSelectRecipient = (userId: string, name: string, email: string) => {
    setFormData({ ...formData, recipientUserId: userId, recipientEmail: undefined });
    setRecipientSearchQuery(name);
    setShowRecipientModal(false);
    setRecipientEmailInput("");
  };

  const handleAddEmailRecipient = () => {
    if (recipientEmailInput.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmailInput.trim())) {
      setFormData({ ...formData, recipientEmail: recipientEmailInput.trim(), recipientUserId: undefined });
      setRecipientSearchQuery(recipientEmailInput.trim());
      setShowRecipientModal(false);
      setRecipientEmailInput("");
    }
  };

  const filteredRecipientsForModal = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(recipientSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(recipientSearchQuery.toLowerCase())
  );

  const isValidEmail = recipientEmailInput.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmailInput.trim());

  const handleSelectMerchant = (merchantId: string, merchantName: string) => {
    setFormData({ ...formData, merchantId, type: "merchant" });
    setMerchantSearchQuery(merchantName);
    setShowMerchantModal(false);
  };

  const filteredMerchantsForModal = mockMerchants.filter((merchant) =>
    merchant.name.toLowerCase().includes(merchantSearchQuery.toLowerCase()) ||
    merchant.category?.toLowerCase().includes(merchantSearchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!formData.recipientUserId && !formData.recipientEmail) {
      alert("Please select a recipient");
      return;
    }
    if (formData.type === "merchant" && !formData.merchantId) {
      alert("Please select a business");
      return;
    }
    if (!selectedWalletId) {
      alert("Please select a payment method");
      return;
    }

    // Navigate to review step
    setStep("review");
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    setStep("processing");
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
    }, 1500);
  };

  const totalAmount = formData.amount; // Gift card amount in BLKD
  const totalAmountUSD = formData.amount; // Payment amount in USD (1 BLKD = 1 USD)
  
  // Calculate BLKD coverage
  const blkdBalance = wallets.find((w) => w.type === "myimpact")?.balance || 0;
  const blkdCoverage = useBLKD && blkdBalance > 0 ? Math.min(blkdBalance, totalAmountUSD) : 0;
  const remainingAfterBLKD = totalAmountUSD - blkdCoverage;
  
  const selectedWallet = wallets.find((w) => w.id === selectedWalletId);
  const selectedMerchant = mockMerchants.find((m) => m.id === formData.merchantId);
  const selectedRecipient = formData.recipientUserId 
    ? mockUsers.find((u) => u.id === formData.recipientUserId)
    : null;

  const renderReviewStep = () => {
    return (
      <View style={{ gap: 24 }}>
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Review Order
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Please review your gift card order before confirming.
          </Text>
        </View>

        {/* Gift Card Details */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            gap: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Gift Card Details
          </Text>
          
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Type</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
              {formData.type === "universal" ? "Universal" : "Store Specific"}
            </Text>
          </View>
          
          {selectedMerchant && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Business</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                {selectedMerchant.name}
              </Text>
            </View>
          )}
          
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Amount</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
              {formData.amount} BLKD
            </Text>
          </View>
          
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Recipient</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
              {selectedRecipient?.name || formData.recipientEmail || ""}
            </Text>
          </View>
          
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Send</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
              {formData.sendImmediately ? "Immediately" : formData.scheduledDate || "Scheduled"}
            </Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            gap: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Payment Summary
          </Text>
          
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Gift Card Amount</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
              {formatCurrency(totalAmountUSD, "USD")}
            </Text>
          </View>

          {useBLKD && blkdCoverage > 0 && (
            <>
              <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)" }} />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>BLKD Applied</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>
                  -{formatCurrency(blkdCoverage, "BLKD")}
                </Text>
              </View>
            </>
          )}
          
          <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)" }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#ffffff" }}>Total</Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#ba9988" }}>
              {formatCurrency(remainingAfterBLKD, "USD")}
            </Text>
          </View>
          
          {selectedWallet && (
            <>
              <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)" }} />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Payment Method</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                  {selectedWallet.name}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => setStep("form")}
            style={{
              flex: 1,
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 18,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={isProcessing}
            style={{
              flex: 1,
              backgroundColor: isProcessing ? "#666666" : "#ba9988",
              borderRadius: 12,
              padding: 18,
              alignItems: "center",
              opacity: isProcessing ? 0.6 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              {isProcessing ? "Processing..." : "Confirm Order"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderProcessingStep = () => {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 24 }}>
        <MaterialIcons name="hourglass-empty" size={64} color="#ba9988" />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          Processing Order...
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
          }}
        >
          Please wait while we process your gift card order.
        </Text>
      </View>
    );
  };

  const renderSuccessStep = () => {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 24 }}>
        <MaterialIcons name="check-circle" size={64} color="#4caf50" />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          Order Successful!
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Your gift card order has been placed successfully.
        </Text>
        
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            width: "100%",
            gap: 12,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Gift Card Amount</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
              {formData.amount} BLKD
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Recipient</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
              {selectedRecipient?.name || formData.recipientEmail || ""}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "#ba9988",
            borderRadius: 12,
            padding: 18,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
          <TouchableOpacity 
            onPress={() => {
              if (step === "review") {
                setStep("form");
              } else {
                router.back();
              }
            }} 
            style={{ marginRight: 16 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: isMobile ? 24 : 28,
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            {step === "review" ? "Review Order" : step === "processing" ? "Processing" : step === "success" ? "Success" : "Buy Gift Card"}
          </Text>
        </View>

        {step === "review" && renderReviewStep()}
        {step === "processing" && renderProcessingStep()}
        {step === "success" && renderSuccessStep()}
        {step === "form" && (
          <>

        {/* Gift Card Type Selection */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            Gift Card Type
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => {
                setFormData({ ...formData, type: "universal", merchantId: undefined });
                setMerchantSearchQuery("");
              }}
              style={{
                flex: 1,
                backgroundColor: formData.type === "universal" ? "#ba9988" : "#474747",
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: formData.type === "universal" ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="card-giftcard" size={32} color={formData.type === "universal" ? "#ffffff" : "#ba9988"} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: formData.type === "universal" ? "#ffffff" : "#ffffff",
                  marginTop: 8,
                }}
              >
                Universal
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: formData.type === "universal" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)",
                  marginTop: 4,
                  textAlign: "center",
                }}
              >
                Use at any business
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFormData({ ...formData, type: "merchant" })}
              style={{
                flex: 1,
                backgroundColor: formData.type === "merchant" ? "#ba9988" : "#474747",
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: formData.type === "merchant" ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="store" size={32} color={formData.type === "merchant" ? "#ffffff" : "#ba9988"} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: formData.type === "merchant" ? "#ffffff" : "#ffffff",
                  marginTop: 8,
                }}
              >
                Store Specific
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: formData.type === "merchant" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)",
                  marginTop: 4,
                  textAlign: "center",
                }}
              >
                Use at one particular business
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Business Selection (if merchant-specific) */}
        {formData.type === "merchant" && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: 12,
              }}
            >
              Select Business
            </Text>
            {formData.merchantId ? (
              <View
              style={{
                  backgroundColor: "rgba(71, 71, 71, 0.3)",
                borderRadius: 12,
                  padding: 12,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <BusinessPlaceholder width={40} height={40} aspectRatio={1} />
                <View style={{ flex: 1 }}>
                  <Text
                style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 2,
                    }}
                  >
                    {mockMerchants.find((m) => m.id === formData.merchantId)?.name || ""}
                  </Text>
                  <Text
                      style={{
                      fontSize: 11,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    {mockMerchants.find((m) => m.id === formData.merchantId)?.category || ""}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setFormData({ ...formData, merchantId: undefined });
                    setMerchantSearchQuery("");
                  }}
                  style={{ padding: 4 }}
                >
                  <MaterialIcons name="close" size={18} color="rgba(255, 255, 255, 0.5)" />
                    </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowMerchantModal(true)}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <MaterialIcons name="search" size={24} color="rgba(255, 255, 255, 0.5)" />
                <View style={{ flex: 1 }}>
                  <Text
                      style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Select a business
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: 2,
                    }}
                  >
                    Tap to search and select
                  </Text>
              </View>
                <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255, 255, 255, 0.5)" />
              </TouchableOpacity>
            )}
          </View>
        )}

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
            Amount (BLKD)
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
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {PRESET_AMOUNTS.map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => setFormData({ ...formData, amount })}
                style={{
                  backgroundColor: formData.amount === amount ? "#ba9988" : "#474747",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: formData.amount === amount ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
              value={formData.amount.toString()}
              onChangeText={(text) => {
                const num = parseFloat(text) || 0;
                if (num >= 0) {
                  setFormData({ ...formData, amount: num });
                }
              }}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              style={{
                backgroundColor: "#474747",
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                color: "#ffffff",
                borderWidth: 1,
                borderColor: formData.amount && !PRESET_AMOUNTS.includes(formData.amount) ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              }}
            />
          </View>
        </View>

        {/* Recipient Selection */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            Recipient
          </Text>
          {formData.recipientUserId || formData.recipientEmail ? (
            <View
            style={{
                backgroundColor: "rgba(71, 71, 71, 0.3)",
              borderRadius: 12,
                padding: 12,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <MaterialIcons name="person" size={40} color="rgba(255, 255, 255, 0.5)" />
              <View style={{ flex: 1 }}>
                <Text
              style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 2,
                  }}
                >
                  {formData.recipientUserId
                    ? mockUsers.find((u) => u.id === formData.recipientUserId)?.name || ""
                    : formData.recipientEmail || ""}
                </Text>
                {formData.recipientUserId && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    {mockUsers.find((u) => u.id === formData.recipientUserId)?.email || ""}
                  </Text>
                )}
                {formData.recipientEmail && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Email invitation
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setFormData({ ...formData, recipientUserId: undefined, recipientEmail: undefined });
                  setRecipientSearchQuery("");
                }}
                style={{ padding: 4 }}
              >
                <MaterialIcons name="close" size={18} color="rgba(255, 255, 255, 0.5)" />
                  </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowRecipientModal(true)}
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <MaterialIcons name="person-add" size={24} color="rgba(255, 255, 255, 0.5)" />
              <View style={{ flex: 1 }}>
                <Text
                    style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  Select recipient
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.5)",
                    marginTop: 2,
                  }}
                >
                  Tap to search users or add email
                </Text>
            </View>
              <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          )}
        </View>

        {/* Note */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            Personal Message (Optional)
          </Text>
          <TextInput
            value={formData.note || ""}
            onChangeText={(text) => setFormData({ ...formData, note: text })}
            placeholder="Add a personal message..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: "#ffffff",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              minHeight: 100,
              textAlignVertical: "top",
            }}
          />
        </View>

        {/* Send Options */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            When to Send
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => {
                setFormData({ ...formData, sendImmediately: true });
                setScheduledDate(null);
              }}
              style={{
                flex: 1,
                backgroundColor: formData.sendImmediately ? "#ba9988" : "#474747",
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: formData.sendImmediately ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="send" size={24} color={formData.sendImmediately ? "#ffffff" : "#ba9988"} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginTop: 8,
                }}
              >
                Send Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFormData({ ...formData, sendImmediately: false })}
              style={{
                flex: 1,
                backgroundColor: !formData.sendImmediately ? "#ba9988" : "#474747",
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: !formData.sendImmediately ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="schedule" size={24} color={!formData.sendImmediately ? "#ffffff" : "#ba9988"} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginTop: 8,
                }}
              >
                Schedule
              </Text>
            </TouchableOpacity>
          </View>
          {!formData.sendImmediately && (
            <View style={{ marginTop: 16 }}>
              <DateTimePickerComponent
                label="Schedule Send Date"
                value={scheduledDate}
                onChange={(date) => {
                  setScheduledDate(date);
                  if (date) {
                    setFormData({ ...formData, scheduledDate: date.toISOString().split('T')[0] });
                  } else {
                    setFormData({ ...formData, scheduledDate: undefined });
                  }
                }}
                mode="date"
                placeholder="Select date to send gift card"
                minimumDate={new Date()}
              />
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View style={{ marginBottom: 24 }}>
          <PaymentMethodSelector
            wallets={wallets}
            selectedWalletId={selectedWalletId}
            onSelectWallet={setSelectedWalletId}
            totalAmount={totalAmountUSD}
            currency="USD"
            blkdBalance={wallets.find((w) => w.type === "myimpact")?.balance || 0}
            useBLKD={useBLKD}
            onToggleBLKD={setUseBLKD}
            onAddPaymentMethod={() => router.push("/(tabs)/pay")}
          />
        </View>

        {/* Order Summary */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Order Summary
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Gift Card Amount</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>{formData.amount} BLKD</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(186, 153, 136, 0.2)" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#ffffff" }}>Total</Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#ba9988" }}>{formData.amount} BLKD</Text>
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
              Gift card purchases are final and non-refundable. Gift cards can be used to make purchases on the BDN platform.
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isProcessing}
          style={{
            backgroundColor: isProcessing ? "#666666" : "#ba9988",
            borderRadius: 12,
            padding: 18,
            alignItems: "center",
            opacity: isProcessing ? 0.6 : 1,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            {isProcessing ? "Processing..." : "Purchase Gift Card"}
          </Text>
        </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Merchant Search Modal */}
      <Modal
        visible={showMerchantModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowMerchantModal(false);
          setMerchantSearchQuery("");
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: isMobile ? 16 : 24,
          }}
          activeOpacity={1}
          onPress={() => {
            setShowMerchantModal(false);
            setMerchantSearchQuery("");
          }}
        >
          <View
            style={{
              backgroundColor: "#232323",
              borderRadius: 16,
              width: "100%",
              maxWidth: 500,
              maxHeight: "80%",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Select a Business
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowMerchantModal(false);
                  setMerchantSearchQuery("");
                }}
                style={{ padding: 4 }}
              >
                <MaterialIcons name="close" size={24} color="rgba(255, 255, 255, 0.7)" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  gap: 12,
                }}
              >
                <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
                <TextInput
                  placeholder="Search businesses..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={merchantSearchQuery}
                  onChangeText={setMerchantSearchQuery}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: "#ffffff",
                  }}
                  autoFocus
                />
                {merchantSearchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setMerchantSearchQuery("")}
                    style={{ padding: 4 }}
                  >
                    <MaterialIcons name="close" size={18} color="rgba(255, 255, 255, 0.5)" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Merchant List */}
            <ScrollView
              style={{ maxHeight: 400 }}
              showsVerticalScrollIndicator={false}
            >
              {filteredMerchantsForModal.length === 0 ? (
                <View
                  style={{
                    padding: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="search-off" size={48} color="rgba(255, 255, 255, 0.3)" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: 16,
                      textAlign: "center",
                    }}
                  >
                    No businesses found
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.4)",
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    Try a different search term
                  </Text>
                </View>
              ) : (
                filteredMerchantsForModal.map((merchant) => (
                  <TouchableOpacity
                    key={merchant.id}
                    onPress={() => handleSelectMerchant(merchant.id, merchant.name)}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(186, 153, 136, 0.1)",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <BusinessPlaceholder width={50} height={50} aspectRatio={1} />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 4,
                        }}
                      >
                        {merchant.name}
                      </Text>
                      {merchant.category && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {merchant.category}
                        </Text>
                      )}
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Recipient Search Modal */}
      <Modal
        visible={showRecipientModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowRecipientModal(false);
          setRecipientSearchQuery("");
          setRecipientEmailInput("");
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: isMobile ? 16 : 24,
          }}
          activeOpacity={1}
          onPress={() => {
            setShowRecipientModal(false);
            setRecipientSearchQuery("");
            setRecipientEmailInput("");
          }}
        >
          <View
            style={{
              backgroundColor: "#232323",
              borderRadius: 16,
              width: "100%",
              maxWidth: 500,
              maxHeight: "80%",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Select Recipient
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowRecipientModal(false);
                  setRecipientSearchQuery("");
                  setRecipientEmailInput("");
                }}
                style={{ padding: 4 }}
              >
                <MaterialIcons name="close" size={24} color="rgba(255, 255, 255, 0.7)" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  gap: 12,
                }}
              >
                <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
                <TextInput
                  placeholder="Search by name or email..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={recipientSearchQuery}
                  onChangeText={setRecipientSearchQuery}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: "#ffffff",
                  }}
                  autoFocus
                />
                {recipientSearchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setRecipientSearchQuery("")}
                    style={{ padding: 4 }}
                  >
                    <MaterialIcons name="close" size={18} color="rgba(255, 255, 255, 0.5)" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Add Email Section */}
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
                gap: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Or send to email address
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <TextInput
                  placeholder="Enter email address..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={recipientEmailInput}
                  onChangeText={setRecipientEmailInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: "#ffffff",
                    borderWidth: 1,
                    borderColor: isValidEmail ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                />
                <TouchableOpacity
                  onPress={handleAddEmailRecipient}
                  disabled={!isValidEmail}
                  style={{
                    backgroundColor: isValidEmail ? "#ba9988" : "#474747",
                    borderRadius: 12,
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isValidEmail ? 1 : 0.5,
                  }}
                >
                  <MaterialIcons name="add" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* User List */}
            <ScrollView
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
            >
              {filteredRecipientsForModal.length === 0 ? (
                <View
                  style={{
                    padding: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="people-outline" size={48} color="rgba(255, 255, 255, 0.3)" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: 16,
                      textAlign: "center",
                    }}
                  >
                    No users found
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.4)",
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    Try a different search term or add an email address
                  </Text>
                </View>
              ) : (
                filteredRecipientsForModal.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    onPress={() => handleSelectRecipient(user.id, user.name, user.email)}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(186, 153, 136, 0.1)",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: "rgba(186, 153, 136, 0.2)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons name="person" size={24} color="#ba9988" />
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
                        {user.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {user.email}
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

