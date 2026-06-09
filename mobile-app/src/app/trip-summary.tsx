import React,
{
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import {
  useLocalSearchParams,
  router,
} from "expo-router";

import {
  stopLocationTracking,
} from "../services/locationTracker";

import {
  getTripSummary,
  endTrip,
} from "../services/mobile.service";

export default function TripSummary() {

  const { tripId } =
    useLocalSearchParams();

  const [
  selectedList,
  setSelectedList,
] = useState<
  "BOARDED" |
  "ABSENT" |
  null
>(null);

  const [summary,
    setSummary] =
    useState<any>(null);

  useEffect(() => {

    loadSummary();

  }, []);

  const loadSummary =
    async () => {

      const data =
        await getTripSummary(
          tripId
        );

      if (data.success) {
        setSummary(data);
      }
    };

  const handleEndTrip =
    async () => {

      const data =
        await endTrip(
          tripId
        );

       

      if (data.success) {

         stopLocationTracking();

        Alert.alert(
          "Success",
          "Trip Completed"
        );

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
      <View
        style={
          styles.container
        }
      >
        <Text>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={
        styles.container
      }
    >

      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Text style={styles.backBtn}>
          ← Back
        </Text>
      </TouchableOpacity>

      <Text
        style={
          styles.title
        }
      >
        Trip Summary
      </Text>

      <View
        style={
          styles.card
        }
      >

        <Text>
        Driver:
        {" "}
        {summary.driverName}
        </Text>

        <Text>
        Bus:
        {" "}
        {summary.busNumber}
        </Text>

        <Text>
        Route:
        {" "}
        {summary.routeName}
        </Text>

        <Text
        style={{
            marginVertical: 10,
        }}
        >
        ------------------
        </Text>


        <Text>
          Total Students:
          {" "}
          {
            summary.totalStudents
          }
        </Text>

        <TouchableOpacity
  style={styles.listBtn}
  onPress={() =>
    setSelectedList(
      "BOARDED"
    )
  }
>
  <Text
    style={styles.btnText}
  >
    Boarded (
    {
      summary.totalBoarded
    }
    )
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={[
    styles.listBtn ,
    {
      backgroundColor:
        "#d32f2f",
    },
  ]}
  onPress={() =>
    setSelectedList(
      "ABSENT"
    )
  }
>
  <Text
    style={styles.btnText}
  >
    Unboarded (
    {
      summary.absent
    }
    )
  </Text>
</TouchableOpacity>

      </View>


      {selectedList &&
        (
            <View
            style={{
                marginTop: 20,
            }}
            >

            <Text
                style={{
                fontWeight:
                    "bold",

                marginBottom:
                    10,
                }}
            >
                {
                selectedList ===
                "BOARDED"
                    ? "Boarded Students"
                    : "Unboarded Students"
                }
            </Text>

            {(
                selectedList ===
                "BOARDED"
                ? summary.boardedStudents
                : summary.absentStudents
            ).map(
                (student: any) => (
                <Text
                    key={
                    student._id
                    }
                >
                    • {
                    student.name
                    }
                </Text>
                )
            )}

            </View>
        )}

      <TouchableOpacity
        style={
          styles.endBtn
        }
        onPress={
          handleEndTrip
        }
      >
        <Text
          style={
            styles.btnText
          }
        >
          End Trip
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      justifyContent:
        "center",
      padding: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },

    card: {
      backgroundColor:
        "#fff",
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
    },

    endBtn: {
      backgroundColor:"#d32f2f",
      padding: 15,
      borderRadius: 10,
    },

    btnText: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "bold",
    },

    listBtn: {
    backgroundColor:"#2e7d32",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
},

  backBtn: {
  fontSize: 18,
  fontWeight: "bold",
  marginTop: -200,
  marginBottom: 50,
}

});