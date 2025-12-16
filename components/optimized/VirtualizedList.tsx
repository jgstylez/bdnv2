import React, { memo } from "react";
import { FlatList, FlatListProps, ListRenderItem } from "react-native";

interface VirtualizedListProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  emptyComponent?: React.ReactNode;
}

/**
 * VirtualizedList Component
 * Optimized list component with virtualization for better performance
 * Use this for large lists (100+ items)
 */
function VirtualizedListComponent<T>({
  data,
  renderItem,
  keyExtractor,
  emptyComponent,
  ...flatListProps
}: VirtualizedListProps<T>) {
  if (data.length === 0 && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  return (
    <FlatList
      {...flatListProps}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      getItemLayout={flatListProps.getItemLayout}
    />
  );
}

export const VirtualizedList = memo(VirtualizedListComponent) as typeof VirtualizedListComponent;

