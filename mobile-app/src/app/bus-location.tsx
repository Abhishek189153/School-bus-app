import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

import WebView from "react-native-webview";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getMyBusLocation,
} from "../services/mobile.service";


export default function BusLocation() {

  console.log(
    "BUS LOCATION SCREEN RENDERED"
  );


  // =====================================================
  // STATE
  // =====================================================

  const [
    location,
    setLocation,
  ] = useState<any>(null);


  const [
    stops,
    setStops,
  ] = useState<any[]>([]);


  const [
    studentStop,
    setStudentStop,
  ] = useState<any>(null);


  const [
    tripType,
    setTripType,
  ] = useState<string | null>(null);


  const [
    darkMode,
    setDarkMode,
  ] = useState(false);


  const [
    distance,
    setDistance,
  ] = useState("");


  const [
    eta,
    setEta,
  ] = useState("");


  const [
    mapLoaded,
    setMapLoaded,
  ] = useState(false);


  const webViewRef =
    useRef<WebView>(null);


  // =====================================================
  // LOAD THEME
  // =====================================================

  const loadTheme =
    async () => {

      try {

        const theme =
          await AsyncStorage.getItem(
            "darkMode"
          );

        setDarkMode(
          theme === "true"
        );

      } catch (error) {

        console.log(
          "THEME ERROR:",
          error
        );

      }

    };


  // =====================================================
  // LOAD LOCATION
  // =====================================================

  const loadLocation =
    async () => {

      try {

        const data =
          await getMyBusLocation();


        console.log(
          "BUS LOCATION API:",
          data
        );


        if (
          data?.success &&
          data?.location
        ) {

          setLocation(
            data.location
          );


          setStudentStop(
            data.studentStop || null
          );


          setTripType(
            data.tripType || null
          );


          setStops(
            data.stops || []
          );


          console.log(
            "TRIP TYPE:",
            data.tripType
          );


          console.log(
            "STUDENT STOP:",
            data.studentStop
          );


          console.log(
            "ROUTE STOPS:",
            data.stops
          );

        }

      } catch (error) {

        console.log(
          "LOAD BUS LOCATION ERROR:",
          error
        );

      }

    };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadTheme();

    loadLocation();

  }, []);


  // =====================================================
  // REFRESH BUS LOCATION EVERY 5 SECONDS
  // =====================================================

  useEffect(() => {

    const interval =
      setInterval(
        () => {

          loadLocation();

        },
        5000
      );


    return () => {

      clearInterval(
        interval
      );

    };

  }, []);


  // =====================================================
  // UPDATE EXISTING MAP
  // =====================================================

  useEffect(() => {

    if (
      !location ||
      !webViewRef.current ||
      !mapLoaded
    ) {

      return;

    }


    const latitude =
      Number(
        location.latitude
      );


    const longitude =
      Number(
        location.longitude
      );


    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {

      return;

    }


    const studentLatitude =
      Number(
        studentStop?.latitude
      );


    const studentLongitude =
      Number(
        studentStop?.longitude
      );


    const studentStopName =
      studentStop?.stopName || "";


    const javascript = `

      (function() {

        // ============================================
        // UPDATE BUS MARKER
        // ============================================

        if (
          window.busMarker
        ) {

          window.busMarker.setLatLng([
            ${latitude},
            ${longitude}
          ]);

        }


        // ============================================
        // UPDATE STUDENT STOP
        // ============================================

        if (
          window.studentStopMarker &&
          ${!Number.isNaN(studentLatitude)} &&
          ${!Number.isNaN(studentLongitude)}
        ) {

          window.studentStopMarker.setLatLng([
            ${studentLatitude},
            ${studentLongitude}
          ]);

        }


        // ============================================
        // REMOVE OLD ROUTE
        // ============================================

        if (
          window.routeLine
        ) {

          map.removeLayer(
            window.routeLine
          );

          window.routeLine = null;

        }


        // ============================================
        // DRAW ROAD ROUTE
        // ============================================

        if (
          ${!Number.isNaN(studentLatitude)} &&
          ${!Number.isNaN(studentLongitude)}
        ) {

          fetch(
            "https://router.project-osrm.org/route/v1/driving/" +
            "${longitude},${latitude};" +
            "${studentLongitude},${studentLatitude}" +
            "?overview=full&geometries=geojson"
          )
          .then(
            response =>
              response.json()
          )
          .then(
            data => {

              if (
                !data.routes ||
                !data.routes.length
              ) {

                return;

              }


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
          )
          .catch(
            error => {

              console.log(
                "OSRM ERROR:",
                error
              );

            }
          );

        }

      })();

      true;

    `;


    webViewRef.current.injectJavaScript(
      javascript
    );


  }, [
    location,
    studentStop,
    mapLoaded,
  ]);


  // =====================================================
  // MAP HTML
  // =====================================================

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

  width: 100%;

  margin: 0;

  padding: 0;

}

</style>

</head>


<body>

<div id="map"></div>


<script
  src="https://unpkg.com/leaflet/dist/leaflet.js">
</script>


<script>

  // ==================================================
  // INITIAL LOCATION
  // ==================================================

  const initialLatitude =
    ${location?.latitude || 30.3165};


  const initialLongitude =
    ${location?.longitude || 78.0322};


  const map =
    L.map(
      "map"
    ).setView(
      [
        initialLatitude,
        initialLongitude
      ],
      15
    );


  // ==================================================
  // MAP TILES
  // ==================================================

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {

      attribution:
        "&copy; OpenStreetMap contributors",

      maxZoom: 20,

    }
  ).addTo(
    map
  );


  // ==================================================
  // BUS ICON
  // ==================================================

  const busIcon =
    L.divIcon({

      html:
        '<div style="font-size:40px;">🚌</div>',

      className: "",

      iconSize: [
        40,
        40
      ],

      iconAnchor: [
        20,
        20
      ],

    });


  // ==================================================
  // STUDENT STOP ICON
  // ==================================================

  const studentStopIcon =
    L.divIcon({

      html:
        '<div style="font-size:30px;">🚩</div>',

      className: "",

      iconSize: [
        30,
        30
      ],

      iconAnchor: [
        15,
        15
      ],

    });


  // ==================================================
  // NORMAL STOP ICON
  // ==================================================

  const stopIcon =
    L.divIcon({

      html:
        '<div style="font-size:22px;">📍</div>',

      className: "",

      iconSize: [
        22,
        22
      ],

      iconAnchor: [
        11,
        11
      ],

    });


  // ==================================================
  // BUS MARKER
  // ==================================================

  window.busMarker =
    L.marker(
      [
        initialLatitude,
        initialLongitude
      ],
      {
        icon:
          busIcon,
      }
    )
    .addTo(
      map
    )
    .bindPopup(
      "🚌 School Bus"
    );


  // ==================================================
  // STUDENT STOP
  // ==================================================

  const studentStop =
    ${JSON.stringify(
      studentStop || null
    )};


  if (
    studentStop &&
    studentStop.latitude != null &&
    studentStop.longitude != null
  ) {

    window.studentStopMarker =
      L.marker(
        [
          studentStop.latitude,
          studentStop.longitude
        ],
        {
          icon:
            studentStopIcon,
        }
      )
      .addTo(
        map
      )
      .bindPopup(
        "📍 " +
        studentStop.stopName
      );

  }


  // ==================================================
  // ALL ROUTE STOPS
  // ==================================================

  const routeStops =
    ${JSON.stringify(
      stops || []
    )};


  routeStops.forEach(
    stop => {

      if (
        !stop ||
        stop.latitude == null ||
        stop.longitude == null
      ) {

        return;

      }


      // Don't duplicate student's stop

      if (
        studentStop &&
        stop._id &&
        studentStop._id &&
        stop._id === studentStop._id
      ) {

        return;

      }


      // Fallback duplicate check

      if (
        studentStop &&
        stop.stopName ===
          studentStop.stopName &&
        Number(stop.latitude) ===
          Number(studentStop.latitude) &&
        Number(stop.longitude) ===
          Number(studentStop.longitude)
      ) {

        return;

      }


      L.marker(
        [
          stop.latitude,
          stop.longitude
        ],
        {
          icon:
            stopIcon,
        }
      )
      .addTo(
        map
      )
      .bindPopup(
        "📍 " +
        stop.stopName
      );

    }
  );


  // ==================================================
  // DRAW INITIAL ROAD ROUTE
  // ==================================================

  async function drawRoadRoute() {

    if (
      !studentStop ||
      studentStop.latitude == null ||
      studentStop.longitude == null
    ) {

      return;

    }


    try {

      const response =
        await fetch(

          "https://router.project-osrm.org/route/v1/driving/" +

          initialLongitude +
          "," +
          initialLatitude +
          ";" +

          studentStop.longitude +
          "," +
          studentStop.latitude +

          "?overview=full&geometries=geojson"

        );


      const data =
        await response.json();


      if (
        !data.routes ||
        !data.routes.length
      ) {

        return;

      }


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

            color:
              "#1976D2",

            weight:
              5,

          }
        ).addTo(
          map
        );


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


    } catch (
      error
    ) {

      console.log(
        "OSRM ERROR:",
        error
      );

    }

  }


  drawRoadRoute();


  // ==================================================
  // EXPOSE MAP
  // ==================================================

  window.map =
    map;


</script>

</body>

</html>

`;


  // =====================================================
  // OPEN GOOGLE MAP
  // =====================================================

  const openMap =
    () => {

      if (
        !location
      ) {

        return;

      }


      Linking.openURL(
        `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      );

    };


  // =====================================================
  // LOG
  // =====================================================

  console.log(
    "CURRENT TRIP TYPE:",
    tripType
  );


  console.log(
    "CURRENT STUDENT STOP:",
    studentStop
  );


  // =====================================================
  // LOADING
  // =====================================================

  if (
    !location
  ) {

    return (

      <View
        style={
          styles.loader
        }
      >

        <TouchableOpacity
          onPress={() =>
            router.replace(
              "/parent-dashboard"
            )
          }
          style={[
            styles.backBtn,
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
              styles.backText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            ← Back
          </Text>

        </TouchableOpacity>


        <Text
          style={[
            styles.loadingText,
            {
              color:
                darkMode
                  ? "#FFFFFF"
                  : "#64748B",
            },
          ]}
        >
          Fetching Bus Location...
        </Text>

      </View>

    );

  }


  // =====================================================
  // MAIN SCREEN
  // =====================================================

  return (

    <View
      style={{
        flex: 1,
      }}
    >


      {/* ================================================
          BACK BUTTON
      ================================================ */}

      <TouchableOpacity
        onPress={() =>
          router.replace(
            "/parent-dashboard"
          )
        }
        style={[
          styles.topBackBtn,
          {
            backgroundColor:
              darkMode
                ? "#1E293B"
                : "#FFFFFF",
          },
        ]}
      >

        <Text
          style={{
            color:
              darkMode
                ? "#FFFFFF"
                : "#000000",

            fontSize: 16,

            fontWeight:
              "600",
          }}
        >
          ← Back
        </Text>

      </TouchableOpacity>


      {/* ================================================
          MAP
      ================================================ */}

      <WebView

        ref={
          webViewRef
        }

        originWhitelist={[
          "*"
        ]}

        source={{
          html:
            mapHtml,
        }}

        onLoad={() => {

          console.log(
            "MAP WEBVIEW LOADED"
          );

          setMapLoaded(
            true
          );

        }}

        onMessage={(
          event
        ) => {

          try {

            const data =
              JSON.parse(
                event
                  .nativeEvent
                  .data
              );


            if (
              data.distance != null
            ) {

              setDistance(
                data.distance
              );

            }


            if (
              data.eta != null
            ) {

              setEta(
                data.eta
              );

            }

          } catch (
            error
          ) {

            console.log(
              "MAP MESSAGE ERROR:",
              error
            );

          }

        }}

        javaScriptEnabled={
          true
        }

        domStorageEnabled={
          true
        }

        style={{
          flex: 1,
        }}

      />


      {/* ================================================
          INFORMATION CARD
      ================================================ */}

      <View
        style={[
          styles.infoCard,
          {
            backgroundColor:
              darkMode
                ? "#1E293B"
                : "#FFFFFF",
          },
        ]}
      >

        {/* ----------------------------------------------
            TRIP TYPE
        ---------------------------------------------- */}

        <Text
          style={[
            styles.tripTypeText,
            {
              color:
                darkMode
                  ? "#60A5FA"
                  : "#1976D2",
            },
          ]}
        >

          {tripType === "DROP"
            ? "🏫 DROP TRIP"
            : "🚌 PICKUP TRIP"}

        </Text>


        {/* ----------------------------------------------
            STUDENT STOP
        ---------------------------------------------- */}

        {studentStop && (

          <Text
            style={[
              styles.infoText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >

            <Text
              style={
                styles.bold
              }
            >
              {tripType === "DROP"
                ? "Drop Stop:"
                : "Pickup Stop:"}
            </Text>

            {" "}

            {studentStop.stopName}

          </Text>

        )}


        {/* ----------------------------------------------
            DISTANCE
        ---------------------------------------------- */}

        <Text
          style={[
            styles.infoText,
            {
              color:
                darkMode
                  ? "#FFFFFF"
                  : "#000000",
            },
          ]}
        >

          <Text
            style={
              styles.bold
            }
          >
            Distance:
          </Text>

          {" "}

          {distance
            ? `${distance} km`
            : "-- km"}

        </Text>


        {/* ----------------------------------------------
            ETA
        ---------------------------------------------- */}

        <Text
          style={[
            styles.infoText,
            {
              color:
                darkMode
                  ? "#FFFFFF"
                  : "#000000",
            },
          ]}
        >

          <Text
            style={
              styles.bold
            }
          >
            ETA:
          </Text>

          {" "}

          {eta
            ? `${eta} min`
            : "-- min"}

        </Text>

      </View>

    </View>

  );

}


// =======================================================
// STYLES
// =======================================================

const styles =
  StyleSheet.create({

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

      marginTop: 20,

    },


    topBackBtn: {

      position:
        "absolute",

      top:
        22,

      left:
        50,

      zIndex:
        999,

      paddingHorizontal:
        14,

      paddingVertical:
        10,

      borderRadius:
        10,

      elevation:
        5,

    },


    backBtn: {

      position:
        "absolute",

      top:
        40,

      left:
        20,

      zIndex:
        100,

      paddingHorizontal:
        14,

      paddingVertical:
        8,

      borderRadius:
        10,

      elevation:
        3,

    },


    backText: {

      fontSize:
        16,

      fontWeight:
        "600",

    },


    infoCard: {

      position:
        "absolute",

      bottom:
        20,

      left:
        20,

      right:
        20,

      padding:
        14,

      borderRadius:
        12,

      elevation:
        5,

    },


    tripTypeText: {

      fontSize:
        17,

      fontWeight:
        "bold",

      marginBottom:
        8,

    },


    infoText: {

      fontSize:
        15,

      marginTop:
        8,

    },


    bold: {

      fontWeight:
        "bold",

    },

  });