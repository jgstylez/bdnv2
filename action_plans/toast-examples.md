# Toast Notifications Usage Guide

Toast notifications are now set up with BDN theme colors. Use them for non-blocking user feedback.

## Basic Usage

```typescript
import { showToast, showSuccessToast, showErrorToast, showInfoToast, showWarningToast } from '@/lib/toast';

// Simple message
showToast("Operation completed successfully");

// Success toast
showSuccessToast("Payment received", "You received $50.00 from Soul Food Kitchen");

// Error toast
showErrorToast("Payment failed", "Please check your payment method and try again");

// Info toast
showInfoToast("New feature available", "Check out our enhanced search functionality");

// Warning toast
showWarningToast("Low balance", "Your account balance is below $10");
```

## Advanced Options

```typescript
import { showSuccessToast } from '@/lib/toast';

showSuccessToast(
  "Order placed",
  "Your order will arrive in 2-3 business days",
  {
    position: "bottom",        // "top" | "bottom"
    visibilityTime: 5000,      // milliseconds
    autoHide: true,            // auto-hide after visibilityTime
    topOffset: 60,             // offset from top (if position is "top")
    bottomOffset: 40,          // offset from bottom (if position is "bottom")
    onPress: () => {          // callback when toast is pressed
      console.log("Toast pressed");
    },
    onShow: () => {            // callback when toast appears
      console.log("Toast shown");
    },
    onHide: () => {            // callback when toast hides
      console.log("Toast hidden");
    },
  }
);
```

## Toast Types

- **Success** (green): Use for successful operations, confirmations
- **Error** (red): Use for errors, failures, validation issues
- **Info** (blue): Use for informational messages, updates
- **Warning** (orange): Use for warnings, important notices

## Hide Toast Programmatically

```typescript
import { hideToast } from '@/lib/toast';

hideToast(); // Hide the currently visible toast
```

## Theme Colors Used

- Background: `#474747` (secondary.bg)
- Success: `#4caf50` (status.success)
- Error: `#ff4444` (status.error)
- Info: `#2196f3` (status.info)
- Warning: `#ff9800` (status.warning)
- Text: `#ffffff` (text.primary) and `rgba(255, 255, 255, 0.7)` (text.secondary)

