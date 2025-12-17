import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { EventCategory } from '@/types/events';

export default function CreateEvent() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as EventCategory | "",
    startDate: "",
    endDate: "",
    venueName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    maxAttendees: "",
    isPublic: true,
  });

  const categories: EventCategory[] = ["music", "sports", "business", "community", "education", "arts", "food", "other"];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit event
      alert("Event created successfully!");
      router.push("/pages/events/my-events");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const renderStep1 = () => (
    <View style={{ gap: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>
        Basic Information
      </Text>

      <View>
        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
          Event Title *
        </Text>
        <TextInput
          value={formData.title}
          onChangeText={(text) => updateFormData("title", text)}
          placeholder="Enter event title"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: "#ffffff",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        />
      </View>

      <View>
        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
          Description *
        </Text>
        <TextInput
          value={formData.description}
          onChangeText={(text) => updateFormData("description", text)}
          placeholder="Describe your event"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          multiline
          numberOfLines={6}
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: "#ffffff",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            minHeight: 120,
            textAlignVertical: "top",
          }}
        />
      </View>

      <View>
        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
          Category *
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => updateFormData("category", category)}
              style={{
                backgroundColor: formData.category === category ? "#ba9988" : "#232323",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: formData.category === category ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: formData.category === category ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  textTransform: "capitalize",
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={{ gap: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>
        Date & Time
      </Text>

      <View>
        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
          Start Date & Time *
        </Text>
        <TextInput
          value={formData.startDate}
          onChangeText={(text) => updateFormData("startDate", text)}
          placeholder="YYYY-MM-DD HH:MM"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: "#ffffff",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        />
      </View>

      <View>
        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
          End Date & Time *
        </Text>
        <TextInput
          value={formData.endDate}
          onChangeText={(text) => updateFormData("endDate", text)}
          placeholder="YYYY-MM-DD HH:MM"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: "#ffffff",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        />
      </View>

      <View>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginTop: 8, marginBottom: 8 }}>
          Venue Information
        </Text>
      </View>

      <View>
        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
          Venue Name *
        </Text>
        <TextInput
          value={formData.venueName}
          onChangeText={(text) => updateFormData("venueName", text)}
          placeholder="Enter venue name"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: "#ffffff",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        />
      </View>

      <View>
        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
          Address *
        </Text>
        <TextInput
          value={formData.address}
          onChangeText={(text) => updateFormData("address", text)}
          placeholder="Street address"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: "#ffffff",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 2 }}>
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
            City *
          </Text>
          <TextInput
            value={formData.city}
            onChangeText={(text) => updateFormData("city", text)}
            placeholder="City"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            style={{
              backgroundColor: "#232323",
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: "#ffffff",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
            State *
          </Text>
          <TextInput
            value={formData.state}
            onChangeText={(text) => updateFormData("state", text)}
            placeholder="State"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            style={{
              backgroundColor: "#232323",
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: "#ffffff",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
            ZIP *
          </Text>
          <TextInput
            value={formData.zipCode}
            onChangeText={(text) => updateFormData("zipCode", text)}
            placeholder="ZIP"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            style={{
              backgroundColor: "#232323",
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: "#ffffff",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={{ gap: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>
        Additional Settings
      </Text>

      <View>
        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
          Maximum Attendees
        </Text>
        <TextInput
          value={formData.maxAttendees}
          onChangeText={(text) => updateFormData("maxAttendees", text)}
          placeholder="Leave empty for unlimited"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          keyboardType="numeric"
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: "#ffffff",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        />
      </View>

      <View>
        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
          Visibility
        </Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => updateFormData("isPublic", true)}
            style={{
              flex: 1,
              backgroundColor: formData.isPublic ? "#ba9988" : "#232323",
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: formData.isPublic ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: formData.isPublic ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              Public
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateFormData("isPublic", false)}
            style={{
              flex: 1,
              backgroundColor: !formData.isPublic ? "#ba9988" : "#232323",
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: !formData.isPublic ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: !formData.isPublic ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              Private
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#474747",
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: "rgba(186, 153, 136, 0.2)",
        }}
      >
        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
          Next Steps
        </Text>
        <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.6)", lineHeight: 20 }}>
          After creating your event, you'll be able to add ticket types, set pricing, and manage
          your event from the "My Events" page.
        </Text>
      </View>
    </View>
  );

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
        {/* Back Button and Step Indicator */}
        <View style={{ marginBottom: 32 }}>
          <TouchableOpacity onPress={handleBack} style={{ marginBottom: 20, alignSelf: "flex-start" }}>
            <Text style={{ fontSize: 20, color: "#ffffff" }}>← Back</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Step {step} of 3
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 32 }}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={{
                flex: 1,
                height: 4,
                backgroundColor: s <= step ? "#ba9988" : "#474747",
                borderRadius: 2,
              }}
            />
          ))}
        </View>

        {/* Form Content */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            marginBottom: 24,
          }}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </View>

        {/* Navigation Buttons */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={handleBack}
            style={{
              flex: 1,
              backgroundColor: "#232323",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ba9988" }}>
              {step === 1 ? "Cancel" : "Back"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={{
              flex: 1,
              backgroundColor: "#ba9988",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
              {step === 3 ? "Create Event" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

