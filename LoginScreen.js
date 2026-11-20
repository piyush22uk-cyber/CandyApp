
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

import api from './services/api';
import { auth } from './firebaseConfig';
import './googleAuth';

export default function LoginScreen({
  onSwitchToRegister,
  onLoginSuccess,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check whether the account belongs to a customer
  const isCustomer = (user) => {
    return user?.role?.toLowerCase() === 'customer';
  };


// Save the user session after login
const saveUserSession = async (token, refreshToken, user) => {
  await AsyncStorage.multiSet([
    ["token", token],
    ["refreshToken", refreshToken],
    ["user", JSON.stringify(user)],
  ]);

  onLoginSuccess(user);
};
  // Customer login using email and password
  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Details', 'Please enter your email and password.');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password: password,
      });

      const token = response.data.token;
      const user = response.data.user;

      if (!token || !response.data.refreshToken || !user) {
  Alert.alert('Error', 'Login details were not received.');
  return;
}

      if (!isCustomer(user)) {
        Alert.alert(
          'Access Denied',
          'Only customer accounts can log in to CandyApp.',
        );
        return;
      }

      await saveUserSession(token, response.data.refreshToken, user);
    } catch (error) {
      console.log(
        'Email Login Error:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Unable to log in with email.',
      );
    }
  };

  // Customer login using Google
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const result = await GoogleSignin.signIn();

      if (result.type !== 'success') {
        return;
      }

      const googleIdToken = result.data?.idToken;

      if (!googleIdToken) {
        Alert.alert('Error', 'Google ID token was not received.');
        return;
      }

      const credential =
        GoogleAuthProvider.credential(googleIdToken);

      const resultFirebase = await signInWithCredential(
        auth,
        credential,
      );

      const firebaseIdToken =
        await resultFirebase.user.getIdToken();

      const response = await api.post('/auth/google', {
        idToken: firebaseIdToken,
      });

      const token = response.data.token;
      const user = response.data.user;

      if (!token || !response.data.refreshToken || !user) {
  Alert.alert('Error', 'Google login details were not received.');
  return;
}

      if (!isCustomer(user)) {
        Alert.alert(
          'Access Denied',
          'Only customer accounts can log in to CandyApp.',
        );
        return;
      }

      await saveUserSession(
  response.data.token,
  response.data.refreshToken,
  response.data.user
);
    } catch (error) {
      console.log(
        'Google Login Error:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Google Login Failed',
        error.response?.data?.message ||
          error.message ||
          'Google login failed.',
      );
    }
  };

  // UI starts here
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar
        backgroundColor="#F7FBF4"
        barStyle="dark-content"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoEmoji}>🛒</Text>
            </View>

            <Text style={styles.brandText}>
              Candy<Text style={styles.brandHighlight}>App</Text>
            </Text>
          </View>

          <Text style={styles.tagline}>
            FRESH FOOD  ·  DAILY ESSENTIALS
          </Text>

          <View style={styles.heroRow}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.welcomeText}>
                Welcome{'\n'}Back!
              </Text>

              <Text style={styles.subtitle}>
                Your fresh shopping journey starts here.
              </Text>

              <View style={styles.freshBadge}>
                <Text style={styles.freshBadgeText}>
                  ✨ FRESHNESS AWAITS
                </Text>
              </View>
            </View>

            <View style={styles.heroIllustration}>
              <Text style={styles.heroFruit}>🍎</Text>
              <Text style={styles.heroFruit}>🥑</Text>
              <Text style={styles.heroFruit}>🍊</Text>
              <Text style={styles.heroFruit}>🥬</Text>
            </View>
          </View>
        </View>

        {/* Login card */}
        <View style={styles.loginCard}>
          <Text style={styles.cardHeading}>Sign in to continue</Text>

          <Text style={styles.cardSubtitle}>
            Your favorite groceries are just a step away.
          </Text>

          {/* Email input */}
          <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>✉</Text>

            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#96A49A"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password input */}
          <Text style={styles.inputLabel}>PASSWORD</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>

            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#96A49A"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Login button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.82}
          >
            <Text style={styles.loginButtonText}>
              Login to CandyApp
            </Text>

            <Text style={styles.loginArrow}>→</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google login */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.googleG}>G</Text>

            <Text style={styles.googleButtonText}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>
              New to CandyApp?
            </Text>

            <TouchableOpacity
              onPress={onSwitchToRegister}
              activeOpacity={0.7}
            >
              <Text style={styles.registerLink}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer note */}
          <View style={styles.trustRow}>
            <Text style={styles.trustIcon}>✓</Text>

            <Text style={styles.trustText}>
              Fresh choices. Easy shopping. Every day.
            </Text>
          </View>
        </View>

        <Text style={styles.footerText}>
          MADE FRESH FOR YOU  💚
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7FBF4',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 18 : 28,
    paddingBottom: 24,
  },

  header: {
    marginBottom: 24,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E1F5DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  logoEmoji: {
    fontSize: 27,
  },

  brandText: {
    fontSize: 29,
    fontWeight: '900',
    color: '#155B35',
    letterSpacing: -1,
  },

  brandHighlight: {
    color: '#F18A35',
  },

  tagline: {
    marginTop: 10,
    color: '#718475',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
  },

  heroTextContainer: {
    flex: 1,
    paddingRight: 8,
  },

  welcomeText: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '900',
    color: '#153C28',
    letterSpacing: -1.2,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#697B70',
    marginTop: 9,
    maxWidth: 230,
  },

  freshBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5F5E2',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },

  freshBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#218348',
    letterSpacing: 0.5,
  },

  heroIllustration: {
    width: 112,
    height: 112,
    borderRadius: 36,
    backgroundColor: '#E7F5D9',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    transform: [{ rotate: '4deg' }],
  },

  heroFruit: {
    fontSize: 34,
    margin: 1,
  },

  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#EAF1E8',
    elevation: 5,
    shadowColor: '#244A2E',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
  },

  cardHeading: {
    fontSize: 23,
    fontWeight: '900',
    color: '#193E2A',
  },

  cardSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#859187',
    marginTop: 6,
    marginBottom: 23,
  },

  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#526D5A',
    letterSpacing: 1.1,
    marginBottom: 9,
  },

  inputWrapper: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#DFEAE0',
    borderRadius: 15,
    backgroundColor: '#F9FCF8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 19,
  },

  inputIcon: {
    fontSize: 19,
    width: 30,
    color: '#25834A',
  },

  input: {
    flex: 1,
    color: '#203C2B',
    fontSize: 14,
    paddingVertical: 14,
  },

  loginButton: {
    minHeight: 57,
    backgroundColor: '#168044',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 3,
    elevation: 4,
    shadowColor: '#168044',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  loginArrow: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 12,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 23,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E7ECE7',
  },

  dividerText: {
    color: '#98A49B',
    fontSize: 11,
    fontWeight: '800',
    marginHorizontal: 13,
  },

  googleButton: {
    minHeight: 55,
    borderWidth: 1,
    borderColor: '#DDE5DE',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  googleG: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4285F4',
    marginRight: 11,
  },

  googleButtonText: {
    color: '#2D4034',
    fontSize: 13,
    fontWeight: '700',
  },

  registerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  registerPrompt: {
    color: '#78857B',
    fontSize: 12,
    marginRight: 5,
  },

  registerLink: {
    color: '#168044',
    fontSize: 12,
    fontWeight: '900',
    paddingVertical: 5,
  },

  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EFF3EE',
    paddingTop: 17,
    marginTop: 18,
  },

  trustIcon: {
    color: '#168044',
    fontSize: 13,
    fontWeight: '900',
    marginRight: 7,
  },

  trustText: {
    color: '#829084',
    fontSize: 10,
    fontWeight: '600',
  },

  footerText: {
    textAlign: 'center',
    color: '#92A28F',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 20,
  },
});
