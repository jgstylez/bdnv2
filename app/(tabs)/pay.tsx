import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, Modal, TextInput, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WalletCard } from "../../components/WalletCard";
import { Carousel } from "../../components/layouts/Carousel";
import { Wallet, Currency, BankAccountWallet, CreditCardWallet } from "../../types/wallet";

// Mock wallet data - will be replaced with actual state management
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
  {
    id: "3",
    type: "giftcard",
    name: "Gift Card",
    currency: "USD",
    balance: 50.00,
    isActive: true,
  },
  {
    id: "4",
    type: "bankaccount",
    name: "Chase Checking",
    currency: "USD",
    balance: 5432.18,
    availableBalance: 5432.18,
    isActive: true,
    isBackup: true,
    bankName: "Chase",
    accountType: "checking" as const,
    last4: "4321",
  } as BankAccountWallet,
  {
    id: "5",
    type: "creditcard",
    name: "Visa Card",
    currency: "USD",
    balance: 0,
    availableBalance: 5000,
    isActive: true,
    cardBrand: "Visa",
    last4: "8765",
    expirationDate: "12/25",
    cardholderName: "John Doe",
  } as CreditCardWallet,
  {
    id: "6",
    type: "business",
    name: "Business",
    currency: "USD",
    balance: 8750.50,
    isActive: true,
  } as Wallet,
  {
    id: "7",
    type: "organization",
    name: "Nonprofit",
    currency: "USD",
    balance: 3420.25,
    isActive: true,
  } as Wallet,
];

export default function Pay() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");
  const [wallets, setWallets] = useState<Wallet[]>(mockWallets);
  const [showAddModal, setShowAddModal] = useState(false);
  const [paymentMethodType, setPaymentMethodType] = useState<"bank" | "card" | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Bank account form fields
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountType, setAccountType] = useState<"checking" | "savings">("checking");
  
  // Credit card form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  
  // Tab bar height is 56px on mobile, 0 on desktop
  const tabBarHeight = isDesktop ? 0 : 56;
  const bottomPadding = 40 + tabBarHeight + (isMobile ? insets.bottom : 0);
  
  // Calculate card width for Quick Actions
  const paddingHorizontal = isMobile ? 20 : 40;
  const gapSize = 12;
  // For mobile: use flex with minWidth to ensure cards don't get too small
  // For desktop: use flex: 1 to distribute evenly

  const filteredWallets = wallets.filter(
    (wallet) => wallet.currency === selectedCurrency && wallet.isActive
  );

  const defaultWallet = filteredWallets.find((wallet) => wallet.isDefault);
  const businessWallet = filteredWallets.find((wallet) => wallet.type === "business");
  const nonprofitWallet = filteredWallets.find((wallet) => wallet.type === "organization");
  const nonDefaultWallets = filteredWallets.filter(
    (wallet) => !wallet.isDefault && wallet.type !== "business" && wallet.type !== "organization"
  );

  const totalBalance = filteredWallets.reduce((sum, wallet) => sum + (wallet.availableBalance || wallet.balance), 0);

  const handleAddPaymentMethod = () => {
    setShowAddModal(true);
    setPaymentMethodType(null);
  };

  const handleSelectPaymentType = (type: "bank" | "card") => {
    setPaymentMethodType(type);
    // Reset form fields
    setBankName("");
    setAccountNumber("");
    setRoutingNumber("");
    setAccountType("checking");
    setCardNumber("");
    setCardholderName("");
    setExpirationDate("");
    setCvv("");
  };

  const handleAddBankAccount = async () => {
    if (!bankName || !accountNumber || !routingNumber) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsAdding(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newBankAccount: BankAccountWallet = {
      id: `bank-${Date.now()}`,
      type: "bankaccount",
      name: `${bankName} ${accountType === "checking" ? "Checking" : "Savings"}`,
      currency: "USD",
      balance: 0,
      availableBalance: 0,
      isActive: true,
      bankName,
      accountType,
      last4: accountNumber.slice(-4),
    } as BankAccountWallet;

    setWallets([...wallets, newBankAccount]);
    setIsAdding(false);
    setShowAddModal(false);
    Alert.alert("Success", "Bank account added successfully!");
    
    // Reset form
    setBankName("");
    setAccountNumber("");
    setRoutingNumber("");
    setAccountType("checking");
  };

  const handleAddCreditCard = async () => {
    if (!cardNumber || !cardholderName || !expirationDate || !cvv) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Basic validation
    if (cardNumber.replace(/\s/g, "").length < 13) {
      Alert.alert("Error", "Please enter a valid card number");
      return;
    }

    setIsAdding(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Determine card brand from first digit
    const firstDigit = cardNumber.replace(/\s/g, "")[0];
    let cardBrand = "Visa";
    if (firstDigit === "5") cardBrand = "Mastercard";
    if (firstDigit === "3") cardBrand = "American Express";
    if (firstDigit === "4") cardBrand = "Visa";

    const newCreditCard: CreditCardWallet = {
      id: `card-${Date.now()}`,
      type: "creditcard",
      name: `${cardBrand} Card`,
      currency: "USD",
      balance: 0,
      availableBalance: 5000, // Mock credit limit
      isActive: true,
      cardBrand,
      last4: cardNumber.replace(/\s/g, "").slice(-4),
      expirationDate,
      cardholderName,
    } as CreditCardWallet;

    setWallets([...wallets, newCreditCard]);
    setIsAdding(false);
    setShowAddModal(false);
    Alert.alert("Success", "Credit card added successfully!");
    
    // Reset form
    setCardNumber("");
    setCardholderName("");
    setExpirationDate("");
    setCvv("");
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(" ") : cleaned;
  };

  const formatExpirationDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: 20,
          paddingBottom: bottomPadding,
        }}
      >
        {/* Total Balance */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 20,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 8,
            }}
          >
            Total {selectedCurrency} Balance
          </Text>
          <Text
            style={{
              fontSize: isMobile ? 36 : 48,
              fontWeight: "800",
              color: "#ba9988",
              letterSpacing: -1,
            }}
          >
            {selectedCurrency === "BLKD"
              ? `${totalBalance.toLocaleString()} BLKD`
              : `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </Text>
        </View>

        {/* Default, Business, and Nonprofit Wallets - 3 Column Layout */}
        {(defaultWallet || businessWallet || nonprofitWallet) && (
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {/* Column 1: Default Wallet */}
            {defaultWallet && (
              <View style={{ flex: 1, minWidth: 0 }}>
                <WalletCard wallet={defaultWallet} compact={true} />
              </View>
            )}
            {/* Column 2: Business Wallet */}
            {businessWallet && (
              <View style={{ flex: 1, minWidth: 0 }}>
                <WalletCard wallet={businessWallet} compact={true} />
              </View>
            )}
            {/* Column 3: Nonprofit Wallet */}
            {nonprofitWallet && (
              <View style={{ flex: 1, minWidth: 0 }}>
                <WalletCard wallet={nonprofitWallet} compact={true} />
              </View>
            )}
          </View>
        )}

        {/* Wallets List */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              Accounts
            </Text>
            <TouchableOpacity
              onPress={handleAddPaymentMethod}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MaterialIcons name="add" size={20} color="#ba9988" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ba9988",
                }}
              >
                Add Payment Method
              </Text>
            </TouchableOpacity>
          </View>

          {nonDefaultWallets.length > 0 ? (
            <Carousel itemsPerView={isMobile ? 1.8 : 4} showControls={!isMobile} showIndicators={true} gap={12}>
              {nonDefaultWallets.map((wallet) => (
                <WalletCard key={wallet.id} wallet={wallet} />
              ))}
            </Carousel>
          ) : filteredWallets.length === 0 ? (
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 40,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <MaterialIcons name="account-balance-wallet" size={48} color="rgba(186, 153, 136, 0.5)" />
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                No {selectedCurrency} wallets found
              </Text>
            </View>
          ) : null}
        </View>

        {/* Quick Actions */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          {/* First Row: Pay Business, Buy Gift Card */}
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              gap: gapSize,
              marginBottom: gapSize,
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/pages/payments/c2b-payment")}
              style={{
                flex: 1,
                minWidth: isMobile ? 0 : 120,
                backgroundColor: "#474747",
                borderRadius: 12,
                padding: isMobile ? 12 : 16,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="send" size={isMobile ? 20 : 24} color="#ba9988" style={{ marginBottom: isMobile ? 6 : 8 }} />
              <Text
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  textAlign: "center",
                }}
                numberOfLines={2}
              >
                Pay Business
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/pages/payments/buy-gift-card")}
              style={{
                flex: 1,
                minWidth: isMobile ? 0 : 120,
                backgroundColor: "#474747",
                borderRadius: 12,
                padding: isMobile ? 12 : 16,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="card-giftcard" size={isMobile ? 20 : 24} color="#ba9988" style={{ marginBottom: isMobile ? 6 : 8 }} />
              <Text
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  textAlign: "center",
                }}
                numberOfLines={2}
              >
                Buy Gift Card
              </Text>
            </TouchableOpacity>
          </View>
          {/* Second Row: Buy BLKD, Buy Tokens */}
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              gap: gapSize,
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/pages/payments/buy-blkd")}
              style={{
                flex: 1,
                minWidth: isMobile ? 0 : 120,
                backgroundColor: "#474747",
                borderRadius: 12,
                padding: isMobile ? 12 : 16,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="stars" size={isMobile ? 20 : 24} color="#ba9988" style={{ marginBottom: isMobile ? 6 : 8 }} />
              <Text
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  textAlign: "center",
                }}
                numberOfLines={2}
              >
                Buy BLKD
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/pages/tokens")}
              style={{
                flex: 1,
                minWidth: isMobile ? 0 : 120,
                backgroundColor: "#474747",
                borderRadius: 12,
                padding: isMobile ? 12 : 16,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="account-balance-wallet" size={isMobile ? 20 : 24} color="#ba9988" style={{ marginBottom: isMobile ? 6 : 8 }} />
              <Text
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  textAlign: "center",
                }}
                numberOfLines={2}
              >
                Buy Tokens
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Add Payment Method Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowAddModal(false)}
          />
          <View
            style={{
              backgroundColor: "#232323",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingBottom: Platform.OS === "ios" ? insets.bottom + 20 : 20,
              paddingHorizontal: 20,
              maxHeight: "90%",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Add Payment Method
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddModal(false);
                  setPaymentMethodType(null);
                }}
              >
                <MaterialIcons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {!paymentMethodType ? (
              /* Payment Type Selection */
              <View style={{ gap: 16 }}>
                <TouchableOpacity
                  onPress={() => handleSelectPaymentType("bank")}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "rgba(186, 153, 136, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons name="account-balance" size={24} color="#ba9988" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      Bank Account
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Link your checking or savings account
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="rgba(255, 255, 255, 0.5)" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSelectPaymentType("card")}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "rgba(186, 153, 136, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons name="credit-card" size={24} color="#ba9988" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      Credit or Debit Card
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Add a Visa, Mastercard, or Amex card
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="rgba(255, 255, 255, 0.5)" />
                </TouchableOpacity>
              </View>
            ) : paymentMethodType === "bank" ? (
              /* Bank Account Form */
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ gap: 20 }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Bank Name *
                    </Text>
                    <TextInput
                      value={bankName}
                      onChangeText={setBankName}
                      placeholder="e.g., Chase, Bank of America"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      style={{
                        backgroundColor: "#474747",
                        borderRadius: 12,
                        padding: 16,
                        color: "#ffffff",
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>

                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Account Type *
                    </Text>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <TouchableOpacity
                        onPress={() => setAccountType("checking")}
                        style={{
                          flex: 1,
                          backgroundColor: accountType === "checking" ? "#ba9988" : "#474747",
                          borderRadius: 12,
                          padding: 16,
                          borderWidth: 1,
                          borderColor: accountType === "checking" ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
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
                          Checking
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setAccountType("savings")}
                        style={{
                          flex: 1,
                          backgroundColor: accountType === "savings" ? "#ba9988" : "#474747",
                          borderRadius: 12,
                          padding: 16,
                          borderWidth: 1,
                          borderColor: accountType === "savings" ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
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
                          Savings
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Routing Number *
                    </Text>
                    <TextInput
                      value={routingNumber}
                      onChangeText={setRoutingNumber}
                      placeholder="9-digit routing number"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="numeric"
                      maxLength={9}
                      style={{
                        backgroundColor: "#474747",
                        borderRadius: 12,
                        padding: 16,
                        color: "#ffffff",
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>

                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Account Number *
                    </Text>
                    <TextInput
                      value={accountNumber}
                      onChangeText={setAccountNumber}
                      placeholder="Account number"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="numeric"
                      secureTextEntry
                      style={{
                        backgroundColor: "#474747",
                        borderRadius: 12,
                        padding: 16,
                        color: "#ffffff",
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>

                  <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                    <TouchableOpacity
                      onPress={() => setPaymentMethodType(null)}
                      disabled={isAdding}
                      style={{
                        flex: 1,
                        paddingVertical: 16,
                        borderRadius: 12,
                        backgroundColor: "#474747",
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                        alignItems: "center",
                        opacity: isAdding ? 0.5 : 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#ffffff",
                        }}
                      >
                        Back
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleAddBankAccount}
                      disabled={isAdding}
                      style={{
                        flex: 1,
                        paddingVertical: 16,
                        borderRadius: 12,
                        backgroundColor: "#ba9988",
                        alignItems: "center",
                        opacity: isAdding ? 0.5 : 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#ffffff",
                        }}
                      >
                        {isAdding ? "Adding..." : "Add Bank Account"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            ) : (
              /* Credit Card Form */
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ gap: 20 }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Card Number *
                    </Text>
                    <TextInput
                      value={cardNumber}
                      onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                      placeholder="1234 5678 9012 3456"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="numeric"
                      maxLength={19}
                      style={{
                        backgroundColor: "#474747",
                        borderRadius: 12,
                        padding: 16,
                        color: "#ffffff",
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>

                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Cardholder Name *
                    </Text>
                    <TextInput
                      value={cardholderName}
                      onChangeText={setCardholderName}
                      placeholder="John Doe"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      style={{
                        backgroundColor: "#474747",
                        borderRadius: 12,
                        padding: 16,
                        color: "#ffffff",
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 8,
                        }}
                      >
                        Expiration Date *
                      </Text>
                      <TextInput
                        value={expirationDate}
                        onChangeText={(text) => setExpirationDate(formatExpirationDate(text))}
                        placeholder="MM/YY"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        keyboardType="numeric"
                        maxLength={5}
                        style={{
                          backgroundColor: "#474747",
                          borderRadius: 12,
                          padding: 16,
                          color: "#ffffff",
                          fontSize: 14,
                          borderWidth: 1,
                          borderColor: "rgba(186, 153, 136, 0.2)",
                        }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 8,
                        }}
                      >
                        CVV *
                      </Text>
                      <TextInput
                        value={cvv}
                        onChangeText={setCvv}
                        placeholder="123"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                        style={{
                          backgroundColor: "#474747",
                          borderRadius: 12,
                          padding: 16,
                          color: "#ffffff",
                          fontSize: 14,
                          borderWidth: 1,
                          borderColor: "rgba(186, 153, 136, 0.2)",
                        }}
                      />
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                    <TouchableOpacity
                      onPress={() => setPaymentMethodType(null)}
                      disabled={isAdding}
                      style={{
                        flex: 1,
                        paddingVertical: 16,
                        borderRadius: 12,
                        backgroundColor: "#474747",
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                        alignItems: "center",
                        opacity: isAdding ? 0.5 : 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#ffffff",
                        }}
                      >
                        Back
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleAddCreditCard}
                      disabled={isAdding}
                      style={{
                        flex: 1,
                        paddingVertical: 16,
                        borderRadius: 12,
                        backgroundColor: "#ba9988",
                        alignItems: "center",
                        opacity: isAdding ? 0.5 : 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#ffffff",
                        }}
                      >
                        {isAdding ? "Adding..." : "Add Card"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

