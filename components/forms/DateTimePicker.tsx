import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Platform, Modal, ScrollView, Dimensions, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { logWarn } from '../../lib/logger';

// Conditional import for native date picker (not available on web)
let DateTimePicker: any = null;
if (Platform.OS !== "web") {
  try {
    DateTimePicker = require("@react-native-community/datetimepicker").default;
  } catch (e) {
    logWarn("DateTimePicker not available", { platform: Platform.OS, error: e });
  }
}

interface DateTimePickerProps {
  label: string;
  value: Date | string | null;
  onChange: (date: Date | null) => void;
  mode?: "date" | "time" | "datetime";
  required?: boolean;
  error?: string;
  helperText?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * DateTimePicker Component
 * Cupertino-style date and time picker with calendar view and wheel spinners
 * 
 * Usage:
 * ```tsx
 * <DateTimePickerComponent
 *   label="Due Date"
 *   value={dueDate}
 *   onChange={setDueDate}
 *   mode="date"
 * />
 * ```
 */
export const DateTimePickerComponent: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  mode = "date",
  required = false,
  error,
  helperText,
  minimumDate,
  maximumDate,
  placeholder,
  disabled = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(() => {
    if (value instanceof Date) return new Date(value);
    if (typeof value === "string" && value) return new Date(value);
    return new Date();
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleOpenPicker = () => {
    if (disabled) return;
    if (value instanceof Date) {
      setTempDate(new Date(value));
    } else if (typeof value === "string" && value) {
      setTempDate(new Date(value));
    } else {
      setTempDate(new Date());
    }
    setShowPicker(true);
    // Reset scroll indicator when opening
    setTimeout(() => {
      setShowScrollIndicator(true);
    }, 100);
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isNearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
    setShowScrollIndicator(!isNearBottom);
    scrollY.setValue(contentOffset.y);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (event.type === "set" && selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === "ios") {
        // On iOS, wait for "done" button
        return;
      }
      onChange(selectedDate);
    } else if (event.type === "dismissed") {
      setShowPicker(false);
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  const formatDate = (date: Date | string | null): string => {
    if (!date) return placeholder || "Select date";
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return placeholder || "Select date";

    if (mode === "time") {
      return dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    // For date and datetime modes, always show date + time if time is set
    const hasTime = dateObj.getHours() !== 0 || dateObj.getMinutes() !== 0 || dateObj.getSeconds() !== 0;
    
    if (mode === "datetime" || hasTime) {
      return dateObj.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    // Default: date only
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const displayValue = formatDate(value);

  // Calendar generation helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (day: number, month: number, year: number) => {
    const checkDate = new Date(year, month, day);
    if (minimumDate && checkDate < minimumDate) return true;
    if (maximumDate && checkDate > maximumDate) return true;
    return false;
  };

  const isDateSelected = (day: number, month: number, year: number) => {
    return (
      tempDate.getDate() === day &&
      tempDate.getMonth() === month &&
      tempDate.getFullYear() === year
    );
  };

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const changeMonth = (direction: "prev" | "next") => {
    const newDate = new Date(tempDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setTempDate(newDate);
  };

  const selectDate = (day: number) => {
    const newDate = new Date(tempDate);
    newDate.setDate(day);
    setTempDate(newDate);
    
    // Auto-scroll to time picker after selecting a date
    if (mode === "date" || mode === "datetime") {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  };

  // Time picker helpers
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const amPm = ["AM", "PM"];

  const getCurrentHour = () => {
    const hour = tempDate.getHours();
    return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  };

  const getCurrentMinute = () => tempDate.getMinutes();
  const getCurrentAmPm = () => (tempDate.getHours() >= 12 ? "PM" : "AM");

  const setTime = (hour: number, minute: number, period: "AM" | "PM") => {
    const newDate = new Date(tempDate);
    let hours24 = hour;
    if (period === "PM" && hour !== 12) hours24 = hour + 12;
    if (period === "AM" && hour === 12) hours24 = 0;
    newDate.setHours(hours24, minute, 0, 0);
    setTempDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(tempDate);
    const firstDay = getFirstDayOfMonth(tempDate);
    const month = tempDate.getMonth();
    const year = tempDate.getFullYear();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const days: (number | null)[] = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return (
      <View>
        {/* Month Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacing.md,
            paddingHorizontal: spacing.sm,
          }}
        >
          <TouchableOpacity
            onPress={() => changeMonth("prev")}
            style={{
              padding: spacing.sm,
              borderRadius: borderRadius.md,
              backgroundColor: colors.secondary.bg,
            }}
          >
            <MaterialIcons name="chevron-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
            }}
          >
            {monthNames[month]} {year}
          </Text>
          <TouchableOpacity
            onPress={() => changeMonth("next")}
            style={{
              padding: spacing.sm,
              borderRadius: borderRadius.md,
              backgroundColor: colors.secondary.bg,
            }}
          >
            <MaterialIcons name="chevron-right" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Day Names */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: spacing.sm,
          }}
        >
          {dayNames.map((day) => (
            <View
              key={day}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: spacing.xs,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.tertiary,
                }}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View>
          {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
            <View
              key={weekIndex}
              style={{
                flexDirection: "row",
                marginBottom: spacing.xs,
              }}
            >
              {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                if (day === null) {
                  return <View key={`empty-${dayIndex}`} style={{ flex: 1 }} />;
                }

                const disabled = isDateDisabled(day, month, year);
                const selected = isDateSelected(day, month, year);
                const today = isToday(day, month, year);

                return (
                  <TouchableOpacity
                    key={day}
                    onPress={() => !disabled && selectDate(day)}
                    disabled={disabled}
                    style={{
                      flex: 1,
                      aspectRatio: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      margin: 2,
                      borderRadius: borderRadius.md,
                      backgroundColor: selected
                        ? colors.accent
                        : today
                        ? colors.secondary.bg
                        : "transparent",
                      opacity: disabled ? 0.3 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: selected ? typography.fontWeight.bold : typography.fontWeight.normal,
                        color: selected
                          ? colors.text.primary
                          : today
                          ? colors.accent
                          : colors.text.primary,
                      }}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderTimePicker = () => {
    const currentHour = getCurrentHour();
    const currentMinute = getCurrentMinute();
    const currentAmPm = getCurrentAmPm();

    return (
      <View style={{ flexDirection: "row", justifyContent: "center", gap: spacing.lg }}>
        {/* Hour Picker */}
        <ScrollView
          style={{ maxHeight: 200 }}
          showsVerticalScrollIndicator={false}
          snapToInterval={40}
          decelerationRate="fast"
        >
          {hours.map((hour) => (
            <TouchableOpacity
              key={hour}
              onPress={() => setTime(hour, currentMinute, currentAmPm as "AM" | "PM")}
              style={{
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                minWidth: 60,
                alignItems: "center",
                backgroundColor: currentHour === hour ? colors.accent : "transparent",
                borderRadius: borderRadius.md,
                marginVertical: 2,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: currentHour === hour ? typography.fontWeight.bold : typography.fontWeight.normal,
                  color: currentHour === hour ? colors.text.primary : colors.text.secondary,
                }}
              >
                {hour.toString().padStart(2, "0")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={{ fontSize: typography.fontSize.xl, color: colors.text.primary, marginTop: spacing.md }}>
          :
        </Text>

        {/* Minute Picker */}
        <ScrollView
          style={{ maxHeight: 200 }}
          showsVerticalScrollIndicator={false}
          snapToInterval={40}
          decelerationRate="fast"
        >
          {minutes.map((minute) => (
            <TouchableOpacity
              key={minute}
              onPress={() => setTime(currentHour, minute, currentAmPm as "AM" | "PM")}
              style={{
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                minWidth: 60,
                alignItems: "center",
                backgroundColor: currentMinute === minute ? colors.accent : "transparent",
                borderRadius: borderRadius.md,
                marginVertical: 2,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: currentMinute === minute ? typography.fontWeight.bold : typography.fontWeight.normal,
                  color: currentMinute === minute ? colors.text.primary : colors.text.secondary,
                }}
              >
                {minute.toString().padStart(2, "0")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* AM/PM Picker */}
        <ScrollView
          style={{ maxHeight: 200 }}
          showsVerticalScrollIndicator={false}
          snapToInterval={40}
          decelerationRate="fast"
        >
          {amPm.map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setTime(currentHour, currentMinute, period as "AM" | "PM")}
              style={{
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                minWidth: 60,
                alignItems: "center",
                backgroundColor: currentAmPm === period ? colors.accent : "transparent",
                borderRadius: borderRadius.md,
                marginVertical: 2,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: currentAmPm === period ? typography.fontWeight.bold : typography.fontWeight.normal,
                  color: currentAmPm === period ? colors.text.primary : colors.text.secondary,
                }}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text
        style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        }}
      >
        {label} {required && <Text style={{ color: colors.status.error }}>*</Text>}
      </Text>

      <TouchableOpacity
        onPress={handleOpenPicker}
        disabled={disabled}
        style={{
          backgroundColor: disabled ? colors.secondary.bg : colors.background.input,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: error ? colors.status.error : colors.border.light,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: value ? colors.text.primary : colors.text.placeholder,
            flex: 1,
          }}
        >
          {displayValue}
        </Text>
        <MaterialIcons
          name={mode === "time" ? "access-time" : "calendar-today"}
          size={20}
          color={colors.text.secondary}
        />
      </TouchableOpacity>

      {error && (
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.status.error,
            marginTop: spacing.xs,
          }}
        >
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.tertiary,
            marginTop: spacing.xs,
          }}
        >
          {helperText}
        </Text>
      )}

      {/* Cupertino-style Picker Modal */}
      {showPicker && (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: colors.secondary.bg,
                borderTopLeftRadius: borderRadius.xl,
                borderTopRightRadius: borderRadius.xl,
                paddingTop: spacing.md,
                paddingBottom: Platform.OS === "ios" ? 40 : spacing.lg,
                maxHeight: Dimensions.get("window").height * 0.7,
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: spacing.lg,
                  paddingBottom: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border.light,
                }}
              >
                <TouchableOpacity onPress={handleCancel}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.secondary,
                      fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                  }}
                >
                  {label}
                </Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.accent,
                      fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Picker Content */}
              <View style={{ position: "relative", flex: 1 }}>
                <ScrollView
                  ref={scrollViewRef}
                  style={{
                    paddingHorizontal: spacing.lg,
                    paddingTop: spacing.lg,
                  }}
                  showsVerticalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                  onContentSizeChange={() => {
                    // Auto-scroll slightly to show there's more content
                    if (mode !== "time" && (mode === "datetime" || mode === "date")) {
                      setTimeout(() => {
                        scrollViewRef.current?.scrollTo({ y: 50, animated: true });
                        setTimeout(() => {
                          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                        }, 300);
                      }, 200);
                    }
                  }}
                >
                  {mode === "time" ? (
                    renderTimePicker()
                  ) : (
                    <View style={{ gap: spacing.xl }}>
                      {renderCalendar()}
                      {(mode === "datetime" || mode === "date") && (
                        <View
                          style={{
                            borderTopWidth: 1,
                            borderTopColor: colors.border.light,
                            paddingTop: spacing.lg,
                            paddingBottom: spacing.xl,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: spacing.md,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: typography.fontSize.base,
                                fontWeight: typography.fontWeight.semibold,
                                color: colors.text.primary,
                              }}
                            >
                              Time {mode === "date" && "(Optional)"}
                            </Text>
                            <MaterialIcons
                              name="keyboard-arrow-down"
                              size={20}
                              color={colors.text.tertiary}
                              style={{ opacity: showScrollIndicator ? 1 : 0 }}
                            />
                          </View>
                          {renderTimePicker()}
                        </View>
                      )}
                    </View>
                  )}
                </ScrollView>

                {/* Scroll Indicator - Fade Gradient at Bottom */}
                {showScrollIndicator && mode !== "time" && (mode === "datetime" || mode === "date") && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 60,
                      pointerEvents: "none",
                    }}
                  >
                    <LinearGradient
                      colors={["transparent", colors.secondary.bg + "FF"]}
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        paddingBottom: spacing.md,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: spacing.xs,
                        }}
                      >
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={16}
                          color={colors.text.tertiary}
                        />
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.tertiary,
                          }}
                        >
                          Scroll down for time
                        </Text>
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={16}
                          color={colors.text.tertiary}
                        />
                      </View>
                    </LinearGradient>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
