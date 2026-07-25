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
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { stopLocationTracking } from "../services/locationTracker";
import { stopBackgroundTracking } from "../services/backgroundLocation";
import { getTripSummary, endTrip } from "../services/mobile.service";

export default function TripSummary() {
  const { tripId } = useLocalSearchParams();
  const [selectedList, setSelectedList] = useState<"BOARDED" | "ABSENT" | null>(null);
  const [summary, setSummary] = useState<any>(null);

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
    const data = await endTrip(tripId);
    if (data.success) {
      stopLocationTracking();
      await stopBackgroundTracking();

      Alert.alert("Success", "Trip Completed");

      router.replace({
        pathname: "/routes",
        params: {
          tripCompleted: "true",
        },
      });
    }
  };

  if (!summary) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
        <Text style={styles.loadingText}>Loading summary...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      {/* Structured Balanced Header Area */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButtonCircle}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Trip Summary</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Main Trip Meta Information Card */}
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
        </View>

        {/* Dynamic List Selection Grid Buttons */}
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
            <Text style={styles.btnText}>Boarded ({summary.totalBoarded})</Text>
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
            <Text style={styles.btnText}>Unboarded ({summary.absent})</Text>
          </TouchableOpacity>
        </View>

        {/* Conditional Selected Sub-List Block View */}
        {selectedList && (
          <View style={styles.subListContainer}>
            <Text style={styles.subListHeading}>
              {selectedList === "BOARDED" ? "Boarded Students Breakdown" : "Unboarded Students Breakdown"}
            </Text>

            {(selectedList === "BOARDED" ? summary.boardedStudents : summary.absentStudents).map(
              (student: any) => (
                <View key={student._id} style={styles.studentItemRow}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.studentNameText}>{student.name}</Text>
                </View>
              )
            )}
            
            {(selectedList === "BOARDED" ? summary.boardedStudents : summary.absentStudents).length === 0 && (
              <Text style={styles.emptyText}>No students found in this state.</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Fixed Sticky Dynamic CTA Button Footer Area */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.endBtn}
          activeOpacity={0.9}
          onPress={handleEndTrip}
        >
          <Text style={styles.endBtnText}>End Trip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#A0AEC0",
    fontSize: 16,
    fontWeight: "500",
  },
  scrollContentContainer: {
    paddingBottom: 120, // Cushion space over absolute layout footer button bounds
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === "ios" ? 10 : 30,
    marginBottom: 24,
    height: 48,
  },
  backButtonCircle: {
    width: 54,
    height: 44,
    borderRadius: 22,
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
    width: 44, // Keeps layout alignment centered perfectly
  },
  card: {
    backgroundColor: "#2D2D2D",
    borderColor: "#3D3D3D",
    borderWidth: 1,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  metaLabel: {
    fontSize: 14,
    color: "#A0AEC0",
    fontWeight: "500",
  },
  metaValue: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#3D3D3D",
    marginVertical: 14,
  },
  totalLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 20,
    color: "#1D4ED8", // Highlight color matching primary buttons
    fontWeight: "bold",
  },
  selectionGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  listBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  listBtnSelected: {
    borderColor: "#FFFFFF",
  },
  btnBoardBg: {
    backgroundColor: "#166534",
  },
  btnUnboardBg: {
    backgroundColor: "#991B1B",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  subListContainer: {
    backgroundColor: "#252525",
    borderRadius: 14,
    padding: 16,
    borderColor: "#2D2D2D",
    borderWidth: 1,
  },
  subListHeading: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#A0AEC0",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  studentItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2D2D2D",
  },
  bulletPoint: {
    fontSize: 18,
    color: "#A0AEC0",
    marginRight: 8,
  },
  studentNameText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  emptyText: {
    color: "#718096",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    fontStyle: "italic",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopColor: "#2D2D2D",
    borderTopWidth: 1,
  },
  endBtn: {
    backgroundColor: "#D32F2F", // High alert action red
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  endBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});