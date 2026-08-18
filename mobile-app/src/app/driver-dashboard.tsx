import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  Image,
  Animated,
  useWindowDimensions,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  stopLocationTracking,
} from "../services/locationTracker";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import {
  getDriverDashboard,
  getAssignedRoutes,
  startTrip,
  endTrip,
} from "../services/mobile.service";

// --- small reusable "press to scale" wrapper for a smoother native feel ---
function PressableScale({
  onPress,
  style,
  children,
  scaleTo = 0.97,
  hitSlop,
}: {
  onPress?: () => void;
  style?: any;
  children: React.ReactNode;
  scaleTo?: number;
  hitSlop?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateTo(scaleTo)}
      onPressOut={() => animateTo(1)}
      hitSlop={hitSlop}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function DriverDashboard() {
  const { routeId, routeName } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [bus, setBus] = useState<any>(null);
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [activeRoutesCount, setActiveRoutesCount] = useState(0);

  // guards against overlapping fetches (focus + interval firing close together)
  const isFetchingRef = useRef(false);

  const greetingOpacity = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, [activeTrip]);

  const loadDashboard = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const [data, routesData] = await Promise.all([
        getDriverDashboard(),
        getAssignedRoutes(),
      ]);

      if (data.success) {
        setBus(data.bus);
        setActiveTrip(data.activeTrip);
      }

      if (routesData.success) {
        const activeCount = routesData.routes.filter(
          (route: any) => route.status === "ACTIVE"
        ).length;
        setActiveRoutesCount(activeCount);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load dashboard");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // single source of truth for focus + polling (previously this ran twice per focus)
  useFocusEffect(
    useCallback(() => {
      loadDashboard();

      const interval = setInterval(() => {
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

      return () => {
        clearInterval(interval);
        subscription.remove();
      };
    }, [loadDashboard])
  );

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

  // Hero height scales with screen height instead of a fixed 250px,
  // clamped so it never gets too short (small phones) or too tall (tablets/large phones).
  const heroHeight = Math.min(Math.max(height * 0.3, 220), 300);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header Hero Card */}
      <View style={[styles.heroCard, { height: heroHeight }]}>
        <Image
          source={require("../../assets/images/BusDriver.png")}
          style={styles.heroBgImage}
          resizeMode="cover"
        />

        {/* Badges now sit in a flex row under the status bar instead of hardcoded
            absolute coordinates, so they line up correctly on any screen width */}
        <View
          style={[
            styles.badgeRow,
            { top: insets.top + 18, paddingHorizontal: 16, left: 0, right: 0, paddingLeft: 4, paddingRight: 16 },
          ]}
        >
          <View style={styles.busBadge}>
            <Text style={styles.busBadgeText}>{bus?.busNumber || "BUS-3"}</Text>
          </View>

          <View style={styles.vehicleBadge}>
            <Text style={styles.vehicleBadgeText}>
              {bus?.vehicleNumber || "UK07 AB 1414"}
            </Text>
          </View>
        </View>

        <View style={styles.heroOverlayContainer}>
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

          <View style={[styles.statCard, { backgroundColor: "#F2F9F3" }]}>
            <View style={[styles.badgeIconBg, { backgroundColor: "#DCEFDD" }]}>
              <Text style={styles.badgeIconSymbol}>🚌</Text>
            </View>
            <Text style={[styles.statNumber, { color: "#16A34A" }]}>
              {activeRoutesCount.toString()}
            </Text>
            <Text style={styles.statLabel}>Active Trip</Text>

            <Text
              style={{
                marginTop: 8,
                fontSize: 12,
                fontWeight: "600",
                color: activeTrip ? "#16A34A" : "#6B7280",
              }}
            >
              {activeTrip ? "🚌 1 Ongoing Trip" : "🚌 0 Ongoing Trips"}
            </Text>
          </View>
        </View>

        {/* Action Button — now a spring-scale press for a smoother feel */}
        {!activeTrip ? (
          <PressableScale
            style={[styles.pickupBtn, { backgroundColor: "#1565C0" }]}
            onPress={() => router.replace("/routes")}
          >
            <View style={styles.actionTextContainer}>
              <Text style={styles.btnText}>VIEW ROUTES</Text>
              <Text style={styles.dutySubText}>
                Select a route to begin your trip
              </Text>
            </View>
            <Text style={styles.chevronRight}>❯</Text>
          </PressableScale>
        ) : (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <PressableScale
              style={[
                styles.pickupBtn,
                {
                  backgroundColor: "#1565C0",
                  borderWidth: 3,
                  borderColor: "#1565C0",
                },
              ]}
              onPress={() => router.replace("/routes")}
            >
              <View style={styles.actionTextContainer}>
                <Text style={styles.btnText}>🚌 CONTINUE ROUTE</Text>
                <Text style={styles.dutySubText}>
                  ⚠ Trip in progress - complete attendances
                </Text>
              </View>
              <Text style={styles.chevronRight}>❯</Text>
            </PressableScale>
          </Animated.View>
        )}

        {/* Trip History Navigation Card Row */}
        <PressableScale
          style={styles.listCardRow}
          onPress={() => router.push("/trip-history")}
          hitSlop={8}
        >
          <View style={[styles.rowIconBg, { backgroundColor: "#8B5CF6" }]}>
            <Text style={styles.rowIconSymbol}>📄</Text>
          </View>
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowTitle}>Trip History</Text>
            <Text style={styles.rowSubTitle}>View your past trips and details</Text>
          </View>
          <Text style={styles.chevronRightGrey}>❯</Text>
        </PressableScale>

        {/* Logout Card Row */}
        <PressableScale
          style={[styles.listCardRow, { marginTop: 15, marginBottom: 40 }]}
          hitSlop={8}
          onPress={() =>
            Alert.alert(
              "Logout",
              "Are you sure you want to logout?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Logout",
                  style: "destructive",
                  onPress: handleLogout,
                },
              ]
            )
          }
        >
          <View style={[styles.rowIconBg, { backgroundColor: "#EF4444" }]}>
            <Ionicons name="log-out" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowTitle}>Logout</Text>
            <Text style={styles.rowSubTitle}>Sign out from your account</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
        </PressableScale>
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
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
  overlayTextContent: {
    paddingHorizontal: 24,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "400",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.55)",
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
  badgeRow: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 999,
  },
  busBadge: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  busBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  vehicleBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  vehicleBadgeText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "bold",
  },
});
