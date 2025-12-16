import Toast from "react-native-toast-message";
import { colors, spacing, borderRadius, typography } from "../constants/theme";

export type ToastType = "success" | "error" | "info" | "warning";

interface ShowToastOptions {
  type?: ToastType;
  text1?: string;
  text2?: string;
  position?: "top" | "bottom";
  visibilityTime?: number;
  autoHide?: boolean;
  topOffset?: number;
  bottomOffset?: number;
  onPress?: () => void;
  onShow?: () => void;
  onHide?: () => void;
}

/**
 * Show a toast notification
 */
export function showToast(
  message: string,
  options?: Omit<ShowToastOptions, "text2">
): void {
  Toast.show({
    type: options?.type || "info",
    text1: message,
    text2: options?.text1, // If text1 is provided in options, use it as text2
    position: options?.position || "top",
    visibilityTime: options?.visibilityTime || 3000,
    autoHide: options?.autoHide !== false,
    topOffset: options?.topOffset || 60,
    bottomOffset: options?.bottomOffset || 40,
    onPress: options?.onPress,
    onShow: options?.onShow,
    onHide: options?.onHide,
  });
}

/**
 * Show a success toast
 */
export function showSuccessToast(
  message: string,
  subtitle?: string,
  options?: Omit<ShowToastOptions, "type" | "text1" | "text2">
): void {
  Toast.show({
    type: "success",
    text1: message,
    text2: subtitle,
    position: options?.position || "top",
    visibilityTime: options?.visibilityTime || 3000,
    autoHide: options?.autoHide !== false,
    topOffset: options?.topOffset || 60,
    bottomOffset: options?.bottomOffset || 40,
    onPress: options?.onPress,
    onShow: options?.onShow,
    onHide: options?.onHide,
  });
}

/**
 * Show an error toast
 */
export function showErrorToast(
  message: string,
  subtitle?: string,
  options?: Omit<ShowToastOptions, "type" | "text1" | "text2">
): void {
  Toast.show({
    type: "error",
    text1: message,
    text2: subtitle,
    position: options?.position || "top",
    visibilityTime: options?.visibilityTime || 4000,
    autoHide: options?.autoHide !== false,
    topOffset: options?.topOffset || 60,
    bottomOffset: options?.bottomOffset || 40,
    onPress: options?.onPress,
    onShow: options?.onShow,
    onHide: options?.onHide,
  });
}

/**
 * Show an info toast
 */
export function showInfoToast(
  message: string,
  subtitle?: string,
  options?: Omit<ShowToastOptions, "type" | "text1" | "text2">
): void {
  Toast.show({
    type: "info",
    text1: message,
    text2: subtitle,
    position: options?.position || "top",
    visibilityTime: options?.visibilityTime || 3000,
    autoHide: options?.autoHide !== false,
    topOffset: options?.topOffset || 60,
    bottomOffset: options?.bottomOffset || 40,
    onPress: options?.onPress,
    onShow: options?.onShow,
    onHide: options?.onHide,
  });
}

/**
 * Show a warning toast
 */
export function showWarningToast(
  message: string,
  subtitle?: string,
  options?: Omit<ShowToastOptions, "type" | "text1" | "text2">
): void {
  Toast.show({
    type: "warning",
    text1: message,
    text2: subtitle,
    position: options?.position || "top",
    visibilityTime: options?.visibilityTime || 3500,
    autoHide: options?.autoHide !== false,
    topOffset: options?.topOffset || 60,
    bottomOffset: options?.bottomOffset || 40,
    onPress: options?.onPress,
    onShow: options?.onShow,
    onHide: options?.onHide,
  });
}

/**
 * Hide the current toast
 */
export function hideToast(): void {
  Toast.hide();
}

