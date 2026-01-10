import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { copyToClipboard } from '@/lib/clipboard';
import { showSuccessToast } from '@/lib/toast';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

interface WebShareModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  url?: string;
  title?: string;
}

interface ShareOption {
  id: string;
  label: string;
  icon: string;
  color: string;
  backgroundColor?: string;
  onPress: () => void;
}

export const WebShareModal: React.FC<WebShareModalProps> = ({
  visible,
  onClose,
  message,
  url,
  title,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const fullText = url ? `${message}\n\n${url}` : message;
  
  // Animation values
  const translateY = useSharedValue(1000);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 300,
      });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(1000, {
        duration: 250,
      });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const handleCopy = async () => {
    const success = await copyToClipboard(fullText);
    if (success) {
      showSuccessToast('Link copied to clipboard!');
      onClose();
    }
  };

  const handleEmail = () => {
    const subject = title || 'Check this out';
    const body = encodeURIComponent(fullText);
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = mailtoLink;
      onClose();
    }
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(message);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}${url ? `&url=${encodeURIComponent(url)}` : ''}`;
    
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  const handleFacebook = () => {
    if (url && Platform.OS === 'web' && typeof window !== 'undefined') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  const handleLinkedIn = () => {
    if (url && Platform.OS === 'web' && typeof window !== 'undefined') {
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(fullText);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  const handleTelegram = () => {
    const text = encodeURIComponent(fullText);
    const telegramUrl = `https://t.me/share/url?url=${url ? encodeURIComponent(url) : ''}&text=${text}`;
    
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  const shareOptions: ShareOption[] = [
    {
      id: 'copy',
      label: 'Copy Link',
      icon: 'content-copy',
      color: '#ffffff',
      backgroundColor: '#ba9988',
      onPress: handleCopy,
    },
    {
      id: 'email',
      label: 'Email',
      icon: 'email',
      color: '#ffffff',
      backgroundColor: '#6b6b7c',
      onPress: handleEmail,
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: 'share',
      color: '#ffffff',
      backgroundColor: '#1DA1F2',
      onPress: handleTwitter,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: 'share',
      color: '#ffffff',
      backgroundColor: '#1877F2',
      onPress: handleFacebook,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: 'share',
      color: '#ffffff',
      backgroundColor: '#0077B5',
      onPress: handleLinkedIn,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: 'share',
      color: '#ffffff',
      backgroundColor: '#25D366',
      onPress: handleWhatsApp,
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: 'send',
      color: '#ffffff',
      backgroundColor: '#0088cc',
      onPress: handleTelegram,
    },
  ].filter(option => {
    // Only show Facebook, LinkedIn, WhatsApp, Telegram if URL is available
    if (['facebook', 'linkedin', 'whatsapp', 'telegram'].includes(option.id) && !url) {
      return false;
    }
    return true;
  });

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
    ],
  }));

  const isMobile = width < 768;
  const itemsPerRow = isMobile ? 4 : 6;
  const iconSize = isMobile ? 56 : 64;
  const iconContainerSize = isMobile ? 80 : 90;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'flex-end',
          },
          overlayStyle,
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            {
              backgroundColor: '#474747',
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
              paddingTop: spacing.md,
              paddingBottom: Math.max(insets.bottom, spacing.lg),
              paddingHorizontal: spacing.lg,
              maxHeight: '85%',
              borderWidth: 1,
              borderColor: 'rgba(186, 153, 136, 0.2)',
              borderBottomWidth: 0,
            },
            sheetStyle,
          ]}
        >
          {/* Drag Handle */}
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: spacing.md,
            }}
          />

          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {title || 'Share'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name="close" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Preview Section */}
          {(message || url) && (
            <View
              style={{
                backgroundColor: '#232323',
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginBottom: spacing.lg,
                borderWidth: 1,
                borderColor: 'rgba(186, 153, 136, 0.2)',
              }}
            >
              {message && (
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                    marginBottom: url ? spacing.xs : 0,
                    lineHeight: 20,
                  }}
                  numberOfLines={2}
                >
                  {message}
                </Text>
              )}
              {url && (
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: '#ba9988',
                    fontFamily: 'monospace',
                  }}
                  numberOfLines={1}
                >
                  {url}
                </Text>
              )}
            </View>
          )}

          {/* Share Options Grid */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              marginBottom: spacing.lg,
              gap: spacing.md,
            }}
          >
            {shareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={option.onPress}
                activeOpacity={0.7}
                style={{
                  width: iconContainerSize,
                  alignItems: 'center',
                  marginBottom: spacing.md,
                }}
              >
                <View
                  style={{
                    width: iconSize,
                    height: iconSize,
                    borderRadius: iconSize / 2,
                    backgroundColor: option.backgroundColor || '#ba9988',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: spacing.xs,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <MaterialIcons
                    name={option.icon}
                    size={iconSize * 0.5}
                    color={option.color}
                  />
                </View>
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.text.primary,
                    textAlign: 'center',
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={{
              backgroundColor: '#232323',
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(186, 153, 136, 0.2)',
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: '#ba9988',
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
