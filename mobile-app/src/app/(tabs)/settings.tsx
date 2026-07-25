import React, { useState,  useEffect, } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";



import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  updateNotificationSettings,
} from "../../services/mobile.service";

import {
  router,
} from "expo-router";

export default function Settings() {

 const [darkMode, setDarkMode] = useState(false);

 const [
  tripAlerts,
  setTripAlerts,
] = useState(true);

const [
  boardingAlerts,
  setBoardingAlerts,
] = useState(true);

useEffect(() => {
  loadTheme();
}, []);

const loadTheme = async () => {
  const theme = await AsyncStorage.getItem("darkMode");

  if (theme !== null) {
    setDarkMode(theme === "true");

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
  }
};

const toggleDarkMode = async (value: boolean) => {

  // console.log(
  //   "Saving theme:",
  //   value
  // );

  setDarkMode(value);

  await AsyncStorage.setItem(
    "darkMode",
    value.toString()
  );

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
            Boarding/Drop Alerts
          </Text>
          <Switch
          value={boardingAlerts}
          onValueChange={
            toggleBoardingAlerts
          }
        />
        </View>

        {/* <View
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
            Drop Alerts
          </Text>
          <Switch
            value={true}
            disabled
          />
        </View> */}

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

        <TouchableOpacity
  style={styles.supportItem}
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
</TouchableOpacity>

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

<TouchableOpacity
  style={[
    styles.supportItem,
    styles.lastSupportItem,
  ]}
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
</TouchableOpacity>

      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>
        Version 1.0.0
      </Text>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#F5F8FF",

    padding: 16,

    paddingTop: 30,

  },

  heading: {

    fontSize: 28,
    marginLeft: -35,

    fontWeight: "bold",

    color: "#0F4C81",

    marginBottom: 20,

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