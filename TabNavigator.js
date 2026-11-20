import React, {useEffect, useRef} from 'react';

import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import { BlurView } from 'expo-blur';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';


import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import CartScreen from './CartScreen';
import OrdersScreen from './OrdersScreen';
import SettingsScreen from './Settings';
import AddressScreen from './AddressScreen';
import PaymentScreen from './PaymentScreen';
import NotificationScreen from "./NotificationScreen";
import AboutCandyScreen from './AboutCandyScreen';
import UserDetailsScreen from './UserDetailsScreen';
import HelpCenterScreen from './HelpCenterScreen';
import {
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';



import {
  Home6,
  Magnifier,
  CartCheck,
  Box5,
  Settings,
} from 'reicon-react-native';


const Tab = createBottomTabNavigator();

const MainStack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >

      <MainStack.Screen
        name="Tabs"
        component={TabNavigator}
      />

      <MainStack.Screen
        name="Payment"
        component={PaymentScreen}
      />

      <MainStack.Screen
  name="Notifications"
  component={NotificationScreen}
/>

    </MainStack.Navigator>
  );
}
const ProfileStack =
  createNativeStackNavigator();


// ==================================================
// PROFILE STACK
// ==================================================


function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>

      <ProfileStack.Screen
        name="SettingsHome"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />

      <ProfileStack.Screen
        name="UserDetails"
        component={UserDetailsScreen}
        options={{
          title: 'My Personal Details',
          headerShown: true,
          headerTintColor: '#168044',
          headerStyle: {
            backgroundColor: '#F7FBF4',
          },
        }}
      />

      <ProfileStack.Screen
        name="Address"
        component={AddressScreen}
        options={{
          title: 'My Addresses',
          headerShown: true,
        }}
      />

      <ProfileStack.Screen
        name="AboutCandy"
        component={AboutCandyScreen}
        options={{
          headerShown: false,
        }}
      />

      <ProfileStack.Screen
  name="HelpCenter"
  component={HelpCenterScreen}
  options={{
    headerShown: false,
  }}
/>

    </ProfileStack.Navigator>
  );
}

// ==================================================
// ANIMATED TAB ICON
// ==================================================

// ==================================================
// GLASS LIQUID TAB BAR
// ==================================================


      function GlassLiquidTabBar({ state, descriptors, navigation }) {

  const { width } = useWindowDimensions();

  const settingsRoute = state.routes.find(
  route => route.name === 'Settings'
);

const currentProfileScreen = settingsRoute
  ? getFocusedRouteNameFromRoute(settingsRoute) || 'SettingsHome'
  : undefined;

  const hideTabBarScreens = [
    'UserDetails',
    'Address',
    'AboutCandy',
    'HelpCenter',
  ];

  const barWidth = width - 40;
  const tabWidth = barWidth / state.routes.length;

  const indicatorX = useRef(
    new Animated.Value(0)
  ).current;

  const liquidScale = useRef(
    new Animated.Value(1)
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(indicatorX, {
        toValue: state.index * tabWidth,
        friction: 7,
        tension: 100,
        useNativeDriver: true,
      }),

      Animated.sequence([
        Animated.timing(liquidScale, {
          toValue: 0.88,
          duration: 100,
          useNativeDriver: true,
        }),

        Animated.spring(liquidScale, {
          toValue: 1,
          friction: 4,
          tension: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

  }, [state.index, tabWidth]);

  // Conditional return must come after all hooks
  if (hideTabBarScreens.includes(currentProfileScreen)) {
    return null;
  }

  // Keep your existing return JSX here.


  return (
    <View
      style={[
        styles.glassBar,
        { width: barWidth },
      ]}
    >

      <BlurView
        intensity={55}
        tint="light"
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.glassOverlay} />

      <Animated.View
        style={[
          styles.liquidIndicator,
          {
            width: tabWidth - 12,
            transform: [
              { translateX: indicatorX },
              { scaleX: liquidScale },
            ],
          },
        ]}
      />

      <View style={styles.tabsRow}>

        {state.routes.map((route, index) => {

          const { options } = descriptors[route.key];

          const focused = state.index === index;

          const color = focused
            ? '#168044'
            : '#829084';

          const label =
            options.tabBarLabel ??
            options.title ??
            route.name;

          const onPress = () => {

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="button"
              accessibilityState={{
                selected: focused,
              }}
              style={styles.tabItem}
            >

              <Animated.View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [
                    { translateY: focused ? -3 : 0 },
                  ],
                }}
              >

                {options.tabBarIcon?.({
                  focused,
                  color,
                  size: 23,
                })}

                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color,
                      fontWeight: focused ? '800' : '600',
                    },
                  ]}
                >
                  {label}
                </Text>

              </Animated.View>
            </Pressable>
          );
        })}

      </View>
    </View>
  );
}



// ==================================================
// TAB NAVIGATOR
// ==================================================

 function TabNavigator() {

  return (

    <Tab.Navigator
  tabBar={(props) => (
    <GlassLiquidTabBar {...props} />
  )}
  screenOptions={{
    headerShown: false,
  }}
>


      {/* =================================
          HOME
      ================================= */}

      <Tab.Screen

        name="Home"

        component={HomeScreen}

        options={{

          tabBarIcon: ({ color }) => (
  <Home6 weight="Filled" color={color} size={23} />
),

        }}

      />


      {/* =================================
          SEARCH
      ================================= */}

      <Tab.Screen

        name="Search"

        component={SearchScreen}

        options={{

          tabBarIcon: ({ color }) => (
  <Magnifier weight="Filled" color={color} size={23} />
),

        }}

      />


      {/* =================================
          CART
      ================================= */}

      <Tab.Screen

        name="Cart"

        component={CartScreen}

        options={{

          tabBarIcon: ({ color }) => (
  <CartCheck color={color} size={23} />
),

        }}

      />


      {/* =================================
          ORDERS
      ================================= */}

      <Tab.Screen

        name="Orders"

        component={OrdersScreen}

        options={{

          tabBarIcon: ({ color }) => (
  <Box5 weight="Filled" color={color} size={23} />
),

        }}

      />


      {/* =================================
          PROFILE
      ================================= */}

      
<Tab.Screen
  name="Settings"
  component={ProfileStackNavigator}
  options={{
    tabBarIcon: ({ color }) => (
  <Settings color={color} size={23} />
),
  }}
/>


    </Tab.Navigator>

  );
}


// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

  glassBar: {
  position: 'absolute',
  bottom: 50,
  left: 20,

  height: 72,

  borderRadius: 36,
  overflow: 'hidden',

  backgroundColor: 'rgba(255,255,255,0.65)',

  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.85)',

  elevation: 15,

  shadowColor: '#163D2B',
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.16,
  shadowRadius: 15,
},

glassOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(255,255,255,0.35)',
},

liquidIndicator: {
  position: 'absolute',
  top: 7,
  left: 6,

  height: 56,

  borderRadius: 30,

  backgroundColor: 'rgba(225,245,223,0.85)',

  borderWidth: 1,
  borderColor: 'rgba(22,128,68,0.12)',
},

tabsRow: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
},

tabItem: {
  flex: 1,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
},

tabLabel: {
  fontSize: 9,
  marginTop: 3,
},

});

