
import React, { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  StatusBar,
  Modal,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import api from "./services/api";
import { useCart } from "./CartContext";

// App colors and image server.
const GREEN = "#183D32";
const IMAGE_BASE_URL = "http://192.168.100.18:2005";

export default function CartScreen({ navigation }) {

  // Get cart data and functions.
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();

  // Screen states.
  const [checkingOut, setCheckingOut] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Calculate total product quantity.
  const totalQuantity = cart.reduce((total, item) => {
    return total + Number(item.quantity || 0);
  }, 0);

  // Calculate one product's total price.
  const getItemTotal = (item) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 0);

    return price * quantity;
  };

  // Check login, address and open payment screen.
  const handleCheckout = async () => {

    if (checkingOut) {
      return;
    }

    if (cart.length === 0) {
      Alert.alert("Empty Cart", "Please add products first.");
      return;
    }

    try {
      setCheckingOut(true);

      // Get saved user information.
      const savedUser = await AsyncStorage.getItem("user");

      if (!savedUser) {
        Alert.alert(
          "Login Required",
          "Please log in before checkout."
        );
        return;
      }

      // Convert saved JSON into a JavaScript object.
      const currentUser = JSON.parse(savedUser);

      const userId = currentUser.id || currentUser._id;

      if (!userId) {
        Alert.alert(
          "Account Error",
          "Please log in again."
        );
        return;
      }

      // Get user's delivery address from backend.
      const response = await api.get(`/addresses/${userId}`);

      const address = response.data.address;

      // Show address popup if address is missing.
      if (!address) {
        setShowAddressModal(true);
        return;
      }

      // Open payment screen with delivery address.
      navigation.navigate("Payment", {
        address: address,
      });

    } catch (error) {

      console.log(
        "Checkout Error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Checkout Failed",
        "Unable to check your delivery address. Please try again."
      );

    } finally {
      setCheckingOut(false);
    }
  };

  // Open address screen.
  const handleAddAddress = () => {
    setShowAddressModal(false);
    navigation.navigate("Address");
  };

  // Show empty cart screen.
  const renderEmptyCart = () => {
    return (
      <View style={styles.emptyContainer}>

        <View style={styles.emptyIconCircle}>
          <Ionicons
            name="cart-outline"
            size={58}
            color={GREEN}
          />
        </View>

        <Text style={styles.emptyTitle}>
          Your cart is waiting
        </Text>

        <Text style={styles.emptyDescription}>
          Fresh groceries are just a few taps away.
          Explore our products and add your favourites.
        </Text>

        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.shopButtonText}>
            Explore Products
          </Text>

          <Ionicons
            name="arrow-forward"
            size={19}
            color="#FFFFFF"
          />
        </TouchableOpacity>

      </View>
    );
  };

  // Show one cart product.
  const renderCartItem = (item) => {

    const itemTotal = getItemTotal(item);

    const imageUri = item.image
      ? `${IMAGE_BASE_URL}${item.image}`
      : null;

    return (
      <View
        key={String(item._id || item.productId || item.name)}
        style={styles.productCard}
      >

        {/* Product information */}
        <View style={styles.productTopRow}>

          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.productImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="leaf-outline"
                size={34}
                color="#4C8B62"
              />
            </View>
          )}

          <View style={styles.productInfo}>

            <Text style={styles.categoryText}>
              {item.category || "Grocery"}
            </Text>

            <Text
              style={styles.productName}
              numberOfLines={2}
            >
              {item.name}
            </Text>

            <View style={styles.weightRow}>
              <Ionicons
                name="scale-outline"
                size={14}
                color="#89948D"
              />

              <Text style={styles.weightText}>
                {item.weight || "1 kg"}
              </Text>
            </View>

            <Text style={styles.productPrice}>
              ₹{Number(item.price || 0).toFixed(2)}
            </Text>

          </View>

          <View style={styles.itemTotalBox}>
            <Text style={styles.itemTotalLabel}>
              Item Total
            </Text>

            <Text style={styles.itemTotalPrice}>
              ₹{itemTotal.toFixed(2)}
            </Text>
          </View>

        </View>

        {/* Quantity controls */}
        <View style={styles.productBottomRow}>

          <Text style={styles.quantityLabel}>
            Quantity
          </Text>

          <View style={styles.quantityControls}>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => decreaseQuantity(item)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="remove"
                size={19}
                color={GREEN}
              />
            </TouchableOpacity>

            <Text style={styles.quantityNumber}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => increaseQuantity(item)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add"
                size={19}
                color={GREEN}
              />
            </TouchableOpacity>

          </View>

        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>

      <StatusBar
        backgroundColor={GREEN}
        barStyle="light-content"
      />

      {/* Header */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.headerTextBox}>
          <Text style={styles.headerTitle}>
            My Cart
          </Text>

          <Text style={styles.headerSubtitle}>
            Your fresh picks, all in one place
          </Text>
        </View>

        <View style={styles.headerCartIcon}>
          <Ionicons
            name="cart-outline"
            size={25}
            color="#FFFFFF"
          />

          <View style={styles.headerCount}>
            <Text style={styles.headerCountText}>
              {cart.length}
            </Text>
          </View>
        </View>

      </View>

      {/* Cart products */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          cart.length === 0 && styles.emptyScrollContent,
        ]}
      >

        {cart.length === 0 ? (

          renderEmptyCart()

        ) : (

          <>

            {/* Section heading */}
            <View style={styles.sectionHeading}>

              <View>
                <Text style={styles.sectionTitle}>
                  Shopping Bag
                </Text>

                <Text style={styles.sectionSubtitle}>
                  {totalQuantity} items selected
                </Text>
              </View>

              <View style={styles.freshBadge}>
                <Ionicons
                  name="leaf"
                  size={13}
                  color="#267345"
                />

                <Text style={styles.freshBadgeText}>
                  Fresh choices
                </Text>
              </View>

            </View>

            {/* Product list */}
            {cart.map((item) => renderCartItem(item))}

          </>

        )}

      </ScrollView>

      {/* Checkout footer */}
      {cart.length > 0 && (

        <View style={styles.footer}>

          {/* Delivery information */}
          <View style={styles.deliveryNote}>

            <View style={styles.deliveryIcon}>
              <Ionicons
                name="shield-checkmark"
                size={19}
                color="#267345"
              />
            </View>

            <View style={styles.deliveryTextBox}>
              <Text style={styles.deliveryTitle}>
                Freshness Guaranteed
              </Text>

              <Text style={styles.deliverySubtitle}>
                Your order is almost ready
              </Text>
            </View>

            <Ionicons
              name="checkmark-circle"
              size={21}
              color="#267345"
            />

          </View>

          {/* Order summary */}
          <View style={styles.checkoutSummary}>

            <View>
              <Text style={styles.summaryHeading}>
                Order Summary
              </Text>

              <Text style={styles.summaryDescription}>
                {totalQuantity} items in your bag
              </Text>
            </View>

            <View style={styles.totalPriceBox}>
              <Text style={styles.summaryLabel}>
                Total Amount
              </Text>

              <Text style={styles.grandTotal}>
                ₹{Number(cartTotal || 0).toFixed(2)}
              </Text>
            </View>

          </View>

          <View style={styles.checkoutDivider} />

          {/* Checkout button */}
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              checkingOut && styles.checkoutButtonDisabled,
            ]}
            onPress={handleCheckout}
            disabled={checkingOut}
            activeOpacity={0.85}
          >

            {checkingOut ? (

              <ActivityIndicator color="#FFFFFF" />

            ) : (

              <View style={styles.checkoutButtonContent}>

                <View>
                  <Text style={styles.checkoutButtonTitle}>
                    Proceed to Checkout
                  </Text>

                  <Text style={styles.checkoutButtonSubtitle}>
                    Secure your fresh order
                  </Text>
                </View>

                <View style={styles.checkoutArrow}>
                  <Ionicons
                    name="arrow-forward"
                    size={21}
                    color={GREEN}
                  />
                </View>

              </View>

            )}

          </TouchableOpacity>

          {/* Payment information */}
          <View style={styles.paymentInfo}>

            <Ionicons
              name="lock-closed-outline"
              size={12}
              color="#87958B"
            />

            <Text style={styles.paymentInfoText}>
              Secure checkout • Cash on Delivery available
            </Text>

          </View>

        </View>

      )}

      {/* Address required popup */}
      <Modal
        visible={showAddressModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddressModal(false)}
      >

        <View style={styles.modalOverlay}>

          <View style={styles.addressModal}>

            <View style={styles.modalIcon}>
              <Ionicons
                name="location-outline"
                size={35}
                color={GREEN}
              />
            </View>

            <Text style={styles.modalTitle}>
              Delivery Address Required
            </Text>

            <Text style={styles.modalDescription}>
              Please add your delivery address before
              proceeding with checkout.
            </Text>

            <TouchableOpacity
              style={styles.modalPrimaryButton}
              onPress={handleAddAddress}
              activeOpacity={0.85}
            >
              <Text style={styles.modalPrimaryText}>
                Add Delivery Address
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryButton}
              onPress={() => setShowAddressModal(false)}
            >
              <Text style={styles.modalSecondaryText}>
                Maybe Later
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>

    </View>
  );
}

// Screen styles.
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F7F4",
  },

  scrollView: {
    flex: 1,
  },

  // Header
  header: {
    backgroundColor: GREEN,
    paddingHorizontal: 20,
    paddingTop: 17,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.13)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTextBox: {
    flex: 1,
    marginLeft: 14,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  headerSubtitle: {
    fontSize: 11,
    color: "#D0E2D5",
    marginTop: 4,
  },

  headerCartIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#285A3F",
    justifyContent: "center",
    alignItems: "center",
  },

  headerCount: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#D8F36A",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  headerCountText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: "800",
  },

  // Scroll content
  scrollContent: {
    paddingHorizontal: 17,
    paddingTop: 22,
    paddingBottom: 20,
  },

  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  // Section heading
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 17,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1B3325",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#839087",
    marginTop: 4,
  },

  freshBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F2E8",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 5,
  },

  freshBadgeText: {
    color: "#267345",
    fontSize: 10,
    fontWeight: "700",
  },

  // Product card
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 14,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#EAF0EA",
    elevation: 2,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 7,
  },

  productTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  productImage: {
    width: 83,
    height: 91,
    borderRadius: 14,
    backgroundColor: "#F1F5F1",
  },

  imagePlaceholder: {
    width: 83,
    height: 91,
    borderRadius: 14,
    backgroundColor: "#EAF3EB",
    justifyContent: "center",
    alignItems: "center",
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 5,
  },

  categoryText: {
    fontSize: 10,
    color: "#398052",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  productName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#203629",
    marginTop: 5,
  },

  weightRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },

  weightText: {
    fontSize: 11,
    color: "#89948D",
  },

  productPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: GREEN,
    marginTop: 6,
  },

  itemTotalBox: {
    alignItems: "flex-end",
    alignSelf: "flex-start",
  },

  itemTotalLabel: {
    fontSize: 10,
    color: "#929C94",
  },

  itemTotalPrice: {
    fontSize: 13,
    color: GREEN,
    fontWeight: "800",
    marginTop: 5,
  },

  // Quantity controls
  productBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EFF3EF",
    marginTop: 13,
    paddingTop: 11,
  },

  quantityLabel: {
    fontSize: 12,
    color: "#7D8980",
    fontWeight: "600",
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F6F0",
    borderRadius: 11,
    padding: 3,
  },

  quantityButton: {
    width: 31,
    height: 31,
    borderRadius: 9,
    backgroundColor: "#E0EEE2",
    justifyContent: "center",
    alignItems: "center",
  },

  quantityNumber: {
    minWidth: 37,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "800",
    color: GREEN,
  },

  // Empty cart
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 25,
  },

  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E5F0E6",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1B3325",
    marginTop: 23,
  },

  emptyDescription: {
    fontSize: 13,
    color: "#7C8980",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 9,
  },

  shopButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: GREEN,
    paddingHorizontal: 23,
    height: 51,
    borderRadius: 14,
    marginTop: 24,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  // Checkout footer
  footer: {
  backgroundColor: "#FFFFFF",
  paddingHorizontal: 19,
  paddingTop: 14,
  paddingBottom: 98,

  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,

  borderWidth: 1,
  borderColor: "#EAF0E9",

  elevation: 12,
  shadowColor: GREEN,
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
},

  deliveryNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6EF",
    padding: 10,
    borderRadius: 14,
    marginBottom: 14,
  },

  deliveryIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: "#DDEDDD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  deliveryTextBox: {
    flex: 1,
  },

  deliveryTitle: {
    color: "#285B3B",
    fontSize: 12,
    fontWeight: "800",
  },

  deliverySubtitle: {
    color: "#839087",
    fontSize: 10,
    marginTop: 3,
  },

  // Order summary
  checkoutSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },

  summaryHeading: {
    color: "#203629",
    fontSize: 15,
    fontWeight: "900",
  },

  summaryDescription: {
    color: "#89958C",
    fontSize: 11,
    marginTop: 5,
  },

  summaryLabel: {
    color: "#89958C",
    fontSize: 10,
    fontWeight: "700",
  },

  totalPriceBox: {
    alignItems: "flex-end",
  },

  grandTotal: {
    color: GREEN,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 3,
  },

  checkoutDivider: {
    height: 1,
    backgroundColor: "#EDF1EC",
    marginBottom: 13,
  },

  // Checkout button
  checkoutButton: {
    backgroundColor: GREEN,
    height: 59,
    borderRadius: 16,
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  checkoutButtonDisabled: {
    opacity: 0.65,
  },

  checkoutButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  checkoutButtonTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  checkoutButtonSubtitle: {
    color: "#C4D9C9",
    fontSize: 10,
    marginTop: 4,
  },

  checkoutArrow: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: "#D5E8CA",
    justifyContent: "center",
    alignItems: "center",
  },

  paymentInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 11,
    gap: 6,
  },

  paymentInfoText: {
    color: "#87958B",
    fontSize: 9,
    fontWeight: "600",
  },

  // Address popup
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  addressModal: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    elevation: 15,
  },

  modalIcon: {
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: GREEN,
    textAlign: "center",
  },

  modalDescription: {
    fontSize: 13,
    color: "#77847B",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 12,
    marginBottom: 22,
  },

  modalPrimaryButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#168A45",
    borderRadius: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },

  modalPrimaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  modalSecondaryButton: {
    width: "100%",
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  modalSecondaryText: {
    color: "#657268",
    fontSize: 14,
    fontWeight: "700",
  },

});
