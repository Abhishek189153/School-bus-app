import React, {
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

import {
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetPassword,
} from "../services/mobile.service";

export default function ForgotPassword() {

  const [
    email,
    setEmail,
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

  const [
    otpSent,
    setOtpSent,
  ] = useState(false);

  const [
    otpVerified,
    setOtpVerified,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);


  // ==========================================
  // SEND OTP
  // ==========================================

  const handleSendOTP =
    async () => {

      const normalizedEmail =
        email.trim().toLowerCase();


      if (!normalizedEmail) {

        Alert.alert(
          "Error",
          "Please enter your registered email"
        );

        return;

      }


      // Basic email validation

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailRegex.test(
          normalizedEmail
        )
      ) {

        Alert.alert(
          "Error",
          "Please enter a valid email address"
        );

        return;

      }


      try {

        setLoading(true);


        const data =
          await sendForgotPasswordOTP(
            normalizedEmail
          );


        if (
          data.success
        ) {

          setEmail(
            normalizedEmail
          );

          setOtpSent(
            true
          );

          Alert.alert(
            "OTP Sent",
            "A 6-digit OTP has been sent to your registered email address."
          );

        } else {

          Alert.alert(
            "Error",
            data.message ||
              "Failed to send OTP"
          );

        }

      } catch (error) {

        console.log(
          "SEND OTP ERROR:",
          error
        );

        Alert.alert(
          "Error",
          "Failed to send OTP. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOTP =
    async () => {

      if (
        otp.length !== 6
      ) {

        Alert.alert(
          "Error",
          "Please enter the 6-digit OTP"
        );

        return;

      }


      try {

        setLoading(true);


        const data =
          await verifyForgotPasswordOTP(
            email.trim().toLowerCase(),
            otp
          );


        if (
          data.success
        ) {

          setOtpVerified(
            true
          );

          Alert.alert(
            "Success",
            "OTP verified successfully."
          );

        } else {

          Alert.alert(
            "Error",
            data.message ||
              "Invalid OTP"
          );

        }

      } catch (error) {

        console.log(
          "VERIFY OTP ERROR:",
          error
        );

        Alert.alert(
          "Error",
          "OTP verification failed. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================
  // RESET PASSWORD
  // ==========================================

  const handleResetPassword =
    async () => {

      if (
        !newPassword
      ) {

        Alert.alert(
          "Error",
          "Please enter a new password"
        );

        return;

      }


      if (
        newPassword.length < 6
      ) {

        Alert.alert(
          "Error",
          "Password must be at least 6 characters"
        );

        return;

      }


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

        setLoading(true);


        const data =
          await resetPassword(
            email.trim().toLowerCase(),
            newPassword
          );


        if (
          data.success
        ) {

          Alert.alert(
            "Password Updated",
            "Your password has been updated successfully. Please login with your new password.",
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
            data.message ||
              "Failed to reset password"
          );

        }

      } catch (error) {

        console.log(
          "RESET PASSWORD ERROR:",
          error
        );

        Alert.alert(
          "Error",
          "Password reset failed. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================
  // UI
  // ==========================================

  return (

    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <ScrollView
        contentContainerStyle={
          styles.container
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ==================================
            HEADER
        ================================== */}

        <View
          style={styles.header}
        >

          <Text
            style={styles.title}
          >
            Forgot Password?
          </Text>

          <Text
            style={styles.subtitle}
          >
            Reset your password securely
            using your registered email.
          </Text>

        </View>


        {/* ==================================
            STEP 1 — EMAIL
        ================================== */}

        <View
          style={styles.stepContainer}
        >

          <Text
            style={styles.stepTitle}
          >
            1. Enter your email
          </Text>

          <Text
            style={styles.label}
          >
            Registered Email
          </Text>

          <TextInput
            placeholder="Enter registered email"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!otpVerified}
            style={[
              styles.input,
              otpVerified &&
                styles.disabledInput,
            ]}
          />


          {!otpSent && (

            <TouchableOpacity
              style={[
                styles.button,
                loading &&
                  styles.disabledButton,
              ]}
              onPress={
                handleSendOTP
              }
              disabled={loading}
            >

              <Text
                style={styles.buttonText}
              >
                {loading
                  ? "Sending..."
                  : "Send OTP"}
              </Text>

            </TouchableOpacity>

          )}

        </View>


        {/* ==================================
            STEP 2 — OTP
        ================================== */}

        {otpSent &&
          !otpVerified && (

            <View
              style={
                styles.stepContainer
              }
            >

              <Text
                style={styles.stepTitle}
              >
                2. Verify OTP
              </Text>

              <Text
                style={styles.infoText}
              >
                Enter the 6-digit OTP sent
                to your email.
              </Text>

              <TextInput
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                style={styles.input}
              />

              <TouchableOpacity
                style={[
                  styles.button,
                  loading &&
                    styles.disabledButton,
                ]}
                onPress={
                  handleVerifyOTP
                }
                disabled={loading}
              >

                <Text
                  style={styles.buttonText}
                >
                  {loading
                    ? "Verifying..."
                    : "Verify OTP"}
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={
                  handleSendOTP
                }
                disabled={loading}
              >

                <Text
                  style={
                    styles.resendText
                  }
                >
                  Resend OTP
                </Text>

              </TouchableOpacity>

            </View>

          )}


        {/* ==================================
            STEP 3 — NEW PASSWORD
        ================================== */}

        {otpVerified && (

          <View
            style={
              styles.stepContainer
            }
          >

            <Text
              style={styles.stepTitle}
            >
              3. Create new password
            </Text>


            {/* NEW PASSWORD */}

            <View
              style={
                styles.passwordContainer
              }
            >

              <TextInput
                placeholder="Enter new password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={
                  !showPassword
                }
                value={newPassword}
                onChangeText={
                  setNewPassword
                }
                style={
                  styles.passwordInput
                }
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
                      ? "eye-outline"
                      : "eye-off-outline"
                  }
                  size={22}
                  color="#64748B"
                />

              </TouchableOpacity>

            </View>


            {/* CONFIRM PASSWORD */}

            <View
              style={
                styles.passwordContainer
              }
            >

              <TextInput
                placeholder="Confirm new password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={
                  !showConfirmPassword
                }
                value={
                  confirmPassword
                }
                onChangeText={
                  setConfirmPassword
                }
                style={
                  styles.passwordInput
                }
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
                      ? "eye-outline"
                      : "eye-off-outline"
                  }
                  size={22}
                  color="#64748B"
                />

              </TouchableOpacity>

            </View>


            <TouchableOpacity
              style={[
                styles.button,
                loading &&
                  styles.disabledButton,
              ]}
              onPress={
                handleResetPassword
              }
              disabled={loading}
            >

              <Text
                style={styles.buttonText}
              >
                {loading
                  ? "Updating..."
                  : "Reset Password"}
              </Text>

            </TouchableOpacity>

          </View>

        )}


        {/* ==================================
            SECURITY MESSAGE
        ================================== */}

        <View
          style={styles.footer}
        >

          <Text
            style={styles.footerIcon}
          >
            🔐
          </Text>

          <Text
            style={styles.footerText}
          >
            Your password reset is protected
            by email verification.
          </Text>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>

  );

}


// ==========================================
// STYLES
// ==========================================

const styles =
  StyleSheet.create({

    screen: {
      flex: 1,
      backgroundColor:
        "#FFFFFF",
    },

    container: {
      flexGrow: 1,
      paddingHorizontal: 25,
      paddingTop: 70,
      paddingBottom: 40,
    },

    header: {
      marginBottom: 35,
    },

    title: {
      fontSize: 30,
      fontWeight: "800",
      color: "#0F172A",
      textAlign: "center",
    },

    subtitle: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: 21,
      color: "#64748B",
      textAlign: "center",
    },

    stepContainer: {
      marginBottom: 25,
    },

    stepTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: "#0F172A",
      marginBottom: 14,
    },

    label: {
      fontSize: 13,
      fontWeight: "600",
      color: "#475569",
      marginBottom: 7,
    },

    infoText: {
      fontSize: 13,
      color: "#64748B",
      marginBottom: 12,
      lineHeight: 19,
    },

    input: {
      width: "100%",
      backgroundColor:
        "#F8FAFC",
      borderWidth: 1.5,
      borderColor:
        "#E2E8F0",
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 15,
      fontSize: 15,
      color: "#0F172A",
      marginBottom: 12,
    },

    disabledInput: {
      opacity: 0.6,
    },

    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        "#F8FAFC",
      borderWidth: 1.5,
      borderColor:
        "#E2E8F0",
      borderRadius: 14,
      paddingHorizontal: 16,
      marginBottom: 14,
    },

    passwordInput: {
      flex: 1,
      paddingVertical: 15,
      fontSize: 15,
      color: "#0F172A",
    },

    button: {
      width: "100%",
      backgroundColor:
        "#0F172A",
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
      marginTop: 4,
    },

    disabledButton: {
      opacity: 0.6,
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },

    resendButton: {
      alignItems: "center",
      marginTop: 15,
      paddingVertical: 8,
    },

    resendText: {
      color: "#2563EB",
      fontSize: 14,
      fontWeight: "600",
    },

    footer: {
      alignItems: "center",
      marginTop: "auto",
      paddingTop: 20,
    },

    footerIcon: {
      fontSize: 22,
      marginBottom: 6,
    },

    footerText: {
      fontSize: 12,
      color: "#94A3B8",
      textAlign: "center",
    },

  });