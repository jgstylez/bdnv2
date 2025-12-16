import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const TokenLedgerEntries = ({ 
  ledgerEntries, 
  getTransactionIcon, 
  formatDate 
}) => {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#ffffff' }}>Token Ledger</Text>
      </View>
      <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 16, fontStyle: 'italic' }}>
        All successful one-time and recurring purchases are automatically reflected here
      </Text>
      {ledgerEntries.map((entry) => (
        <View key={entry.id} style={{ backgroundColor: "#474747", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "rgba(186, 153, 136, 0.2)", marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: entry.transactionType === "purchase" || entry.transactionType === "reward" ? "rgba(186, 153, 136, 0.2)" : "rgba(255, 68, 68, 0.2)", alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name={getTransactionIcon(entry.transactionType) as any} size={20} color={entry.transactionType === "purchase" || entry.transactionType === "reward" ? "#ba9988" : "#ff4444"} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 4 }}>{entry.description}</Text>
                <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' }}>{formatDate(entry.date)}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: entry.transactionType === "purchase" || entry.transactionType === "reward" ? "#ba9988" : "#ff4444" }}>
                {entry.transactionType === "purchase" || entry.transactionType === "reward" ? "+" : "-"}
                {entry.tokens}
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginTop: 4 }}>Balance: {entry.balance}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};