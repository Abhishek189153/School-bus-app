import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

// import {
//   VideoView,
//   useVideoPlayer,
// } from "expo-video";

export default function HomeScreen() {
  // const player = useVideoPlayer(
  //   require("../../assets/videos/firstpage.mp4"),
  //   (player) => {
  //     player.loop = true;
  //     player.play();
  //   }
  // );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.title}>
          School Bus
        </Text>

        <Text style={styles.subtitle}>
          App
        </Text>

        <Text style={styles.description}>
          Safe, reliable and real-time transportation
          management for students, parents and drivers.
        </Text>
      </View>

      {/* Video */}

      {/* <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.heroVideo}
          nativeControls={false}
        />
      </View> */}

      {/* Login Cards */}

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, styles.driverCard]}
          activeOpacity={0.9}
          onPress={() =>
            router.push("/driver-login")
          }
        >
          <View>
            <Text style={styles.cardTitle}>
              Driver Login
            </Text>

            <Text style={styles.cardText}>
              Access routes, trips and
              student pickup details
            </Text>
          </View>

          <Text style={styles.arrow}>
            →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.parentCard]}
          activeOpacity={0.9}
          onPress={() =>
            router.push("/parent-login")
          }
        >
          <View>
            <Text style={styles.cardTitle}>
              Parent Login
            </Text>

            <Text style={styles.cardText}>
              Track buses and monitor
              student travel updates
            </Text>
          </View>

          <Text style={styles.arrow}>
            →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Safe Transportation • Real-Time
          Tracking
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },

  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A237E",
  },

  subtitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A237E",
    marginBottom: 10,
  },

  description: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  videoContainer: {
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
    overflow: "hidden",
    borderRadius: 20,
  },

  heroVideo: {
    width: "100%",
    height: 220,
  },

  cardContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },

  card: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,

    elevation: 8,
  },

  driverCard: {
    backgroundColor: "#1565C0",
  },

  parentCard: {
    backgroundColor: "#2E7D32",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  cardText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
    maxWidth: "90%",
  },

  arrow: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },

  footerText: {
    color: "#94A3B8",
    fontSize: 13,
    textAlign: "center",
  },
});