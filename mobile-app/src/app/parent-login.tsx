import React, { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { API_BASE_URL } from "../config/api";
import { Ionicons } from "@expo/vector-icons";

export default function ParentLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);

  // Load the saved phone number when the login page opens
  useEffect(() => {
    const checkSavedCredentials = async () => {
      try {
        const savedPhone = await AsyncStorage.getItem("remembered_parent_phone");
        if (savedPhone) {
          setPhone(savedPhone);
        }
      } catch (error) {
        console.log("Error reading saved credentials", error);
      }
    };

    checkSavedCredentials();

    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    Keyboard.dismiss();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        Alert.alert("Error", data.message);
        return;
      }

      if (data.user.role !== "PARENT") {
        Alert.alert("Error", "Not a Parent account");
        return;
      }

      // Save the token and user session details
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      // REMEMBER CREDENTIALS: Store the phone number separately so it persists after logout
      await AsyncStorage.setItem("remembered_parent_phone", phone);

      router.push("/(tabs)/parent-dashboard");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Something went wrong"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            <View>
              {/* Top Branding Section */}
              <View style={styles.headerBlock}>
                <View style={styles.badgeWrapper}>
                  <Text style={styles.brandBadge}>Parent Portal</Text>
                </View>
                <Text style={styles.title}>Safe Journeys,{"\n"}Peace of Mind.</Text>
                
                {!isKeyboardVisible && (
                  <Text style={styles.subtitle}>
                    Track your child's school transit live and stay updated every step of the way.
                  </Text>
                )}
              </View>

              {/* Illustration Display Wrapper */}
              {!isKeyboardVisible && (
                <View style={styles.imageContainer}>
                  <Image
                    source={require("../../assets/images/Parent_login.jpg")}
                    style={styles.illustration}
                    resizeMode="contain"
                  />
                </View>
              )}

              {/* Login Form Group */}
              <View style={[styles.formContainer, isKeyboardVisible && styles.formContainerKeyboardActive]}>
                <View style={styles.inputFieldGroup}>
                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>

               <View style={styles.inputFieldGroup}>

  <View style={styles.passwordContainer}>

    <TextInput
      ref={passwordInputRef}
      placeholder="Password"
      placeholderTextColor="#94A3B8"
      secureTextEntry={!showPassword}
      style={styles.passwordInput}
      value={password}
      onChangeText={setPassword}
      returnKeyType="done"
      onSubmitEditing={handleLogin}
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

</View>

<TouchableOpacity
  onPress={() =>
    router.push("/forgot-password")
  }
  style={{
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 20,
  }}
>
  <Text
    style={{
      color: "#2563EB",
      fontSize: 13,
      fontWeight: "600",
    }}
  >
    Forgot Password?
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  activeOpacity={0.85}
  onPress={handleLogin}
>
  <Text style={styles.buttonText}>
    Get Started
  </Text>
</TouchableOpacity>
              </View>
            </View>

            {/* Trust Slogan Footer */}
            <View style={styles.footer}>
              <View style={styles.safetyBadge}>
                <Text style={styles.safetyText}>🛡️ Student's safety, Our Priority</Text>
              </View>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: 24,
  },
  headerBlock: {
    paddingHorizontal: 28,
    marginTop: 12,
  },
  badgeWrapper: {
    alignSelf: "flex-start",
    backgroundColor: "#EFF6FF", 
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginBottom: 10,
  },
  brandBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E40AF", 
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    fontWeight: "400",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  illustration: {
    width: "90%",
    height: 180,
  },
  formContainer: {
    paddingHorizontal: 28,
    width: "100%",
  },
  formContainerKeyboardActive: {
    marginTop: 20,
  },
  inputFieldGroup: {
    marginBottom: 14,
  },
  input: {
    width: "100%",
    backgroundColor: "#F8FAFC", 
    borderWidth: 1.5,
    borderColor: "#E2E8F0", 
    borderRadius: 16, 
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15, 
    color: "#0F172A",
    fontWeight: "500",
  },
  passwordContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F8FAFC",
  borderWidth: 1.5,
  borderColor: "#E2E8F0",
  borderRadius: 16,
  paddingHorizontal: 18,
},

passwordInput: {
  flex: 1,
  paddingVertical: 16,
  fontSize: 15,
  color: "#0F172A",
  fontWeight: "500",
},
  button: {
    width: "100%",
    backgroundColor: "#0F172A", 
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  safetyBadge: {
    backgroundColor: "#F0FDF4", 
    borderColor: "#DCFCE7",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  safetyText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#166534", 
    letterSpacing: 0.4,
  },
});