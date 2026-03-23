import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const LessonResultScreen = ({ route, navigation }) => {
  const { xpEarned, score, correctAnswers, totalExercises, streak } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getScoreEmoji = () => {
    if (score >= 100) return 'trophy';
    if (score >= 80) return 'star';
    if (score >= 60) return 'thumbs-up';
    return 'refresh';
  };

  const getScoreMessage = () => {
    if (score >= 100) return 'Parfait !';
    if (score >= 80) return 'Excellent !';
    if (score >= 60) return 'Bien joué !';
    return 'Continue à pratiquer !';
  };

  const getScoreColor = () => {
    if (score >= 80) return COLORS.primary;
    if (score >= 60) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.trophy, { transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.trophyCircle, { backgroundColor: getScoreColor() + '20' }]}>
            <Ionicons name={getScoreEmoji()} size={80} color={getScoreColor()} />
          </View>
        </Animated.View>

        <Text style={[styles.message, { color: getScoreColor() }]}>
          {getScoreMessage()}
        </Text>

        <Animated.View style={[styles.stats, { opacity: fadeAnim }]}>
          <View style={styles.statCard}>
            <Ionicons name="star" size={28} color={COLORS.xp} />
            <Text style={styles.statNumber}>+{xpEarned}</Text>
            <Text style={styles.statLabel}>XP gagnés</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-done" size={28} color={COLORS.primary} />
            <Text style={styles.statNumber}>{correctAnswers}/{totalExercises}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="flame" size={28} color={COLORS.streak} />
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Série</Text>
          </View>
        </Animated.View>

        <View style={styles.scoreBar}>
          <View style={styles.scoreBarTrack}>
            <View style={[styles.scoreBarFill, { width: `${score}%`, backgroundColor: getScoreColor() }]} />
          </View>
          <Text style={[styles.scoreText, { color: getScoreColor() }]}>{score}%</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.continueButtonText}>CONTINUER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: SIZES.padding * 1.5,
  },
  content: {
    alignItems: 'center',
  },
  trophy: {
    marginBottom: 24,
  },
  trophyCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: SIZES.xxxl,
    ...FONTS.bold,
    marginBottom: 40,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    gap: 6,
  },
  statNumber: {
    color: COLORS.white,
    fontSize: SIZES.xxl,
    ...FONTS.bold,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    ...FONTS.medium,
    textTransform: 'uppercase',
  },
  scoreBar: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  scoreBarTrack: {
    width: '100%',
    height: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  scoreText: {
    fontSize: SIZES.lg,
    ...FONTS.bold,
  },
  buttons: {
    gap: 12,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    ...FONTS.bold,
    letterSpacing: 1,
  },
});

export default LessonResultScreen;
