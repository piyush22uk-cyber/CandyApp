
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import api from "./services/api";
import { useCart } from "./CartContext";

// Product categories
const CATEGORIES = [
  "All",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Bakery",
  "Drinks",
];

const IMAGE_BASE_URL = "http://192.168.100.18:2005";

const GREEN = "#183D32";

export default function SearchScreen({ navigation }) {

  // Search and category states
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Product states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Cart functions
  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [updatingProductId, setUpdatingProductId] = useState(null);

  // Cart message
  const [cartMessage, setCartMessage] = useState("");
  const [cartMessageType, setCartMessageType] = useState("success");

  // Total cart items
  const totalCartItems = cart.reduce((total, item) => {
    return total + Number(item.quantity || 0);
  }, 0);

  // Get products from backend
  const fetchProducts = async (isRefresh = false) => {

    try {

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/fruits");

      setProducts(response.data.fruits || []);

    } catch (err) {

      console.log(
        "Product API Error:",
        err.response?.data || err.message
      );

      setError("Unable to load products. Please try again.");

    } finally {

      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load products when screen opens
  useEffect(() => {
    fetchProducts();
  }, []);

  // Find product inside cart
  const getCartItem = (productId) => {

    return cart.find((item) => {

      const rawId = item.productId || item.id || item._id;

      const cartProductId =
        rawId && typeof rawId === "object"
          ? rawId._id
          : rawId;

      return String(cartProductId) === String(productId);
    });
  };

  // Calculate maximum allowed quantity
  const getMaximumQuantity = (product) => {

    const stock = Number(product.quantity || 0);

    const maxQuantity =
      product.maxQuantity == null
        ? stock
        : Number(product.maxQuantity);

    return Math.max(0, Math.min(stock, maxQuantity));
  };

  // Show cart message
  const showCartMessage = (message, type = "success") => {

    setCartMessage(message);
    setCartMessageType(type);

    setTimeout(() => {
      setCartMessage("");
    }, 2000);
  };

  // Add product to cart
  const handleAddToCart = async (product) => {

    const productId = product._id || product.id;
    const maximumQuantity = getMaximumQuantity(product);

    if (maximumQuantity <= 0) {
      showCartMessage("Product is out of stock", "error");
      return;
    }

    setUpdatingProductId(String(productId));

    try {

      const cartProduct = {
        ...product,
        id: productId,
        productId: productId,
        price: Number(product.price),
        quantity: 1,
        availableQuantity: Number(product.quantity || 0),
        maxQuantity: maximumQuantity,
      };

      await addToCart(cartProduct);

      showCartMessage(`${product.name} added to cart`);

    } catch (err) {

      console.log("ADD TO CART ERROR:", err.message);

      showCartMessage("Unable to add product", "error");

    } finally {

      setUpdatingProductId(null);
    }
  };

  // Increase cart quantity
  const handleIncrease = async (cartItem, productId) => {

    setUpdatingProductId(String(productId));

    try {

      await increaseQuantity(cartItem);

    } catch (err) {

      console.log("INCREASE ERROR:", err.message);

      showCartMessage("Unable to increase quantity", "error");

    } finally {

      setUpdatingProductId(null);
    }
  };

  // Decrease cart quantity
  const handleDecrease = async (cartItem, productId) => {

    if (!cartItem) return;

    setUpdatingProductId(String(productId));

    try {

      await decreaseQuantity(cartItem);

    } catch (err) {

      console.log("DECREASE ERROR:", err.message);

      showCartMessage("Unable to decrease quantity", "error");

    } finally {

      setUpdatingProductId(null);
    }
  };

  // Filter products by name and category
  const filteredProducts = products.filter((product) => {

    const productName = (product.name || "").toLowerCase();

    const searchValue = searchText.trim().toLowerCase();

    const matchesName = productName.includes(searchValue);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesName && matchesCategory;
  });

  // Create product image URL
  const getImageUrl = (image) => {

    if (!image || typeof image !== "string") {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${IMAGE_BASE_URL}${image}`;
  };

  // Clear search and category filters
  const clearFilters = () => {
    setSearchText("");
    setSelectedCategory("All");
  };

  // Render category button
  const renderCategory = ({ item }) => {

    const isSelected = selectedCategory === item;

    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          isSelected && styles.selectedCategoryButton,
        ]}
        onPress={() => setSelectedCategory(item)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render product card
  const renderProduct = ({ item }) => {

    const productId = item._id || item.id;

    const imageUrl = getImageUrl(item.image);

    const stock = Number(item.quantity || 0);

    const maximumQuantity = getMaximumQuantity(item);

    const cartItem = getCartItem(productId);

    const cartQuantity = Number(cartItem?.quantity || 0);

    const isOutOfStock = stock <= 0;

    const isMaximumReached = cartQuantity >= maximumQuantity;

    const isUpdating =
      updatingProductId === String(productId);

    return (

      <View style={styles.productCard}>

        {/* Product image */}
        <View style={styles.imageContainer}>

          {imageUrl ? (

            <Image
              source={{ uri: imageUrl }}
              style={styles.productImage}
              resizeMode="contain"
            />

          ) : (

            <View style={styles.noImage}>
              <Ionicons
                name="image-outline"
                size={38}
                color="#A2B3A6"
              />

              <Text style={styles.noImageText}>
                No Image
              </Text>
            </View>

          )}

          {/* Category badge */}
          <View style={styles.productTag}>
            <Text style={styles.productTagText}>
              {item.category || "Grocery"}
            </Text>
          </View>

          {/* Stock badge */}
          {isOutOfStock && (
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>
                SOLD OUT
              </Text>
            </View>
          )}

        </View>

        {/* Product details */}
        <View style={styles.productDetails}>

          <Text
            style={styles.productName}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          <View style={styles.weightRow}>
            <Ionicons
              name="scale-outline"
              size={13}
              color="#87978B"
            />

            <Text style={styles.weightText}>
              {item.weight || "1 kg"}
            </Text>
          </View>

          {/* Price and stock */}
          <View style={styles.priceRow}>

            <View>
              <Text style={styles.productPrice}>
                ₹{Number(item.price || 0).toFixed(2)}
              </Text>

              <Text
                style={[
                  styles.stockText,
                  isOutOfStock && styles.outOfStockText,
                ]}
              >
                {isOutOfStock
                  ? "Out of stock"
                  : `${stock} available`}
              </Text>
            </View>

          </View>

          {/* Quantity controls */}
          <View style={styles.quantityContainer}>

            <TouchableOpacity
              disabled={cartQuantity === 0 || isUpdating}
              style={[
                styles.quantityButton,
                (cartQuantity === 0 || isUpdating) &&
                  styles.disabledButton,
              ]}
              onPress={() => handleDecrease(cartItem, productId)}
            >
              <Ionicons
                name="remove"
                size={17}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <Text style={styles.quantityNumber}>
              {isUpdating ? "..." : cartQuantity}
            </Text>

            <TouchableOpacity
              disabled={
                isOutOfStock ||
                isMaximumReached ||
                isUpdating
              }
              style={[
                styles.quantityButton,
                (isOutOfStock ||
                  isMaximumReached ||
                  isUpdating) &&
                  styles.disabledButton,
              ]}
              onPress={() => {

                if (cartQuantity === 0) {
                  handleAddToCart(item);
                } else {
                  handleIncrease(cartItem, productId);
                }

              }}
            >
              <Ionicons
                name="add"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>

          </View>

          {isMaximumReached && cartQuantity > 0 && (
            <Text style={styles.limitText}>
              Maximum quantity reached
            </Text>
          )}

        </View>

      </View>
    );
  };

  // Loading screen
  if (loading) {

    return (
      <View style={styles.centerContainer}>

        <ActivityIndicator
          size="large"
          color={GREEN}
        />

        <Text style={styles.loadingText}>
          Finding fresh products...
        </Text>

      </View>
    );
  }

  // Error screen
  if (error) {

    return (
      <View style={styles.centerContainer}>

        <View style={styles.errorIcon}>
          <Ionicons
            name="cloud-offline-outline"
            size={42}
            color="#B54747"
          />
        </View>

        <Text style={styles.errorTitle}>
          Something went wrong
        </Text>

        <Text style={styles.errorMessage}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchProducts()}
        >
          <Ionicons
            name="refresh"
            size={18}
            color="#FFFFFF"
          />

          <Text style={styles.retryText}>
            Try Again
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  // Search screen
  return (

    <View style={styles.container}>

      <StatusBar
        backgroundColor={GREEN}
        barStyle="light-content"
      />

      {/* Header */}
      <View style={styles.header}>

        <View style={styles.headerTop}>

          <View>
            <Text style={styles.headerSmall}>
              CANDYAPP MARKET
            </Text>

            <Text style={styles.headerTitle}>
              Discover
              <Text style={styles.headerTitleLight}>
                {" "}Freshness.
              </Text>
            </Text>

            <Text style={styles.headerSubtitle}>
              Find everything fresh, all in one place.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerCartButton}
            onPress={() => navigation.navigate("Cart")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="bag-handle-outline"
              size={24}
              color="#FFFFFF"
            />

            {totalCartItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {totalCartItems > 99 ? "99+" : totalCartItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>

        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>

          <Ionicons
            name="search-outline"
            size={22}
            color={GREEN}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search fruits, vegetables..."
            placeholderTextColor="#9AA69D"
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            returnKeyType="search"
          />

          {searchText.length > 0 && (

            <TouchableOpacity
              onPress={() => setSearchText("")}
            >
              <Ionicons
                name="close-circle"
                size={21}
                color="#89958C"
              />
            </TouchableOpacity>

          )}

        </View>

      </View>

      {/* Main product list */}
      <FlatList

        data={filteredProducts}

        keyExtractor={(item, index) =>
          `${item._id || item.id || "product"}-${index}`
        }

        renderItem={renderProduct}

        numColumns={2}

        columnWrapperStyle={styles.productRow}

        contentContainerStyle={styles.productList}

        showsVerticalScrollIndicator={false}

        keyboardShouldPersistTaps="handled"

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchProducts(true)}
            colors={[GREEN]}
            tintColor={GREEN}
          />
        }

        ListHeaderComponent={

          <View>

            {/* Promotional section */}
            <View style={styles.promoCard}>

              <View style={styles.promoContent}>

                <Text style={styles.promoLabel}>
                  FRESH & NATURAL
                </Text>

                <Text style={styles.promoTitle}>
                  Good food.
                  {"\n"}Better living.
                </Text>

                <Text style={styles.promoSubtitle}>
                  Explore your everyday essentials.
                </Text>

              </View>

              <View style={styles.promoIcon}>
                <Ionicons
                  name="leaf"
                  size={48}
                  color="#D7E8D5"
                />
              </View>

              <View style={styles.promoDecoration} />

            </View>

            {/* Categories heading */}
            <View style={styles.sectionHeading}>

              <View>
                <Text style={styles.sectionTitle}>
                  Explore Categories
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Find what you need
                </Text>
              </View>

              <Ionicons
                name="grid-outline"
                size={21}
                color={GREEN}
              />

            </View>

            {/* Category list */}
            <FlatList
              horizontal
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={renderCategory}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            />

            {/* Cart message */}
            {cartMessage ? (

              <View
                style={[
                  styles.cartMessage,
                  cartMessageType === "error" &&
                    styles.errorCartMessage,
                ]}
              >

                <Ionicons
                  name={
                    cartMessageType === "error"
                      ? "alert-circle"
                      : "checkmark-circle"
                  }
                  size={19}
                  color={
                    cartMessageType === "error"
                      ? "#B54747"
                      : "#16834A"
                  }
                />

                <Text
                  style={[
                    styles.cartMessageText,
                    cartMessageType === "error" &&
                      styles.errorCartText,
                  ]}
                >
                  {cartMessage}
                </Text>

              </View>

            ) : null}

            {/* Product heading */}
            <View style={styles.resultHeading}>

              <View>
                <Text style={styles.sectionTitle}>
                  {searchText ? "Search Results" : "Popular Picks"}
                </Text>

                <Text style={styles.sectionSubtitle}>
                  {filteredProducts.length} products found
                </Text>
              </View>

              <View style={styles.resultIcon}>
                <Ionicons
                  name="sparkles-outline"
                  size={19}
                  color={GREEN}
                />
              </View>

            </View>

          </View>
        }

        // Empty search result
        ListEmptyComponent={

          <View style={styles.emptyContainer}>

            <View style={styles.emptyIcon}>
              <Ionicons
                name="search-outline"
                size={40}
                color="#8DA293"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No products found
            </Text>

            <Text style={styles.emptyMessage}>
              Try another product name or category.
            </Text>

            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearFiltersText}>
                Clear Filters
              </Text>
            </TouchableOpacity>

          </View>
        }

      />

    </View>
  );
}

// Screen styles
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7F3",
    marginBottom:85,
  },

  // Header
  header: {
    backgroundColor: GREEN,
    paddingHorizontal: 20,
    paddingTop: 17,
    paddingBottom: 27,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerSmall: {
    color: "#B9D6C1",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 7,
    letterSpacing: -0.5,
  },

  headerTitleLight: {
    color: "#C7E7B9",
  },

  headerSubtitle: {
    color: "#D0DFD4",
    fontSize: 11,
    marginTop: 6,
  },

  headerCartButton: {
    width: 49,
    height: 49,
    borderRadius: 17,
    backgroundColor: "#315D49",
    justifyContent: "center",
    alignItems: "center",
  },

  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: "#E8B85C",
    justifyContent: "center",
    alignItems: "center",
  },

  cartBadgeText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: "900",
  },

  // Search
  searchContainer: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    marginTop: 23,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6ECE5",
    elevation: 4,
  },

  searchInput: {
    flex: 1,
    marginLeft: 11,
    fontSize: 13,
    color: "#26382D",
  },

  // Promotional card
  promoCard: {
    marginHorizontal: 18,
    marginTop: 21,
    height: 145,
    backgroundColor: "#244F3D",
    borderRadius: 21,
    padding: 18,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  promoContent: {
    zIndex: 2,
    justifyContent: "center",
  },

  promoLabel: {
    color: "#C6E4BB",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  promoTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 26,
    marginTop: 7,
  },

  promoSubtitle: {
    color: "#D4E1D7",
    fontSize: 10,
    marginTop: 7,
  },

  promoIcon: {
    width: 85,
    height: 85,
    borderRadius: 28,
    backgroundColor: "#37654D",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    transform: [{ rotate: "-12deg" }],
  },

  promoDecoration: {
    position: "absolute",
    width: 125,
    height: 125,
    borderRadius: 65,
    backgroundColor: "#315C45",
    right: -30,
    bottom: -75,
  },

  // Section headings
  sectionHeading: {
    marginHorizontal: 19,
    marginTop: 25,
    marginBottom: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: GREEN,
    fontSize: 17,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: "#89968C",
    fontSize: 11,
    marginTop: 5,
  },

  // Categories
  categoryList: {
    paddingHorizontal: 18,
    paddingBottom: 5,
  },

  categoryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3EAE2",
    borderRadius: 14,
    paddingHorizontal: 17,
    paddingVertical: 11,
    marginRight: 9,
  },

  selectedCategoryButton: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  categoryText: {
    color: "#536558",
    fontSize: 12,
    fontWeight: "700",
  },

  selectedCategoryText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  // Cart message
  cartMessage: {
    marginHorizontal: 18,
    marginTop: 12,
    padding: 11,
    borderRadius: 12,
    backgroundColor: "#E6F4E8",
    flexDirection: "row",
    alignItems: "center",
  },

  cartMessageText: {
    color: "#176B3A",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 8,
    flex: 1,
  },

  errorCartMessage: {
    backgroundColor: "#FCE8E8",
  },

  errorCartText: {
    color: "#B54747",
  },

  // Product heading
  resultHeading: {
    marginHorizontal: 19,
    marginTop: 25,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  resultIcon: {
    width: 37,
    height: 37,
    borderRadius: 13,
    backgroundColor: "#E8F0E6",
    justifyContent: "center",
    alignItems: "center",
  },

  // Product list
  productList: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },

  productRow: {
    justifyContent: "space-between",
    marginBottom: 13,
  },

  // Product card
  productCard: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 9,
    borderWidth: 1,
    borderColor: "#EAEFE9",
    elevation: 2,
    shadowColor: "#183D32",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 7,
  },

  imageContainer: {
    height: 125,
    backgroundColor: "#F1F5EF",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  noImageText: {
    color: "#89958C",
    fontSize: 10,
    marginTop: 5,
  },

  productTag: {
    position: "absolute",
    top: 7,
    left: 7,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  productTagText: {
    color: GREEN,
    fontSize: 9,
    fontWeight: "800",
  },

  soldOutBadge: {
    position: "absolute",
    bottom: 7,
    left: 7,
    backgroundColor: "#FCE8E8",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },

  soldOutText: {
    color: "#B54747",
    fontSize: 8,
    fontWeight: "900",
  },

  // Product details
  productDetails: {
    paddingTop: 11,
  },

  productName: {
    color: "#24382C",
    fontSize: 13,
    fontWeight: "800",
    minHeight: 35,
    lineHeight: 17,
  },

  weightRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  weightText: {
    color: "#89958C",
    fontSize: 10,
    marginLeft: 4,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 11,
  },

  productPrice: {
    color: GREEN,
    fontSize: 17,
    fontWeight: "900",
  },

  stockText: {
    color: "#89958C",
    fontSize: 9,
    marginTop: 4,
  },

  outOfStockText: {
    color: "#B54747",
    fontWeight: "700",
  },

  // Quantity controls
  quantityContainer: {
    backgroundColor: "#EDF3EC",
    borderRadius: 11,
    padding: 5,
    marginTop: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  quantityButton: {
    width: 29,
    height: 29,
    borderRadius: 9,
    backgroundColor: GREEN,
    justifyContent: "center",
    alignItems: "center",
  },

  quantityNumber: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "900",
  },

  disabledButton: {
    backgroundColor: "#AAB8AE",
    opacity: 0.55,
  },

  limitText: {
    color: "#B54747",
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 5,
  },

  // Loading and error
  centerContainer: {
    flex: 1,
    backgroundColor: "#F5F7F3",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  loadingText: {
    color: "#52745D",
    fontSize: 13,
    marginTop: 13,
  },

  errorIcon: {
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: "#FCE8E8",
    justifyContent: "center",
    alignItems: "center",
  },

  errorTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#26382D",
    marginTop: 17,
  },

  errorMessage: {
    fontSize: 12,
    color: "#7D8980",
    textAlign: "center",
    marginTop: 8,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GREEN,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    marginLeft: 8,
  },

  // Empty search
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 45,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: "#E9F0E8",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#26382D",
    marginTop: 15,
  },

  emptyMessage: {
    fontSize: 12,
    color: "#89958C",
    textAlign: "center",
    marginTop: 7,
  },

  clearFiltersButton: {
    backgroundColor: GREEN,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 18,
  },

  clearFiltersText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },

});