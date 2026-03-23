import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const TrueFalseExercise = ({ exercise, onAnswer, answered, isCorrect }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option.text);
    onAnswer(option.text);
  };

  const getButtonStyle = (option) => {
    if (!answered) {
      if (selected === option.text) {
        return option.text === 'Vrai' ? styles.trueSelected : styles.falseSelected;
      }
      return option.text === 'Vrai' ? styles.trueButton : styles.falseButton;
    }
    if (option.isCorrect) return styles.correctButton;
    if (selected === option.text && !option.isCorrect) return styles.wrongButton;
    return option.text === 'Vrai' ? styles.trueButton : styles.falseButton;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.question}>{exercise.question}</Text>

      {exercise.codeSnippet && (
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{exercise.codeSnippet}</Text>
        </View>
      )}

      <View style={styles.buttonsRow}>
        {exercise.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.buttonBase, getButtonStyle(option)]}
            onPress={() => handleSelect(option)}
            disabled={answered}
          >
            <Ionicons
              name={option.text === 'Vrai' ? 'checkmark-circle-outline' : 'close-circle-outline'}
              size={32}
              color={
                answered && option.isCorrect ? COLORS.primary
                : answered && selected === option.text && !option.isCorrect ? COLORS.error
                : option.text === 'Vrai' ? COLORS.primary : COLORS.error
              }
            />
            <Text style={[
              styles.buttonText,
              answered && option.isCorrect && { color: COLORS.primary },
              answered && selected === option.text && !option.isCorrect && { color: COLORS.error },
            ]}>
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  question: {
    fontSize: SIZES.xl,
    color: COLORS.white,
    ...FONTS.bold,
    marginBottom: 20,
    lineHeight: 28,
  },
  codeBlock: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: SIZES.radiusSmall,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  codeText: {
    color: COLORS.secondary,
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
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primary + '40',
  },
  falseButton: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.error + '40',
  },
  trueSelected: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  falseSelected: {
    backgroundColor: COLORS.error + '20',
    borderColor: COLORS.error,
  },
  correctButton: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  wrongButton: {
    backgroundColor: COLORS.error + '20',
    borderColor: COLORS.error,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.xl,
    ...FONTS.bold,
  },
});

export default TrueFalseExercise;
