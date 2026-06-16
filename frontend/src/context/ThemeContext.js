import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIGHT = {
  primary: '#58CC02',
  primaryDark: '#46A302',
  secondary: '#1CB0F6',
  background: '#FFFFFF',
  surface: '#F4F4F4',
  surfaceLight: '#E8E8E8',
  white: '#1A1A1A',
  text: '#1A1A1A',
  textSecondary: '#555555',
  textMuted: '#999999',
  error: '#FF4B4B',
  warning: '#FFC800',
  success: '#58CC02',
  xp: '#E5A800',
  heart: '#FF4B4B',
  streak: '#FF9600',
  javascript: '#F7DF1E',
  python: '#3776AB',
  html: '#E34F26',
  border: '#DDDDDD',
  overlay: 'rgba(0,0,0,0.3)',
};

const DARK = {
  primary: '#58CC02',
  primaryDark: '#46A302',
  secondary: '#1CB0F6',
  background: '#131F24',
  surface: '#1A2C34',
  surfaceLight: '#233A44',
  white: '#FFFFFF',
  text: '#FFFFFF',
  textSecondary: '#AFAFAF',
  textMuted: '#777777',
  error: '#FF4B4B',
  warning: '#FFC800',
  success: '#58CC02',
  xp: '#FFC800',
  heart: '#FF4B4B',
  streak: '#FF9600',
  javascript: '#F7DF1E',
  python: '#3776AB',
  html: '#E34F26',
  border: '#37464F',
  overlay: 'rgba(0,0,0,0.5)',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('theme').then((saved) => {
      if (saved !== null) setIsDark(saved === 'dark');
    });
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const colors = isDark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
