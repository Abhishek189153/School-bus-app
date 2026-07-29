import React, {
  useEffect,
  useState,
  useRef
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  Image,
  Animated
} from "react-native";

import {
  stopLocationTracking,
} from "../services/locationTracker";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";

import { Ionicons } from '@expo/vector-icons';

import {
  getDriverDashboard,
  getAssignedRoutes,
  startTrip,
  endTrip,
} from "../services/mobile.service";

export default function DriverDashboard() {

  useFocusEffect(
    React.useCallback(() => {

       loadDashboard();

    const interval =
      setInterval(() => {

        loadDashboard();

      }, 30000);
    
      const onBackPress = () => {
        router.replace("/");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  const [loading, setLoading] = useState(true);
  const [bus, setBus] = useState<any>(null);

  const { routeId, routeName } = useLocalSearchParams();

  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [activeRoutesCount, setActiveRoutesCount] = useState(0);

  const greetingOpacity = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;

  const pulseAnim =
  React.useRef(
    new Animated.Value(1)
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(greetingOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(nameOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {

  if (!activeTrip) return;

  Animated.loop(

    Animated.sequence([

      Animated.timing(
        pulseAnim,
        {
          toValue: 1.05,
          duration: 700,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        pulseAnim,
        {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }
      ),

    ])

  ).start();

}, [activeTrip]);

  const loadDashboard = async () => {
    try {
      const data = await getDriverDashboard();
      const routesData = await getAssignedRoutes();
      

    if (data.success) {

  setBus(data.bus);

  setActiveTrip(
    data.activeTrip
  );

}

if (
  routesData.success
) {

  const activeCount =
    routesData.routes.filter(
      (route: any) =>
        route.status ===
        "ACTIVE"
    ).length;

  setActiveRoutesCount(
    activeCount
  );

}


    } catch (error) {
      Alert.alert("Error", "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadDashboard();
    }, [])
  );

  // const handleDutyOn = async () => {
  //   const data = await dutyOn();
  //   if (data.success || data.message === "Already On Duty") {
  //     setOnDuty(true);
  //     router.push("/routes");
  //   } else {
  //     Alert.alert("Error", data.message);
  //   }
  // };

  // const handleDutyOff = async () => {
  //   const data = await dutyOff();
  //   if (data.success) {
  //     setOnDuty(false);
  //     Alert.alert("Success", "Duty Off");
  //   }
  // };

  const handleStartTrip = async (tripType: string) => {
    try {
      const data = await startTrip(tripType, routeId);
      if (data.success) {
        Alert.alert("Success", `${tripType} Trip Started`);
        setActiveTrip(data.trip);

        router.push({
          pathname: "/students" as any,
          params: {
            tripId: data.trip._id,
          },
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to start trip");
    }
  };

  const handleEndTrip = async () => {
    try {
      const data = await endTrip(activeTrip._id);
      if (data.success) {
        stopLocationTracking();
        Alert.alert("Success", "Trip Completed");
        setActiveTrip(null);
        await loadDashboard();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to end trip");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header Hero Card */}
      <View style={styles.heroCard}>
        {/* Full size background image with full, rich color (no dull overlay) */}
        <Image
          source={require("../../assets/images/BusDriver.png")}
          style={styles.heroBgImage}
          resizeMode="cover"
        />

         {/* Bus Number */}
  <View style={styles.busBadge}>
    <Text style={styles.busBadgeText}>
      {bus?.busNumber || "BUS-3"}
    </Text>
  </View>

  {/* Vehicle Number */}
  <View style={styles.vehicleBadge}>
    <Text style={styles.vehicleBadgeText}>
      {bus?.vehicleNumber || "UK07 AB 1414"}
    </Text>
  </View>

        {/* Content stacked directly over the image */}
        <View style={styles.heroOverlayContainer}>
          {/* Text Over the Image */}
          <View style={styles.overlayTextContent}>
            <Animated.Text style={[styles.greeting, { opacity: greetingOpacity }]}>
              Hello,
            </Animated.Text>
            <Animated.Text style={[styles.driverName, { opacity: nameOpacity }]}>
              {bus?.driverId?.name || "Driver"}
            </Animated.Text>
            <Text style={styles.safeTrip}>Have a safe trip!</Text>
          </View>
        </View>
      </View>

      {/* Main Content Body */}
      <View style={styles.bodyContent}>
        {/* Stats Section Cards */}
        <View style={styles.statsContainer}>
          {/* Duty Status Card */}
          <View style={[styles.statCard, { backgroundColor: "#EDF5FF" }]}>
            <View style={[styles.badgeIconBg, { backgroundColor: "#D1E5FF" }]}>
              <Text style={styles.badgeIconSymbol}>🛡️</Text>
            </View>
            <Text style={styles.statNumber}>{activeTrip ? "ON" : "OFF"}</Text>
            <Text style={styles.statLabel}>Duty Status</Text>
            
            <View style={styles.subPillBlue}>
              <Text style={styles.subPillBlueText}>🕒 Since 10:30 PM</Text>
            </View>
          </View>

          {/* Active Trip Card */}
          <View style={[styles.statCard, { backgroundColor: "#F2F9F3" }]}>
            <View style={[styles.badgeIconBg, { backgroundColor: "#DCEFDD" }]}>
              <Text style={styles.badgeIconSymbol}>🚌</Text>
            </View>
            <Text style={[styles.statNumber, { color: "#16A34A" }]}>
             {activeRoutesCount.toString()}
            </Text>
            <Text style={styles.statLabel}>Active Trip</Text>

            {/* <View style={styles.subPillGreen}>
  <Text style={styles.subPillGreenText}>
    {activeRoutesCount > 0
      ? `🟢 ${activeRoutesCount} Active Route${activeRoutesCount > 1 ? "s" : ""}`
      : "📍 No active route"}
  </Text>
</View> */}

<Text
  style={{
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: activeTrip ? "#16A34A" : "#6B7280",
  }}
>
  {activeTrip
    ? "🚌 1 Ongoing Trip"
    : "🚌 0 Ongoing Trips"}
</Text>
          </View>
        </View>

        {/* Action Button */}

{!activeTrip ? (

<TouchableOpacity
    style={[
        styles.pickupBtn,
        {
            backgroundColor: "#1565C0",
        },
    ]}
    onPress={() => router.replace("/routes")}
>

    <View style={styles.actionTextContainer}>
        <Text style={styles.btnText}>
            VIEW ROUTES
        </Text>

        <Text style={styles.dutySubText}>
            Select a route to begin your trip
        </Text>
    </View>

    <Text style={styles.chevronRight}>
        ❯
    </Text>

</TouchableOpacity>

) : (
       
 <Animated.View
  style={{
    transform: [
      {
        scale: pulseAnim,
      },
    ],
  }}
>
  <TouchableOpacity
    style={[
      styles.pickupBtn,
      {
        backgroundColor: "#1565C0",
        borderWidth: 3,
        borderColor: "#1565C0",
      },
    ]}
    onPress={() =>
      router.replace("/routes")
    }
  >
    <View
      style={
        styles.actionTextContainer
      }
    >
      <Text
        style={styles.btnText}
      >
        🚌 CONTINUE ROUTE
      </Text>

      <Text
        style={
          styles.dutySubText
        }
      >
         ⚠ Trip in progress - complete attendances
      </Text>
    </View>

   <Text
  style={
    styles.chevronRight
  }
>
  ❯
</Text>

</TouchableOpacity>

</Animated.View>
)
        }

        {/* Trip History Navigation Card Row */}
        <TouchableOpacity
          style={styles.listCardRow}
          onPress={() => router.push("/trip-history")}
        >
          <View style={[styles.rowIconBg, { backgroundColor: "#8B5CF6" }]}>
            <Text style={styles.rowIconSymbol}>📄</Text>
          </View>
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowTitle}>Trip History</Text>
            <Text style={styles.rowSubTitle}>View your past trips and details</Text>
          </View>
          <Text style={styles.chevronRightGrey}>❯</Text>
        </TouchableOpacity>

       {/* Duty Off only when NO active trip */}
{/* {onDuty && !activeTrip && (
  <TouchableOpacity
    style={[
      styles.listCardRow,
      { marginTop: 15 },
    ]}
    onPress={handleDutyOff}
  >
    <View
      style={[
        styles.rowIconBg,
        {
          backgroundColor:
            "#EF4444",
        },
      ]}
    >
      <Text
        style={
          styles.rowIconSymbol
        }
      >
        ⏼
      </Text>
    </View>

    <View
      style={
        styles.rowTextContainer
      }
    >
      <Text
        style={[
          styles.rowTitle,
          {
            color:
              "#EF4444",
          },
        ]}
      >
        DUTY OFF
      </Text>

      <Text
        style={
          styles.rowSubTitle
        }
      >
        End your driving
        session
      </Text>
    </View>

    <Text
      style={
        styles.chevronRightGrey
      }
    >
      ❯
    </Text>

  </TouchableOpacity>
)} */}

       {/* Logout Card Row */}
<TouchableOpacity style={[styles.listCardRow, { marginTop: 15, marginBottom: 40 }]} onPress={() =>
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: handleLogout,
      },
    ]
  )
}>
  <View style={[styles.rowIconBg, { backgroundColor: "#EF4444" }]}> 
    {/* Clean, working vector logout icon */}
    <Ionicons name="log-out" size={22} color="#FFFFFF" />
  </View>
  <View style={styles.rowTextContainer}>
    <Text style={styles.rowTitle}>Logout</Text>
    <Text style={styles.rowSubTitle}>Sign out from your account</Text>
  </View>
  {/* Replaced the text chevron with a perfect vector arrow */}
  <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
</TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyContent: {
    paddingHorizontal: 20,
    marginTop: -25,
  },
  heroCard: {
    backgroundColor: "#0B66D3",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    height: 250, 
    overflow: "hidden",
    position: "relative",
  },
  heroBgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  heroOverlayContainer: {
    flex: 1,
    justifyContent: "flex-end", // Aligns overlay content to the bottom of the header card
    paddingBottom: 40,
  },
  overlayTextContent: {
    paddingHorizontal: 24,
    alignItems: "flex-end", // Positions text to lay on the side over the background bus graphic
    justifyContent: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "400",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.55)", // Deep drop shadow so white text is highly legible over the colorful background
    textShadowOffset: { width: 1, height: 1.5 },
    textShadowRadius: 4,
  },
  driverName: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 2,
    textShadowColor: "rgba(0, 0, 0, 0.55)",
    textShadowOffset: { width: 1, height: 1.5 },
    textShadowRadius: 4,
  },
  safeTrip: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 4,
    opacity: 0.95,
    textShadowColor: "rgba(0, 0, 0, 0.55)",
    textShadowOffset: { width: 1, height: 1.5 },
    textShadowRadius: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 0.48,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EBF2FA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  badgeIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  badgeIconSymbol: {
    fontSize: 24,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B66D3",
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 10,
  },
  subPillBlue: {
    backgroundColor: "#D6E8FF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  subPillBlueText: {
    color: "#0B66D3",
    fontSize: 11,
    fontWeight: "700",
  },
  subPillGreen: {
    backgroundColor: "#E2F3E4",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  subPillGreenText: {
    color: "#16A34A",
    fontSize: 11,
    fontWeight: "700",
  },
  pickupBtn: {
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconContainer: {
    backgroundColor: "#FFFFFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  powerIcon: {
    color: "#16A34A",
    fontSize: 22,
    fontWeight: "bold",
  },
  actionTextContainer: {
    flex: 1,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  dutySubText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    marginTop: 2,
  },
  chevronRight: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    opacity: 0.9,
  },
  activeTripCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeTripText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  activeTripSubText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  endBtn: {
    backgroundColor: "#EF4444",
    padding: 18,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  listCardRow: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F0F2F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  rowIconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  rowIconSymbol: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  rowSubTitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 3,
  },
  chevronRightGrey: {
    color: "#D1D5DB",
    fontSize: 16,
    fontWeight: "bold",
  },

  busBadge: {
  position: "absolute",
  top: 63,
  left: 10,
 

  backgroundColor: "#1F2937",

  paddingHorizontal: 14,
  paddingVertical: 6,

  borderRadius: 2,

  zIndex: 999,
},

busBadgeText: {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "bold",
},

vehicleBadge: {
  position: "absolute",

  
  left: 260,
  top: 33,

  backgroundColor: "#FFFFFF",

  paddingHorizontal: 14,
  paddingVertical: 6,

  borderRadius: 2,

  zIndex: 999,
},

vehicleBadgeText: {
  color: "#111827",
  fontSize: 13,
  fontWeight: "bold",
},
});