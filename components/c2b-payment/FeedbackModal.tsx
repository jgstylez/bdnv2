import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  rating: number;
  setRating: (rating: number) => void;
  feedback: string;
  setFeedback: (feedback: string) => void;
  onSubmit: () => void;
}

export const FeedbackModal = (props: FeedbackModalProps) => {
  const { visible, onClose, rating, setRating, feedback, setFeedback, onSubmit } = props;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="bg-zinc-800 rounded-2xl p-6 w-[90%] max-w-sm">
          <View className="flex-row justify-between items-start mb-4">
            <Text className="text-xl font-bold text-white">Rate Your Experience</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center gap-3 my-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <MaterialIcons
                  name={star <= rating ? 'star' : 'star-border'}
                  size={32}
                  color={star <= rating ? '#ba9988' : 'rgba(255, 255, 255, 0.4)'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Tell us more (optional)"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            multiline
            numberOfLines={4}
            className="bg-zinc-900 rounded-xl p-4 text-white text-sm min-h-[100px] text-top border border-primary-alpha-20 mb-6"
          />

          <TouchableOpacity
            onPress={onSubmit}
            disabled={rating === 0}
            className={`rounded-full p-4 items-center justify-center ${rating === 0 ? 'bg-zinc-700' : 'bg-primary'}`}
          >
            <Text className={`text-lg font-bold ${rating === 0 ? 'text-gray-500' : 'text-white'}`}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
