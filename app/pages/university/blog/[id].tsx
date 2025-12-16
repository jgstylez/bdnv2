import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
  Share,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BlogPost, BlogContentBlock } from "../../../../types/education";
import RichContentRenderer from "../../../../components/blog/RichContentRenderer";

// Mock blog posts with rich content
const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "BDN Launches New Merchant Features",
    excerpt: "We're excited to announce new features for merchants, including enhanced analytics and QR code generation.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop",
    contentBlocks: [
      {
        type: "paragraph",
        content: "We're thrilled to announce a major update to the BDN platform that brings powerful new tools for merchants. These features are designed to help you grow your business, understand your customers better, and streamline your operations.",
      },
      {
        type: "heading",
        level: 2,
        content: "Enhanced Analytics Dashboard",
      },
      {
        type: "paragraph",
        content: "Our new analytics dashboard provides real-time insights into your business performance. Track sales, monitor customer behavior, and identify trends that matter most to your business.",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Real-time sales tracking and reporting",
          "Customer demographics and behavior analysis",
          "Product performance metrics",
          "Revenue forecasting and trends",
        ],
      },
      {
        type: "callout",
        variant: "info",
        content: "All analytics data is updated in real-time, giving you the most current view of your business performance.",
      },
      {
        type: "heading",
        level: 2,
        content: "QR Code Generation",
      },
      {
        type: "paragraph",
        content: "Generate custom QR codes for your products, services, or marketing campaigns. These QR codes can be used to:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Link directly to your BDN storefront",
          "Share product information instantly",
          "Enable quick checkout for customers",
          "Track marketing campaign performance",
        ],
      },
      {
        type: "image",
        url: "",
        alt: "QR Code Example",
        caption: "Example QR code linking to a BDN merchant storefront",
      },
      {
        type: "heading",
        level: 2,
        content: "Getting Started",
      },
      {
        type: "paragraph",
        content: "To access these new features, simply log into your merchant dashboard. The analytics dashboard is available immediately, and QR code generation can be found in the Tools section.",
      },
      {
        type: "code",
        language: "bash",
        code: "# Access your merchant dashboard\n# Navigate to Analytics or Tools section\n# Start exploring the new features!",
      },
      {
        type: "quote",
        content: "These new features have transformed how we understand and serve our customers. The analytics insights are invaluable.",
        author: "Sarah Johnson, Merchant",
      },
      {
        type: "divider",
      },
      {
        type: "paragraph",
        content: "We're committed to continuously improving the BDN platform. Stay tuned for more exciting updates coming soon!",
      },
    ],
    author: {
      name: "BDN Team",
      bio: "The BDN Team is dedicated to building tools that empower Black-owned businesses and strengthen our community.",
    },
    category: "updates",
    tags: ["merchant", "features", "announcement"],
    publishedAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
    readTime: 5,
    views: 1250,
    relatedPosts: ["2", "4"],
  },
  {
    id: "2",
    title: "5 Ways to Maximize Your Impact Points",
    excerpt: "Learn how to earn more points and unlock higher membership levels with these proven strategies.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=450&fit=crop",
    contentBlocks: [
      {
        type: "paragraph",
        content: "Impact Points are the foundation of the BDN rewards system. The more points you earn, the higher your membership level and the greater your benefits. Here are five proven strategies to maximize your points.",
      },
      {
        type: "heading",
        level: 2,
        content: "1. Shop at Black-Owned Businesses",
      },
      {
        type: "paragraph",
        content: "Every purchase you make at a BDN merchant earns you points. The more you shop, the more you earn. Plus, you're supporting Black-owned businesses in your community.",
      },
      {
        type: "heading",
        level: 2,
        content: "2. Complete Your Profile",
      },
      {
        type: "paragraph",
        content: "A complete profile earns you bonus points and helps us personalize your experience. Make sure to add your interests, location, and preferences.",
      },
      {
        type: "heading",
        level: 2,
        content: "3. Refer Friends and Family",
      },
      {
        type: "paragraph",
        content: "When you refer someone to BDN, you both earn bonus points. It's a win-win for everyone!",
      },
      {
        type: "heading",
        level: 2,
        content: "4. Participate in Challenges",
      },
      {
        type: "paragraph",
        content: "Regular challenges and events offer bonus point opportunities. Keep an eye on your dashboard for new challenges.",
      },
      {
        type: "heading",
        level: 2,
        content: "5. Engage with the Community",
      },
      {
        type: "paragraph",
        content: "Leave reviews, share your experiences, and participate in community discussions to earn additional points.",
      },
    ],
    author: {
      name: "Sarah Johnson",
      bio: "Sarah is a BDN community manager and rewards expert.",
    },
    category: "tips",
    tags: ["points", "rewards", "tips"],
    publishedAt: "2024-02-10T14:00:00Z",
    readTime: 7,
    views: 890,
    relatedPosts: ["1", "4"],
  },
  {
    id: "3",
    title: "Community Spotlight: Black-Owned Businesses Making a Difference",
    excerpt: "Meet the entrepreneurs building stronger communities through their businesses.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop",
    contentBlocks: [
      {
        type: "paragraph",
        content: "This month, we're highlighting three incredible Black-owned businesses that are making a real difference in their communities. These entrepreneurs are not just building successful companies—they're creating lasting impact.",
      },
      {
        type: "heading",
        level: 2,
        content: "Empowering Through Education",
      },
      {
        type: "paragraph",
        content: "Meet Sarah's Learning Hub, a tutoring center that provides free after-school programs to underserved communities. Founder Sarah Mitchell started with just five students and has grown to serve over 200 children.",
      },
      {
        type: "quote",
        content: "Education is the foundation of everything. When we invest in our children, we invest in our future.",
        author: "Sarah Mitchell, Founder",
      },
      {
        type: "heading",
        level: 2,
        content: "Feeding Families, Building Hope",
      },
      {
        type: "paragraph",
        content: "Marcus's Kitchen isn't just a restaurant—it's a community resource. During the pandemic, they provided over 10,000 free meals to families in need.",
      },
      {
        type: "callout",
        variant: "success",
        content: "Marcus's Kitchen has partnered with local food banks to ensure no family goes hungry.",
      },
      {
        type: "heading",
        level: 2,
        content: "Tech for Good",
      },
      {
        type: "paragraph",
        content: "TechBridge Solutions, founded by Jamal Williams, provides free coding classes to young adults, helping bridge the digital divide in our community.",
      },
    ],
    author: {
      name: "Marcus Williams",
      bio: "Marcus is a community advocate and business writer.",
    },
    category: "community",
    tags: ["community", "businesses", "spotlight"],
    publishedAt: "2024-02-05T09:00:00Z",
    readTime: 10,
    views: 650,
  },
  {
    id: "4",
    title: "Understanding Cashback: How It Works",
    excerpt: "A comprehensive guide to earning and using cashback on the BDN platform.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=450&fit=crop",
    contentBlocks: [
      {
        type: "paragraph",
        content: "Cashback is one of the most popular features on BDN. Here's everything you need to know about how it works, how to maximize your earnings, and how to use your cashback effectively.",
      },
      {
        type: "heading",
        level: 2,
        content: "What is Cashback?",
      },
      {
        type: "paragraph",
        content: "Cashback is money you earn back on every purchase you make through BDN. It's our way of rewarding you for supporting Black-owned businesses while saving money.",
      },
      {
        type: "heading",
        level: 2,
        content: "How to Earn Cashback",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Shop at any BDN merchant",
          "Use your BDN account for purchases",
          "Earn a percentage back on every transaction",
          "Watch your cashback balance grow",
        ],
      },
      {
        type: "callout",
        variant: "info",
        content: "Cashback rates vary by merchant. Check individual store pages for specific rates.",
      },
      {
        type: "heading",
        level: 2,
        content: "Using Your Cashback",
      },
      {
        type: "paragraph",
        content: "Your cashback can be used in several ways:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Apply it to future purchases",
          "Transfer to your BDN wallet",
          "Donate to community causes",
          "Redeem for gift cards",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Maximizing Your Earnings",
      },
      {
        type: "paragraph",
        content: "To get the most out of cashback:",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Shop during bonus cashback events",
          "Complete your profile for higher rates",
          "Refer friends for bonus earnings",
          "Check for merchant-specific promotions",
        ],
      },
    ],
    author: {
      name: "BDN Team",
    },
    category: "tips",
    tags: ["cashback", "rewards", "guide"],
    publishedAt: "2024-02-01T12:00:00Z",
    readTime: 6,
    views: 420,
    relatedPosts: ["1", "2"],
  },
];

export default function BlogDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const scrollViewRef = useRef<ScrollView>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const post = mockBlogPosts.find((p) => p.id === id);

  useEffect(() => {
    if (!post) return;

    // Simulate view increment (in production, this would be an API call)
    // For now, we'll just track it locally
  }, [post]);

  const handleShare = async () => {
    if (!post) return;

    try {
      const result = await Share.share({
        message: `Check out this article: ${post.title}\n${post.excerpt}`,
        title: post.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // In production, this would make an API call to save/unsave the favorite
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPercentage = (contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100;
    setReadingProgress(Math.min(100, Math.max(0, scrollPercentage)));
  };

  if (!post) {
    return (
      <View style={{ flex: 1, backgroundColor: "#232323", justifyContent: "center", alignItems: "center" }}>
        <StatusBar style="light" />
        <MaterialIcons name="article" size={48} color="rgba(186, 153, 136, 0.5)" />
        <Text style={{ fontSize: 18, color: "rgba(255, 255, 255, 0.7)", marginTop: 16 }}>
          Blog post not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 24,
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: "#ba9988",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const relatedPosts = post.relatedPosts
    ? mockBlogPosts.filter((p) => post.relatedPosts?.includes(p.id))
    : [];

  // Get previous and next posts
  const currentIndex = mockBlogPosts.findIndex((p) => p.id === id);
  const previousPost = currentIndex > 0 ? mockBlogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < mockBlogPosts.length - 1 ? mockBlogPosts[currentIndex + 1] : null;

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />

      {/* Reading Progress Bar */}
      {readingProgress > 0 && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: "rgba(186, 153, 136, 0.2)",
            zIndex: 1000,
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${readingProgress}%`,
              backgroundColor: "#ba9988",
            }}
          />
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#ba9988" />
          <Text style={{ fontSize: 16, color: "#ba9988", fontWeight: "600" }}>Back to Blog</Text>
        </TouchableOpacity>

        {/* Hero Section */}
        <View style={{ marginBottom: 40 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(186, 153, 136, 0.15)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#ba9988",
                  textTransform: "capitalize",
                }}
              >
                {post.category}
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)" }}>
              {formatDate(post.publishedAt)}
            </Text>
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.4)", fontStyle: "italic" }}>
                Updated {formatDate(post.updatedAt)}
              </Text>
            )}
          </View>

          <Text
            style={{
              fontSize: isMobile ? 28 : 40,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
              lineHeight: isMobile ? 36 : 48,
            }}
          >
            {post.title}
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 28,
              marginBottom: 32,
            }}
          >
            {post.excerpt}
          </Text>

          {/* Author & Meta Info */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              paddingBottom: 24,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            {/* Author */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {post.author.avatar ? (
                <Image
                  source={{ uri: post.author.avatar }}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "#474747",
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "#ba9988",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>
                    {post.author.name.charAt(0)}
                  </Text>
                </View>
              )}
              <Text style={{ fontSize: 14, fontWeight: "600", color: "rgba(255, 255, 255, 0.9)" }}>
                {post.author.name}
              </Text>
            </View>

            {/* Divider */}
            <View
              style={{
                width: 1,
                height: 16,
                backgroundColor: "rgba(186, 153, 136, 0.2)",
              }}
            />

            {/* Read Time */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <MaterialIcons name="schedule" size={14} color="rgba(255, 255, 255, 0.5)" />
              <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.6)" }}>
                {post.readTime} min read
              </Text>
            </View>

            {/* Views */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <MaterialIcons name="visibility" size={14} color="rgba(255, 255, 255, 0.5)" />
              <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.6)" }}>
                {post.views} views
              </Text>
            </View>

            {/* Divider */}
            <View
              style={{
                width: 1,
                height: 16,
                backgroundColor: "rgba(186, 153, 136, 0.2)",
              }}
            />

            {/* Favorite */}
            <TouchableOpacity
              onPress={handleFavorite}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <MaterialIcons
                name={isFavorited ? "favorite" : "favorite-border"}
                size={16}
                color={isFavorited ? "#ff4444" : "rgba(255, 255, 255, 0.5)"}
              />
            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity
              onPress={handleShare}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <MaterialIcons name="share" size={16} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Image */}
        {post.featuredImage && (
          <View
            style={{
              width: "100%",
              maxWidth: 1000,
              alignSelf: "center",
              marginBottom: 48,
            }}
          >
            <Image
              source={{ uri: post.featuredImage }}
              style={{
                width: "100%",
                height: isMobile ? 250 : 450,
                borderRadius: 16,
                backgroundColor: "#474747",
              }}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          </View>
        )}

        {/* Content */}
        <View style={{ maxWidth: 800, alignSelf: "center", width: "100%", marginBottom: 48 }}>
          {post.contentBlocks && post.contentBlocks.length > 0 ? (
            <RichContentRenderer blocks={post.contentBlocks} />
          ) : (
            <Text
              style={{
                fontSize: 16,
                lineHeight: 28,
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              {post.content}
            </Text>
          )}
        </View>

        {/* Tags */}
        {post.tags.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 48,
              paddingTop: 32,
              borderTopWidth: 1,
              borderTopColor: "rgba(186, 153, 136, 0.2)",
              maxWidth: 800,
              alignSelf: "center",
              width: "100%",
            }}
          >
            {post.tags.map((tag, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 12, color: "#ba9988", fontWeight: "600" }}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Author Profile */}
        <View
          style={{
            maxWidth: 800,
            alignSelf: "center",
            width: "100%",
            marginTop: 48,
            paddingTop: 32,
            borderTopWidth: 1,
            borderTopColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: 20,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            {post.author.avatar ? (
              <Image
                source={{ uri: post.author.avatar }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#232323",
                }}
              />
            ) : (
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#ba9988",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 32, fontWeight: "700", color: "#ffffff" }}>
                  {post.author.name.charAt(0)}
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                {post.author.name}
              </Text>
              {post.author.bio && (
                <Text
                  style={{
                    fontSize: 15,
                    lineHeight: 24,
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {post.author.bio}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Previous/Next Navigation */}
        <View
          style={{
            maxWidth: 800,
            alignSelf: "center",
            width: "100%",
            marginTop: 48,
            paddingTop: 32,
            borderTopWidth: 1,
            borderTopColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: 16,
            }}
          >
            {/* Previous Post */}
            {previousPost && (
              <TouchableOpacity
                onPress={() => router.push(`/pages/university/blog/${previousPost.id}`)}
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#ba9988" />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.5)",
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Previous Post
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                    numberOfLines={2}
                  >
                    {previousPost.title}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Next Post */}
            {nextPost && (
              <TouchableOpacity
                onPress={() => router.push(`/pages/university/blog/${nextPost.id}`)}
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.5)",
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Next Post
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                      textAlign: "right",
                    }}
                    numberOfLines={2}
                  >
                    {nextPost.title}
                  </Text>
                </View>
                <MaterialIcons name="arrow-forward" size={24} color="#ba9988" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <View
            style={{
              marginTop: 64,
              maxWidth: 800,
              alignSelf: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 24,
              }}
            >
              Related Posts
            </Text>
            <View style={{ gap: 16 }}>
              {relatedPosts.map((relatedPost) => (
                <TouchableOpacity
                  key={relatedPost.id}
                  onPress={() => router.push(`/pages/university/blog/${relatedPost.id}`)}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "600",
                          color: "#ba9988",
                          textTransform: "capitalize",
                        }}
                      >
                        {relatedPost.category}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)" }}>
                      {formatDate(relatedPost.publishedAt)}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    {relatedPost.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 12,
                    }}
                  >
                    {relatedPost.excerpt}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <Text style={{ fontSize: 14, color: "#ba9988", fontWeight: "600" }}>
                      Read More →
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <MaterialIcons name="schedule" size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)" }}>
                        {relatedPost.readTime} min
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

