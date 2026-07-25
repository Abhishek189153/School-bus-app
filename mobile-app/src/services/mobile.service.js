import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

const BASE_URL =
  `${API_BASE_URL}/mobile`;

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

    console.log(
  "MY BUS TOKEN:",
  token
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
    console.log(
  "TOKEN:",
  token
);



  const text =
    await response.text();

  console.log(
    "Bus Location Raw Response:",
    text
  );

  return JSON.parse(text);

};

export const getProfile =
async () => {

  const token =
    await getToken();

  const response =
    await fetch(
      `${BASE_URL}/profile`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return await response.json();

};

export const updateProfileImage =
async (imageUrl) => {

  const token =
    await AsyncStorage.getItem(
      "token"
    );

  const response =
    await fetch(

      `${BASE_URL}/profile-image`,

      {

        method: "PUT",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

        },

        body: JSON.stringify({

          profileImage:
            imageUrl,

        }),

      }

    );

  return response.json();

};
  
export const getHistory =
async (date = "") => {

  const token =
    await AsyncStorage.getItem(
      "token"
    );

  const response =
    await fetch(

      `${BASE_URL}/history?date=${date}`,

      {

        headers: {

          Authorization:
            `Bearer ${token}`,

        },

      }

    );

  return response.json();

};

export const
getAnnouncements =
async () => {

  const token =
    await getToken();

  const response =
    await fetch(
      `${API_BASE_URL}/announcements`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return await response.json();

};

export const
getNotificationSettings =
async () => {

  const token =
    await getToken();

  const response =
    await fetch(
      `${BASE_URL}/notification-settings`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.json();

};

export const
updateNotificationSettings =
async (data) => {

  const token =
    await getToken();

  const response =
    await fetch(

      `${BASE_URL}/notification-settings`,

      {

        method: "PUT",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

        },

        body:
          JSON.stringify(data),

      }

    );

  return response.json();

};


export const savePushToken =
async (tokenValue) => {

  const token =
    await getToken();

  const response =
    await fetch(

      `${BASE_URL}/push-token`,

      {

        method: "PUT",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

        },

        body:
          JSON.stringify({

            token:
              tokenValue,

          }),

      }

    );

  const text =
    await response.text();

  console.log(
    "PUSH TOKEN STATUS:",
    response.status
  );

  console.log(
    "PUSH TOKEN RESPONSE:",
    text
  );

  return {
    success: response.ok,
  };

};

export const sendForgotPasswordOTP =
async (phone) => {

  const response =
    await fetch(
      `${BASE_URL}/send-forgot-password-otp`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          phone,
        }),
      }
    );

  return await response.json();

};

export const verifyForgotPasswordOTP =
async (
  phone,
  otp
) => {

  const response =
    await fetch(
      `${BASE_URL}/verify-forgot-password-otp`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          phone,
          otp,
        }),
      }
    );

  return await response.json();

};

export const resetPassword =
async (
  phone,
  newPassword
) => {

  const response =
    await fetch(
      `${BASE_URL}/reset-password`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          phone,
          newPassword,
        }),
      }
    );

  return await response.json();

};