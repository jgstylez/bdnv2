import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { cn } from "../../lib/utils";

const features = [
  {
    title: "Find Events",
    description: "Discover & engage with community",
    icon: "event" as const,
    onPress: (router: any) => router.push("/pages/events"),
    color: "#ba9988",
  },
  {
    title: "Buy Tokens",
    description: "Gain exclusive access & earnings",
    icon: "account-balance-wallet" as const,
    onPress: (router: any) => router.push("/pages/tokens"),
    color: "#ffd700",
  },
  {
    title: "Buy Gift Cards",
    description: "Send gift cards to loved ones",
    icon: "card-giftcard" as const,
    onPress: (router: any) => router.push("/pages/payments/buy-gift-card"),
    color: "#e91e63",
  },
  {
    title: "BDN University",
    description: "Learn more about the platform & culture",
    icon: "school" as const,
    onPress: (router: any) => router.push("/pages/university"),
    color: "#9c27b0",
  },
];

interface KeyFeaturesProps {
  isMobile: boolean;
}

export function KeyFeatures({ isMobile }: KeyFeaturesProps) {
  const router = useRouter();

  return (
    <View className="mb-8">
      <Text className="text-xl font-bold text-dark-foreground mb-4">
        Explore Features
      </Text>
      <View
        className={cn("flex-row flex-wrap", {
          "gap-3": isMobile,
          "gap-4": !isMobile,
        })}
      >
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => feature.onPress(router)}
            className={cn(
              "bg-dark-card border border-primary/20 rounded-2xl p-5",
              {
                "w-[48%]": isMobile,
                "flex-1 min-w-[200px]": !isMobile,
              }
            )}
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: `${feature.color}20` }}
            >
              <MaterialIcons
                name={feature.icon}
                size={24}
                color={feature.color}
              />
            </View>
            <Text className="text-base font-semibold text-dark-foreground mb-1">
              {feature.title}
            </Text>
            <Text className="text-sm text-dark-muted-foreground">
              {feature.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
