// import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

import React, {
  useEffect,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { scaleW, scaleF } from "../utils/responsive"; // adjust path to match this file's location

export default function HomeScreen() {
    useEffect(() => {

    const checkLogin =
      async () => {

        try {

          const token =
            await AsyncStorage.getItem(
              "token"
            );

          const userString =
            await AsyncStorage.getItem(
              "user"
            );

          if (
            token &&
            userString
          ) {

            const user =
              JSON.parse(
                userString
              );

            if (
              user.role ===
              "PARENT"
            ) {

              router.replace(
                "/(tabs)/parent-dashboard"
              );

              return;

            }

            if (
              user.role ===
              "DRIVER"
            ) {

              router.replace(
                "/driver-dashboard"
              );

              return;

            }

          }

        } catch (error) {

          console.log(
            "Auto Login Error:",
            error
          );

        }

      };

    checkLogin();

  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.brandIcon}>
          <Text style={styles.brandEmoji}>🚌</Text>
        </View>
        <Text style={styles.title}>BusTrack</Text>
        <Text style={styles.subtitle}>Smart School Transportation</Text>
        <Text style={styles.description}>
          Safe, reliable, and real-time management for drivers and parents.
        </Text>
      </View>

      {/* Login Navigation Cards */}
      <View style={styles.cardContainer}>
        
        {/* Driver Card */}
        <TouchableOpacity
          style={[styles.card, styles.driverCard]}
          activeOpacity={0.85}
          onPress={() => router.push("/driver-login")}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Driver Portal</Text>
            <Text style={styles.cardText}>Manage routes, trips, and student pickups.</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Parent Card */}
        <TouchableOpacity
          style={[styles.card, styles.parentCard]}
          activeOpacity={0.85}
          onPress={() => router.push("/parent-login")}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Parent Portal</Text>
            <Text style={styles.cardText}>Track your child's bus and travel updates.</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Real-Time Tracking • Student Safety • Reliable Transit
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  brandIcon: {
    width: scaleW(72),
    height: scaleW(72),
    borderRadius: 24,
    backgroundColor: "#2D2D2D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3D3D3D",
  },
  brandEmoji: {
    fontSize: scaleF(36),
  },
  title: {
    fontSize: scaleF(36),
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: scaleF(18),
    fontWeight: "600",
    color: "#A0AEC0",
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
    color: "#718096",
    fontSize: scaleF(15),
    lineHeight: 22,
    maxWidth: "85%",
  },
  // justifyContent: "center" keeps the two cards visually balanced
  // in the available space instead of stacking at the top and
  // leaving a large empty gap above the footer on tall screens.
  cardContainer: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  cardContent: {
    flex: 1,
    marginRight: 16,
  },
  driverCard: {
    backgroundColor: "#1D4ED8", // Deep Royal Blue
    borderWidth: 1,
    borderColor: "#1E40AF",
  },
  parentCard: {
    backgroundColor: "#166534", // Professional Forest Green
    borderWidth: 1,
    borderColor: "#15803D",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: scaleF(20),
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardText: {
    color: "#DBEAFE",
    fontSize: scaleF(14),
    fontWeight: "500",
    lineHeight: 18,
  },
  arrow: {
    fontSize: scaleF(24),
    color: "#FFFFFF",
    fontWeight: "bold",
    opacity: 0.8,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 52,
    paddingTop: 16,
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: scaleF(10),
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
