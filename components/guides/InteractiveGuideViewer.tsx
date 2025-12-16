import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Guide, GuideStep, InteractiveElement } from "../../types/education";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";
import { useResponsive } from "../../hooks/useResponsive";

interface InteractiveGuideViewerProps {
  guide: Guide;
  onComplete?: () => void;
}

/**
 * InteractiveGuideViewer Component
 * 
 * Provides an interactive, step-by-step guide experience with:
 * - Progress tracking
 * - Step-by-step navigation
 * - Interactive elements (checkboxes, buttons, etc.)
 * - Bite-sized content with clear visual indicators
 * - Completion tracking
 */
export default function InteractiveGuideViewer({
  guide,
  onComplete,
}: InteractiveGuideViewerProps) {
  const { isMobile, paddingHorizontal } = useResponsive();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [interactiveStates, setInteractiveStates] = useState<Record<string, boolean>>({});

  const currentStep = guide.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / guide.steps.length) * 100;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === guide.steps.length - 1;
  const isCurrentStepComplete = completedSteps.has(currentStep.stepNumber);

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  };

  const toggleStepComplete = (stepNumber: number) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber);
      } else {
        newSet.add(stepNumber);
      }
      return newSet;
    });
  };

  const handleInteractiveElementChange = (elementId: string, checked: boolean) => {
    setInteractiveStates((prev) => ({
      ...prev,
      [elementId]: checked,
    }));
  };

  const renderInteractiveElement = (element: InteractiveElement) => {
    switch (element.type) {
      case "checkbox":
        return (
          <TouchableOpacity
            key={element.id}
            onPress={() => handleInteractiveElementChange(element.id, !interactiveStates[element.id])}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: spacing.sm,
              padding: spacing.md,
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              marginTop: spacing.sm,
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: interactiveStates[element.id] ? colors.accent : colors.border.light,
                backgroundColor: interactiveStates[element.id] ? colors.accent : "transparent",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              {interactiveStates[element.id] && (
                <MaterialIcons name="check" size={16} color={colors.text.primary} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                {element.label}
              </Text>
              {element.content && (
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                    marginTop: spacing.xs,
                  }}
                >
                  {element.content}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );

      case "button":
        return (
          <TouchableOpacity
            key={element.id}
            onPress={() => {
              if (element.action?.type === "navigate" && element.action.target) {
                // Handle navigation
              }
            }}
            style={{
              backgroundColor: colors.accent,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              alignItems: "center",
              marginTop: spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {element.label || "Action"}
            </Text>
          </TouchableOpacity>
        );

      case "code-snippet":
        return (
          <View
            key={element.id}
            style={{
              backgroundColor: colors.primary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              marginTop: spacing.sm,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm }}>
              <Text
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.text.secondary,
                  fontWeight: typography.fontWeight.semibold,
                  textTransform: "uppercase",
                }}
              >
                Code Example
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // Copy code to clipboard
                }}
                style={{ padding: spacing.xs }}
              >
                <MaterialIcons name="content-copy" size={16} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                fontFamily: "monospace",
                color: colors.text.primary,
              }}
            >
              {element.content}
            </Text>
          </View>
        );

      case "highlight":
        return (
          <View
            key={element.id}
            style={{
              backgroundColor: colors.accentLight,
              borderRadius: borderRadius.sm,
              padding: spacing.md,
              marginTop: spacing.sm,
              borderLeftWidth: 4,
              borderLeftColor: colors.accent,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.accent,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              💡 {element.label || "Tip"}
            </Text>
            {element.content && (
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.primary,
                  marginTop: spacing.xs,
                }}
              >
                {element.content}
              </Text>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Progress Bar */}
      <View
        style={{
          height: 4,
          backgroundColor: colors.secondary.bg,
          borderRadius: 2,
          marginBottom: spacing.lg,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: colors.accent,
            borderRadius: 2,
          }}
        />
      </View>

      {/* Step Indicator */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing.lg,
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            fontWeight: typography.fontWeight.semibold,
          }}
        >
          Step {currentStep.stepNumber} of {guide.steps.length}
        </Text>
        <View style={{ flexDirection: "row", gap: spacing.xs }}>
          {guide.steps.map((step, index) => (
            <TouchableOpacity
              key={step.stepNumber}
              onPress={() => handleStepClick(index)}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  index === currentStepIndex
                    ? colors.accent
                    : completedSteps.has(step.stepNumber)
                      ? colors.status.success
                      : colors.border.light,
              }}
            />
          ))}
        </View>
      </View>

      {/* Current Step Content */}
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: spacing["2xl"] }}
      >
        {/* Step Header */}
        <View style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.accentLight,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.accent,
                }}
              >
                {currentStep.stepNumber}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: typography.fontSize["2xl"],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                {currentStep.title}
              </Text>
              {currentStep.estimatedTime && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.xs }}>
                  <MaterialIcons name="schedule" size={14} color={colors.text.secondary} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                    }}
                  >
                    {currentStep.estimatedTime}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Step Description */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            {currentStep.description}
          </Text>
          {currentStep.detailedContent && (
            <Text
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.primary,
                lineHeight: typography.lineHeight.relaxed,
                marginTop: spacing.md,
              }}
            >
              {currentStep.detailedContent}
            </Text>
          )}
        </View>

        {/* Step Image */}
        {currentStep.imageUrl && (
          <View
            style={{
              borderRadius: borderRadius.lg,
              overflow: "hidden",
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Image
              source={{ uri: currentStep.imageUrl }}
              style={{
                width: "100%",
                aspectRatio: 16 / 9,
                backgroundColor: colors.secondary.bg,
              }}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Code Example */}
        {currentStep.codeExample && (
          <View
            style={{
              backgroundColor: colors.primary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm }}>
              <Text
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.text.secondary,
                  fontWeight: typography.fontWeight.semibold,
                  textTransform: "uppercase",
                }}
              >
                {currentStep.codeExample.language}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // Copy code
                }}
                style={{ padding: spacing.xs }}
              >
                <MaterialIcons name="content-copy" size={16} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                fontFamily: "monospace",
                color: colors.text.primary,
              }}
            >
              {currentStep.codeExample.code}
            </Text>
          </View>
        )}

        {/* Interactive Elements */}
        {currentStep.interactiveElements && currentStep.interactiveElements.length > 0 && (
          <View style={{ marginBottom: spacing.lg }}>
            {currentStep.interactiveElements.map((element) => renderInteractiveElement(element))}
          </View>
        )}

        {/* Tips */}
        {currentStep.tips && currentStep.tips.length > 0 && (
          <View
            style={{
              backgroundColor: colors.accentLight,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              marginBottom: spacing.lg,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm }}>
              <MaterialIcons name="lightbulb" size={20} color={colors.accent} />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.accent,
                }}
              >
                Pro Tips
              </Text>
            </View>
            {currentStep.tips.map((tip, index) => (
              <View key={index} style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs }}>
                <Text style={{ color: colors.accent, fontSize: typography.fontSize.sm }}>•</Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.primary,
                    flex: 1,
                  }}
                >
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Completion Criteria */}
        {currentStep.completionCriteria && (
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
                marginBottom: spacing.xs,
              }}
            >
              ✓ Completion Checklist
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
              }}
            >
              {currentStep.completionCriteria}
            </Text>
          </View>
        )}

        {/* Step Completion Toggle */}
        <TouchableOpacity
          onPress={() => toggleStepComplete(currentStep.stepNumber)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            padding: spacing.md,
            backgroundColor: isCurrentStepComplete ? colors.status.success + "20" : colors.secondary.bg,
            borderRadius: borderRadius.md,
            borderWidth: 2,
            borderColor: isCurrentStepComplete ? colors.status.success : colors.border.light,
            marginBottom: spacing.lg,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: isCurrentStepComplete ? colors.status.success : colors.border.light,
              backgroundColor: isCurrentStepComplete ? colors.status.success : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isCurrentStepComplete && (
              <MaterialIcons name="check" size={16} color={colors.text.primary} />
            )}
          </View>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: isCurrentStepComplete ? colors.status.success : colors.text.primary,
            }}
          >
            Mark this step as complete
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Navigation Buttons */}
      <View
        style={{
          flexDirection: "row",
          gap: spacing.md,
          paddingTop: spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
        }}
      >
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={isFirstStep}
          style={{
            flex: 1,
            paddingVertical: spacing.md,
            borderRadius: borderRadius.md,
            backgroundColor: colors.secondary.bg,
            borderWidth: 1,
            borderColor: colors.border.light,
            alignItems: "center",
            opacity: isFirstStep ? 0.5 : 1,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
            }}
          >
            Previous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          style={{
            flex: 1,
            paddingVertical: spacing.md,
            borderRadius: borderRadius.md,
            backgroundColor: colors.accent,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
            }}
          >
            {isLastStep ? "Complete Guide" : "Next Step"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

