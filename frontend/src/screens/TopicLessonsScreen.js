import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const TopicLessonsScreen = ({ route, navigation }) => {
  const { topic, language } = route.params;
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: language.color + '20' }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
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
            >
              <View style={[
                styles.lessonNumber,
                completed
                  ? { backgroundColor: COLORS.primary }
                  : { backgroundColor: language.color },
              ]}>
                {completed ? (
                  <Ionicons name="checkmark" size={20} color={COLORS.white} />
                ) : (
                  <Text style={styles.lessonNumberText}>{index + 1}</Text>
                )}
              </View>

              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDesc}>{lesson.description}</Text>
              </View>

              <View style={styles.lessonXP}>
                <Ionicons name="star" size={16} color={COLORS.xp} />
                <Text style={styles.lessonXPText}>+{lesson.xpReward} XP</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: SIZES.padding,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
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
    color: COLORS.white,
    ...FONTS.bold,
  },
  topicDesc: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  lessonCompleted: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  lessonNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonNumberText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    ...FONTS.bold,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    ...FONTS.semiBold,
  },
  lessonDesc: {
    color: COLORS.textSecondary,
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
    color: COLORS.xp,
    fontSize: SIZES.sm,
    ...FONTS.bold,
  },
});

export default TopicLessonsScreen;
