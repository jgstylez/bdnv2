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
 * Note: topOffset and bottomOffset are handled by the Toast component wrapper
 * with safe area insets. Only pass them if you need custom positioning.
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
    // Only pass offsets if explicitly provided, otherwise use Toast component defaults (safe-area-aware)
    ...(options?.topOffset !== undefined && { topOffset: options.topOffset }),
    ...(options?.bottomOffset !== undefined && { bottomOffset: options.bottomOffset }),
    onPress: options?.onPress,
    onShow: options?.onShow,
    onHide: options?.onHide,
  });
}

/**
 * Show a success toast
 * Note: topOffset and bottomOffset are handled by the Toast component wrapper
 * with safe area insets. Only pass them if you need custom positioning.
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
    // Only pass offsets if explicitly provided, otherwise use Toast component defaults (safe-area-aware)
    ...(options?.topOffset !== undefined && { topOffset: options.topOffset }),
    ...(options?.bottomOffset !== undefined && { bottomOffset: options.bottomOffset }),
    onPress: options?.onPress,
    onShow: options?.onShow,
    onHide: options?.onHide,
  });
}

/**
 * Show an error toast
 * Note: topOffset and bottomOffset are handled by the Toast component wrapper
 * with safe area insets. Only pass them if you need custom positioning.
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
    // Only pass offsets if explicitly provided, otherwise use Toast component defaults (safe-area-aware)
    ...(options?.topOffset !== undefined && { topOffset: options.topOffset }),
    ...(options?.bottomOffset !== undefined && { bottomOffset: options.bottomOffset }),
    onPress: options?.onPress,
    onShow: options?.onShow,
    onHide: options?.onHide,
  });
}

/**
 * Show an info toast
 * Note: topOffset and bottomOffset are handled by the Toast component wrapper
 * with safe area insets. Only pass them if you need custom positioning.
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
    // Only pass offsets if explicitly provided, otherwise use Toast component defaults (safe-area-aware)
    ...(options?.topOffset !== undefined && { topOffset: options.topOffset }),
    ...(options?.bottomOffset !== undefined && { bottomOffset: options.bottomOffset }),
    onPress: options?.onPress,
    onShow: options?.onShow,
    onHide: options?.onHide,
  });
}

/**
 * Show a warning toast
 * Note: topOffset and bottomOffset are handled by the Toast component wrapper
 * with safe area insets. Only pass them if you need custom positioning.
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
    // Only pass offsets if explicitly provided, otherwise use Toast component defaults (safe-area-aware)
    ...(options?.topOffset !== undefined && { topOffset: options.topOffset }),
    ...(options?.bottomOffset !== undefined && { bottomOffset: options.bottomOffset }),
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

