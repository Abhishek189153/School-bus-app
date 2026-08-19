import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_BASE_URL } from "../config/api";

const BASE_URL =
  `${API_BASE_URL}/mobile`;

const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

// ==========================================
// SHARED REQUEST HELPER
//
// This is the actual fix for "dashboard shows nothing until I
// log out and back in": every call used to do response.json()
// blindly, so an expired/invalid token (401/403) just returned
// into whatever the screen's default state was — no error, no
// redirect, nothing to recover from. Every request now goes
// through here instead, which:
//
//  1. attaches the token automatically (one place instead of ~30)
//  2. on 401/403, clears the stored session and sends the user
//     straight back to login rather than leaving a stale screen
//  3. throws on a bad/non-JSON response instead of silently
//     returning garbage, so existing try/catch blocks in your
//     screens (which already show "Failed to load..." alerts)
//     actually fire when something really is wrong
// ==========================================

async function apiRequest(url, options = {}) {

  const token = await getToken();

  const headers = {
    ...(options.body
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (
    response.status === 401 ||
    response.status === 403
  ) {

    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    router.replace("/");

    throw new Error("Session expired — please log in again");

  }

  const text = await response.text();

  try {

    return JSON.parse(text);

  } catch (error) {

    console.log(
      "API RESPONSE PARSE ERROR:",
      url,
      text.slice(0, 200)
    );

    throw new Error("Invalid response from server");

  }

}

export const getDriverDashboard =
  async () => {

    return apiRequest(
      `${BASE_URL}/driver-dashboard`
    );

  };

export const startTrip =
  async (tripType, routeId) => {

    return apiRequest(
      `${BASE_URL}/start-trip`,
      {
        method: "POST",
        body: JSON.stringify({
          tripType,
          routeId,
        }),
      }
    );

  };

export const endTrip =
  async (tripId) => {

    return apiRequest(
      `${BASE_URL}/end-trip/${tripId}`,
      { method: "POST" }
    );

  };

export const getTripStudents =
  async (tripId) => {

    return apiRequest(
      `${BASE_URL}/trip-students/${tripId}`
    );

  };

export const boardStudent =
  async (tripId, studentId) => {

    return apiRequest(
      `${BASE_URL}/board-student`,
      {
        method: "POST",
        body: JSON.stringify({
          tripId,
          studentId,
        }),
      }
    );

  };

export const unboardStudent =
  async (tripId, studentId) => {

    return apiRequest(
      `${BASE_URL}/unboard-student`,
      {
        method: "POST",
        body: JSON.stringify({
          tripId,
          studentId,
        }),
      }
    );

  };

export const getTripSummary =
  async (tripId) => {

    return apiRequest(
      `${BASE_URL}/trip-summary/${tripId}`
    );

  };

export const getTripHistory = async (date) => {

  try {

    const token =
      await AsyncStorage.getItem("token");

    let url =
      `${API_URL}/api/mobile/trip-history`;

    if (date) {
      url += `?date=${date}`;
    }

    const response =
      await fetch(url, {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",
        },
      });

    return await response.json();

  } catch (error) {

    console.log(
      "GET TRIP HISTORY ERROR:",
      error
    );

    return {
      success: false,
      history: [],
    };

  }

};

export const dutyOn =
  async () => {

    return apiRequest(
      `${BASE_URL}/duty-on`,
      { method: "POST" }
    );

  };

export const dutyOff =
  async () => {

    return apiRequest(
      `${BASE_URL}/duty-off`,
      { method: "POST" }
    );

  };

export const getAssignedRoutes =
  async () => {

    return apiRequest(
      `${BASE_URL}/assigned-routes`
    );

  };

export const getDutyStatus =
  async () => {

    return apiRequest(
      `${BASE_URL}/duty-status`
    );

  };

export const getBoardedStudents =
  async (tripId) => {

    return apiRequest(
      `${BASE_URL}/boarded-students/${tripId}`
    );

  };

export const getParentDashboard =
  async () => {

    return apiRequest(
      `${BASE_URL}/parent-dashboard`
    );

  };

export const getMyBusLocation =
  async () => {

    return apiRequest(
      `${BASE_URL}/my-bus-location`
    );

  };

export const getProfile =
  async () => {

    return apiRequest(
      `${BASE_URL}/profile`
    );

  };

export const updateProfileImage =
  async (imageUrl) => {

    return apiRequest(
      `${BASE_URL}/profile-image`,
      {
        method: "PUT",
        body: JSON.stringify({
          profileImage: imageUrl,
        }),
      }
    );

  };

export const getHistory =
  async (date = "") => {

    return apiRequest(
      `${BASE_URL}/history?date=${date}`
    );

  };

export const getAnnouncements =
  async () => {

    return apiRequest(
      `${API_BASE_URL}/announcements`
    );

  };

export const getNotificationSettings =
  async () => {

    return apiRequest(
      `${BASE_URL}/notification-settings`
    );

  };

export const updateNotificationSettings =
  async (data) => {

    return apiRequest(
      `${BASE_URL}/notification-settings`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

  };

export const savePushToken =
  async (tokenValue) => {

    try {

      const data = await apiRequest(
        `${BASE_URL}/push-token`,
        {
          method: "PUT",
          body: JSON.stringify({
            token: tokenValue,
          }),
        }
      );

      return { success: true, ...data };

    } catch (error) {

      console.log(
        "PUSH TOKEN ERROR:",
        error
      );

      return { success: false };

    }

  };

// ==========================================
// UNAUTHENTICATED — no token to attach, so these
// stay as plain fetch calls rather than going
// through apiRequest (which would send a 401
// redirect loop before the user is even logged in)
// ==========================================

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
  async (phone, otp) => {

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
  async (phone, newPassword) => {

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
