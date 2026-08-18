import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
} from "react-native";

import { scaleH } from "../utils/responsive";

import WebView
  from "react-native-webview";

import {
  getMyBusLocation,
} from "../services/mobile.service";


export default function ParentMiniMap() {

  const [
    distance,
    setDistance,
  ] = useState("");

  const [
    eta,
    setEta,
  ] = useState("");

  const [
    location,
    setLocation,
  ] = useState<any>(null);

  const [
    studentStop,
    setStudentStop,
  ] = useState<any>(null);

  const [
    stops,
    setStops,
  ] = useState<any[]>([]);

  const [
    tripType,
    setTripType,
  ] = useState<string | null>(null);

  const [
    activeTrip,
    setActiveTrip,
  ] = useState(false);


  // ==========================================
  // LOAD BUS DATA
  // ==========================================

  useEffect(() => {

    loadData();

    const interval =
      setInterval(
        loadData,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);


  // ==========================================
  // LOAD DATA FROM BACKEND
  // ==========================================

  const loadData =
    async () => {

      try {

        const data =
          await getMyBusLocation();


        console.log(
          "MINI MAP RESPONSE:",
          data
        );


        if (
          !data?.success
        ) {

          return;

        }


        // ======================================
        // LOCATION
        // ======================================

        setLocation(
          data.location || null
        );


        // ======================================
        // STUDENT STOP
        //
        // IMPORTANT:
        // Backend returns studentStop
        // NOT pickupStop
        // ======================================

        setStudentStop(
          data.studentStop || null
        );


        // ======================================
        // ROUTE STOPS
        // ======================================

        setStops(
          Array.isArray(
            data.stops
          )
            ? data.stops
            : []
        );


        // ======================================
        // TRIP TYPE
        // PICKUP / DROP
        // ======================================

        setTripType(
          data.tripType || null
        );


        // ======================================
        // ACTIVE TRIP
        // ======================================

        setActiveTrip(
          data.activeTrip === true
        );


        // ======================================
        // IMPORTANT
        //
        // If trip is not active,
        // don't show old ETA/distance.
        // ======================================

        if (
          data.activeTrip !== true
        ) {

          setDistance("");

          setEta("");

        }

      } catch (error) {

        console.log(
          "MINI MAP ERROR:",
          error
        );

      }

    };


  // ==========================================
  // CHECK WHETHER LOCATION EXISTS
  // ==========================================

  const hasLocation =
    location &&
    typeof location.latitude ===
      "number" &&
    typeof location.longitude ===
      "number";


  // ==========================================
  // CHECK WHETHER STUDENT STOP EXISTS
  // ==========================================

  const hasStudentStop =
    studentStop &&
    typeof studentStop.latitude ===
      "number" &&
    typeof studentStop.longitude ===
      "number";


  // ==========================================
  // MAP HTML
  // ==========================================

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


// ==========================================
// DATA FROM REACT NATIVE
// ==========================================

const busLatitude =
  ${hasLocation
    ? location.latitude
    : "null"};

const busLongitude =
  ${hasLocation
    ? location.longitude
    : "null"};


const studentStopLatitude =
  ${hasStudentStop
    ? studentStop.latitude
    : "null"};

const studentStopLongitude =
  ${hasStudentStop
    ? studentStop.longitude
    : "null"};


const tripType =
  ${JSON.stringify(
    tripType
  )};


const activeTrip =
  ${activeTrip};


const routeStops =
  ${JSON.stringify(
    stops || []
  )};


// ==========================================
// DETERMINE MAP CENTER
// ==========================================

let centerLatitude = 30.0687;

let centerLongitude = 78.2421;


// ------------------------------------------
// Prefer bus location
// ------------------------------------------

if (
  busLatitude !== null &&
  busLongitude !== null
) {

  centerLatitude =
    busLatitude;

  centerLongitude =
    busLongitude;

}


// ------------------------------------------
// Otherwise use student stop
// ------------------------------------------

else if (
  studentStopLatitude !== null &&
  studentStopLongitude !== null
) {

  centerLatitude =
    studentStopLatitude;

  centerLongitude =
    studentStopLongitude;

}


// ------------------------------------------
// Otherwise use first route stop
// ------------------------------------------

else if (
  routeStops.length > 0 &&
  typeof routeStops[0].latitude === "number" &&
  typeof routeStops[0].longitude === "number"
) {

  centerLatitude =
    routeStops[0].latitude;

  centerLongitude =
    routeStops[0].longitude;

}


// ==========================================
// CREATE MAP
// ==========================================

const map =
  L.map("map").setView(
    [
      centerLatitude,
      centerLongitude
    ],
    14
  );


// ==========================================
// MAP TILES
// ==========================================

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,

    subdomains: "abcd",

    attribution:
      '&copy; '
  }
).addTo(map)
 .on("tileerror", function (error) {

   // A gray patch is usually a tile that failed or was too slow to
   // load — Leaflet never retries it on its own. Re-request the same
   // tile (with a cache-busting query so it isn't served the same
   // failed response) after a short delay instead of leaving the
   // gray square permanently.

   const originalSrc =
     error.tile.src.split("?")[0];

   setTimeout(function () {

     error.tile.src =
       originalSrc + "?retry=" + Date.now();

   }, 800);

 });


// ==========================================
// BUS ICON
// ==========================================

const busIcon =
  L.divIcon({

    html:
      '<div style="font-size:28px;">🚌</div>',

    className: "",

    iconSize:
      [30, 30],

    iconAnchor:
      [15, 15],

  });


// ==========================================
// STUDENT STOP ICON
// ==========================================

const stopIcon =
  L.divIcon({

    html:
      '<div style="font-size:26px;">📍</div>',

    className: "",

    iconSize:
      [30, 30],

    iconAnchor:
      [15, 30],

  });


// ==========================================
// ADD BUS MARKER
// ==========================================

let busMarker = null;


if (
  busLatitude !== null &&
  busLongitude !== null
) {

  busMarker =
    L.marker(
      [
        busLatitude,
        busLongitude
      ],
      {
        icon:
          busIcon
      }
    )
    .addTo(map)
    .bindPopup(
      activeTrip
        ? (
            tripType === "DROP"
              ? "🏫 Drop Trip - Bus"
              : "🚌 Pickup Trip - Bus"
          )
        : "🚌 Last Known Bus Location"
    );

}


// ==========================================
// ADD ALL ROUTE STOPS
// ==========================================

const routePoints = [];


routeStops.forEach(
  (stop) => {

    if (
      typeof stop.latitude !== "number" ||
      typeof stop.longitude !== "number"
    ) {

      return;

    }


    routePoints.push([
      stop.latitude,
      stop.longitude
    ]);


    L.circleMarker(
      [
        stop.latitude,
        stop.longitude
      ],
      {
        radius: 5,

        color: "#1565C0",

        fillColor: "#FFFFFF",

        fillOpacity: 1,

        weight: 2,
      }
    )
    .addTo(map)
    .bindPopup(
      stop.stopName || "Stop"
    );

  }
);


// ==========================================
// ADD STUDENT STOP
// ==========================================

let studentStopMarker = null;


if (
  studentStopLatitude !== null &&
  studentStopLongitude !== null
) {

  studentStopMarker =
    L.marker(
      [
        studentStopLatitude,
        studentStopLongitude
      ],
      {
        icon:
          stopIcon
      }
    )
    .addTo(map)
    .bindPopup(
      ${
        JSON.stringify(
          tripType === "DROP"
            ? "Drop Stop: "
            : "Pickup Stop: "
        )
      } +
      ${
        JSON.stringify(
          studentStop?.stopName || "Student Stop"
        )
      }
    );

}


// ==========================================
// FIT MAP TO BUS + STUDENT STOP
// ==========================================

const boundsPoints = [];


if (
  busLatitude !== null &&
  busLongitude !== null
) {

  boundsPoints.push([
    busLatitude,
    busLongitude
  ]);

}


if (
  studentStopLatitude !== null &&
  studentStopLongitude !== null
) {

  boundsPoints.push([
    studentStopLatitude,
    studentStopLongitude
  ]);

}


if (
  boundsPoints.length >= 2
) {

  map.fitBounds(
    boundsPoints,
    {
      padding:
        [25, 25]
    }
  );

}

else if (
  boundsPoints.length === 1
) {

  map.setView(
    boundsPoints[0],
    14
  );

}


// ==========================================
// FIX FOR GRAY/BLANK TILE BOX ON ANDROID
//
// A fixed delay before invalidateSize() is a guess — on a slow
// device or slow WebView startup, the container can still be
// settling after that timeout fires, so the gray box comes back
// intermittently. ResizeObserver instead reacts to the container's
// ACTUAL size changing, however long that takes, so it can't miss.
// ==========================================

const mapContainer = document.getElementById("map");

function refreshMapSize() {

  map.invalidateSize();

  if (boundsPoints.length >= 2) {

    map.fitBounds(boundsPoints, { padding: [25, 25] });

  } else if (boundsPoints.length === 1) {

    map.setView(boundsPoints[0], 14);

  }

}

if (typeof ResizeObserver !== "undefined") {

  const resizeObserver = new ResizeObserver(function () {

    refreshMapSize();

  });

  resizeObserver.observe(mapContainer);

}

// fallback for older WebViews without ResizeObserver support,
// plus a couple of retries in case layout is still settling
setTimeout(refreshMapSize, 300);
setTimeout(refreshMapSize, 1000);

window.addEventListener("resize", refreshMapSize);


// ==========================================
// ACTIVE TRIP ONLY
//
// Calculate route + ETA.
// ==========================================

async function getRoute() {


  if (
    !activeTrip
  ) {

    return;

  }


  if (
    busLatitude === null ||
    busLongitude === null
  ) {

    return;

  }


  if (
    studentStopLatitude === null ||
    studentStopLongitude === null
  ) {

    return;

  }


  try {

    const response =
      await fetch(

        "https://router.project-osrm.org/route/v1/driving/" +

        busLongitude +
        "," +
        busLatitude +

        ";" +

        studentStopLongitude +
        "," +
        studentStopLatitude +

        "?overview=full&geometries=geojson"

      );


    if (
      !response.ok
    ) {

      return;

    }


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


    // ======================================
    // ROUTE LINE
    // ======================================

    const coordinates =
      route.geometry.coordinates.map(
        point => [
          point[1],
          point[0]
        ]
      );


    L.polyline(
      coordinates,
      {

        color:
          "#1976D2",

        weight:
          4,

        opacity:
          0.8,

      }
    )
    .addTo(map);


    // ======================================
    // DISTANCE + ETA
    // ======================================

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


  } catch (error) {

    console.log(
      "OSRM ERROR",
      error
    );

  }

}


getRoute();


</script>

</body>

</html>

`;


  // ==========================================
  // RETURN UI
  // ==========================================

  return (

    <View
      style={{
        height:
          scaleH(290),

        borderRadius:
          20,

        overflow:
          "hidden",

        backgroundColor:
          "#fff",
      }}
    >


      {/* ======================================
          HEADER
      ====================================== */}

      <View
        style={{
          padding:
            10,

          backgroundColor:
            "#1565C0",
        }}
      >

        <Text
          style={{
            color:
              "#fff",

            fontWeight:
              "bold",

            textAlign:
              "center",
          }}
        >

          ETA:
          {" "}

          {
            activeTrip
              ? (
                  eta ||
                  "--"
                )
              : "--"
          }

          {" "}
          mins

          {" | "}

          Distance:
          {" "}

          {
            activeTrip
              ? (
                  distance ||
                  "--"
                )
              : "--"
          }

          {" "}
          km

        </Text>

      </View>


      {/* ======================================
          MAP
      ====================================== */}

      <WebView

        originWhitelist={[
          "*"
        ]}

        source={{
          html:
            mapHtml,
        }}

        javaScriptEnabled={
          true
        }

        domStorageEnabled={
          true
        }

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


            setDistance(
              data.distance ||
              ""
            );


            setEta(
              data.eta ||
              ""
            );

          } catch (
            error
          ) {

            console.log(
              "MINI MAP MESSAGE ERROR:",
              error
            );

          }

        }}

        style={{
          flex:
            1,
        }}

      />

    </View>

  );

}
