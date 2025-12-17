import React from "react";
import { View, FlatList, FlatListProps } from "react-native";
import { ListItem, ListItemAction } from "./ListItem";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { MaterialIcons } from "@expo/vector-icons";
import { spacing } from '../../constants/theme';

interface DataListProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
  data: T[];
  loading?: boolean;
  emptyIcon?: keyof typeof MaterialIcons.glyphMap;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  renderItem?: (item: T) => React.ReactNode;
  // Simplified rendering props
  getTitle?: (item: T) => string;
  getSubtitle?: (item: T) => string;
  getIcon?: (item: T) => keyof typeof MaterialIcons.glyphMap | React.ReactNode;
  getActions?: (item: T) => ListItemAction[];
  onItemPress?: (item: T) => void;
  getBadges?: (item: T) => { label: string; color: string; backgroundColor: string }[];
}

export function DataList<T>({
  data,
  loading,
  emptyIcon = "inbox",
  emptyTitle = "No items found",
  emptyDescription,
  emptyAction,
  renderItem,
  getTitle,
  getSubtitle,
  getIcon,
  getActions,
  onItemPress,
  getBadges,
  contentContainerStyle,
  ...props
}: DataListProps<T>) {
  if (loading) {
    return <LoadingState />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  const defaultRenderItem = ({ item }: { item: T }) => (
    <ListItem
      title={getTitle ? getTitle(item) : ""}
      subtitle={getSubtitle ? getSubtitle(item) : undefined}
      icon={getIcon ? getIcon(item) : undefined}
      actions={getActions ? getActions(item) : undefined}
      onPress={onItemPress ? () => onItemPress(item) : undefined}
      badges={getBadges ? getBadges(item) : undefined}
    />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem || defaultRenderItem}
      contentContainerStyle={[
        { gap: spacing.md, paddingBottom: spacing["2xl"] },
        contentContainerStyle,
      ]}
      {...props}
    />
  );
}
