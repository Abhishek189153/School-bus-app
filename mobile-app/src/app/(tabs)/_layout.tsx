import { Tabs, useFocusEffect }
from "expo-router";

import React, {
  useState,
  useEffect,
} from "react";

import AsyncStorage
from "@react-native-async-storage/async-storage";

import {
  Ionicons,
} from "@expo/vector-icons";

export default function TabLayout() {

  const [darkMode, setDarkMode] =
  useState(false);

  const loadTheme = async () => {

  const theme =
    await AsyncStorage.getItem(
      "darkMode"
    );

  //   console.log(
  //   "TAB THEME:",
  //   theme
  // );

  setDarkMode(
    theme === "true"
  );

};

   useEffect(() => {

  const interval = setInterval(
    loadTheme,
    
  );

  return () =>
    clearInterval(interval);

}, []);

// console.log(
//   "TAB DARK MODE STATE:",
//   darkMode
// );

  return (

    <Tabs

      screenOptions={{

        headerShown: false,

        tabBarStyle: {

          position: "absolute",

          bottom: 2,

          left: 15,

          right: 15,

          height: 89,
          
          

          backgroundColor:
  
     darkMode
    ? "#001233"
    : "#FFFFFF",

           borderTopWidth: 0,

            elevation: 8,
  shadowOpacity: 0.15,
          shadowColor:"transparent",
        },
        

        tabBarActiveTintColor:
          "#2196F3",

       tabBarInactiveTintColor:
  darkMode
    ? "#FFFFFF"
    : "#4b4d4f",
      }}

    >

      <Tabs.Screen
  name="parent-dashboard"
  options={{
    title: "Home",

    tabBarIcon:
      ({ color, size }) => (

        <Ionicons
          name="home"
          size={size}
          color={color}
        />

      ),
  }}
/>

      <Tabs.Screen
        name="profile"
        options={{

          title: "Profile",

          tabBarIcon:
            ({ color, size }) => (

              <Ionicons
                name="person"
                size={size}
                color={color}
              />

            ),

        }}
      />

      <Tabs.Screen
        name="history"
        options={{

          title: "History",

          tabBarIcon:
            ({ color, size }) => (

              <Ionicons
                name="time"
                size={size}
                color={color}
              />

            ),

        }}
      />

      <Tabs.Screen
        name="settings"
        options={{

          title: "Settings",

          tabBarIcon:
            ({ color, size }) => (

              <Ionicons
                name="settings"
                size={size}
                color={color}
              />

            ),

        }}
      />

    </Tabs>

  );

}