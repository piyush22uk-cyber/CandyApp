
import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

const GREEN = "#183D32";
const SUPPORT_EMAIL = "piyush22uk@gmail.com";

export default function HelpCenterScreen({ navigation }) {
  const [openQuestion, setOpenQuestion] = useState(null);

  const helpItems = [
    {
      id: 1,
      title: "How can I place an order?",
      answer:
        "Open the Home screen, select your products, add them to your cart and continue to checkout. Select your delivery address and confirm your order.",
      icon: "cart-outline",
    },
    {
      id: 2,
      title: "How can I check my order status?",
      answer:
        "Open the Orders screen to check your order details and current order status.",
      icon: "cube-outline",
    },
    {
      id: 3,
      title: "My order is not showing.",
      answer:
        "Check your internet connection and open the Orders screen again. If your order is still missing, contact our support team.",
      icon: "alert-circle-outline",
    },
    {
      id: 4,
      title: "How can I update my address?",
      answer:
        "Open your address section in the app and add or update your delivery address before placing an order.",
      icon: "location-outline",
    },
    {
      id: 5,
      title: "How can I cancel my order?",
      answer:
        "Open your Orders screen and check whether cancellation is available for your order. Contact support if you need help.",
      icon: "close-circle-outline",
    },
    {
      id: 6,
      title: "I have a payment problem.",
      answer:
        "Check your selected payment method and order details. If you face any payment-related issue, contact our support team.",
      icon: "wallet-outline",
    },
  ];

  const openEmail = async () => {
    const subject = "CandyApp Customer Support";

    const body =
      "Hello CandyApp Support Team,\n\n" +
      "My Name:\n" +
      "My Registered Email:\n" +
      "My Order ID (if applicable):\n\n" +
      "My Problem:\n\n";

    const emailUrl =
      `mailto:${SUPPORT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    try {
      await Linking.openURL(emailUrl);
    } catch (error) {
      Alert.alert(
        "Email App Not Found",
        "Please install or configure an email app to contact support."
      );
    }
  };

  const toggleQuestion = (id) => {
    if (openQuestion === id) {
      setOpenQuestion(null);
    } else {
      setOpenQuestion(id);
    }
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={23} color={GREEN} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Help Center</Text>

        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Welcome Section */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIcon}>
            <Ionicons
              name="headset-outline"
              size={35}
              color={GREEN}
            />
          </View>

          <Text style={styles.welcomeTitle}>
            How can we help you?
          </Text>

          <Text style={styles.welcomeDescription}>
            Find answers to common questions and get help
            with your CandyApp experience.
          </Text>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            About CandyApp
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="storefront-outline"
                size={25}
                color={GREEN}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Your Shopping Partner
              </Text>

              <Text style={styles.infoDescription}>
                CandyApp helps you explore products, add
                items to your cart and place orders easily.
                Enjoy a simple and convenient shopping experience.
              </Text>
            </View>
          </View>
        </View>

        {/* Common Questions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Common Problems & Solutions
          </Text>

          <Text style={styles.sectionSubtitle}>
            Select a question to see its solution.
          </Text>

          {helpItems.map((item) => (
            <View key={item.id} style={styles.questionCard}>
              <TouchableOpacity
                style={styles.questionButton}
                onPress={() => toggleQuestion(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.questionIcon}>
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color={GREEN}
                  />
                </View>

                <Text style={styles.questionTitle}>
                  {item.title}
                </Text>

                <Ionicons
                  name={
                    openQuestion === item.id
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={20}
                  color="#777777"
                />
              </TouchableOpacity>

              {openQuestion === item.id && (
                <View style={styles.answerBox}>
                  <Text style={styles.answerText}>
                    {item.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <View style={styles.supportCard}>
            <View style={styles.supportIcon}>
              <Ionicons
                name="mail-outline"
                size={30}
                color={GREEN}
              />
            </View>

            <Text style={styles.supportTitle}>
              Still Need Help?
            </Text>

            <Text style={styles.supportDescription}>
              If you cannot find a solution, send us an
              email. Our support team can help you.
            </Text>

            <View style={styles.emailBox}>
              <Ionicons
                name="mail"
                size={18}
                color={GREEN}
              />

              <Text style={styles.emailText}>
                {SUPPORT_EMAIL}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.emailButton}
              onPress={openEmail}
              activeOpacity={0.85}
            >
              <Ionicons
                name="send-outline"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.emailButtonText}>
                Contact Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Thank you for choosing CandyApp ❤️
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F6",
  },

  header: {
    height: 60,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EFF4F0",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: GREEN,
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 35,
  },

  welcomeCard: {
    backgroundColor: GREEN,
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
  },

  welcomeIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  welcomeTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },

  welcomeDescription: {
    fontSize: 13,
    color: "#DCE9E0",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 9,
  },

  section: {
    marginTop: 26,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: GREEN,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: "#888888",
    marginTop: 5,
    marginBottom: 13,
  },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginTop: 13,
    borderWidth: 1,
    borderColor: "#E8EEE8",
  },

  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#EDF4EF",
    alignItems: "center",
    justifyContent: "center",
  },

  infoContent: {
    flex: 1,
    marginLeft: 13,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: GREEN,
  },

  infoDescription: {
    fontSize: 13,
    color: "#777777",
    lineHeight: 20,
    marginTop: 6,
  },

  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: "#E8EEE8",
    overflow: "hidden",
  },

  questionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    minHeight: 66,
  },

  questionIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: "#EDF4EF",
    alignItems: "center",
    justifyContent: "center",
  },

  questionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#26352C",
    marginLeft: 12,
    marginRight: 8,
  },

  answerBox: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 65,
  },

  answerText: {
    fontSize: 13,
    color: "#777777",
    lineHeight: 21,
  },

  supportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 21,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5ECE5",
  },

  supportIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: "#EDF4EF",
    alignItems: "center",
    justifyContent: "center",
  },

  supportTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: GREEN,
    marginTop: 13,
  },

  supportDescription: {
    fontSize: 13,
    color: "#777777",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 7,
  },

  emailBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F5F0",
    padding: 12,
    borderRadius: 12,
    marginTop: 17,
    width: "100%",
    justifyContent: "center",
  },

  emailText: {
    fontSize: 13,
    fontWeight: "700",
    color: GREEN,
    marginLeft: 9,
  },

  emailButton: {
    flexDirection: "row",
    backgroundColor: GREEN,
    width: "100%",
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  emailButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 9,
  },

  footerText: {
    textAlign: "center",
    color: "#999999",
    fontSize: 12,
    marginTop: 25,
    marginBottom: 10,
  },
});
