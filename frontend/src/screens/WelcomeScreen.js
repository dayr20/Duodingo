import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const WelcomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/glitch.png')}
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Duodingo</Text>
        <Text style={styles.subtitle}>Apprends à coder.{'\n'}Gratuitement. Fun.</Text>
      </View>

      <View style={styles.features}>
        <View style={styles.featureRow}>
          <Ionicons name="game-controller-outline" size={20} color={colors.primary} />
          <Text style={styles.featureText}>Leçons interactives et gamifiées</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="trophy-outline" size={20} color={colors.xp} />
          <Text style={styles.featureText}>Gagne de l'XP et monte en niveau</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="flame-outline" size={20} color={colors.streak} />
          <Text style={styles.featureText}>Garde ta série quotidienne</Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Register')}
          accessibilityRole="button"
          accessibilityLabel="Commencer - créer un compte"
        >
          <Text style={styles.startButtonText}>C'EST PARTI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
          accessibilityLabel="Se connecter avec un compte existant"
        >
          <Text style={styles.loginButtonText}>J'AI DÉJÀ UN COMPTE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 50,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 12,
  },
  mascot: {
    width: 140,
    height: 140,
    borderRadius: 20,
  },
  title: {
    fontSize: 30,
    color: colors.primary,
    ...FONTS.bold,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: SIZES.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    ...FONTS.medium,
  },
  features: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: SIZES.radius,
    gap: 10,
  },
  featureText: {
    color: colors.white,
    fontSize: SIZES.md,
    ...FONTS.medium,
    flex: 1,
  },
  bottomSection: {
    gap: 12,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startButtonText: {
    color: colors.white,
    fontSize: SIZES.lg,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  loginButton: {
    borderWidth: 2,
    borderColor: colors.surfaceLight,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.secondary,
    fontSize: SIZES.lg,
    ...FONTS.bold,
    letterSpacing: 1,
  },
});

export default WelcomeScreen;
