import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { spacing } from '../../constants/theme';

interface ProductStepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function ProductStepIndicator({ currentStep, steps }: ProductStepIndicatorProps) {
  return (
    <View style={{ marginBottom: spacing.xl }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <View key={step} style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isActive ? "#ba9988" : isCompleted ? "#4caf50" : "#232323",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: isActive ? "#ba9988" : isCompleted ? "#4caf50" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  {isCompleted ? (
                    <MaterialIcons name="check" size={16} color="#ffffff" />
                  ) : (
                    <Text style={{ fontSize: 14, fontWeight: "700", color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.5)" }}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: isActive ? "#ba9988" : "rgba(255, 255, 255, 0.5)",
                    marginTop: 4,
                  }}
                >
                  {step}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: isCompleted ? "#4caf50" : "rgba(186, 153, 136, 0.2)",
                    marginHorizontal: 8,
                    marginBottom: 16,
                  }}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
