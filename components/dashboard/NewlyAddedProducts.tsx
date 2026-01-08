import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
        contentContainerStyle={{ gap: isMobile ? 8 : 10, paddingRight: 20 }}
      >
        {mockNewProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            onPress={() => router.push(`/pages/products/${product.id}`)}
            className={cn(
              'bg-dark-card border border-primary/20 rounded-xl overflow-hidden',
              { 'w-[110px]': isMobile, 'w-[140px]': !isMobile }
            )}
          >
            <View className="w-full aspect-square relative bg-dark-background overflow-hidden">
              {product.images && product.images.length > 0 && product.images[0] ? (
                <Image
                  source={{ uri: product.images[0] }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={200}
                  placeholderContentFit="cover"
                  onError={() => {
                    // Image load error - silently fail, placeholder will show
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
