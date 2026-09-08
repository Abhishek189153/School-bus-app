import React, { useCallback, useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";

import { BackHandler } from "react-native";

import { useFocusEffect, router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getMySchoolAdmin } from "../services/mobile.service";

interface SchoolAdmin {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  profileImage?: string;
}

export default function ContactAdmin() {
  const [admin, setAdmin] = useState<SchoolAdmin | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  // =========================================================
  // LOAD THEME
  // =========================================================

  const loadTheme = useCallback(async () => {
    try {
      const theme = await AsyncStorage.getItem("darkMode");

      setDarkMode(theme === "true");
    } catch (error) {
      console.log("THEME ERROR:", error);
    }
  }, []);

  // =========================================================
  // LOAD ADMIN
  // =========================================================

  const loadAdmin = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await getMySchoolAdmin();

      if (response?.success && response?.admin) {
        setAdmin(response.admin);
      } else {
        setAdmin(null);
        setError(true);

        Alert.alert(
          "Unable to load admin",
          response?.message || "School Admin not found."
        );
      }
    } catch (error) {
      console.log("GET SCHOOL ADMIN ERROR:", error);

      setAdmin(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // SCREEN FOCUS
  // =========================================================

  useFocusEffect(
    useCallback(() => {
      loadTheme();
      loadAdmin();

      const onBackPress = () => {
        router.replace("/(tabs)/settings");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [loadTheme, loadAdmin])
  );

  // =========================================================
  // CALL ADMIN
  // =========================================================

  const callAdmin = async () => {
    if (!admin?.phone) {
      Alert.alert(
        "Phone Number Unavailable",
        "The school admin phone number is not available."
      );

      return;
    }

    try {
      await Linking.openURL(`tel:${admin.phone}`);
    } catch (error) {
      console.log("CALL ADMIN ERROR:", error);

      Alert.alert(
        "Unable to Call",
        "Unable to open the phone dialer."
      );
    }
  };

  // =========================================================
  // EMAIL ADMIN
  // =========================================================

  const emailAdmin = async () => {
    if (!admin?.email) {
      Alert.alert(
        "Email Unavailable",
        "The school admin email address is not available."
      );

      return;
    }

    try {
      await Linking.openURL(`mailto:${admin.email}`);
    } catch (error) {
      console.log("EMAIL ADMIN ERROR:", error);

      Alert.alert(
        "Unable to Send Email",
        "Unable to open the email application."
      );
    }
  };

  // =========================================================
  // RETRY
  // =========================================================

  const retryLoading = () => {
    loadAdmin();
  };

  // =========================================================
  // COLORS
  // =========================================================

  const colors = {
    background: darkMode ? "#0F172A" : "#F3F6FB",

    card: darkMode ? "#1E293B" : "#FFFFFF",

    primaryText: darkMode ? "#F8FAFC" : "#111827",

    secondaryText: darkMode ? "#CBD5E1" : "#6B7280",

    mutedText: darkMode ? "#94A3B8" : "#9CA3AF",

    sectionText: darkMode ? "#E2E8F0" : "#374151",

    divider: darkMode ? "#334155" : "#E5E7EB",

    pressed: darkMode ? "#273449" : "#F3F6FB",

    iconBackground: darkMode ? "#172554" : "#EFF6FF",

    avatarBackground: darkMode ? "#172554" : "#E8F2FF",

    helpBackground: darkMode ? "#172033" : "#F8FAFC",

    helpIconBackground: darkMode ? "#1E3A8A" : "#DBEAFE",

    helpIconText: darkMode ? "#93C5FD" : "#2563EB",

    blue: darkMode ? "#60A5FA" : "#2196F3",

    green: darkMode ? "#4ADE80" : "#22C55E",

    errorBackground: darkMode ? "#3F1D1D" : "#FEF2F2",

    errorText: darkMode ? "#FCA5A5" : "#DC2626",
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.primaryText,
            },
          ]}
        >
          Contact Admin
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Get in touch with your school administrator
        </Text>
      </View>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <View style={styles.centerContainer}>
          <View
            style={[
              styles.loadingCard,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <ActivityIndicator
              size="large"
              color={colors.blue}
            />

            <Text
              style={[
                styles.loadingTitle,
                {
                  color: colors.primaryText,
                },
              ]}
            >
              Loading admin details
            </Text>

            <Text
              style={[
                styles.loadingText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Please wait...
            </Text>
          </View>
        </View>
      ) : error ? (
        /* =====================================================
           ERROR STATE
        ===================================================== */

        <View style={styles.centerContainer}>
          <View
            style={[
              styles.errorCard,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.errorIcon,
                {
                  backgroundColor: colors.errorBackground,
                  color: colors.errorText,
                },
              ]}
            >
              !
            </Text>

            <Text
              style={[
                styles.errorTitle,
                {
                  color: colors.primaryText,
                },
              ]}
            >
              Unable to load admin
            </Text>

            <Text
              style={[
                styles.errorText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              We couldn't retrieve the school administrator
              details.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={retryLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : admin ? (
        /* =====================================================
           ADMIN CARD
        ===================================================== */

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          {/* =================================================
              ADMIN HEADER
          ================================================= */}

          <View style={styles.adminHeader}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: colors.avatarBackground,
                },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  {
                    color: colors.blue,
                  },
                ]}
              >
                {admin.name?.charAt(0)?.toUpperCase() || "A"}
              </Text>
            </View>

            <View style={styles.adminHeaderText}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                SCHOOL ADMINISTRATOR
              </Text>

              <Text
                style={[
                  styles.name,
                  {
                    color: colors.primaryText,
                  },
                ]}
              >
                {admin.name || "School Admin"}
              </Text>

              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: colors.green,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,
                    {
                      color: colors.secondaryText,
                    },
                  ]}
                >
                  Available for assistance
                </Text>
              </View>
            </View>
          </View>

          {/* =================================================
              DIVIDER
          ================================================= */}

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.divider,
              },
            ]}
          />

          {/* =================================================
              CONTACT INFORMATION
          ================================================= */}

          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.sectionText,
              },
            ]}
          >
            Contact Information
          </Text>

          {/* =================================================
              PHONE
          ================================================= */}

          <Pressable
            style={({ pressed }) => [
              styles.contactRow,
              pressed && {
                backgroundColor: colors.pressed,
              },
            ]}
            onPress={callAdmin}
            disabled={!admin.phone}
          >
            <View
              style={[
                styles.contactIconContainer,
                {
                  backgroundColor: colors.iconBackground,
                },
              ]}
            >
              <Text
                style={[
                  styles.contactIcon,
                  {
                    color: colors.blue,
                  },
                ]}
              >
                ☎
              </Text>
            </View>

            <View style={styles.contactContent}>
              <Text
                style={[
                  styles.contactLabel,
                  {
                    color: colors.mutedText,
                  },
                ]}
              >
                Phone Number
              </Text>

              <Text
                style={[
                  styles.contactValue,
                  {
                    color: colors.primaryText,
                  },
                  !admin.phone && {
                    color: colors.mutedText,
                  },
                ]}
              >
                {admin.phone || "Phone not available"}
              </Text>
            </View>

            {admin.phone && (
              <Text
                style={[
                  styles.arrow,
                  {
                    color: colors.mutedText,
                  },
                ]}
              >
                ›
              </Text>
            )}
          </Pressable>

          {/* =================================================
              EMAIL
          ================================================= */}

          <Pressable
            style={({ pressed }) => [
              styles.contactRow,
              pressed && {
                backgroundColor: colors.pressed,
              },
            ]}
            onPress={emailAdmin}
            disabled={!admin.email}
          >
            <View
              style={[
                styles.contactIconContainer,
                {
                  backgroundColor: colors.iconBackground,
                },
              ]}
            >
              <Text
                style={[
                  styles.contactIcon,
                  {
                    color: colors.blue,
                  },
                ]}
              >
                ✉
              </Text>
            </View>

            <View style={styles.contactContent}>
              <Text
                style={[
                  styles.contactLabel,
                  {
                    color: colors.mutedText,
                  },
                ]}
              >
                Email Address
              </Text>

              <Text
                style={[
                  styles.contactValue,
                  {
                    color: colors.primaryText,
                  },
                  !admin.email && {
                    color: colors.mutedText,
                  },
                ]}
                numberOfLines={1}
              >
                {admin.email || "Email not available"}
              </Text>
            </View>

            {admin.email && (
              <Text
                style={[
                  styles.arrow,
                  {
                    color: colors.mutedText,
                  },
                ]}
              >
                ›
              </Text>
            )}
          </Pressable>

          {/* =================================================
              HELP BOX
          ================================================= */}

          <View
            style={[
              styles.helpBox,
              {
                backgroundColor: colors.helpBackground,
              },
            ]}
          >
            <Text
              style={[
                styles.helpIcon,
                {
                  backgroundColor: colors.helpIconBackground,
                  color: colors.helpIconText,
                },
              ]}
            >
              i
            </Text>

            <Text
              style={[
                styles.helpText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              For transport-related questions or support,
              contact your school administrator directly.
            </Text>
          </View>
        </View>
      ) : (
        /* =====================================================
           EMPTY STATE
        ===================================================== */

        <View style={styles.centerContainer}>
          <View
            style={[
              styles.errorCard,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.errorIcon,
                {
                  backgroundColor: colors.errorBackground,
                  color: colors.errorText,
                },
              ]}
            >
              !
            </Text>

            <Text
              style={[
                styles.errorTitle,
                {
                  color: colors.primaryText,
                },
              ]}
            >
              Admin details unavailable
            </Text>

            <Text
              style={[
                styles.errorText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              No school administrator has been assigned
              to your school yet.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={retryLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>
                Refresh
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    marginTop: 25,
    marginBottom: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 15,
    marginTop: 6,
    lineHeight: 21,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // =========================================================
  // LOADING CARD
  // =========================================================

  loadingCard: {
    width: "100%",
    borderRadius: 18,
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: "center",

    elevation: 3,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 8,
  },

  loadingTitle: {
    marginTop: 18,
    fontSize: 17,
    fontWeight: "700",
  },

  loadingText: {
    marginTop: 5,
    fontSize: 14,
  },

  // =========================================================
  // ADMIN CARD
  // =========================================================

  card: {
    borderRadius: 20,
    padding: 22,

    elevation: 4,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,

    shadowRadius: 10,
  },

  adminHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 15,
  },

  avatarText: {
    fontSize: 27,
    fontWeight: "800",
  },

  adminHeaderText: {
    flex: 1,
  },

  label: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  name: {
    fontSize: 23,
    fontWeight: "800",
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
  },

  divider: {
    height: 1,
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },

  // =========================================================
  // CONTACT ROW
  // =========================================================

  contactRow: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 12,
    paddingHorizontal: 8,

    borderRadius: 12,
  },

  contactIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  contactIcon: {
    fontSize: 20,
  },

  contactContent: {
    flex: 1,
  },

  contactLabel: {
    fontSize: 12,
    marginBottom: 3,
  },

  contactValue: {
    fontSize: 16,
    fontWeight: "600",
  },

  arrow: {
    fontSize: 27,
    marginLeft: 8,
  },

  // =========================================================
  // HELP BOX
  // =========================================================

  helpBox: {
    flexDirection: "row",
    alignItems: "flex-start",

    borderRadius: 12,

    padding: 12,

    marginTop: 18,
  },

  helpIcon: {
    width: 20,
    height: 20,

    borderRadius: 10,

    textAlign: "center",
    textAlignVertical: "center",

    fontSize: 13,
    fontWeight: "800",

    marginRight: 8,
  },

  helpText: {
    flex: 1,

    fontSize: 12,
    lineHeight: 18,
  },

  // =========================================================
  // ERROR CARD
  // =========================================================

  errorCard: {
    width: "100%",

    borderRadius: 18,

    padding: 28,

    alignItems: "center",

    elevation: 3,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 8,
  },

  errorIcon: {
    width: 46,
    height: 46,

    borderRadius: 23,

    textAlign: "center",
    textAlignVertical: "center",

    fontSize: 25,
    fontWeight: "800",
  },

  errorTitle: {
    marginTop: 15,

    fontSize: 18,
    fontWeight: "700",

    textAlign: "center",
  },

  errorText: {
    marginTop: 7,

    fontSize: 14,
    lineHeight: 21,

    textAlign: "center",
  },

  // =========================================================
  // RETRY BUTTON
  // =========================================================

  retryButton: {
    marginTop: 20,

    backgroundColor: "#2196F3",

    paddingHorizontal: 28,
    paddingVertical: 12,

    borderRadius: 11,
  },

  retryButtonText: {
    color: "#FFFFFF",

    fontSize: 15,
    fontWeight: "700",
  },
});