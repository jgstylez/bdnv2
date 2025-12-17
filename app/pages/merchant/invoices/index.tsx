import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { PageTitle } from '../../../../components/header/PageTitle';
import { ActionButton } from '../../../../components/buttons/ActionButton';

// Mock data for invoices. In a real app, you would fetch this from a database.
const MOCK_INVOICES = [
  { id: '1', invoiceNumber: 'INV-001', amount: 100.00, status: 'Paid' },
  { id: '2', invoiceNumber: 'INV-002', amount: 250.50, status: 'Pending' },
];

export default function InvoiceManagement() {
  const renderItem = ({ item }: { item: typeof MOCK_INVOICES[0] }) => (
    <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <TouchableOpacity onPress={() => router.push(`/pages/merchant/invoices/edit?id=${item.id}`)}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.invoiceNumber}</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>Amount: ${item.amount.toFixed(2)}</Text>
        <Text style={{ fontSize: 14, color: item.status === 'Paid' ? 'green' : 'orange' }}>Status: {item.status}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <PageTitle title="Invoice Management" />
      <ActionButton
        title="Create New Invoice"
        onPress={() => router.push('/pages/merchant/invoices/create')}
      />
      <FlatList
        data={MOCK_INVOICES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
