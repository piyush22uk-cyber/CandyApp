<div align="center">

# 🍬 CandyApp

### A modern candy & sweets shopping app for mobile

[![React Native](https://img.shields.io/badge/React_Native-0.88-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_58-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_&_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Platform](https://img.shields.io/badge/Platform-Android_|_iOS-3DDC84?style=for-the-badge&logo=android&logoColor=white)](#)

[✨ Features](#-features) • [🛠 Tech Stack](#-tech-stack) • [📁 Structure](#-project-structure) • [🚀 Getting Started](#-getting-started) • [🔗 Ecosystem](#-candyapp-ecosystem)

</div>

---

## 📖 About

**CandyApp** is the customer-facing mobile app of the CandyApp platform. Users can browse products, manage a cart, place orders and track them, all with secure login and real-time push notifications. It connects to the [CandyApp Customer Backend](https://github.com/piyush22uk-cyber/candyapp-customer-backend) REST API.

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🔐 | **Authentication** | Email/password sign-up and login, plus Google Sign-In |
| 🛍️ | **Product Browsing** | Browse the catalogue with a clean, fast UI |
| 🔎 | **Search** | Quickly find products by name |
| 🛒 | **Smart Cart** | Add, remove and update quantities |
| 💳 | **Checkout** | Choose delivery address and payment method |
| 📦 | **Orders** | Order history with live status tracking |
| 📍 | **Addresses** | Save and manage multiple delivery addresses |
| 🔔 | **Push Notifications** | Instant updates on order status |
| ⚙️ | **Settings & Profile** | User details, About and Help Center screens |
| 🔄 | **Secure Sessions** | Automatic token refresh and session-expiry handling |

## 🛠 Tech Stack

| Category | Technologies |
|---|---|
| **Framework** | React Native 0.88, Expo SDK 58 |
| **Navigation** | React Navigation (Native Stack, Bottom Tabs) |
| **Networking** | Axios with interceptors |
| **Storage** | AsyncStorage |
| **Auth & Data** | Firebase Auth, Firestore, Google Sign-In |
| **Notifications** | Expo Notifications |
| **Build** | EAS Build |

## 📁 Project Structure

```
CandyApp/
├── App.js                  # App entry & navigation root
├── TabNavigator.js         # Bottom tabs and stack navigation
├── CartContext.js          # Global cart state
├── HomeScreen.js           # Product listing
├── SearchScreen.js         # Product search
├── CartScreen.js           # Cart
├── PaymentScreen.js        # Checkout
├── OrdersScreen.js         # Order history
├── AddressScreen.js        # Address management
├── services/api.js         # Axios client with token refresh
├── notificationService.js  # Push notification setup
├── firebaseConfig.js       # Firebase client config
├── googleAuth.js           # Google Sign-In helper
└── firestore.rules         # Firestore security rules
```

## 🚀 Getting Started

### 📋 Prerequisites

- ✅ Node.js 18 or higher
- ✅ Android Studio / Xcode, or a development build on a physical device
- ✅ The [backend](https://github.com/piyush22uk-cyber/candyapp-customer-backend) up and running

### 📥 Installation

```bash
git clone https://github.com/piyush22uk-cyber/CandyApp.git
cd CandyApp
npm install
```

### 🔧 Configure the API URL

Open `services/api.js` and set your backend address:

```js
const BASE_URL = "http://<your-computer-ip>:2005/api";
```

> 💡 Use your computer's local network IP (not `localhost`) when testing on a real device.

### ▶️ Run the app

This app uses native modules (Google Sign-In, notifications), so use a
