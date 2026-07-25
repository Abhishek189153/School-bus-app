
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

import { BackHandler,TouchableOpacity } from "react-native";
import { useFocusEffect, router } from "expo-router";
import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function HelpCenter() {

  const [darkMode, setDarkMode] =
  useState(false);

useFocusEffect(
  useCallback(() => {

    const loadTheme = async () => {

      const theme =
        await AsyncStorage.getItem(
          "darkMode"
        );

      setDarkMode(
        theme === "true"
      );

    };

    loadTheme();

    const onBackPress = () => {

      router.replace(
        "/(tabs)/settings"
      );

      return true;

    };

    const subscription =
      BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

    return () =>
      subscription.remove();

  }, [])
);



  return (
    <ScrollView
  style={[
    styles.container,
    {
      backgroundColor:
        darkMode
          ? "#001233"
          : "#F3F6FB",
    },
  ]}
>
      <Text
  style={[
    styles.title,
    {
      color:
        darkMode
          ? "#FFFFFF"
          : "#000000",
    },
  ]}
>
  Help Center
</Text>

    <View
  style={[
    styles.card,
    {
      backgroundColor:
        darkMode
          ? "#1E293B"
          : "#FFFFFF",
    },
  ]}
>
       <Text
  style={[
    styles.question,
    {
      color:
        darkMode
          ? "#FFFFFF"
          : "#000000",
    },
  ]}
>
          How do I track the bus?
        </Text>

       <Text
  style={[
    styles.answer,
    {
      color:
        darkMode
          ? "#CBD5E1"
          : "#666666",
    },
  ]}
>
          Open Home screen to view
          the live bus location.
        </Text>
      </View>

      <View
  style={[
    styles.card,
    {
      backgroundColor:
        darkMode
          ? "#1E293B"
          : "#FFFFFF",
    },
  ]}
>
       <Text
  style={[
    styles.question,
    {
      color:
        darkMode
          ? "#FFFFFF"
          : "#000000",
    },
  ]}
>
          Why am I not receiving notifications?
        </Text>

      <Text
  style={[
    styles.answer,
    {
      color:
        darkMode
          ? "#CBD5E1"
          : "#666666",
    },
  ]}
>
          Check notification
          permissions and internet
          connection.
        </Text>
      </View>

      <View
  style={[
    styles.card,
    {
      backgroundColor:
        darkMode
          ? "#1E293B"
          : "#FFFFFF",
    },
  ]}
>
      <Text
  style={[
    styles.question,
    {
      color:
        darkMode
          ? "#FFFFFF"
          : "#000000",
    },
  ]}
>
          What is Boarding Alert?
        </Text>

       <Text
  style={[
    styles.answer,
    {
      color:
        darkMode
          ? "#CBD5E1"
          : "#666666",
    },
  ]}
>
          You receive it when your
          child boards the bus.
        </Text>
      </View>

<View
  style={[
    styles.card,
    {
      backgroundColor:
        darkMode
          ? "#1E293B"
          : "#FFFFFF",
    },
  ]}
>       <Text
  style={[
    styles.question,
    {
      color:
        darkMode
          ? "#FFFFFF"
          : "#000000",
    },
  ]}
>
          What is Trip Started?
        </Text>

       <Text
  style={[
    styles.answer,
    {
      color:
        darkMode
          ? "#CBD5E1"
          : "#666666",
    },
  ]}
>
          The bus has started its
          route.
        </Text>
      </View>

     <View
  style={[
    styles.card,
    {
      backgroundColor:
        darkMode
          ? "#1E293B"
          : "#FFFFFF",
    },
  ]}
>
       <Text
  style={[
    styles.question,
    {
      color:
        darkMode
          ? "#FFFFFF"
          : "#000000",
    },
  ]}
>
          What is Bus Arrived?
        </Text>

        <Text
  style={[
    styles.answer,
    {
      color:
        darkMode
          ? "#CBD5E1"
          : "#666666",
    },
  ]}
>
          The bus has reached your
          pickup stop.
        </Text>
      </View>
    </ScrollView>
  );
}

<TouchableOpacity
  onPress={() =>
    router.replace("/(tabs)/settings")
  }
></TouchableOpacity>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F3F6FB",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 28,
    marginTop:27,
  },

  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  question: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },

  answer: {
    color: "#666",
    lineHeight: 22,
  },
});