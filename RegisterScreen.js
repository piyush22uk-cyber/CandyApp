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
import api from './services/api';

export default function RegisterScreen({
  onSwitchToLogin,
  onRegisterSuccess,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register a new customer account
  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert(
        'Missing Details',
        'Please complete all fields.',
      );
      return;
    }

    if (password.length < 10) {
      Alert.alert(
        'Weak Password',
        'Your password must be at least 10 characters long.',
      );
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

     const token = response.data.token;
const refreshToken = response.data.refreshToken;
const user = response.data.user;

      if (!token || !refreshToken || !user) {
  Alert.alert(
    'Registration Error',
    'Account details were not received. Please try again.',
  );
  return;
}
      await AsyncStorage.multiSet([
        ['token', token],
        ['refreshToken', refreshToken],
        ['user', JSON.stringify(user)],
      ]);

      Alert.alert(
        'Welcome to CandyApp!',
        'Your account has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => onRegisterSuccess(user),
          },
        ],
      );
    } catch (error) {
      console.log(
        'Registration Error:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Registration Failed',
        error.response?.data?.message ||
          'Unable to create your account. Please try again.',
      );
    }
  };

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
        {/* Brand Header */}
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

          {/* Welcome Section */}
          <View style={styles.heroRow}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.welcomeTitle}>
                Join the{'\n'}Fresh Side!
              </Text>

              <Text style={styles.subtitle}>
                Good food, great choices, and a happier basket.
              </Text>
            </View>

            <View style={styles.illustrationBox}>
              <Text style={styles.fruit}>🍎</Text>
              <Text style={styles.fruit}>🥑</Text>
              <Text style={styles.fruit}>🍊</Text>
              <Text style={styles.fruit}>🥬</Text>
            </View>
          </View>
        </View>

        {/* Registration Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Create Your Account
          </Text>

          <Text style={styles.cardSubtitle}>
            A fresh shopping experience starts here.
          </Text>

          {/* Full Name */}
          <Text style={styles.inputLabel}>FULL NAME</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>👤</Text>

            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#98A69B"
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Email Address */}
          <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>✉</Text>

            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#98A69B"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <Text style={styles.inputLabel}>PASSWORD</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>

            <TextInput
              placeholder="Create a strong password"
              placeholderTextColor="#98A69B"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.passwordHint}>
            Use at least 10 characters.
          </Text>

          {/* Create Account Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            activeOpacity={0.82}
          >
            <Text style={styles.registerButtonText}>
              Create My Account
            </Text>

            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>

          {/* Login Navigation */}
          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={onSwitchToLogin}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Message */}
          <View style={styles.footerBadge}>
            <Text style={styles.footerIcon}>💚</Text>

            <Text style={styles.footerMessage}>
              Fresh choices. Happy shopping.
            </Text>
          </View>
        </View>

        <Text style={styles.bottomText}>
          YOUR FRESH JOURNEY STARTS HERE
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

  welcomeTitle: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '900',
    color: '#153C28',
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#697B70',
    marginTop: 9,
  },

  illustrationBox: {
    width: 105,
    height: 105,
    borderRadius: 34,
    backgroundColor: '#E7F5D9',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    transform: [{ rotate: '4deg' }],
  },

  fruit: {
    fontSize: 32,
    margin: 1,
  },

  card: {
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

  cardTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: '#193E2A',
  },

  cardSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#859187',
    marginTop: 6,
    marginBottom: 22,
  },

  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#526D5A',
    letterSpacing: 1.1,
    marginBottom: 9,
  },

  inputWrapper: {
    minHeight: 55,
    borderWidth: 1,
    borderColor: '#DFEAE0',
    borderRadius: 15,
    backgroundColor: '#F9FCF8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 17,
  },

  inputIcon: {
    fontSize: 18,
    width: 31,
  },

  input: {
    flex: 1,
    color: '#203C2B',
    fontSize: 14,
    paddingVertical: 14,
  },

  passwordHint: {
    fontSize: 11,
    color: '#87958A',
    marginTop: -8,
    marginBottom: 19,
  },

  registerButton: {
    minHeight: 57,
    backgroundColor: '#168044',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    elevation: 4,
    shadowColor: '#168044',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 12,
  },

  loginRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  loginPrompt: {
    color: '#78857B',
    fontSize: 12,
    marginRight: 5,
  },

  loginLink: {
    color: '#168044',
    fontSize: 12,
    fontWeight: '900',
    paddingVertical: 5,
  },

  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EFF3EE',
    paddingTop: 17,
    marginTop: 19,
  },

  footerIcon: {
    fontSize: 14,
    marginRight: 7,
  },

  footerMessage: {
    color: '#829084',
    fontSize: 11,
    fontWeight: '600',
  },

  bottomText: {
    textAlign: 'center',
    color: '#92A28F',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginTop: 20,
  },
});
