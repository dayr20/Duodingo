import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const HeartsTimer = ({ nextRegenAt, onRegen }) => {
  const { colors } = useTheme();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!nextRegenAt) return;

    const tick = () => {
      const diff = new Date(nextRegenAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('');
        onRegen?.();
        return;
      }
      const totalSeconds = Math.ceil(diff / 1000);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [nextRegenAt]);

  if (!nextRegenAt || !timeLeft) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.warning + '20' }]}>
      <Ionicons name="time-outline" size={14} color={colors.warning} />
      <Text style={[styles.text, { color: colors.warning }]}>{timeLeft}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  text: {
    fontSize: SIZES.xs,
    ...FONTS.bold,
  },
});

export default HeartsTimer;
