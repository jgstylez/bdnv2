import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Event, TicketType } from '@/types/events';
import { useResponsive } from '@/hooks/useResponsive';
import { getMockEvent } from '@/data/mocks';

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isMobile, scrollViewBottomPadding } = useResponsive();
  const [selectedTicketTypes, setSelectedTicketTypes] = useState<Record<string, number>>({});
  const event = getMockEvent(id || "1") || getMockEvent("1")!; // In real app, fetch by id

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const updateTicketQuantity = (ticketTypeId: string, delta: number) => {
    setSelectedTicketTypes((prev) => {
      const current = prev[ticketTypeId] || 0;
      const ticketType = event.ticketTypes.find((tt) => tt.id === ticketTypeId);
      if (!ticketType) return prev;

      const newQuantity = Math.max(
        ticketType.minPerOrder,
        Math.min(ticketType.maxPerOrder, current + delta)
      );

      if (newQuantity === 0) {
        const updated = { ...prev };
        delete updated[ticketTypeId];
        return updated;
      }

      return { ...prev, [ticketTypeId]: newQuantity };
    });
  };

  const calculateTotal = () => {
    return Object.entries(selectedTicketTypes).reduce((total, [ticketTypeId, quantity]) => {
      const ticketType = event.ticketTypes.find((tt) => tt.id === ticketTypeId);
      return total + (ticketType ? ticketType.price * quantity : 0);
    }, 0);
  };

  const totalTickets = Object.values(selectedTicketTypes).reduce((sum, qty) => sum + qty, 0);
  const totalAmount = calculateTotal();

  const handlePurchase = () => {
    if (totalTickets === 0) {
      alert("Please select at least one ticket");
      return;
    }
    // Navigate to checkout
    router.push({
      pathname: "/pages/events/checkout",
      params: {
        eventId: event.id,
        tickets: JSON.stringify(selectedTicketTypes),
      },
    });
  };

  // Render Ticket Module
  const renderTicketModule = () => (
    <View
      style={{
        backgroundColor: "#474747",
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "rgba(186, 153, 136, 0.2)",
        width: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: "#ffffff",
          marginBottom: 20,
        }}
      >
        Select Tickets
      </Text>

      {event.ticketTypes.map((ticketType) => {
        const quantity = selectedTicketTypes[ticketType.id] || 0;
        const isAvailable = ticketType.availableQuantity > 0;

        return (
          <View
            key={ticketType.id}
            style={{
              marginBottom: ticketType.id !== event.ticketTypes[event.ticketTypes.length - 1].id ? 20 : 0,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 4,
                  }}
                >
                  {ticketType.name}
                </Text>
                {ticketType.description && (
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 8,
                    }}
                  >
                    {ticketType.description}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  ${ticketType.price} {ticketType.currency}
                </Text>
              </View>
            </View>

            {isAvailable ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 12,
                }}
              >
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)" }}>
                  {ticketType.availableQuantity} available
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                  <TouchableOpacity
                    onPress={() => updateTicketQuantity(ticketType.id, -1)}
                    disabled={quantity === 0}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: quantity === 0 ? "#232323" : "#ba9988",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name="remove"
                      size={20}
                      color={quantity === 0 ? "rgba(255, 255, 255, 0.3)" : "#ffffff"}
                    />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 18, fontWeight: "600", color: "#ffffff", minWidth: 30, textAlign: "center" }}>
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateTicketQuantity(ticketType.id, 1)}
                    disabled={quantity >= ticketType.maxPerOrder || quantity >= ticketType.availableQuantity}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor:
                        quantity >= ticketType.maxPerOrder || quantity >= ticketType.availableQuantity
                          ? "#232323"
                          : "#ba9988",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name="add"
                      size={20}
                      color={
                        quantity >= ticketType.maxPerOrder || quantity >= ticketType.availableQuantity
                          ? "rgba(255, 255, 255, 0.3)"
                          : "#ffffff"
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.4)", marginTop: 8 }}>
                Sold Out
              </Text>
            )}
          </View>
        );
      })}

      {/* Total */}
      {totalTickets > 0 && (
        <View
          style={{
            marginTop: 24,
            paddingTop: Platform.OS === "web" ? 20 : 36,
            borderTopWidth: 1,
            borderTopColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.7)" }}>
              {totalTickets} {totalTickets === 1 ? "ticket" : "tickets"}
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#ba9988",
              }}
            >
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handlePurchase}
            style={{
              backgroundColor: "#ba9988",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
              Purchase Tickets
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Hero Image - Full Width */}
        <View
          style={{
            width: "100%",
            height: isMobile ? 250 : 400,
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 24,
            backgroundColor: "#474747",
          }}
        >
          {event.imageUrl ? (
            <Image
              source={{ uri: event.imageUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={{ width: "100%", height: "100%", backgroundColor: "#474747", justifyContent: "center", alignItems: "center" }}>
              <MaterialIcons name="event" size={64} color="rgba(186, 153, 136, 0.5)" />
            </View>
          )}
        </View>

        {/* Two Column Layout for Desktop */}
        {isMobile ? (
          <>
            {/* Event Info - Mobile */}
            <View style={{ marginBottom: 32 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <View
                  style={{
                    backgroundColor: "rgba(186, 153, 136, 0.15)",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#ba9988",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {event.category}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)" }}>
                  {event.currentAttendees} attending
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "800",
                  color: "#ffffff",
                  marginBottom: 12,
                  letterSpacing: -1,
                }}
              >
                {event.title}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 24,
                  marginBottom: 24,
                }}
              >
                {event.description}
              </Text>

              {/* Event Details */}
              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                  <MaterialIcons name="event" size={20} color="#ba9988" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                      Date & Time
                    </Text>
                    <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                      {formatDate(event.startDate)}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                  <MaterialIcons name="location-on" size={20} color="#ba9988" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                      Venue
                    </Text>
                    <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                      {event.venue.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                      {event.venue.street}, {event.venue.city}, {event.venue.state} {event.venue.postalCode || event.venue.zipCode}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                  <MaterialIcons name="store" size={20} color="#ba9988" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                      Organizer
                    </Text>
                    <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                      {event.organizerName}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Ticket Selection - Mobile */}
            {renderTicketModule()}
          </>
        ) : (
          <View
            style={{
              flexDirection: "row",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            {/* Column 1: Event Info */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingBottom: scrollViewBottomPadding,
              }}
            >
              <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <View
                    style={{
                      backgroundColor: "rgba(186, 153, 136, 0.15)",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#ba9988",
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {event.category}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)" }}>
                    {event.currentAttendees} attending
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: 40,
                    fontWeight: "800",
                    color: "#ffffff",
                    marginBottom: 12,
                    letterSpacing: -1,
                  }}
                >
                  {event.title}
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 24,
                    marginBottom: 24,
                  }}
                >
                  {event.description}
                </Text>

                {/* Event Details */}
                <View style={{ gap: 16 }}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                    <MaterialIcons name="event" size={20} color="#ba9988" />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                        Date & Time
                      </Text>
                      <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                        {formatDate(event.startDate)}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                    <MaterialIcons name="location-on" size={20} color="#ba9988" />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                        Venue
                      </Text>
                      <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                        {event.venue.name}
                      </Text>
                      <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                        {event.venue.street}, {event.venue.city}, {event.venue.state} {event.venue.postalCode || event.venue.zipCode}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                    <MaterialIcons name="store" size={20} color="#ba9988" />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                        Organizer
                      </Text>
                      <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                        {event.organizerName}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Column 2: Ticket Selection - Sticky */}
            <View
              style={{
                width: 400,
                ...(isMobile ? {} : { position: "sticky" as any, top: 20, alignSelf: "flex-start", maxHeight: "calc(100vh - 40px)" }),
              }}
            >
              {renderTicketModule()}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

