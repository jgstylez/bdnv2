import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BusinessReview, REVIEW_REASONS } from '../types/review';

interface ReviewCardProps {
  review: BusinessReview;
  onHelpful?: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onHelpful }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getReasonLabel = (reasonId: string) => {
    return REVIEW_REASONS.find((r) => r.id === reasonId)?.label || reasonId;
  };

  return (
    <View
      style={{
        backgroundColor: "#474747",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(186, 153, 136, 0.2)",
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#ba9988",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
                {review.userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                {review.userName}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                {formatDate(review.createdAt)}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <MaterialIcons
              key={star}
              name={star <= review.rating ? "star" : "star-border"}
              size={16}
              color={star <= review.rating ? "#ffd700" : "rgba(255, 255, 255, 0.3)"}
            />
          ))}
        </View>
      </View>

      {/* Verified Purchase Badge */}
      {review.verifiedPurchase && (
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: "rgba(76, 175, 80, 0.15)",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <MaterialIcons name="check-circle" size={12} color="#4caf50" />
          <Text
            style={{
              fontSize: 11,
              fontWeight: "600",
              color: "#4caf50",
            }}
          >
            Verified Purchase
          </Text>
        </View>
      )}

      {/* Selected Reasons */}
      {review.selectedReasons.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {review.selectedReasons.map((reasonId) => {
              const reason = REVIEW_REASONS.find((r) => r.id === reasonId);
              if (!reason) return null;
              return (
                <View
                  key={reasonId}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: reason.category === "positive" ? "rgba(76, 175, 80, 0.15)" : "rgba(244, 67, 54, 0.15)",
                    borderWidth: 1,
                    borderColor: reason.category === "positive" ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {reason.icon && (
                    <MaterialIcons
                      name={reason.icon as any}
                      size={12}
                      color={reason.category === "positive" ? "#4caf50" : "#f44336"}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: reason.category === "positive" ? "#4caf50" : "#f44336",
                    }}
                  >
                    {reason.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Comment */}
      {review.comment && (
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: 20,
            marginBottom: 12,
          }}
        >
          {review.comment}
        </Text>
      )}

      {/* Business Response */}
      {review.businessResponse && (
        <View
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            marginTop: 12,
            borderLeftWidth: 3,
            borderLeftColor: "#ba9988",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#ba9988",
              marginBottom: 8,
            }}
          >
            Business Response
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.8)",
              lineHeight: 20,
            }}
          >
            {review.businessResponse.message}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "rgba(255, 255, 255, 0.5)",
              marginTop: 8,
            }}
          >
            {formatDate(review.businessResponse.createdAt)}
          </Text>
        </View>
      )}

      {/* Actions */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginTop: 12 }}>
        <TouchableOpacity
          onPress={() => onHelpful?.(review.id)}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <MaterialIcons name="thumb-up" size={16} color="rgba(255, 255, 255, 0.6)" />
          <Text
            style={{
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            Helpful ({review.helpfulCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

