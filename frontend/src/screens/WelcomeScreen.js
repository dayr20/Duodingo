import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="code-slash" size={60} color={COLORS.primary} />
          </View>
        </View>
        <Text style={styles.title}>Duodingo</Text>
        <Text style={styles.subtitle}>Apprends à coder.{'\n'}Gratuitement. Fun.</Text>
      </View>

      <View style={styles.features}>
        <View style={styles.featureRow}>
          <Ionicons name="game-controller-outline" size={24} color={COLORS.primary} />
          <Text style={styles.featureText}>Leçons interactives et gamifiées</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="trophy-outline" size={24} color={COLORS.xp} />
          <Text style={styles.featureText}>Gagne de l'XP et monte en niveau</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="flame-outline" size={24} color={COLORS.streak} />
          <Text style={styles.featureText}>Garde ta série quotidienne</Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.startButtonText}>C'EST PARTI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>J'AI DÉJÀ UN COMPTE</Text>
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
    paddingHorizontal: SIZES.padding * 1.5,
    paddingTop: 60,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  title: {
    fontSize: SIZES.title,
    color: COLORS.primary,
    ...FONTS.bold,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: SIZES.xl,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    ...FONTS.medium,
  },
  features: {
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: SIZES.radius,
    gap: 12,
  },
  featureText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    ...FONTS.medium,
    flex: 1,
  },
  bottomSection: {
    gap: 12,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  loginButton: {
    borderWidth: 2,
    borderColor: COLORS.surfaceLight,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  loginButtonText: {
    color: COLORS.secondary,
    fontSize: SIZES.lg,
    ...FONTS.bold,
    letterSpacing: 1,
  },
});

export default WelcomeScreen;
