
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function UserProfileScreen() {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load user information
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };
  // Logout user
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);

      setShowLogoutModal(false);

      // App.js authentication state update
      // Parent se logout callback connect karna hoga.

    } catch (error) {
      console.log('Logout error:', error);
      Alert.alert('Error', 'Unable to logout.');
    }
  };

  // Loading
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#183C29" />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Page Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>My Profile</Text>
          <Text style={styles.subHeading}>
            Manage your personal information
          </Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>

          <View style={styles.profileDetails}>

            <Text style={styles.name} numberOfLines={1}>
              {user?.name || 'User'}
            </Text>

            <Text style={styles.email} numberOfLines={2}>
              {user?.email || 'No email available'}
            </Text>

            <View style={styles.roleBadge}>
              <View style={styles.roleDot} />
              <Text style={styles.roleText}>
                {user?.role || 'Customer'}
              </Text>
            </View>

          </View>

          <View style={styles.profileDecoration} />

        </View>

        {/* Personal Information */}
        <View style={styles.infoCard}>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <Text style={styles.sectionIcon}>♟</Text>
            </View>

            <View>
              <Text style={styles.sectionTitle}>
                Personal Information
              </Text>

              <Text style={styles.sectionSubtitle}>
                Your account details
              </Text>
            </View>
          </View>

          {/* Name */}
          <View style={styles.infoRow}>

            <View style={styles.infoIconBox}>
              <Text style={styles.infoIcon}>♟</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>
                {user?.name || 'Not available'}
              </Text>
            </View>

          </View>

          <View style={styles.divider} />

          {/* Email */}
          <View style={styles.infoRow}>

            <View style={styles.infoIconBox}>
              <Text style={styles.infoIcon}>✉</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.value}>
                {user?.email || 'Not available'}
              </Text>
            </View>

          </View>

          <View style={styles.divider} />

          {/* Account Type */}
          <View style={styles.infoRow}>

            <View style={styles.infoIconBox}>
              <Text style={styles.infoIcon}>♛</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Account Type</Text>
              <Text style={styles.value}>
                {user?.role || 'Customer'}
              </Text>
            </View>

          </View>

        </View>

        {/* Account Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.actionsTitle}>Account</Text>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setShowLogoutModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.logoutIconBox}>
              <Text style={styles.logoutIcon}>⇥</Text>
            </View>

            <Text style={styles.logoutText}>Logout</Text>

            <Text style={styles.logoutArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          Thank you for being with us!
        </Text>

      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>

          <View style={styles.logoutModal}>

            <View style={styles.modalIcon}>
              <Text style={styles.modalIconText}>⇥</Text>
            </View>

            <Text style={styles.modalTitle}>
              Logout?
            </Text>

            <Text style={styles.modalMessage}>
              Are you sure you want to logout from your account?
            </Text>

            <View style={styles.modalButtons}>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmLogoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmLogoutText}>
                  Yes, Logout
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({

  // Main Screen
  container: {
    flex: 1,
    backgroundColor: '#F4F7F3',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 120,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7F3',
  },

  // Header
  header: {
    marginBottom: 24,
  },

  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#183C29',
  },

  subHeading: {
    fontSize: 14,
    color: '#858E86',
    marginTop: 5,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#183C29',
    borderRadius: 22,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#183C29',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 50,
    backgroundColor: '#F5C95D',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  avatarText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#183C29',
  },

  profileDetails: {
    flex: 1,
    marginLeft: 17,
    zIndex: 2,
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  email: {
    fontSize: 13,
    color: '#D7E5DA',
    marginTop: 6,
  },

  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F5D36D',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 13,
  },

  roleDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#183C29',
    marginRight: 7,
  },

  roleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#183C29',
    textTransform: 'capitalize',
  },

  profileDecoration: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 80,
    backgroundColor: '#245C3D',
    right: -65,
    bottom: -75,
  },

  // Information Card
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#183C29',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 7,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionIconBox: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: '#E8F3EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  sectionIcon: {
    fontSize: 23,
    color: '#247642',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#183C29',
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#929A93',
    marginTop: 3,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  infoIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F0F6F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoIcon: {
    fontSize: 20,
    color: '#247642',
  },

  infoContent: {
    flex: 1,
    marginLeft: 14,
  },

  label: {
    fontSize: 12,
    color: '#929A93',
    marginBottom: 5,
  },

  value: {
    fontSize: 15,
    color: '#26352D',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#EDF0ED',
    marginLeft: 55,
  },

  // Account Actions
  actionsSection: {
    marginTop: 2,
  },

  actionsTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#183C29',
    marginBottom: 13,
  },

  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1DEDE',
  },

  logoutIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FCECEC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutIcon: {
    fontSize: 25,
    color: '#C93636',
    fontWeight: 'bold',
  },

  logoutText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B83232',
    marginLeft: 13,
  },

  logoutArrow: {
    fontSize: 28,
    color: '#B83232',
  },

  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#A0A9A1',
    marginTop: 25,
  },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },

  // Modal Card
  logoutModal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },

  modalIcon: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: '#FCE8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  modalIconText: {
    fontSize: 40,
    color: '#C93636',
    fontWeight: 'bold',
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#183C29',
  },

  modalMessage: {
    fontSize: 14,
    color: '#777F78',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 25,
  },

  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 13,
    backgroundColor: '#E8F3EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#183C29',
  },

  confirmLogoutButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 13,
    backgroundColor: '#C93636',
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmLogoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

});
