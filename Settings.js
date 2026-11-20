
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load logged-in user
  const loadCurrentUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');

      if (savedUser) {
        setUserData(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log('Profile loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  // Simple placeholder for screens not connected yet
  const handleComingSoon = (title) => {
    console.log(`${title} screen is not connected yet.`);
  };

  // Loading screen
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#183C29" />
      </View>
    );
  }

  // User information
  const name = userData?.name || 'User';
  const email = userData?.email || 'No email available';

  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>

      <StatusBar
        backgroundColor="#183C29"
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Profile Header */}

        <View style={styles.header}>

          <Text style={styles.headerTitle}>
            My Account
          </Text>

          <Text style={styles.headerSubtitle}>
            Manage your personal information
          </Text>

          {/* Clickable Profile Card */}

          <TouchableOpacity
            style={styles.profileCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('UserDetails')}
          >

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {firstLetter}
              </Text>
            </View>

            <View style={styles.userInfo}>

              <Text style={styles.userName}>
                {name}
              </Text>

              <Text style={styles.userEmail}>
                {email}
              </Text>

              <View style={styles.memberBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={13}
                  color="#D9AD48"
                />

                <Text style={styles.memberText}>
                  CandyApp Customer
                </Text>
              </View>

            </View>

            <Ionicons
              name="person-circle-outline"
              size={27}
              color="#D9AD48"
            />

          </TouchableOpacity>

        </View>

        {/* Orders */}

        <Text style={styles.sectionTitle}>
          My Orders
        </Text>

        <View style={styles.card}>

          <ProfileButton
            icon="receipt-outline"
            title="My Orders"
            subtitle="View your order history"
            onPress={() => navigation.navigate('Orders')}
            last
          />

          <ProfileButton
            icon="navigate-outline"
            title="Track Order"
            subtitle="Check your delivery status"
            onPress={() => handleComingSoon('Track Order')}
            last
          />

        </View>

        {/* Account */}

        <Text style={styles.sectionTitle}>
          Account Settings
        </Text>

        <View style={styles.card}>

          <ProfileButton
            icon="location-outline"
            title="My Addresses"
            subtitle="Manage your delivery addresses"
            onPress={() => navigation.navigate('Address')}
            last
          />

        </View>

        {/* Help and Support */}

        <Text style={styles.sectionTitle}>
          Help & Customer Service
        </Text>

        <View style={styles.card}>

          <ProfileButton
            icon="headset-outline"
            title="Customer Service"
            subtitle="Get assistance with your orders"
            onPress={() => handleComingSoon('Customer Service')}
          />

          <ProfileButton
            icon="help-circle-outline"
            title="Help Center"
            subtitle="Find answers to common questions"
            onPress={() => navigation.navigate("HelpCenter")}
            last
          />

        </View>

        {/* App Information */}

        <Text style={styles.sectionTitle}>
          More
        </Text>

        <View style={styles.card}>

          <ProfileButton
            icon="notifications-outline"
            title="Notifications"
            subtitle="View your latest updates"
            onPress={() => navigation.navigate('Notifications')}
            last
          />

          <ProfileButton
            icon="information-circle-outline"
            title="About Candy"
            subtitle="Learn more about CandyApp"
            onPress={() => navigation.navigate('AboutCandy')}
            last
          />

        </View>

        {/* Footer */}

        <View style={styles.footer}>

          <Text style={styles.footerBrand}>
            CandyApp
          </Text>

          <Text style={styles.footerText}>
            Your everyday shopping companion
          </Text>

          <Text style={styles.version}>
            Version 1.0.0
          </Text>

        </View>

      </ScrollView>

    </View>
  );
}


// Reusable Menu Button

function ProfileButton({
  icon,
  title,
  subtitle,
  onPress,
  last = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.profileButton,
        last && styles.lastButton,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >

      <View style={styles.iconBox}>
        <Ionicons
          name={icon}
          size={22}
          color="#183C29"
        />
      </View>

      <View style={styles.buttonText}>

        <Text style={styles.buttonTitle}>
          {title}
        </Text>

        <Text style={styles.buttonSubtitle}>
          {subtitle}
        </Text>

      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#A0A8A1"
      />

    </TouchableOpacity>
  );
}


// Styles

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7F4',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    paddingBottom: 35,
  },

  // Header

  header: {
    backgroundColor: '#183C29',
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  headerSubtitle: {
    fontSize: 13,
    color: '#D0DFD3',
    marginTop: 5,
  },

  // Profile Card

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    elevation: 4,
  },

  avatar: {
    width: 61,
    height: 61,
    borderRadius: 31,
    backgroundColor: '#183C29',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D9AD48',
  },

  avatarText: {
    fontSize: 27,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  userInfo: {
    flex: 1,
    marginLeft: 13,
  },

  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18251C',
  },

  userEmail: {
    fontSize: 12,
    color: '#777F78',
    marginTop: 4,
  },

  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    gap: 5,
  },

  memberText: {
    fontSize: 11,
    color: '#183C29',
    fontWeight: '700',
  },

  // Sections

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#183C29',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 11,
  },

  // Cards

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 17,
    paddingHorizontal: 14,
    elevation: 2,
  },

  // Buttons

  profileButton: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2EF',
  },

  lastButton: {
    borderBottomWidth: 0,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#EDF3EE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    marginLeft: 13,
  },

  buttonTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202B23',
  },

  buttonSubtitle: {
    fontSize: 11,
    color: '#858D86',
    marginTop: 4,
  },

  // Footer

  footer: {
    alignItems: 'center',
    marginTop: 32,
  },

  footerBrand: {
    fontSize: 22,
    fontWeight: '900',
    color: '#183C29',
  },

  footerText: {
    fontSize: 12,
    color: '#858D86',
    marginTop: 5,
  },

  version: {
    fontSize: 11,
    color: '#A0A8A1',
    marginTop: 9,
  },

});
