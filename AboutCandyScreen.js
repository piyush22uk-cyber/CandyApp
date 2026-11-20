import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

export default function AboutCandyScreen({ navigation }) {
  // Read the installed app version
  const appVersion =
    Application.nativeApplicationVersion ||
    Constants.expoConfig?.version ||
    'Not available';

  // Read the installed build number when available
  const buildVersion =
    Application.nativeBuildVersion;

  const features = [
    {
      icon: 'leaf-outline',
      title: 'Fresh Products',
      description:
        'Explore fruits, vegetables, and other available grocery essentials.',
    },
    {
      icon: 'basket-outline',
      title: 'Easy Shopping',
      description:
        'Browse products, add items to your cart, and place orders conveniently.',
    },
    {
      icon: 'location-outline',
      title: 'Delivery Addresses',
      description:
        'Save and manage your addresses for a smoother checkout experience.',
    },
    {
      icon: 'receipt-outline',
      title: 'Order Information',
      description:
        'Keep track of your orders and check their status in the app.',
    },
    {
      icon: 'notifications-outline',
      title: 'App Updates',
      description:
        'Receive relevant notifications and updates when available.',
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Your Account',
      description:
        'Access your customer account and manage your saved profile information.',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F5FAF2"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#174B30"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          About CandyApp
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Brand Hero */}
        <View style={styles.heroCard}>
          <View style={styles.decorCircleOne} />
          <View style={styles.decorCircleTwo} />

          <View style={styles.brandIcon}>
            <Ionicons
              name="basket"
              size={39}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.brandTitle}>
            Candy<Text style={styles.brandAccent}>App</Text>
          </Text>

          <Text style={styles.brandTagline}>
            FRESH FOOD  ·  DAILY ESSENTIALS
          </Text>

          <View style={styles.fruitRow}>
            <Text style={styles.fruitEmoji}>🍎</Text>
            <Text style={styles.fruitEmoji}>🥑</Text>
            <Text style={styles.fruitEmoji}>🍊</Text>
            <Text style={styles.fruitEmoji}>🥦</Text>
          </View>

          <Text style={styles.heroHeading}>
            Fresh Choices,{'\n'}Made Simple.
          </Text>

          <Text style={styles.heroDescription}>
            CandyApp helps you explore available groceries,
            manage your basket, and place orders in one convenient place.
          </Text>
        </View>

        {/* App Features */}
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionTitle}>
            What You Can Do
          </Text>

          <View style={styles.sectionBadge}>
            <Ionicons
              name="sparkles"
              size={13}
              color="#218247"
            />
            <Text style={styles.sectionBadgeText}>
              FEATURES
            </Text>
          </View>
        </View>

        <View style={styles.featuresCard}>
          {features.map((feature, index) => (
            <View
              key={feature.title}
              style={[
                styles.featureRow,
                index === features.length - 1 &&
                  styles.lastFeatureRow,
              ]}
            >
              <View style={styles.featureIconBox}>
                <Ionicons
                  name={feature.icon}
                  size={23}
                  color="#218247"
                />
              </View>

              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>
                  {feature.title}
                </Text>

                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Our Mission */}
        <View style={styles.missionCard}>
          <View style={styles.missionIcon}>
            <Ionicons
              name="heart"
              size={25}
              color="#218247"
            />
          </View>

          <View style={styles.missionTextContainer}>
            <Text style={styles.missionTitle}>
              Our Purpose
            </Text>

            <Text style={styles.missionDescription}>
              To make everyday grocery shopping simpler,
              more convenient, and easier to manage.
            </Text>
          </View>
        </View>

        {/* App Information */}
        <Text style={styles.sectionTitle}>
          App Information
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons
                name="phone-portrait-outline"
                size={21}
                color="#218247"
              />
            </View>

            <Text style={styles.infoLabel}>
              App Version
            </Text>

            <Text style={styles.infoValue}>
              {appVersion}
            </Text>
          </View>

          {buildVersion ? (
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons
                  name="code-slash-outline"
                  size={21}
                  color="#218247"
                />
              </View>

              <Text style={styles.infoLabel}>
                Build Number
              </Text>

              <Text style={styles.infoValue}>
                {buildVersion}
              </Text>
            </View>
          ) : null}

          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <View style={styles.infoIconBox}>
              <Ionicons
                name="person-circle-outline"
                size={21}
                color="#218247"
              />
            </View>

            <Text style={styles.infoLabel}>
              Account Type
            </Text>

            <Text style={styles.infoValue}>
              Customer
            </Text>
          </View>
        </View>

        {/* Closing Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeaf}>
            <Ionicons
              name="leaf"
              size={17}
              color="#218247"
            />
          </View>

          <Text style={styles.footerTitle}>
            Fresh Choices. Better Everyday.
          </Text>

          <Text style={styles.footerSubtitle}>
            Thank you for choosing CandyApp.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F3',
  },

  header: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: '#F5FAF2',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EDE3',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F4E5',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#173D29',
  },

  headerSpacer: {
    width: 42,
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 35,
  },

  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 24,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7EFE3',
    elevation: 3,
    shadowColor: '#234B30',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },

  decorCircleOne: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#EFF8E9',
    top: -75,
    right: -45,
  },

  decorCircleTwo: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F4F9EF',
    bottom: -45,
    left: -35,
  },

  brandIcon: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor: '#218247',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
    elevation: 4,
    shadowColor: '#218247',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
  },

  brandTitle: {
    fontSize: 33,
    fontWeight: '900',
    color: '#155B35',
    letterSpacing: -1,
  },

  brandAccent: {
    color: '#F18A35',
  },

  brandTagline: {
    fontSize: 9,
    fontWeight: '800',
    color: '#728575',
    letterSpacing: 1.5,
    marginTop: 7,
  },

  fruitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 14,
  },

  fruitEmoji: {
    fontSize: 34,
    marginHorizontal: 5,
  },

  heroHeading: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
    color: '#183E2A',
    textAlign: 'center',
  },

  heroDescription: {
    fontSize: 13,
    lineHeight: 21,
    color: '#718075',
    textAlign: 'center',
    marginTop: 11,
  },

  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 26,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#193E2A',
    marginTop: 25,
    marginBottom: 12,
  },

  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F4E0',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },

  sectionBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#218247',
    marginLeft: 4,
    letterSpacing: 0.5,
  },

  featuresCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#EAF0E7',
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2EB',
  },

  lastFeatureRow: {
    borderBottomWidth: 0,
  },

  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EAF6E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureTextContainer: {
    flex: 1,
    marginLeft: 13,
  },

  featureTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#203D2A',
  },

  featureDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#778478',
    marginTop: 4,
  },

  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5E5',
    borderRadius: 22,
    padding: 17,
    marginTop: 20,
  },

  missionIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  missionTextContainer: {
    flex: 1,
    marginLeft: 13,
  },

  missionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1A5733',
  },

  missionDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: '#5D7563',
    marginTop: 5,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#EAF0E7',
  },

  infoRow: {
    minHeight: 59,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2EB',
  },

  lastInfoRow: {
    borderBottomWidth: 0,
  },

  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EAF6E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#526455',
    marginLeft: 11,
  },

  infoValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1C663B',
    marginLeft: 8,
  },

  footer: {
    alignItems: 'center',
    marginTop: 27,
  },

  footerLeaf: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5F4E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  footerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#28563A',
    textAlign: 'center',
  },

  footerSubtitle: {
    fontSize: 11,
    color: '#8A978B',
    marginTop: 6,
    textAlign: 'center',
  },
});