import React, {
  useEffect,
  useState,
  useRef
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  Image,
  Animated
} from "react-native";

import {
  stopLocationTracking,
} from "../services/locationTracker";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router,useLocalSearchParams,useFocusEffect } from "expo-router";



import {
  getDriverDashboard,
  startTrip,
  endTrip,
  dutyOn,
  dutyOff,
  getDutyStatus
} from "../services/mobile.service";

export default function DriverDashboard() {

  useFocusEffect(
  React.useCallback(() => {

    const onBackPress =
      () => {

        router.replace("/");

        return true;
      };

    const subscription =
      BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

    return () =>
      subscription.remove();

  }, [])
);

  const [loading, setLoading] =
    useState(true);

  const [bus, setBus] = useState<any>(null);

  const {
  routeId,
  routeName,
} =
  useLocalSearchParams();

  const [onDuty,
  setOnDuty] =
  useState(false);

  const [activeTrip, setActiveTrip] = useState<any>(null);

  const greetingOpacity =
  useRef(new Animated.Value(0)).current;

const nameOpacity =
  useRef(new Animated.Value(0)).current;

const busOpacity =
  useRef(new Animated.Value(0)).current;

const vehicleOpacity =
  useRef(new Animated.Value(0)).current;

    useEffect(() => {
  Animated.sequence([
    Animated.timing(
      greetingOpacity,
      {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }
    ),

    Animated.timing(
      nameOpacity,
      {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }
    ),

    Animated.timing(
      busOpacity,
      {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }
    ),

    Animated.timing(
      vehicleOpacity,
      {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }
    ),
  ]).start();
}, []);

  const loadDashboard =
    async () => {
 
      try {

        const data =
          await getDriverDashboard();

        const dutyData =
          await getDutyStatus();

        setOnDuty(
          dutyData.onDuty
        );  

        if (data.success) {

          setBus(data.bus);

          setActiveTrip(
            data.activeTrip
          );
        }

      } catch (error) {

        Alert.alert(
          "Error",
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }
    };

  useFocusEffect(
  React.useCallback(() => {

    loadDashboard();

  }, [])
);

  const handleDutyOn =
  async () => {

    const data =
      await dutyOn();

    if (
      data.success ||
      data.message ===
        "Already On Duty"
    ) {

      setOnDuty(true);

      router.push(
        "/routes"
      );

    } else {

      Alert.alert(
        "Error",
        data.message
      );

    }

  };

  const handleDutyOff =
  async () => {

    const data =
      await dutyOff();

    if (data.success) {

      setOnDuty(false);

      Alert.alert(
        "Success",
        "Duty Off"
      );
    }
  };

  const handleStartTrip =
    async (tripType: string) => {

      try {

        const data =
          await startTrip(
            tripType,
            routeId
          );

        if (data.success) {

          Alert.alert(
            "Success",
            `${tripType} Trip Started`
          );

          setActiveTrip(
  data.trip
);

      router.push({
        pathname: "/students" as any,
        params: {
          tripId: data.trip._id,
        },
      });
        }

      } catch (error) {

        Alert.alert(
          "Error",
          "Failed to start trip"
        );

      }
    };

  const handleEndTrip =
    async () => {

      try {

        const data =
          await endTrip(
            activeTrip._id
          );

        if (data.success) {

           stopLocationTracking();

          Alert.alert(
            "Success",
            "Trip Completed"
          );

           console.log(
           "Trip Ended"
            );

          setActiveTrip(
            null
          );
          await loadDashboard();

        }

      } catch (error) {

        Alert.alert(
          "Error",
          "Failed to end trip"
        );

      }
    };

  const handleLogout =
    async () => {

      await AsyncStorage.removeItem(
        "token"
      );

      await AsyncStorage.removeItem(
        "user"
      );

      router.replace("/");
    };

  if (loading) {

    return (
      <View
        style={styles.loader}
      >
        <ActivityIndicator
          size="large"
        />
      </View>
    );
  }

  return (
  <ScrollView
    style={styles.container}
    showsVerticalScrollIndicator={false}
  >

      {/* <TouchableOpacity
      onPress={() => router.replace("/")}
    >
      <Text style={styles.backBtn}>
        ← Back
      </Text>
    </TouchableOpacity> */}

      {/* <Text
        style={styles.title}
      >
        Driver Dashboard
      </Text>

      {bus && (
        <View
          style={styles.infoCard}
        >

          <Text
            style={styles.infoText}
          >
            🚌 Bus:
            {" "}
            {bus.busNumber}
          </Text>

          <Text
            style={styles.infoText}
          >
           🛣 Route:
            {routeName ||
            bus?.routeId?.routeName}
          </Text>

        </View>
      )} */}

    <View style={styles.heroCard}>

  <Image
    source={require("../../assets/images/driver.png")}
    style={styles.heroImage}
    resizeMode="contain"
  />

  <View style={styles.overlayContent}>

   <Animated.Text
  style={[
    styles.greeting,
    {
      opacity: greetingOpacity,
    },
  ]}
>
  Hello,
</Animated.Text>

<Animated.Text
  style={[
    styles.driverName,
    {
      opacity: nameOpacity,
    },
  ]}
>
  {bus?.driverId?.name}
</Animated.Text>

{/* <Text style={styles.subText}>
  This is your Dashboard
</Text> */}

   <Animated.Text
  style={[
    styles.busNumber,
    {
      opacity: busOpacity,
    },
  ]}
>
  {bus?.busNumber}
</Animated.Text>

    <Animated.Text
  style={[
    styles.vehicleNumber,
    {
      opacity: vehicleOpacity,
    },
  ]}
>
  {bus?.vehicleNumber}
</Animated.Text>

  </View>

</View>


<View style={styles.statsContainer}>

  <View style={styles.statCard}>
    <Text style={styles.statNumber}>
      {onDuty ? "ON" : "OFF"}
    </Text>

    <Text style={styles.statLabel}>
      Duty
    </Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statNumber}>
      {activeTrip ? "1" : "0"}
    </Text>

    <Text style={styles.statLabel}>
      Active Trip
    </Text>
  </View>

</View>

      {!activeTrip ? (

        !onDuty ? (

          <TouchableOpacity
            style={styles.pickupBtn}
            onPress={handleDutyOn}
          >
            <Text
              style={styles.btnText}
            >
              DUTY ON
            </Text>
          </TouchableOpacity>

        ) : (

          <TouchableOpacity
            style={styles.dropBtn}
            onPress={() =>
              router.replace("/routes")
            }
          >
            <Text
              style={styles.btnText}
            >
              VIEW ROUTES
            </Text>
          </TouchableOpacity>

        )

      ) : (
        <>

          <View
            style={
              styles.activeTripCard
            }
          >

            <Text
              style={
                styles.activeTripText
              }
            >
              Active Trip
            </Text>

            <Text
              style={
                styles.activeTripText
              }
            >
              Type:
              {" "}
              {
                activeTrip.tripType
              }
            </Text>

          </View>

          <TouchableOpacity
            style={styles.endBtn}
            onPress={
              handleEndTrip
            }
          >
            <Text
              style={styles.btnText}
            >
              End Trip
            </Text>
          </TouchableOpacity>

        </>
      )}


      <TouchableOpacity
        style={{
          backgroundColor:
            "#6a1b9a",
          padding: 15,
          borderRadius: 10,
          marginTop: 15,
        }}
        onPress={() =>
          router.push(
            "/trip-history"
          )
        }
>
  <Text
    style={{
      color: "#fff",
      textAlign:
        "center",
      fontWeight:
        "bold",
    }}
  >
    Trip History
  </Text>


   

</TouchableOpacity>


    {onDuty && (
          <TouchableOpacity
            style={styles.endBtn}
            onPress={handleDutyOff}
          >
            <Text
              style={styles.btnText}
            >
              DUTY OFF
            </Text>
          </TouchableOpacity>
        )}

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={
          handleLogout
        }
      >
        <Text
          style={styles.btnText}
        >
          Logout
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      padding: 20,
      backgroundColor:
        "#FFFFFF",
    },

    loader: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 20,
    },

    infoCard: {
      backgroundColor:
        "#fff",
      padding: 20,
      borderRadius: 12,
      marginBottom: 20,
      elevation: 3,
    },

    infoText: {
      fontSize: 18,
      marginBottom: 8,
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
      marginBottom: 15,
    },

    endBtn: {
      backgroundColor:
        "#d32f2f",
      padding: 18,
      borderRadius: 12,
      marginTop: 10,
    },

    logoutBtn: {
      backgroundColor:
        "#616161",
      padding: 18,
      borderRadius: 12,
      marginTop: 20,
    },

    btnText: {
      color: "#fff",
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
    },

    activeTripCard: {
      backgroundColor:
        "#fff",
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
    },

    activeTripText: {
      fontSize: 18,
      fontWeight: "bold",
    },

    backBtn: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
  },

 heroCard: {
  backgroundColor: "transparent",
  marginBottom: 20,
  position: "relative",
},


heroImage: {
  width: "100%",
  height: 260,
},

overlayContent: {
  position: "absolute",
  right: 25,
  top: 60,
  width: 170,
  alignItems: "center",
},

greeting: {
  fontSize: 25,
  fontWeight: "bold",
  color: "#1565c0",
  marginLeft: 50
},

// driverName: {
//   fontSize: 26,
//   fontWeight: "bold",
//   color: "#222",
//   marginTop: 2,
// },


// subText: {
//   fontSize: 18,
//   color: "#666",
//   marginTop: 10,
//   textAlign: "center",
// },

busNumber: {
      position: "absolute",

      top: -3,
      left: -110,

      width: 60,

      fontSize: 14,
      fontWeight: "700",

      color: "#FFFFFF",

      backgroundColor: "#1E293B",

      paddingHorizontal: 8,
      paddingVertical: 3,

      borderRadius: 3,

      zIndex: 100,
    },

vehicleNumber: {
      position: "absolute",

      top: 110,
      left: -128,

      fontSize: 12,
      fontWeight: "700",

       width: 100, 

      color: "#FFFFFF",

      backgroundColor: "#1E293B",

      paddingHorizontal: 8,
      paddingVertical: 3,

      borderRadius: 10,

      zIndex: 100,
    },

driverName: {
  fontSize: 25,
  fontWeight: "bold",
  color: "#222",
  marginTop: 5,
  marginLeft:55
},

busText: {
  fontSize: 20,
  fontWeight: "600",
  marginTop: 10,
},

vehicleText: {
  fontSize: 18,
  color: "#555",
  marginTop: 4,
},

statsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 20,
},

statCard: {
  flex: 1,
  backgroundColor: "#fff",
  marginHorizontal: 5,
  padding: 20,
  borderRadius: 15,
  alignItems: "center",
  elevation: 3,
},

statNumber: {
  fontSize: 26,
  fontWeight: "bold",
  color: "#1565c0",
},

statLabel: {
  fontSize: 14,
  color: "#555",
  marginTop: 5,
},
});