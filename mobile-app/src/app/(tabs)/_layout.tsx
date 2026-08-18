import React from "react";
import { Dimensions, View } from "react-native";
import { withLayoutContext } from "expo-router";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "expo-router/js-top-tabs";
import { ParamListBase, TabNavigationState } from "expo-router/react-navigation";
import { Ionicons } from "@expo/vector-icons";

import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";

const { Navigator } = createMaterialTopTabNavigator();

// Wraps material-top-tabs so expo-router drives it from the file system,
// same way <Tabs> did — parent-dashboard.tsx, profile.tsx, history.tsx and
// settings.tsx stay real routes (useFocusEffect / deep links keep working),
// but the navigator itself now supports swipe gestures and animates a
// directional slide (right pages slide in from the right, left pages
// slide in from the left) whether you swipe OR tap a tab icon.
const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

function TabsInner() {
  const { darkMode } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? "#001233" : "#FFFFFF" }}>
    <MaterialTopTabs
      tabBarPosition="bottom"
      initialLayout={{ width: Dimensions.get("window").width }}
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        tabBarShowIcon: true,
        tabBarShowLabel: true,
        tabBarItemStyle: { flexDirection: "column" },
        tabBarIndicatorStyle: { height: 0 }, // no underline — same look as before, just icon/text color change
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 89,
          backgroundColor: darkMode ? "#001233" : "#FFFFFF",
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.15,
          shadowColor: "transparent",
        },
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: darkMode ? "#FFFFFF" : "#4b4d4f",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          textTransform: "none",
          marginTop: 2,
        },
      }}
    >
      <MaterialTopTabs.Screen
        name="parent-dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <MaterialTopTabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <MaterialTopTabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <MaterialTopTabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </MaterialTopTabs>
    </View>
  );
}

export default function TabLayout() {
  return (
    <ThemeProvider>
      <TabsInner />
    </ThemeProvider>
  );
}
