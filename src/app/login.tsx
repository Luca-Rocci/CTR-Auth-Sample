import * as Device from 'expo-device';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import {
  GoogleOneTapSignIn,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
} from 'react-native-nitro-google-signin';
import { useState } from 'react';

export default function HomeScreen() {

  const [response, setResponse] = useState({});
  const [data, setData] = useState<String | null>(null);
  const [type, setType] = useState({});
  const [user, setUser] = useState<String | null>(null);
  const [step, setStep] = useState('initial');
/*
  // Somewhere in your code
const signIn = async () => {
  setStep('initial');
  //GoogleSignin.configure({webClientId: '813915762807-39qj55ikpmf7p1v8ispa1qbp65vdrlpp.apps.googleusercontent.com',});
  // With google-services.json + GoogleService-Info.plist (recommended):
GoogleOneTapSignIn.configure({ webClientId: 'autoDetect' })
  setStep('configure ok');
  console.log('Starting sign in process');
  try {
    await GoogleSignin.hasPlayServices();
    setStep('hasPlayServices ok');
    const response = await GoogleSignin.signIn();
    setStep('signIn ok');
    setResponse(response);
    setData(response.data || {});
    setType(response.type);
    setUser(response.data);
    if (isSuccessResponse(response)) {
      setStep('isSuccessResponse ok');
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(response.data.idToken);
      setStep('googleCredential ok');
      // Sign-in the user with the credential
      await signInWithCredential(getAuth(), googleCredential);
      setStep('signInWithCredential ok');

    } else {
      setStep('isSuccessResponse failed');
    }
    console.log('Starting sign in xx...');
  } catch (error) {
    console.log('errr', error);
    setStep('error caught');
    setData(JSON.stringify(error));

    if (isErrorWithCode(error)) {
          setStep(error.code);
              setType(error.message);
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          setStep('in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // Android only, play services not available or outdated
          setStep('play services not available');
          break;
        default:
        // some other error happened
  
      }
    } else {
      setStep('unknown error');
      // an error that's not related to google sign in occurred
    }
  }
}; */

const signIn = async () => {
    setStep('initial');
  await GoogleOneTapSignIn.checkPlayServices()
setStep('hasPlayServices ok');
  let response = await GoogleOneTapSignIn.signIn()
    setStep('signIn ok');
    setResponse(response);
    //setData(response.data || {});
    setType(response.type);

  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.createAccount()
  }
  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.presentExplicitSignIn()
  }

  if (isSuccessResponse(response)) {
          setStep('isSuccessResponse ok');
    const { user, idToken } = response.data
    // Send idToken to your backend for verification
    console.log(user.email, idToken)
        setType(idToken);
    setData(user.email);
  }
}

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Welcome to&nbsp;Expo
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          get started
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow title="Auth" hint={<ThemedText type="code">CTR Auth</ThemedText>} />
        </ThemedView>
        <View>
          <Text>Step:</Text>
          <Text>{step}</Text>
        </View>
        <View>
          <Pressable onPress={signIn}><ThemedText type="code">Sign In</ThemedText></Pressable>
        </View>
        <View>
          <Text>response:</Text>
          <Text>{JSON.stringify(response)}</Text>
        </View>
        <View>
          <Text>data:</Text>
          <Text>{JSON.stringify(data)}</Text>
        </View>
        <View>
          <Text>type:</Text>
          <Text>{JSON.stringify(type)}</Text>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
