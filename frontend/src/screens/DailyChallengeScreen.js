import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import * as api from '../services/api';
import ConfettiAnimation from '../components/ConfettiAnimation';

const LANG_COLORS = { javascript: '#F7DF1E', python: '#3776AB', 'html-css': '#E34F26' };
const LANG_ICONS = { javascript: 'logo-javascript', python: 'logo-python', 'html-css': 'code-slash' };

const DailyChallengeScreen = ({ navigation }) => {
  const { updateUser } = useAuth();
  const { colors } = useTheme();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const styles = createStyles(colors);

  useEffect(() => {
    loadChallenge();
  }, []);

  const loadChallenge = async () => {
    try {
      const data = await api.getTodayChallenge();
      setChallenge(data);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    } catch (err) {
      console.log('Erreur défi:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selected) return;
    try {
      const data = await api.completeChallenge(selected);
      setResult(data);
      if (data.correct) {
        setShowConfetti(true);
        updateUser({ xp: data.totalXP, level: data.level });
      }
    } catch (err) {
      if (err.message.includes('déjà complété')) {
        setResult({ correct: true, explanation: 'Tu as déjà complété ce défi aujourd\'hui !', xpEarned: 0 });
      }
    }
  };

  const langColor = challenge ? (LANG_COLORS[challenge.language] || colors.primary) : colors.primary;
  const langIcon = challenge ? (LANG_ICONS[challenge.language] || 'code-outline') : 'code-outline';

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={styles.centered}>
        <Ionicons name="wifi-outline" size={48} color={colors.textMuted} />
        <Text style={styles.emptyText}>Impossible de charger le défi.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadChallenge}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ConfettiAnimation active={showConfetti} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>DÉFI DU JOUR</Text>
          <Text style={styles.headerDate}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
        </View>
        <View style={styles.xpBadge}>
          <Ionicons name="star" size={14} color={colors.xp} />
          <Text style={styles.xpBadgeText}>+{challenge.xpReward} XP</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          <View style={[styles.challengeCard, { borderColor: langColor + '60' }]}>
            <View style={styles.challengeTop}>
              <View style={[styles.langBadge, { backgroundColor: langColor + '20' }]}>
                <Ionicons name={langIcon} size={16} color={langColor} />
                <Text style={[styles.langText, { color: langColor }]}>
                  {challenge.language === 'html-css' ? 'HTML/CSS' : challenge.language.charAt(0).toUpperCase() + challenge.language.slice(1)}
                </Text>
              </View>
              {challenge.completed && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  <Text style={styles.completedText}>Complété</Text>
                </View>
              )}
            </View>

            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDesc}>{challenge.description}</Text>

            {challenge.codeSnippet && (
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>{challenge.codeSnippet}</Text>
              </View>
            )}

            <Text style={styles.question}>{challenge.question}</Text>
          </View>

          {!result && (
            <View style={styles.options}>
              {challenge.options.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.optionCard,
                    selected === opt.text && styles.optionSelected,
                  ]}
                  onPress={() => !challenge.completed && setSelected(opt.text)}
                  disabled={challenge.completed}
                  accessibilityRole="radio"
                  accessibilityLabel={opt.text}
                  accessibilityState={{ selected: selected === opt.text }}
                >
                  <View style={[styles.optionDot, selected === opt.text && styles.optionDotSelected]} />
                  <Text style={[styles.optionText, selected === opt.text && styles.optionTextSelected]}>
                    {opt.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {result && (
            <View style={[styles.resultCard, result.correct ? styles.resultCorrect : styles.resultWrong]}>
              <View style={styles.resultHeader}>
                <Ionicons
                  name={result.correct ? 'checkmark-circle' : 'close-circle'}
                  size={32}
                  color={result.correct ? colors.primary : colors.error}
                />
                <Text style={[styles.resultTitle, { color: result.correct ? colors.primary : colors.error }]}>
                  {result.correct ? (result.xpEarned > 0 ? `Excellent ! +${result.xpEarned} XP` : 'Déjà complété !') : 'Pas tout à fait…'}
                </Text>
              </View>
              <Text style={styles.resultExplanation}>{result.explanation}</Text>
            </View>
          )}

          <View style={styles.statsRow}>
            <Ionicons name="people-outline" size={16} color={colors.textMuted} />
            <Text style={styles.statsText}>{challenge.completedCount || 0} joueur(s) ont complété ce défi</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        {!result && !challenge.completed ? (
          <TouchableOpacity
            style={[styles.submitBtn, !selected && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!selected}
            accessibilityRole="button"
            accessibilityLabel="Valider ma réponse"
            accessibilityState={{ disabled: !selected }}
          >
            <Text style={styles.submitBtnText}>VALIDER</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Retour à l'accueil"
          >
            <Text style={styles.doneBtnText}>RETOUR À L'ACCUEIL</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, gap: 16 },
  emptyText: { color: colors.textMuted, fontSize: SIZES.md, ...FONTS.medium },
  retryBtn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: SIZES.radius },
  retryText: { color: colors.white, ...FONTS.bold },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    gap: 12,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1 },
  headerLabel: { color: colors.primary, fontSize: SIZES.xs, ...FONTS.bold, letterSpacing: 1.5 },
  headerDate: { color: colors.white, fontSize: SIZES.md, ...FONTS.semiBold, textTransform: 'capitalize' },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.xp + '20', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  xpBadgeText: { color: colors.xp, fontSize: SIZES.sm, ...FONTS.bold },

  scroll: { flex: 1 },
  scrollContent: { padding: SIZES.padding, paddingBottom: 120 },

  challengeCard: {
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  challengeTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  langBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  langText: { fontSize: SIZES.xs, ...FONTS.bold },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  completedText: { color: colors.primary, fontSize: SIZES.xs, ...FONTS.medium },
  challengeTitle: { color: colors.white, fontSize: SIZES.xl, ...FONTS.bold, marginBottom: 8 },
  challengeDesc: { color: colors.textSecondary, fontSize: SIZES.md, ...FONTS.regular, lineHeight: 22, marginBottom: 16 },
  codeBlock: {
    backgroundColor: '#0D1B21',
    borderRadius: SIZES.radiusSmall,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  codeText: { color: colors.secondary, fontFamily: 'monospace', fontSize: SIZES.sm, lineHeight: 20 },
  question: { color: colors.white, fontSize: SIZES.lg, ...FONTS.semiBold, lineHeight: 24 },

  options: { gap: 10, marginBottom: 20 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 12,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  optionDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.textMuted },
  optionDotSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  optionText: { color: colors.white, fontSize: SIZES.md, ...FONTS.medium, flex: 1 },
  optionTextSelected: { color: colors.primary, ...FONTS.semiBold },

  resultCard: {
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  resultCorrect: { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' },
  resultWrong: { backgroundColor: colors.error + '15', borderColor: colors.error + '40' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  resultTitle: { fontSize: SIZES.lg, ...FONTS.bold, flex: 1 },
  resultExplanation: { color: colors.textSecondary, fontSize: SIZES.md, ...FONTS.regular, lineHeight: 22 },

  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statsText: { color: colors.textMuted, fontSize: SIZES.sm, ...FONTS.regular },

  footer: { padding: SIZES.padding, paddingBottom: 40, backgroundColor: colors.background },
  submitBtn: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: SIZES.radius, alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: colors.surfaceLight },
  submitBtnText: { color: colors.white, fontSize: SIZES.lg, ...FONTS.bold, letterSpacing: 1 },
  doneBtn: { backgroundColor: colors.surface, paddingVertical: 16, borderRadius: SIZES.radius, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  doneBtnText: { color: colors.white, fontSize: SIZES.lg, ...FONTS.bold, letterSpacing: 1 },
});

export default DailyChallengeScreen;
