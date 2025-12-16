import React from 'react';
import { View, Text } from 'react-native';

export const PurchaseHistoryList = ({ purchases }) => {
  return (
    <View style={{ marginBottom: 32 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 16 }}>Purchase History</Text>
      {purchases.map((purchase) => (
        <View key={purchase.id} style={{ backgroundColor: "#474747", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "rgba(186, 153, 136, 0.2)", marginBottom: 12 }}>
          {/* Display Purchase Details */}
        </View>
      ))}
    </View>
  );
};