import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "./services/api";

export default function AddressScreen() {
  const [userId, setUserId] = useState(null);
  const [address, setAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [house, setHouse] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // LOAD USER
  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");

      if (!savedUser) {
        return;
      }

      const user = JSON.parse(savedUser);
      const id = user.id || user._id;

      if (!id) {
        return;
      }

      setUserId(id);
      setFullName(user.name || "");

      await loadAddress(id);

    } catch (error) {
      console.log("Load user error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // GET ADDRESS
  const loadAddress = async (id) => {
    try {
      const response = await api.get(`/addresses/${id}`);

      setAddress(response.data.address || null);

    } catch (error) {
      console.log(
        "Load address error:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // CLEAR FORM
  const clearForm = () => {
    setFullName("");
    setPhone("");
    setHouse("");
    setArea("");
    setCity("");
    setState("");
    setPincode("");
  };

  // OPEN ADD FORM
  const openAddForm = () => {
    clearForm();
    setFullName("");
    setShowForm(true);
  };

  // OPEN EDIT FORM
  const openEditForm = () => {
    if (!address) return;

    setFullName(address.fullName || "");
    setPhone(address.phone || "");
    setHouse(address.house || "");
    setArea(address.area || "");
    setCity(address.city || "");
    setState(address.state || "");
    setPincode(address.pincode || "");

    setShowForm(true);
  };

  // VALIDATE FORM
  const validateForm = () => {
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !house.trim() ||
      !area.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      return false;
    }

    if (!/^[0-9]{6}$/.test(pincode.trim())) {
      return false;
    }

    return true;
  };

  // SAVE OR UPDATE ADDRESS
  const saveAddress = async () => {
    if (!validateForm()) {
      return;
    }

    if (!userId) {
      return;
    }

    const addressData = {
      userId : userId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      house: house.trim(),
      area: area.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    };

    try {
      setSaving(true);

      let response;

      if (address) {
        response = await api.put(
          `/addresses/${userId}`,
          addressData
        );
      } else {
        response = await api.post(
          "/addresses",
          addressData
        );
      }

      setAddress(response.data.address);
      setShowForm(false);

    } catch (error) {
      console.log(
        "Save address error:",
        error.response?.data || error.message
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE ADDRESS
  
// DELETE ADDRESS
const deleteAddress = async () => {
  if (!address?._id) {
    return;
  }

  try {
    setSaving(true);

    // Get JWT token from AsyncStorage
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.log("JWT token not found. Please login again.");
      return;
    }

    // Send token with DELETE request
    await api.delete(`/addresses/${address._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Update UI after successful deletion
    setAddress(null);

  } catch (error) {
    console.log(
      "Delete address error:",
      error.response?.data || error.message
    );
  } finally {
    setSaving(false);
  }
};


  // LOADING SCREEN
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#168A45" />
        <Text style={styles.loadingText}>
          Loading your address...
        </Text>
      </View>
    );
  }

  // ADDRESS FORM
  if (showForm) {
    return (
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowForm(false)}
            >
              <Ionicons name="arrow-back" size={22} color="#183C29" />
            </TouchableOpacity>

            <View style={styles.formHeading}>
              <Text style={styles.title}>
                {address ? "Edit Address" : "Add New Address"}
              </Text>

              <Text style={styles.subtitle}>
                Enter your delivery details below
              </Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Contact Details</Text>

            <AddressInput
              icon="person-outline"
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
            />

            <AddressInput
              icon="call-outline"
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="10-digit phone number"
              keyboardType="phone-pad"
              maxLength={10}
            />

            <View style={styles.sectionDivider} />

            <Text style={styles.sectionTitle}>Delivery Details</Text>

            <AddressInput
              icon="home-outline"
              label="House / Flat / Building"
              value={house}
              onChangeText={setHouse}
              placeholder="House number or building"
            />

            <AddressInput
              icon="map-outline"
              label="Area / Street"
              value={area}
              onChangeText={setArea}
              placeholder="Enter area or street"
            />

            <AddressInput
              icon="business-outline"
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="Enter city"
            />

            <AddressInput
              icon="location-outline"
              label="State"
              value={state}
              onChangeText={setState}
              placeholder="Enter state"
            />

            <AddressInput
              icon="mail-outline"
              label="Pincode"
              value={pincode}
              onChangeText={setPincode}
              placeholder="6-digit pincode"
              keyboardType="number-pad"
              maxLength={6}
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                saving && styles.disabledButton,
              ]}
              onPress={saveAddress}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={21}
                    color="#FFFFFF"
                  />

                  <Text style={styles.primaryButtonText}>
                    {address ? "Update Address" : "Save Address"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setShowForm(false)}
              disabled={saving}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // MAIN ADDRESS SCREEN
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.title}>My Addresses</Text>
          <Text style={styles.subtitle}>
            Manage your delivery location
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="location" size={25} color="#168A45" />
        </View>
      </View>

      {address ? (
        <View style={styles.addressCard}>
          <View style={styles.addressCardHeader}>
            <View style={styles.addressType}>
              <View style={styles.addressIcon}>
                <Ionicons name="home" size={22} color="#168A45" />
              </View>

              <View>
                <Text style={styles.addressCardTitle}>
                  Delivery Address
                </Text>

                <Text style={styles.savedLabel}>
                  <Ionicons
                    name="checkmark-circle"
                    size={12}
                    color="#168A45"
                  />
                  {" "}Saved address
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={openEditForm}
                disabled={saving}
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color="#168A45"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={deleteAddress}
                disabled={saving}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#DC4545"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.addressDetails}>
            <AddressDetail icon="person-outline" value={address.fullName} />
            <AddressDetail icon="call-outline" value={address.phone} />
            <AddressDetail icon="home-outline" value={address.house} />
            <AddressDetail icon="map-outline" value={address.area} />

            <AddressDetail
              icon="business-outline"
              value={`${address.city}, ${address.state}`}
            />

            <AddressDetail icon="mail-outline" value={address.pincode} />
          </View>

          <View style={styles.deliveryBadge}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#168A45"
            />

            <Text style={styles.deliveryBadgeText}>
              Delivery location
            </Text>
          </View>

          {saving && (
            <View style={styles.deleteLoading}>
              <ActivityIndicator color="#168A45" />
              <Text style={styles.loadingText}>Please wait...</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="location-outline"
              size={42}
              color="#168A45"
            />
          </View>

          <Text style={styles.emptyTitle}>No address saved</Text>

          <Text style={styles.emptyText}>
            Add your delivery address to make your checkout easier and faster.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={openAddForm}
          >
            <Ionicons
              name="add-circle-outline"
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.primaryButtonText}>
              Add New Address
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}


// REUSABLE INPUT COMPONENT
function AddressInput({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  maxLength,
}) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color="#168A45" />

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize="words"
        />
      </View>
    </View>
  );
}


// REUSABLE ADDRESS DETAIL ROW
function AddressDetail({ icon, value }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={19} color="#168A45" />
      <Text style={styles.detailText}>{value}</Text>
    </View>
  );
}


// STYLES
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7F4",
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7F4",
  },

  loadingText: {
    marginTop: 9,
    fontSize: 13,
    color: "#68756C",
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#183C29",
  },

  subtitle: {
    fontSize: 13,
    color: "#77847B",
    marginTop: 5,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#E4F3E8",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 27,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#183C29",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },

  emptyIcon: {
    width: 85,
    height: 85,
    borderRadius: 25,
    backgroundColor: "#EAF5EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#183C29",
  },

  emptyText: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 21,
    color: "#7A857D",
    marginTop: 9,
    marginBottom: 22,
  },

  primaryButton: {
    minHeight: 52,
    borderRadius: 13,
    backgroundColor: "#168A45",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 12,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },

  disabledButton: {
    opacity: 0.65,
  },

  addressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    elevation: 3,
    shadowColor: "#183C29",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  addressCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1ED",
  },

  addressType: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  addressIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#EAF5EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  addressCardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#183C29",
  },

  savedLabel: {
    fontSize: 12,
    color: "#168A45",
    marginTop: 4,
  },

  actionButtons: {
    flexDirection: "row",
  },

  editButton: {
    width: 39,
    height: 39,
    borderRadius: 11,
    backgroundColor: "#EAF5EC",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 7,
  },

  deleteButton: {
    width: 39,
    height: 39,
    borderRadius: 11,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 7,
  },

  addressDetails: {
    paddingTop: 18,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  detailText: {
    flex: 1,
    fontSize: 14,
    color: "#46534A",
    marginLeft: 12,
    lineHeight: 20,
  },

  deliveryBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF5EC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 3,
  },

  deliveryBadgeText: {
    color: "#168A45",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },

  deleteLoading: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#E4F3E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  formHeading: {
    flex: 1,
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    shadowColor: "#183C29",
    shadowOpacity: 0.05,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#183C29",
    marginBottom: 16,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: "#EDF1ED",
    marginVertical: 18,
  },

  inputWrapper: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#46534A",
    marginBottom: 8,
  },

  inputContainer: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#E1E8E2",
    backgroundColor: "#FAFCFA",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    minHeight: 50,
    fontSize: 14,
    color: "#183C29",
    marginLeft: 11,
  },

  secondaryButton: {
    height: 49,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCE5DD",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#526057",
  },
});
