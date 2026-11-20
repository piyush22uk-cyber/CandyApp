import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";

import {
  Wallet,
  Check,
  Forward2,
} from "reicon-react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useCart } from "./CartContext";
import api from "./services/api";


export default function PaymentScreen({ navigation, route }) {

  // =====================================
  // CART DATA
  // =====================================

  const { cart, cartTotal, clearCart } = useCart();

  const [placingOrder, setPlacingOrder] = useState(false);

  // =====================================
  // PAYMENT METHOD
  // =====================================

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderSuccessVisible, setOrderSuccessVisible] = useState(false);
const [successOrder, setSuccessOrder] = useState(null);

  // =====================================
  // DELIVERY ADDRESS
  // =====================================

  const address = route?.params?.address;

  // =====================================
  // TOTAL ITEMS
  // =====================================

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );


  // =====================================
  // PLACE ORDER
  // =====================================

  const handleContinue = async () => {

  // Prevent multiple order requests
  if (placingOrder) return;

  // Check payment method
  if (!paymentMethod) {
    Alert.alert("Payment Required", "Please select a payment method.");
    return;
  }

  // Check delivery address
  if (!address) {
    Alert.alert("Address Required", "Please select a delivery address.");
    return;
  }

  // Check cart
  if (!cart || cart.length === 0) {
    Alert.alert("Cart Empty", "Please add products to your cart.");
    return;
  }

  setPlacingOrder(true);

  try {

    // Get logged-in user
    const savedUser = await AsyncStorage.getItem("user");

    if (!savedUser) {
      Alert.alert("Login Required", "Please login again.");
      return;
    }

    const currentUser = JSON.parse(savedUser);

    // Get authentication token
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Login Required", "Your login session has expired. Please login again.");
      return;
    }

    // Prepare order data
    const orderData = {

      userId: currentUser.id || currentUser._id,

      userEmail: currentUser.email,

      items: cart.map((item) => ({

        productId: item.productId || item._id || item.id,

        name: item.name,

        price: Number(item.price),

        weight: item.weight,

        image: item.image,

        quantity: Number(item.quantity),

        totalPrice: Number(item.price) * Number(item.quantity),

      })),

      totalItems,

      totalAmount: Number(cartTotal),

      deliveryAddress: address,

      paymentMethod,

      paymentStatus: "Pending",

      orderStatus: "Pending",

    };

    // Send order with authentication token
    const response = await api.post(
      "/orders",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Get created order
    const createdOrder = response.data?.order || response.data;

    if (!createdOrder || !createdOrder._id) {
      throw new Error("Order creation was not confirmed.");
    }

    console.log("ORDER CREATED:", createdOrder);

    // Clear cart after successful order
    let cartCleared = true;

    try {
      await clearCart();
    } catch (cartError) {
      cartCleared = false;
      console.log("CART CLEAR ERROR:", cartError.message);
    }

    // Show success popup
setSuccessOrder(createdOrder);
setOrderSuccessVisible(true);

    


  } catch (error) {

    console.log(
      "ORDER ERROR:",
      error.response?.data || error.message
    );

    Alert.alert(
      "Order Failed",
      "Order could not be placed. Please check your internet connection and try again."
    );

  } finally {

    setPlacingOrder(false);

  }

};

  // =====================================
  // SCREEN UI
  // =====================================

  return (

    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >

          <Forward2
            size={23}
            color="#222222"
            style={{
              transform: [{ rotate: "180deg" }],
            }}
          />

        </TouchableOpacity>


        <View style={styles.headerTextContainer}>

          <Text style={styles.headerTitle}>
            Payment
          </Text>

          <Text style={styles.headerSubtitle}>
            Complete your purchase
          </Text>

        </View>


        <View style={styles.secureIcon}>

          <Check
            size={19}
            color="#22A447"
          />

        </View>
<Modal
  visible={orderSuccessVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setOrderSuccessVisible(false)}
>
  <View style={styles.successOverlay}>

    <View style={styles.successCard}>

      <View style={styles.successIcon}>
        <Check size={38} color="#FFFFFF" />
      </View>

      <Text style={styles.successTitle}>
        Order Placed!
      </Text>

      <Text style={styles.successMessage}>
        Your order is confirmed.
      </Text>

      <TouchableOpacity
        style={styles.successButton}
        activeOpacity={0.85}
        onPress={() => {
          setOrderSuccessVisible(false);

          navigation.navigate("Tabs", {
            screen: "Orders",
            params: {
              newOrder: successOrder,
            },
          });
        }}
      >
        <Text style={styles.successButtonText}>
          View My Orders
        </Text>
      </TouchableOpacity>

    </View>

  </View>
</Modal>
      </View>


      {/* SCROLLABLE CONTENT */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* STEP INDICATOR */}

        <View style={styles.stepContainer}>

          <View style={styles.stepItem}>

            <View style={styles.completedStep}>
              <Check size={14} color="#FFFFFF" />
            </View>

            <Text style={styles.stepText}>
              Address
            </Text>

          </View>


          <View style={styles.stepLine} />


          <View style={styles.stepItem}>

            <View style={styles.activeStep}>
              <Text style={styles.activeStepNumber}>
                2
              </Text>
            </View>

            <Text style={styles.activeStepText}>
              Payment
            </Text>

          </View>


          <View style={styles.stepLine} />


          <View style={styles.stepItem}>

            <View style={styles.inactiveStep}>
              <Text style={styles.inactiveStepNumber}>
                3
              </Text>
            </View>

            <Text style={styles.stepText}>
              Complete
            </Text>

          </View>

        </View>


        {/* DELIVERY ADDRESS */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Delivery Address
          </Text>

          <Text style={styles.sectionSubtitle}>
            Your order will be delivered here
          </Text>

        </View>


        {address ? (

          <View style={styles.addressCard}>

            <View style={styles.addressTop}>

              <View style={styles.addressIconBox}>
                <Text style={styles.addressIcon}>
                  📍
                </Text>
              </View>


              <View style={styles.addressTypeContainer}>

                <Text style={styles.addressType}>
                  Delivery Location
                </Text>

                <Text style={styles.addressName}>
                  {address.fullName}
                </Text>

              </View>


              <View style={styles.savedBadge}>

                <Text style={styles.savedBadgeText}>
                  SELECTED
                </Text>

              </View>

            </View>


            <View style={styles.addressDivider} />


            <Text style={styles.addressDetails}>
              {address.house}, {address.area}
            </Text>

            <Text style={styles.addressDetails}>
              {address.city}, {address.state}
            </Text>

            <Text style={styles.addressDetails}>
              {address.pincode}
            </Text>

            <Text style={styles.phoneText}>
              Phone: {address.phone}
            </Text>

          </View>

        ) : (

          <TouchableOpacity
            style={styles.addAddressButton}
            onPress={() => navigation.goBack()}
          >

            <Text style={styles.addAddressText}>
              Please select a delivery address
            </Text>

          </TouchableOpacity>

        )}


        {/* PAYMENT METHODS */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Payment Method
          </Text>

          <Text style={styles.sectionSubtitle}>
            Choose how you want to pay
          </Text>

        </View>


        {/* CASH ON DELIVERY */}

        <TouchableOpacity
          style={[
            styles.paymentCard,
            paymentMethod === "COD" && styles.selectedPaymentCard,
          ]}
          onPress={() => setPaymentMethod("COD")}
          activeOpacity={0.8}
        >

          <View style={styles.paymentIconBox}>

            <Wallet
              size={25}
              color="#22A447"
            />

          </View>


          <View style={styles.paymentInfo}>

            <Text style={styles.paymentTitle}>
              Cash on Delivery
            </Text>

            <Text style={styles.paymentDescription}>
              Pay when your order arrives
            </Text>

            <View style={styles.availableBadge}>

              <Text style={styles.availableText}>
                AVAILABLE
              </Text>

            </View>

          </View>


          <View
            style={[
              styles.radio,
              paymentMethod === "COD" && styles.radioSelected,
            ]}
          >

            {paymentMethod === "COD" && (
              <View style={styles.radioDot} />
            )}

          </View>

        </TouchableOpacity>


        {/* ONLINE PAYMENT - DISABLED */}

        <View style={styles.onlineCard}>

          <View style={styles.onlineIconBox}>

            <Wallet
              size={25}
              color="#9CA3AF"
            />

          </View>


          <View style={styles.paymentInfo}>

            <Text style={styles.onlineTitle}>
              Online Payment
            </Text>

            <Text style={styles.paymentDescription}>
              UPI, Cards and Net Banking
            </Text>

            <View style={styles.comingSoonBadge}>

              <Text style={styles.comingSoonText}>
                COMING SOON
              </Text>

            </View>

          </View>


          <View style={styles.radio} />

        </View>


        {/* ORDER SUMMARY */}

        <View style={styles.summaryCard}>

          <Text style={styles.summaryTitle}>
            Order Summary
          </Text>


          <View style={styles.summaryRow}>

            <Text style={styles.summaryLabel}>
              Total Items
            </Text>

            <Text style={styles.summaryValue}>
              {totalItems} Items
            </Text>

          </View>


          <View style={styles.summaryRow}>

            <Text style={styles.summaryLabel}>
              Payment Method
            </Text>

            <Text style={styles.summaryValue}>
              Cash on Delivery
            </Text>

          </View>


          <View style={styles.summaryDivider} />


          <View style={styles.totalRow}>

            <View>

              <Text style={styles.totalLabel}>
                Total Amount
              </Text>

              <Text style={styles.totalSubtitle}>
                Inclusive of all charges
              </Text>

            </View>


            <Text style={styles.totalAmount}>
              ₹{Number(cartTotal || 0).toFixed(2)}
            </Text>

          </View>

        </View>


        {/* BOTTOM SPACE */}

        <View style={{ height: 20 }} />

      </ScrollView>


      {/* FIXED BOTTOM BUTTON */}

      <View style={styles.bottomContainer}>

        <View style={styles.bottomPriceContainer}>

          <Text style={styles.bottomTotalLabel}>
            Total Payable
          </Text>

          <Text style={styles.bottomTotal}>
            ₹{Number(cartTotal || 0).toFixed(2)}
          </Text>

        </View>


        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            placingOrder && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={placingOrder}
          activeOpacity={0.85}
        >

          {placingOrder ? (

            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />

          ) : (

            <>

              <Text style={styles.placeOrderText}>
                Place Order
              </Text>

              <Forward2
                size={21}
                color="#FFFFFF"
                style={{
                  transform: [{ rotate: "0deg" }],
                }}
              />

            </>

          )}

        </TouchableOpacity>

      </View>

    </View>

  );

}


// =============================================
// STYLES
// =============================================


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7FBF4",
  },

  // HEADER

  header: {
    height: 82,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    elevation: 3,
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#E1F5DF",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTextContainer: {
    flex: 1,
    marginLeft: 14,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#163D2B",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#7D8B80",
    marginTop: 3,
  },

  secureIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#E1F5DF",
    justifyContent: "center",
    alignItems: "center",
  },

  // SCROLL CONTENT

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  // STEP INDICATOR

  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 25,
  },

  stepItem: {
    alignItems: "center",
    gap: 6,
  },

  completedStep: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#22A447",
    alignItems: "center",
    justifyContent: "center",
  },

  activeStep: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#22A447",
    alignItems: "center",
    justifyContent: "center",
  },

  activeStepNumber: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  inactiveStep: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#EAF0E9",
    alignItems: "center",
    justifyContent: "center",
  },

  inactiveStepNumber: {
    color: "#89958B",
    fontSize: 13,
    fontWeight: "700",
  },

  stepText: {
    fontSize: 11,
    color: "#89958B",
    fontWeight: "600",
  },

  activeStepText: {
    fontSize: 11,
    color: "#168044",
    fontWeight: "800",
  },

  stepLine: {
    height: 2,
    flex: 1,
    backgroundColor: "#DDE8DD",
    marginHorizontal: 8,
    marginBottom: 17,
  },

  // SECTION HEADERS

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#163D2B",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#89958B",
    marginTop: 4,
  },

  // ADDRESS CARD

  addressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 17,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#DDEBDD",
  },

  addressTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  addressIconBox: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#E1F5DF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  addressIcon: {
    fontSize: 20,
  },

  addressTypeContainer: {
    flex: 1,
  },

  addressType: {
    fontSize: 11,
    color: "#89958B",
    fontWeight: "600",
  },

  addressName: {
    fontSize: 14,
    color: "#163D2B",
    fontWeight: "800",
    marginTop: 3,
  },

  savedBadge: {
    backgroundColor: "#E1F5DF",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7,
  },

  savedBadgeText: {
    color: "#168044",
    fontSize: 9,
    fontWeight: "800",
  },

  addressDivider: {
    height: 1,
    backgroundColor: "#E8F0E8",
    marginVertical: 14,
  },

  addressDetails: {
    fontSize: 13,
    color: "#596B5D",
    marginBottom: 5,
    lineHeight: 19,
  },

  phoneText: {
    fontSize: 12,
    color: "#168044",
    fontWeight: "700",
    marginTop: 6,
  },

  addAddressButton: {
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 25,
  },

  addAddressText: {
    color: "#168044",
    fontWeight: "700",
  },

  // PAYMENT CARDS

  paymentCard: {
    minHeight: 105,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#DDE8DD",
    marginBottom: 12,
  },

  selectedPaymentCard: {
    borderColor: "#22A447",
    backgroundColor: "#F0FAEF",
  },

  paymentIconBox: {
    width: 49,
    height: 49,
    borderRadius: 14,
    backgroundColor: "#E1F5DF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  paymentInfo: {
    flex: 1,
  },

  paymentTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#163D2B",
  },

  paymentDescription: {
    fontSize: 11,
    color: "#89958B",
    marginTop: 5,
  },

  availableBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E1F5DF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 7,
  },

  availableText: {
    color: "#168044",
    fontSize: 9,
    fontWeight: "800",
  },

  // ONLINE PAYMENT

  onlineCard: {
    minHeight: 105,
    backgroundColor: "#F0F3EF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1E9E0",
    marginBottom: 25,
    opacity: 0.7,
  },

  onlineIconBox: {
    width: 49,
    height: 49,
    borderRadius: 14,
    backgroundColor: "#E1E8E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  onlineTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#7C897E",
  },

  comingSoonBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E2EAE1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 7,
  },

  comingSoonText: {
    fontSize: 9,
    color: "#7C897E",
    fontWeight: "800",
  },

  // RADIO BUTTON

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#C9D6CA",
    justifyContent: "center",
    alignItems: "center",
  },

  radioSelected: {
    borderColor: "#22A447",
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#22A447",
  },

  // ORDER SUMMARY

  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 17,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E1EAE0",
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#163D2B",
    marginBottom: 17,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#89958B",
  },

  summaryValue: {
    fontSize: 13,
    color: "#263D2D",
    fontWeight: "700",
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "#E1EAE0",
    marginVertical: 5,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#163D2B",
  },

  totalSubtitle: {
    fontSize: 10,
    color: "#89958B",
    marginTop: 4,
  },

  totalAmount: {
    fontSize: 21,
    fontWeight: "900",
    color: "#168044",
  },

  // BOTTOM BUTTON

  bottomContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 13,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: "#E1EAE0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 12,
  },

  bottomPriceContainer: {
    flex: 1,
  },

  bottomTotalLabel: {
    fontSize: 11,
    color: "#89958B",
    fontWeight: "600",
  },

  bottomTotal: {
    fontSize: 20,
    color: "#163D2B",
    fontWeight: "900",
    marginTop: 3,
  },

  placeOrderButton: {
    height: 54,
    backgroundColor: "#168044",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 23,
    minWidth: 165,
    gap: 10,
    elevation: 3,
  },

  placeOrderText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "800",
  },

  disabledButton: {
    opacity: 0.6,
  },

  // SUCCESS POPUP

successOverlay: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.55)",
  justifyContent: "center",
  alignItems: "center",
  padding: 25,
},

successCard: {
  width: "100%",
  backgroundColor: "#FFFFFF",
  borderRadius: 25,
  padding: 25,
  alignItems: "center",
  elevation: 10,
},

successIcon: {
  width: 75,
  height: 75,
  borderRadius: 40,
  backgroundColor: "#22A447",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 18,
},

successTitle: {
  fontSize: 23,
  fontWeight: "900",
  color: "#163D2B",
  marginBottom: 8,
},

successMessage: {
  fontSize: 14,
  color: "#89958B",
  marginBottom: 25,
},

successButton: {
  width: "100%",
  height: 52,
  backgroundColor: "#168044",
  borderRadius: 13,
  justifyContent: "center",
  alignItems: "center",
},

successButtonText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "800",
},

});
