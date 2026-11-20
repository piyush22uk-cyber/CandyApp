
import React, { useEffect, useRef } from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';

export default function SplashScreen({ onFinish }) {

  // Logo animation
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Floating emoji animations
  const emojis = ['🍎', '🥑', '🥦', '🥕', '🍔', '🍓'];

  const emojiValues = useRef(
    emojis.map(() => new Animated.Value(0))
  ).current;

  const floatValues = useRef(
    emojis.map(() => new Animated.Value(0))
  ).current;

  // Loading animation
  const progress = useRef(new Animated.Value(0)).current;

  // Brand text animation
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {

    // Floating emoji entrance
    const emojiEntrance = Animated.stagger(
      100,
      emojiValues.map(value =>
        Animated.spring(value, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        })
      )
    );

    // Continuous floating movement
    const floatingAnimations = floatValues.map(value =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 1300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.timing(value, {
            toValue: 0,
            duration: 1300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )
    );

    // Main entrance animation
    const entrance = Animated.parallel([

      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 75,
        useNativeDriver: true,
      }),

      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.timing(textTranslate, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

    ]);

    // Loading bar
    const loading = Animated.timing(progress, {
      toValue: 1,
      duration: 2400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });

    const animations = Animated.parallel([
      emojiEntrance,
      entrance,
    ]);

    const floatingLoops = floatingAnimations;

    floatingLoops.forEach(animation => animation.start());

    Animated.sequence([
      animations,
      loading,
      Animated.delay(300),
    ]).start(({ finished }) => {
      if (finished && onFinish) {
        onFinish();
      }
    });

    return () => {
      animations.stop();
      loading.stop();

      floatingLoops.forEach(animation => animation.stop());
    };

  }, []);

  const emojiPositions = [
    { top: '17%', left: '13%' },
    { top: '19%', right: '13%' },
    { top: '39%', left: '7%' },
    { top: '42%', right: '7%' },
    { bottom: '24%', left: '16%' },
    { bottom: '22%', right: '16%' },
  ];

  return (

    <View style={styles.container}>

      <StatusBar
        backgroundColor="#183C29"
        barStyle="light-content"
      />

      {/* Decorative background circles */}

      <View style={styles.circleOne} />
      <View style={styles.circleTwo} />
      <View style={styles.circleThree} />

      {/* Floating emojis */}

      {emojis.map((emoji, index) => (

        <Animated.Text
          key={index}
          style={[
            styles.emoji,
            emojiPositions[index],
            {
              opacity: emojiValues[index],

              transform: [
                {
                  scale: emojiValues[index],
                },
                {
                  translateY: floatValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -13],
                  }),
                },
              ],
            },
          ]}
        >
          {emoji}
        </Animated.Text>

      ))}

      {/* Main logo */}

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >

        <View style={styles.logoCircle}>

          <Image
            source={require('./assets/branding/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

        </View>

      </Animated.View>

      {/* Brand name */}

      <Animated.View
        style={[
          styles.brandContainer,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslate }],
          },
        ]}
      >

        <Text style={styles.brandName}>
          Candy<Text style={styles.brandHighlight}>App</Text>
        </Text>

        <View style={styles.brandLine} />

        <Text style={styles.brandTagline}>
          YOUR EVERYDAY SHOPPING
        </Text>

      </Animated.View>

      {/* Bottom loading section */}

      <View style={styles.loadingContainer}>

        <View style={styles.loadingTrack}>

          <Animated.View
            style={[
              styles.loadingProgress,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />

        </View>

        <Text style={styles.loadingText}>
          Getting things ready...
        </Text>

      </View>

      {/* Bottom decorative dots */}

      <View style={styles.bottomDots}>
        <View style={styles.dot} />
        <View style={styles.dotActive} />
        <View style={styles.dot} />
      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#183C29',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // Background circles

  circleOne: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#245638',
    opacity: 0.35,
    top: -130,
    right: -100,
  },

  circleTwo: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#245638',
    opacity: 0.3,
    bottom: -100,
    left: -100,
  },

  circleThree: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: '#D9AD48',
    opacity: 0.12,
    top: '36%',
    right: -110,
  },

  // Emojis

  emoji: {
    position: 'absolute',
    fontSize: 34,
  },

  // Logo

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoCircle: {
    width: 155,
    height: 155,
    borderRadius: 42,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#D9AD48',

    elevation: 12,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },

  logo: {
    width: 125,
    height: 125,
  },

  // Brand

  brandContainer: {
    alignItems: 'center',
    marginTop: 27,
  },

  brandName: {
    fontSize: 43,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  brandHighlight: {
    color: '#E6BD58',
  },

  brandLine: {
    width: 48,
    height: 3,
    backgroundColor: '#E6BD58',
    borderRadius: 5,
    marginTop: 10,
  },

  brandTagline: {
    fontSize: 11,
    color: '#D7E5DA',
    letterSpacing: 3,
    fontWeight: '600',
    marginTop: 13,
  },

  // Loading

  loadingContainer: {
    position: 'absolute',
    bottom: 105,
    width: '65%',
    alignItems: 'center',
  },

  loadingTrack: {
    width: '100%',
    height: 5,
    backgroundColor: '#45634F',
    borderRadius: 10,
    overflow: 'hidden',
  },

  loadingProgress: {
    height: 5,
    backgroundColor: '#E6BD58',
    borderRadius: 10,
  },

  loadingText: {
    color: '#D7E5DA',
    fontSize: 12,
    marginTop: 13,
    letterSpacing: 0.7,
  },

  // Bottom dots

  bottomDots: {
    position: 'absolute',
    bottom: 45,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#78917D',
  },

  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#E6BD58',
  },

});
