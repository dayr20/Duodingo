import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLanguages = async () => {
    try {
      const data = await api.getLanguages();
      setLanguages(data);
      if (data.length > 0 && !selectedLang) {
        setSelectedLang(data[0]);
        loadTopics(data[0]._id);
      }
    } catch (error) {
      console.log('Erreur chargement langages:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (langId) => {
    try {
      const data = await api.getTopics(langId);
      setTopics(data);
    } catch (error) {
      console.log('Erreur chargement topics:', error.message);
    }
  };

  useEffect(() => {
    loadLanguages();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLanguages();
    setRefreshing(false);
  }, []);

  const selectLanguage = (lang) => {
    setSelectedLang(lang);
    loadTopics(lang._id);
  };

  const getLanguageIcon = (slug) => {
    switch (slug) {
      case 'javascript': return 'logo-javascript';
      case 'python': return 'logo-python';
      case 'html-css': return 'code-slash';
      default: return 'code-outline';
    }
  };

  const isTopicUnlocked = (topic) => {
    return (user?.xp || 0) >= topic.requiredXP;
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
      {/* Header Stats */}
      <View style={styles.header}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={20} color={COLORS.streak} />
            <Text style={styles.statValue}>{user?.streak || 0}</Text>
          </View>
          <Text style={styles.headerTitle}>Duodingo</Text>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={20} color={COLORS.heart} />
              <Text style={styles.statValue}>{user?.hearts || 5}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color={COLORS.xp} />
              <Text style={styles.statValue}>{user?.xp || 0}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Language Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.langSelector}
        contentContainerStyle={styles.langSelectorContent}
      >
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang._id}
            style={[
              styles.langChip,
              selectedLang?._id === lang._id && styles.langChipActive,
              { borderColor: lang.color },
            ]}
            onPress={() => selectLanguage(lang)}
          >
            <Ionicons
              name={getLanguageIcon(lang.slug)}
              size={20}
              color={selectedLang?._id === lang._id ? COLORS.white : lang.color}
            />
            <Text style={[
              styles.langChipText,
              selectedLang?._id === lang._id && styles.langChipTextActive,
            ]}>
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Topics Path */}
      <ScrollView
        style={styles.topicsContainer}
        contentContainerStyle={styles.topicsContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        <View style={styles.pathContainer}>
          {topics.map((topic, index) => {
            const unlocked = isTopicUnlocked(topic);
            const isEven = index % 2 === 0;

            return (
              <View key={topic._id} style={styles.pathRow}>
                {/* Connector line */}
                {index > 0 && (
                  <View style={[
                    styles.connector,
                    !unlocked && styles.connectorLocked,
                  ]} />
                )}

                <TouchableOpacity
                  style={[
                    styles.topicNode,
                    { alignSelf: isEven ? 'flex-start' : 'flex-end' },
                    unlocked ? styles.topicUnlocked : styles.topicLocked,
                    unlocked && { borderColor: selectedLang?.color || COLORS.primary },
                  ]}
                  onPress={() => {
                    if (unlocked) {
                      navigation.navigate('TopicLessons', {
                        topic,
                        language: selectedLang,
                      });
                    }
                  }}
                  disabled={!unlocked}
                >
                  <View style={[
                    styles.topicIconCircle,
                    unlocked
                      ? { backgroundColor: selectedLang?.color || COLORS.primary }
                      : styles.topicIconLocked,
                  ]}>
                    <Ionicons
                      name={unlocked ? topic.icon : 'lock-closed'}
                      size={28}
                      color={COLORS.white}
                    />
                  </View>
                  <Text style={[
                    styles.topicName,
                    !unlocked && styles.topicNameLocked,
                  ]}>
                    {topic.name}
                  </Text>
                  {!unlocked && (
                    <Text style={styles.topicXPRequired}>
                      {topic.requiredXP} XP requis
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
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
    paddingHorizontal: SIZES.padding,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.xl,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 12,
  },
  statValue: {
    color: COLORS.white,
    fontSize: SIZES.md,
    ...FONTS.bold,
  },
  langSelector: {
    maxHeight: 60,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  langSelectorContent: {
    paddingHorizontal: SIZES.padding,
    gap: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    gap: 6,
    marginRight: 8,
  },
  langChipActive: {
    backgroundColor: COLORS.surfaceLight,
  },
  langChipText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    ...FONTS.semiBold,
  },
  langChipTextActive: {
    color: COLORS.white,
  },
  topicsContainer: {
    flex: 1,
  },
  topicsContent: {
    padding: SIZES.padding,
    paddingBottom: 100,
  },
  pathContainer: {
    paddingHorizontal: 20,
  },
  pathRow: {
    marginBottom: 20,
    position: 'relative',
  },
  connector: {
    position: 'absolute',
    top: -15,
    left: '50%',
    width: 3,
    height: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  connectorLocked: {
    backgroundColor: COLORS.border,
  },
  topicNode: {
    width: '65%',
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    borderWidth: 2,
  },
  topicUnlocked: {
    backgroundColor: COLORS.surface,
  },
  topicLocked: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    opacity: 0.6,
  },
  topicIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicIconLocked: {
    backgroundColor: COLORS.textMuted,
  },
  topicName: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    ...FONTS.bold,
    textAlign: 'center',
  },
  topicNameLocked: {
    color: COLORS.textMuted,
  },
  topicXPRequired: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    ...FONTS.regular,
    marginTop: 4,
  },
});

export default HomeScreen;
