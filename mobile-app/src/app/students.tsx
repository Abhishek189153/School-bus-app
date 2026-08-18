import React, { useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Animated,
  StyleSheet,
  Alert,
  StatusBar,
  BackHandler,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import {
  getTripStudents,
  boardStudent,
  unboardStudent,
  getBoardedStudents,
} from "../services/mobile.service";

// --- reusable "press to scale" wrapper for a smoother native feel ---
function PressableScale({
  onPress,
  style,
  children,
  scaleTo = 0.96,
}: {
  onPress?: () => void;
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
      onPressIn={() => animateTo(scaleTo)}
      onPressOut={() => animateTo(1)}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function StudentsScreen() {
  const { tripId, tripCompleted } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [groupedStudents, setGroupedStudents] = useState<any[]>([]);
  const [boardedStudents, setBoardedStudents] = useState<string[]>([]);

  // guards against overlapping fetches
  const isFetchingRef = useRef(false);

  const loadAll = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const [studentsData, boardedData] = await Promise.all([
        getTripStudents(tripId),
        getBoardedStudents(tripId as string),
      ]);

      if (studentsData.success) {
        setGroupedStudents(studentsData.groupedStudents);
      }
      if (boardedData.success) {
        setBoardedStudents(boardedData.boardedStudents);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load students");
    } finally {
      isFetchingRef.current = false;
    }
  }, [tripId]);

  // load on focus (keeps board state in sync if you navigate away and back)
  // + owns the back handler, replacing the two separate effects
  useFocusEffect(
    useCallback(() => {
      loadAll();

      const onBackPress = () => {
        if (tripCompleted === "true") {
          router.replace("/driver-dashboard");
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [loadAll, tripCompleted])
  );

  const handleBoard = async (studentId: string) => {
    try {
      const data = await boardStudent(tripId, studentId);
      // confirmation popup removed — board state updates silently below
      if (data.success) {
        setBoardedStudents((prev) => [...prev, studentId]);
      }
    } catch (error) {
      Alert.alert("Error", "Boarding failed");
    }
  };

  const handleUnboard = async (studentId: string) => {
    try {
      const data = await unboardStudent(tripId as string, studentId);
      if (data.success) {
        setBoardedStudents((prev) => prev.filter((id) => id !== studentId));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to unboard student");
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

      {/* Structured Balanced Header Area */}
      <View style={styles.headerContainer}>
        <PressableScale
          style={styles.backButtonCircle}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrowText}>←</Text>
        </PressableScale>
        <Text style={styles.title}>Students List</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Student Directory List */}
      <FlatList
        data={groupedStudents}
        keyExtractor={(item) => item.stopName}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={8}
        windowSize={7}
        initialNumToRender={8}
        renderItem={({ item }) => (
          <View>
            <View style={styles.stopHeader}>
              <Text style={styles.stopTitle}>
                {item.stopName} ({item.students.length})
              </Text>
            </View>

            {item.students.map((student: any) => {
              const isBoarded = boardedStudents.includes(student._id);

              return (
                <View key={student._id} style={styles.card}>
                  <View style={styles.infoContainer}>

  <Text style={styles.name} numberOfLines={1}>
    {student.name}
  </Text>

  <View style={styles.studentDetails}>
    <Text
      style={styles.classText}
      numberOfLines={1}
    >
      Class: {student.className}
    </Text>

    <Text
      style={styles.admissionText}
      numberOfLines={1}
    >
      Admission: {student.admissionNumber}
    </Text>
  </View>

</View>

                  <PressableScale
                    style={[
                      styles.boardBtn,
                      isBoarded ? styles.btnUnboardBg : styles.btnBoardBg,
                    ]}
                    onPress={() =>
                      isBoarded
                        ? handleUnboard(student._id)
                        : handleBoard(student._id)
                    }
                  >
                    <Text
                      style={[
                        styles.btnText,
                        isBoarded ? styles.textUnboard : styles.textBoard,
                      ]}
                    >
                      {isBoarded ? "Unboard" : "Board"}
                    </Text>
                  </PressableScale>
                </View>
              );
            })}
          </View>
        )}
      />

      {/* Fixed Sticky Action Footer Button */}
      <View
        style={[
          styles.footerContainer,
          { paddingBottom: insets.bottom + 16 },
        ]}
      >
        <PressableScale
          style={styles.summaryBtn}
          scaleTo={0.98}
          onPress={() =>
            router.push({
              pathname: "/trip-summary",
              params: { tripId },
            })
          }
        >
          <Text style={styles.summaryBtnText}>View Summary</Text>
        </PressableScale>
      </View>
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
    paddingBottom: 100, // Provides safety cushion space above the sticky button
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 24,
    height: 58,
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 54, // matches backButtonCircle width so the title is truly centered
  },
  card: {
    backgroundColor: "#2D2D2D",
    borderColor: "#3D3D3D",
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  classBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#3D3D3D",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  classText: {
    fontSize: 12,
    color: "#A0AEC0",
    fontWeight: "600",
  },
  boardBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  btnBoardBg: {
    backgroundColor: "#166534",
  },
  btnUnboardBg: {
    backgroundColor: "#991B1B",
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  textBoard: {
    color: "#FFFFFF",
  },
  textUnboard: {
    color: "#FCA5A5",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopColor: "#2D2D2D",
    borderTopWidth: 1,
  },
  summaryBtn: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  stopHeader: {
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  stopTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#60A5FA",
    letterSpacing: 0.3,
  },
  studentDetails: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
},

admissionText: {
  fontSize: 12,
  color: "#A0AEC0",
  fontWeight: "600",
},
});
