import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './services/api';
// ==========================================
// CREATE CONTEXT
// ==========================================

const CartContext = createContext();


// ==========================================
// CART PROVIDER
// ==========================================

export const CartProvider = ({children}) => {

  const [cart, setCart] = useState([]);


  // ==========================================
  // LOAD CART FROM ASYNC STORAGE
  // ==========================================

 useEffect(() => {
  loadCart();
}, []);


  // ==========================================
  // LOAD CART
  // ==========================================

  const loadCart = async () => {

    try {

      const savedUser =
        await AsyncStorage.getItem('user');

      if (!savedUser) {

        setCart([]);

        return;
      }

      const currentUser =
        JSON.parse(savedUser);

  const response =
      await api.get(
        `/cart/${currentUser.id}`,
      );

     setCart(
      response.data.items || [],
    );

    } catch (error) {

      console.log(
        'Load cart error:',
        error,
      );

    }

  };


  // ==========================================
  // SAVE CART
  // ==========================================

  // const saveCart = async (newCart) => {

  //   try {

  //     await AsyncStorage.setItem(
  //       'cart',
  //       JSON.stringify(newCart),
  //     );

  //     setCart(newCart);

  //   } catch (error) {

  //     console.log(
  //       'Save cart error:',
  //       error,
  //     );

  //   }

  // };


  // ==========================================
  // ADD PRODUCT TO CART
  // ==========================================

  // const addToCart = async (product) => {

  //   try {

  //     // MongoDB product ID
  //     const productId =
  //       product._id || product.id;


  //     // ID check
  //     if (!productId) {

  //       console.log(
  //         'Product ID missing',
  //       );

  //       return;

  //     }


  //     // Check product already exists
  //     const existingItem =
  //       cart.find(
  //         (item) => item.id === productId,
  //        );


  //     // ========================================
  //     // PRODUCT ALREADY IN CART
  //     // ========================================

  //     if (existingItem) {

  //       const newQuantity =
  //         Number(existingItem.quantity) + 1;


  //       // Stock limit
  //       if (
  //         existingItem.availableQuantity &&
  //         newQuantity >
  //           Number(existingItem.availableQuantity)
  //       ) {

  //         console.log(
  //           'Stock limit reached',
  //         );

  //         return;

  //       }


      //   const newCart =
      //     cart.map((item) =>

      //       item.id === productId

      //         ? {
      //             ...item,

      //             quantity: newQuantity,

      //             totalPrice:
      //               Number(item.price) *
      //               newQuantity,
      //           }

      //         : item

      //     );


      //   await saveCart(newCart);

      //   return;

      // }


      // ========================================
      // NEW PRODUCT
      // ========================================

  //     const newItem = {

  //       id: productId,

  //       name: product.name,

  //       category:
  //         product.category || 'Fruits',

  //       price:
  //         Number(product.price),

  //       weight:
  //         product.weight || '1 kg',

  //       image:
  //         product.image || '',

  //       quantity: 1,

  //       availableQuantity:
  //         Number(product.quantity || 0),

  //       totalPrice:
  //         Number(product.price),

  //     };


  //     const newCart = [
  //       ...cart,
  //       newItem,
  //     ];


  //     await saveCart(newCart);

  //   } catch (error) {

  //     console.log(
  //       'Add to cart error:',
  //       error,
  //     );

  //   }

  // };

  const addToCart = async (product) => {
  try {
    // ==============================
    // GET CURRENT USER
    // ==============================

    const savedUser =
      await AsyncStorage.getItem('user');

    if (!savedUser) {
      console.log('User not logged in');
      return;
    }

    const currentUser =
      JSON.parse(savedUser);


    // ==============================
    // PRODUCT ID
    // ==============================

    const productId =
      product._id || product.id;

    if (!productId) {
      console.log('Product ID missing');
      return;
    }


    // ==============================
    // SEND CART DATA TO API
    // ==============================

    const response =
      await api.post('/cart', {

        userId: currentUser.id,

        productId: productId,

        name: product.name,

        category:
          product.category || 'Fruits',

        price:
          Number(product.price),

        weight:
          product.weight || '1 kg',

        image:
          product.image || '',

        quantity: 1,

        availableQuantity:
          Number(product.quantity || 0),

      });


    // ==============================
    // UPDATE FRONTEND CART
    // ==============================

    setCart(
      response.data.cart.items || [],
    );


    console.log(
      'Product added:',
      response.data,
    );

  } catch (error) {

    console.log(
      'Add to cart error:',
      error.response?.data || error.message,
    );

  }
};

  const increaseQuantity = async (item) => {
  try {
    const savedUser =
      await AsyncStorage.getItem('user');

    if (!savedUser) {
      console.log('User not logged in');
      return;
    }

    const currentUser =
      JSON.parse(savedUser);

    const productId =
      item.productId;

    if (!productId) {
      console.log('Product ID missing');
      return;
    }

    const newQuantity =
      Number(item.quantity) + 1;

    const response =
      await api.put(
        `/cart/${currentUser.id}/${productId}`,
        {
          quantity: newQuantity,
        }
      );

    setCart(
      response.data.cart.items || []
    );

  } catch (error) {

    console.log(
      'Increase quantity error:',
      error.response?.data || error.message
    );

  }
};


const decreaseQuantity = async (item) => {
  try {
    const savedUser =
      await AsyncStorage.getItem('user');

    if (!savedUser) {
      console.log('User not logged in');
      return;
    }

    const currentUser =
      JSON.parse(savedUser);

    const productId =
      item.productId;

    if (!productId) {
      console.log('Product ID missing');
      return;
    }

    // ========================================
    // QUANTITY 1 → DELETE PRODUCT
    // ========================================

    if (Number(item.quantity) === 1) {

      const response =
        await api.delete(
          `/cart/${currentUser.id}/${productId}`
        );

      console.log(
        'Product deleted:',
        response.data
      );

      setCart(
        response.data.cart.items || []
      );

      return;
    }

    // ========================================
    // QUANTITY > 1 → DECREASE BY 1
    // ========================================

    const newQuantity =
      Number(item.quantity) - 1;

    const response =
      await api.put(
        `/cart/${currentUser.id}/${productId}`,
        {
          quantity: newQuantity,
        }
      );

    setCart(
      response.data.cart.items || []
    );

  } catch (error) {

    console.log(
      'Decrease quantity error:',
      error.response?.data ||
      error.message
    );

  }
};



const clearCart = async () => {
  try {
    const savedUser = await AsyncStorage.getItem("user");

    if (!savedUser) {
      console.log("CLEAR CART: User not found");
      return false;
    }

    const currentUser = JSON.parse(savedUser);

    const response = await api.delete(
      `/cart/${currentUser.id}`
    );

    console.log("CLEAR CART RESPONSE:", response.data);

    // Backend request successful hone ke baad UI clear karo
    setCart([]);

    return true;

  } catch (error) {
    console.log(
      "CLEAR CART ERROR:",
      error.response?.data || error.message
    );

    return false;
  }
};


  // ==========================================
  // CART TOTAL
  // ==========================================

  const cartTotal =
    cart.reduce(

      (total, item) => {

        return (
          total +
          Number(
            item.totalPrice || 0,
          )
        );

      },

      0,

    );


  // ==========================================
  // PROVIDER
  // ==========================================

  return (

    <CartContext.Provider
      value={{

        cart,

        addToCart,

        increaseQuantity,

        decreaseQuantity,

        cartTotal,

        clearCart,

      }}
    >

      {children}

    </CartContext.Provider>

  );

};


// ==========================================
// useCart
// ==========================================

export const useCart = () => {

  return useContext(CartContext);

};