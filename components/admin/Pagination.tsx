import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
  alwaysShow?: boolean; // Force display even when totalPages <= 1
}

/**
 * Pagination Component
 * Reusable pagination component for admin pages
 */
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 5,
  alwaysShow = false,
}: PaginationProps) {
  const { isMobile } = useResponsive();

  if (!alwaysShow && totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxPageNumbers / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxPageNumbers - 1);

    if (end - start < maxPageNumbers - 1) {
      start = Math.max(1, end - maxPageNumbers + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push("...");
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <View
      style={{
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacing.md,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.secondary.bg,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border.light,
      }}
    >
      {/* Items Info */}
      <Text
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.secondary,
        }}
      >
        Showing {startItem.toLocaleString()} - {endItem.toLocaleString()} of {totalItems.toLocaleString()}
      </Text>

      {/* Pagination Controls */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs,
        }}
      >
        {/* First Page */}
        <TouchableOpacity
          onPress={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={{
            padding: spacing.sm,
            borderRadius: borderRadius.sm,
            backgroundColor: currentPage === 1 ? colors.primary.bg : colors.secondary.bg,
            borderWidth: 1,
            borderColor: currentPage === 1 ? colors.border.light : colors.border.light,
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          <MaterialIcons
            name="first-page"
            size={20}
            color={currentPage === 1 ? colors.text.tertiary : colors.text.primary}
          />
        </TouchableOpacity>

        {/* Previous Page */}
        <TouchableOpacity
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: spacing.sm,
            borderRadius: borderRadius.sm,
            backgroundColor: currentPage === 1 ? colors.primary.bg : colors.secondary.bg,
            borderWidth: 1,
            borderColor: currentPage === 1 ? colors.border.light : colors.border.light,
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          <MaterialIcons
            name="chevron-left"
            size={20}
            color={currentPage === 1 ? colors.text.tertiary : colors.text.primary}
          />
        </TouchableOpacity>

        {/* Page Numbers */}
        {showPageNumbers && !isMobile && (
          <View style={{ flexDirection: "row", gap: spacing.xs }}>
            {getPageNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <View
                    key={`ellipsis-${index}`}
                    style={{
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xs,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        color: colors.text.tertiary,
                      }}
                    >
                      ...
                    </Text>
                  </View>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <TouchableOpacity
                  key={pageNum}
                  onPress={() => onPageChange(pageNum)}
                  style={{
                    minWidth: 36,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.sm,
                    backgroundColor: isActive ? colors.accent : colors.primary.bg,
                    borderWidth: 1,
                    borderColor: isActive ? colors.accent : colors.border.light,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: isActive ? typography.fontWeight.bold : typography.fontWeight.normal,
                      color: isActive ? colors.text.primary : colors.text.secondary,
                    }}
                  >
                    {pageNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Current Page Indicator (Mobile) */}
        {isMobile && (
          <View
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {currentPage} / {totalPages}
            </Text>
          </View>
        )}

        {/* Next Page */}
        <TouchableOpacity
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: spacing.sm,
            borderRadius: borderRadius.sm,
            backgroundColor: currentPage === totalPages ? colors.primary.bg : colors.secondary.bg,
            borderWidth: 1,
            borderColor: currentPage === totalPages ? colors.border.light : colors.border.light,
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={currentPage === totalPages ? colors.text.tertiary : colors.text.primary}
          />
        </TouchableOpacity>

        {/* Last Page */}
        <TouchableOpacity
          onPress={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{
            padding: spacing.sm,
            borderRadius: borderRadius.sm,
            backgroundColor: currentPage === totalPages ? colors.primary.bg : colors.secondary.bg,
            borderWidth: 1,
            borderColor: currentPage === totalPages ? colors.border.light : colors.border.light,
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          <MaterialIcons
            name="last-page"
            size={20}
            color={currentPage === totalPages ? colors.text.tertiary : colors.text.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

