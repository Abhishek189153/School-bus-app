import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";

import { router } from "expo-router";

import {
  getMyBusLocation,
} from "../services/mobile.service";

export default function BusLocation() {

  const [location, setLocation] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadLocation();

    const interval =
      setInterval(
        loadLocation,
        10000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  const loadLocation =
    async () => {

      try {

        const data =
          await getMyBusLocation();

        if (
          data.success &&
          data.location
        ) {

          setLocation(
            data.location
          );

        }

      } catch (error) {

        console.log(
          "Location Error:",
          error
        );

      } finally {

        setLoading(
          false
        );

      }

    };

  const openMap =
    async () => {

      if (!location) {

        Alert.alert(
          "Location Unavailable",
          "Bus location is not available right now."
        );

        return;

      }

      const url =
        `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

      const supported =
        await Linking.canOpenURL(
          url
        );

      if (supported) {

        Linking.openURL(
          url
        );

      } else {

        Alert.alert(
          "Error",
          "Unable to open Google Maps."
        );

      }

    };

  return (

    <View
      style={
        styles.container
      }
    >

      <TouchableOpacity
        onPress={() =>
          router.replace(
            "/parent-dashboard"
          )
        }
        style={
          styles.backBtn
        }
      >

        <Text
          style={
            styles.backText
          }
        >
          ← Back
        </Text>

      </TouchableOpacity>

      <Text
        style={
          styles.title
        }
      >
        Live Bus Tracking
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Stay updated with your
        child's transportation.
      </Text>

      <View
        style={
          styles.card
        }
      >

        <Text
          style={
            styles.busIcon
          }
        >
          🚌
        </Text>

        {loading ? (

          <Text
            style={
              styles.loadingText
            }
          >
            Fetching Bus Location...
          </Text>

        ) : location ? (

          <>

            <Text
              style={
                styles.cardTitle
              }
            >
              Bus Location Available
            </Text>

            <Text
              style={
                styles.coordinateText
              }
            >
              Latitude:
              {" "}
              {
                location.latitude
              }
            </Text>

            <Text
              style={
                styles.coordinateText
              }
            >
              Longitude:
              {" "}
              {
                location.longitude
              }
            </Text>

            <Text
              style={
                styles.cardSubtitle
              }
            >
              Tap below to open
              Google Maps and
              track the live bus.
            </Text>

            <TouchableOpacity
              onPress={
                openMap
              }
              style={
                styles.trackButton
              }
            >

              <Text
                style={
                  styles.trackText
                }
              >
                Track Bus
              </Text>

            </TouchableOpacity>

          </>

        ) : (

          <Text
            style={
              styles.loadingText
            }
          >
            Bus location is
            currently unavailable.
          </Text>

        )}

      </View>

    </View>

  );

}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        "#F5F7FB",
      paddingHorizontal: 20,
      paddingTop: 90,
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      color: "#1E293B",
    },

    subtitle: {
      textAlign: "center",
      color: "#64748B",
      marginTop: 10,
      marginBottom: 40,
      fontSize: 15,
      lineHeight: 22,
    },

    card: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 24,
      padding: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 6,
    },

    busIcon: {
      fontSize: 70,
      marginBottom: 20,
    },

    cardTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: "#1E293B",
      marginBottom: 20,
    },

    coordinateText: {
      fontSize: 15,
      color: "#475569",
      marginBottom: 8,
    },

    cardSubtitle: {
      textAlign: "center",
      color: "#64748B",
      lineHeight: 24,
      fontSize: 15,
      marginTop: 20,
      marginBottom: 30,
    },

    loadingText: {
      fontSize: 16,
      color: "#64748B",
      textAlign: "center",
    },

    trackButton: {
      backgroundColor:
        "#1976D2",
      paddingHorizontal: 35,
      paddingVertical: 14,
      borderRadius: 14,
      elevation: 4,
    },

    trackText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },

    backBtn: {
      position: "absolute",
      top: 40,
      left: 20,
      zIndex: 100,
      backgroundColor:
        "#FFFFFF",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },

    backText: {
      color: "#1976D2",
      fontSize: 16,
      fontWeight: "600",
    },

  });