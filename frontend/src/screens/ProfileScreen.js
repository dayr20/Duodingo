import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      console.log('Erreur stats:', error.message);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Es-tu sûr de vouloir te déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', onPress: signOut, style: 'destructive' },
      ]
    );
  };

  const getXPForNextLevel = () => {
    const currentLevelXP = ((user?.level || 1) - 1) * 100;
    const nextLevelXP = (user?.level || 1) * 100;
    const progress = ((user?.xp || 0) - currentLevelXP) / (nextLevelXP - currentLevelXP);
    return { progress: Math.min(progress, 1), remaining: nextLevelXP - (user?.xp || 0) };
  };

  const { progress: levelProgress, remaining } = getXPForNextLevel();

  const avatarIcons = ['person', 'code-slash', 'rocket', 'game-controller', 'bug', 'terminal'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color={COLORS.primary} />
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{user?.level || 1}</Text>
          </View>
        </View>
        <Text style={styles.username}>{user?.username || 'Codeur'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </View>

      {/* XP Progress */}
      <View style={styles.xpCard}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpTitle}>Niveau {user?.level || 1}</Text>
          <Text style={styles.xpRemaining}>{remaining} XP restants</Text>
        </View>
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${levelProgress * 100}%` }]} />
        </View>
        <Text style={styles.xpTotal}>{user?.xp || 0} XP total</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderColor: COLORS.streak }]}>
          <Ionicons name="flame" size={32} color={COLORS.streak} />
          <Text style={styles.statNumber}>{user?.streak || 0}</Text>
          <Text style={styles.statLabel}>Jours de série</Text>
        </View>

        <View style={[styles.statCard, { borderColor: COLORS.xp }]}>
          <Ionicons name="star" size={32} color={COLORS.xp} />
          <Text style={styles.statNumber}>{user?.xp || 0}</Text>
          <Text style={styles.statLabel}>XP Total</Text>
        </View>

        <View style={[styles.statCard, { borderColor: COLORS.heart }]}>
          <Ionicons name="heart" size={32} color={COLORS.heart} />
          <Text style={styles.statNumber}>{user?.hearts || 5}</Text>
          <Text style={styles.statLabel}>Vies</Text>
        </View>

        <View style={[styles.statCard, { borderColor: COLORS.secondary }]}>
          <Ionicons name="book" size={32} color={COLORS.secondary} />
          <Text style={styles.statNumber}>
            {stats?.totalLessonsCompleted || 0}
          </Text>
          <Text style={styles.statLabel}>Leçons faites</Text>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges</Text>
        {stats?.achievements && stats.achievements.length > 0 ? (
          <View style={styles.achievementsList}>
            {stats.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={styles.achievementName}>{achievement.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyAchievements}>
            <Ionicons name="trophy-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>
              Complète des leçons pour débloquer des badges !
            </Text>
          </View>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  levelText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    ...FONTS.bold,
  },
  username: {
    fontSize: SIZES.xxl,
    color: COLORS.white,
    ...FONTS.bold,
  },
  email: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    ...FONTS.regular,
    marginTop: 4,
  },
  xpCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: SIZES.radius,
    marginBottom: 20,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  xpTitle: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    ...FONTS.bold,
  },
  xpRemaining: {
    color: COLORS.xp,
    fontSize: SIZES.sm,
    ...FONTS.medium,
  },
  xpBar: {
    height: 10,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpFill: {
    height: '100%',
    backgroundColor: COLORS.xp,
    borderRadius: 5,
  },
  xpTotal: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    ...FONTS.regular,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: SIZES.xl,
    ...FONTS.bold,
    marginBottom: 12,
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementName: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    ...FONTS.medium,
    textAlign: 'center',
  },
  emptyAchievements: {
    backgroundColor: COLORS.surface,
    padding: 30,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: SIZES.md,
    ...FONTS.regular,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.error + '40',
  },
  logoutText: {
    color: COLORS.error,
    fontSize: SIZES.lg,
    ...FONTS.semiBold,
  },
});

export default ProfileScreen;
