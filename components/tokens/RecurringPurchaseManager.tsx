import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const RecurringPurchaseManager = ({ 
  recurringPurchases,
  isEditingRecurring,
  editRecurringTokens, setEditRecurringTokens,
  editRecurringFrequency, setEditRecurringFrequency,
  handleEditRecurring,
  handleSaveRecurring,
  handleCancelEdit,
  handlePauseRecurring,
  handleResumeRecurring,
  handleCancelRecurring,
  getFrequencyLabel,
  getPaymentMethodDisplay,
  formatDate
}) => {
  // Handle array or single object
  const purchases = Array.isArray(recurringPurchases) ? recurringPurchases : (recurringPurchases ? [recurringPurchases] : []);
  const hasPurchases = purchases.length > 0;

  return (
    <View style={{ marginBottom: 32 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 16 }}>Active Recurring Purchases</Text>
      {hasPurchases ? (
        <View style={{ gap: 16 }}>
          {purchases.map((purchase) => (
            <View key={purchase.id} style={{ backgroundColor: "#474747", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "rgba(186, 153, 136, 0.2)" }}>
              {!isEditingRecurring ? (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <MaterialIcons name="repeat" size={20} color="#ba9988" />
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#ffffff' }}>
                          {purchase.tokensPerPurchase} Tokens
                        </Text>
                        {purchase.isActive && (
                          <View style={{ backgroundColor: 'rgba(76, 175, 80, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                            <Text style={{ fontSize: 10, color: '#4caf50', fontWeight: '600' }}>Active</Text>
                          </View>
                        )}
                      </View>
                      <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 4 }}>
                        {getFrequencyLabel(purchase.frequency)}
                      </Text>
                      <Text style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)' }}>
                        Next purchase: {formatDate(purchase.nextPurchaseDate)}
                      </Text>
                      {getPaymentMethodDisplay && (
                        <Text style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', marginTop: 4 }}>
                          Payment: {getPaymentMethodDisplay(purchase.paymentMethodId)}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                    <TouchableOpacity
                      onPress={() => handleEditRecurring(purchase.id)}
                      style={{ backgroundColor: '#232323', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                    >
                      <MaterialIcons name="edit" size={16} color="#ba9988" />
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#ffffff' }}>Edit</Text>
                    </TouchableOpacity>
                    {purchase.isActive ? (
                      <TouchableOpacity
                        onPress={() => handlePauseRecurring(purchase.id)}
                        style={{ backgroundColor: '#232323', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                      >
                        <MaterialIcons name="pause" size={16} color="#ff9800" />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#ffffff' }}>Pause</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleResumeRecurring(purchase.id)}
                        style={{ backgroundColor: '#232323', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                      >
                        <MaterialIcons name="play-arrow" size={16} color="#4caf50" />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#ffffff' }}>Resume</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => handleCancelRecurring(purchase.id)}
                      style={{ backgroundColor: '#232323', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                    >
                      <MaterialIcons name="cancel" size={16} color="#f44336" />
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#ffffff' }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 8 }}>Tokens per purchase</Text>
                    <TextInput
                      value={editRecurringTokens?.toString() || ''}
                      onChangeText={(text) => setEditRecurringTokens(parseInt(text) || 0)}
                      keyboardType="numeric"
                      style={{ backgroundColor: '#232323', borderRadius: 8, padding: 12, color: '#ffffff', fontSize: 16 }}
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    />
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 8 }}>Frequency</Text>
                    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                      {['weekly', 'bi-weekly', 'monthly', 'bi-monthly', 'quarterly', 'annually'].map((freq) => (
                        <TouchableOpacity
                          key={freq}
                          onPress={() => setEditRecurringFrequency(freq)}
                          style={{
                            backgroundColor: editRecurringFrequency === freq ? '#ba9988' : '#232323',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 8,
                          }}
                        >
                          <Text style={{ fontSize: 13, fontWeight: '600', color: '#ffffff' }}>
                            {getFrequencyLabel(freq)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={handleSaveRecurring}
                      style={{ flex: 1, backgroundColor: '#ba9988', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#ffffff' }}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleCancelEdit}
                      style={{ flex: 1, backgroundColor: '#232323', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#ffffff' }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View style={{ backgroundColor: "#474747", borderRadius: 16, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: "rgba(186, 153, 136, 0.2)" }}>
          <MaterialIcons name="repeat" size={48} color="rgba(186, 153, 136, 0.5)" />
          <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', marginTop: 16 }}>No active recurring purchases</Text>
        </View>
      )}
    </View>
  );
};