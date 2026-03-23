import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const LeaderboardScreen = () => {
  const { user } = useAuth();

  // Mock leaderboard data for demo
  const leaderboard = [
    { username: 'CodeMaster', xp: 2500, level: 26, streak: 45 },
    { username: 'DevNinja', xp: 2100, level: 22, streak: 30 },
    { username: 'ByteRunner', xp: 1800, level: 19, streak: 21 },
    { username: 'PixelCoder', xp: 1500, level: 16, streak: 15 },
    { username: user?.username || 'Toi', xp: user?.xp || 0, level: user?.level || 1, streak: user?.streak || 0 },
    { username: 'AlgoKing', xp: 1200, level: 13, streak: 12 },
    { username: 'WebWizard', xp: 900, level: 10, streak: 8 },
    { username: 'ScriptKid', xp: 600, level: 7, streak: 5 },
    { username: 'NewCoder', xp: 300, level: 4, streak: 3 },
    { username: 'Beginner01', xp: 100, level: 2, streak: 1 },
  ].sort((a, b) => b.xp - a.xp);

  const getMedalColor = (index) => {
    if (index === 0) return '#FFD700';
    if (index === 1) return '#C0C0C0';
    if (index === 2) return '#CD7F32';
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={28} color={COLORS.xp} />
        <Text style={styles.headerTitle}>Classement</Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {leaderboard.map((player, index) => {
          const isMe = player.username === (user?.username || 'Toi');
          const medalColor = getMedalColor(index);

          return (
            <View
              key={index}
              style={[
                styles.playerCard,
                isMe && styles.playerCardMe,
              ]}
            >
              <View style={styles.rank}>
                {medalColor ? (
                  <Ionicons name="medal" size={24} color={medalColor} />
                ) : (
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                )}
              </View>

              <View style={[styles.playerAvatar, isMe && styles.playerAvatarMe]}>
                <Ionicons name="person" size={20} color={isMe ? COLORS.primary : COLORS.textMuted} />
              </View>

              <View style={styles.playerInfo}>
                <Text style={[styles.playerName, isMe && styles.playerNameMe]}>
                  {player.username} {isMe ? '(Toi)' : ''}
                </Text>
                <View style={styles.playerStats}>
                  <Ionicons name="flame" size={14} color={COLORS.streak} />
                  <Text style={styles.playerStatText}>{player.streak}j</Text>
                  <Text style={styles.playerStatDot}>-</Text>
                  <Text style={styles.playerStatText}>Niv. {player.level}</Text>
                </View>
              </View>

              <View style={styles.playerXP}>
                <Ionicons name="star" size={16} color={COLORS.xp} />
                <Text style={styles.playerXPText}>{player.xp}</Text>
              </View>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 16,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: SIZES.xxl,
    color: COLORS.white,
    ...FONTS.bold,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: SIZES.padding,
    paddingBottom: 100,
    gap: 8,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: SIZES.radius,
    gap: 12,
  },
  playerCardMe: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  rank: {
    width: 30,
    alignItems: 'center',
  },
  rankNumber: {
    color: COLORS.textMuted,
    fontSize: SIZES.lg,
    ...FONTS.bold,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerAvatarMe: {
    backgroundColor: COLORS.primary + '30',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: COLORS.white,
    fontSize: SIZES.md,
    ...FONTS.semiBold,
  },
  playerNameMe: {
    color: COLORS.primary,
  },
  playerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  playerStatText: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    ...FONTS.regular,
  },
  playerStatDot: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
  },
  playerXP: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playerXPText: {
    color: COLORS.xp,
    fontSize: SIZES.md,
    ...FONTS.bold,
  },
});

export default LeaderboardScreen;
