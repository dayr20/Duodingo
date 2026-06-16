import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import * as api from '../services/api';

const ProfileScreen = () => {
  const { user, signOut, updateUser } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();
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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Autorise l\'accès à ta galerie pour choisir une photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      setUploadingAvatar(true);
      try {
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        await api.uploadAvatar(base64);
        updateUser({ avatar: base64 });
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de mettre à jour l\'avatar.');
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handlePickAvatar} disabled={uploadingAvatar}>
          {user?.avatar && user.avatar.startsWith('data:image') ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color={COLORS.primary} />
            </View>
          )}
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{user?.level || 1}</Text>
          </View>
          <View style={styles.avatarEditBadge}>
            {uploadingAvatar
              ? <ActivityIndicator size="small" color={COLORS.white} />
              : <Ionicons name="camera" size={14} color={COLORS.white} />
            }
          </View>
        </TouchableOpacity>
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

      {/* Settings */}
      <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.white }]}>Paramètres</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={colors.secondary} />
            <Text style={[styles.settingLabel, { color: colors.white }]}>
              {isDark ? 'Mode sombre' : 'Mode clair'}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.surfaceLight, true: colors.secondary + '80' }}
            thumbColor={isDark ? colors.secondary : colors.textMuted}
          />
        </View>
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
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    backgroundColor: COLORS.secondary,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
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
  settingsSection: {
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingLabel: {
    fontSize: SIZES.md,
    ...FONTS.medium,
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
