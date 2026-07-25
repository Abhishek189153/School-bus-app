import React,
{
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

import {
  API_BASE_URL,
} from "../config/api";

// import {
//   sendFirebaseOTP,
// } from "../services/firebaseAuth.service";

export default function ForgotPassword() {

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    otp,
    setOtp,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

//   const [
//   confirmation,
//   setConfirmation,
// ] = useState<any>(null);

  const [
    otpSent,
    setOtpSent,
  ] = useState(false);

  const [
  showPassword,
  setShowPassword,
] = useState(false);

const [
  showConfirmPassword,
  setShowConfirmPassword,
] = useState(false);

  const [
    otpVerified,
    setOtpVerified,
  ] = useState(false);

 const sendOTP =
  async () => {

    if (
      phone.length !== 10
    ) {

      Alert.alert(
        "Error",
        "Enter valid phone number"
      );

      return;

    }

    try {

      const response =
        await fetch(
          `${API_BASE_URL}/mobile/send-forgot-password-otp`,
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

      const data =
        await response.json();

      if (
        data.success
      ) {

        setOtpSent(
          true
        );

        Alert.alert(
          "Success",
          data.otp
            ? `Use OTP: ${data.otp}`
            : "OTP Sent Successfully"
        );

      } else {

        Alert.alert(
          "Error",
          data.message
        );

      }

    } catch (error) {

      console.log(
        "SEND OTP ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Failed to send OTP"
      );

    }

  };

  

 const verifyOTP =
  async () => {

    try {

      const response =
        await fetch(
          `${API_BASE_URL}/mobile/verify-forgot-password-otp`,
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

      const data =
        await response.json();

      if (
        data.success
      ) {

        setOtpVerified(
          true
        );

        Alert.alert(
          "Success",
          "OTP Verified"
        );

      } else {

        Alert.alert(
          "Error",
          data.message
        );

      }

    } catch (error) {

      Alert.alert(
        "Error",
        "Verification failed"
      );

    }

  };

  const resetPassword =
    async () => {

      if (
        newPassword !==
        confirmPassword
      ) {

        Alert.alert(
          "Error",
          "Passwords do not match"
        );

        return;

      }

      try {

        const response =
          await fetch(
            `${API_BASE_URL}/mobile/reset-password`,
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

        const data =
          await response.json();

        if (
          data.success
        ) {

          Alert.alert(
            "Success",
            "Password Updated",
            [
              {
                text: "OK",
                onPress: () =>
                  router.back(),
              },
            ]
          );

        } else {

          Alert.alert(
            "Error",
            data.message
          );

        }

      } catch (error) {

        Alert.alert(
          "Error",
          "Password reset failed"
        );

      }

    };

  return (

    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >

      <Text
        style={
          styles.title
        }
      >
        Forgot Password
      </Text>

      <TextInput
  placeholder="Enter Registered Phone Number"
  placeholderTextColor="#94A3B8"
  keyboardType="phone-pad"
  value={phone}
  onChangeText={setPhone}
  style={styles.input}
  
/>

      {!otpSent && (

        <TouchableOpacity
          style={
            styles.button
          }
          onPress={
            sendOTP
          }
        >

          <Text
            style={
              styles.buttonText
            }
          >
            Send OTP
          </Text>

        </TouchableOpacity>

      )}

      {otpSent &&
        !otpVerified && (

        <>

         <TextInput
  placeholder="Enter 6 Digit OTP"
  placeholderTextColor="#94A3B8"
  keyboardType="number-pad"
  value={otp}
  onChangeText={setOtp}
  style={styles.input}
  
/>

          <TouchableOpacity
            style={
              styles.button
            }
            onPress={
              verifyOTP
            }
          >

            <Text
              style={
                styles.buttonText
              }
            >
              Verify OTP
            </Text>

          </TouchableOpacity>

        </>

      )}

      {otpVerified && (

        <>

          <View style={styles.passwordContainer}>

  <TextInput
    placeholder="Enter New Password"
    placeholderTextColor="#94A3B8"
    secureTextEntry={!showPassword}
    value={newPassword}
    onChangeText={setNewPassword}
    style={styles.passwordInput}
  />

  <TouchableOpacity
    onPress={() =>
      setShowPassword(
        !showPassword
      )
    }
  >
    <Ionicons
      name={
        showPassword
          ? "eye"
          : "eye-off"
      }
      size={22}
      color="#64748B"
    />
  </TouchableOpacity>

</View>

          <View style={styles.passwordContainer}>

  <TextInput
    placeholder="Confirm New Password"
    placeholderTextColor="#94A3B8"
    secureTextEntry={!showConfirmPassword}
    value={confirmPassword}
    onChangeText={setConfirmPassword}
    style={styles.passwordInput}
  />

  <TouchableOpacity
    onPress={() =>
      setShowConfirmPassword(
        !showConfirmPassword
      )
    }
  >
    <Ionicons
      name={
        showConfirmPassword
          ? "eye"
          : "eye-off"
      }
      size={22}
      color="#64748B"
    />
  </TouchableOpacity>

</View>

          <TouchableOpacity
            style={
              styles.button
            }
            onPress={
              resetPassword
            }
          >

            <Text
              style={
                styles.buttonText
              }
            >
              Reset Password
            </Text>

          </TouchableOpacity>

        </>

      )}

    </ScrollView>

  );

}

const styles =
  StyleSheet.create({

    container: {
      flexGrow: 1,
      justifyContent:
        "center",
      padding: 25,
      backgroundColor:
        "#FFFFFF",
    },

    title: {
      fontSize: 28,
      fontWeight:
        "bold",
      marginBottom: 30,
      textAlign:
        "center",
      color:
        "#0F172A",
    },

    input: {
  borderWidth: 1,
  borderColor: "#CBD5E1",
  borderRadius: 12,
  padding: 15,
  marginBottom: 15,
  fontSize: 16,
  color: "#0F172A",
  backgroundColor: "#FFFFFF",
},

  passwordContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#CBD5E1",
  borderRadius: 12,
  paddingHorizontal: 15,
  marginBottom: 15,
  backgroundColor: "#FFFFFF",
},

passwordInput: {
  flex: 1,
  paddingVertical: 15,
  fontSize: 16,
  color: "#0F172A",
},

    button: {
      backgroundColor:
        "#0F172A",
      padding: 16,
      borderRadius: 12,
      alignItems:
        "center",
      marginTop: 10,
    },

    buttonText: {
      color:
        "#FFFFFF",
      fontSize: 16,
      fontWeight:
        "bold",
    },

  });