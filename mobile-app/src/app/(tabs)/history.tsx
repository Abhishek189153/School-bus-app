import React,
{
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  useFocusEffect,
} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import DateTimePicker
from "@react-native-community/datetimepicker";

import {
  getHistory,
} from "../../services/mobile.service";

export default function History() {

  const [
  selectedDate,
  setSelectedDate,
] = useState(
  new Date()
);

const [
  isFiltered,
  setIsFiltered,
] = useState(false);

const [
  showPicker,
  setShowPicker,
] = useState(false);

  const [
    history,
    setHistory,
  ] = useState([]);

  const [
  darkMode,
  setDarkMode,
] = useState(false);

  useEffect(() => {

    loadHistory();

  }, []);

  useFocusEffect(
  useCallback(() => {

    loadTheme();

  }, [])
);

  const loadHistory =
    async () => {

      const data =
        await getHistory();

      if (
        data.success
      ) {

        setHistory(
          data.history
        );

      }

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

    const clearFilter =
  async () => {

    setIsFiltered(
      false
    );

    setSelectedDate(
      new Date()
    );

    const data =
      await getHistory();

    if (
      data.success
    ) {

      setHistory(
        data.history
      );

    }

  };

  return (

    <ScrollView
  style={[
  styles.container,
  {
    backgroundColor:
      darkMode
        ? "#001233"
        : "#EEF4FF",
  },
]}

  contentContainerStyle={{
    paddingBottom: 120,
  }}

  showsVerticalScrollIndicator={
    false
  }
>

      <Text
        style={
          styles.heading
        }
      >
        📅 History
      </Text>

     <View
  style={{
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  }}
>

  <TouchableOpacity

    style={[
  styles.filterCard,
  {
    flex: 4,

    backgroundColor:
      darkMode
        ? "#1E293B"
        : "#FFFFFF",
  },
]}

    onPress={() =>
      setShowPicker(
        true
      )
    }

  >

    <Text
      style={[
  styles.filterText,
  {
    color:
      darkMode
        ? "#60A5FA"
        : "#1565C0",
  },
]}
    >
      📆 Filter By Date
    </Text>

  </TouchableOpacity>

  {
  isFiltered && (
  <TouchableOpacity

    style={{
      flex: 1,

      backgroundColor:
        "#EF4444",

      borderRadius: 16,
      height:50,

      justifyContent:
        "center",

      alignItems:
        "center",
    }}

    onPress={
      clearFilter
    }

  >

    <Text
      style={{
        color:
          "#FFFFFF",

        fontWeight:
          "bold",
      }}
    >
      Clear
    </Text>

  </TouchableOpacity>
  )}

</View>

{
  showPicker && (

    <DateTimePicker

      value={
        selectedDate
      }

      mode="date"

      onChange={
        async (
          event,
          date
        ) => {

          setShowPicker(
            false
          );

          if (!date)
            return;

          setSelectedDate(
            date
          );

          setIsFiltered(
            true
          );

         const formattedDate =
`${date.getFullYear()}-${
  String(
    date.getMonth() + 1
  ).padStart(2, "0")
}-${
  String(
    date.getDate()
  ).padStart(2, "0")
}`;

          const data =
            await getHistory(
              formattedDate
            );

          if (
            data.success
          ) {

            setHistory(
              data.history
            );

          }

        }
      }

    />

  )
}

     {
  history.map(
    (
      trip: any,
      index: number
    ) => (

      <View
        key={index}
        style={[
          styles.card,
          {
            backgroundColor:
              darkMode
                ? "#1E293B"
                : "#FFFFFF",
          },
        ]}      >

        <Text
          style={[
          styles.date,
          {
            color:
              darkMode
                ? "#60A5FA"
                : "#0F4C81",
          },
        ]}
        >
          {
            trip.tripType ===
            "PICKUP"
              ? "🚍 PICKUP"
              : "🏫 DROP"
          }
        </Text>

        <Text
          style={{
            marginBottom: 15,
            color: "#64748B",
          }}
        >
          {trip.date}
        </Text>

        {
          trip.students.map(
            (
              student: any,
              idx: number
            ) => (

              <View
                key={idx}
                style={{
                  marginBottom: 12,
                }}
              >

               <Text
                style={{
                  fontWeight: "bold",

                  color:
                    darkMode
                      ? "#FFFFFF"
                      : "#000000",
                }}
              >
                  {
                    student.status ===
                    "PRESENT"
                      ? "✅"
                      : "❌"
                  }
                  {" "}
                  {student.name}
                </Text>

                <Text
                style={{
                  color:
                    darkMode
                      ? "#CBD5E1"
                      : "#000000",
                }}
              >

                  {
                    student.status ===
                    "PRESENT"

                    ? `Boarded Bus from ${
                        trip.tripType ===
                        "PICKUP"

                          ? student.pickupStop

                          : "School"
                      }`

                    : "Not Boarded"

                  }

                </Text>

              </View>

            )
          )
        }

      </View>

    )
  )
}

    </ScrollView>

  );

}

const styles =
StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor:
      "#EEF4FF",

    padding: 16,

  },

  heading: {

    fontSize: 26,

    fontWeight:
      "bold",

    color:
      "#0F4C81",

    marginBottom: 20,

    marginTop: 25,

  },

  card: {

    backgroundColor:
      "#FFFFFF",

    borderRadius: 20,

    padding: 18,

    marginBottom: 15,

    elevation: 3,

  },

  date: {

    fontWeight:
      "bold",

    marginBottom: 10,

    color:
      "#0F4C81",

  },

  filterCard: {

  backgroundColor:
    "#FFFFFF",

  padding: 15,

  borderRadius: 16,

  marginBottom: 20,

  elevation: 3,

},

filterText: {

  textAlign:
    "center",

  fontWeight:
    "bold",

  color:
    "#1565C0",

},

});