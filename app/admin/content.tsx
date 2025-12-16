import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { ContentManagementItem } from "../../types/admin";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { FilterDropdown } from "../../components/admin/FilterDropdown";
import { AdminDataCard } from "../../components/admin/AdminDataCard";
import { AdminModal } from "../../components/admin/AdminModal";
import { Pagination } from "../../components/admin/Pagination";
import { useResponsive } from "../../hooks/useResponsive";
import { colors, spacing, typography, borderRadius } from "../../constants/theme";

interface CarouselItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  link?: string;
  linkText?: string;
  displayOrder: number;
  isActive: boolean;
}

// Mock content items
const mockContent: ContentManagementItem[] = [
  {
    id: "1",
    type: "blog",
    title: "BDN Launches New Features",
    status: "published",
    author: "BDN Team",
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
    views: 1250,
  },
  {
    id: "2",
    type: "video",
    title: "Welcome to BDN",
    status: "published",
    author: "BDN Team",
    createdAt: "2024-02-10T14:00:00Z",
    updatedAt: "2024-02-10T14:00:00Z",
    views: 890,
  },
  {
    id: "3",
    type: "dynamic",
    title: "New Feature Banner",
    status: "draft",
    author: "Admin User",
    createdAt: "2024-02-20T09:00:00Z",
    updatedAt: "2024-02-20T09:00:00Z",
  },
];

// Mock carousel items
const mockCarouselItems: CarouselItem[] = [
  {
    id: "carousel-1",
    imageUrl: "https://via.placeholder.com/800x200/474747/ba9988?text=BDN+News+%26+Updates",
    title: "New Feature: Enhanced Business Discovery",
    description: "Discover local Black-owned businesses with our improved search",
    link: "/pages/search",
    linkText: "Explore Now",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "carousel-2",
    imageUrl: "https://via.placeholder.com/800x200/474747/ba9988?text=Community+Spotlight",
    title: "Community Spotlight",
    description: "Celebrating Black excellence in entrepreneurship",
    link: "/pages/media",
    linkText: "Watch Now",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "carousel-3",
    imageUrl: "https://via.placeholder.com/800x200/474747/ba9988?text=BDN+University",
    title: "Learn & Grow with BDN University",
    description: "Master the platform and unlock your potential",
    link: "/pages/university",
    linkText: "Start Learning",
    displayOrder: 3,
    isActive: true,
  },
];

export default function ContentManagement() {
  const { isMobile, paddingHorizontal } = useResponsive();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"content" | "carousel">("content");
  const [content, setContent] = useState<ContentManagementItem[]>(mockContent);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>(mockCarouselItems);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentManagementItem | null>(null);
  const [selectedCarouselItem, setSelectedCarouselItem] = useState<CarouselItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [contentForm, setContentForm] = useState({
    type: "blog" as "blog" | "video" | "dynamic",
    title: "",
    content: "",
    author: "",
    status: "draft" as "published" | "draft" | "archived",
    videoUrl: "",
    imageUrl: "",
  });

  const [carouselForm, setCarouselForm] = useState({
    imageUrl: "",
    title: "",
    description: "",
    link: "",
    linkText: "",
    displayOrder: 1,
    isActive: true,
  });

  const filteredContent = content.filter((item) => {
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  // Pagination for content tab
  const contentTotalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const contentStartIndex = (currentPage - 1) * itemsPerPage;
  const contentEndIndex = contentStartIndex + itemsPerPage;
  const paginatedContent = filteredContent.slice(contentStartIndex, contentEndIndex);

  // Pagination for carousel tab
  const sortedCarouselItems = [...carouselItems].sort((a, b) => a.displayOrder - b.displayOrder);
  const carouselTotalPages = Math.ceil(sortedCarouselItems.length / itemsPerPage);
  const carouselStartIndex = (currentPage - 1) * itemsPerPage;
  const carouselEndIndex = carouselStartIndex + itemsPerPage;
  const paginatedCarouselItems = sortedCarouselItems.slice(carouselStartIndex, carouselEndIndex);

  // Reset to page 1 when filters or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, selectedStatus, activeTab]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blog":
        return "article";
      case "video":
        return "video-library";
      case "channel":
        return "subscriptions";
      case "dynamic":
        return "dynamic-feed";
      default:
        return "article";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "#4caf50";
      case "draft":
        return "#ffd700";
      case "archived":
        return "rgba(255, 255, 255, 0.5)";
      default:
        return "rgba(255, 255, 255, 0.5)";
    }
  };

  const handleCreateContent = () => {
    setIsEditing(false);
    setContentForm({
      type: "blog",
      title: "",
      content: "",
      author: "Admin User",
      status: "draft",
      videoUrl: "",
      imageUrl: "",
    });
    setShowContentModal(true);
  };

  const handleEditContent = (item: ContentManagementItem) => {
    setIsEditing(true);
    setSelectedContent(item);
    setContentForm({
      type: item.type as any,
      title: item.title,
      content: "",
      author: item.author,
      status: item.status as any,
      videoUrl: "",
      imageUrl: "",
    });
    setShowContentModal(true);
  };

  const handleSaveContent = () => {
    if (!contentForm.title || !contentForm.author) {
      alert("Please fill in required fields");
      return;
    }
    // TODO: Save via API
    if (isEditing && selectedContent) {
      setContent(content.map(c => c.id === selectedContent.id ? { ...c, ...contentForm, updatedAt: new Date().toISOString() } : c));
      alert("Content updated successfully");
    } else {
      const newContent: ContentManagementItem = {
        id: `content-${Date.now()}`,
        type: contentForm.type,
        title: contentForm.title,
        status: contentForm.status,
        author: contentForm.author,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
      };
      setContent([...content, newContent]);
      alert("Content created successfully");
    }
    setShowContentModal(false);
    setSelectedContent(null);
    setIsEditing(false);
  };

  const handleDeleteContent = () => {
    if (!selectedContent) return;
    // TODO: Delete via API
    setContent(content.filter(c => c.id !== selectedContent.id));
    setShowDeleteModal(false);
    setSelectedContent(null);
    alert("Content deleted successfully");
  };

  const handleCreateCarousel = () => {
    setIsEditing(false);
    setCarouselForm({
      imageUrl: "",
      title: "",
      description: "",
      link: "",
      linkText: "",
      displayOrder: carouselItems.length + 1,
      isActive: true,
    });
    setShowCarouselModal(true);
  };

  const handleEditCarousel = (item: CarouselItem) => {
    setIsEditing(true);
    setSelectedCarouselItem(item);
    setCarouselForm({
      imageUrl: item.imageUrl,
      title: item.title || "",
      description: item.description || "",
      link: item.link || "",
      linkText: item.linkText || "",
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setShowCarouselModal(true);
  };

  const handleSaveCarousel = () => {
    if (!carouselForm.imageUrl) {
      alert("Please provide an image URL");
      return;
    }
    // TODO: Save via API
    if (isEditing && selectedCarouselItem) {
      setCarouselItems(carouselItems.map(c => c.id === selectedCarouselItem.id ? { ...c, ...carouselForm } : c));
      alert("Carousel item updated successfully");
    } else {
      const newItem: CarouselItem = {
        id: `carousel-${Date.now()}`,
        ...carouselForm,
      };
      setCarouselItems([...carouselItems, newItem].sort((a, b) => a.displayOrder - b.displayOrder));
      alert("Carousel item created successfully");
    }
    setShowCarouselModal(false);
    setSelectedCarouselItem(null);
    setIsEditing(false);
  };

  const handleDeleteCarousel = (item: CarouselItem) => {
    // TODO: Delete via API
    setCarouselItems(carouselItems.filter(c => c.id !== item.id));
    alert("Carousel item deleted successfully");
  };

  const handleToggleCarouselActive = (item: CarouselItem) => {
    // TODO: Update via API
    setCarouselItems(carouselItems.map(c => c.id === item.id ? { ...c, isActive: !c.isActive } : c));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: Platform.OS === "web" ? spacing["2xl"] : spacing["2xl"] + 16,
          paddingBottom: spacing["4xl"],
        }}
      >
        {/* Header */}
        <AdminPageHeader
          title="Content Management"
          description="Manage blog posts, videos, dynamic content, and dashboard carousel items."
        />

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#474747",
            borderRadius: 12,
            padding: 4,
            marginBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("content")}
            style={{
              flex: 1,
              backgroundColor: activeTab === "content" ? "#ba9988" : "transparent",
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: activeTab === "content" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              Content
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("carousel")}
            style={{
              flex: 1,
              backgroundColor: activeTab === "carousel" ? "#ba9988" : "transparent",
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: activeTab === "carousel" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              Carousel
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "content" ? (
          <>
            {/* Content Actions */}
            <View style={{ marginBottom: 24 }}>
              <TouchableOpacity
                onPress={handleCreateContent}
                style={{
                  backgroundColor: "#ba9988",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <MaterialIcons name="add" size={20} color="#ffffff" />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Create Content
                </Text>
              </TouchableOpacity>
            </View>

            {/* Filters */}
            <View style={{ marginBottom: spacing["2xl"], gap: spacing.md }}>
              {/* Filter Dropdowns */}
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: spacing.md,
                }}
              >
                <FilterDropdown
                  label="Type"
                  options={[
                    { value: "", label: "All Types" },
                    { value: "blog", label: "Blog" },
                    { value: "video", label: "Video" },
                    { value: "dynamic", label: "Dynamic" },
                  ]}
                  value={selectedType === "all" ? "" : selectedType}
                  onSelect={(value) => setSelectedType(value === "" ? "all" : value)}
                />
                <FilterDropdown
                  label="Status"
                  options={[
                    { value: "", label: "All Status" },
                    { value: "published", label: "Published" },
                    { value: "draft", label: "Draft" },
                    { value: "archived", label: "Archived" },
                  ]}
                  value={selectedStatus === "all" ? "" : selectedStatus}
                  onSelect={(value) => setSelectedStatus(value === "" ? "all" : value)}
                />
              </View>
            </View>

            {/* Content List */}
            {filteredContent.length > 0 ? (
              <View style={{ gap: spacing.md }}>
                {paginatedContent.map((item) => {
                  const statusColor = getStatusColor(item.status);
                  const actions: Array<{
                    label: string;
                    icon: keyof typeof MaterialIcons.glyphMap;
                    onPress: () => void;
                    variant: "primary" | "secondary" | "danger" | "info";
                  }> = [
                    {
                      label: "Edit",
                      icon: "edit",
                      onPress: () => handleEditContent(item),
                      variant: "secondary",
                    },
                    {
                      label: "Delete",
                      icon: "delete",
                      onPress: () => {
                        setSelectedContent(item);
                        setShowDeleteModal(true);
                      },
                      variant: "danger",
                    },
                    ...(item.status === "draft"
                      ? [
                          {
                            label: "Publish",
                            icon: "publish" as keyof typeof MaterialIcons.glyphMap,
                            onPress: () => {
                              setContent(content.map(c => c.id === item.id ? { ...c, status: "published" } : c));
                              alert("Content published");
                            },
                            variant: "primary" as const,
                          },
                        ]
                      : []),
                  ];

                  return (
                    <AdminDataCard
                      key={item.id}
                      title={item.title}
                      subtitle={`By ${item.author}${item.views ? ` • ${item.views.toLocaleString()} views` : ""}`}
                      badges={[
                        {
                          label: item.type,
                          color: colors.accent,
                          backgroundColor: colors.accentLight,
                        },
                        {
                          label: item.status,
                          color: statusColor,
                          backgroundColor: `${statusColor}20`,
                        },
                      ]}
                      actions={actions}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md }}>
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: colors.primary.bg,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MaterialIcons name={getTypeIcon(item.type) as any} size={20} color={colors.accent} />
                        </View>
                      </View>
                    </AdminDataCard>
                  );
                })}
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: colors.secondary.bg,
                  borderRadius: borderRadius.lg,
                  padding: spacing["4xl"],
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border.light,
                }}
              >
                <MaterialIcons name="article" size={48} color={colors.accentLight} />
                <Text
                  style={{
                    fontSize: typography.fontSize.lg,
                    color: colors.text.tertiary,
                    textAlign: "center",
                    marginTop: spacing.lg,
                  }}
                >
                  No content found
                </Text>
              </View>
            )}

            {/* Pagination */}
            {filteredContent.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={contentTotalPages}
                totalItems={filteredContent.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <>
            {/* Carousel Actions */}
            <View style={{ marginBottom: 24 }}>
              <TouchableOpacity
                onPress={handleCreateCarousel}
                style={{
                  backgroundColor: "#ba9988",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <MaterialIcons name="add" size={20} color="#ffffff" />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Add Carousel Item
                </Text>
              </TouchableOpacity>
            </View>

            {/* Carousel List */}
            {carouselItems.length > 0 ? (
              <View style={{ gap: 12 }}>
                {paginatedCarouselItems.map((item) => (
                    <View
                      key={item.id}
                      style={{
                        backgroundColor: "#474747",
                        borderRadius: 16,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: item.isActive ? "rgba(76, 175, 80, 0.3)" : "rgba(186, 153, 136, 0.2)",
                        opacity: item.isActive ? 1 : 0.6,
                      }}
                    >
                      <View style={{ flexDirection: "row", gap: 12 }}>
                        <View
                          style={{
                            width: 120,
                            height: 80,
                            borderRadius: 12,
                            backgroundColor: "#232323",
                            overflow: "hidden",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              color: "rgba(255, 255, 255, 0.5)",
                              textAlign: "center",
                              padding: 8,
                            }}
                          >
                            Image Preview
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "700",
                                color: "#ffffff",
                              }}
                            >
                              {item.title || "Untitled"}
                            </Text>
                            <View
                              style={{
                                backgroundColor: item.isActive ? "rgba(76, 175, 80, 0.2)" : "rgba(255, 255, 255, 0.1)",
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 8,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 10,
                                  fontWeight: "600",
                                  color: item.isActive ? "#4caf50" : "rgba(255, 255, 255, 0.5)",
                                  textTransform: "uppercase",
                                }}
                              >
                                {item.isActive ? "Active" : "Inactive"}
                              </Text>
                            </View>
                          </View>
                          {item.description && (
                            <Text
                              style={{
                                fontSize: 12,
                                color: "rgba(255, 255, 255, 0.7)",
                                marginBottom: 8,
                              }}
                            >
                              {item.description}
                            </Text>
                          )}
                          <Text
                            style={{
                              fontSize: 11,
                              color: "rgba(255, 255, 255, 0.5)",
                              marginBottom: 12,
                            }}
                          >
                            Order: {item.displayOrder} • Link: {item.link || "None"}
                          </Text>
                          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                            <TouchableOpacity
                              onPress={() => handleEditCarousel(item)}
                              style={{
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: 8,
                                backgroundColor: "#232323",
                                borderWidth: 1,
                                borderColor: "rgba(186, 153, 136, 0.2)",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: "600",
                                  color: "#ba9988",
                                }}
                              >
                                Edit
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleToggleCarouselActive(item)}
                              style={{
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: 8,
                                backgroundColor: item.isActive ? "rgba(255, 68, 68, 0.2)" : "rgba(76, 175, 80, 0.2)",
                                borderWidth: 1,
                                borderColor: item.isActive ? "#ff4444" : "#4caf50",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: "600",
                                  color: item.isActive ? "#ff4444" : "#4caf50",
                                }}
                              >
                                {item.isActive ? "Deactivate" : "Activate"}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteCarousel(item)}
                              style={{
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: 8,
                                backgroundColor: "rgba(255, 68, 68, 0.2)",
                                borderWidth: 1,
                                borderColor: "#ff4444",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: "600",
                                  color: "#ff4444",
                                }}
                              >
                                Delete
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 40,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <MaterialIcons name="view-carousel" size={48} color="rgba(186, 153, 136, 0.5)" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "rgba(255, 255, 255, 0.6)",
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  No carousel items found
                </Text>
              </View>
            )}

            {/* Pagination */}
            {sortedCarouselItems.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={carouselTotalPages}
                totalItems={sortedCarouselItems.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        {/* Create/Edit Content Modal */}
        <AdminModal
          visible={showContentModal}
          onClose={() => {
            setShowContentModal(false);
            setSelectedContent(null);
            setIsEditing(false);
          }}
          title={isEditing ? "Edit Content" : "Create Content"}
          actions={[
            {
              label: "Cancel",
              onPress: () => {
                setShowContentModal(false);
                setSelectedContent(null);
                setIsEditing(false);
              },
              variant: "secondary",
            },
            {
              label: "Save",
              onPress: handleSaveContent,
              variant: "primary",
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ gap: spacing.lg }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Type</Text>
                  <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    {(["blog", "video", "dynamic"] as const).map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setContentForm({ ...contentForm, type })}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: contentForm.type === type ? "#ba9988" : "#232323",
                          borderWidth: 1,
                          borderColor: contentForm.type === type ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: contentForm.type === type ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                            textTransform: "capitalize",
                          }}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Title *</Text>
                  <TextInput
                    value={contentForm.title}
                    onChangeText={(text) => setContentForm({ ...contentForm, title: text })}
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                {contentForm.type === "blog" && (
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Content</Text>
                    <TextInput
                      value={contentForm.content}
                      onChangeText={(text) => setContentForm({ ...contentForm, content: text })}
                      multiline
                      numberOfLines={10}
                      style={{
                        backgroundColor: "#232323",
                        borderRadius: 12,
                        padding: 14,
                        color: "#ffffff",
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                        textAlignVertical: "top",
                      }}
                    />
                  </View>
                )}

                {contentForm.type === "video" && (
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Video URL</Text>
                    <TextInput
                      value={contentForm.videoUrl}
                      onChangeText={(text) => setContentForm({ ...contentForm, videoUrl: text })}
                      keyboardType="url"
                      style={{
                        backgroundColor: "#232323",
                        borderRadius: 12,
                        padding: 14,
                        color: "#ffffff",
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>
                )}

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Author *</Text>
                  <TextInput
                    value={contentForm.author}
                    onChangeText={(text) => setContentForm({ ...contentForm, author: text })}
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Status</Text>
                  <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    {(["published", "draft", "archived"] as const).map((status) => (
                      <TouchableOpacity
                        key={status}
                        onPress={() => setContentForm({ ...contentForm, status })}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: contentForm.status === status ? "#ba9988" : "#232323",
                          borderWidth: 1,
                          borderColor: contentForm.status === status ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: contentForm.status === status ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                            textTransform: "capitalize",
                          }}
                        >
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
            </View>
          </ScrollView>
        </AdminModal>

        {/* Create/Edit Carousel Modal */}
        <AdminModal
          visible={showCarouselModal}
          onClose={() => {
            setShowCarouselModal(false);
            setSelectedCarouselItem(null);
            setIsEditing(false);
          }}
          title={isEditing ? "Edit Carousel Item" : "Create Carousel Item"}
          actions={[
            {
              label: "Cancel",
              onPress: () => {
                setShowCarouselModal(false);
                setSelectedCarouselItem(null);
                setIsEditing(false);
              },
              variant: "secondary",
            },
            {
              label: "Save",
              onPress: handleSaveCarousel,
              variant: "primary",
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ gap: spacing.lg }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Image URL *</Text>
                  <TextInput
                    value={carouselForm.imageUrl}
                    onChangeText={(text) => setCarouselForm({ ...carouselForm, imageUrl: text })}
                    keyboardType="url"
                    placeholder="https://example.com/image.jpg"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Title</Text>
                  <TextInput
                    value={carouselForm.title}
                    onChangeText={(text) => setCarouselForm({ ...carouselForm, title: text })}
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Description</Text>
                  <TextInput
                    value={carouselForm.description}
                    onChangeText={(text) => setCarouselForm({ ...carouselForm, description: text })}
                    multiline
                    numberOfLines={4}
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                      textAlignVertical: "top",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Link</Text>
                  <TextInput
                    value={carouselForm.link}
                    onChangeText={(text) => setCarouselForm({ ...carouselForm, link: text })}
                    placeholder="/pages/search"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Link Text</Text>
                  <TextInput
                    value={carouselForm.linkText}
                    onChangeText={(text) => setCarouselForm({ ...carouselForm, linkText: text })}
                    placeholder="Explore Now"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Display Order</Text>
                  <TextInput
                    value={carouselForm.displayOrder.toString()}
                    onChangeText={(text) => {
                      const num = parseInt(text) || 1;
                      setCarouselForm({ ...carouselForm, displayOrder: num });
                    }}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Active</Text>
                  <TouchableOpacity
                    onPress={() => setCarouselForm({ ...carouselForm, isActive: !carouselForm.isActive })}
                    style={{
                      width: 50,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: carouselForm.isActive ? "#4caf50" : "#474747",
                      justifyContent: "center",
                      paddingHorizontal: 4,
                    }}
                  >
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "#ffffff",
                        transform: [{ translateX: carouselForm.isActive ? 20 : 0 }],
                      }}
                    />
                  </TouchableOpacity>
                </View>
            </View>
          </ScrollView>
        </AdminModal>

        {/* Delete Confirmation Modal */}
        <AdminModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Content"
          maxWidth={400}
          actions={[
            {
              label: "Cancel",
              onPress: () => setShowDeleteModal(false),
              variant: "secondary",
            },
            {
              label: "Delete",
              onPress: handleDeleteContent,
              variant: "danger",
            },
          ]}
        >
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              color: colors.text.secondary,
            }}
          >
            Are you sure you want to delete "{selectedContent?.title}"? This action cannot be undone.
          </Text>
        </AdminModal>
      </ScrollView>
    </View>
  );
}
