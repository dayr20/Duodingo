import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const TrueFalseExercise = ({ exercise, onAnswer, answered, isCorrect }) => {
  const { colors } = useTheme();
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option.text);
    onAnswer(option.text);
  };

  const getButtonStyle = (option) => {
    const s = styles(colors);
    if (!answered) {
      if (selected === option.text) {
        return option.text === 'Vrai' ? s.trueSelected : s.falseSelected;
      }
      return option.text === 'Vrai' ? s.trueButton : s.falseButton;
    }
    if (option.isCorrect) return s.correctButton;
    if (selected === option.text && !option.isCorrect) return s.wrongButton;
    return option.text === 'Vrai' ? s.trueButton : s.falseButton;
  };

  const s = styles(colors);

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <Text style={s.question}>{exercise.question}</Text>

      {exercise.codeSnippet && (
        <View style={s.codeBlock}>
          <Text style={s.codeText}>{exercise.codeSnippet}</Text>
        </View>
      )}

      <View style={s.buttonsRow}>
        {exercise.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[s.buttonBase, getButtonStyle(option)]}
            onPress={() => handleSelect(option)}
            disabled={answered}
            accessibilityRole="radio"
            accessibilityLabel={option.text}
            accessibilityState={{ selected: selected === option.text, disabled: answered }}
          >
            <Ionicons
              name={option.text === 'Vrai' ? 'checkmark-circle-outline' : 'close-circle-outline'}
              size={32}
              color={
                answered && option.isCorrect ? colors.primary
                : answered && selected === option.text && !option.isCorrect ? colors.error
                : option.text === 'Vrai' ? colors.primary : colors.error
              }
            />
            <Text style={[
              s.buttonText,
              answered && option.isCorrect && { color: colors.primary },
              answered && selected === option.text && !option.isCorrect && { color: colors.error },
            ]}>
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = (colors) => StyleSheet.create({
  container: { flex: 1 },
  question: {
    fontSize: SIZES.xl,
    color: colors.white,
    ...FONTS.bold,
    marginBottom: 20,
    lineHeight: 28,
  },
  codeBlock: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: SIZES.radiusSmall,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  codeText: {
    color: colors.secondary,
    fontSize: SIZES.md,
    lineHeight: 22,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  buttonBase: {
    flex: 1,
    paddingVertical: 30,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    gap: 8,
  },
  trueButton: {
    backgroundColor: colors.surface,
    borderColor: colors.primary + '40',
  },
  falseButton: {
    backgroundColor: colors.surface,
    borderColor: colors.error + '40',
  },
  trueSelected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  falseSelected: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
  },
  correctButton: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  wrongButton: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
  },
  buttonText: {
    color: colors.white,
    fontSize: SIZES.xl,
    ...FONTS.bold,
  },
});

export default TrueFalseExercise;
