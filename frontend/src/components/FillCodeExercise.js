import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SIZES, FONTS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const FillCodeExercise = ({ exercise, onAnswer, answered, isCorrect }) => {
  const { colors } = useTheme();
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option.text);
    onAnswer(option.text);
  };

  const renderCodeWithBlank = () => {
    if (!exercise.codeSnippet) return null;
    const s = styles(colors);
    const parts = exercise.codeSnippet.split('___');
    return (
      <View style={s.codeBlock}>
        <Text style={s.codeText}>
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              <Text>{part}</Text>
              {i < parts.length - 1 && (
                <Text style={[
                  s.blank,
                  selected && (answered
                    ? (isCorrect ? s.blankCorrect : s.blankWrong)
                    : s.blankFilled),
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
    const s = styles(colors);
    if (!answered) {
      return selected === option.text ? s.chipSelected : s.chip;
    }
    if (option.isCorrect) return s.chipCorrect;
    if (selected === option.text && !option.isCorrect) return s.chipWrong;
    return s.chip;
  };

  const s = styles(colors);

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <Text style={s.question}>{exercise.question}</Text>
      {renderCodeWithBlank()}

      <View style={s.options}>
        {exercise.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[s.chipBase, getOptionStyle(option)]}
            onPress={() => handleSelect(option)}
            disabled={answered}
            accessibilityRole="radio"
            accessibilityLabel={option.text}
            accessibilityState={{ selected: selected === option.text, disabled: answered }}
          >
            <Text style={[
              s.chipText,
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
    borderLeftColor: colors.warning,
  },
  codeText: {
    color: colors.secondary,
    fontSize: SIZES.lg,
    lineHeight: 26,
  },
  blank: {
    backgroundColor: colors.surfaceLight,
    color: colors.textMuted,
    paddingHorizontal: 4,
    borderRadius: 4,
    borderBottomWidth: 2,
    borderBottomColor: colors.textMuted,
  },
  blankFilled: {
    color: colors.secondary,
    borderBottomColor: colors.secondary,
  },
  blankCorrect: {
    color: colors.primary,
    borderBottomColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  blankWrong: {
    color: colors.error,
    borderBottomColor: colors.error,
    backgroundColor: colors.error + '20',
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
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.secondary,
  },
  chipCorrect: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  chipWrong: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
  },
  chipText: {
    color: colors.white,
    fontSize: SIZES.lg,
    ...FONTS.semiBold,
  },
});

export default FillCodeExercise;
