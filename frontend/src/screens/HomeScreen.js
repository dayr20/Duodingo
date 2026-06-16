import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import * as api from '../services/api';
import HeartsTimer from '../components/HeartsTimer';
import { HomeScreenSkeleton } from '../components/SkeletonLoader';

const HomeScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const { colors } = useTheme();
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nextRegenAt, setNextRegenAt] = useState(null);
  const [challengeDone, setChallengeDone] = useState(false);

  const styles = createStyles(colors);

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

  const loadHearts = async () => {
    try {
      const data = await api.getHearts();
      updateUser({ hearts: data.hearts });
      setNextRegenAt(data.nextRegenAt);
    } catch (error) {
      console.log('Erreur vies:', error.message);
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
    loadHearts();
    api.getTodayChallenge().then((c) => setChallengeDone(c.completed)).catch(() => {});
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
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.statRow}>
            <Text style={styles.headerTitle}>Duodingo</Text>
          </View>
        </View>
        <HomeScreenSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={20} color={colors.streak} />
            <Text style={styles.statValue}>{user?.streak || 0}</Text>
          </View>
          <Text style={styles.headerTitle}>Duodingo</Text>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={20} color={colors.heart} />
              <Text style={styles.statValue}>{user?.hearts ?? 5}</Text>
            </View>
            {nextRegenAt && (user?.hearts ?? 5) < 5 && (
              <HeartsTimer nextRegenAt={nextRegenAt} onRegen={loadHearts} />
            )}
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color={colors.xp} />
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
              color={selectedLang?._id === lang._id ? colors.white : lang.color}
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Daily Challenge Banner */}
        <TouchableOpacity
          style={[styles.challengeBanner, challengeDone && styles.challengeBannerDone]}
          onPress={() => navigation.navigate('DailyChallenge')}
        >
          <View style={styles.challengeBannerLeft}>
            <Text style={styles.challengeEmoji}>⚡</Text>
            <View>
              <Text style={styles.challengeTitle}>Défi du jour</Text>
              <Text style={styles.challengeSubtitle}>
                {challengeDone ? 'Défi complété aujourd\'hui !' : '+50 XP à gagner'}
              </Text>
            </View>
          </View>
          {challengeDone
            ? <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            : <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          }
        </TouchableOpacity>

        {/* Sandbox button */}
        <TouchableOpacity
          style={styles.sandboxBanner}
          onPress={() => navigation.navigate('CodeSandbox')}
        >
          <View style={styles.challengeBannerLeft}>
            <Text style={styles.challengeEmoji}>💻</Text>
            <View>
              <Text style={styles.challengeTitle}>Sandbox JavaScript</Text>
              <Text style={styles.challengeSubtitle}>Teste ton code librement</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.pathContainer}>
          {topics.map((topic, index) => {
            const unlocked = isTopicUnlocked(topic);
            const isEven = index % 2 === 0;

            return (
              <View key={topic._id} style={styles.pathRow}>
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
                    unlocked && { borderColor: selectedLang?.color || colors.primary },
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
                      ? { backgroundColor: selectedLang?.color || colors.primary }
                      : styles.topicIconLocked,
                  ]}>
                    <Ionicons
                      name={unlocked ? topic.icon : 'lock-closed'}
                      size={28}
                      color={colors.white}
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

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 12,
    backgroundColor: colors.surface,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.xl,
    color: colors.primary,
    ...FONTS.bold,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 12,
  },
  statValue: {
    color: colors.white,
    fontSize: SIZES.md,
    ...FONTS.bold,
  },
  langSelector: {
    maxHeight: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    backgroundColor: colors.surfaceLight,
  },
  langChipText: {
    color: colors.textSecondary,
    fontSize: SIZES.sm,
    ...FONTS.semiBold,
  },
  langChipTextActive: {
    color: colors.white,
  },
  challengeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFC800' + '40',
  },
  challengeBannerDone: {
    borderColor: colors.primary + '40',
    backgroundColor: colors.primary + '10',
  },
  challengeBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  challengeEmoji: { fontSize: 28 },
  challengeTitle: { color: colors.white, fontSize: SIZES.md, ...FONTS.bold },
  challengeSubtitle: { color: colors.textSecondary, fontSize: SIZES.sm, ...FONTS.regular, marginTop: 2 },
  sandboxBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.secondary + '40',
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
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  connectorLocked: {
    backgroundColor: colors.border,
  },
  topicNode: {
    width: '65%',
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    borderWidth: 2,
  },
  topicUnlocked: {
    backgroundColor: colors.surface,
  },
  topicLocked: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
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
    backgroundColor: colors.textMuted,
  },
  topicName: {
    color: colors.white,
    fontSize: SIZES.lg,
    ...FONTS.bold,
    textAlign: 'center',
  },
  topicNameLocked: {
    color: colors.textMuted,
  },
  topicXPRequired: {
    color: colors.textMuted,
    fontSize: SIZES.xs,
    ...FONTS.regular,
    marginTop: 4,
  },
});

export default HomeScreen;
