import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const FillCodeExercise = ({ exercise, onAnswer, answered, isCorrect }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option.text);
    onAnswer(option.text);
  };

  const renderCodeWithBlank = () => {
    if (!exercise.codeSnippet) return null;

    const parts = exercise.codeSnippet.split('___');
    return (
      <View style={styles.codeBlock}>
        <Text style={styles.codeText}>
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              <Text>{part}</Text>
              {i < parts.length - 1 && (
                <Text style={[
                  styles.blank,
                  selected && (answered
                    ? (isCorrect ? styles.blankCorrect : styles.blankWrong)
                    : styles.blankFilled),
                ]}>
                  {selected ? ` ${selected} ` : ' ___ '}
                </Text>
              )}
            </React.Fragment>
          ))}
        </Text>
      </View>
    );
  };

  const getOptionStyle = (option) => {
    if (!answered) {
      return selected === option.text ? styles.chipSelected : styles.chip;
    }
    if (option.isCorrect) return styles.chipCorrect;
    if (selected === option.text && !option.isCorrect) return styles.chipWrong;
    return styles.chip;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.question}>{exercise.question}</Text>
      {renderCodeWithBlank()}

      <View style={styles.options}>
        {exercise.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.chipBase, getOptionStyle(option)]}
            onPress={() => handleSelect(option)}
            disabled={answered}
          >
            <Text style={[
              styles.chipText,
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
    borderLeftColor: COLORS.warning,
  },
  codeText: {
    color: COLORS.secondary,
    fontSize: SIZES.lg,
    lineHeight: 26,
  },
  blank: {
    backgroundColor: COLORS.surfaceLight,
    color: COLORS.textMuted,
    paddingHorizontal: 4,
    borderRadius: 4,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.textMuted,
  },
  blankFilled: {
    color: COLORS.secondary,
    borderBottomColor: COLORS.secondary,
  },
  blankCorrect: {
    color: COLORS.primary,
    borderBottomColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  blankWrong: {
    color: COLORS.error,
    borderBottomColor: COLORS.error,
    backgroundColor: COLORS.error + '20',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chipBase: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
  },
  chip: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.secondary,
  },
  chipCorrect: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  chipWrong: {
    backgroundColor: COLORS.error + '20',
    borderColor: COLORS.error,
  },
  chipText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    ...FONTS.semiBold,
  },
});

export default FillCodeExercise;
