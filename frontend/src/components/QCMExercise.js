import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const QCMExercise = ({ exercise, onAnswer, answered, isCorrect }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option.text);
    onAnswer(option.text);
  };

  const getOptionStyle = (option) => {
    if (!answered) {
      return selected === option.text ? styles.optionSelected : styles.option;
    }
    if (option.isCorrect) return styles.optionCorrect;
    if (selected === option.text && !option.isCorrect) return styles.optionWrong;
    return styles.option;
  };

  const getOptionIcon = (option) => {
    if (!answered) return null;
    if (option.isCorrect) return 'checkmark-circle';
    if (selected === option.text && !option.isCorrect) return 'close-circle';
    return null;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.question}>{exercise.question}</Text>

      {exercise.codeSnippet && (
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{exercise.codeSnippet}</Text>
        </View>
      )}

      <View style={styles.options}>
        {exercise.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionBase, getOptionStyle(option)]}
            onPress={() => handleSelect(option)}
            disabled={answered}
          >
            <Text style={[
              styles.optionText,
              answered && option.isCorrect && styles.optionTextCorrect,
              answered && selected === option.text && !option.isCorrect && styles.optionTextWrong,
            ]}>
              {option.text}
            </Text>
            {getOptionIcon(option) && (
              <Ionicons
                name={getOptionIcon(option)}
                size={22}
                color={option.isCorrect ? COLORS.primary : COLORS.error}
              />
            )}
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
    fontFamily: Platform?.OS === 'ios' ? 'Menlo' : 'monospace',
    color: COLORS.secondary,
    fontSize: SIZES.md,
    lineHeight: 22,
  },
  options: {
    gap: 12,
  },
  optionBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 2,
  },
  option: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  optionSelected: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.secondary,
  },
  optionCorrect: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  optionWrong: {
    backgroundColor: COLORS.error + '20',
    borderColor: COLORS.error,
  },
  optionText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    ...FONTS.medium,
    flex: 1,
  },
  optionTextCorrect: {
    color: COLORS.primary,
  },
  optionTextWrong: {
    color: COLORS.error,
  },
});

export default QCMExercise;
