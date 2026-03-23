import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  Alert, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import QCMExercise from '../components/QCMExercise';
import FillCodeExercise from '../components/FillCodeExercise';
import TrueFalseExercise from '../components/TrueFalseExercise';
import OrderCodeExercise from '../components/OrderCodeExercise';

const LessonPlayScreen = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const { user, updateUser } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hearts, setHearts] = useState(user?.hearts || 5);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadLesson();
  }, []);

  const loadLesson = async () => {
    try {
      const data = await api.getLesson(lessonId);
      setLesson(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger la leçon.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lesson) {
      Animated.timing(progressAnim, {
        toValue: (currentIndex + 1) / lesson.exercises.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentIndex, lesson]);

  const handleAnswer = (selectedAnswer) => {
    if (answered) return;

    const exercise = lesson.exercises[currentIndex];
    let correct = false;

    if (exercise.type === 'order_code') {
      correct = JSON.stringify(selectedAnswer) === JSON.stringify(exercise.correctAnswer);
    } else {
      correct = selectedAnswer === exercise.correctAnswer;
    }

    setAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      const newHearts = Math.max(0, hearts - 1);
      setHearts(newHearts);
      if (newHearts === 0) {
        setTimeout(() => {
          Alert.alert(
            'Plus de vies !',
            'Tu as perdu toutes tes vies. Réessaie plus tard !',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        }, 1000);
      }
    }
  };

  const handleNext = async () => {
    if (currentIndex < lesson.exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnswered(false);
      setIsCorrect(null);
    } else {
      // Lesson complete
      try {
        const result = await api.completeLesson(lessonId, {
          score: Math.round((correctAnswers / lesson.exercises.length) * 100),
          correctAnswers,
          totalExercises: lesson.exercises.length,
        });

        updateUser({
          xp: result.totalXP,
          level: result.level,
          streak: result.streak,
        });

        navigation.replace('LessonResult', {
          xpEarned: result.xpEarned,
          score: result.score,
          correctAnswers,
          totalExercises: lesson.exercises.length,
          streak: result.streak,
        });
      } catch (error) {
        navigation.replace('LessonResult', {
          xpEarned: correctAnswers * 10,
          score: Math.round((correctAnswers / lesson.exercises.length) * 100),
          correctAnswers,
          totalExercises: lesson.exercises.length,
          streak: user?.streak || 0,
        });
      }
    }
  };

  if (loading || !lesson) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const exercise = lesson.exercises[currentIndex];

  const renderExercise = () => {
    switch (exercise.type) {
      case 'qcm':
        return (
          <QCMExercise
            exercise={exercise}
            onAnswer={handleAnswer}
            answered={answered}
            isCorrect={isCorrect}
          />
        );
      case 'fill_code':
        return (
          <FillCodeExercise
            exercise={exercise}
            onAnswer={handleAnswer}
            answered={answered}
            isCorrect={isCorrect}
          />
        );
      case 'true_false':
        return (
          <TrueFalseExercise
            exercise={exercise}
            onAnswer={handleAnswer}
            answered={answered}
            isCorrect={isCorrect}
          />
        );
      case 'order_code':
        return (
          <OrderCodeExercise
            exercise={exercise}
            onAnswer={handleAnswer}
            answered={answered}
            isCorrect={isCorrect}
          />
        );
      default:
        return (
          <QCMExercise
            exercise={exercise}
            onAnswer={handleAnswer}
            answered={answered}
            isCorrect={isCorrect}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={COLORS.textMuted} />
        </TouchableOpacity>

        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>

        <View style={styles.heartsContainer}>
          <Ionicons name="heart" size={20} color={COLORS.heart} />
          <Text style={styles.heartsText}>{hearts}</Text>
        </View>
      </View>

      {/* Exercise Content */}
      <View style={styles.exerciseContainer}>
        {renderExercise()}
      </View>

      {/* Bottom Feedback & Next */}
      {answered && (
        <View style={[
          styles.feedbackBar,
          isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
        ]}>
          <View style={styles.feedbackContent}>
            <View style={styles.feedbackHeader}>
              <Ionicons
                name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                size={28}
                color={isCorrect ? COLORS.primary : COLORS.error}
              />
              <Text style={[
                styles.feedbackTitle,
                { color: isCorrect ? COLORS.primary : COLORS.error },
              ]}>
                {isCorrect ? 'Correct !' : 'Incorrect'}
              </Text>
            </View>
            {!isCorrect && exercise.explanation && (
              <Text style={styles.feedbackExplanation}>
                {exercise.explanation}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: isCorrect ? COLORS.primary : COLORS.error },
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex < lesson.exercises.length - 1 ? 'CONTINUER' : 'TERMINER'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 16,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartsText: {
    color: COLORS.heart,
    fontSize: SIZES.lg,
    ...FONTS.bold,
  },
  exerciseContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  feedbackBar: {
    padding: SIZES.padding,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  feedbackCorrect: {
    backgroundColor: COLORS.primary + '15',
  },
  feedbackWrong: {
    backgroundColor: COLORS.error + '15',
  },
  feedbackContent: {
    marginBottom: 16,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedbackTitle: {
    fontSize: SIZES.xl,
    ...FONTS.bold,
  },
  feedbackExplanation: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    ...FONTS.regular,
    marginTop: 8,
    lineHeight: 20,
  },
  nextButton: {
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    ...FONTS.bold,
    letterSpacing: 1,
  },
});

export default LessonPlayScreen;
