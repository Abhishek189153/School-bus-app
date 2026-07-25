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
  Linking,
} from "react-native";

import  WebView  from "react-native-webview";

import { router, useFocusEffect } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getMyBusLocation,
} from "../services/mobile.service";

export default function BusLocation() {

  console.log(
  "BUS LOCATION SCREEN RENDERED"
);

  const [location, setLocation] =
    useState<any>(null);

  const [stops, setStops] =
  useState([]);

  const [pickupStop, setPickupStop] =
  useState<any>(null);

  const [
    darkMode,
    setDarkMode,
  ] = useState(false);

  const [distance, setDistance] =
  useState("");

  const [eta, setEta] =
  useState("");

  const webViewRef =
  useRef<WebView>(null);

  const loadTheme = async () => {

  const theme =
    await AsyncStorage.getItem(
      "darkMode"
    );

  setDarkMode(
    theme === "true"
  );

};

useEffect(() => {

  loadTheme();

}, []);

  useEffect(() => {

    loadLocation();

    const interval =
      setInterval(
        loadLocation,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  useEffect(() => {

  if (
    !location ||
    !webViewRef.current
  ) return;

 webViewRef.current.injectJavaScript(
`
if(window.busMarker){

  busMarker.setLatLng([
    ${location.latitude},
    ${location.longitude}
  ]);

}

if(window.routeLine){

  map.removeLayer(
    window.routeLine
  );

}

(async () => {

const response =
  await fetch(
    "https://router.project-osrm.org/route/v1/driving/" +
    "${location.longitude}," +
    "${location.latitude};" +
    "${pickupStop?.longitude}," +
    "${pickupStop?.latitude}" +
    "?overview=full&geometries=geojson"
  );

const data =
  await response.json();

const coordinates =
  data.routes[0]
    .geometry
    .coordinates
    .map(
      point => [
        point[1],
        point[0]
      ]
    );

window.routeLine =
  L.polyline(
    coordinates,
    {
      color: "#1976D2",
      weight: 5,
    }
  ).addTo(map);

})();

true;

true;
`
);

}, [location, pickupStop]);

  const loadLocation =
    async () => {

      try {

        const data =
          await getMyBusLocation();

        if (
  data.success &&
  data.location
) {

  console.log(
    "API RESPONSE:",
    data
  );

  console.log(
    "PICKUP STOP:",
    data.pickupStop
  );

  setLocation(
    data.location
  );

  setPickupStop(
    data.pickupStop
  );

  setStops(
  data.stops || []
);

}

      } catch (error) {

        console.log(error);

      }

    };

    const mapHtml = `
<!DOCTYPE html>
<html>
<head>

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet/dist/leaflet.css"
/>

<style>

html,
body,
#map {

  height: 100%;
  margin: 0;
  padding: 0;

}

</style>

</head>

<body>

<div id="map"></div>

<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

<script>

const map =
  L.map("map").setView(
    [
      ${location?.latitude || 30.3165},
      ${location?.longitude || 78.0322}
    ],
    15
  );

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    attribution:
      "&copy; OpenStreetMap contributors",
    maxZoom: 20,
  }
).addTo(map);

const busIcon =
  L.divIcon({

    html:
      '<div style="font-size:40px;">🚌</div>',

    className: '',

    iconSize: [40, 40],

    iconAnchor: [20, 20],

  });

window.busMarker =
  L.marker(
    [
      ${location?.latitude || 30.3165},
      ${location?.longitude || 78.0322}
    ],
    {
      icon: busIcon,
    }
  )
  .addTo(map)
  .bindPopup("🚌 School Bus");

${
  pickupStop
    ? `


const pickupIcon =
  L.divIcon({

    html:
      '<div style="font-size:30px;">🚩</div>',

    className: '',

    iconSize: [30,30],

  });

const stopIcon =
  L.divIcon({


    html:
      '<div style="font-size:22px;">📍</div>',

    className: '',

    iconSize: [22,22],

  });

window.pickupMarker =
  L.marker(
    [
      ${pickupStop.latitude},
      ${pickupStop.longitude}
    ],
    {
      icon: pickupIcon,
    }
  )
  .addTo(map)
  .bindPopup(
    "📍 ${pickupStop.stopName}"
  );

window.routeStops =
  ${JSON.stringify(stops)};

routeStops.forEach(
  stop => {

    if(
      stop.stopName ===
      "${pickupStop.stopName}"
    ){
      return;
    }

    L.marker(
      [
        stop.latitude,
        stop.longitude
      ],
      {
        icon: stopIcon,
      }
    )
    .addTo(map)
    .bindPopup(
      "📍 " +
      stop.stopName
    );

  }
);

`
    : ""
}
${
  pickupStop
    ? `
async function drawRoadRoute() {

  const response =
    await fetch(
      "https://router.project-osrm.org/route/v1/driving/" +
      "${location?.longitude}," +
      "${location?.latitude};" +
      "${pickupStop?.longitude}," +
      "${pickupStop?.latitude}" +
      "?overview=full&geometries=geojson"
    );

  const data =
    await response.json();

  const route =
    data.routes[0];

  const coordinates =
    route.geometry.coordinates.map(
      point => [
        point[1],
        point[0]
      ]
    );

  window.routeLine =
    L.polyline(
      coordinates,
      {
        color: "#1976D2",
        weight: 5,
      }
    ).addTo(map);

  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      distance:
        (
          route.distance /
          1000
        ).toFixed(2),

      eta:
        Math.ceil(
          route.duration /
          60
        ),
    })
  );

}

drawRoadRoute();
`
    : ""
}

window.map = map;



</script>

</body>
</html>
`;

  const openMap = () => {

    if (!location) return;

    Linking.openURL(
      `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    );

    // If you want direct navigation,
    // replace the above with:
    //
    // Linking.openURL(
    //   `google.navigation:q=${location.latitude},${location.longitude}`
    // );
  };

  console.log(
  "CURRENT PICKUP STOP:",
  pickupStop
);

  if (!location) {

    return (

      <View
        style={styles.loader}
      >

        <TouchableOpacity
          onPress={() =>
            router.replace(
              "/parent-dashboard"
            )
          }
          style={styles.backBtn}
        >
          <Text
            style={styles.backText}
          >
            ← Back
          </Text>
        </TouchableOpacity>

        <Text
          style={styles.loadingText}
        >
          Fetching Bus Location...
        </Text>

      </View>

    );

  }

 return (

  <View
    style={{
      flex: 1,
    }}
  >

    <TouchableOpacity
      onPress={() =>
        router.replace(
          "/parent-dashboard"
        )
      }
      style={{
        position: "absolute",
        top: 22,
        left: 50,
        zIndex: 999,

        backgroundColor:
  darkMode
    ? "#1E293B"
    : "#FFFFFF",

        padding: 10,

        borderRadius: 8,
      }}
    >

      <Text
  style={{
    color:
      darkMode
        ? "#FFFFFF"
        : "#000000",
  }}
>
  ← Back
</Text>

    </TouchableOpacity>

   <View
  style={{
    flex: 1,
  }}
>

  <WebView
  ref={webViewRef}

  onMessage={(event) => {

    const data =
      JSON.parse(
        event.nativeEvent.data
      );

    setDistance(
      data.distance
    );

    setEta(
      data.eta
    );

  }}

  originWhitelist={["*"]}
  source={{
    html: mapHtml,
  }}
  style={{
    flex: 1,
  }}
/>

  <View
    style={{
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor:
      darkMode
        ? "#1E293B"
        : "#FFFFFF",
      padding: 12,
      borderRadius: 10,
    }}
  >

    {/* <Text>
      Latitude:
      {" "}
      {location.latitude}
    </Text>

    <Text>
      Longitude:
      {" "}
      {location.longitude}
    </Text> */}

    {pickupStop && (

  <>

   <Text style={{ marginTop: 10,  color:
      darkMode
        ? "#FFFFFF"
        : "#000000", }}>
  <Text style={{ fontWeight: "bold" }}>
    Pickup Stop:
  </Text>
  {" "}
  {pickupStop.stopName}
</Text>

<Text style={{ marginTop: 10,  color:
      darkMode
        ? "#FFFFFF"
        : "#000000", }}>
  <Text style={{ fontWeight: "bold" }}>
    Distance:
  </Text>
  {" "}
  {distance} km
</Text>

<Text style={{ marginTop: 10 ,  color:
      darkMode
        ? "#FFFFFF"
        : "#000000"}}>
  <Text style={{ fontWeight: "bold" }}>
    ETA:
  </Text>
  {" "}
  {eta} min
</Text>
  </>

)}

  </View>

</View>

  </View>

);

}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        "#F5F7FB",
      paddingHorizontal: 20,
      paddingTop: 90,
    },

    loader: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      backgroundColor:
        "#F5F7FB",
    },

    loadingText: {
      fontSize: 16,
      color: "#64748B",
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      color: "#1E293B",
    },

    subtitle: {
      textAlign: "center",
      color: "#64748B",
      marginTop: 10,
      marginBottom: 40,
      fontSize: 15,
      lineHeight: 22,
    },

    card: {
      backgroundColor:
        "#FFFFFF",

      borderRadius: 24,

      padding: 30,

      alignItems: "center",

      shadowColor: "#000",

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.1,

      shadowRadius: 10,

      elevation: 6,
    },

    busIcon: {
      fontSize: 70,
      marginBottom: 20,
    },

    cardTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: "#1E293B",
      marginBottom: 12,
    },

    cardSubtitle: {
      textAlign: "center",
      color: "#64748B",
      lineHeight: 24,
      fontSize: 15,
      marginBottom: 30,
    },

    trackButton: {
      backgroundColor:
        "#1976D2",

      paddingHorizontal: 35,

      paddingVertical: 14,

      borderRadius: 14,

      elevation: 4,
    },

    trackText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },

    backBtn: {
      position: "absolute",
      top: 40,
      left: 20,
      zIndex: 100,

      backgroundColor:
        "#FFFFFF",

      paddingHorizontal: 14,

      paddingVertical: 8,

      borderRadius: 10,

      shadowColor: "#000",

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.1,

      shadowRadius: 4,

      elevation: 3,
    },

    backText: {
      color: "#1976D2",
      fontSize: 16,
      fontWeight: "600",
    },

  });