import { View, Text } from "react-native";

export default function Test() {

  console.log("TEST PAGE");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "green",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>TEST PAGE</Text>
    </View>
  );
}