import React,
{
  useEffect,
  useState,
  useCallback
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import { BackHandler } from "react-native";
import { useFocusEffect } from "expo-router";


import {
  router,
} from "expo-router";

import * as ImagePicker
from "expo-image-picker";

import {
  getProfile,
  updateProfileImage,
} from "../services/mobile.service";

export default function ProfileDetails() {

  useFocusEffect(
  useCallback(() => {

    const onBackPress = () => {

      router.replace("/(tabs)/profile");

      return true;
    };

    const subscription =
      BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

    return () => subscription.remove();

  }, [])
);

  const [
    profile,
    setProfile,
  ] = useState<any>(null);

  useEffect(() => {

    loadProfile();

  }, []);

  const loadProfile =
    async () => {

      const data =
        await getProfile();

      if (
        data.success
      ) {

        setProfile(
          data
        );

      }

    };

  const pickImage =
    async () => {

      Alert.alert(

        "Profile Photo",

        "Choose Option",

        [

          {
            text:
              "Camera",

            onPress:
              openCamera,
          },

          {
            text:
              "Gallery",

            onPress:
              openGallery,
          },

          {
            text:
              "Cancel",

            style:
              "cancel",
          },

        ]

      );

    };

  const openGallery =
    async () => {

      const result =
        await ImagePicker.launchImageLibraryAsync({

          mediaTypes:
            ["images"],

          allowsEditing:
            true,

          aspect:
            [1, 1],

          quality:
            0.8,

        });

      if (
        !result.canceled
      ) {

        const imageUri =
          result.assets[0].uri;

        await updateProfileImage(
          imageUri
        );

        loadProfile();

      }

    };

  const openCamera =
    async () => {

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (
        !permission.granted
      ) {

        Alert.alert(
          "Camera permission denied"
        );

        return;

      }

      const result =
        await ImagePicker.launchCameraAsync({

          allowsEditing:
            true,

          aspect:
            [1, 1],

          quality:
            0.8,

        });

      if (
        !result.canceled
      ) {

        const imageUri =
          result.assets[0].uri;

        await updateProfileImage(
          imageUri
        );

        loadProfile();

      }

    };

  if (!profile) {

    return (

      <View
        style={
          styles.loadingContainer
        }
      >

        <Text>
          Loading...
        </Text>

      </View>

    );

  }

  return (

    <View
      style={
        styles.container
      }
    >

      <TouchableOpacity
  style={
    styles.backButton
  }
  onPress={() =>
    router.replace(
      "/(tabs)/profile"
    )
  }
>

  <Text
    style={
      styles.backText
    }
  >
    ← Back
  </Text>

</TouchableOpacity>

      <TouchableOpacity
        style={
          styles.imageContainer
        }
        onPress={
          pickImage
        }
      >

        {
          profile.parent
            ?.profileImage
          ? (

            <Image

              source={{
                uri:
                  profile.parent.profileImage,
              }}

              style={
                styles.profileImage
              }

            />

          )
          : (

            <Text
              style={
                styles.profileIcon
              }
            >
              👤
            </Text>

          )
        }

      </TouchableOpacity>

      <Text
        style={
          styles.name
        }
      >
        {
          profile.parent.name
        }
      </Text>

      <Text
        style={
          styles.phone
        }
      >
        {
          profile.parent.phone
        }
      </Text>

      <Text
        style={
          styles.helpText
        }
      >
        Tap photo to change
      </Text>

    </View>

  );

}

const styles =
StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor:
      "#F8FAFC",

    alignItems:
      "center",

    paddingTop: 60,

  },

  loadingContainer: {

    flex: 1,

    justifyContent:
      "center",

    alignItems:
      "center",

  },

  backText: {

    fontSize: 18,

    color:
      "#1565C0",

    alignSelf:
      "flex-start",

    marginLeft: -130,

    marginBottom: 40,

    fontWeight:
      "bold",

  },

  imageContainer: {

    width: 150,

    height: 150,

    borderRadius: 75,

    backgroundColor:
      "#E3F2FD",

    justifyContent:
      "center",

    alignItems:
      "center",

  },

  profileImage: {

    width: 150,

    height: 150,

    borderRadius: 75,

  },

  profileIcon: {

    fontSize: 90,

  },

  name: {

    fontSize: 24,

    fontWeight:
      "bold",

    marginTop: 20,

    color:
      "#1E293B",

  },

  phone: {

    fontSize: 18,

    marginTop: 8,

    color:
      "#64748B",

  },

  backButton: {

  marginLeft:-90,
  marginTop: -8,

},

  helpText: {

    marginTop: 20,

    color:
      "#1565C0",

    fontWeight:
      "600",

  },

});