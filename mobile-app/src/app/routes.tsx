import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  BackHandler,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { getAssignedRoutes, startTrip } from "../services/mobile.service";

import * as Location from "expo-location";

import {
  updateLocation,
} from "../services/location.service";

export default function RoutesScreen() {
  const { tripCompleted } = useLocalSearchParams();
  const [routes, setRoutes] = useState<any[]>([]);
  const [busNumber, setBusNumber] = useState("");

  useEffect(() => {
    loadRoutes();
    const interval = setInterval(() => {
      loadRoutes();
    }, 30000); // every 30 sec

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadRoutes();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/driver-dashboard");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );


  const startLocationTracking =
async (busId:any) => {

  console.log(
    "GPS Function Called"
  );

  const { status } =
    await Location.requestForegroundPermissionsAsync();

  console.log(
    "Permission Status:",
    status
  );

  if (
    status !== "granted"
  ) {
    return;
  }

  await Location.watchPositionAsync(
    {
      accuracy:
        Location.Accuracy.High,

      timeInterval: 10000,

      distanceInterval: 20,
    },

    async (location) => {

      console.log(
        "GPS Coordinates:",
        location.coords.latitude,
        location.coords.longitude
      );

      try {

        const response =
          await updateLocation(
            busId,
            location.coords.latitude,
            location.coords.longitude
          );

        console.log(
          "Location API Response:",
          response
        );

      } catch (error) {

        console.log(
          "Location Update Error:",
          error
        );

      }

    }
  );

};

  const loadRoutes = async () => {

  const data = await getAssignedRoutes();

  console.log("Assigned Routes API:", data);

  if (!data.success) return;

  // Holiday Check
 if (data.holiday) {

  router.replace({

    pathname: "/holiday",

    params: {

      holidayName: data.holidayName,

      message: data.message,

    },

  });

  return;

}

  setRoutes(data.routes);
  setBusNumber(data.busNumber);
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      
      {/* Redesigned Header Layout with explicit alignment */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButtonCircle}
          onPress={() => router.replace("/driver-dashboard")}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Assigned Routes</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Bus Number Pill Indicator */}
      <View style={styles.busBadgeContainer}>
        <View style={styles.busIndicatorDot} />
        <Text style={styles.busText}>
           <Text style={styles.busNumberValue}>{busNumber}</Text>
        </Text>
      </View>

      <FlatList
        data={routes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.routeCard,
              item.status === "ACTIVE" && styles.cardActive,
              item.status === "PENDING" && styles.cardPending,
              item.status === "COMPLETED" && styles.cardCompleted,
            ]}
            disabled={item.status !== "ACTIVE"}
            activeOpacity={0.9}
            onPress={async () => {
              if (item.status !== "ACTIVE") return;
              try {
                console.log("CLICKED ITEM:", item);
                console.log("TRIP TYPE:", item.tripType);
                console.log("ROUTE ID:", item._id);

                const data = await startTrip(item.tripType, item._id);
                console.log("START TRIP RESPONSE:", data);

                if (data.success) {

  console.log(
    "TRIP STARTED"
  );

  console.log(
    "BUS ID:",
    data.trip.busId
  );

  await startLocationTracking(
    data.trip.busId
  );

  router.push({
    pathname: "/students",
    params: {
      tripId:
        data.trip._id,
    },
  });

}
              } catch (error) {
                console.log("START TRIP ERROR:", error);
              }
            }}
          >
            {/* Top Row: Route Name & Trip Type Chip */}

            
          <View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  {/* Route Name + Time */}
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    }}
  >
    <Text style={styles.routeText}>
      {item.routeName}
    </Text>

    <View
      style={{
        marginLeft: 8,
        backgroundColor: "#ffffff22",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 11,
          fontWeight: "bold",
        }}
      >
        🕒 {new Date(
          `2000-01-01T${item.scheduledTime}`
        ).toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }
        )}
      </Text>
    </View>
  </View>

  {/* Trip Type Badge */}
  <View
    style={{
      backgroundColor: "#ffffff22",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      marginLeft: 10,
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
      }}
    >
      {item.tripType}
    </Text>
  </View>
</View>


            {/* Middle Row: Status Indicator & Timer Details */}
            <View style={styles.cardStatusRow}>
              <View style={styles.statusGroup}>
                <View style={[
                  styles.statusIndicatorDot,
                  item.status === "ACTIVE" && styles.dotActive,
                  item.status === "PENDING" && styles.dotPending,
                  item.status === "COMPLETED" && styles.dotCompleted,
                ]} />
                <Text style={[
                  styles.statusLabelText,
                  item.status === "ACTIVE" && styles.textActiveContrast,
                  item.status === "PENDING" && styles.textPendingContrast,
                  item.status === "COMPLETED" && styles.textCompletedContrast,
                ]}>
                  {item.status === "ACTIVE"
                    ? "Active"
                    : item.status === "COMPLETED"
                    ? "Completed"
                    : "Pending"}
                </Text>
              </View>

              {item.status !== "COMPLETED" && (
                <Text style={[
                  styles.timeText,
                  item.status === "ACTIVE" && styles.textActiveContrast,
                  item.status === "PENDING" && styles.textPendingContrast
                ]}>
                  {item.status === "PENDING"
                    ? item.minutesLeft >= 60
                      ? `⏱ ${Math.floor(item.minutesLeft / 60)}h ${item.minutesLeft % 60}m`
                      : `⏱ ${item.minutesLeft} min`
                    : item.status === "ACTIVE"
                    ? "🚌 Ready"
                    : ""}
                </Text>
              )}
            </View>

            {/* Bottom Row: Path Representation */}
            <View style={[
              styles.dividerLine,
              item.status === "ACTIVE" && styles.dividerActive,
              item.status === "PENDING" && styles.dividerPending,
              item.status === "COMPLETED" && styles.dividerCompleted,
            ]} />
            
            <Text style={[
              styles.routeInfo,
              item.status === "ACTIVE" && styles.textActiveContrastMuted,
              item.status === "PENDING" && styles.textPendingContrastMuted,
              item.status === "COMPLETED" && styles.textCompletedContrastMuted,
            ]}>
              {item.routePath}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
  },
  listContentContainer: {
    paddingBottom: 24,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === "ios" ? 10 : 30, 
    marginBottom: 20,
    height: 58,
  },
  backButtonCircle: {
    width: 54,
    height: 44,
    borderRadius: 27,
    backgroundColor: "#2D2D2D",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrowText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    ...Platform.select({
      ios: { paddingBottom: 2 },
      android: { paddingBottom: 4 },
    }),
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 44, // Perfectly balances the layout against the back button size
  },
  busBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#2D2D2D",
    borderColor: "#3D3D3D",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  busIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 8,
  },
  busText: {
    fontSize: 14,
    color: "#A0AEC0",
    fontWeight: "500",
  },
  busNumberValue: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  routeCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cardActive: {
    backgroundColor: "#15803D",
    borderColor: "#166534",
    borderWidth: 1,
  },
  cardPending: {
    backgroundColor: "#2D2D2D",
    borderColor: "#3D3D3D",
    borderWidth: 1,
  },
  cardCompleted: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1E40AF",
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
  tripTypeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipDefaultBg: {
    backgroundColor: "#3D3D3D",
  },
  chipActiveBg: {
    backgroundColor: "#166534",
  },
  tripTypeText: {
    color: "#E2E8F0",
    fontWeight: "bold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  cardStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  statusGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicatorDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: 6,
  },
  dotActive: { backgroundColor: "#FFFFFF" },
  dotPending: { backgroundColor: "#F59E0B" },
  dotCompleted: { backgroundColor: "#93C5FD" },
  statusLabelText: {
    fontSize: 14,
    fontWeight: "700",
  },
  timeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  textActiveContrast: { color: "#FFFFFF" },
  textPendingContrast: { color: "#F59E0B" },
  textCompletedContrast: { color: "#93C5FD" },
  dividerLine: {
    height: 1,
    marginTop: 14,
    marginBottom: 10,
  },
  dividerActive: { backgroundColor: "#166534" },
  dividerPending: { backgroundColor: "#3D3D3D" },
  dividerCompleted: { backgroundColor: "#1E40AF" },
  routeInfo: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
  },
  textActiveContrastMuted: { color: "#E2E8F0" },
  textPendingContrastMuted: { color: "#A0AEC0" },
  textCompletedContrastMuted: { color: "#E2E8F0" },
});