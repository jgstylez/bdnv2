import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { mockNewProducts } from '../../data/mock';
import { ProductPlaceholder } from '../ProductPlaceholder';
import { cn } from '../../lib/utils';

interface NewlyAddedProductsProps {
  isMobile: boolean;
}

export function NewlyAddedProducts({ isMobile }: NewlyAddedProductsProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // Calculate card width to show exactly 2.5 cards on mobile
  const getCardWidth = () => {
    if (!isMobile) return 140;
    
    // Dashboard has paddingHorizontal of 20px on mobile
    const paddingHorizontal = 20;
    // Gap between cards (8px = spacing.sm)
    const gap = 8;
    // Right padding in ScrollView contentContainerStyle
    const paddingRight = 20;
    
    // Available width = screen width - left padding - right padding
    const availableWidth = width - paddingHorizontal - paddingRight;
    
    // For 2.5 cards: 2.5 * cardWidth + 1.5 * gap = availableWidth
    // Solving for cardWidth: cardWidth = (availableWidth - 1.5 * gap) / 2.5
    const cardWidth = (availableWidth - (1.5 * gap)) / 2.5;
    
    // Round down to ensure we show at least 2.5 cards (slightly more is okay)
    return Math.floor(cardWidth);
  };

  const cardWidth = getCardWidth();

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-dark-foreground">Newly Added Products</Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/marketplace')}
          className="flex-row items-center gap-1"
        >
          <Text className="text-sm font-semibold text-primary">View All</Text>
          <MaterialIcons name="chevron-right" size={20} color="#ba9988" />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 20 }}
      >
        {mockNewProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            onPress={() => router.push(`/pages/products/${product.id}`)}
            className="bg-dark-card border border-primary/20 rounded-xl overflow-hidden"
            style={{
              width: isMobile ? cardWidth : 140,
            }}
          >
            <View className="w-full aspect-square relative bg-dark-background overflow-hidden">
              {product.images && 
               product.images.length > 0 && 
               product.images[0] && 
               product.images[0].trim() !== "" &&
               !imageErrors.has(product.id) ? (
                <Image
                  source={{ uri: product.images[0] }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={200}
                  placeholderContentFit="cover"
                  onError={() => {
                    setImageErrors((prev) => new Set(prev).add(product.id));
                  }}
                />
              ) : (
                <ProductPlaceholder width="100%" height={isMobile ? 110 : 140} aspectRatio={1} />
              )}
              {product.productType && (
                <View
                  className={cn(
                    'absolute top-1.5 right-1.5 rounded-md px-1.5 py-0.5',
                    {
                      'bg-info': product.productType === 'physical',
                      'bg-primary': product.productType === 'digital',
                      'bg-success': product.productType === 'service',
                    }
                  )}
                >
                  <Text className="text-[9px] font-bold text-dark-foreground">
                    {product.productType.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <View className={cn({ 'p-1.5': isMobile, 'p-2.5': !isMobile })}>
              <Text
                className={cn('font-semibold text-dark-foreground', {
                  'text-xs mb-0.5': isMobile,
                  'text-sm mb-1': !isMobile,
                })}
                numberOfLines={2}
              >
                {product.name}
              </Text>
              <Text className={cn('font-bold text-primary', { 'text-sm': isMobile, 'text-base': !isMobile })}>
                ${product.price.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
