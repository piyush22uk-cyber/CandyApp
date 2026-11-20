
// import React, { useEffect, useState } from "react";

// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";

// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_URL = "http://192.168.100.18:2005/api/notifications";

// export default function NotificationScreen() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   // Backend se notifications load karo
//   const getNotifications = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       if (!token) {
//         console.log("Authentication token not found");
//         setNotifications([]);
//         return;
//       }

//       const response = await axios.get(API_URL, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const notificationList = response.data.notifications || [];

//       setNotifications(notificationList);

//       // Latest notification ka time save karo
//       if (notificationList.length > 0) {
//         const latestNotification = notificationList.reduce(
//           (latest, item) =>
//             new Date(item.createdAt) > new Date(latest.createdAt)
//               ? item
//               : latest
//         );

//         if (latestNotification.createdAt) {
//           await AsyncStorage.setItem(
//             "lastSeenNotificationAt",
//             new Date(latestNotification.createdAt).toISOString()
//           );
//         }
//       }
//     } catch (error) {
//       console.log(
//         "Load error:",
//         error.response?.data?.message || error.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getNotifications();
//   }, []);

//   // Notification delete karo
//   const deleteNotification = async (id) => {
//     try {
//       setDeletingId(id);

//       const token = await AsyncStorage.getItem("token");

//       if (!token) {
//         console.log("Authentication token not found");
//         return;
//       }

//       await axios.delete(`${API_URL}/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setNotifications((oldList) =>
//         oldList.filter((item) => item._id !== id)
//       );
//     } catch (error) {
//       console.log(
//         "Delete error:",
//         error.response?.data?.message || error.message
//       );
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Notification card
//   const renderNotification = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <Text style={styles.title}>{item.title}</Text>

//         <TouchableOpacity
//           style={styles.closeButton}
//           onPress={() => deleteNotification(item._id)}
//           disabled={deletingId === item._id}
//           accessibilityRole="button"
//           accessibilityLabel="Delete notification"
//           activeOpacity={0.7}
//         >
//           <Text style={styles.closeText}>
//             {deletingId === item._id ? "..." : "×"}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.message}>{item.message}</Text>

//       {item.createdAt ? (
//         <Text style={styles.date}>
//           {new Date(item.createdAt).toLocaleString()}
//         </Text>
//       ) : null}
//     </View>
//   );

//   // Loading screen
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#16834A" />

//         <Text style={styles.loadingText}>
//           Loading notifications...
//         </Text>
//       </View>
//     );
//   }

//   // Main screen
//   return (
//     <View style={styles.container}>
//       {/* Screen header */}
//       <View style={styles.header}>
//         <View style={styles.headerText}>
//           <Text style={styles.heading}>Notifications</Text>

//           <Text style={styles.subtitle}>
//             Your latest CandyApp updates
//           </Text>
//         </View>

//         <View style={styles.bellBox}>
//           <Text style={styles.bellIcon}>{"\uD83D\uDD14"}</Text>
//         </View>
//       </View>

//       {/* Notification list */}
//       <FlatList
//         data={notifications}
//         keyExtractor={(item) => item._id}
//         renderItem={renderNotification}
//         contentContainerStyle={[
//           styles.list,
//           notifications.length === 0 && styles.emptyList,
//         ]}
//         showsVerticalScrollIndicator={false}
//         ItemSeparatorComponent={() => (
//           <View style={styles.separator} />
//         )}
//         ListEmptyComponent={
//           <View style={styles.emptyBox}>
//             <Text style={styles.emptyIcon}>{"\uD83D\uDD14"}</Text>

//             <Text style={styles.emptyTitle}>
//               No Notifications
//             </Text>

//             <Text style={styles.emptyMessage}>
//               Your latest updates will appear here.
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F7F5",
//     paddingTop: 48,
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingBottom: 22,
//   },

//   headerText: {
//     flex: 1,
//     marginRight: 12,
//   },

//   heading: {
//     fontSize: 25,
//     fontWeight: "800",
//     color: "#17251C",
//     letterSpacing: 0.2,
//   },

//   subtitle: {
//     fontSize: 13,
//     color: "#78847B",
//     marginTop: 6,
//   },

//   bellBox: {
//     width: 48,
//     height: 48,
//     borderRadius: 15,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#E5EBE5",
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 2,
//   },

//   bellIcon: {
//     fontSize: 22,
//   },

//   list: {
//     paddingHorizontal: 18,
//     paddingTop: 4,
//     paddingBottom: 30,
//   },

//   emptyList: {
//     flexGrow: 1,
//   },

//   separator: {
//     height: 14,
//   },

//   card: {
//     width: "100%",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#E3EAE4",
//     elevation: 2,
//     shadowColor: "#203A27",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.06,
//     shadowRadius: 5,
//   },

//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     justifyContent: "space-between",
//   },

//   title: {
//     flex: 1,
//     fontSize: 16,
//     lineHeight: 23,
//     fontWeight: "700",
//     color: "#202B23",
//     marginRight: 12,
//     paddingTop: 3,
//   },

//   closeButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     backgroundColor: "#FFF0F0",
//     borderWidth: 1,
//     borderColor: "#FFDADA",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   closeText: {
//     fontSize: 25,
//     lineHeight: 28,
//     fontWeight: "500",
//     color: "#D93636",
//     marginTop: -2,
//   },

//   message: {
//     fontSize: 14,
//     lineHeight: 22,
//     color: "#59665D",
//     marginTop: 12,
//   },

//   date: {
//     fontSize: 11,
//     lineHeight: 16,
//     color: "#89948C",
//     marginTop: 14,
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#EDF0ED",
//   },

//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#F5F7F5",
//   },

//   loadingText: {
//     fontSize: 14,
//     color: "#647067",
//     marginTop: 12,
//   },

//   emptyBox: {
//     flex: 1,
//     minHeight: 300,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 24,
//   },

//   emptyIcon: {
//     fontSize: 42,
//     marginBottom: 14,
//   },

//   emptyTitle: {
//     fontSize: 19,
//     fontWeight: "700",
//     color: "#202B23",
//   },

//   emptyMessage: {
//     fontSize: 14,
//     lineHeight: 21,
//     color: "#78847B",
//     textAlign: "center",
//     marginTop: 8,
//   },
// });






import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.100.18:2005/api/notifications";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // Notifications backend se load karo
  const getNotifications = async () => {
    try {
      setError("");

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setNotifications([]);
        setError("Please login again.");
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.log(
        "Notification Load Error:",
        error.response?.data?.message || error.message
      );

      setError(
        error.response?.data?.message ||
        "Unable to load notifications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Screen open hone par notifications load karo
  useFocusEffect(
    useCallback(() => {
      getNotifications();
    }, [])
  );

  // Pull to refresh
  const handleRefresh = () => {
    setRefreshing(true);
    getNotifications();
  };

  // Notification delete karo
  const deleteNotification = async (id) => {
  try {
    setDeletingId(id);

    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return;
    }

    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setNotifications((oldList) =>
      oldList.filter((item) => item._id !== id)
    );

  } catch (error) {
    console.log(
      "Delete Error:",
      error.response?.data?.message || error.message
    );
  } finally {
    setDeletingId(null);
  }
};

  const confirmDelete = async (id) => {
    try {
      setDeletingId(id);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Login Required", "Please login again.");
        return;
      }

      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((oldList) =>
        oldList.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.log(
        "Delete Error:",
        error.response?.data?.message || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message || "Unable to delete notification."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Date format
  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleString();
  };

  // Notification card
  const renderNotification = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Ionicons
            name="notifications"
            size={20}
            color="#16834A"
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.title}>
            {item.title}
          </Text>

          <Text style={styles.message}>
            {item.message}
          </Text>

          {item.createdAt ? (
            <Text style={styles.date}>
              {formatDate(item.createdAt)}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNotification(item._id)}
          disabled={deletingId === item._id}
          accessibilityRole="button"
          accessibilityLabel="Delete notification"
          activeOpacity={0.7}
        >
          {deletingId === item._id ? (
            <ActivityIndicator size="small" color="#D93636" />
          ) : (
            <Ionicons
              name="trash-outline"
              size={19}
              color="#D93636"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // Loading screen
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16834A" />

        <Text style={styles.loadingText}>
          Loading notifications...
        </Text>
      </View>
    );
  }

  // Main screen
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.heading}>
            Notifications
          </Text>

          <Text style={styles.subtitle}>
            Your latest CandyApp updates
          </Text>
        </View>

        <View style={styles.bellBox}>
          <Ionicons
            name="notifications-outline"
            size={25}
            color="#16834A"
          />
        </View>
      </View>

      {/* Notification count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          All Notifications
        </Text>

        <Text style={styles.countBadge}>
          {notifications.length}
        </Text>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color="#D93636"
          />

          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity onPress={getNotifications}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Notification list */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderNotification}
        contentContainerStyle={[
          styles.list,
          notifications.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#16834A"]}
          />
        }
        ListEmptyComponent={
          !error ? (
            <View style={styles.emptyBox}>
              <Ionicons
                name="notifications-off-outline"
                size={55}
                color="#AAB5AC"
              />

              <Text style={styles.emptyTitle}>
                No Notifications
              </Text>

              <Text style={styles.emptyMessage}>
                Your latest updates will appear here.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F5",
    paddingTop: 48,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  headerText: {
    flex: 1,
    marginRight: 12,
  },

  heading: {
    fontSize: 25,
    fontWeight: "800",
    color: "#17251C",
  },

  subtitle: {
    fontSize: 13,
    color: "#78847B",
    marginTop: 6,
  },

  bellBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EBE5",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  countRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  countText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#344239",
  },

  countBadge: {
    marginLeft: 9,
    minWidth: 25,
    textAlign: "center",
    overflow: "hidden",
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: "#E0F2E6",
    color: "#16834A",
    fontSize: 12,
    fontWeight: "700",
  },

  list: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 30,
  },

  emptyList: {
    flexGrow: 1,
  },

  separator: {
    height: 13,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E3EAE4",
    elevation: 2,
    shadowColor: "#203A27",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E9F6ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  cardContent: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    color: "#202B23",
  },

  message: {
    fontSize: 13,
    lineHeight: 21,
    color: "#59665D",
    marginTop: 6,
  },

  date: {
    fontSize: 11,
    color: "#89948C",
    marginTop: 11,
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7F5",
  },

  loadingText: {
    fontSize: 14,
    color: "#647067",
    marginTop: 12,
  },

  emptyBox: {
    flex: 1,
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#202B23",
    marginTop: 14,
  },

  emptyMessage: {
    fontSize: 14,
    lineHeight: 21,
    color: "#78847B",
    textAlign: "center",
    marginTop: 8,
  },

  errorBox: {
    marginHorizontal: 18,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFF0F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  errorText: {
    flex: 1,
    fontSize: 12,
    color: "#B52E2E",
  },

  retryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#16834A",
  },
});
