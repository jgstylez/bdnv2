import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { Ticket, TicketStatus } from '@/types/events';

// Mock tickets data
const mockTickets: Ticket[] = [
  {
    id: "t1",
    eventId: "1",
    eventTitle: "Jazz & Soul Food Night",
    ticketTypeId: "tt1",
    ticketTypeName: "General Admission",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    purchasePrice: 45,
    currency: "USD",
    status: "purchased",
    qrCode: "BDN-TICKET-t1-2024-03-15",
    purchaseDate: "2024-02-10T14:30:00Z",
    orderId: "order1",
  },
  {
    id: "t2",
    eventId: "2",
    eventTitle: "Networking Mixer: Black Entrepreneurs",
    ticketTypeId: "tt2",
    ticketTypeName: "Early Bird",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    purchasePrice: 25,
    currency: "USD",
    status: "purchased",
    qrCode: "BDN-TICKET-t2-2024-03-20",
    purchaseDate: "2024-02-05T10:15:00Z",
    orderId: "order2",
  },
];

export default function MyTickets() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "purchased":
        return "#4caf50";
      case "used":
        return "#2196f3";
      case "cancelled":
        return "#f44336";
      case "refunded":
        return "#ff9800";
      default:
        return "rgba(255, 255, 255, 0.6)";
    }
  };

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case "purchased":
        return "Purchased";
      case "used":
        return "Used";
      case "cancelled":
        return "Cancelled";
      case "refunded":
        return "Refunded";
      default:
        return status;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Tickets List */}
        {mockTickets.length > 0 ? (
          <View style={{ gap: 16 }}>
            {mockTickets.map((ticket) => (
              <View
                key={ticket.id}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: isMobile ? "column" : "row", gap: 20 }}>
                  {/* Ticket Info */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <View
                        style={{
                          backgroundColor: "rgba(186, 153, 136, 0.15)",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color: "#ba9988",
                            fontWeight: "600",
                            textTransform: "uppercase",
                          }}
                        >
                          {getStatusLabel(ticket.status)}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      {ticket.eventTitle}
                    </Text>

                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: 12,
                      }}
                    >
                      {ticket.ticketTypeName}
                    </Text>

                    <View style={{ gap: 8, marginBottom: 16 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <MaterialIcons name="confirmation-number" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.7)" }}>
                          Ticket #{ticket.id}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <MaterialIcons name="attach-money" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.7)" }}>
                          ${ticket.purchasePrice} {ticket.currency}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <MaterialIcons name="event" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.7)" }}>
                          Purchased {formatDate(ticket.purchaseDate)}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => router.push(`/pages/events/${ticket.eventId}`)}
                      style={{
                        backgroundColor: "#232323",
                        borderRadius: 8,
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        alignSelf: "flex-start",
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>
                        View Event Details
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* QR Code */}
                  <View
                    style={{
                      alignItems: "center",
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <QRCode
                      value={ticket.qrCode}
                      size={isMobile ? 150 : 180}
                      color="#ffffff"
                      backgroundColor="transparent"
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.6)",
                        marginTop: 12,
                        textAlign: "center",
                      }}
                    >
                      Scan at event
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
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
            <MaterialIcons name="confirmation-number" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              No Tickets Yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Browse events and purchase tickets to see them here
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/pages/events")}
              style={{
                backgroundColor: "#ba9988",
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 24,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                Browse Events
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

