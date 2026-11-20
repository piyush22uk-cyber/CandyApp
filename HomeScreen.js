import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Image,
  Pressable,
  Modal,
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCart} from './CartContext';

import {
  Magnifier,
  Handshake,
  Bell,
} from 'reicon-react-native';
// Existing backend API
const API_BASE_URL = 'http://192.168.100.18:2005';
const PRODUCTS_API_URL = `${API_BASE_URL}/api/fruits`;

const CATEGORIES = [
  {name: 'Fruits', icon: '🍎'},
  {name: 'Vegetables', icon: '🥦'},
  {name: 'Dairy', icon: '🥛'},
  {name: 'Bakery', icon: '🍞'},
  {name: 'Drinks', icon: '🥤'},
];

export default function HomeScreen({navigation}) {
  // Screen data
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and category
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Floating cart panel
  const [showCart, setShowCart] = useState(false);
  const [showShopPopup, setShowShopPopup] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState(null);
const [cartMessageType, setCartMessageType] = useState("success");

  // Reuse the existing CartContext
  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();

const [hasNewNotification, setHasNewNotification] = useState(false);


const getNotificationStatus = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      setHasNewNotification(false);
      return;
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/notifications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const notifications = response.data.notifications || [];

    setHasNewNotification(notifications.length > 0);
  } catch (error) {
    console.log(
      "Notification error:",
      error.response?.data?.message || error.message
    );
  }
};

useFocusEffect(
  useCallback(() => {
    getNotificationStatus();
  }, []),
);
  

  // 1. Get saved customer information
  const getUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');

      if (savedUser) {
        setUserData(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log('User error:', error.message);
    }
  };

  // 2. Get products from backend API
  const getProducts = async () => {
    try {
      const response = await axios.get(PRODUCTS_API_URL);

      // Backend currently returns products inside response.data.fruits
      const fruitList = response.data.fruits || [];

      const productList = fruitList.map(product => ({
        ...product,
        id: product._id || product.id,
      }));

      setProducts(productList);
    } catch (error) {
      console.log(
        'Products API error:',
        error.response?.data?.message || error.message,
      );
    }
  };

  // 3. Load user and products when screen opens
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([getUser(), getProducts()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 4. Search products and filter by category
  const filteredProducts = products.filter(product => {
    const productName = (product.name || '').toLowerCase();
    const searchText = search.trim().toLowerCase();

    const matchesSearch = productName.includes(searchText);

    const matchesCategory =
      selectedCategory === 'All' ||
      (product.category || '').toLowerCase() ===
        selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // 5. Count total units in cart
  const cartItemCount = cart.reduce((total, item) => {
    return total + Number(item.quantity || 0);
  }, 0);

  // 6. Get full product image URL
  const getImageUrl = image => {
    if (!image) {
      return null;
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    return `${API_BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
  };

  // Get product from cart
const getCartItem = productId => {
  return cart.find(item => {
    const rawId = item.productId || item.id || item._id;
    const cartProductId =
      rawId && typeof rawId === 'object' ? rawId._id : rawId;

    return String(cartProductId) === String(productId);
  });
};

// Get maximum allowed quantity
const getMaximumQuantity = product => {
  const stock = Number(product.quantity || 0);

  const maxQuantity =
    product.maxQuantity == null
      ? stock
      : Number(product.maxQuantity);

  return Math.max(0, Math.min(stock, maxQuantity));
};

// Add product
const handleAddToCart = async product => {
  const productId = product.id || product._id;
  const maximumQuantity = getMaximumQuantity(product);

  if (maximumQuantity <= 0) {
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
  } catch (error) {
    console.log("ADD TO CART ERROR:", error.message);
  } finally {
    setUpdatingProductId(null);
  }
};

// Increase quantity
const handleIncrease = async (item, productId) => {
  setUpdatingProductId(String(productId));

  try {
    await increaseQuantity(item);
  } finally {
    setUpdatingProductId(null);
  }
};

// Decrease quantity
const handleDecrease = async (item, productId) => {
  setUpdatingProductId(String(productId));

  try {
    await decreaseQuantity(item);
  } finally {
    setUpdatingProductId(null);
  }
};

  // 7. Open profile screen
  // Notification screen open karo
const openNotifications = () => {
  navigation.navigate('Notifications');
};
  // 8. Open the existing Cart screen
  const openCart = () => {
    setShowCart(false);
    navigation.navigate('Cart');
  };

  // Loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16834A" />
        <Text style={styles.loadingText}>Preparing your store...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.greetingRow}>
              <Text style={styles.smallText}>WELCOME TO CANDYAPP</Text>
              <Handshake size={18} />
            </View>

            <Text style={styles.userName} numberOfLines={1}>
              {userData?.name || 'Customer'} 👋
            </Text>

            <Text style={styles.headerSubtitle}>
              Fresh picks for your day
            </Text>
          </View>

          
<TouchableOpacity
  style={styles.notificationButton}
  onPress={openNotifications}
  accessibilityLabel="Open notifications"
>
  <View style={styles.notificationIconBox}>
    <Bell size={25} color="#176B43" />
  </View>

  {hasNewNotification && (
    <View style={styles.notificationDot} />
  )}
</TouchableOpacity>

        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Magnifier size={21} />

          <TextInput
            placeholder="Search fruits, vegetables..."
            placeholderTextColor="#8A948D"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearSearch}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SHOP NOW BANNER */}
        <View style={styles.offerCard}>
          <View style={styles.offerContent}>
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeText}>FRESH & FAST</Text>
            </View>

            <Text style={styles.offerTitle}>
              Freshness at{'\n'}your fingertips.
            </Text>

            <Text style={styles.offerSubtitle}>
              Fresh everyday essentials, picked for you.
            </Text>

            <TouchableOpacity
  style={styles.shopButton}
  activeOpacity={0.8}
  onPress={() => setShowShopPopup(true)}
>
  <Text style={styles.shopButtonText}>Shop Now</Text>
  <Text style={styles.shopButtonArrow}> →</Text>
</TouchableOpacity>
          </View>

          <View style={styles.bannerIllustration}>
            <Text style={styles.bannerEmoji}>🥬</Text>
            <Text style={styles.bannerFruit}>🍊 🍎</Text>
          </View>
        </View>

        {/* CATEGORIES */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <Text style={styles.sectionSubtitle}>
              Find your everyday favourites
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setSelectedCategory('All')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}>

          {CATEGORIES.map(category => {
            const isSelected = selectedCategory === category.name;

            return (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryCard,
                  isSelected && styles.selectedCategoryCard,
                ]}
                onPress={() =>
                  setSelectedCategory(
                    isSelected ? 'All' : category.name,
                  )}>

                <View
                  style={[
                    styles.categoryIconBox,
                    isSelected && styles.selectedCategoryIconBox,
                  ]}>
                  <Text style={styles.categoryIcon}>
                    {category.icon}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.selectedCategoryText,
                  ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* PRODUCT SECTION TITLE */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All'
                ? 'Popular Products'
                : selectedCategory}
            </Text>

            <Text style={styles.sectionSubtitle}>
              {filteredProducts.length} products available
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setSelectedCategory('All');
              setSearch('');
            }}>
            <Text style={styles.seeAll}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* PRODUCTS */}
        <View style={styles.productsContainer}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyProducts}>
              <Text style={styles.emptyProductsIcon}>🛒</Text>

              <Text style={styles.emptyProductsTitle}>
                No products found
              </Text>

              <Text style={styles.emptyProductsText}>
                Try another search or category.
              </Text>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}>
                <Text style={styles.resetButtonText}>
                  Show All Products
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredProducts.map(product => {
              const imageUrl = getImageUrl(product.image);
              // const stock = Number(product.quantity ?? 0);
              // const isOutOfStock = stock <= 0;

              const stock = Number(product.quantity || 0);
const maxQuantity = getMaximumQuantity(product);

const cartItem = getCartItem(product.id);
const cartQuantity = Number(cartItem?.quantity || 0);

const isOutOfStock = stock <= 0;
const isMaximumReached = cartQuantity >= maxQuantity;
const isUpdating =
  updatingProductId === String(product.id);

              return (
                <View
                  key={String(product.id)}
                  style={styles.productCard}>

                  {/* IMAGE */}
                  <View style={styles.productImageBox}>
                    {imageUrl ? (
                      <Image
                        source={{uri: imageUrl}}
                        style={styles.productImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.productPlaceholder}>🍎</Text>
                    )}

                    <View style={styles.productTag}>
                      <Text style={styles.productTagText}>
                        {product.category || 'Fresh'}
                      </Text>
                    </View>
                  </View>

                  {/* NAME */}
                  <Text
                    style={styles.productName}
                    numberOfLines={2}>
                    {product.name}
                  </Text>

                  {/* WEIGHT */}
                  <Text style={styles.productWeight}>
                    {product.weight || '1 kg'}
                  </Text>

                  {/* PRICE AND QUANTITY CONTROLS */}
{/* PRODUCT PRICE AND STOCK */}
<View style={styles.priceDetails}>
  <Text style={styles.price}>
    ₹{Number(product.price || 0).toFixed(2)}
  </Text>

  <Text
    style={[
      styles.stockText,
      isOutOfStock && styles.outOfStockText,
    ]}
  >
    {isOutOfStock
      ? 'Out of Stock'
      : `${stock} available`}
  </Text>
</View>

{/* QUANTITY CONTROLS */}
<View style={styles.centerQuantityControls}>
  {/* DECREASE */}
  <Pressable
    disabled={cartQuantity === 0 || isUpdating}
    style={[
      styles.productCardQuantityButton,
      (cartQuantity === 0 || isUpdating) &&
        styles.disabledButton,
    ]}
    onPress={() => handleDecrease(cartItem, product.id)}
  >
    <Text style={styles.productCardQuantityButtonText}>
      −
    </Text>
  </Pressable>

  {/* CURRENT QUANTITY */}
  <Text style={styles.productCardQuantityNumber}>
    {cartQuantity}
  </Text>

  {/* INCREASE */}
  <Pressable
    disabled={
      isOutOfStock ||
      isMaximumReached ||
      isUpdating
    }
    style={[
      styles.productCardQuantityButton,
      (isOutOfStock || isMaximumReached || isUpdating) &&
        styles.disabledButton,
    ]}
    onPress={() => {
      if (cartQuantity === 0) {
        handleAddToCart(product);
      } else {
        handleIncrease(cartItem, product.id);
      }
    }}
  >
    <Text style={styles.productCardQuantityButtonText}>
      +
    </Text>
  </Pressable>
</View>

{/* MAXIMUM QUANTITY MESSAGE */}
{isMaximumReached && cartQuantity > 0 && (
  <Text style={styles.outOfStockText}>
    {stock <= cartQuantity
      ? 'Stock Limit Reached'
      : 'Maximum Quantity Reached'}
  </Text>
)}

</View>
);
})
)}
</View>

<View style={styles.footerSpace} />

</ScrollView>

{/* FLOATING CART BUTTON */}

       
      {/* FLOATING CART BUTTON */}
{cartItemCount > 0 && (
  <Pressable
    style={styles.floatingCart}
    onPress={() => setShowCart(true)}
    accessibilityLabel="Open shopping cart"
  >
    <Text style={styles.cartIcon}>🛒</Text>

    <View style={styles.cartButtonText}>
      <Text style={styles.cartButtonTitle}>View Cart</Text>

      <Text style={styles.cartButtonSubtitle}>
        {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
      </Text>
    </View>

    <View style={styles.cartBadge}>
      <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
    </View>
  </Pressable>
)}
      
{/* SHOP NOW CUSTOM POPUP */}
<Modal
  visible={showShopPopup}
  transparent
  animationType="fade"
  onRequestClose={() => setShowShopPopup(false)}
>
  <View style={styles.shopPopupOverlay}>
    <Pressable
      style={StyleSheet.absoluteFill}
      onPress={() => setShowShopPopup(false)}
    />

    <View style={styles.shopPopupCard}>
      <Pressable
        style={styles.shopPopupClose}
        onPress={() => setShowShopPopup(false)}
      >
        <Text style={styles.shopPopupCloseText}>✕</Text>
      </Pressable>

      <View style={styles.shopPopupEmojiBox}>
        <Text style={styles.shopPopupEmoji}>🛍️</Text>
        <Text style={styles.shopPopupFruit}>🍎 🥑 🍊</Text>
      </View>

      <Text style={styles.shopPopupTag}>
        FRESHNESS IS HERE
      </Text>

      <Text style={styles.shopPopupTitle}>
        Let's Make Your{'\n'}Basket Happy! 💚
      </Text>

      <Text style={styles.shopPopupMessage}>
        Fresh fruits, daily essentials, and your
        favorite goodies — all in one place.
      </Text>

      <Pressable
        style={styles.shopPopupButton}
        onPress={() => {
          setShowShopPopup(false);
          setSelectedCategory('All');
          setSearch('');
        }}
      >
        <Text style={styles.shopPopupButtonText}>
          Explore Products  
        </Text>
      </Pressable>

      <Text style={styles.shopPopupFooter}>
        Fresh Picks, Happy Days ✨
      </Text>
    </View>
  </View>
</Modal>


      {/* CART DETAILS MODAL */}
      <Modal
        visible={showCart}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCart(false)}>

        <View style={styles.cartOverlay}>
          {/* Tap outside to close */}
          <Pressable
            style={styles.cartBackdrop}
            onPress={() => setShowCart(false)}
          />

          <View style={styles.cartPanel}>
            {/* CART HEADER */}
            <View style={styles.cartHeader}>
              <View>
                <Text style={styles.cartHeading}>My Cart 🛒</Text>

                <Text style={styles.cartSubheading}>
                  {cartItemCount}{' '}
                  {cartItemCount === 1 ? 'item' : 'items'} added
                </Text>
              </View>

              <Pressable
                style={styles.closeCartButton}
                onPress={() => setShowCart(false)}>
                <Text style={styles.closeCartText}>✕</Text>
              </Pressable>
            </View>

            {/* EMPTY CART */}
            {cart.length === 0 ? (
              <View style={styles.emptyCart}>
                <Text style={styles.emptyCartIcon}>🛒</Text>

                <Text style={styles.emptyCartTitle}>
                  Your cart is empty
                </Text>

                <Text style={styles.emptyCartMessage}>
                  Add fresh products to get started.
                </Text>

                <Pressable
                  style={styles.continueButton}
                  onPress={() => setShowCart(false)}>
                  <Text style={styles.continueButtonText}>
                    Continue Shopping
                  </Text>
                </Pressable>
              </View>
            ) : (
              <>
                {/* CART PRODUCTS */}
                <ScrollView
                  style={styles.cartItemsList}
                  showsVerticalScrollIndicator={false}>

                  {cart.map((item, index) => {
  const quantity = Number(item.quantity || 0);
  const price = Number(item.price || 0);
  const subtotal = price * quantity;
  const imageUrl = getImageUrl(item.image);

  // Get product ID
  const rawProductId =
    item.productId || item.id || item._id;

  const productId =
    rawProductId && typeof rawProductId === 'object'
      ? rawProductId._id
      : rawProductId;

  // Find current product details
  const currentProduct = products.find(
    product => String(product.id) === String(productId),
  );

  // Calculate available stock
  const availableQuantity = Number(
    currentProduct?.quantity ??
      item.availableQuantity ??
      0,
  );

  // Calculate maximum allowed quantity
  const maximumQuantity = Math.max(
    0,
    Math.min(
      availableQuantity,
      Number(
        currentProduct?.maxQuantity ??
          item.maxQuantity ??
          availableQuantity,
      ),
    ),
  );

  const isUpdating =
    updatingProductId === String(productId);

  const isMaximumReached =
    quantity >= maximumQuantity;

  return (
                      <View
                        key={String(
                          item.productId || item.id || item._id || index,
                        )}
                        style={styles.cartItem}>

                        {/* CART PRODUCT IMAGE */}
                        <View style={styles.productIconBox}>
                          {imageUrl ? (
                            <Image
                              source={{uri: imageUrl}}
                              style={styles.cartProductImage}
                              resizeMode="contain"
                            />
                          ) : (
                            <Text style={styles.productIcon}>🍎</Text>
                          )}
                        </View>

                        {/* CART PRODUCT DETAILS */}
                        <View style={styles.cartItemInfo}>
                          <Text
                            style={styles.cartItemName}
                            numberOfLines={2}>
                            {item.name || 'Product'}
                          </Text>

                          <Text style={styles.cartItemWeight}>
                            {item.weight || item.category || 'Fresh product'}
                          </Text>

                          <Text style={styles.cartItemPrice}>
                            ₹{price.toFixed(2)} each
                          </Text>

                          <Text style={styles.cartItemSubtotal}>
                            Subtotal: ₹{subtotal.toFixed(2)}
                          </Text>
                        </View>

                       {/* QUANTITY BUTTONS */}
<View style={styles.quantityControls}>
  {/* DECREASE */}
  <Pressable
    disabled={isUpdating}
    style={[
      styles.quantityButton,
      isUpdating && styles.disabledButton,
    ]}
    onPress={() => handleDecrease(item, productId)}>
    <Text style={styles.quantityButtonText}>−</Text>
  </Pressable>

  {/* CURRENT QUANTITY */}
  <Text style={styles.quantityNumber}>
    {quantity}
  </Text>

  {/* INCREASE */}
  <Pressable
    disabled={isUpdating || isMaximumReached}
    style={[
      styles.quantityButton,
      (isUpdating || isMaximumReached) &&
        styles.disabledButton,
    ]}
    onPress={() => handleIncrease(item, productId)}>
    <Text style={styles.quantityButtonText}>+</Text>
  </Pressable>
</View>
                      </View>
                    );
                  })}
                </ScrollView>

                {/* CART TOTAL AND CHECKOUT */}
                <View style={styles.cartFooter}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>

                    <Text style={styles.totalAmount}>
                      ₹{Number(cartTotal || 0).toFixed(2)}
                    </Text>
                  </View>

                  <Pressable
                    style={styles.checkoutButton}
                    onPress={openCart}>
                    <Text style={styles.checkoutButtonText}>
                      Go to Cart →
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}



const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F7FBF4',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 115,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FBF4',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#718475',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  headerText: {
    flex: 1,
    marginRight: 12,
  },

  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  smallText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#657269',
  },

  userName: {
    marginTop: 5,
    fontSize: 25,
    fontWeight: '800',
    color: '#153C28',
  },

  headerSubtitle: {
    fontSize: 13,
    color: '#718475',
    marginTop: 4,
  },

  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E1F5DF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  notificationBell: {
    fontSize: 25,
  },

  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Search
  searchBox: {
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#EAF1E8',
  },

  searchInput: {
    flex: 1,
    marginLeft: 11,
    fontSize: 14,
    color: '#203C2B',
    paddingVertical: 0,
  },

  clearSearch: {
    fontSize: 12,
    fontWeight: '600',
    color: '#168044',
  },

  // Shop Now banner
  offerCard: {
    minHeight: 205,
    backgroundColor: '#155B35',
    borderRadius: 24,
    padding: 19,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 29,
    elevation: 4,
  },

  offerContent: {
    flex: 1,
    zIndex: 1,
  },

  offerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5F5E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },

  offerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#218348',
    letterSpacing: 1,
  },

  offerTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  offerSubtitle: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#E1F5DF',
  },

  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 11,
    marginTop: 16,
  },

  shopButtonText: {
    color: '#168044',
    fontSize: 12,
    fontWeight: '800',
  },

  shopButtonArrow: {
    color: '#168044',
    fontWeight: '800',
  },

  bannerIllustration: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },

  bannerEmoji: {
    fontSize: 64,
  },

  bannerFruit: {
    fontSize: 21,
    marginTop: -3,
  },

  // Section headings
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#153C28',
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#718475',
    marginTop: 5,
  },

  seeAll: {
    fontSize: 12,
    fontWeight: '700',
    color: '#168044',
  },

  // Categories
  categoryList: {
    paddingBottom: 28,
  },

  categoryCard: {
    width: 88,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 11,
    borderWidth: 1,
    borderColor: '#EAF1E8',
  },

  selectedCategoryCard: {
    backgroundColor: '#E5F5E2',
    borderColor: '#168044',
  },

  categoryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#F9FCF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  selectedCategoryIconBox: {
    backgroundColor: '#E1F5DF',
  },

  categoryIcon: {
    fontSize: 28,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#59665C',
  },

  selectedCategoryText: {
    color: '#155B35',
    fontWeight: '800',
  },

  // Product cards
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },

  productCard: {
    width: '48.2%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 11,
    borderWidth: 1,
    borderColor: '#EAF1E8',
    elevation: 2,
  },

  productImageBox: {
    height: 135,
    backgroundColor: '#F7FBF4',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  productPlaceholder: {
    fontSize: 48,
  },

  productTag: {
    position: 'absolute',
    top: 7,
    left: 7,
    backgroundColor: '#E5F5E2',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    maxWidth: '90%',
  },

  productTagText: {
    color: '#218348',
    fontSize: 9,
    fontWeight: '700',
  },

  productName: {
    marginTop: 11,
    fontSize: 14,
    fontWeight: '800',
    color: '#203C2B',
    minHeight: 35,
  },

  productWeight: {
    marginTop: 4,
    fontSize: 11,
    color: '#859187',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  priceDetails: {
    flex: 1,
    marginRight: 4,
  },

  price: {
    fontSize: 17,
    fontWeight: '800',
    color: '#168044',
  },

  stockText: {
    fontSize: 10,
    color: '#718475',
    marginTop: 4,
  },

  outOfStockText: {
    color: '#D13C46',
  },

  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#168044',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: '#AAB5AC',
  },

  plusButtonText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '600',
    lineHeight: 29,
  },

  // Empty product list
  emptyProducts: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderRadius: 18,
  },

  emptyProductsIcon: {
    fontSize: 38,
  },

  emptyProductsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#153C28',
    marginTop: 10,
  },

  emptyProductsText: {
    fontSize: 12,
    color: '#718475',
    marginTop: 6,
    textAlign: 'center',
  },

  resetButton: {
    backgroundColor: '#168044',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },

  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  footerSpace: {
    height: 15,
  },

  // Floating cart
  floatingCart: {
    position: 'absolute',
    bottom: 120,
    right: 18,
    left: 18,
    backgroundColor: '#155B35',
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#244A2E',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 10,
  },

  cartIcon: {
    fontSize: 27,
    marginRight: 12,
  },

  cartButtonText: {
    flex: 1,
  },

  cartButtonTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  cartButtonSubtitle: {
    color: '#E1F5DF',
    fontSize: 12,
    marginTop: 3,
  },

  cartBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
  },

  cartBadgeText: {
    color: '#155B35',
    fontWeight: '800',
    fontSize: 13,
  },

  // Cart modal
  cartOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  cartBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  cartPanel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 22,
    paddingHorizontal: 18,
    paddingBottom: 24,
    maxHeight: '82%',
    minHeight: 280,
  },

  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3EE',
  },

  cartHeading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#153C28',
  },

  cartSubheading: {
    fontSize: 13,
    color: '#78857B',
    marginTop: 4,
  },

  closeCartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7FBF4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeCartText: {
    fontSize: 18,
    color: '#153C28',
  },

  cartItemsList: {
    flexGrow: 0,
    flexShrink: 1,
  },

  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3EE',
    gap: 10,
  },

  productIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E1F5DF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  cartProductImage: {
    width: '100%',
    height: '100%',
  },

  productIcon: {
    fontSize: 25,
  },

  cartItemInfo: {
    flex: 1,
  },

  cartItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#153C28',
  },

  cartItemWeight: {
    color: '#78857B',
    fontSize: 12,
    marginTop: 3,
  },

  cartItemPrice: {
    color: '#526D5A',
    fontSize: 12,
    marginTop: 4,
  },

  cartItemSubtotal: {
    color: '#168044',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  quantityButton: {
    width: 29,
    height: 29,
    borderRadius: 9,
    backgroundColor: '#E5F5E2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#168044',
  },

  quantityNumber: {
    minWidth: 16,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#153C28',
  },

  // Empty cart
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },

  emptyCartIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyCartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#153C28',
  },

  emptyCartMessage: {
    color: '#78857B',
    textAlign: 'center',
    marginTop: 7,
    fontSize: 13,
  },

  continueButton: {
    marginTop: 18,
    backgroundColor: '#168044',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Cart footer
  cartFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFF3EE',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#526D5A',
  },

  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#168044',
  },

  checkoutButton: {
    backgroundColor: '#168044',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },

  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  shopPopupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(21, 60, 40, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  shopPopupCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 23,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: 'center',
    elevation: 12,
  },

  shopPopupClose: {
    position: 'absolute',
    top: 13,
    right: 13,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7FBF4',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  shopPopupCloseText: {
    color: '#42604A',
    fontSize: 15,
    fontWeight: '700',
  },

  shopPopupEmojiBox: {
    width: 112,
    height: 105,
    borderRadius: 30,
    backgroundColor: '#E7F5D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  shopPopupEmoji: {
    fontSize: 49,
  },

  shopPopupFruit: {
    fontSize: 19,
    marginTop: -2,
  },

  shopPopupTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#168044',
    marginBottom: 10,
  },

  shopPopupTitle: {
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '800',
    color: '#153C28',
    textAlign: 'center',
  },

  shopPopupMessage: {
    fontSize: 13,
    lineHeight: 21,
    color: '#718475',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 22,
  },

  shopPopupButton: {
    width: '100%',
    backgroundColor: '#155B35',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  shopPopupButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  shopPopupFooter: {
    fontSize: 11,
    color: '#92A28F',
    marginTop: 15,
  },


  centerQuantityControls: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  paddingHorizontal: 12,
  marginTop: 12,
  marginBottom: 5,
},

productCardQuantityButton: {
  width: 29,
  height: 29,
  borderRadius: 9,
  backgroundColor: '#1D5638',
  justifyContent: 'center',
  alignItems: 'center',
},

productCardQuantityButtonText: {
  color: '#FFFFFF',
  fontSize: 19,
  fontWeight: '800',
},

productCardQuantityNumber: {
  color: '#203629',
  fontSize: 14,
  fontWeight: '800',
  minWidth: 16,
  textAlign: 'center',
},

});






