import * as TaskManager
from "expo-task-manager";

import * as Location
from "expo-location";

import AsyncStorage
from "@react-native-async-storage/async-storage";

import { API_BASE_URL } from "../config/api";

const TASK_NAME =
  "BUS_LOCATION_TRACKING";

TaskManager.defineTask(
  TASK_NAME,

  async ({
    data,
    error,
  }) => {

    if (error) {

      console.log(
        "Background Location Error:",
        error
      );

      return;
    }

    if (
      data?.locations?.length
    ) {

      const location =
        data.locations[0];

      const busId =
        await AsyncStorage.getItem(
          "activeBusId"
        );

      const token =
        await AsyncStorage.getItem(
          "token"
        );

      if (
        !busId ||
        !token
      ) return;

      try {

        await fetch(
          `${API_BASE_URL}/location/update`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              busId,
              latitude:
                location.coords.latitude,
              longitude:
                location.coords.longitude,
            }),
          }
        );

        console.log(
          "Background GPS Updated"
        );

      } catch (err) {

        console.log(
          err
        );

      }

    }

  }
);

export const
startBackgroundTracking =
async (
  busId
) => {

  await AsyncStorage.setItem(
    "activeBusId",
    busId
  );

  const {
    status:
      foregroundStatus,
  } =
    await Location.requestForegroundPermissionsAsync();

  if (
    foregroundStatus !==
    "granted"
  ) return;

  const {
    status:
      backgroundStatus,
  } =
    await Location.requestBackgroundPermissionsAsync();

  if (
    backgroundStatus !==
    "granted"
  ) return;

  const started =
    await Location.hasStartedLocationUpdatesAsync(
      TASK_NAME
    );

  if (
    started
  ) return;

  await Location.startLocationUpdatesAsync(
    TASK_NAME,
    {
      accuracy:
        Location.Accuracy.High,

      timeInterval:
        10000,

      distanceInterval:
        20,

      showsBackgroundLocationIndicator:
        true,

      foregroundService: {
        notificationTitle:
          "School Bus Tracking",

        notificationBody:
          "Tracking bus location",
      },
    }
  );

};

export const
stopBackgroundTracking =
async () => {

  const started =
    await Location.hasStartedLocationUpdatesAsync(
      TASK_NAME
    );

  if (
    started
  ) {

    await Location.stopLocationUpdatesAsync(
      TASK_NAME
    );

  }

  await AsyncStorage.removeItem(
    "activeBusId"
  );

};