import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useLocalSearchParams, router } from "expo-router";

export default function DayStatus() {

  const {
    type,
    title,
    message,
  } = useLocalSearchParams();

  const isHoliday = type === "holiday";

  return (

    <View style={styles.container}>

      <View style={styles.card}>

        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isHoliday
                ? "#FEF3C7"
                : "#DCFCE7",
            },
          ]}
        >

          <Ionicons
            name={
              isHoliday
                ? "calendar-outline"
                : "leaf-outline"
            }
            size={55}
            color={
              isHoliday
                ? "#F59E0B"
                : "#16A34A"
            }
          />

        </View>

        <Text style={styles.heading}>
          {isHoliday
            ? "School Holiday"
            : "Weekly Off"}
        </Text>

        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.message}>
          {message}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.replace("/driver-dashboard")
          }
        >

          <Text style={styles.buttonText}>
            Back to Dashboard
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#F4F7FB",

    justifyContent: "center",

    alignItems: "center",

    padding: 20,

  },

  card: {

    width: "100%",

    maxWidth: 380,

    backgroundColor: "#FFFFFF",

    borderRadius: 22,

    padding: 28,

    alignItems: "center",

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 14,

    shadowOffset: {

      width: 0,

      height: 8,

    },

    elevation: 6,

  },

  iconContainer: {

    width: 95,

    height: 95,

    borderRadius: 48,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 22,

  },

  heading: {

    fontSize: 24,

    fontWeight: "700",

    color: "#0F172A",

  },

  title: {

    marginTop: 10,

    fontSize: 18,

    fontWeight: "600",

    color: "#4F46E5",

    textAlign: "center",

  },

  message: {

    marginTop: 18,

    textAlign: "center",

    fontSize: 15,

    color: "#64748B",

    lineHeight: 24,

  },

  button: {

    marginTop: 30,

    width: "100%",

    backgroundColor: "#4F46E5",

    paddingVertical: 15,

    borderRadius: 14,

    alignItems: "center",

  },

  buttonText: {

    color: "#FFFFFF",

    fontWeight: "700",

    fontSize: 16,

  },

});