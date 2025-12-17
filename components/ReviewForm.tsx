import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ReviewReason, REVIEW_REASONS } from '../types/review';

interface ReviewFormProps {
  businessId: string;
  onSubmit: (data: {
    rating: number;
    npsScore?: number;
    selectedReasons: ReviewReason[];
    comment?: string;
    verifiedPurchase: boolean;
  }) => void;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ businessId, onSubmit, onCancel }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [rating, setRating] = useState<number>(0);
  const [npsScore, setNpsScore] = useState<number | undefined>(undefined);
  const [selectedReasons, setSelectedReasons] = useState<ReviewReason[]>([]);
  const [comment, setComment] = useState("");
  const [verifiedPurchase, setVerifiedPurchase] = useState(false);

  const handleReasonToggle = (reasonId: ReviewReason) => {
    if (selectedReasons.includes(reasonId)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reasonId));
    } else {
      setSelectedReasons([...selectedReasons, reasonId]);
    }
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({
      rating,
      npsScore,
      selectedReasons,
      comment: comment.trim() || undefined,
      verifiedPurchase,
    });
  };

  const positiveReasons = REVIEW_REASONS.filter((r) => r.category === "positive");
  const negativeReasons = REVIEW_REASONS.filter((r) => r.category === "negative");

  // Show positive reasons for 4-5 stars, negative for 1-2 stars, both for 3 stars
  const showPositiveReasons = rating >= 3;
  const showNegativeReasons = rating <= 3;

  return (
    <View
      style={{
        backgroundColor: "#474747",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(186, 153, 136, 0.2)",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#ffffff",
          marginBottom: 20,
        }}
      >
        Leave a Review
      </Text>

      {/* Star Rating */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
            marginBottom: 12,
          }}
        >
          Overall Rating
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={{ padding: 4 }}
            >
              <MaterialIcons
                name={star <= rating ? "star" : "star-border"}
                size={32}
                color={star <= rating ? "#ffd700" : "rgba(255, 255, 255, 0.3)"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* NPS Score (for 4-5 star ratings) */}
      {rating >= 4 && (
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 12,
            }}
          >
            How likely are you to recommend this business? (0-10)
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
              <TouchableOpacity
                key={score}
                onPress={() => setNpsScore(score)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: npsScore === score ? "#ba9988" : "#232323",
                  borderWidth: 1,
                  borderColor: npsScore === score ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  {score}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Reason Pills */}
      {rating > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 12,
            }}
          >
            What did you like? (Select all that apply)
          </Text>
          {showPositiveReasons && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {positiveReasons.map((reason) => (
                <TouchableOpacity
                  key={reason.id}
                  onPress={() => handleReasonToggle(reason.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: selectedReasons.includes(reason.id)
                      ? "#ba9988"
                      : "rgba(186, 153, 136, 0.15)",
                    borderWidth: 1,
                    borderColor: selectedReasons.includes(reason.id)
                      ? "#ba9988"
                      : "rgba(186, 153, 136, 0.2)",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {reason.icon && (
                    <MaterialIcons
                      name={reason.icon as any}
                      size={16}
                      color={selectedReasons.includes(reason.id) ? "#ffffff" : "#ba9988"}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: selectedReasons.includes(reason.id) ? "#ffffff" : "#ba9988",
                    }}
                  >
                    {reason.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {showNegativeReasons && (
            <View style={{ marginTop: 12 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: 12,
                }}
              >
                What could be improved? (Select all that apply)
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {negativeReasons.map((reason) => (
                  <TouchableOpacity
                    key={reason.id}
                    onPress={() => handleReasonToggle(reason.id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: selectedReasons.includes(reason.id)
                        ? "#ba9988"
                        : "rgba(186, 153, 136, 0.15)",
                      borderWidth: 1,
                      borderColor: selectedReasons.includes(reason.id)
                        ? "#ba9988"
                        : "rgba(186, 153, 136, 0.2)",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {reason.icon && (
                      <MaterialIcons
                        name={reason.icon as any}
                        size={16}
                        color={selectedReasons.includes(reason.id) ? "#ffffff" : "#ba9988"}
                      />
                    )}
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: selectedReasons.includes(reason.id) ? "#ffffff" : "#ba9988",
                      }}
                    >
                      {reason.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Optional Comment */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
            marginBottom: 8,
          }}
        >
          Additional Comments (Optional)
        </Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Share more details about your experience..."
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          multiline
          numberOfLines={4}
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            color: "#ffffff",
            fontSize: 14,
            minHeight: 100,
            textAlignVertical: "top",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        />
      </View>

      {/* Verified Purchase Toggle */}
      <View style={{ marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 12 }}>
        <TouchableOpacity
          onPress={() => setVerifiedPurchase(!verifiedPurchase)}
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            backgroundColor: verifiedPurchase ? "#ba9988" : "transparent",
            borderWidth: 2,
            borderColor: "#ba9988",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {verifiedPurchase && (
            <MaterialIcons name="check" size={16} color="#ffffff" />
          )}
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          I made a purchase at this business
        </Text>
      </View>

      {/* Submit Buttons */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        {onCancel && (
          <TouchableOpacity
            onPress={onCancel}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: "#232323",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={rating === 0}
          style={{
            flex: 1,
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: rating === 0 ? "rgba(186, 153, 136, 0.3)" : "#ba9988",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#ffffff",
            }}
          >
            Submit Review
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

