import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const PurchaseHistoryList = ({ purchases }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatCurrency = (amount, currency) => {
    return currency === "USD" ? `$${amount.toFixed(2)}` : `${amount.toFixed(2)} ${currency}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "pending":
        return "#ff9800";
      case "failed":
        return "#f44336";
      default:
        return "rgba(255, 255, 255, 0.6)";
    }
  };

  if (!purchases || purchases.length === 0) {
    return (
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 16 }}>Purchase History</Text>
        <View style={{ backgroundColor: "#474747", borderRadius: 16, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: "rgba(186, 153, 136, 0.2)" }}>
          <MaterialIcons name="receipt" size={48} color="rgba(186, 153, 136, 0.5)" />
          <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', marginTop: 16 }}>No purchase history</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 32 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 16 }}>Purchase History</Text>
      <View style={{ gap: 8 }}>
        {purchases.map((purchase) => (
          <View key={purchase.id} style={{ backgroundColor: "#474747", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(186, 153, 136, 0.2)" }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <MaterialIcons name="shopping-cart" size={16} color="#ba9988" />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#ffffff' }}>
                    {purchase.tokens} Tokens
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Text style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.7)' }}>
                    {formatCurrency(purchase.totalCost, purchase.currency)}
                  </Text>
                  <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }}>•</Text>
                  <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' }}>
                    {formatDate(purchase.purchaseDate)}
                  </Text>
                  {purchase.transactionId && (
                    <>
                      <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }}>•</Text>
                      <Text style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' }}>
                        {purchase.transactionId}
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
                <View style={{ backgroundColor: `${getStatusColor(purchase.status)}20`, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, marginBottom: 4 }}>
                  <Text style={{ fontSize: 10, color: getStatusColor(purchase.status), fontWeight: '600', textTransform: 'capitalize' }}>
                    {purchase.status}
                  </Text>
                </View>
                {purchase.certificateUrl && (
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
                  >
                    <MaterialIcons name="description" size={14} color="#ba9988" />
                    <Text style={{ fontSize: 11, color: '#ba9988' }}>Cert</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};