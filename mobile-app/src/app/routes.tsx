import React, { useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  FlatList,
  BackHandler,
  StatusBar,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { getAssignedRoutes, startTrip } from "../services/mobile.service";

import * as Location from "expo-location";

import {
  updateLocation,
} from "../services/location.service";

// --- reusable "press to scale" wrapper for a smoother native feel ---
function PressableScale({
  onPress,
  disabled,
  style,
  children,
  scaleTo = 0.97,
}: {
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
  children: React.ReactNode;
  scaleTo?: number;
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
      disabled={disabled}
      onPressIn={() => !disabled && animateTo(scaleTo)}
      onPressOut={() => !disabled && animateTo(1)}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function RoutesScreen() {
  const { tripCompleted } = useLocalSearchParams();
  const [routes, setRoutes] = React.useState<any[]>([]);
  const [busNumber, setBusNumber] = React.useState("");
  const insets = useSafeAreaInsets();

  // guards against overlapping fetches (mount-interval + focus firing close together)
  const isFetchingRef = useRef(false);

  // Active routes first, then Pending, then Completed. Stable within each
  // group — doesn't reorder routes that already share the same status.
  const STATUS_ORDER: Record<string, number> = {
    ACTIVE: 0,
    PENDING: 1,
    COMPLETED: 2,
  };

  const sortedRoutes = useMemo(() => {
    return [...routes].sort(
      (a, b) =>
        (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3)
    );
  }, [routes]);

  const loadRoutes = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const data = await getAssignedRoutes();

      if (!data.success) return;

      // Weekly Off
      if (data.weeklyOff) {
        router.replace({
          pathname: "/day-status",
          params: {
            type: "weeklyOff",
            title: data.day,
            message: data.message,
          },
        });
        return;
      }

      // Holiday
      if (data.holiday) {
        router.replace({
          pathname: "/day-status",
          params: {
            type: "holiday",
            title: data.holidayName,
            message: data.message,
          },
        });
        return;
      }

      // Normal Routes
      setRoutes(data.routes);
      setBusNumber(data.busNumber);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // single effect owns: focus-triggered load, 30s polling, and the back handler
  useFocusEffect(
    useCallback(() => {
      loadRoutes();

      const interval = setInterval(() => {
        loadRoutes();
      }, 30000);

      const onBackPress = () => {
        router.replace("/driver-dashboard");
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
    }, [loadRoutes])
  );

  const startLocationTracking = async (busId: any) => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 20,
      },
      async (location) => {
        try {
          await updateLocation(
            busId,
            location.coords.latitude,
            location.coords.longitude
          );
        } catch (error) {
          console.log("Location Update Error:", error);
        }
      }
    );
  };

  const handleRoutePress = async (item: any) => {
    if (item.status !== "ACTIVE") return;
    try {
      const data = await startTrip(item.tripType, item._id);

      if (data.success) {
        await startLocationTracking(data.trip.busId);

        router.push({
          pathname: "/students",
          params: {
            tripId: data.trip._id,
          },
        });
      }
    } catch (error) {
      console.log("START TRIP ERROR:", error);
      Alert.alert("Error", "Failed to start trip");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      {/* Header — spacer now matches the back button width so the title is truly centered */}
      <View style={styles.headerContainer}>
        <PressableScale
          style={styles.backButtonCircle}
          onPress={() => router.replace("/driver-dashboard")}
        >
          <Text style={styles.backArrowText}>←</Text>
        </PressableScale>
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
        data={sortedRoutes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={8}
        windowSize={7}
        initialNumToRender={8}
        renderItem={({ item }) => (
          <PressableScale
            style={[
              styles.routeCard,
              item.status === "ACTIVE" && styles.cardActive,
              item.status === "PENDING" && styles.cardPending,
              item.status === "COMPLETED" && styles.cardCompleted,
            ]}
            disabled={item.status !== "ACTIVE"}
            scaleTo={0.98}
            onPress={() => handleRoutePress(item)}
          >
            {/* Top Row: Route Name & Trip Type Chip */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.routeNameWrap}>
                <Text
                  style={styles.routeText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.routeName}
                </Text>

                <View style={styles.timeChip}>
                  <Text style={styles.timeChipText}>
                    🕒{" "}
                    {new Date(
                      `2000-01-01T${item.scheduledTime}`
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </View>
              </View>

              <View style={styles.tripTypeBadge}>
                <Text style={styles.tripTypeBadgeText} numberOfLines={1}>
                  {item.tripType}
                </Text>
              </View>
            </View>

            {/* Middle Row: Status Indicator & Timer Details */}
            <View style={styles.cardStatusRow}>
              <View style={styles.statusGroup}>
                <View
                  style={[
                    styles.statusIndicatorDot,
                    item.status === "ACTIVE" && styles.dotActive,
                    item.status === "PENDING" && styles.dotPending,
                    item.status === "COMPLETED" && styles.dotCompleted,
                  ]}
                />
                <Text
                  style={[
                    styles.statusLabelText,
                    item.status === "ACTIVE" && styles.textActiveContrast,
                    item.status === "PENDING" && styles.textPendingContrast,
                    item.status === "COMPLETED" && styles.textCompletedContrast,
                  ]}
                >
                  {item.status === "ACTIVE"
                    ? "Active"
                    : item.status === "COMPLETED"
                    ? "Completed"
                    : "Pending"}
                </Text>
              </View>

              {item.status !== "COMPLETED" && (
                <Text
                  style={[
                    styles.timeText,
                    item.status === "ACTIVE" && styles.textActiveContrast,
                    item.status === "PENDING" && styles.textPendingContrast,
                  ]}
                >
                  {item.status === "PENDING"
                    ? item.minutesLeft >= 60
                      ? `⏱ ${Math.floor(item.minutesLeft / 60)}h ${
                          item.minutesLeft % 60
                        }m`
                      : `⏱ ${item.minutesLeft} min`
                    : item.status === "ACTIVE"
                    ? "🚌 Ready"
                    : ""}
                </Text>
              )}
            </View>

            {/* Bottom Row: Path Representation */}
            <View
              style={[
                styles.dividerLine,
                item.status === "ACTIVE" && styles.dividerActive,
                item.status === "PENDING" && styles.dividerPending,
                item.status === "COMPLETED" && styles.dividerCompleted,
              ]}
            />

            <Text
              style={[
                styles.routeInfo,
                item.status === "ACTIVE" && styles.textActiveContrastMuted,
                item.status === "PENDING" && styles.textPendingContrastMuted,
                item.status === "COMPLETED" && styles.textCompletedContrastMuted,
              ]}
            >
              {item.routePath}
            </Text>
          </PressableScale>
        )}
      />
    </View>
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
    marginTop: 10,
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 54, // now matches backButtonCircle width so the title is truly centered
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
  routeNameWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    flexShrink: 1,
    marginRight: 8,
  },
  routeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  timeChip: {
    marginLeft: 8,
    backgroundColor: "#ffffff22",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  timeChipText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  tripTypeBadge: {
    backgroundColor: "#ffffff22",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 10,
    flexShrink: 0,
  },
  tripTypeBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
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
