import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
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
  icon?: string; // MaterialIcons name
  iconComponent?: React.ReactNode; // SVG icon component
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

  const handleInstagram = () => {
    // Instagram doesn't have a direct share URL, so we'll copy the content for user to paste
    // or open Instagram web
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const instagramUrl = 'https://www.instagram.com/blackdollarnetwork2.0';
      window.open(instagramUrl, '_blank', 'noopener,noreferrer');
      // Also copy the content for easy pasting
      copyToClipboard(fullText);
      showSuccessToast('Content copied! Opening Instagram...');
      onClose();
    }
  };

  const handleBlackTube = async () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Copy content for easy sharing
      await copyToClipboard(fullText);
      const blackTubeUrl = 'https://theblacktube.com/videos/category/996';
      window.open(blackTubeUrl, '_blank', 'noopener,noreferrer');
      showSuccessToast('Content copied! Opening The BlackTube...');
      onClose();
    }
  };

  const handleFanbase = async () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Copy content for easy sharing
      await copyToClipboard(fullText);
      const fanbaseUrl = 'https://fanbase.app/blackdollarnetwork';
      window.open(fanbaseUrl, '_blank', 'noopener,noreferrer');
      showSuccessToast('Content copied! Opening Fanbase...');
      onClose();
    }
  };

  const shareOptions: ShareOption[] = [
    {
      id: 'twitter',
      label: 'Twitter',
      iconComponent: (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <Path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </Svg>
      ),
      color: '#ffffff',
      backgroundColor: '#1DA1F2',
      onPress: handleTwitter,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      iconComponent: (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </Svg>
      ),
      color: '#ffffff',
      backgroundColor: '#1877F2',
      onPress: handleFacebook,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      iconComponent: (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <Path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </Svg>
      ),
      color: '#ffffff',
      backgroundColor: '#0077B5',
      onPress: handleLinkedIn,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      iconComponent: (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <Path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </Svg>
      ),
      color: '#ffffff',
      backgroundColor: '#25D366',
      onPress: handleWhatsApp,
    },
    {
      id: 'telegram',
      label: 'Telegram',
      iconComponent: (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <Path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.724-1.653-1.174-2.678-1.882-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </Svg>
      ),
      color: '#ffffff',
      backgroundColor: '#0088cc',
      onPress: handleTelegram,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      iconComponent: (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <Path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
        </Svg>
      ),
      color: '#ffffff',
      backgroundColor: '#E4405F',
      onPress: handleInstagram,
    },
    {
      id: 'blacktube',
      label: 'The BlackTube',
      iconComponent: (
        <Svg width="24" height="24" viewBox="0 0 461 447" fill="currentColor">
          <Path
            d="M202.892215,0.483398438 L204.910104,2.16384957 L208.945882,9.2217443 L213.990605,17.9600902 L218.699013,26.3623458 L222.062161,32.0758796 L226.770569,40.4781353 L230.806347,47.53603 L233.833181,52.5773834 L235.85107,56.2743759 L239.214218,62.3239999 L243.586311,70.0540751 L258.384165,95.9330225 L263.092573,104.335278 L267.128351,111.393173 L270.827814,117.778887 L273.182018,120.467609 L274.527277,121.139789 L278.563056,121.139789 L280.24463,119.795429 L282.935149,113.073624 L288.316186,98.9578345 L293.024594,86.8585864 L297.396687,75.767609 L299.414576,70.3901654 L303.786669,58.9630977 L307.486132,49.5525714 L311.858225,38.4615939 L312.530855,38.4615939 L312.86717,39.1337744 L312.86717,41.8224962 L310.849281,48.2082105 L308.495077,56.6104661 L304.459299,70.0540751 L299.750891,85.8503157 L294.033539,105.007459 L289.99776,118.787158 L289.661446,120.131519 L289.661446,123.156331 L295.715113,124.500692 L320.938726,128.197684 L340.108673,130.886406 L365.668601,134.583398 L377.103306,136.26385 L393.582734,139.288662 L408.044272,142.649564 L417.797403,145.338286 L429.904737,149.371368 L437.976293,152.732271 L443.693646,155.420992 L450.083628,159.454075 L453.446776,162.142797 L456.809925,165.167609 L459.164129,167.520241 L460.509388,170.208962 L460.845703,171.553323 L460.845703,173.905955 L457.818869,172.225504 L453.110462,169.536782 L447.729424,166.84806 L437.976293,163.151068 L430.577367,160.798436 L416.115828,156.765353 L405.353753,154.076632 L393.582734,151.38791 L376.766991,148.027007 L349.525488,143.321744 L326.319764,139.624752 L299.078261,135.255579 L272.173073,131.222496 L245.6042,127.189413 L221.389531,123.156331 L204.573789,120.131519 L190.112251,117.442797 L182.713324,116.434526 L179.350175,116.098436 L162.534433,116.098436 L153.453932,117.442797 L147.06395,119.123248 L142.019227,121.139789 L137.647134,123.492421 L134.283986,126.181143 L132.266097,127.861594 L129.575578,131.222496 L126.885059,135.591669 L125.203485,140.296932 L124.19454,144.666105 L123.858225,151.38791 L124.530855,163.151068 L125.5398,194.407459 L126.548744,218.942045 L127.557689,261.289413 L128.230319,301.956331 L128.902948,356.066857 L129.239263,374.88791 L129.911893,385.306707 L130.920837,392.364601 L132.602412,400.430767 L134.956615,408.160842 L138.656079,416.899188 L141.682912,422.276632 L144.709746,425.973624 L147.06395,428.662346 L151.772358,432.359338 L155.808136,434.71197 L161.189174,436.728511 L164.552322,437.400692 L171.614934,437.400692 L435.285775,399.086406 L437.303664,399.086406 L437.976293,400.094677 L433.6042,401.102947 L399.972716,407.152571 L348.852859,416.227007 L310.512966,422.948812 L275.872537,428.998436 L247.958404,433.703699 L213.65429,439.417233 L186.412787,443.786406 L171.278619,446.139038 L163.207063,447.147308 L158.83497,447.483398 L142.019227,447.483398 L134.283986,446.475128 L125.876115,444.458586 L117.468243,441.097684 L112.423521,438.408962 L107.042483,434.71197 L101.99776,430.342797 L99.6435564,427.990165 L95.9440931,423.284902 L92.9172595,418.579639 L90.2267407,413.202195 L88.2088516,408.160842 L86.8635922,403.791669 L85.5183328,396.733774 L84.8457031,388.667609 L84.8457031,169.200692 L85.182018,160.126256 L86.1909625,152.06009 L87.8725368,143.993925 L90.5630555,135.927759 L93.2535743,129.878135 L96.9530377,124.164601 L100.652501,119.795429 L104.688279,115.762346 L109.733002,112.065353 L114.777725,109.040541 L120.495077,106.351819 L127.557689,103.999188 L133.947671,102.654827 L138.992394,101.982647 L144.373431,101.646556 L149.418154,101.646556 L158.498655,102.318737 L170.269675,103.999188 L209.282197,110.384902 L255.693646,118.114977 L257.711535,118.787158 L260.065739,118.787158 L260.402054,118.451068 L260.402054,116.098436 L256.70259,109.376632 L254.012072,103.663098 L251.321553,98.2856541 L246.613145,89.211218 L228.452143,52.9134736 L225.42531,47.1999398 L203.22853,2.83603002 L202.892215,0.483398438 Z M78.0835672,105.483398 L78.7534701,105.819367 L79.0884216,106.827272 L79.0884216,126.313438 L77.7486157,130.681027 L74.3991012,135.720553 L71.3845381,142.103952 L70.0447323,146.807509 L69.3748293,152.183003 L69.3748293,159.910276 L71.3845381,244.910276 L72.3893924,289.258102 L73.3942468,336.629643 L74.3991012,387.360869 L74.7340526,399.45573 L75.738907,405.83913 L77.7486157,411.88656 L80.0932759,416.590118 L82.7728876,420.28577 L85.4524992,423.309485 L88.8020138,425.997232 L92.4864798,428.349011 L95.5010429,431.036758 L97.1758002,434.396442 L97.8457031,438.092094 L97.8457031,442.123715 L97.1758002,444.475493 L96.1709458,445.14743 L88.8020138,445.483398 L67.7000721,445.483398 L62.0058973,444.475493 L55.9767711,442.459683 L49.6126934,439.099999 L45.9282274,436.076284 L42.5787128,433.052568 L38.8942468,428.013043 L36.2146352,423.309485 L33.869975,416.254149 L32.8651206,410.878655 L32.5301691,405.83913 L30.8554119,289.930039 L30.8554119,275.483398 L29.8505575,275.483398 L29.515606,187.459683 L28.8457031,154.198813 L28.8457031,141.432015 L29.8505575,134.712647 L31.8602662,128.665217 L34.5398779,123.625691 L37.2194895,119.930039 L40.9039556,115.898418 L45.2583245,112.202766 L50.6175478,109.179051 L55.9767711,107.16324 L62.6758002,105.819367 L65.6903633,105.483398 L78.0835672,105.483398 Z M190.845703,136.483398 L192.526676,137.154896 L199.922956,141.51963 L206.983042,145.884365 L225.809938,157.299824 L230.180467,159.985814 L256.739838,176.101756 L264.472313,180.802239 L271.532398,185.166973 L279.937262,190.203205 L288.678321,195.575186 L295.402212,199.604171 L302.462298,203.968906 L309.18619,207.997891 L316.918664,212.698374 L323.97875,217.063109 L330.702642,221.092094 L338.435117,225.792577 L377.097491,249.294993 L384.157577,253.659727 L392.562441,258.695959 L398.613943,262.389196 L407.355002,267.761176 L414.078893,271.790162 L421.811368,276.490645 L425.509509,278.840886 L425.845703,279.848133 L419.121812,283.541369 L411.053142,288.241853 L401.639695,293.613833 L384.157577,303.686297 L374.744129,309.058278 L366.67546,313.758761 L357.262012,319.130741 L339.779895,329.203205 L330.366447,334.575186 L322.297778,339.275669 L313.556719,344.311901 L304.143271,349.683882 L296.074602,354.384365 L287.669737,359.084848 L280.273457,363.449582 L270.860009,368.821563 L262.79134,373.522046 L254.386476,378.222529 L246.990195,382.587263 L237.576747,387.959244 L229.508078,392.659727 L221.775603,397.024461 L213.706933,401.724944 L204.293486,407.096925 L196.224816,411.797408 L191.518092,414.483398 L190.845703,414.483398 L190.845703,136.483398 Z M207.319237,233.850548 L199.250567,233.850548 L197.569594,234.522046 L197.2334,235.193543 L197.2334,246.944751 L197.905789,248.287746 L201.603929,248.623495 L206.310653,248.959244 L208.32782,248.623495 L209.336404,248.959244 L212.025961,248.959244 L212.362155,252.652481 L212.69835,253.995476 L212.69835,254.666973 L212.362155,259.703205 L212.362155,266.75393 L213.034544,267.425427 L213.034544,266.418181 L213.706933,266.75393 L213.706933,268.096925 L212.362155,268.768423 L212.362155,319.46649 L213.034544,322.488229 L213.706933,322.823978 L223.79277,323.159727 L226.482327,323.159727 L228.499494,322.152481 L228.835689,320.137988 L228.835689,291.935089 L228.1633,290.592094 L228.835689,289.920597 L228.835689,270.447167 L229.171883,249.294993 L229.508078,248.959244 L242.95586,248.623495 L243.964444,247.2805 L244.300639,244.930258 L243.964444,235.193543 L243.292055,234.186297 L242.283471,233.850548 L221.775603,233.850548 L220.430825,234.186297 L208.32782,234.186297 L207.319237,233.850548 Z M272.877177,233.850548 L252.033114,233.850548 L250.352141,234.857795 L250.015946,235.865041 L250.015946,319.130741 L250.688335,322.488229 L251.02453,322.823978 L254.050281,323.159727 L268.842842,323.159727 L279.264873,322.823978 L282.290624,322.152481 L285.988765,320.809485 L289.014516,318.459244 L291.704072,315.773254 L294.057434,311.07277 L295.066018,307.379534 L295.402212,303.350548 L295.402212,290.927843 L294.393629,286.22736 L293.04885,282.869872 L290.695489,279.848133 L287.669737,277.162142 L288.342127,275.819147 L290.695489,273.804654 L292.712656,270.447167 L293.72124,268.432674 L294.393629,264.739437 L294.393629,252.652481 L293.72124,247.951997 L291.704072,242.580017 L289.35071,239.558278 L287.669737,237.543785 L283.971597,235.865041 L280.273457,234.522046 L278.592484,234.186297 L272.877177,233.850548 Z M343.14184,233.850548 L299.436547,233.850548 L298.091769,234.857795 L298.091769,240.229775 L297.755574,242.915766 L298.091769,247.2805 L299.100353,248.623495 L310.867162,248.959244 L312.88433,249.630741 L313.220524,258.695959 L313.220524,321.480983 L314.901497,323.159727 L327.340696,323.159727 L329.021669,322.488229 L329.694058,320.809485 L329.694058,263.396442 L330.030252,249.294993 L332.719809,248.623495 L343.81423,248.623495 L344.822813,247.2805 L344.822813,235.193543 L344.150424,234.186297 L343.14184,233.850548 Z M273.714124,284.483398 L276.450966,286.510425 L277.819387,288.199615 L278.845703,293.60502 L278.845703,301.713128 L277.819387,306.780696 L275.42465,308.807723 L273.714124,309.483398 L266.872019,309.483398 L266.187808,308.807723 L265.845703,307.118534 L265.845703,285.496912 L266.529914,284.483398 L273.714124,284.483398 Z M271.845703,248.483398 L274.845703,249.159869 L276.51237,250.174575 L277.845703,252.542222 L278.51237,255.924575 L278.845703,259.983398 L278.179036,266.071634 L277.179036,269.115751 L274.51237,271.145163 L272.179036,271.483398 L268.51237,271.483398 L267.179036,270.806928 L266.845703,270.130457 L266.845703,249.498104 L267.51237,248.483398 L271.845703,248.483398 Z M219.845703,235.483398 L220.845703,236.483398 L219.845703,236.483398 L219.845703,235.483398 Z M12.4414478,204.483398 L14.8244265,204.819464 L15.8457031,205.827661 L15.8457031,325.130939 L15.1648521,327.147333 L13.1222989,327.483398 L9.71804355,325.803071 L6.65421376,323.450612 L4.27123504,321.098153 L1.54783078,316.7293 L0.186128657,312.024382 L-0.154296875,308.663726 L-0.154296875,223.303071 L0.526554189,218.262087 L2.22868185,213.893235 L4.61166057,210.532579 L7.67549036,207.507989 L11.0797457,205.15553 L12.4414478,204.483398 Z"
            fillRule="nonzero"
          />
        </Svg>
      ),
      color: '#ffffff',
      backgroundColor: '#000000',
      onPress: handleBlackTube,
    },
    {
      id: 'fanbase',
      label: 'Fanbase',
      iconComponent: (
        <Svg width="24" height="24" viewBox="0 0 512 512" fill="currentColor">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M199.7,62.7l-93.4,246.3h33.9l-58.8,147l155.2-196.6h-25l28.5-49.4H284l34.9-41.8h-53.7l25.7-39h78l61.9-66.4H199.7z"
          />
        </Svg>
      ),
      color: '#ffffff',
      backgroundColor: '#9829FF',
      onPress: handleFanbase,
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
            {shareOptions.filter(option => option.id !== 'copy' && option.id !== 'email').map((option) => (
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
                  {option.iconComponent ? (
                    <View style={{ width: iconSize * 0.5, height: iconSize * 0.5 }}>
                      {React.cloneElement(option.iconComponent as React.ReactElement, {
                        fill: option.color,
                        width: iconSize * 0.5,
                        height: iconSize * 0.5,
                      })}
                    </View>
                  ) : (
                    <MaterialIcons
                      name={option.icon as any}
                      size={iconSize * 0.5}
                      color={option.color}
                    />
                  )}
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

          {/* Copy Link and Email Buttons */}
          <View
            style={{
              flexDirection: 'row',
              gap: spacing.md,
              marginBottom: spacing.md,
            }}
          >
            <TouchableOpacity
              onPress={handleCopy}
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: '#ba9988',
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: spacing.sm,
                borderWidth: 1,
                borderColor: 'rgba(186, 153, 136, 0.3)',
              }}
            >
              <MaterialIcons name="content-copy" size={20} color="#ffffff" />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: '#ffffff',
                }}
              >
                Copy Link
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleEmail}
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: colors.accentLight,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: spacing.sm,
                borderWidth: 2,
                borderColor: colors.accent,
              }}
            >
              <MaterialIcons name="email" size={20} color={colors.accent} />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.accent,
                }}
              >
                Email
              </Text>
            </TouchableOpacity>
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
