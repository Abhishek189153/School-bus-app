import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { BackHandler } from "react-native";
import {
  getTripStudents,
  boardStudent,
  unboardStudent,
  getBoardedStudents,
} from "../services/mobile.service";

export default function StudentsScreen() {
  const { tripId, tripCompleted } = useLocalSearchParams();

const [groupedStudents, setGroupedStudents] = useState<any[]>([]);
  const [boardedStudents, setBoardedStudents] = useState<string[]>([]);

  const loadStudents = async () => {
    try {
      console.log("Current Trip ID:", tripId);
      const data = await getTripStudents(tripId);
      console.log(data);

      if (data.success) {
        setGroupedStudents(
          data.groupedStudents
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load students");
    }
  };

  const loadBoardedStudents = async () => {
    try {
      const data = await getBoardedStudents(tripId as string);
      if (data.success) {
        setBoardedStudents(data.boardedStudents);
      }
    } catch (error) {
      console.log("Failed to load boarded students");
    }
  };

  useEffect(() => {
    loadStudents();
    loadBoardedStudents();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
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
    }, [tripCompleted])
  );

  const handleBoard = async (studentId: string) => {
    try {
      const data = await boardStudent(tripId, studentId);
      Alert.alert(data.success ? "Success" : "Info", data.message);

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
        <Text style={styles.title}>Students List</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Student Directory List */}
      {/* <FlatList
        data={students}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isBoarded = boardedStudents.includes(item._id);
          return (
            <View style={styles.card}>
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.classBadge}>
                  <Text style={styles.classText}>Class: {item.className}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.boardBtn,
                  isBoarded ? styles.btnUnboardBg : styles.btnBoardBg,
                ]}
                activeOpacity={0.8}
                onPress={() => (isBoarded ? handleUnboard(item._id) : handleBoard(item._id))}
              >
                <Text style={[styles.btnText, isBoarded ? styles.textUnboard : styles.textBoard]}>
                  {isBoarded ? "Unboard" : "Board"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      /> */}


          <FlatList
  data={groupedStudents}
  keyExtractor={(item) =>
    item.stopName
  }
  contentContainerStyle={
    styles.listContentContainer
  }
  showsVerticalScrollIndicator={false}
  renderItem={({ item }) => (

    <View>

      <View
        style={styles.stopHeader}
      >
        <Text
          style={styles.stopTitle}
        >
           {item.stopName}  ({item.students.length})
        </Text>
      </View>

      {item.students.map(
        (student: any) => {

          const isBoarded =
            boardedStudents.includes(
              student._id
            );

          return (

            <View
              key={student._id}
              style={styles.card}
            >

              <View
                style={
                  styles.infoContainer
                }
              >

                <Text
                  style={styles.name}
                >
                  {student.name}
                </Text>

                <View
                  style={
                    styles.classBadge
                  }
                >

                  <Text
                    style={
                      styles.classText
                    }
                  >
                    Class:
                    {" "}
                    {student.className}
                  </Text>

                </View>

              </View>

              <TouchableOpacity
                style={[
                  styles.boardBtn,

                  isBoarded
                    ? styles.btnUnboardBg
                    : styles.btnBoardBg,
                ]}

                onPress={() =>
                  isBoarded
                    ? handleUnboard(
                        student._id
                      )
                    : handleBoard(
                        student._id
                      )
                }
              >

                <Text
                  style={[
                    styles.btnText,

                    isBoarded
                      ? styles.textUnboard
                      : styles.textBoard,
                  ]}
                >
                  {isBoarded
                    ? "Unboard"
                    : "Board"}
                </Text>

              </TouchableOpacity>

            </View>

          );

        }
      )}

    </View>

  )}
/>


      {/* Fixed Sticky Action Footer Button */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.summaryBtn}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: "/trip-summary",
              params: { tripId },
            })
          }
        >
          <Text style={styles.summaryBtnText}>View Summary</Text>
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
  listContentContainer: {
    paddingBottom: 100, // Provides safety cushion space above the sticky button
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === "ios" ? 10 : 30,
    marginBottom: 24,
    height: 58,
    fontSize: 72,
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
    width: 44, // Ensures exact layout mirroring for precise title placement
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
    backgroundColor: "#166534", // Professional subtle forest green
  },
  btnUnboardBg: {
    backgroundColor: "#991B1B", // Professional deep dark crimson red
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
    paddingVertical: 16,
    borderTopColor: "#2D2D2D",
    borderTopWidth: 1,
  },
  summaryBtn: {
    backgroundColor: "#1D4ED8", // Striking digital ocean royal blue
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
});