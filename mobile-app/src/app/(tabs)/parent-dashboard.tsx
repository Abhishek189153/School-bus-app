import React, { useRef, useEffect } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Animated,
  ScrollView,
} from "react-native";

import ParentMiniMap
from "../../components/ParentMiniMap";

import {
  registerForPushNotifications,
} from "../../utils/notifications";

import {
  savePushToken,
} from "../../services/mobile.service";

import { MaterialIcons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import {
  getParentDashboard, getAnnouncements,
} from "../../services/mobile.service";

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

  const [darkMode, setDarkMode] =
  React.useState(false);

  const [
  showBoardingCard,
  setShowBoardingCard,
] = React.useState(true);

  const [
  hideAnnouncement,
  setHideAnnouncement,
] = React.useState(false);

  const [dashboard,
  setDashboard] =
  React.useState<any>(null);

  const [
  announcements,
  setAnnouncements,
] = React.useState<any[]>([]);

const previousBoardingRef =
  React.useRef("");

const previousAnnouncementRef =
  React.useRef("");

// const [activeAlert, setActiveAlert] =
//   React.useState<
//     "boarding" |
//     "announcement" |
//     null
//   >(null);

  useEffect(() => {


 const setupNotifications =
async () => {

  try {

    const expoToken =
      await registerForPushNotifications();

    console.log(
      "EXPO TOKEN GENERATED:",
      expoToken
    );

    if (expoToken) {

      await savePushToken(
        expoToken
      );

      console.log(
        "TOKEN SENT TO BACKEND"
      );

    }

  } catch (error) {

    console.log(
      "PUSH TOKEN ERROR:",
      error
    );

  }

};

setupNotifications();

 const loadDashboard = async () => {

  try {

    const data =
      await getParentDashboard();

    console.log(
      "Dashboard Response:",
      data
    );

    if (data?.success) {

      setDashboard(data);

    }

  } catch (error) {

    console.log(
      "PARENT DASHBOARD ERROR:",
      error
    );

  }

  try {

    const announcementData =
      await getAnnouncements();

    console.log(
      "ANNOUNCEMENTS RESPONSE:",
      announcementData
    );

    if (
      announcementData?.success
    ) {

      setAnnouncements(
        announcementData.announcements
      );

    }

  } catch (error) {

    console.log(
      "ANNOUNCEMENT ERROR:",
      error
    );

  }

};

    

  loadDashboard();

    const interval =

    setInterval(() => {

      loadDashboard();

    }, 5000);

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

  return () => {

    clearInterval(
      interval
    );

  };

}, []);

useEffect(() => {

  const checkBoarding =
    async () => {

      const currentBoarding =
        JSON.stringify(
          dashboard?.boardingStatus
            ?.filter(
              (student: any) =>
                student.boardedToday
            )
            .map(
              (student: any) =>
                student.name
            )
        );

      const dismissedBoarding =
        await AsyncStorage.getItem(
          "dismissedBoarding"
        );

      if (
        currentBoarding &&
        currentBoarding !==
          dismissedBoarding
      ) {

        setShowBoardingCard(
          true
        );

      //   setActiveAlert(
      //   "boarding"
      // );

      }

    };

  checkBoarding();

}, [
  dashboard?.boardingStatus
]);

useEffect(() => {

  const checkAnnouncement =
    async () => {

      if (
        announcements.length === 0
      ) {

        return;

      }

      const currentAnnouncement =
        JSON.stringify(
          announcements[0]
        );

      const dismissedAnnouncement =
        await AsyncStorage.getItem(
          "dismissedAnnouncement"
        );

      if (
        currentAnnouncement !==
        dismissedAnnouncement
      ) {

        setHideAnnouncement(
          false
        );

    //     setActiveAlert(
    //   "announcement"
    // );

      }

    };

  checkAnnouncement();

}, [
  announcements
]);

// useEffect(() => {

//   setHideAnnouncement(false);

// }, [
//   announcements
// ]);

 useFocusEffect(
  React.useCallback(() => {

    loadTheme();

  }, [])
);


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

    const loadTheme = async () => {

  const theme =
    await AsyncStorage.getItem(
      "darkMode"
    );

  setDarkMode(
    theme === "true"
  );

};

    const hasActiveBoarding =

  showBoardingCard &&

  dashboard?.boardingStatus?.some(
    (student: any) =>
      student.boardedToday
  );

  return (
  <View
  style={[
    styles.container,
    {
      backgroundColor:
        darkMode
          ? "#001233"
          : "#F5F8FF",
    },
  ]}
>

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
    >
      <View
  style={[
    styles.card,
    {
      backgroundColor:
        darkMode
         ? "#001233"
          : "#F5F8FF",
    },
  ]}
>
        <Image
          source={require("../../../assets/images/BusDriver2.png")}
          style={[
    styles.driverImage,
    {
      backgroundColor:
        darkMode
          ? "#001233"
          : "#F5F8FF",
    },
  ]}
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

                color:
                  darkMode
                    ? "#60A5FA"
                    : "#1565C0",
              },
            ]}
          >
            Hello, I'm your Driver
          </Animated.Text>

        <Animated.Text
          style={[
            styles.name,
            {
              opacity:
                nameOpacity,

              color:
                darkMode
                  ? "#FFFFFF"
                  : "#1E293B",
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

                color:
                  darkMode
                    ? "#CBD5E1"
                    : "#64748B",
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

                color:
                  darkMode
                    ? "#4ADE80"
                    : "#2E7D32",
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
              style={[
                styles.callButton,
                {
                  backgroundColor:
                    darkMode
                      ? "#16A34A"
                      : "#2E7D32",
                },
              ]}
              onPress={handleCall}
            >

              <Text
                style={[
                  styles.buttonText,
                  {
                    color: "#FFFFFF",
                  },
                ]}
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

  <View style={{ marginTop:-20}}>

  <ParentMiniMap />

  
  <Text
    style={{
      textAlign: "center",
      marginTop: 8,
      color: "#1565C0",
      fontWeight: "bold",
    }}
  >
    Tap Map To Open Full Tracking
  </Text>

  

</View>

</TouchableOpacity>


{
  hasActiveBoarding

  ? (

    <View
      style={{
        backgroundColor: "#E8F5E9",
        borderColor: "#2E7D32",
        borderWidth: 2,
        padding: 15,
        borderRadius: 15,
        marginTop: 15,
        position: "relative",
      }}
    >

      <TouchableOpacity
        onPress={async () => {

  const currentBoarding =
    JSON.stringify(
      dashboard?.boardingStatus
        ?.filter(
          (student: any) =>
            student.boardedToday
        )
        .map(
          (student: any) =>
            student.name
        )
    );

  await AsyncStorage.setItem(
    "dismissedBoarding",
    currentBoarding
  );

  setShowBoardingCard(false);

}}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
        }}
      >
        <MaterialIcons
          name="close"
          size={24}
          color="#2E7D32"
        />
      </TouchableOpacity>

      <Text
        style={{
          fontWeight: "bold",
          color: "#2E7D32",
          fontSize: 18,
          textAlign: "center",
        }}
      >
        🟢 Students Boarded
      </Text>

      {
        dashboard?.boardingStatus
          ?.filter(
            (student: any) =>
              student.boardedToday
          )
          .map(
            (
              student: any,
              index: number
            ) => (

              <Text
                key={index}
                style={{
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                • {student.name}
                {" "}
                has boarded the bus
              </Text>

            )
          )
      }

    </View>

  ) : (

   !hideAnnouncement &&

announcements.length > 0 && (

      <View
        style={{
          backgroundColor: "#FFF8E1",
          borderColor: "#F59E0B",
          borderWidth: 2,
          padding: 15,
          borderRadius: 15,
          marginTop: 15,
          position: "relative",
        }}
      >

        <TouchableOpacity
          onPress={async () => {

  const currentAnnouncement =
    JSON.stringify(
      announcements[0]
    );

  await AsyncStorage.setItem(
    "dismissedAnnouncement",
    currentAnnouncement
  );

  setHideAnnouncement(true);

}}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
          }}
        >
          <MaterialIcons
            name="close"
            size={24}
            color="#D97706"
          />
        </TouchableOpacity>

        <Text
          style={{
            fontWeight: "bold",
            color: "#D97706",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          📢 Announcement
        </Text>

        <Text
          style={{
            fontWeight: "bold",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {announcements[0]?.title}
        </Text>

        <Text
          style={{
            marginTop: 8,
            textAlign: "center",
          }}
        >
          {announcements[0]?.message}
        </Text>

      </View>

    )

  )
}


{/* {
  dashboard?.boardingStatus?.some(
    (student: any) =>
      student.boardedToday
  ) ? (

    <View
      style={{
        backgroundColor: "#E8F5E9",
        borderColor: "#2E7D32",
        borderWidth: 2,
        padding: 15,
        borderRadius: 15,
        marginTop: 15,
      }}
    >


      

      <Text
        style={{
          fontWeight: "bold",
          color: "#2E7D32",
          fontSize: 18,
          textAlign: "center",
        }}
      >
        🟢 Students Boarded
      </Text>

      {
        dashboard?.boardingStatus
          ?.filter(
            (student: any) =>
              student.boardedToday
          )
          .map(
            (
              student: any,
              index: number
            ) => (

              <Text
                key={index}
                style={{
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                • {student.name} has boarded the bus
              </Text>

            )
          )
      }

    </View>

  ) : (

    announcements.length > 0 && (

      <View
        style={{
          backgroundColor: "#FFF8E1",
          borderColor: "#F59E0B",
          borderWidth: 2,
          padding: 15,
          borderRadius: 15,
          marginTop: 15,
        }}
      >

        <Text
          style={{
            fontWeight: "bold",
            color: "#D97706",
            fontSize: 18,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          📢 Announcement
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {announcements[0]?.title}
        </Text>

        <Text
          style={{
            marginTop: 8,
            textAlign: "center",
          }}
        >
          {announcements[0]?.message}
        </Text>

      </View>

    )

  )
} */}

    <View
  style={{
    backgroundColor:
      darkMode
        ? "#1E293B"
        : "#E7EEED",
    
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    elevation: 3,
  }}
>

  <Text
    style={{
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
       color:
      darkMode
        ? "#FFFFFF"
        : "#000000",
    }}
  >
    Bus Status
  </Text>

  <Text
  style={{
    color:
      darkMode
        ? "#FFFFFF"
        : "#000000",
  }}
>
    Status:
    {" "}
    {
      dashboard?.activeTrip
        ? "🟢 Running"
        : "🔴 Not Running"
    }
  </Text>

  {/* <Text>
  Active Trip:
  {
    dashboard?.activeTrip
      ? "YES"
      : "NO"
  }
</Text> */}

  <Text
    style={{
      marginTop: 8,
       color:
      darkMode
        ? "#FFFFFF"
        : "#000000",
    }}
  >
    Approaching:
    {" "}
    {
      dashboard?.approachingStop ||
      "N/A"
    }
  </Text>

</View>

</ScrollView>

{/* <TouchableOpacity
  style={styles.logoutButton}
  onPress={handleLogout}
>
  <Text
    style={styles.logoutText}
  >
    Logout
  </Text>
</TouchableOpacity> */}

{/* </TouchableOpacity> */}

      {/* <View
  style={styles.bottomNav}
>

  <TouchableOpacity
    style={styles.navItem}
  >
    <Ionicons
      name="home"
      size={24}
      color="#1565C0"
    />
    <Text>
      Home
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.navItem}
    onPress={() =>
    router.navigate("/(tabs)/profile")
    }
  >
    <Ionicons
      name="person"
      size={24}
      color="#666"
    />
    <Text>
      Profile
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.navItem}
    onPress={() =>
      router.push(
        "/history"
      )
    }
  >
    <Ionicons
      name="time"
      size={24}
      color="#666"
    />
    <Text>
      History
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.navItem}
    onPress={() =>
      router.push(
        "/settings"
      )
    }
  >
    <Ionicons
      name="settings"
      size={24}
      color="#666"
    />
    <Text>
      Settings
    </Text>
  </TouchableOpacity>

</View> */}
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
      paddingBottom: 80,
    },

    card: {
     
      height: 285,
      marginTop: -30,
      borderRadius: 24,

      
    },

    driverImage: {
      width: "100%",
      height: 350,
      resizeMode: "contain",
      marginTop: -37,
      left: -67,
      
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
      marginRight: 18,
      marginTop: -17,
      paddingHorizontal: 8,
    },

    name: {
      marginTop: 5,
      fontSize: 25,
      fontWeight: "bold",
      color: "#1E293B",
      textAlign: "center",
    },

    contactLabel: {
      marginTop: 12,
      fontSize: 20,
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

      top: 64,
      left: 40,

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

      top: 185,
      left: 21,

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

//    bottomNav: {
//   position: "absolute",

//   bottom: 40,

//   left: 15,

//   right: 15,

//   height: 65,

//   backgroundColor: "#fff",

//   flexDirection: "row",

//   justifyContent: "space-around",

//   alignItems: "center",

//   elevation: 10,

//   shadowColor: "#f2f8f8",

//   shadowOpacity: 0.15,

//   shadowRadius: 10,
// },

// navItem: {
//   alignItems: "center",
// },

  });