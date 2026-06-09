import React, { useRef, useEffect } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Animated,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  getParentDashboard,
} from "../services/mobile.service";

export default function ParentDashboard() {
  const greetingOpacity =
    useRef(new Animated.Value(0)).current;

  const nameOpacity =
    useRef(new Animated.Value(0)).current;

  const contactOpacity =
    useRef(new Animated.Value(0)).current;

  const phoneOpacity =
    useRef(new Animated.Value(0)).current;

  const busOpacity =
    useRef(new Animated.Value(0)).current;

  const buttonOpacity =
    useRef(new Animated.Value(0)).current;

  const [dashboard,
  setDashboard] =
  React.useState<any>(null);

  useEffect(() => {

     const loadDashboard =
      async () => {

        const data =
          await getParentDashboard();

          console.log(
        "Dashboard Response:",
        data
      );

        if (data.success) {

          setDashboard(data);

        }

      };

      loadDashboard();


    Animated.sequence([
      Animated.timing(
        greetingOpacity,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }
      ),

     

      Animated.timing(
        nameOpacity,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }
      ),

       Animated.timing(
        busOpacity,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        contactOpacity,
        {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        phoneOpacity,
        {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        buttonOpacity,
        {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }
      ),
    ]).start();
  }, []);

 


  const handleCall = () => {

  if (
    dashboard?.driverPhone
  ) {

    Linking.openURL(
      `tel:${dashboard.driverPhone}`
    );

  }

};

  const handleLogout =
    async () => {
      await AsyncStorage.removeItem(
        "token"
      );

      await AsyncStorage.removeItem(
        "user"
      );

      router.replace("/");
    };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/driver.png")}
          style={styles.driverImage}
        />


        <Animated.Text
            style={[
              styles.busNumber,
              {
                opacity:
                  busOpacity,
              },
            ]}
          >
            {dashboard?.busNumber}
          </Animated.Text>


          <Animated.Text
          style={[
            styles.vehicleNumber,
            {
              opacity:
                phoneOpacity,
            },
          ]}
        >
          {dashboard?.vehicleNumber}
        </Animated.Text>

        {/* Overlay Content */}

        <View
          style={
            styles.overlayContent
          }
        >
          <Animated.Text
            style={[
              styles.greeting,
              {
                opacity:
                  greetingOpacity,
              },
            ]}
          >
             Hello, I'm your
            Driver
          </Animated.Text>

          <Animated.Text
            style={[
              styles.name,
              {
                opacity:
                  nameOpacity,
              },
            ]}
          >
           {dashboard?.driverName}
          </Animated.Text>


            <Animated.Text
            style={[
              styles.contactLabel,
              {
                opacity:
                  contactOpacity,
              },
            ]}
          >
            Contact Me
          </Animated.Text>

         

          <Animated.Text
            style={[
              styles.phoneNumber,
              {
                opacity:
                  phoneOpacity,
              },
            ]}
          >
           {dashboard?.driverPhone}
          </Animated.Text>

          <Animated.View
            style={{
              opacity:
                buttonOpacity,
            }}
          >
            <TouchableOpacity
              style={
                styles.callButton
              }
              onPress={handleCall}
            >
              <Text
                style={
                  styles.buttonText
                }
              >
                Call Driver
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>


      <TouchableOpacity
  onPress={() =>
    router.push(
      "/bus-location"
    )
  }
>
  <Text>
    Track Bus
  </Text>
</TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text
          style={styles.logoutText}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#FFFFFF",
      padding: 16,
      paddingTop: 20,
    },

    card: {
      backgroundColor:
        "#FFFFFF",
      height: 270,
      marginTop: -20,
      borderRadius: 24,

      
    },

    driverImage: {
      width: "100%",
      height: 320,
      resizeMode: "contain",
    },

    overlayContent: {
      position: "absolute",

      top: 70,
      right: -20,

      width: 185,

      alignItems: "center",
    },

    greeting: {
      fontSize: 16,
      fontWeight: "700",
      color: "#1565C0",
      textAlign: "center",
      marginRight: 20,
      marginTop: -4,
      paddingHorizontal: 8,
    },

    name: {
      marginTop: 5,
      fontSize: 17,
      fontWeight: "bold",
      color: "#1E293B",
      textAlign: "center",
    },

    contactLabel: {
      marginTop: 12,
      fontSize: 16,
      color: "#64748B",
    },

    phoneNumber: {
      fontSize: 18,
      fontWeight: "700",
      color: "#2E7D32",
      marginTop: 4,
    },

    busNumber: {
      position: "absolute",

      top: 85.5,
      left: 51,

      width: 60,

      fontSize: 14,
      fontWeight: "700",

      color: "#FFFFFF",

      backgroundColor: "#1E293B",

      paddingHorizontal: 8,
      paddingVertical: 3,

      borderRadius: 2,

      zIndex: 100,
    },

    vehicleNumber: {
      position: "absolute",

      top: 202,
      left: 32,

      fontSize: 12,
      fontWeight: "700",

       width: 100, 

      color: "#FFFFFF",

      backgroundColor: "#1E293B",

      paddingHorizontal: 8,
      paddingVertical: 3,

      borderRadius: 10,

      zIndex: 100,
    },

    callButton: {
      backgroundColor:
        "#2E7D32",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      marginTop: 15,
    },

    buttonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 16,
    },

    logoutButton: {
      marginTop: 18,
      alignItems: "center",
    },

    logoutText: {
      color: "#EF4444",
      fontSize: 16,
      fontWeight: "600",
    },
  });