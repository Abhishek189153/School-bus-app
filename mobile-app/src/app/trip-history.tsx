import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import DateTimePicker
  from "@react-native-community/datetimepicker";

import {
  getTripHistory,
} from "../services/mobile.service";


export default function TripHistory() {

  const [
    history,
    setHistory,
  ] = useState<any[]>([]);


  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    new Date()
  );


  const [
    showPicker,
    setShowPicker,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(true);


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate =
    (date: Date) => {

      return (
        `${date.getFullYear()}-` +
        `${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-` +
        `${String(
          date.getDate()
        ).padStart(2, "0")}`
      );

    };


  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime =
    (time: string | null) => {

      if (!time) {
        return "--";
      }


      const date =
        new Date(time);


      return date.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      );

    };


  // ==========================================
  // LOAD HISTORY
  // ==========================================

  const loadHistory =
    useCallback(
      async (
        date?: string
      ) => {

        try {

          setLoading(true);


          const data =
            await getTripHistory(
              date
            );


          console.log(
            "TRIP HISTORY RESPONSE:",
            data
          );


          if (
            data.success
          ) {

            setHistory(
              data.history || []
            );

          } else {

            setHistory([]);

          }

        } catch (error) {

          console.log(
            "TRIP HISTORY ERROR:",
            error
          );

          setHistory([]);

        } finally {

          setLoading(false);

        }

      },
      []
    );


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(
    () => {

      loadHistory(
        formatDate(
          new Date()
        )
      );

    },
    []
  );


  // ==========================================
  // DATE SELECTED
  // ==========================================

  const handleDateChange =
    async (
      event: any,
      date?: Date
    ) => {

      setShowPicker(false);


      if (!date) {
        return;
      }


      setSelectedDate(
        date
      );


      await loadHistory(
        formatDate(date)
      );

    };


  // ==========================================
  // RENDER TRIP
  // ==========================================

  const renderTrip =
    ({
      item,
    }: {
      item: any;
    }) => (

      <View
        style={
          styles.card
        }
      >

        {/* ---------------------------------- */}
        {/* HEADER */}
        {/* ---------------------------------- */}

        <View
          style={
            styles.headerRow
          }
        >

          <View>

            <Text
              style={
                styles.routeName
              }
            >
              {item.routeName}
            </Text>

            <Text
              style={
                styles.tripType
              }
            >
              {item.tripType ===
              "PICKUP"
                ? "🚍 PICKUP"
                : "🏫 DROP"}
            </Text>

          </View>


          <View
            style={
              styles.completedBadge
            }
          >

            <Text
              style={
                styles.completedText
              }
            >
              ✓ Completed
            </Text>

          </View>

        </View>


        {/* ---------------------------------- */}
        {/* BUS */}
        {/* ---------------------------------- */}

        <View
          style={
            styles.infoRow
          }
        >

          <Text
            style={
              styles.label
            }
          >
            Bus
          </Text>

          <Text
            style={
              styles.value
            }
          >
            {item.busNumber}
          </Text>

        </View>


        {/* ---------------------------------- */}
        {/* START / END TIME */}
        {/* ---------------------------------- */}

        <View
          style={
            styles.timeContainer
          }
        >

          <View
            style={
              styles.timeBox
            }
          >

            <Text
              style={
                styles.timeLabel
              }
            >
              START TIME
            </Text>

            <Text
              style={
                styles.startTime
              }
            >
              {formatTime(
                item.startTime
              )}
            </Text>

          </View>


          <View
            style={
              styles.timeDivider
            }
          >
            <Text>
              →
            </Text>
          </View>


          <View
            style={
              styles.timeBox
            }
          >

            <Text
              style={
                styles.timeLabel
              }
            >
              END TIME
            </Text>

            <Text
              style={
                styles.endTime
              }
            >
              {formatTime(
                item.endTime
              )}
            </Text>

          </View>

        </View>


        {/* ---------------------------------- */}
        {/* STUDENTS */}
        {/* ---------------------------------- */}

        <View
          style={
            styles.statsRow
          }
        >

          <View
            style={
              styles.stat
            }
          >

            <Text
              style={
                styles.statNumber
              }
            >
              {item.boarded}
            </Text>

            <Text
              style={
                styles.statLabel
              }
            >
              Boarded
            </Text>

          </View>


          <View
            style={
              styles.stat
            }
          >

            <Text
              style={
                styles.statNumber
              }
            >
              {item.absent}
            </Text>

            <Text
              style={
                styles.statLabel
              }
            >
              Absent
            </Text>

          </View>

        </View>

      </View>

    );


  return (

    <View
      style={
        styles.container
      }
    >

      {/* ================================== */}
      {/* TITLE */}
      {/* ================================== */}

      <Text
        style={
          styles.title
        }
      >
        Trip History
      </Text>


      {/* ================================== */}
      {/* DATE PICKER BUTTON */}
      {/* ================================== */}

      <TouchableOpacity
        style={
          styles.dateButton
        }
        onPress={() =>
          setShowPicker(true)
        }
      >

        <Text
          style={
            styles.dateButtonText
          }
        >
          📅{" "}
          {formatDate(
            selectedDate
          )}
        </Text>

      </TouchableOpacity>


      {/* ================================== */}
      {/* DATE PICKER */}
      {/* ================================== */}

      {
        showPicker && (

          <DateTimePicker
            value={
              selectedDate
            }
            mode="date"
            onChange={
              handleDateChange
            }
          />

        )
      }


      {/* ================================== */}
      {/* LOADING */}
      {/* ================================== */}

      {
        loading ? (

          <View
            style={
              styles.loading
            }
          >

            <ActivityIndicator
              size="large"
            />

            <Text
              style={
                styles.loadingText
              }
            >
              Loading trips...
            </Text>

          </View>

        ) : (

          <FlatList
            data={
              history
            }

            keyExtractor={(
              item
            ) =>
              item._id
            }

            renderItem={
              renderTrip
            }

            showsVerticalScrollIndicator={
              false
            }

            contentContainerStyle={
              history.length === 0
                ? styles.emptyContainer
                : styles.list
            }

            ListEmptyComponent={

              <Text
                style={
                  styles.emptyText
                }
              >
                No completed trips
                for this date.
              </Text>

            }

          />

        )
      }

    </View>

  );

}


const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      padding: 20,
      backgroundColor:
        "#EEF4FF",
    },


    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 18,
      textAlign: "center",
      color: "#0F4C81",
    },


    dateButton: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 14,
      padding: 15,
      marginBottom: 18,
      elevation: 3,
    },


    dateButtonText: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "600",
      color: "#1565C0",
    },


    list: {
      paddingBottom: 30,
    },


    card: {
      backgroundColor:
        "#FFFFFF",
      padding: 18,
      borderRadius: 18,
      marginBottom: 15,
      elevation: 3,
    },


    headerRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems:
        "flex-start",
      marginBottom: 15,
    },


    routeName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#0F4C81",
    },


    tripType: {
      marginTop: 5,
      fontSize: 13,
      fontWeight: "600",
      color: "#64748B",
    },


    completedBadge: {
      backgroundColor:
        "#DCFCE7",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
    },


    completedText: {
      color: "#15803D",
      fontSize: 12,
      fontWeight: "bold",
    },


    infoRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginBottom: 15,
    },


    label: {
      color: "#64748B",
      fontSize: 14,
    },


    value: {
      color: "#111827",
      fontSize: 14,
      fontWeight: "600",
    },


    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        "#F8FAFC",
      borderRadius: 14,
      padding: 12,
      marginBottom: 15,
    },


    timeBox: {
      flex: 1,
    },


    timeLabel: {
      fontSize: 10,
      color: "#64748B",
      fontWeight: "bold",
      marginBottom: 4,
    },


    startTime: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#16A34A",
    },


    endTime: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#DC2626",
    },


    timeDivider: {
      paddingHorizontal: 10,
    },


    statsRow: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderTopColor:
        "#E2E8F0",
      paddingTop: 12,
    },


    stat: {
      flex: 1,
      alignItems:
        "center",
    },


    statNumber: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#1565C0",
    },


    statLabel: {
      fontSize: 12,
      color: "#64748B",
      marginTop: 2,
    },


    loading: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
    },


    loadingText: {
      marginTop: 10,
      color: "#64748B",
    },


    emptyContainer: {
      flexGrow: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
    },


    emptyText: {
      textAlign: "center",
      color: "#64748B",
      fontSize: 15,
    },

  });