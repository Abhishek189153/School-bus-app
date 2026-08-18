import React, {
  useState,
  useCallback,
} from "react";

import {
  useFocusEffect,
} from "expo-router";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import DateTimePicker
  from "@react-native-community/datetimepicker";

import PressableScale from "../../components/PressableScale";
import { useTheme } from "../../contexts/ThemeContext";

import {
  getHistory,
} from "../../services/mobile.service";


export default function History() {

  // ==========================================
  // STATE
  // ==========================================

  const { darkMode } = useTheme();
  const insets = useSafeAreaInsets();

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    new Date()
  );

  const [
    isFiltered,
    setIsFiltered,
  ] = useState(false);

  const [
    showPicker,
    setShowPicker,
  ] = useState(false);

  const [
    history,
    setHistory,
  ] = useState<any[]>([]);


  // ==========================================
  // LOAD HISTORY (on mount + whenever tab regains focus)
  // ==========================================

  const loadHistory = useCallback(async () => {

    try {

      const data =
        await getHistory();

      if (
        data?.success
      ) {

        setHistory(
          data.history || []
        );

      }

    } catch (error) {

      console.log(
        "HISTORY LOAD ERROR:",
        error
      );

    }

  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );


  // ==========================================
  // CLEAR FILTER
  // ==========================================

  const clearFilter = async () => {

    setIsFiltered(false);

    setSelectedDate(
      new Date()
    );

    await loadHistory();

  };


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (
    date: Date
  ) => {

    return `${date.getFullYear()}-${
      String(
        date.getMonth() + 1
      ).padStart(2, "0")
    }-${
      String(
        date.getDate()
      ).padStart(2, "0")
    }`;

  };


  // ==========================================
  // DATE PICKER
  // ==========================================

  const handleDateChange = async (
    event: any,
    date?: Date
  ) => {

    setShowPicker(false);

    if (!date) {
      return;
    }

    setSelectedDate(date);

    setIsFiltered(true);

    const formattedDate =
      formatDate(date);

    try {

      const data =
        await getHistory(
          formattedDate
        );

      if (
        data?.success
      ) {

        setHistory(
          data.history || []
        );

      }

    } catch (error) {

      console.log(
        "FILTER HISTORY ERROR:",
        error
      );

    }

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <ScrollView

      style={[
        styles.container,

        {
          backgroundColor:
            darkMode
              ? "#001233"
              : "#EEF4FF",
        },

      ]}

      contentContainerStyle={{
        paddingBottom: 120 + insets.bottom,
      }}

      showsVerticalScrollIndicator={false}

    >

      {/* ======================================
          HEADING
      ====================================== */}

      <Text
        style={[
          styles.heading,

          {
            color:
              darkMode
                ? "#FFFFFF"
                : "#0F4C81",
            marginTop: insets.top + 5,
          },

        ]}
      >
        📅 History
      </Text>


      {/* ======================================
          FILTER
      ====================================== */}

      <View
        style={{
          flexDirection: "row",
          marginBottom: 20,
          gap: 10,
        }}
      >

        <PressableScale

          style={[
            styles.filterCard,

            {
              flex: 4,

              backgroundColor:
                darkMode
                  ? "#1E293B"
                  : "#FFFFFF",
            },

          ]}

          scaleTo={0.97}

          onPress={() =>
            setShowPicker(true)
          }

        >

          <Text
            style={[
              styles.filterText,

              {
                color:
                  darkMode
                    ? "#60A5FA"
                    : "#1565C0",
              },

            ]}
          >
            📆 Filter By Date
          </Text>

        </PressableScale>


        {isFiltered && (

          <PressableScale

            style={styles.clearButton}

            scaleTo={0.94}

            onPress={
              clearFilter
            }

          >

            <Text
              style={styles.clearText}
            >
              Clear
            </Text>

          </PressableScale>

        )}

      </View>


      {/* ======================================
          DATE PICKER
      ====================================== */}

      {showPicker && (

        <DateTimePicker

          value={
            selectedDate
          }

          mode="date"

          onChange={
            handleDateChange
          }

        />

      )}


      {/* ======================================
          NO HISTORY
      ====================================== */}

      {history.length === 0 && (

        <View
          style={[
            styles.emptyCard,

            {
              backgroundColor:
                darkMode
                  ? "#1E293B"
                  : "#FFFFFF",
            },

          ]}
        >

          <Text
            style={[
              styles.emptyText,

              {
                color:
                  darkMode
                    ? "#CBD5E1"
                    : "#64748B",
              },

            ]}
          >
            No travel history found.
          </Text>

        </View>

      )}


      {/* ======================================
          HISTORY
      ====================================== */}

      {history.map(
        (
          trip: any,
          index: number
        ) => (

          <View
            key={index}

            style={[
              styles.card,

              {
                backgroundColor:
                  darkMode
                    ? "#1E293B"
                    : "#FFFFFF",
              },

            ]}
          >

            {/* ==================================
                TRIP TYPE
            ================================== */}

            <Text
              style={[
                styles.date,

                {
                  color:
                    trip.tripType ===
                    "PICKUP"

                      ? (
                        darkMode
                          ? "#60A5FA"
                          : "#1565C0"
                      )

                      : (
                        darkMode
                          ? "#4ADE80"
                          : "#15803D"
                      ),
                },

              ]}
            >

              {
                trip.tripType ===
                "PICKUP"

                  ? "🚍 PICKUP"

                  : "🏫 DROP"

              }

            </Text>


            {/* ==================================
                DATE
            ================================== */}

            <Text
              style={[
                styles.tripDate,

                {
                  color:
                    darkMode
                      ? "#94A3B8"
                      : "#64748B",
                },

              ]}
            >
              {trip.date}
            </Text>


            {/* ==================================
                STUDENTS
            ================================== */}

            {trip.students?.map(
              (
                student: any,
                idx: number
              ) => {

                const isPickup =
                  trip.tripType ===
                  "PICKUP";

                const stop =
    student.stop;

      const formattedTime =
          student.time
              ? new Date(
                  student.time
                ).toLocaleTimeString(
                  "en-IN",
                  {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                  }
                )
              : "--";


                return (

                  <View
                    key={idx}
                    style={
                      styles.studentRow
                    }
                  >

                    {/* ==========================
                        STUDENT NAME
                    ========================== */}

                    <Text
                      style={[
                        styles.studentName,

                        {
                          color:
                            darkMode
                              ? "#FFFFFF"
                              : "#000000",
                        },

                      ]}
                    >

                      {
                        student.status ===
                        "PRESENT"

                          ? "✅"

                          : "❌"
                      }

                      {" "}

                      {student.name}

                    </Text>


                    {/* ==========================
                        STATUS / STOP
                    ========================== */}

                   <View style={styles.statusTimeRow}>

  <Text
    style={[
      styles.studentStatus,
      {
        color:
          darkMode
            ? "#CBD5E1"
            : "#475569",
      },
    ]}
    numberOfLines={1}
  >
    {
      student.status === "PRESENT"

        ? isPickup

          ? `Boarded bus from ${
              stop || "Pickup Stop"
            }`

          : `Reached home at ${
              stop || "Drop Stop"
            }`

        : "Not Boarded"
    }
  </Text>


  <Text
    style={[
      styles.studentTime,
      {
        color:
          darkMode
            ? "#94A3B8"
            : "#64748B",
      },
    ]}
  >
    🕐 {formattedTime}
  </Text>

</View>

                  </View>

                );

              }
            )}

          </View>

        )
      )}

    </ScrollView>

  );

}


// ==================================================
// STYLES
// ==================================================

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      padding: 16,

    },


    heading: {

      fontSize: 26,

      fontWeight:
        "bold",

      marginBottom: 20,

    },


    filterCard: {

      padding: 15,

      borderRadius: 16,

      marginBottom: 20,

      elevation: 3,

      justifyContent:
        "center",

      alignItems:
        "center",

    },


    filterText: {

      textAlign:
        "center",

      fontWeight:
        "bold",

    },


    clearButton: {

      flex: 1,

      backgroundColor:
        "#EF4444",

      borderRadius: 16,

      height: 50,
      width: 80,

      marginBottom: 20,

      justifyContent:
        "center",

      alignItems:
        "center",

    },


    clearText: {

      color:
        "#FFFFFF",

      fontWeight:
        "bold",

    },


    card: {

      borderRadius: 20,

      padding: 18,

      marginBottom: 15,

      elevation: 3,

    },


    date: {

      fontWeight:
        "bold",

      fontSize: 17,

      marginBottom: 8,

    },


    tripDate: {

      marginBottom: 15,

      fontSize: 14,

    },


    studentRow: {

      marginBottom: 14,

      paddingBottom: 10,

      borderBottomWidth: 1,

      borderBottomColor:
        "#334155",

    },


    studentName: {

      fontWeight:
        "bold",

      fontSize: 16,

      marginBottom: 5,

    },


   statusTimeRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 2,
},

studentStatus: {
  fontSize: 14,
  flex: 1,
  marginRight: 10,
},

studentTime: {
  fontSize: 13,
  fontWeight: "600",
},


    emptyCard: {

      borderRadius: 20,

      padding: 30,

      alignItems:
        "center",

      elevation: 3,

    },


    emptyText: {

      fontSize: 16,

    },

  });
