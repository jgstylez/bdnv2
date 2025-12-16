import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useResponsive } from '../../hooks/useResponsive';

// This component will be refactored to use the new hook and API client
// For now, it's a direct extraction from the original tokens.tsx file

export const TokenPurchaseForm = ({ 
  purchaseType, setPurchaseType,
  tokenAmount, setTokenAmount,
  recurringFrequency, setRecurringFrequency,
  handleSetupRecurringPurchase,
  handlePurchase,
  TOKEN_PRICE,
  getFrequencyLabel
}) => {
  const { isMobile } = useResponsive();

  return (
    <View>
      {/* Purchase Type Selection */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 12 }}>Purchase Type</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
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
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#ffffff', marginTop: 8 }}>Recurring</Text>
            <Text style={{ fontSize: 12, color: purchaseType === "recurring" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)", marginTop: 4, textAlign: 'center' }}>Auto-renewal</Text>
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
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#ffffff', marginTop: 8 }}>One-time</Text>
            <Text style={{ fontSize: 12, color: purchaseType === "one-time" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)", marginTop: 4, textAlign: 'center' }}>Single purchase</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Amount Selection */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 8 }}>Select Amount</Text>
        <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 12 }}>Select a preset amount or enter a custom amount</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {[1, 5, 10, 25, 50, 100].map((amount) => {
            const selected = tokenAmount === amount.toString();
            const totalPrice = amount * TOKEN_PRICE;
            return (
              <TouchableOpacity
                key={amount}
                onPress={() => setTokenAmount(amount.toString())}
                style={{
                  flex: isMobile ? undefined : 1,
                  minWidth: isMobile ? '48%' : 0,
                  backgroundColor: selected ? "#ba9988" : "#474747",
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: selected ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 6 }}>{amount} Token{amount !== 1 ? "s" : ""}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: selected ? '#ffffff' : '#ba9988' }}>${totalPrice.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View>
          <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 8 }}>Or enter custom amount</Text>
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
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 8 }}>Frequency</Text>
          <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 12 }}>How often should tokens be purchased?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
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
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#ffffff' }}>{freq.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Summary */}
      <View style={{ backgroundColor: "#474747", borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: "rgba(186, 153, 136, 0.2)" }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' }}>Tokens</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#ffffff' }}>{parseInt(tokenAmount) || (purchaseType === "recurring" ? 1 : 0)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' }}>Price per Token</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#ffffff' }}>${TOKEN_PRICE.toFixed(2)}</Text>
        </View>
        {purchaseType === "recurring" && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' }}>Frequency</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#ffffff' }}>{getFrequencyLabel(recurringFrequency)}</Text>
          </View>
        )}
        <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)", marginVertical: 12 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#ffffff' }}>{purchaseType === "recurring" ? "Total per Purchase" : "Total"}</Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: "#ba9988" }}>${((parseInt(tokenAmount) || (purchaseType === "recurring" ? 1 : 0)) * TOKEN_PRICE).toFixed(2)}</Text>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={{ backgroundColor: "rgba(255, 152, 0, 0.1)", borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: "rgba(255, 152, 0, 0.3)", flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <MaterialIcons name="info" size={20} color="#ff9800" style={{ marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#ffffff', marginBottom: 4 }}>Non-Refundable Purchase</Text>
          <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 18 }}>Token purchases are final and non-refundable. Upon completion, you will receive a certificate documenting your token holdings.</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => purchaseType === "recurring" ? handleSetupRecurringPurchase() : handlePurchase()}
        disabled={purchaseType === "recurring" ? (!tokenAmount || parseInt(tokenAmount) < 1) : (!tokenAmount || parseInt(tokenAmount) <= 0)}
        style={{
          backgroundColor: (purchaseType === "recurring" ? parseInt(tokenAmount) >= 1 : parseInt(tokenAmount) > 0) ? "#ba9988" : "rgba(186, 153, 136, 0.3)",
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', color: (purchaseType === "recurring" ? parseInt(tokenAmount) >= 1 : parseInt(tokenAmount) > 0) ? '#ffffff' : 'rgba(255, 255, 255, 0.5)' }}>
          {purchaseType === "recurring" ? "Set Up Recurring Purchase" : "Make One-Time Purchase"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};