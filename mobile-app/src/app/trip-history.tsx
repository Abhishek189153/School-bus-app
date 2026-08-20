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
  ActivityIndicator,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import DateTimePicker
  from "@react-native-community/datetimepicker";

import PressableScale from "../components/PressableScale";

import {
  getTripHistory,
} from "../services/mobile.service";


export default function TripHistory() {

  const insets = useSafeAreaInsets();

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
  // FORMAT DATE FOR DISPLAY (more readable than raw YYYY-MM-DD)
  // ==========================================

  const formatDisplayDate =
    (date: Date) => {

      const today = new Date();

      const isToday =
        formatDate(date) === formatDate(today);

      if (isToday) {
        return "Today";
      }

      return date.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
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

          <View style={styles.headerTextGroup}>

            <Text
              style={
                styles.routeName
              }
              numberOfLines={1}
              ellipsizeMode="tail"
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
            numberOfLines={1}
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
              numberOfLines={1}
              adjustsFontSizeToFit
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
            <Text style={styles.timeDividerArrow}>
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
              numberOfLines={1}
              adjustsFontSizeToFit
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


          <View style={styles.statDivider} />


          <View
            style={
              styles.stat
            }
          >

            <Text
              style={[
                styles.statNumber,
                { color: "#DC2626" },
              ]}
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
      style={[
        styles.container,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom,
        },
      ]}
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

      <PressableScale
        style={
          styles.dateButton
        }
        scaleTo={0.98}
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
          {formatDisplayDate(
            selectedDate
          )}
        </Text>

      </PressableScale>


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
            maximumDate={new Date()}
            onChange={
              handleDateChange
            }
          />

        )
      }


      {/* ================================== */}
      {/* RESULT COUNT */}
      {/* ================================== */}

      {!loading && history.length > 0 && (

        <Text style={styles.resultCount}>
          {history.length}{" "}
          {history.length === 1 ? "trip" : "trips"} found
        </Text>

      )}


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
              color="#1565C0"
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

            removeClippedSubviews

            maxToRenderPerBatch={8}

            windowSize={7}

            initialNumToRender={8}

            contentContainerStyle={[
              history.length === 0
                ? styles.emptyContainer
                : styles.list,
              { paddingBottom: 30 + insets.bottom },
            ]}

            ListEmptyComponent={

              <View style={styles.emptyState}>

                <Text style={styles.emptyIcon}>🗓️</Text>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  No completed trips{"\n"}for this date.
                </Text>

              </View>

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
      paddingHorizontal: 20,
      backgroundColor:
        "#EEF4FF",
    },


    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 18,
      textAlign: "center",
      color: "#0F4C81",
      letterSpacing: 0.3,
    },


    dateButton: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 14,
      padding: 15,
      marginBottom: 8,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },


    dateButtonText: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "600",
      color: "#1565C0",
    },


    resultCount: {
      textAlign: "center",
      fontSize: 12,
      fontWeight: "600",
      color: "#64748B",
      marginBottom: 10,
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
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },


    headerRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems:
        "flex-start",
      marginBottom: 15,
    },


    headerTextGroup: {
      flex: 1,
      flexShrink: 1,
      marginRight: 10,
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
      flexShrink: 0,
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
      flexShrink: 1,
      marginLeft: 10,
      textAlign: "right",
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
      minWidth: 0,
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

    timeDividerArrow: {
      color: "#94A3B8",
      fontWeight: "bold",
    },


    statsRow: {
      flexDirection: "row",
      alignItems: "center",
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

    statDivider: {
      width: 1,
      height: 28,
      backgroundColor: "#E2E8F0",
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

    emptyState: {
      alignItems: "center",
    },

    emptyIcon: {
      fontSize: 40,
      marginBottom: 10,
    },


    emptyText: {
      textAlign: "center",
      color: "#64748B",
      fontSize: 15,
      lineHeight: 22,
    },

  });
