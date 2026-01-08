import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { ContentManagementItem, CarouselItem } from '@/types/admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FilterDropdown } from '@/components/admin/FilterDropdown';
import { AdminModal } from '@/components/admin/AdminModal';
import { Pagination } from '@/components/admin/Pagination';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { ContentList } from '@/components/admin/content/ContentList';
import { CarouselList } from '@/components/admin/content/CarouselList';
import { ContentModal } from '@/components/admin/content/ContentModal';
import { CarouselModal } from '@/components/admin/content/CarouselModal';

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
      content: item.content || "",
      author: item.author,
      status: item.status as any,
      videoUrl: item.videoUrl || "",
      imageUrl: item.imageUrl || "",
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
        content: contentForm.content,
        status: contentForm.status,
        author: contentForm.author,
        videoUrl: contentForm.videoUrl,
        imageUrl: contentForm.imageUrl,
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
              <ContentList
                content={paginatedContent}
                onEdit={handleEditContent}
                onDelete={(item) => {
                  setSelectedContent(item);
                  setShowDeleteModal(true);
                }}
                onPublish={(item) => {
                  setContent(content.map(c => c.id === item.id ? { ...c, status: "published" } : c));
                  alert("Content published");
                }}
                getTypeIcon={getTypeIcon}
                getStatusColor={getStatusColor}
              />
            ) : (
              <View
                style={{
                  backgroundColor: colors.input,
                  borderRadius: borderRadius.lg,
                  padding: spacing["4xl"],
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <MaterialIcons name="article" size={48} color={colors.accent} />
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
              <CarouselList
                items={paginatedCarouselItems}
                onEdit={handleEditCarousel}
                onDelete={handleDeleteCarousel}
                onToggleActive={handleToggleCarouselActive}
              />
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
        <ContentModal
          visible={showContentModal}
          onClose={() => {
            setShowContentModal(false);
            setSelectedContent(null);
            setIsEditing(false);
          }}
          isEditing={isEditing}
          onSave={handleSaveContent}
          form={contentForm}
          setForm={setContentForm}
        />

        {/* Create/Edit Carousel Modal */}
        <CarouselModal
          visible={showCarouselModal}
          onClose={() => {
            setShowCarouselModal(false);
            setSelectedCarouselItem(null);
            setIsEditing(false);
          }}
          isEditing={isEditing}
          onSave={handleSaveCarousel}
          form={carouselForm}
          setForm={setCarouselForm}
        />

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
