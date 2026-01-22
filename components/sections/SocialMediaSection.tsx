import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Linking } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";
import Svg, { Path } from "react-native-svg";

const NOTABLE_FOLLOWERS = [
  [
    "Alicia Keys | Music Artist",
    "N.O.R.E. | Hip Hop Artist",
    "Stephen Jackson | NBA",
    "Rick Ross | Hip Hop Artist",
    "Deion Sanders | NFL/MLB",
    "Chris Webber | NBA",
    "Eddie Griffin | Actor",
    "Calvin Roberson | Author",
    "Isiah Thomas | NBA",
  ],
  [
    "David & Tamela | Music Artists",
    "Uzo Aduba | Actress",
    "Katrina Taylor | Hip Hop Artist",
    "Stephen Boss | Hip Hop Artist",
    "Shaunie Oneal | Entrepreneur",
    "Larenz Tate | Actor",
    "Supa | CEO",
    "Missy Elliot | Music Artist",
    "Rajon Rondo | NBA",
  ],
  [
    "Ashanti | Music Artist",
    "Mike Rashid | Boxer",
    "Ava DuVernay | Director",
    "Mo'niqe | Comedian",
    "Nandi Madida | Actress",
    "Toolz | Entrepreneur",
    "Samuel L Jackson | Actor",
    "Hill Harper | Actor",
    "Jesseca Dupart | Entrepreneur",
  ],
];

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/blackdollarnetwork2.0",
    icon: (
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <Path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      </Svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://facebook.com/blackdollarnetwork",
    icon: (
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </Svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@blackdollarnetwork",
    icon: (
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <Path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </Svg>
    ),
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@blackdollarnetwork",
    icon: (
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <Path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </Svg>
    ),
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/blackdollarntwk",
    icon: (
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <Path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </Svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/company/blackdollarnetwork",
    icon: (
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <Path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </Svg>
    ),
  },
];

export const SocialMediaSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const handleSocialLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollAnimatedView delay={800}>
      <View
        style={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
          backgroundColor: "#232323",
        }}
      >
        <View
          style={{
            maxWidth: 1200,
            alignSelf: "center",
            width: "100%",
          }}
        >
          {/* Section Headers */}
          <View
            style={{
              marginBottom: isMobile ? 40 : 48,
              alignItems: "center",
            }}
          >
            {/* Badge */}
            <View
              style={{
                backgroundColor: "rgba(186, 153, 136, 0.15)",
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#ba9988",
                  letterSpacing: 1,
                }}
              >
                NOTABLE FOLLOWERS
              </Text>
            </View>
            <Text
              style={{
                fontSize: isMobile ? 32 : 44,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 8,
                textAlign: "center",
                letterSpacing: -0.5,
              }}
            >
              SOCIAL MEDIA
            </Text>
          </View>

          {/* Content Layout */}
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 40 : 0,
              alignItems: isMobile ? "center" : "stretch",
            }}
          >
            {/* Left Sidebar - Social Media Icons + Rotated Text */}
            {!isMobile && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginRight: 40,
                }}
              >
                {/* Social Icons */}
                <View
                  style={{
                    flexDirection: "column",
                    gap: 16,
                    alignItems: "flex-start",
                  }}
                >
                  {SOCIAL_LINKS.slice(0, 5).map((social, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSocialLink(social.url)}
                      activeOpacity={0.7}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        backgroundColor: "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View style={{ opacity: 0.9 }}>
                        {React.cloneElement(social.icon as React.ReactElement<{ fill?: string }>, {
                          fill: "#ba9988",
                        })}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Rotated Subscriber Text */}
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                    height: 280,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: "#ffffff",
                      letterSpacing: 2,
                      transform: [{ rotate: "90deg" }],
                      width: 280,
                      textAlign: "center",
                    }}
                  >
                    NEARLY 400K SUBSCRIBERS
                  </Text>
                </View>
              </View>
            )}

            {/* Mobile: Social Icons */}
            {isMobile && (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 16,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {SOCIAL_LINKS.slice(0, 5).map((social, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSocialLink(social.url)}
                      activeOpacity={0.7}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        backgroundColor: "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View style={{ opacity: 0.9 }}>
                        {React.cloneElement(social.icon as React.ReactElement<{ fill?: string }>, {
                          fill: "#ba9988",
                        })}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Right: Notable Followers Grid */}
            <View style={{ flex: 1, width: "100%" }}>
              {/* Mobile: Subscriber Text */}
              {isMobile && (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 24,
                    textAlign: "center",
                    letterSpacing: 0.5,
                  }}
                >
                  NEARLY 400K SUBSCRIBERS
                </Text>
              )}
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 0 : 24,
                  justifyContent: "space-between",
                }}
              >
                {NOTABLE_FOLLOWERS.map((column, colIndex) => (
                  <View 
                    key={colIndex} 
                    style={{ 
                      flex: 1,
                      gap: 0,
                    }}
                  >
                    {column.map((follower, index) => (
                      <View
                        key={index}
                        style={{
                          paddingVertical: 12,
                          borderBottomWidth: index < column.length - 1 ? 1 : 0,
                          borderBottomColor: "rgba(186, 153, 136, 0.1)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.9)",
                            lineHeight: 20,
                          }}
                        >
                          {follower}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Bottom Text */}
          <View
            style={{
              marginTop: isMobile ? 48 : 64,
              gap: 20,
              maxWidth: 900,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: isMobile ? 15 : 16,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: isMobile ? 24 : 26,
                textAlign: "center",
              }}
            >
              We started by building our social media platform to bring awareness and exposure and truly highlight the beauty of the Black experience.
            </Text>
            <Text
              style={{
                fontSize: isMobile ? 15 : 16,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: isMobile ? 24 : 26,
                textAlign: "center",
              }}
            >
              We understand that it's not the sole responsibility of celebrities to save our community; we all have an important role to play. Above are some awesome individuals who followed us along the way.
            </Text>
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                color: "#ba9988",
                lineHeight: isMobile ? 24 : 28,
                textAlign: "center",
                fontWeight: "600",
                marginTop: 8,
              }}
            >
              Connect with us and join the movement!
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.5)",
                lineHeight: 18,
                textAlign: "center",
                fontStyle: "italic",
                marginTop: 24,
              }}
            >
              Please Note: While we have received endorsements from multiple celebrities, these are not official endorsements for this campaign. They just happened to follow us without any solicitation on our part.
            </Text>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
