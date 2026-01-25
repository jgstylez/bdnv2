import React from "react";
import { StepIndicator, Step } from "../StepIndicator";
import { spacing } from '../../constants/theme';

interface ProductStepIndicatorProps {
  currentStep: number;
  steps: string[];
}

/**
 * ProductStepIndicator Component
 * 
 * Wrapper around StepIndicator for product creation flow.
 * Converts string array to Step array format.
 */
export function ProductStepIndicator({ currentStep, steps }: ProductStepIndicatorProps) {
  const stepIndicatorSteps: Step[] = steps.map((step, index) => ({
    number: index + 1,
    label: step,
  }));

  return (
    <StepIndicator 
      currentStep={currentStep} 
      steps={stepIndicatorSteps}
      marginBottom={spacing.xl}
    />
  );
}
