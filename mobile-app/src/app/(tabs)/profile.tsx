import React,
{
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  getProfile
} from "../../services/mobile.service";

export default function Profile() {

  const [darkMode, setDarkMode] =
  useState(false);

  const [
    profile,
    setProfile,
  ] = useState<any>(null);

  useEffect(() => {

    loadProfile();
    

  }, []);

  useFocusEffect(
  React.useCallback(() => {

    
    loadTheme();

  }, [])
);


//   const pickImage =
// async () => {

//   Alert.alert(

//     "Profile Photo",

//     "Choose Option",

//     [

//       {
//         text:
//           "Camera",

//         onPress:
//           openCamera,
//       },

//       {
//         text:
//           "Gallery",

//         onPress:
//           openGallery,
//       },

//       {
//         text:
//           "Cancel",

//         style:
//           "cancel",
//       },

//     ]

//   );

// };

// const openGallery =
// async () => {

//   const result =
//     await ImagePicker.launchImageLibraryAsync({

//       mediaTypes:
//         ImagePicker.MediaTypeOptions.Images,

//       quality: 0.8,

//     });

//   if (
//     !result.canceled
//   ) {

//     const imageUri =
//       result.assets[0].uri;

//     await updateProfileImage(
//       imageUri
//     );

//     loadProfile();

//   }

// };


// const openCamera =
// async () => {

//   const permission =
//     await ImagePicker.requestCameraPermissionsAsync();

//   if (
//     !permission.granted
//   ) {

//     return;

//   }

//   const result =
//     await ImagePicker.launchCameraAsync({

//       quality: 0.8,

//     });

//   if (
//     !result.canceled
//   ) {

//     const imageUri =
//       result.assets[0].uri;

//     await updateProfileImage(
//       imageUri
//     );

//     loadProfile();

//   }

// };


  const loadTheme = async () => {

  const theme =
    await AsyncStorage.getItem(
      "darkMode"
    );

  setDarkMode(
    theme === "true"
  );
};

  const loadProfile =
    async () => {

      const data =
        await getProfile();

      console.log(
        "PROFILE RESPONSE:",
        data
      );

      if (
        data.success
      ) {

        setProfile(
          data
        );

      }

    };

  if (!profile) {

    return (

      <View
        style={[
  styles.loadingContainer,
  {
    backgroundColor:
      darkMode
        ? "#001233"
          : "#F5F8FF",
  },
]}
      >

       <Text
  style={{
    color:
      darkMode
        ? "#FFFFFF"
        : "#000000",
  }}
>
          Loading...
        </Text>

      </View>

    );

  }

 return (

 <ScrollView
  style={[
    styles.container,
    {
      backgroundColor:
        darkMode
          ? "#001233"
          : "#EEF3FA",
    },
  ]}
  contentContainerStyle={{
    flexGrow: 1,
    paddingBottom: 80,
  }}
  showsVerticalScrollIndicator={false}
>

    {/* Header Background */}

    <View style={styles.topBackground} />

    {/* Profile Card */}

    <TouchableOpacity
  style={[
    styles.profileCard,
    
    {
      backgroundColor:
        darkMode
          ? "#1E293B"
          : "#FFFFFF",
    },
    
  ]}

   onPress={() =>
    router.push(
      "/profile-details"
    )
  }
>

      <TouchableOpacity
  style={styles.profileImageWrapper}
  onPress={() =>
    router.push("/profile-details")}
>
  {
    profile.parent.profileImage
      ? (
        <Image
          source={{
            uri: profile.parent.profileImage,
          }}
          style={styles.profileImage}
        />
      )
      : (
        <View style={styles.profileImage}>
          <Text style={{ fontSize: 45, marginLeft:17, marginTop:10 }}>
            👤
          </Text>
        </View>
      )
  }

  <View
    style={{
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "#2563EB",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text
      style={{
        color: "#FFFFFF",
        fontSize: 14,
      }}
    >
      ✎
    </Text>
  </View>
</TouchableOpacity>

     <Text
  style={[
    styles.profileName,
    {
      color:
        darkMode
          ? "#FFFFFF"
          : "#000000",
    },
  ]}
>
  {
    profile.parent.name
  }
</Text>

     <Text
  style={[
    styles.profilePhone,
    {
      color:
        darkMode
          ? "#CBD5E1"
          : "#555555",
    },
  ]}
>
  {
    profile.parent.phone
  }
</Text>

      <View
        style={styles.verifiedBadge}
      >
        <Text
          style={styles.verifiedText}
        >
          ✔ Verified Parent Account
        </Text>
      </View>

    </TouchableOpacity>

    {/* Children */}

    <Text
      style={[
        styles.heading,
        {
           fontSize: 20,
            marginBottom: 15,
          color:
            darkMode
              ? "#FFFFFF"
              : "#000000",
        },
      ]}
    >
      Children
    </Text>

    {
      profile.students.map(
        (
          student: any
        ) => (

          <View
            key={
              student._id
            }
            style={[
              styles.studentCard,
              {
                backgroundColor:
                  darkMode
                    ? "#1E293B"
                    : "#FFFFFF",
              },
            ]}
          >

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >

              <View
                style={
                  styles.studentAvatar
                }
              >
                <Text
                  style={{
                    fontSize: 28,
                  }}
                >
                  👨‍🎓
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  marginLeft: 12,
                }}
              >

                <Text
                  style={[
                    styles.studentName,
                    {
                      color:
                        darkMode
                          ? "#FFFFFF"
                          : "#000000",
                    },
                  ]}
                >
                  {
                    student.name
                  }
                </Text>

                <Text
                  style={{
                    color:
                      darkMode
                        ? "#FFFFFF"
                        : "#444",
                  }}
                >
                  Class:
                  {" "}
                  {
                    student.className
                  }
                </Text>

                <Text
                  style={{
                    color:
                      darkMode
                        ? "#FFFFFF"
                        : "#444",
                  }}
                >
                  Admission:
                  {" "}
                  {
                    student.admissionNumber
                  }
                </Text>

              </View>

            </View>

          </View>

        )
      )
    }

   {/* Transport */}

<Text
  style={[
    styles.heading,
    {
      fontSize: 20,
      marginBottom: 15,
      color: darkMode
        ? "#FFFFFF"
        : "#000000",
    },
  ]}
>
  Transport Details
</Text>

{
  (() => {

    const pickup =
      profile.transport?.pickup;

    const drop =
      profile.transport?.drop;

    const sameBus =
      pickup?.busId &&
      drop?.busId &&
      String(pickup.busId) ===
        String(drop.busId);


    // ==========================================
    // SAME BUS FOR PICKUP + DROP
    // ==========================================

    if (sameBus) {

      return (

        <View
          style={[
            styles.transportCard,
            {
              backgroundColor:
                darkMode
                  ? "#1E293B"
                  : "#FFFFFF",
            },
          ]}
        >

          <Text
            style={[
              styles.transportTitle,
              {
                color:
                  darkMode
                    ? "#60A5FA"
                    : "#1565C0",
              },
            ]}
          >
            🚌 Transport
          </Text>


          {/* BUS */}

          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Bus Number:
            </Text>{" "}
            {pickup?.busNumber || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Vehicle Number:
            </Text>{" "}
            {pickup?.vehicleNumber || "--"}
          </Text>


          {/* DRIVER */}

          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Driver:
            </Text>{" "}
            {pickup?.driverName || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Driver Contact:
            </Text>{" "}
            {pickup?.driverPhone || "--"}
          </Text>


          {/* PICKUP */}

          <Text
            style={[
              styles.transportSubTitle,
              {
                color:
                  darkMode
                    ? "#60A5FA"
                    : "#1565C0",
              },
            ]}
          >
            Pickup
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Route:
            </Text>{" "}
            {pickup?.routeName || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Stop:
            </Text>{" "}
            {pickup?.pickupStop || "--"}
          </Text>


          {/* DROP */}

          <Text
            style={[
              styles.transportSubTitle,
              {
                color:
                  darkMode
                    ? "#4ADE80"
                    : "#15803D",
              },
            ]}
          >
            Drop
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Route:
            </Text>{" "}
            {drop?.routeName || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Stop:
            </Text>{" "}
            {drop?.dropStop || "--"}
          </Text>

        </View>

      );

    }


    // ==========================================
    // DIFFERENT BUS
    // ==========================================

    return (

      <>

        {/* ================= PICKUP ================= */}

        <View
          style={[
            styles.transportCard,
            {
              backgroundColor:
                darkMode
                  ? "#1E293B"
                  : "#FFFFFF",
            },
          ]}
        >

          <Text
            style={[
              styles.transportTitle,
              {
                color:
                  darkMode
                    ? "#60A5FA"
                    : "#1565C0",
              },
            ]}
          >
            🚌 Pickup Transport
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Bus Number:
            </Text>{" "}
            {pickup?.busNumber || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Vehicle Number:
            </Text>{" "}
            {pickup?.vehicleNumber || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Route:
            </Text>{" "}
            {pickup?.routeName || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Pickup Stop:
            </Text>{" "}
            {pickup?.pickupStop || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Driver:
            </Text>{" "}
            {pickup?.driverName || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Driver Contact:
            </Text>{" "}
            {pickup?.driverPhone || "--"}
          </Text>

        </View>


        {/* ================= DROP ================= */}

        <View
          style={[
            styles.transportCard,
            {
              backgroundColor:
                darkMode
                  ? "#1E293B"
                  : "#FFFFFF",
            },
          ]}
        >

          <Text
            style={[
              styles.transportTitle,
              {
                color:
                  darkMode
                    ? "#4ADE80"
                    : "#15803D",
              },
            ]}
          >
            🚌 Drop Transport
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Bus Number:
            </Text>{" "}
            {drop?.busNumber || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Vehicle Number:
            </Text>{" "}
            {drop?.vehicleNumber || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Route:
            </Text>{" "}
            {drop?.routeName || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Drop Stop:
            </Text>{" "}
            {drop?.dropStop || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Driver:
            </Text>{" "}
            {drop?.driverName || "--"}
          </Text>


          <Text
            style={[
              styles.transportText,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#000000",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Driver Contact:
            </Text>{" "}
            {drop?.driverPhone || "--"}
          </Text>

        </View>

      </>

    );

  })()
}

  </ScrollView>

);

}

const styles =
StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:
       "#FFFFFF",
    padding: 16,
  },

  loadingContainer: {
    flex: 1,
    // justifyContent:
    //   "center",
    // alignItems:
    //   "center",
  },

  headerCard: {
  backgroundColor: "hsl(215, 87%, 42%)",

  borderRadius: 28,

  paddingVertical: 30,

  paddingHorizontal: 20,

  alignItems: "center",

  marginTop: 25,

  marginBottom: 20,

  elevation: 8,
},

  profileIcon: {
    fontSize: 60,
  },

 parentName: {
  fontSize: 24,

  fontWeight: "700",

  color: "#FFFFFF",

  marginTop: 12,
},

parentPhone: {
  fontSize: 15,

  color: "#D6E8FF",

  marginTop: 6,
},

  card: {
  backgroundColor: "#FFFFFF",

  borderRadius: 24,

  padding: 20,

  marginBottom: 20,

    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,

    fontWeight:
      "bold",

    marginBottom: 15,

    color:
      "#1565C0",
  },

  studentName: {
    fontSize: 16,

    fontWeight:
      "bold",

    marginBottom: 5,
  },

  divider: {
    height: 1,

    backgroundColor:
      "#E5E7EB",

    marginTop: 15,
  },

  topBackground: {
  height: 180,

  backgroundColor: "#8FB4F7",

  marginHorizontal: -16,

  marginTop: -16,

  borderBottomLeftRadius: 45,

  borderBottomRightRadius: 45,
},

profileCard: {
  borderRadius: 24,
  alignItems: "center",
  paddingTop: 65,
  paddingBottom: 20,
  elevation: 8,
  marginBottom: 21,
},

profileImageWrapper: {
  position: "absolute",

  top: -50,
},

profileImage: {
  width: 100,

  height: 100,

  borderRadius: 50,

  borderWidth: 4,

  borderColor: "#FFFFFF",

  backgroundColor: "#E5E7EB",
},

profileName: {
  fontSize: 24,

  fontWeight: "700",

  color: "#000000",
},

profilePhone: {
  fontSize: 18,

  color: "#555",

  marginTop: 3,
},

verifiedBadge: {
  backgroundColor: "#EEF2F7",

  marginTop: 12,

  paddingHorizontal: 14,

  paddingVertical: 8,

  borderRadius: 12,
},

verifiedText: {
  color: "#4B5563",

  fontWeight: "600",
},

heading: {
  fontSize: 20,

  fontWeight: "700",

  marginBottom: 15,
},

studentCard: {
  backgroundColor: "#FFFFFF",

  borderRadius: 18,

  padding: 12,

  marginBottom: 15,

  elevation: 3,
},

studentAvatar: {
  width: 55,

  height: 58,

  borderRadius: 29,

  backgroundColor: "#E8EEFF",

  justifyContent: "center",

  alignItems: "center",
},

transportCard: {
  backgroundColor: "#FFFFFF",

  borderRadius: 16,

  padding: 12,

  elevation: 3,

  marginBottom: 40,
},

transportText: {
  fontSize: 16,

  color: "#374151",

  marginBottom: 10,
},

transportTitle: {
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 15,
},

transportSubTitle: {
  fontSize: 17,
  fontWeight: "700",
  marginTop: 10,
  marginBottom: 10,
},

});