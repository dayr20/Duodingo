import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const OrderCodeExercise = ({ exercise, onAnswer, answered, isCorrect }) => {
  const [availableItems, setAvailableItems] = useState(
    [...exercise.options].sort(() => Math.random() - 0.5)
  );
  const [orderedItems, setOrderedItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const addToOrder = (item, index) => {
    if (answered) return;
    const newAvailable = [...availableItems];
    newAvailable.splice(index, 1);
    setAvailableItems(newAvailable);
    setOrderedItems([...orderedItems, item]);
  };

  const removeFromOrder = (item, index) => {
    if (answered) return;
    const newOrdered = [...orderedItems];
    newOrdered.splice(index, 1);
    setOrderedItems(newOrdered);
    setAvailableItems([...availableItems, item]);
  };

  const handleSubmit = () => {
    if (orderedItems.length !== exercise.options.length) return;
    setSubmitted(true);
    const answer = orderedItems.map(item => item.text);
    onAnswer(answer);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.question}>{exercise.question}</Text>

      {/* Drop Zone - Ordered items */}
      <View style={styles.dropZone}>
        <Text style={styles.dropZoneLabel}>Ton code :</Text>
        {orderedItems.length === 0 ? (
          <View style={styles.emptyZone}>
            <Text style={styles.emptyText}>Appuie sur les lignes ci-dessous</Text>
          </View>
        ) : (
          orderedItems.map((item, index) => (
            <TouchableOpacity
              key={`ordered-${index}`}
              style={[
                styles.codeLineOrdered,
                answered && isCorrect && styles.codeLineCorrect,
                answered && !isCorrect && styles.codeLineWrong,
              ]}
              onPress={() => removeFromOrder(item, index)}
              disabled={answered}
            >
              <Text style={styles.lineNumber}>{index + 1}</Text>
              <Text style={styles.codeText}>{item.text}</Text>
              {!answered && (
                <Ionicons name="close-circle-outline" size={20} color={COLORS.textMuted} />
              )}
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Available items */}
      {availableItems.length > 0 && (
        <View style={styles.availableZone}>
          {availableItems.map((item, index) => (
            <TouchableOpacity
              key={`available-${index}`}
              style={styles.codeLineAvailable}
              onPress={() => addToOrder(item, index)}
              disabled={answered}
            >
              <Text style={styles.codeText}>{item.text}</Text>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.secondary} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Submit button */}
      {!answered && orderedItems.length === exercise.options.length && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>VÉRIFIER</Text>
        </TouchableOpacity>
      )}
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
  dropZone: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 20,
    minHeight: 100,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  dropZoneLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    ...FONTS.semiBold,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyZone: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: SIZES.md,
    ...FONTS.regular,
  },
  codeLineOrdered: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    padding: 12,
    borderRadius: SIZES.radiusSmall,
    marginBottom: 8,
    gap: 10,
  },
  codeLineCorrect: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  codeLineWrong: {
    backgroundColor: COLORS.error + '20',
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  lineNumber: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
    ...FONTS.bold,
    width: 20,
  },
  availableZone: {
    gap: 8,
  },
  codeLineAvailable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  codeText: {
    color: COLORS.secondary,
    fontSize: SIZES.md,
    ...FONTS.medium,
    flex: 1,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    ...FONTS.bold,
    letterSpacing: 1,
  },
});

export default OrderCodeExercise;
