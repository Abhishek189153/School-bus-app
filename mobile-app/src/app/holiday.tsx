// import React from "react";

// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";

// import { Ionicons } from "@expo/vector-icons";

// import {
//   useLocalSearchParams,
//   useRouter,
// } from "expo-router";

// export default function HolidayScreen() {

//   const router = useRouter();

//   const {
//     holidayName,
//   } = useLocalSearchParams();

//   return (

//     <View style={styles.container}>

//       <View style={styles.iconContainer}>

//         <Text style={styles.emoji}>
//           🎉
//         </Text>

//       </View>

//       <Text style={styles.title}>
//         School Holiday
//       </Text>

//       <Text style={styles.subtitle}>
//         No routes are scheduled today.
//       </Text>

//       <View style={styles.divider} />

//       <View style={styles.card}>

//         <Text style={styles.label}>
//           Holiday
//         </Text>

//         <Text style={styles.holidayName}>
//           {holidayName}
//         </Text>

//       </View>

//       <View style={styles.divider} />

//       <Text style={styles.footerText}>
//         Have a wonderful day!
//       </Text>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() =>
//           router.replace("/driver-dashboard")
//         }
//       >

//         <Ionicons
//           name="arrow-back"
//           size={20}
//           color="#fff"
//         />

//         <Text style={styles.buttonText}>
//           Back to Dashboard
//         </Text>

//       </TouchableOpacity>

//     </View>

//   );

// }

// const styles = StyleSheet.create({

//   container: {

//     flex: 1,

//     backgroundColor: "#F8FAFC",

//     justifyContent: "center",

//     alignItems: "center",

//     paddingHorizontal: 24,

//   },

//   iconContainer: {

//     width: 120,

//     height: 120,

//     borderRadius: 60,

//     backgroundColor: "#E8F5E9",

//     justifyContent: "center",

//     alignItems: "center",

//     marginBottom: 25,

//   },

//   emoji: {

//     fontSize: 60,

//   },

//   title: {

//     fontSize: 30,

//     fontWeight: "700",

//     color: "#1E293B",

//   },

//   subtitle: {

//     marginTop: 12,

//     fontSize: 18,

//     color: "#64748B",

//     textAlign: "center",

//     lineHeight: 28,

//   },

//   divider: {

//     width: "80%",

//     height: 1,

//     backgroundColor: "#E2E8F0",

//     marginVertical: 30,

//   },

//   card: {

//     width: "100%",

//     backgroundColor: "#FFFFFF",

//     borderRadius: 18,

//     padding: 22,

//     elevation: 3,

//     shadowColor: "#000",

//     shadowOpacity: 0.08,

//     shadowRadius: 8,

//     shadowOffset: {

//       width: 0,

//       height: 3,

//     },

//   },

//   label: {

//     fontSize: 16,

//     color: "#64748B",

//     marginBottom: 10,

//   },

//   holidayName: {

//     fontSize: 24,

//     fontWeight: "700",

//     color: "#2563EB",

//   },

//   footerText: {

//     marginTop: 5,

//     fontSize: 18,

//     color: "#475569",

//     marginBottom: 45,

//   },

//   button: {

//     flexDirection: "row",

//     alignItems: "center",

//     justifyContent: "center",

//     backgroundColor: "#2563EB",

//     width: "100%",

//     paddingVertical: 16,

//     borderRadius: 14,

//     elevation: 2,

//   },

//   buttonText: {

//     color: "#FFFFFF",

//     fontSize: 17,

//     fontWeight: "600",

//     marginLeft: 10,

//   },

// });