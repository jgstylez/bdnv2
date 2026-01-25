import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

export interface Step {
  number: number;
  label: string;
  key?: string; // Optional key for step identification
}

interface StepIndicatorProps {
  /**
   * Current step number (1-based)
   */
  currentStep: number;
  /**
   * Array of step objects with number and label
   */
  steps: Step[];
  /**
   * Optional margin bottom
   */
  marginBottom?: number;
}

/**
 * StepIndicator Component
 * 
 * Displays a horizontal step indicator with numbered circles, labels, and connecting lines.
 * Matches the BDN brand design system with accent colors and connecting lines.
 * 
 * @example
 * ```tsx
 * <StepIndicator
 *   currentStep={2}
 *   steps={[
 *     { number: 1, label: "Business" },
 *     { number: 2, label: "Amount" },
 *     { number: 3, label: "Payment" },
 *     { number: 4, label: "Review" },
 *   ]}
 * />
 * ```
 */
export function StepIndicator({ 
  currentStep, 
  steps, 
  marginBottom = 16 
}: StepIndicatorProps) {
  return (
    <View style={[styles.container, { marginBottom }]}>
      <View style={styles.stepsContainer}>
        {/* Connector Line Background */}
        <View style={styles.connectorBackground} />
        
        {/* Active Connector Line */}
        {currentStep > 1 && (
          <View
            style={[
              styles.connectorActive,
              {
                width: `${((currentStep - 1) / (steps.length - 1)) * 84}%`,
              },
            ]}
          />
        )}
        
        {/* Steps */}
        {steps.map((stepItem, index) => {
          const isActive = currentStep >= stepItem.number;
          const isCurrent = currentStep === stepItem.number;
          
          return (
            <View key={stepItem.key || stepItem.number} style={styles.step}>
              {/* Circle with Number */}
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: isActive ? colors.accent : "#474747",
                    borderWidth: isCurrent ? 2 : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.circleText,
                    {
                      color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                    },
                  ]}
                >
                  {stepItem.number}
                </Text>
              </View>
              
              {/* Label */}
              <Text
                style={[
                  styles.label,
                  {
                    fontWeight: isCurrent ? ("600" as const) : ("400" as const),
                    color: isActive ? colors.accent : "rgba(255, 255, 255, 0.6)",
                  },
                ]}
              >
                {stepItem.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    position: "relative",
    paddingVertical: 8,
  },
  connectorBackground: {
    position: "absolute",
    left: "8%",
    right: "8%",
    top: 24,
    height: 2,
    backgroundColor: "#474747",
    zIndex: 0,
  },
  connectorActive: {
    position: "absolute",
    left: "8%",
    top: 24,
    height: 2,
    backgroundColor: colors.accent,
    zIndex: 1,
  },
  step: {
    alignItems: "center",
    flex: 1,
    zIndex: 2,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  circleText: {
    fontSize: 14,
    fontWeight: "700",
  },
  label: {
    fontSize: 12,
    textAlign: "center",
  },
});
