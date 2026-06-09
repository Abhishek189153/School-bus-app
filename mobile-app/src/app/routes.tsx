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
  FlatList,
  BackHandler,
} from "react-native";

import {
  router,useFocusEffect,useLocalSearchParams,
} from "expo-router";

import {
  getAssignedRoutes,
} from "../services/mobile.service";

export default function RoutesScreen() {

  const {
  tripCompleted,
} = useLocalSearchParams();

  const [routes,
    setRoutes] =
    useState<any[]>([]);

  const [
  activeRouteIds,
  setActiveRouteIds,
] = useState<string[]>([]);

  const [busNumber,
    setBusNumber] =
    useState("");

  useFocusEffect(
  React.useCallback(() => {

    loadRoutes();

  }, [])
);

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

  const loadRoutes =
    async () => {

      const data =
        await getAssignedRoutes();

        console.log(
  "Assigned Routes API:",
  data
);

      
      if (data.success) {

        setRoutes(
          data.routes
        );

        setActiveRouteIds(
        data.activeRouteIds || []
      );

        setBusNumber(
          data.busNumber
        );

      }
    };

  return (
    <View
      style={styles.container}
    >

      <TouchableOpacity
      onPress={() => {

  if (
    tripCompleted ===
    "true"
  ) {

    router.replace(
      "/driver-dashboard"
    );

  } else {

    router.back();

  }

}}
    >
      <Text style={styles.backBtn}>
        ← Back
      </Text>
    </TouchableOpacity>

      <Text
        style={styles.title}
      >
        Assigned Routes
      </Text>

      <Text
        style={styles.bus}
      >
        Bus:
        {" "}
        {busNumber}
      </Text>

      <FlatList
        data={routes}
        keyExtractor={(item) =>
          item._id
        }
        renderItem={({ item }) => (

          <TouchableOpacity
           style={[
            styles.routeCard,

            activeRouteIds.includes(
              item._id
            ) && {
              backgroundColor:
                "#2e7d32",
            },

          ]}
            onPress={() =>
              router.push({
                pathname:
                  "/trip-operations",

                params: {
                  routeId:
                    item._id,

                  routeName:
                    item.routeName,
                },
              })
            }
          >

           <Text
            style={
              styles.routeText
            }
          >
            {item.routeName}
          </Text>



            {
  activeRouteIds.includes(
    item._id
  ) && (

    <Text
      style={{
        color: "#fff",
        fontWeight: "bold",
        marginTop: 5,
      }}
    >
      🟢 Active Route
    </Text>

  )
}

<Text
  style={
    styles.routeInfo
  }
>
  {item.pickupRoute}
</Text>

<Text
  style={
    styles.routeInfo
  }
>
  {item.dropRoute}
</Text>

          </TouchableOpacity>

        )}
      />

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      padding: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },

    bus: {
      fontSize: 18,
      marginBottom: 20,
    },

    routeCard: {
      backgroundColor:
        "#1976d2",

      padding: 20,

      borderRadius: 12,

      marginBottom: 12,
    },

    routeText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },

    routeInfo: {
    color: "#e3f2fd",
    fontSize: 12,
    marginTop: 5,
    lineHeight: 18,
},

  backBtn: {
  fontSize: 18,
  fontWeight: "bold",
  marginTop: 20,
  marginBottom: 15,
}

});