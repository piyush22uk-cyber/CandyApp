
// // import React, {useState, useEffect} from 'react';
// // import {CartProvider} from './CartContext';

// // import {
// //   ActivityIndicator,
// //   View,
// //   StyleSheet,
// // } from 'react-native';

// // import AsyncStorage from "@react-native-async-storage/async-storage";

// // import LoginScreen from './LoginScreen';
// // import RegisterScreen from './RegisterScreen';
// // import TabNavigator from './TabNavigator';
// // import SplashScreen from './SplashScreen';

// // import {NavigationContainer} from '@react-navigation/native';

// // export default function App() {

// //   const [splashDone, setSplashDone] = useState(false);

// //   // true = logged in
// //   // false = logged out
// //   const [user, setUser] = useState(null);

// //   const [loading, setLoading] = useState(true);

// //   const [isRegistering, setIsRegistering] = useState(false);


// //   // Check JWT token when app starts
// //   useEffect(() => {
// //     checkLogin();
// //   }, []);


// //   const checkLogin = async () => {
// //     try {

// //       const token = await AsyncStorage.getItem("token");

// //       console.log("TOKEN:", token);

// //       if (token) {

// //         // Token exists = user is logged in
// //         setUser(true);

// //       } else {

// //         // No token = user is logged out
// //         setUser(false);

// //       }

// //     } catch (error) {

// //       console.log("TOKEN CHECK ERROR:", error);

// //       setUser(false);

// //     } finally {

// //       setLoading(false);

// //     }
// //   };


// //   // Splash screen
// //   if (!splashDone) {

// //     return (
// //       <SplashScreen
// //         onFinish={() => setSplashDone(true)}
// //       />
// //     );

// //   }


// //   // Checking token
// //   if (loading) {

// //     return (
// //       <View style={styles.centered}>

// //         <ActivityIndicator
// //           size="large"
// //           color="#22A447"
// //         />

// //       </View>
// //     );

// //   }


// //   // User logged in
// //   if (user) {

// //     return (
// //       <CartProvider>

// //         <NavigationContainer>

// //           <TabNavigator />

// //         </NavigationContainer>

// //       </CartProvider>
// //     );

// //   }


// //   // User logged out
// //   return isRegistering ? (

// //     <RegisterScreen
// //       onSwitchToLogin={() => setIsRegistering(false)}
// //     />

// //   ) : (

// //     <LoginScreen
// //       onSwitchToRegister={() => setIsRegistering(true)}
// //       onLoginSuccess={() => setUser(true)}
// //     />

// //   );

// // }


// // const styles = StyleSheet.create({

// //   centered: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },

// // });




// // import React, {useState, useEffect} from 'react';

// // import {
// //   ActivityIndicator,
// //   View,
// //   StyleSheet,
// // } from 'react-native';

// // import {onAuthStateChanged} from 'firebase/auth';

// // import {auth} from './firebaseConfig';

// // import {CartProvider} from './CartContext';

// // import LoginScreen from './LoginScreen';
// // import RegisterScreen from './RegisterScreen';
// // import TabNavigator from './TabNavigator';
// // import SplashScreen from './SplashScreen';

// // import {NavigationContainer} from '@react-navigation/native';

// // export default function App() {
// //   const [splashDone, setSplashDone] = useState(false);
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [isRegistering, setIsRegistering] = useState(false);

// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(
// //       auth,
// //       (firebaseUser) => {
// //         console.log('FIREBASE USER:', firebaseUser);

// //         setUser(firebaseUser);
// //         setLoading(false);
// //       },
// //     );

// //     return unsubscribe;
// //   }, []);

// //   if (!splashDone) {
// //     return (
// //       <SplashScreen
// //         onFinish={() => setSplashDone(true)}
// //       />
// //     );
// //   }

// //   if (loading) {
// //     return (
// //       <View style={styles.centered}>
// //         <ActivityIndicator
// //           size="large"
// //           color="#22A447"
// //         />
// //       </View>
// //     );
// //   }

// //   if (user) {
// //     return (
// //       <CartProvider>
// //         <NavigationContainer>
// //           <TabNavigator />
// //         </NavigationContainer>
// //       </CartProvider>
// //     );
// //   }

// //   if (isRegistering) {
// //   return (
// //     <RegisterScreen
// //       onSwitchToLogin={() => setIsRegistering(false)}
// //       onRegisterSuccess={() => setUser(true)}
// //     />
// //   );
// // }

// // return (
// //   <LoginScreen
// //     onSwitchToRegister={() => setIsRegistering(true)}
// //     onLoginSuccess={() => setUser(true)}
// //   />
// // );
// // }

// // const styles = StyleSheet.create({
// //   centered: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// // });




// import React, {useState, useEffect} from 'react';
// import { savePushTokenToBackend } from './notificationService';
// import {
//   ActivityIndicator,
//   View,
//   StyleSheet,
// } from 'react-native';

// import AsyncStorage from '@react-native-async-storage/async-storage';

// import {CartProvider} from './CartContext';

// import LoginScreen from './LoginScreen';
// import RegisterScreen from './RegisterScreen';
// import TabNavigator from './TabNavigator';
// import SplashScreen from './SplashScreen';

// import {NavigationContainer} from '@react-navigation/native';

// export default function App() {
//   const [splashDone, setSplashDone] = useState(false);

//   // API login user
//   const [user, setUser] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [isRegistering, setIsRegistering] = useState(false);

// useEffect(() => {
//   if (loading) return;

//   if (user) {
//     savePushTokenToBackend();
//   }
// }, [loading, user]);
//   // Check API login when app starts
//   useEffect(() => {
//     const checkLogin = async () => {
//       try {
//         // Get saved JWT token
//         const token = await AsyncStorage.getItem('token');

//         // Get saved user
//         const savedUser = await AsyncStorage.getItem('user');

//         if (token && savedUser) {
//           // Convert string back to object
//           const userData = JSON.parse(savedUser);

//           console.log('API USER:', userData);

//           setUser(userData);
//         } else {
//           console.log('NO API USER FOUND');

//           setUser(null);
//         }
//       } catch (error) {
//         console.log('CHECK LOGIN ERROR:', error);

//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkLogin();
//   }, []);


//   // Splash screen
//   if (!splashDone) {
//     return (
//       <SplashScreen
//         onFinish={() => setSplashDone(true)}
//       />
//     );
//   }


//   // Checking AsyncStorage
//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator
//           size="large"
//           color="#22A447"
//         />
//       </View>
//     );
//   }


//   // API user is logged in
//   if (user) {
//     return (
//       <CartProvider>
//         <NavigationContainer>
//           <TabNavigator />
//         </NavigationContainer>
//       </CartProvider>
//     );
//   }


//   // Register screen
//   if (isRegistering) {
//     return (
//       <RegisterScreen
//         onSwitchToLogin={() => setIsRegistering(false)}

//         onRegisterSuccess={(registeredUser) => {
//           setUser(registeredUser);
//           setIsRegistering(false);
//         }}
//       />
//     );
//   }


//   // Login screen
//   return (
//     <LoginScreen
//       onSwitchToRegister={() => setIsRegistering(true)}

//       onLoginSuccess={(loggedInUser) => {
//         setUser(loggedInUser);
//       }}
//     />
//   );
// }


// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });




import React, {useState, useEffect} from 'react';

import {
  ActivityIndicator,
  View,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import api from './services/api';

import {savePushTokenToBackend} from './notificationService';

import {CartProvider} from './CartContext';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import TabNavigator from './TabNavigator';
import SplashScreen from './SplashScreen';

import {NavigationContainer} from '@react-navigation/native';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  // Logged-in user information
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isRegistering, setIsRegistering] = useState(false);


  // Listen for expired login session
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'AUTH_SESSION_EXPIRED',
      () => {
        console.log('SESSION EXPIRED - LOGGING OUT');

        setUser(null);
        setIsRegistering(false);
      },
    );

    return () => subscription.remove();
  }, []);


  // Register push notification token
  useEffect(() => {
    if (loading) return;

    if (user) {
      savePushTokenToBackend();
    }
  }, [loading, user]);


  // Check and refresh login session when app starts
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        const savedUser = await AsyncStorage.getItem('user');

        if (!refreshToken || !savedUser) {
          await AsyncStorage.multiRemove([
            'token',
            'refreshToken',
            'user',
          ]);

          setUser(null);
          return;
        }

        // Convert saved user string into object
        const userData = JSON.parse(savedUser);

        // Ask backend for a new access token and refresh token
        const response = await api.post('/auth/refresh-token', {
          refreshToken,
        });

        const newToken = response.data.token;
        const newRefreshToken = response.data.refreshToken;

        if (!newToken || !newRefreshToken) {
          throw new Error('New tokens were not received');
        }

        // Save updated tokens
        await AsyncStorage.multiSet([
          ['token', newToken],
          ['refreshToken', newRefreshToken],
        ]);

        console.log('LOGIN SESSION RESTORED');

        setUser(userData);

      } catch (error) {
        console.log(
          'SESSION CHECK ERROR:',
          error.response?.data || error.message,
        );

        await AsyncStorage.multiRemove([
          'token',
          'refreshToken',
          'user',
        ]);

        setUser(null);

      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);


  // Splash screen
  if (!splashDone) {
    return (
      <SplashScreen
        onFinish={() => setSplashDone(true)}
      />
    );
  }


  // Checking login session
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          size="large"
          color="#22A447"
        />
      </View>
    );
  }


  // User is logged in
  if (user) {
    return (
      <CartProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </CartProvider>
    );
  }


  // Register screen
  if (isRegistering) {
    return (
      <RegisterScreen
        onSwitchToLogin={() => setIsRegistering(false)}

        onRegisterSuccess={(registeredUser) => {
          setUser(registeredUser);
          setIsRegistering(false);
        }}
      />
    );
  }


  // Login screen
  return (
    <LoginScreen
      onSwitchToRegister={() => setIsRegistering(true)}

      onLoginSuccess={(loggedInUser) => {
        setUser(loggedInUser);
      }}
    />
  );
}


const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
