import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = ['#58CC02', '#1CB0F6', '#FFC800', '#FF4B4B', '#CE82FF', '#FF9600'];
const PIECES = 30;

const randomBetween = (a, b) => Math.random() * (b - a) + a;

const Piece = ({ delay }) => {
  const x = useRef(new Animated.Value(randomBetween(0, width))).current;
  const y = useRef(new Animated.Value(-20)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size = randomBetween(6, 12);
  const duration = randomBetween(1200, 2200);
  const isCircle = Math.random() > 0.5;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(y, { toValue: height + 30, duration, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: randomBetween(-4, 4) * Math.PI, duration, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: duration * 0.3, delay: duration * 0.7, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        width: size,
        height: isCircle ? size : size * 1.6,
        backgroundColor: color,
        borderRadius: isCircle ? size / 2 : 2,
        opacity,
        transform: [
          { translateY: y },
          { rotate: rotate.interpolate({ inputRange: [-10, 10], outputRange: ['-10rad', '10rad'] }) },
        ],
      }}
    />
  );
};

const ConfettiAnimation = ({ active }) => {
  if (!active) return null;
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {Array.from({ length: PIECES }).map((_, i) => (
        <Piece key={i} delay={i * 60} />
      ))}
    </View>
  );
};

export default ConfettiAnimation;
