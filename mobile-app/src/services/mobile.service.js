import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL =
  "http://192.168.1.7:5000/api/mobile";

const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

export const getDriverDashboard =
  async () => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/driver-dashboard`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return await response.json();
  };

export const startTrip =
  async (tripType,routeId) => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/start-trip`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            tripType,
            routeId,
          }),
        }
      );

    return await response.json();
  };

export const endTrip =
  async (tripId) => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/end-trip/${tripId}`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return await response.json();
  };

export const getTripStudents =
  async (tripId) => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/trip-students/${tripId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return await response.json();
  };

export const boardStudent =
  async (
    tripId,
    studentId
  ) => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/board-student`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            tripId,
            studentId,
          }),
        }
      );

    return await response.json();
  };

  export const unboardStudent =
  async (
    tripId,
    studentId
  ) => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/unboard-student`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            tripId,
            studentId,
          }),
        }
      );

    return await response.json();
  };

  export const getTripSummary =
  async (tripId) => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/trip-summary/${tripId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return await response.json();
  };

  export const getTripHistory =
  async () => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/trip-history`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return await response.json();
  };

  export const dutyOn =
  async () => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/duty-on`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return await response.json();
  };

export const dutyOff =
  async () => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/duty-off`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return await response.json();
  };

export const getAssignedRoutes =
  async () => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/assigned-routes`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return await response.json();
  };

export const getDutyStatus =
  async () => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/duty-status`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return await response.json();
  };

export const getBoardedStudents =
  async (tripId) => {

    const token =
      await getToken();

    const response =
      await fetch(
        `${BASE_URL}/boarded-students/${tripId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return await response.json();
  };

export const getParentDashboard =
async () => {

  const token =
    await getToken();

  const response =
    await fetch(
      `${BASE_URL}/parent-dashboard`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return await response.json();

};

export const getMyBusLocation =
async () => {

  const token =
    await AsyncStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${BASE_URL}/my-bus-location`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  const text =
    await response.text();

  console.log(
    "Bus Location Raw Response:",
    text
  );

  return JSON.parse(text);

};
  