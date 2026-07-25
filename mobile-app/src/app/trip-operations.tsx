import React, {
  useRef,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";

import {
  useLocalSearchParams,
  router,
  useFocusEffect,
} from "expo-router";

import {
  setLocationSubscription,
} from "../services/locationTracker";

import {
  startTrip,
} from "../services/mobile.service";

import {
  startBackgroundTracking,
} from "../services/backgroundLocation";

import * as Location
from "expo-location";

import {
  updateLocation,
} from "../services/location.service";

export default function TripOperations() {

  const {
    routeId,
    routeName,
    tripCompleted,
  } = useLocalSearchParams();

  const locationSubscription =
  useRef<any>(null);


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


  const startLocationTracking =
async (
  busId: string
) => {

  console.log(
    "GPS Function Called"
  );

  const {
    status,
  } =
    await Location.requestForegroundPermissionsAsync();

  console.log(
    "Permission Status:",
    status
  );

  if (
    status !== "granted"
  ) {

    Alert.alert(
      "Location Permission Required"
    );

    return;
  }

  console.log(
    "Starting watchPositionAsync..."
  );

  const enabled =
  await Location.hasServicesEnabledAsync();

console.log(
  "GPS Enabled:",
  enabled
);

locationSubscription.current =
  await Location.watchPositionAsync(    {
      accuracy:
        Location.Accuracy.High,

      timeInterval:
        3000,

      distanceInterval:
        5,
    },

    async (
      location
    ) => {

      console.log(
        "GPS Coordinates:",
        location.coords.latitude,
        location.coords.longitude
      );

      console.log(
  "SENDING TO API:",
  {
    busId,
    latitude:
      location.coords.latitude,
    longitude:
      location.coords.longitude,
  }
);

      try {

        const response =
          await updateLocation(
            busId,
            location.coords.latitude,
            location.coords.longitude
          );

          

        console.log(
          "LOCATION SENT SUCCESSFULLY:",
          response
        );

      } catch (error) {

        console.log(
          "Location Update Error:",
          error
        );

      }

    }
  );

  setLocationSubscription(
  locationSubscription.current
);

};


  const handleStartTrip =
    async (
      tripType: string
    ) => {
      console.log(
  "TRIP OPERATIONS START TRIP"
);

      try {

        const data =
          await startTrip(
            tripType,
            routeId
          );
          console.log(
  "START TRIP RESPONSE:",
  data
);
          

        if (data.success) {

            console.log(
    "Trip Response:",
    data.trip
  );

  console.log(
    "Bus ID:",
    data.trip.busId
  );

  await startLocationTracking(
  data.trip.busId
);

// await startBackgroundTracking(
//   data.trip.busId
// );

          router.push({
            pathname:
              "/students",
            params: {
              tripId:
                data.trip._id,
            },
          });

        }

      }catch (error: any) {

  console.log(
    "START TRIP ERROR:",
    error
  );

  Alert.alert(
    "Error",
    error?.message ||
    JSON.stringify(error)
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
        Trip Operations
      </Text>

      <Text style={styles.route}>
        Route:
        {" "}
        {routeName}
      </Text>

      <TouchableOpacity
        style={styles.pickupBtn}
        onPress={() =>
          handleStartTrip(
            "PICKUP"
          )
        }
      >
        <Text
          style={styles.btnText}
        >
          Start Pickup
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dropBtn}
        onPress={() =>
          handleStartTrip(
            "DROP"
          )
        }
      >
        <Text
          style={styles.btnText}
        >
          Start Drop
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
      justifyContent:
        "center",
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },

    route: {
      fontSize: 20,
      textAlign: "center",
      marginBottom: 30,
    },

    pickupBtn: {
      backgroundColor:
        "#2e7d32",
      padding: 18,
      borderRadius: 12,
      marginBottom: 15,
    },

    dropBtn: {
      backgroundColor:
        "#1565c0",
      padding: 18,
      borderRadius: 12,
    },

    btnText: {
      color: "#fff",
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
    },

    backBtn: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: -270,
    marginBottom: 15,
  }
});