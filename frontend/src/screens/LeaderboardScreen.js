import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import * as api from '../services/api';
import { LeaderboardSkeleton } from '../components/SkeletonLoader';

const LeaderboardScreen = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const styles = createStyles(colors);

  const loadLeaderboard = async () => {
    try {
      const data = await api.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.log('Erreur classement:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  }, []);

  const getMedalColor = (rank) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return null;
  };

  const getAvatarColor = (username) => {
    const colorList = [colors.primary, colors.secondary, '#CE82FF', colors.streak, '#FF4B4B'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) hash += username.charCodeAt(i);
    return colorList[hash % colorList.length];
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="trophy" size={28} color={colors.xp} />
          <Text style={styles.headerTitle}>Classement</Text>
        </View>
        <LeaderboardSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={28} color={colors.xp} />
        <Text style={styles.headerTitle}>Classement</Text>
        <Text style={styles.headerSub}>Cette semaine</Text>
      </View>

      {leaderboard.length >= 3 && (
        <View style={styles.podium}>
          <View style={[styles.podiumItem, styles.podiumSecond]}>
            <View style={[styles.podiumAvatar, { backgroundColor: getAvatarColor(leaderboard[1]?.username || '') }]}>
              <Text style={styles.podiumAvatarText}>
                {(leaderboard[1]?.username || '?')[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.podiumMedal}>🥈</Text>
            <Text style={styles.podiumName} numberOfLines={1}>{leaderboard[1]?.username}</Text>
            <Text style={styles.podiumXP}>{leaderboard[1]?.xp} XP</Text>
            <View style={[styles.podiumBar, styles.podiumBarSecond]} />
          </View>

          <View style={[styles.podiumItem, styles.podiumFirst]}>
            <View style={[styles.podiumAvatar, styles.podiumAvatarFirst, { backgroundColor: getAvatarColor(leaderboard[0]?.username || '') }]}>
              <Text style={[styles.podiumAvatarText, { fontSize: 22 }]}>
                {(leaderboard[0]?.username || '?')[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.podiumMedal}>🥇</Text>
            <Text style={[styles.podiumName, { color: '#FFD700' }]} numberOfLines={1}>{leaderboard[0]?.username}</Text>
            <Text style={[styles.podiumXP, { color: '#FFD700' }]}>{leaderboard[0]?.xp} XP</Text>
            <View style={[styles.podiumBar, styles.podiumBarFirst]} />
          </View>

          <View style={[styles.podiumItem, styles.podiumThird]}>
            <View style={[styles.podiumAvatar, { backgroundColor: getAvatarColor(leaderboard[2]?.username || '') }]}>
              <Text style={styles.podiumAvatarText}>
                {(leaderboard[2]?.username || '?')[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.podiumMedal}>🥉</Text>
            <Text style={styles.podiumName} numberOfLines={1}>{leaderboard[2]?.username}</Text>
            <Text style={styles.podiumXP}>{leaderboard[2]?.xp} XP</Text>
            <View style={[styles.podiumBar, styles.podiumBarThird]} />
          </View>
        </View>
      )}

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {leaderboard.map((player) => {
          const medalColor = getMedalColor(player.rank);
          return (
            <View
              key={player.username}
              style={[styles.playerCard, player.isMe && styles.playerCardMe]}
            >
              <View style={styles.rank}>
                {medalColor ? (
                  <Ionicons name="medal" size={22} color={medalColor} />
                ) : (
                  <Text style={[styles.rankNumber, player.isMe && { color: colors.secondary }]}>
                    {player.rank}
                  </Text>
                )}
              </View>

              <View style={[styles.playerAvatar, { backgroundColor: getAvatarColor(player.username) + '30' }]}>
                <Text style={[styles.playerAvatarText, { color: getAvatarColor(player.username) }]}>
                  {player.username[0].toUpperCase()}
                </Text>
              </View>

              <View style={styles.playerInfo}>
                <Text style={[styles.playerName, player.isMe && styles.playerNameMe]}>
                  {player.username}{player.isMe ? ' (Toi)' : ''}
                </Text>
                <View style={styles.playerStats}>
                  <Ionicons name="flame" size={12} color={colors.streak} />
                  <Text style={styles.playerStatText}>{player.streak}j</Text>
                  <Text style={styles.playerStatDot}>·</Text>
                  <Text style={styles.playerStatText}>Niv. {player.level}</Text>
                </View>
              </View>

              <View style={styles.playerXP}>
                <Ionicons name="star" size={14} color={colors.xp} />
                <Text style={styles.playerXPText}>{player.xp}</Text>
              </View>
            </View>
          );
        })}

        {leaderboard.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="trophy-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>Sois le premier à rejoindre le classement !</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 16,
    backgroundColor: colors.surface,
  },
  headerTitle: { fontSize: SIZES.xxl, color: colors.white, ...FONTS.bold, flex: 1 },
  headerSub: { fontSize: SIZES.sm, color: colors.textMuted, ...FONTS.medium },

  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    paddingBottom: 0,
    backgroundColor: colors.surface,
    gap: 8,
  },
  podiumItem: { alignItems: 'center', flex: 1 },
  podiumFirst: { marginBottom: 0 },
  podiumSecond: { marginBottom: -10 },
  podiumThird: { marginBottom: -20 },
  podiumAvatar: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  podiumAvatarFirst: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#FFD700' },
  podiumAvatarText: { color: '#fff', fontSize: 18, ...FONTS.bold },
  podiumMedal: { fontSize: 18, marginBottom: 2 },
  podiumName: { color: colors.white, fontSize: SIZES.xs, ...FONTS.semiBold, textAlign: 'center' },
  podiumXP: { color: colors.xp, fontSize: SIZES.xs, ...FONTS.bold, marginBottom: 4 },
  podiumBar: { width: '100%', borderRadius: 4 },
  podiumBarFirst: { height: 60, backgroundColor: colors.primary + '40' },
  podiumBarSecond: { height: 45, backgroundColor: '#C0C0C020' },
  podiumBarThird: { height: 30, backgroundColor: '#CD7F3220' },

  list: { flex: 1 },
  listContent: { padding: SIZES.padding, paddingBottom: 100, gap: 8 },
  playerCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12, borderRadius: SIZES.radius, gap: 10,
  },
  playerCardMe: {
    backgroundColor: colors.secondary + '15',
    borderWidth: 1, borderColor: colors.secondary,
  },
  rank: { width: 28, alignItems: 'center' },
  rankNumber: { color: colors.textMuted, fontSize: SIZES.lg, ...FONTS.bold },
  playerAvatar: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: 'center', alignItems: 'center',
  },
  playerAvatarText: { fontSize: SIZES.md, ...FONTS.bold },
  playerInfo: { flex: 1 },
  playerName: { color: colors.white, fontSize: SIZES.md, ...FONTS.semiBold },
  playerNameMe: { color: colors.secondary },
  playerStats: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  playerStatText: { color: colors.textMuted, fontSize: SIZES.xs },
  playerStatDot: { color: colors.textMuted, fontSize: SIZES.xs },
  playerXP: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  playerXPText: { color: colors.xp, fontSize: SIZES.md, ...FONTS.bold },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: colors.textMuted, fontSize: SIZES.md, textAlign: 'center' },
});

export default LeaderboardScreen;
