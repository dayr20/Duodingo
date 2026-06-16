import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const SkeletonBox = ({ width, height, borderRadius = 8, style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: COLORS.surfaceLight, opacity },
        style,
      ]}
    />
  );
};

export const HomeScreenSkeleton = () => (
  <View style={styles.container}>
    {/* Challenge banner skeleton */}
    <SkeletonBox width="100%" height={72} borderRadius={SIZES.radius} style={styles.mb16} />
    <SkeletonBox width="100%" height={72} borderRadius={SIZES.radius} style={styles.mb24} />
    {/* Topic nodes */}
    {[0, 1, 2, 3].map((i) => (
      <View key={i} style={[styles.topicRow, i % 2 === 0 ? styles.alignStart : styles.alignEnd]}>
        <SkeletonBox width="65%" height={110} borderRadius={SIZES.radius} />
      </View>
    ))}
  </View>
);

export const LeaderboardSkeleton = () => (
  <View style={styles.container}>
    {/* Podium skeleton */}
    <View style={styles.podiumRow}>
      <SkeletonBox width={80} height={120} borderRadius={SIZES.radius} />
      <SkeletonBox width={80} height={150} borderRadius={SIZES.radius} />
      <SkeletonBox width={80} height={100} borderRadius={SIZES.radius} />
    </View>
    {/* List rows */}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <View key={i} style={styles.listRow}>
        <SkeletonBox width={28} height={28} borderRadius={14} />
        <SkeletonBox width={38} height={38} borderRadius={19} />
        <View style={styles.flex1}>
          <SkeletonBox width="60%" height={14} borderRadius={4} style={styles.mb6} />
          <SkeletonBox width="35%" height={10} borderRadius={4} />
        </View>
        <SkeletonBox width={50} height={20} borderRadius={4} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { padding: SIZES.padding },
  mb6: { marginBottom: 6 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 24,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  flex1: { flex: 1 },
  topicRow: { marginBottom: 20 },
  alignStart: { alignItems: 'flex-start' },
  alignEnd: { alignItems: 'flex-end' },
});

export default SkeletonBox;
