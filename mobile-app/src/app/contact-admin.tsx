
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";

import { BackHandler } from "react-native";
import { useFocusEffect, router } from "expo-router";
import React, { useCallback } from "react";

export default function ContactAdmin() {

    useFocusEffect(
  useCallback(() => {

    const onBackPress = () => {

      router.replace("/(tabs)/settings");

      return true;
    };

    const subscription =
      BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

    return () => subscription.remove();

  }, [])
);

  const callAdmin = () => {

    Linking.openURL(
      "tel:+919758005724"
    );

  };

  const emailAdmin = () => {

    Linking.openURL(
      "mailto:schoolbus@gmail.com"
    );

  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Contact Admin
      </Text>

      <Text style={styles.info}>
        Transport Support
      </Text>

      <Text style={styles.info}>
        📞 +91 9758005724
      </Text>

      <Text style={styles.info}>
        ✉️ schoolbus@gmail.com
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={callAdmin}
      >
        <Text style={styles.buttonText}>
          Call Admin
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={emailAdmin}
      >
        <Text style={styles.buttonText}>
          Email Admin
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F3F6FB",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 25,
  },

  info: {
    fontSize: 18,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },

  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "700",
  },
});