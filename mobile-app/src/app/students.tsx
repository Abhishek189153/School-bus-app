import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import {
  BackHandler,
} from "react-native";

import {
  useLocalSearchParams,
  router,
  useFocusEffect,
} from "expo-router";

import {
  getTripStudents,
  boardStudent,
  unboardStudent,
  getBoardedStudents,
} from "../services/mobile.service";

export default function StudentsScreen() {

  const { tripId, tripCompleted } =
    useLocalSearchParams();

    

  const [students, setStudents] =
    useState<any[]>([]);

  const [boardedStudents,
  setBoardedStudents] =
  useState<string[]>([]);

  const loadStudents =
    async () => {

      try {

        console.log(
  "Current Trip ID:",
  tripId
);

        const data =
          await getTripStudents(tripId);

          console.log(data);

        if (data.success) {
          setStudents(
            data.students
          );
        }

      } catch (error) {

        Alert.alert(
          "Error",
          "Failed to load students"
        );

      }
    };

   const loadBoardedStudents =
    async () => {

      try {

        const data =
          await getBoardedStudents(
            tripId as string
          );

        if (data.success) {

          setBoardedStudents(
            data.boardedStudents
          );

        }

      } catch (error) {

        console.log(
          "Failed to load boarded students"
        );

      }

    }; 

  useEffect(() => {

    loadStudents();
    loadBoardedStudents();

  }, []);


  useFocusEffect(
  React.useCallback(() => {

    const onBackPress =
      () => {

        if (
          tripCompleted ===
          "true"
        ) {

          router.replace(
            "/driver-dashboard"
          );

          return true;
        }

        return false;
      };

    const subscription =
      BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

    return () =>
      subscription.remove();

  }, [tripCompleted])
);

  const handleBoard =
    async (
      studentId: string
    ) => {

      try {

        const data =
          await boardStudent(
            tripId,
            studentId
          );

        Alert.alert(
          data.success
            ? "Success"
            : "Info",
          data.message
        );

        if (data.success) {

          setBoardedStudents(
            (prev) => [
              ...prev,
              studentId,
            ]
          );

        }

      } catch (error) {

        Alert.alert(
          "Error",
          "Boarding failed"
        );

        

      }
    };

  const handleUnboard =
  async (
    studentId: string
  ) => {

    try {

      const data =
        await unboardStudent(
          tripId as string,
          studentId
        );

      if (data.success) {

        setBoardedStudents(
          (prev) =>
            prev.filter(
              (id) =>
                id !== studentId
            )
        );

      }

    } catch (error) {

      Alert.alert(
        "Error",
        "Failed to unboard student"
      );

    }
  };


  return (
    <View style={styles.container}>

      <TouchableOpacity
  onPress={() => router.back()}
>
  <Text style={styles.backBtn}>
    ← Back
  </Text>
</TouchableOpacity>

      <Text style={styles.title}>
        Students List
      </Text>

      <FlatList
        data={students}
        keyExtractor={(item) =>
          item._id
        }
        renderItem={({ item }) => (
          <View
            style={styles.card}
          >

            <View>
              <Text
                style={
                  styles.name
                }
              >
                {item.name}
              </Text>

              <Text>
                Class:
                {" "}
                {
                  item.className
                }
              </Text>
            </View>

                    <TouchableOpacity
          style={[
    styles.boardBtn,
    {
      backgroundColor:
        boardedStudents.includes(
          item._id
        )
          ? "#d32f2f"
          : "#2e7d32",
    },
  ]}
  onPress={() =>
    boardedStudents.includes(
      item._id
    )
      ? handleUnboard(
          item._id
        )
      : handleBoard(
          item._id
        )
  }
>
  <Text
    style={styles.btnText}
  >
    {
      boardedStudents.includes(
        item._id
      )
        ? "Unboard"
        : "Board"
    }
  </Text>
</TouchableOpacity>

          </View>
        )}
      />

      <TouchableOpacity
        style={styles.summaryBtn}
        onPress={() =>
          router.push({
            pathname:
              "/trip-summary",
            params: {
              tripId,
            },
          })
        }
      >
        <Text
          style={
            styles.btnText
          }
        >
          View Summary
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      padding: 20,
      backgroundColor:
        "#f5f7fb",
    },

    title: {
      fontSize: 26,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },

    card: {
      backgroundColor:
        "#fff",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    },

    name: {
      fontSize: 18,
      fontWeight: "bold",
    },

    boardBtn: {
      backgroundColor:
        "#2e7d32",
      padding: 10,
      borderRadius: 8,
    },

    summaryBtn: {
      backgroundColor:
        "#1565c0",
      padding: 15,
      borderRadius: 10,
      marginTop: 10,
    },

    btnText: {
      color: "#fff",
      fontWeight: "bold",
    },

    backBtn: {
  fontSize: 18,
  fontWeight: "bold",
  marginTop: 20,
  marginBottom: 30,
}

});