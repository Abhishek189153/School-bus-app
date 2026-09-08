import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { stopLocationTracking } from "../services/locationTracker";
import { stopBackgroundTracking } from "../services/backgroundLocation";
import { getTripSummary, endTrip } from "../services/mobile.service";

export default function TripSummary() {
  const { tripId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [selectedList, setSelectedList] = useState<"BOARDED" | "ABSENT" | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const data = await getTripSummary(tripId);
    if (data.success) {
      setSummary(data);
    }
  };

  const handleEndTrip = async () => {
    if (ending) return;
    Alert.alert("End Trip", "Are you sure you want to end this trip?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Trip",
        style: "destructive",
        onPress: async () => {
          try {
            setEnding(true);
            const data = await endTrip(tripId);
            if (data.success) {
              stopLocationTracking();
              await stopBackgroundTracking();

              router.replace({
                pathname: "/routes",
                params: {
                  tripCompleted: "true",
                },
              });
            } else {
              Alert.alert("Error", "Could not end the trip. Please try again.");
            }
          } finally {
            setEnding(false);
          }
        },
      },
    ]);
  };

  if (!summary) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading summary...</Text>
      </SafeAreaView>
    );
  }

  const boardedPct =
    summary.totalStudents > 0
      ? Math.round((summary.totalBoarded / summary.totalStudents) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButtonCircle}
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Trip Summary</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingBottom: 110 + insets.bottom },
        ]}
      >
        {/* Trip Meta Card */}
        <View style={styles.card}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Driver</Text>
            <Text style={styles.metaValue}>{summary.driverName}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Bus Number</Text>
            <Text style={styles.metaValue}>{summary.busNumber}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Route Name</Text>
            <Text style={styles.metaValue}>{summary.routeName}</Text>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.metaRow}>
            <Text style={styles.totalLabel}>Total Students</Text>
            <Text style={styles.totalValue}>{summary.totalStudents}</Text>
          </View>

          {/* Progress bar for boarded ratio */}
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${boardedPct}%` }]}
            />
          </View>
          <Text style={styles.progressLabel}>{boardedPct}% boarded</Text>
        </View>

        {/* Selection Buttons */}
        <View style={styles.selectionGrid}>
          <TouchableOpacity
            style={[
              styles.listBtn,
              styles.btnBoardBg,
              selectedList === "BOARDED" && styles.listBtnSelected,
            ]}
            activeOpacity={0.8}
            onPress={() => setSelectedList(selectedList === "BOARDED" ? null : "BOARDED")}
          >
            <Text style={styles.btnCount}>{summary.totalBoarded}</Text>
            <Text style={styles.btnText}>Boarded</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.listBtn,
              styles.btnUnboardBg,
              selectedList === "ABSENT" && styles.listBtnSelected,
            ]}
            activeOpacity={0.8}
            onPress={() => setSelectedList(selectedList === "ABSENT" ? null : "ABSENT")}
          >
            <Text style={styles.btnCount}>{summary.absent}</Text>
            <Text style={styles.btnText}>Unboarded</Text>
          </TouchableOpacity>
        </View>

        {/* Sub-list */}
        {selectedList && (
          <View style={styles.subListContainer}>
            <Text style={styles.subListHeading}>
              {selectedList === "BOARDED" ? "Boarded Students" : "Unboarded Students"}
            </Text>

            {(selectedList === "BOARDED" ? summary.boardedStudents : summary.absentStudents).map(
              (student: any) => (
                <View key={student._id} style={styles.studentItemRow}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          selectedList === "BOARDED" ? "#22C55E" : "#EF4444",
                      },
                    ]}
                  />
                  <Text style={styles.studentNameText}>{student.name}</Text>
                </View>
              )
            )}

            {(selectedList === "BOARDED" ? summary.boardedStudents : summary.absentStudents)
              .length === 0 && (
              <Text style={styles.emptyText}>No students found in this state.</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer — padded for the device's gesture/nav bar so it never overlaps */}
      <View
        style={[
          styles.footerContainer,
          { paddingBottom: 16 + insets.bottom },
        ]}
      >
        <TouchableOpacity
          style={[styles.endBtn, ending && styles.endBtnDisabled]}
          activeOpacity={0.9}
          onPress={handleEndTrip}
          disabled={ending}
        >
          {ending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.endBtnText}>End Trip</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#141414",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#A0AEC0",
    fontSize: 15,
    fontWeight: "500",
  },
  scrollContentContainer: {
    paddingTop: 4,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === "ios" ? 8 : 24,
    marginBottom: 20,
    height: 48,
  },
  backButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#242424",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrowText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.2,
    marginTop: 8,
  },
  headerSpacer: {
    width: 44,
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderColor: "#2A2A2A",
    borderWidth: 1,
    padding: 20,
    borderRadius: 18,
    marginBottom: 18,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
  },
  metaLabel: {
    fontSize: 13.5,
    color: "#8A94A6",
    fontWeight: "500",
  },
  metaValue: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginVertical: 14,
  },
  totalLabel: {
    fontSize: 15.5,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 22,
    color: "#3B82F6",
    fontWeight: "800",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2A2A2A",
    marginTop: 14,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 3,
  },
  progressLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#8A94A6",
    fontWeight: "500",
    textAlign: "right",
  },
  selectionGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  listBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  listBtnSelected: {
    borderColor: "#FFFFFF",
  },
  btnBoardBg: {
    backgroundColor: "#14532D",
  },
  btnUnboardBg: {
    backgroundColor: "#7F1D1D",
  },
  btnCount: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 20,
    marginBottom: 2,
  },
  btnText: {
    color: "#E5E7EB",
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.3,
  },
  subListContainer: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    borderColor: "#262626",
    borderWidth: 1,
  },
  subListHeading: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#8A94A6",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  studentItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#242424",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 10,
  },
  studentNameText: {
    fontSize: 14.5,
    color: "#F1F1F1",
    fontWeight: "500",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 13.5,
    textAlign: "center",
    marginVertical: 10,
    fontStyle: "italic",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#141414",
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopColor: "#242424",
    borderTopWidth: 1,
  },
  endBtn: {
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  endBtnDisabled: {
    opacity: 0.6,
  },
  endBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
