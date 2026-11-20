import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these values with your Firebase console config
const firebaseConfig = {
  apiKey: "AIzaSyA5-r0iw-yqFZDOx2xQPhXQT-MYIttYb5U",
  authDomain: "candyapp-f159f.firebaseapp.com",
  projectId: "candyapp-f159f",
  storageBucket: "candyapp-f159f.firebasestorage.app",
  messagingSenderId: "911627705868",
  appId: "1:911627705868:web:a1da3ac0497ea5ae6e9829"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };
