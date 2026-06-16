import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SIZES, FONTS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import * as api from '../services/api';

const LANGUAGE_COLORS = {
  javascript: '#F7DF1E',
  python: '#3776AB',
  'html-css': '#E34F26',
};

const LANGUAGE_ICONS = {
  javascript: 'logo-javascript',
  python: 'logo-python',
  'html-css': 'code-slash',
};

const OnboardingScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [step, setStep] = useState(0);
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const styles = createStyles(colors);

  const STEPS = [
    {
      key: 'welcome',
      title: 'Bienvenue sur\nDuodingo !',
      subtitle: 'Apprends à coder de façon fun et interactive, comme un jeu.',
      icon: null,
    },
    {
      key: 'how',
      title: 'Comment ça marche ?',
      subtitle: null,
      features: [
        { icon: 'game-controller', color: colors.primary, text: 'Des leçons courtes et interactives' },
        { icon: 'star', color: colors.xp, text: 'Gagne de l\'XP et monte en niveau' },
        { icon: 'flame', color: colors.streak, text: 'Maintiens ta série quotidienne' },
        { icon: 'heart', color: colors.heart, text: '5 vies — chaque erreur en coûte une' },
      ],
    },
    {
      key: 'language',
      title: 'Quel langage\nveux-tu apprendre ?',
      subtitle: 'Tu pourras en changer ou en ajouter d\'autres plus tard.',
    },
  ];

  useEffect(() => {
    api.getLanguages().then(setLanguages).catch(() => {});
  }, []);

  const animateStep = (nextStep) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      animateStep(step + 1);
    }
  };

  const handleFinish = async () => {
    if (selectedLang) {
      await AsyncStorage.setItem('preferredLanguage', selectedLang._id);
    }
    await AsyncStorage.setItem('onboardingDone', 'true');
    navigation.replace('MainTabs');
  };

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Image
          source={require('../../assets/glitch.png')}
          style={styles.mascot}
          resizeMode="contain"
        />

        <Text style={styles.title}>{currentStep.title}</Text>

        {currentStep.subtitle && (
          <Text style={styles.subtitle}>{currentStep.subtitle}</Text>
        )}

        {currentStep.features && (
          <View style={styles.features}>
            {currentStep.features.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={[styles.featureIcon, { backgroundColor: f.color + '20' }]}>
                  <Ionicons name={f.icon} size={22} color={f.color} />
                </View>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        )}

        {currentStep.key === 'language' && (
          <ScrollView style={styles.langList} showsVerticalScrollIndicator={false}>
            {languages.map((lang) => {
              const color = LANGUAGE_COLORS[lang.slug] || colors.primary;
              const icon = LANGUAGE_ICONS[lang.slug] || 'code-outline';
              const isSelected = selectedLang?._id === lang._id;
              return (
                <TouchableOpacity
                  key={lang._id}
                  style={[
                    styles.langCard,
                    isSelected && { borderColor: color, backgroundColor: color + '15' },
                  ]}
                  onPress={() => setSelectedLang(lang)}
                  accessibilityRole="radio"
                  accessibilityLabel={lang.name}
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={[styles.langIconCircle, { backgroundColor: color + '20' }]}>
                    <Ionicons name={icon} size={28} color={color} />
                  </View>
                  <View style={styles.langInfo}>
                    <Text style={[styles.langName, isSelected && { color }]}>{lang.name}</Text>
                    <Text style={styles.langDesc} numberOfLines={2}>{lang.description}</Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={color} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </Animated.View>

      <View style={styles.footer}>
        {isLast ? (
          <TouchableOpacity
            style={[styles.btn, !selectedLang && styles.btnDisabled]}
            onPress={handleFinish}
            disabled={!selectedLang}
            accessibilityRole="button"
            accessibilityLabel="Commencer à apprendre"
            accessibilityState={{ disabled: !selectedLang }}
          >
            <Text style={styles.btnText}>COMMENCER À APPRENDRE</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.btn}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Suivant"
          >
            <Text style={styles.btnText}>SUIVANT</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        )}

        {isLast && (
          <TouchableOpacity
            onPress={handleFinish}
            style={styles.skipBtn}
            accessibilityRole="button"
            accessibilityLabel="Choisir plus tard"
          >
            <Text style={styles.skipText}>Choisir plus tard</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: SIZES.padding,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.surfaceLight,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  mascot: {
    width: 110, height: 110, marginBottom: 24,
    borderRadius: 16,
  },
  title: {
    fontSize: SIZES.xxxl,
    color: colors.white,
    ...FONTS.bold,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    ...FONTS.regular,
    paddingHorizontal: 10,
  },
  features: {
    width: '100%',
    gap: 12,
    marginTop: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: SIZES.radius,
    gap: 14,
  },
  featureIcon: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  featureText: {
    color: colors.white,
    fontSize: SIZES.md,
    ...FONTS.medium,
    flex: 1,
  },
  langList: {
    width: '100%',
    marginTop: 20,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    gap: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  langIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center',
  },
  langInfo: { flex: 1 },
  langName: {
    color: colors.white,
    fontSize: SIZES.lg,
    ...FONTS.bold,
    marginBottom: 4,
  },
  langDesc: {
    color: colors.textSecondary,
    fontSize: SIZES.sm,
    ...FONTS.regular,
  },
  footer: { gap: 12 },
  btn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnDisabled: { backgroundColor: colors.surfaceLight },
  btnText: {
    color: colors.white,
    fontSize: SIZES.lg,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { color: colors.textMuted, fontSize: SIZES.md, ...FONTS.medium },
});

export default OnboardingScreen;
