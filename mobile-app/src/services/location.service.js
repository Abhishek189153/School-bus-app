import AsyncStorage
from "@react-native-async-storage/async-storage";

const BASE_URL =
  "http://192.168.1.7:5000/api/location";

export const updateLocation =
async (
  busId,
  latitude,
  longitude
) => {

  const token =
    await AsyncStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${BASE_URL}/update`,
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

          latitude,

          longitude,

        }),

      }
    );

  return await response.json();

};

export const getBusLocation =
async (
  busId
) => {

  const token =
    await AsyncStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${BASE_URL}/location/${busId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return await response.json();
};