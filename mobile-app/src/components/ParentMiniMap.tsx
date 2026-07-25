import React,
{
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
} from "react-native";

import WebView
from "react-native-webview";

import {
  getMyBusLocation,
} from "../services/mobile.service";

export default function ParentMiniMap() {

  const [distance, setDistance] =
  useState("");

  const [eta, setEta] =
  useState("");

  const [
    location,
    setLocation,
  ] = useState<any>(null);

  const [
    pickupStop,
    setPickupStop,
  ] = useState<any>(null);

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

  const loadData =
    async () => {

      try {

        const data =
          await getMyBusLocation();

        if (
          data.success
        ) {

          setLocation(
            data.location
          );

          setPickupStop(
            data.pickupStop
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
      ${location?.latitude},
      ${location?.longitude}
    ],
    14
  );

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,
  }
).addTo(map);

const busIcon =
  L.divIcon({

    html:
      '<div style="font-size:28px;">🚌</div>',

    className: '',

  });

L.marker(
  [
    ${location?.latitude},
    ${location?.longitude}
  ],
  {
    icon: busIcon
  }
).addTo(map);

L.marker(
  [
    ${pickupStop?.latitude},
    ${pickupStop?.longitude}
  ]
)
.addTo(map)
.bindPopup(
  "${pickupStop?.stopName}"
);

const bounds =
  L.latLngBounds([
    [
      ${location?.latitude},
      ${location?.longitude}
    ],
    [
      ${pickupStop?.latitude},
      ${pickupStop?.longitude}
    ]
  ]);

map.fitBounds(
  bounds,
  {
    padding: [30, 30]
  }
);

async function getRoute() {

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
  route.geometry
    .coordinates
    .map(
      point => [
        point[1],
        point[0]
      ]
    );

L.polyline(
  coordinates,
  {
    color: "#1976D2",
    weight: 4,
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
        )

    })
  );

}

getRoute();

</script>

</body>
</html>
`;

 return (

  <View
  style={{
    height: 290,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
  }}
>

  <View
    style={{
      padding: 10,
      backgroundColor: "#1565C0",
    }}
  >

    <Text
      style={{
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      ETA:
      {" "}
      {eta || "--"}{" "}
      mins
      |
      Distance:
      {" "}
      {distance || "--"}{" "}
      km
    </Text>

  </View>

    {
      location &&
      pickupStop && (

       <WebView
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

      )
    }

  </View>

);

}