import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CallProvider } from '../contexts/CallContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <CallProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="welcomeScreen">
          <Stack.Screen name="welcomeScreen" options={{ headerShown: false }} />
          <Stack.Screen name="signUp" options={{ headerShown: false }} />
          <Stack.Screen name="loginScreen" options={{ headerShown: false }} />
          <Stack.Screen name="codeVerification" options={{ headerShown: false }} />
          <Stack.Screen name="forgotPassword" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="additionScreen" options={{ headerShown: false }} />
          <Stack.Screen name="template" options={{ headerShown: false }} />
          <Stack.Screen name="template2" options={{ headerShown: false }} />
          <Stack.Screen name="createServer" options={{ headerShown: false }} />
          <Stack.Screen name="createChannel" options={{ headerShown: false }} />
          <Stack.Screen name="hub" options={{ headerShown: false }} />
          <Stack.Screen name="Token" options={{ headerShown: false }} />
          <Stack.Screen name="friendsScreen" options={{ headerShown: false }} />
          <Stack.Screen name="addFriends" options={{ headerShown: false }} />
          <Stack.Screen name="privatechat" options={{ headerShown: false }} />
          <Stack.Screen name="groupchat" options={{ headerShown: false }} />
          <Stack.Screen name="sendfriendrequest" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="Account" options={{ headerShown: false }} />
          <Stack.Screen name="serverDetails" options={{ headerShown: false }} />
          <Stack.Screen name="CalendarScreen" options={{ headerShown: false }} />
          <Stack.Screen name="search" options={{ headerShown: false }} />
          <Stack.Screen name="inviteFriend" options={{ headerShown: false }} />
          <Stack.Screen name="(modal)" options={{ presentation: 'modal' }} />
          <Stack.Screen name="not-found" options={{ title: 'Oops!' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CallProvider>
  );
}
