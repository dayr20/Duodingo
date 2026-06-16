import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import * as api from '../services/api';

const TopicLessonsScreen = ({ route, navigation }) => {
  const { topic, language } = route.params;
  const { user } = useAuth();
  const { colors } = useTheme();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = createStyles(colors);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const data = await api.getLessonsForTopic(language._id, topic._id);
      setLessons(data);
    } catch (error) {
      console.log('Erreur:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const isLessonCompleted = (lessonId) => {
    return user?.completedLessons?.includes(lessonId) || false;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: language.color + '20' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Ionicons name={topic.icon} size={32} color={language.color} />
          <View>
            <Text style={styles.topicTitle}>{topic.name}</Text>
            <Text style={styles.topicDesc}>{topic.description}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.lessonsList} contentContainerStyle={styles.lessonsContent}>
        {lessons.map((lesson, index) => {
          const completed = isLessonCompleted(lesson._id);

          return (
            <TouchableOpacity
              key={lesson._id}
              style={[styles.lessonCard, completed && styles.lessonCompleted]}
              onPress={() => navigation.navigate('LessonPlay', { lessonId: lesson._id })}
              accessibilityRole="button"
              accessibilityLabel={`${lesson.title}${completed ? ', complété' : ''}`}
            >
              <View style={[
                styles.lessonNumber,
                completed
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: language.color },
              ]}>
                {completed ? (
                  <Ionicons name="checkmark" size={20} color={colors.white} />
                ) : (
                  <Text style={styles.lessonNumberText}>{index + 1}</Text>
                )}
              </View>

              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDesc}>{lesson.description}</Text>
              </View>

              <View style={styles.lessonXP}>
                <Ionicons name="star" size={16} color={colors.xp} />
                <Text style={styles.lessonXPText}>+{lesson.xpReward} XP</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: SIZES.padding,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  topicTitle: {
    fontSize: SIZES.xxl,
    color: colors.white,
    ...FONTS.bold,
  },
  topicDesc: {
    fontSize: SIZES.md,
    color: colors.textSecondary,
    ...FONTS.regular,
    marginTop: 4,
  },
  lessonsList: {
    flex: 1,
  },
  lessonsContent: {
    padding: SIZES.padding,
    gap: 12,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  lessonCompleted: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  lessonNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonNumberText: {
    color: colors.white,
    fontSize: SIZES.lg,
    ...FONTS.bold,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    color: colors.white,
    fontSize: SIZES.lg,
    ...FONTS.semiBold,
  },
  lessonDesc: {
    color: colors.textSecondary,
    fontSize: SIZES.sm,
    ...FONTS.regular,
    marginTop: 2,
  },
  lessonXP: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonXPText: {
    color: colors.xp,
    fontSize: SIZES.sm,
    ...FONTS.bold,
  },
});

export default TopicLessonsScreen;
