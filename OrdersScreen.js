
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./services/api";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // 1. Fetch customer orders from backend
  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const savedUser = await AsyncStorage.getItem("user");

      if (!savedUser) {
        setOrders([]);
        setError("Please login again.");
        return;
      }

      const currentUser = JSON.parse(savedUser);
      const userId = currentUser?.id || currentUser?._id;

      if (!userId) {
        setOrders([]);
        setError("User information not found.");
        return;
      }

      const response = await api.get(`/orders/${userId}`);

      setOrders(response.data?.orders || []);

    } catch (err) {
      console.log(
        "FETCH ORDERS ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.status === 401
          ? "Your session has expired. Please login again."
          : "Unable to load orders. Please try again."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // 2. Delete order silently
  const deleteOrder = async (orderId) => {
    try {
      setDeletingId(orderId);

      await api.delete(`/orders/${orderId}`);

      setOrders((oldOrders) =>
        oldOrders.filter((order) => order._id !== orderId)
      );

    } catch (error) {
      console.log(
        "DELETE ORDER ERROR:",
        error.response?.data?.message || error.message
      );
    } finally {
      setDeletingId(null);
    }
  };

  // 3. Load orders whenever screen opens
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  // 4. Get color according to order status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "#16834A";
      case "confirmed":
        return "#2878D0";
      case "shipped":
        return "#7954C8";
      case "cancelled":
        return "#D94B4B";
      case "pending":
        return "#D18A20";
      default:
        return "#68736B";
    }
  };

  // 5. Format order date
  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // 6. Display one order card
  const renderOrder = ({ item }) => {
    const statusColor = getStatusColor(item.orderStatus);

    return (
      <View style={styles.orderCard}>

        {/* Card Header */}
        
<View style={styles.headerActions}>
  <View
    style={[
      styles.statusBadge,
      { backgroundColor: statusColor + "18" },
    ]}
  >
    <View
      style={[
        styles.statusDot,
        { backgroundColor: statusColor },
      ]}
    />
    <Text style={[styles.statusText, { color: statusColor }]}>
      {item.orderStatus || "Pending"}
    </Text>
  </View>

  {/* DELETE ORDER BUTTON */}
  {item.orderStatus?.toLowerCase() !== "delivered" && (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteOrder(item._id)}
      disabled={deletingId === item._id}
      activeOpacity={0.7}
    >
      {deletingId === item._id ? (
        <ActivityIndicator
          size="small"
          color="#D93636"
        />
      ) : (
        <Ionicons
          name="trash-outline"
          size={18}
          color="#D93636"
        />
      )}
    </TouchableOpacity>
  )}
</View>


        <View style={styles.divider} />

        {/* Order Summary */}
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.label}>ORDER ID</Text>
            <Text style={styles.orderId}>
              #{item._id?.slice(-8)?.toUpperCase()}
            </Text>
          </View>

          <View style={styles.totalBox}>
            <Text style={styles.label}>TOTAL AMOUNT</Text>
            <Text style={styles.totalAmount}>
              ₹{Number(item.totalAmount || 0).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Products Section */}
        <View style={styles.itemsSection}>
          <View style={styles.itemsHeader}>
            <Text style={styles.sectionTitle}>Order Items</Text>

            <View style={styles.itemCountBadge}>
              <Text style={styles.itemCountText}>
                {item.totalItems || 0} Items
              </Text>
            </View>
          </View>

          {item.items?.map((product, index) => (
            <View
              key={`${item._id}-${index}`}
              style={styles.productRow}
            >
              <View style={styles.productIcon}>
                <Ionicons
                  name="leaf-outline"
                  size={17}
                  color="#16834A"
                />
              </View>

              <Text style={styles.productName}>
                {product.name || "Product"}
              </Text>

              <Text style={styles.productQuantity}>
                × {product.quantity || 0}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Payment Details */}
        <View style={styles.footerRow}>
          <View style={styles.paymentInfo}>
            <View style={styles.paymentIcon}>
              <Ionicons
                name="wallet-outline"
                size={17}
                color="#16834A"
              />
            </View>

            <View>
              <Text style={styles.paymentLabel}>Payment Method</Text>
              <Text style={styles.paymentText}>
                {item.paymentMethod || "Payment"}
              </Text>
            </View>
          </View>

          <View style={styles.paymentStatusBox}>
            <Text style={styles.paymentLabel}>Payment Status</Text>
            <Text style={styles.paymentStatus}>
              {item.paymentStatus || "Pending"}
            </Text>
          </View>
        </View>

      </View>
    );
  };

  // 7. Loading Screen
  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingIcon}>
          <ActivityIndicator size="large" color="#16834A" />
        </View>

        <Text style={styles.loadingText}>
          Loading your orders...
        </Text>
      </View>
    );
  }

  // 8. Error Screen
  if (error && orders.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyIconBox}>
          <Ionicons
            name="cloud-offline-outline"
            size={48}
            color="#AAB5AC"
          />
        </View>

        <Text style={styles.emptyTitle}>
          Something went wrong
        </Text>

        <Text style={styles.emptyText}>{error}</Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchOrders()}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>YOUR ACCOUNT</Text>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>
            Track and manage your orders
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => fetchOrders(true)}
          disabled={refreshing}
          activeOpacity={0.7}
        >
          <Ionicons
            name="refresh-outline"
            size={22}
            color="#16834A"
          />
        </TouchableOpacity>
      </View>

      {/* Order Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Ionicons
            name="bag-check-outline"
            size={27}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.summaryDetails}>
          <Text style={styles.summaryNumber}>
            {orders.length}
          </Text>
          <Text style={styles.summaryLabel}>
            Total Orders
          </Text>
        </View>

        <View style={styles.summaryRight}>
          <Text style={styles.summaryRightTitle}>CandyApp</Text>
          <Text style={styles.summaryRightText}>
            Order History
          </Text>
          <View style={styles.summaryLine} />
        </View>
      </View>

      {/* Error Message */}
      {error ? (
        <Text style={styles.errorMessage}>{error}</Text>
      ) : null}

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchOrders(true)}
            colors={["#16834A"]}
            tintColor="#16834A"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons
                name="receipt-outline"
                size={48}
                color="#AAB5AC"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Orders Yet
            </Text>

            <Text style={styles.emptyText}>
              Your orders will appear here after checkout.
            </Text>
          </View>
        }
      />
    </View>
  );
}

// 9. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8F5",
   
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#F5F8F5",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#16834A",
    marginBottom: 5,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#172B20",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#829087",
    marginTop: 5,
  },

  refreshButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#E5F3E9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D6EBDD",
  },

  summaryCard: {
    marginHorizontal: 18,
    marginBottom: 20,
    padding: 19,
    borderRadius: 22,
    backgroundColor: "#176B3A",
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#176B3A",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  summaryIcon: {
    width: 51,
    height: 51,
    borderRadius: 17,
    backgroundColor: "#FFFFFF25",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  summaryDetails: {
    justifyContent: "center",
  },

  summaryNumber: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
  },

  summaryLabel: {
    color: "#D5EBDC",
    fontSize: 12,
    marginTop: 2,
  },

  summaryRight: {
    marginLeft: "auto",
    alignItems: "flex-end",
  },

  summaryRightTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  summaryRightText: {
    color: "#D5EBDC",
    fontSize: 11,
    marginTop: 4,
  },

  summaryLine: {
    width: 35,
    height: 3,
    borderRadius: 5,
    backgroundColor: "#A9D8B6",
    marginTop: 9,
  },

  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 35,
    flexGrow: 1,
  },

  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    padding: 16,
    marginBottom: 19,
    borderWidth: 1,
    borderColor: "#EAF0EA",
    elevation: 2,
    shadowColor: "#1B3825",
    shadowOpacity: 0.05,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  orderIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#E8F5EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  orderInfo: {
    flex: 1,
  },

  orderTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#24352A",
  },

  orderDate: {
    fontSize: 12,
    color: "#8A968E",
    marginTop: 5,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "capitalize",
  },

  deleteButton: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FFE0E0",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#EDF1ED",
    marginVertical: 15,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.7,
    color: "#98A39B",
    marginBottom: 6,
  },

  orderId: {
    fontSize: 14,
    fontWeight: "800",
    color: "#34483A",
  },

  totalBox: {
    alignItems: "flex-end",
  },

  totalAmount: {
    fontSize: 21,
    fontWeight: "800",
    color: "#16834A",
  },

  itemsSection: {
    marginTop: 19,
  },

  itemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#34483A",
  },

  itemCountBadge: {
    backgroundColor: "#EDF7EF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  itemCountText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16834A",
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    minHeight: 30,
  },

  productIcon: {
    width: 29,
    height: 29,
    borderRadius: 10,
    backgroundColor: "#EDF7EF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  productName: {
    flex: 1,
    fontSize: 13,
    color: "#526057",
    fontWeight: "500",
  },

  productQuantity: {
    fontSize: 13,
    fontWeight: "800",
    color: "#34483A",
    marginLeft: 8,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  paymentIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: "#EDF7EF",
    justifyContent: "center",
    alignItems: "center",
  },

  paymentLabel: {
    fontSize: 9,
    color: "#98A39B",
    fontWeight: "700",
    marginBottom: 4,
  },

  paymentText: {
    fontSize: 12,
    color: "#34483A",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  paymentStatusBox: {
    alignItems: "flex-end",
  },

  paymentStatus: {
    fontSize: 12,
    color: "#16834A",
    fontWeight: "800",
    textTransform: "capitalize",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 65,
  },

  emptyIconBox: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: "#E9F2EB",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#26392C",
    marginTop: 17,
  },

  emptyText: {
    fontSize: 13,
    color: "#849087",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },

  loadingIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: "#E9F2EB",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 14,
    color: "#68736B",
    fontSize: 13,
    fontWeight: "600",
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#16834A",
    paddingHorizontal: 21,
    paddingVertical: 13,
    borderRadius: 13,
    marginTop: 21,
    elevation: 2,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },

  errorMessage: {
    color: "#C34B4B",
    fontSize: 12,
    marginHorizontal: 20,
    marginBottom: 10,
  },
});
