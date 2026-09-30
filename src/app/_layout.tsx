import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

import { getAuth, onAuthStateChanged, User } from '@react-native-firebase/auth';


SplashScreen.preventAutoHideAsync();

export default function AppLayout() {

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Handle user state changes
  function handleAuthStateChanged(user: User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  if (initializing) return <AnimatedSplashOverlay/>;
  
  return (
    <Stack >
      <Stack.Protected guard={!Boolean(user)}>
        <Stack.Screen name="login" />
      </Stack.Protected>

      <Stack.Protected guard={Boolean(user)}>
        <Stack.Screen name="private" />
      </Stack.Protected>
    </Stack>
  );
}
