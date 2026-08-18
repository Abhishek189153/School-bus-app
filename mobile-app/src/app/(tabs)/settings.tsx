import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  Switch,
  ScrollView,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  updateNotificationSettings,
} from "../../services/mobile.service";

import {
  router,
} from "expo-router";

import PressableScale from "../../components/PressableScale";
import { useTheme } from "../../contexts/ThemeContext";

export default function Settings() {

 const { darkMode, setDarkMode } = useTheme();
 const insets = useSafeAreaInsets();

 const [
  tripAlerts,
  setTripAlerts,
] = useState(true);

const [
  boardingAlerts,
  setBoardingAlerts,
] = useState(true);

useEffect(() => {
  loadPreferences();
}, []);

// previously this only ran when a dark-mode value already existed in
// storage, so on a fresh install trip/boarding preferences never loaded
// even if they'd been saved — now independent of theme entirely.
const loadPreferences = async () => {

  const tripSetting =
  await AsyncStorage.getItem(
    "tripAlerts"
  );

const boardingSetting =
  await AsyncStorage.getItem(
    "boardingAlerts"
  );

if (
  tripSetting !== null
) {

  setTripAlerts(
    tripSetting === "true"
  );

}

if (
  boardingSetting !== null
) {

  setBoardingAlerts(
    boardingSetting === "true"
  );

}
};

const toggleDarkMode = (value: boolean) => {
  // context updates in-memory state instantly across every tab and
  // persists to AsyncStorage in the background — no local write needed
  setDarkMode(value);
};

const toggleTripAlerts =
async (value: boolean) => {

  setTripAlerts(value);

  await AsyncStorage.setItem(
    "tripAlerts",
    value.toString()
  );

  await updateNotificationSettings({

    tripAlerts: value,

    boardingAlerts,

  });

};

const toggleBoardingAlerts =
async (value: boolean) => {

  setBoardingAlerts(value);

  await AsyncStorage.setItem(
    "boardingAlerts",
    value.toString()
  );

  await updateNotificationSettings({

    tripAlerts,

    boardingAlerts: value,

  });

};

  const handleLogout = async () => {

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {

            try {

              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");

              router.replace("/");

            } catch (error) {

              Alert.alert(
                "Error",
                "Failed to logout. Please try again."
              );

            }

          },
        },
      ]
    );

  };

  return (

    <View
  style={[
    styles.container,
    {
      backgroundColor: darkMode
        ? "#0F172A"
        : "#F5F8FF",
    },
  ]}
>

  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={[
      styles.scrollContent,
      { paddingTop: insets.top + 30, paddingBottom: 100 + insets.bottom },
    ]}
  >

<Text
  style={[
    styles.heading,
    {
      color: darkMode
        ? "#FFFFFF"
        : "#0F4C81",
    },
  ]}
>        Settings
      </Text>

      {/* Notifications */}
     <View
  style={[
    styles.card,
    {
      backgroundColor: darkMode
        ? "#1E293B"
        : "#FFFFFF",
    },
  ]}
>

        <Text style={styles.sectionTitle}>
        Notifications
        </Text>

        <View style={styles.settingRow}>
         <Text
  style={[
    styles.settingText,
    {
      color: darkMode
        ? "#FFFFFF"
        : "#1F2937",
    },
  ]}
>
            Trip Alerts
          </Text>
          <Switch
            value={tripAlerts}
            onValueChange={
              toggleTripAlerts
            }
          />
        </View>

        <View
  style={[
    styles.settingRow,
    styles.lastRow,
  ]}
>
          <Text
  style={[
    styles.settingText,
    {
      color: darkMode
        ? "#FFFFFF"
        : "#1F2937",
    },
  ]}
>
            Boarding/Drop Alerts
          </Text>
          <Switch
          value={boardingAlerts}
          onValueChange={
            toggleBoardingAlerts
          }
        />
        </View>

      </View>

      {/* Preferences */}
     <View
  style={[
    styles.card,
    {
      backgroundColor: darkMode
        ? "#1E293B"
        : "#FFFFFF",
    },
  ]}
>

        <Text style={styles.sectionTitle}>
        Preferences
        </Text>

        <View
  style={[
    styles.settingRow,
    styles.lastRow,
  ]}
>
  <Text
    style={[
      styles.settingText,
      {
        color: darkMode
          ? "#FFFFFF"
          : "#1F2937",
      },
    ]}
  >
    Dark Mode
  </Text>

  <Switch
    value={darkMode}
    onValueChange={toggleDarkMode}
    trackColor={{
      false: "#FFFFFF",
      true: "#0F4C81",
    }}
  />
</View>

      </View>

      {/* Support */}
    <View
  style={[
    styles.card,
    {
      backgroundColor: darkMode
        ? "#1E293B"
        : "#FFFFFF",
    },
  ]}
>

        <Text style={styles.sectionTitle}>
        Support
        </Text>

        <PressableScale
  style={styles.supportItem}
  scaleTo={0.98}
  onPress={() =>
    router.push("/help-center")
  }
>
  <Text
    style={[
      styles.supportText,
      {
        color: darkMode
          ? "#FFFFFF"
          : "#1F2937",
      },
    ]}
  >
    Help Center
  </Text>
</PressableScale>

<View
  style={[
    styles.divider,
    {
      backgroundColor: darkMode
        ? "#374151"
        : "#E5E7EB",
    },
  ]}
/>

<PressableScale
  style={[
    styles.supportItem,
    styles.lastSupportItem,
  ]}
  scaleTo={0.98}
  onPress={() =>
    router.push("/contact-admin")
  }
>
  <Text
    style={[
      styles.supportText,
      {
        color: darkMode
          ? "#FFFFFF"
          : "#1F2937",
      },
    ]}
  >
    Contact Admin
  </Text>
</PressableScale>

      </View>

      {/* Logout */}
      <PressableScale
        style={styles.logoutButton}
        scaleTo={0.97}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          Logout
        </Text>
      </PressableScale>

      <Text style={styles.versionText}>
        Version 1.0.0
      </Text>

  </ScrollView>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#F5F8FF",

  },

  // Padding moved here from `container`. contentContainerStyle sizes
  // itself to the actual content height, so when content is short it
  // still fills the screen (flexGrow: 1), and when content is tall
  // it scrolls instead of being clipped off the bottom.
  scrollContent: {

    flexGrow: 1,

    padding: 16,

  },

  heading: {

    fontSize: 28,

    fontWeight: "bold",

    color: "#0F4C81",

    marginBottom: 20,
    marginLeft: -30,

  },

  card: {

    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    padding: 18,

    marginBottom: 16,

    elevation: 3,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 4,

  },

  sectionTitle: {

    fontSize: 18,

    fontWeight: "700",

    color: "#60A5FA",

    marginBottom: 14,
   

  },

  settingRow: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingVertical: 14,

    borderBottomWidth: 1,

    borderBottomColor: "#E5E7EB",

  },

  lastRow: {

    borderBottomWidth: 0,

  },

  settingText: {

    fontSize: 15,

    color: "#1F2937",

    fontWeight: "500",


  },

  comingSoon: {

    fontSize: 13,

    color: "#6B7280",

    fontWeight: "600",

  },

  supportItem: {

    paddingVertical: 14,

    borderBottomWidth: 1,

    borderBottomColor: "#E5E7EB",

  },

  lastSupportItem: {

    borderBottomWidth: 0,

  },

  supportText: {

    fontSize: 15,

    color: "#1F2937",

    fontWeight: "500",

  },

  logoutButton: {

    backgroundColor: "#EF4444",

    paddingVertical: 15,

    borderRadius: 16,

    alignItems: "center",

    marginTop: 8,

    elevation: 2,

  },

  logoutText: {

    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "700",

  },

  versionText: {

    textAlign: "center",

    marginTop: 16,

    color: "#94A3B8",

    fontSize: 13,

  },

  divider: {
  height: 1,
  marginVertical: 2,
},

});
