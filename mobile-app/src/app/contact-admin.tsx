import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { BackHandler } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { getMySchoolAdmin } from "../services/mobile.service";

export default function ContactAdmin() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/(tabs)/settings");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        setLoading(true);

        const response = await getMySchoolAdmin();

        if (response?.success) {
          setAdmin(response.admin);
        } else {
          Alert.alert(
            "Unable to load admin",
            response?.message || "School Admin not found."
          );
        }
      } catch (error) {
        console.log("GET SCHOOL ADMIN ERROR:", error);

        Alert.alert(
          "Error",
          "Unable to load school admin details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, []);

  const callAdmin = async () => {
    if (!admin?.phone) {
      Alert.alert(
        "Phone Number Unavailable",
        "Admin phone number is not available."
      );
      return;
    }

    try {
      await Linking.openURL(`tel:${admin.phone}`);
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to open the phone dialer."
      );
    }
  };

  const emailAdmin = async () => {
    if (!admin?.email) {
      Alert.alert(
        "Email Unavailable",
        "Admin email is not available."
      );
      return;
    }

    try {
      await Linking.openURL(`mailto:${admin.email}`);
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to open the email application."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Contact Admin
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>
            Loading admin details...
          </Text>
        </View>
      ) : admin ? (
        <View style={styles.card}>
          <Text style={styles.label}>
            School Admin
          </Text>

          <Text style={styles.name}>
            {admin.name || "-"}
          </Text>

          <Text style={styles.info}>
            📞 {admin.phone || "Phone not available"}
          </Text>

          <Text style={styles.info}>
            ✉️ {admin.email || "Email not available"}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={callAdmin}
            disabled={!admin.phone}
          >
            <Text style={styles.buttonText}>
              Call Admin
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={emailAdmin}
            disabled={!admin.email}
          >
            <Text style={styles.buttonText}>
              Email Admin
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.emptyText}>
            School Admin details are not available.
          </Text>
        </View>
      )}
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

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
  },

  label: {
    fontSize: 15,
    color: "#666666",
    marginBottom: 6,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
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
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
  },

  loadingContainer: {
    alignItems: "center",
    marginTop: 40,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666666",
  },

  emptyText: {
    fontSize: 17,
    color: "#666666",
    textAlign: "center",
  },
});