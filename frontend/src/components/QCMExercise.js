import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const QCMExercise = ({ exercise, onAnswer, answered, isCorrect }) => {
  const { colors } = useTheme();
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option.text);
    onAnswer(option.text);
  };

  const getOptionStyle = (option) => {
    if (!answered) {
      return selected === option.text ? styles(colors).optionSelected : styles(colors).option;
    }
    if (option.isCorrect) return styles(colors).optionCorrect;
    if (selected === option.text && !option.isCorrect) return styles(colors).optionWrong;
    return styles(colors).option;
  };

  const getOptionIcon = (option) => {
    if (!answered) return null;
    if (option.isCorrect) return 'checkmark-circle';
    if (selected === option.text && !option.isCorrect) return 'close-circle';
    return null;
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

      <View style={s.options}>
        {exercise.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[s.optionBase, getOptionStyle(option)]}
            onPress={() => handleSelect(option)}
            disabled={answered}
            accessibilityRole="radio"
            accessibilityLabel={option.text}
            accessibilityState={{ selected: selected === option.text, disabled: answered }}
          >
            <Text style={[
              s.optionText,
              answered && option.isCorrect && s.optionTextCorrect,
              answered && selected === option.text && !option.isCorrect && s.optionTextWrong,
            ]}>
              {option.text}
            </Text>
            {getOptionIcon(option) && (
              <Ionicons
                name={getOptionIcon(option)}
                size={22}
                color={option.isCorrect ? colors.primary : colors.error}
              />
            )}
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
    fontFamily: Platform?.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.secondary,
    fontSize: SIZES.md,
    lineHeight: 22,
  },
  options: { gap: 12 },
  optionBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 2,
  },
  option: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.secondary,
  },
  optionCorrect: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  optionWrong: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
  },
  optionText: {
    color: colors.white,
    fontSize: SIZES.lg,
    ...FONTS.medium,
    flex: 1,
  },
  optionTextCorrect: { color: colors.primary },
  optionTextWrong: { color: colors.error },
});

export default QCMExercise;
