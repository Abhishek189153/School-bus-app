import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

// import {
//   VideoView,
//   useVideoPlayer,
// } from "expo-video";

import { router } from "expo-router";

export default function DriverLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] =
    useState("");

  // const player = useVideoPlayer(
  //   require("../../assets/videos/parent-school-bus.mp4"),
  //   (player) => {
  //     player.loop = true;
  //     player.play();
  //   }
  // );

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.7:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            phone,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!data.success) {
        Alert.alert(
          "Error",
          data.message
        );
        return;
      }

      if (
        data.user.role !==
        "DRIVER"
      ) {
        Alert.alert(
          "Error",
          "Not a Driver account"
        );
        return;
      }

      await AsyncStorage.setItem(
        "token",
        data.token
      );

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      router.replace(
        "/driver-dashboard"
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* Header */}

          <View style={styles.header}>
            <Text style={styles.title}>
              Driver Portal
            </Text>

            <Text
              style={styles.subtitle}
            >
              Manage trips, routes and
              student transportation
              efficiently
            </Text>
          </View>

          {/* Video */}

          {/* <View
            style={
              styles.videoContainer
            }
          >
            <VideoView
              player={player}
              style={styles.heroVideo}
              nativeControls={false}
            />
          </View> */}

          {/* Login Card */}

          <View
            style={styles.loginCard}
          >
            <Text
              style={
                styles.cardTitle
              }
            >
              Login
            </Text>

            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              style={styles.input}
              value={phone}
              onChangeText={
                setPhone
              }
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={
                setPassword
              }
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
            >
              <Text
                style={
                  styles.buttonText
                }
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            Route Management • Trip
            Monitoring • Driver
            Operations
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#F4F7FC",
    },

    header: {
      alignItems: "center",
      marginTop: 20,
      marginBottom: 10,
      paddingHorizontal: 20,
    },

    title: {
      fontSize: 30,
      fontWeight: "800",
      color: "#1565C0",
    },

    subtitle: {
      marginTop: 8,
      fontSize: 16,
      textAlign: "center",
      color: "#64748B",
      lineHeight: 24,
    },

    videoContainer: {
      width: "100%",
      marginBottom: 15,
    },

    heroVideo: {
      width: "100%",
      height: 180,
    },

    loginCard: {
      backgroundColor:
        "#FFFFFF",
      marginHorizontal: 20,
      borderRadius: 28,
      padding: 24,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,

      elevation: 8,
    },

    cardTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: "#1E293B",
      textAlign: "center",
      marginBottom: 20,
    },

    input: {
      backgroundColor:
        "#F8FAFC",
      borderWidth: 1,
      borderColor: "#E2E8F0",
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 15,
      fontSize: 16,
      marginBottom: 15,
      color: "#0F172A",
    },

    button: {
      backgroundColor:
        "#1565C0",
      paddingVertical: 17,
      borderRadius: 16,
      marginTop: 12,
    },

    buttonText: {
      color: "#FFFFFF",
      textAlign: "center",
      fontSize: 18,
      fontWeight: "700",
    },

    footer: {
      textAlign: "center",
      color: "#94A3B8",
      fontSize: 13,
      marginTop: 25,
      marginBottom: 30,
      paddingHorizontal: 20,
      lineHeight: 20,
    },
  });