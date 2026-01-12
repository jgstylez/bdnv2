import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Event, EventAnalytics } from '@/types/events';
import { useResponsive } from '@/hooks/useResponsive';
import { getMockEvent } from '@/data/mocks/events';
import { BackButton } from '@/components/navigation/BackButton';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { formatCurrency } from '@/lib/international';

// Mock analytics data
const mockAnalytics: EventAnalytics = {
  eventId: "1",
  totalTicketsSold: 87,
  totalRevenue: 3915,
  revenueByTicketType: [
    { ticketTypeId: "tt1", ticketTypeName: "General Admission", quantitySold: 63, revenue: 2835 },
    { ticketTypeId: "tt2", ticketTypeName: "VIP", quantitySold: 12, revenue: 1020 },
  ],
  attendeeCount: 87,
  checkInCount: 0,
  views: 1245,
  shares: 23,
};

// Mock attendees data
const mockAttendees = [
  { id: "1", name: "John Doe", email: "john@example.com", ticketType: "General Admission", purchaseDate: "2024-02-10T14:30:00Z", checkedIn: false },
  { id: "2", name: "Jane Smith", email: "jane@example.com", ticketType: "VIP", purchaseDate: "2024-02-08T10:15:00Z", checkedIn: false },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", ticketType: "General Admission", purchaseDate: "2024-02-12T16:45:00Z", checkedIn: false },
];

export default function ManageEvent() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [activeTab, setActiveTab] = useState<"overview" | "tickets" | "attendees" | "analytics">("overview");
  
  const event = getMockEvent(id || "1");
  
  if (!event) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.primary, justifyContent: "center", alignItems: "center" }}>
        <StatusBar style="light" />
        <Text style={{ color: colors.text.primary, fontSize: 16 }}>Event not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 16,
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: colors.accent,
            borderRadius: borderRadius.md,
          }}
        >
          <Text style={{ color: colors.text.primary, fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const analytics = mockAnalytics;
  const attendees = mockAttendees;

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

  const handleEdit = () => {
    router.push(`/pages/events/edit/${event.id}`);
  };

  const handleDuplicate = () => {
    Alert.alert("Duplicate Event", "This will create a copy of this event. Continue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Duplicate",
        onPress: () => {
          // TODO: Implement duplicate logic
          alert("Event duplicated! Redirecting to edit page...");
          router.push(`/pages/events/create`);
        },
      },
    ]);
  };

  const handleCancel = () => {
    Alert.alert("Cancel Event", "Are you sure you want to cancel this event? This action cannot be undone.", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel Event",
        style: "destructive",
        onPress: () => {
          // TODO: Implement cancel logic
          alert("Event cancelled");
          router.back();
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          // TODO: Implement delete logic
          alert("Event deleted");
          router.push("/pages/events/my-events");
        },
      },
    ]);
  };

  const renderOverview = () => (
    <View style={{ gap: spacing.lg }}>
      {/* Event Image */}
      {event.imageUrl && (
        <View style={{ borderRadius: borderRadius.lg, overflow: "hidden", marginBottom: spacing.md }}>
          <Image
            source={{ uri: event.imageUrl }}
            style={{ width: "100%", height: isMobile ? 200 : 300 }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        </View>
      )}

      {/* Event Info */}
      <View style={{ gap: spacing.md }}>
        <View>
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
            Status
          </Text>
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: event.status === "published" ? "rgba(76, 175, 80, 0.15)" : "rgba(186, 153, 136, 0.15)",
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.md,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                color: event.status === "published" ? colors.status.success : colors.accent,
                fontWeight: typography.fontWeight.semibold,
                textTransform: "uppercase",
              }}
            >
              {event.status}
            </Text>
          </View>
        </View>

        <View>
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
            Title
          </Text>
          <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
            {event.title}
          </Text>
        </View>

        <View>
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
            Description
          </Text>
          <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary, lineHeight: typography.lineHeight.relaxed }}>
            {event.description}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
          <View style={{ flex: 1, minWidth: isMobile ? "100%" : "45%" }}>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
              Start Date
            </Text>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
              {formatDate(event.startDate)}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: isMobile ? "100%" : "45%" }}>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
              End Date
            </Text>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
              {formatDate(event.endDate)}
            </Text>
          </View>
        </View>

        <View>
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
            Venue
          </Text>
          <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
            {event.venue.name}
          </Text>
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
            {event.venue.street}, {event.venue.city}, {event.venue.state} {event.venue.postalCode}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
              Attendees
            </Text>
            <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
              {event.currentAttendees} / {event.maxAttendees || "∞"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
              Tickets Sold
            </Text>
            <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
              {analytics.totalTicketsSold}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
        <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
          Quick Actions
        </Text>
        <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
          <TouchableOpacity
            onPress={handleEdit}
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : "45%",
              backgroundColor: colors.accent,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
            }}
          >
            <MaterialIcons name="edit" size={20} color={colors.text.primary} />
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
              Edit Event
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDuplicate}
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : "45%",
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <MaterialIcons name="content-copy" size={20} color={colors.text.primary} />
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
              Duplicate
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
          <TouchableOpacity
            onPress={handleCancel}
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : "45%",
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
              borderWidth: 1,
              borderColor: colors.status.warning,
            }}
          >
            <MaterialIcons name="cancel" size={20} color={colors.status.warning} />
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.status.warning }}>
              Cancel Event
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : "45%",
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
              borderWidth: 1,
              borderColor: colors.status.error,
            }}
          >
            <MaterialIcons name="delete" size={20} color={colors.status.error} />
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.status.error }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderTickets = () => (
    <View style={{ gap: spacing.lg }}>
      <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
        Ticket Types
      </Text>
      {event.ticketTypes.map((ticketType) => {
        const sold = ticketType.quantity - ticketType.availableQuantity;
        const revenue = sold * ticketType.price;
        return (
          <View
            key={ticketType.id}
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.xs }}>
                  {ticketType.name}
                </Text>
                {ticketType.description && (
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.sm }}>
                    {ticketType.description}
                  </Text>
                )}
                <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.accent }}>
                  {formatCurrency(ticketType.price, ticketType.currency)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push(`/pages/events/tickets/manage/${event.id}/${ticketType.id}`)}
                style={{
                  padding: spacing.sm,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.secondary.bg,
                  borderWidth: 1,
                  borderColor: colors.border.light,
                }}
              >
                <MaterialIcons name="edit" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                  Sold
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                  {sold} / {ticketType.quantity}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                  Revenue
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.status.success }}>
                  {formatCurrency(revenue, ticketType.currency)}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
      <TouchableOpacity
        onPress={() => router.push(`/pages/events/tickets/create/${event.id}`)}
        style={{
          backgroundColor: colors.secondary.bg,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.border.light,
          borderStyle: "dashed",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.sm,
        }}
      >
        <MaterialIcons name="add" size={20} color={colors.accent} />
        <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.accent }}>
          Add Ticket Type
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAttendees = () => (
    <View style={{ gap: spacing.lg }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
          Attendees ({attendees.length})
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.xs,
            padding: spacing.sm,
            borderRadius: borderRadius.md,
            backgroundColor: colors.secondary.bg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <MaterialIcons name="download" size={16} color={colors.text.primary} />
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>Export</Text>
        </TouchableOpacity>
      </View>
      {attendees.map((attendee) => (
        <View
          key={attendee.id}
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: colors.border.light,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginBottom: spacing.xs }}>
              {attendee.name}
            </Text>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
              {attendee.email}
            </Text>
            <View style={{ flexDirection: "row", gap: spacing.md, alignItems: "center" }}>
              <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                {attendee.ticketType}
              </Text>
              <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                • {formatDate(attendee.purchaseDate)}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end", gap: spacing.xs }}>
            {attendee.checkedIn ? (
              <View
                style={{
                  backgroundColor: "rgba(76, 175, 80, 0.15)",
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.sm,
                }}
              >
                <Text style={{ fontSize: typography.fontSize.xs, color: colors.status.success, fontWeight: typography.fontWeight.semibold }}>
                  Checked In
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: colors.accent,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.sm,
                }}
              >
                <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.primary, fontWeight: typography.fontWeight.semibold }}>
                  Check In
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderAnalytics = () => (
    <View style={{ gap: spacing.lg }}>
      <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
        Analytics
      </Text>

      {/* Key Metrics */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
        <View
          style={{
            flex: 1,
            minWidth: isMobile ? "100%" : "45%",
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
            Total Revenue
          </Text>
          <Text style={{ fontSize: typography.fontSize["2xl"], fontWeight: typography.fontWeight.bold, color: colors.status.success }}>
            {formatCurrency(analytics.totalRevenue, "USD")}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            minWidth: isMobile ? "100%" : "45%",
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
            Tickets Sold
          </Text>
          <Text style={{ fontSize: typography.fontSize["2xl"], fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
            {analytics.totalTicketsSold}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            minWidth: isMobile ? "100%" : "45%",
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
            Views
          </Text>
          <Text style={{ fontSize: typography.fontSize["2xl"], fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
            {analytics.views.toLocaleString()}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            minWidth: isMobile ? "100%" : "45%",
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
            Shares
          </Text>
          <Text style={{ fontSize: typography.fontSize["2xl"], fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
            {analytics.shares}
          </Text>
        </View>
      </View>

      {/* Revenue by Ticket Type */}
      <View>
        <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
          Revenue by Ticket Type
        </Text>
        {analytics.revenueByTicketType.map((item) => (
          <View
            key={item.ticketTypeId}
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              marginBottom: spacing.sm,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs }}>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                {item.ticketTypeName}
              </Text>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.status.success }}>
                {formatCurrency(item.revenue, "USD")}
              </Text>
            </View>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
              {item.quantitySold} tickets sold
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <BackButton onPress={() => router.back()} />
        
        <Text
          style={{
            fontSize: typography.fontSize["2xl"],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginTop: spacing.md,
            marginBottom: spacing.lg,
          }}
        >
          Manage Event
        </Text>

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.md,
            padding: spacing.xs,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          {(["overview", "tickets", "attendees", "analytics"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                backgroundColor: activeTab === tab ? colors.accent : "transparent",
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.sm,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: activeTab === tab ? colors.text.primary : colors.text.secondary,
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "tickets" && renderTickets()}
        {activeTab === "attendees" && renderAttendees()}
        {activeTab === "analytics" && renderAnalytics()}
      </ScrollView>
    </View>
  );
}
