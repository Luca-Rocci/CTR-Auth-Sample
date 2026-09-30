import { Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { getAuth, signOut, onAuthStateChanged } from '@react-native-firebase/auth';

export default function TabTwoScreen() {


    const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  // Handle user state changes
  function handleAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  if (initializing) return null;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.contentContainer]}>
       <Text>Welcome {user.email}</Text>
       <Pressable onPress={() => signOut(getAuth()).then(() => console.log('User signed out!'))}><Text>logout</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
 
});
