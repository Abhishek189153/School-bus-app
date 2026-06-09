import React,
{
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import {
  getTripHistory,
} from "../services/mobile.service";

export default function TripHistory() {

  const [history,
    setHistory] =
    useState<any[]>([]);

  useEffect(() => {

    loadHistory();

  }, []);

  const loadHistory =
    async () => {

      const data =
        await getTripHistory();

      if (data.success) {
        setHistory(
          data.history
        );
      }
    };

  return (
    <View
      style={styles.container}
    >

      <Text
        style={styles.title}
      >
        Trip History
      </Text>

      <FlatList
        data={history}
        keyExtractor={(item) =>
          item._id
        }
        renderItem={({ item }) => (

          <View
            style={styles.card}
          >

            <Text>
              Route:
              {" "}
              {
                item.routeName
              }
            </Text>

            <Text>
              Bus:
              {" "}
              {
                item.busNumber
              }
            </Text>

            <Text>
              Type:
              {" "}
              {
                item.tripType
              }
            </Text>

            <Text>
              Boarded:
              {" "}
              {
                item.boarded
              }
            </Text>

            <Text>
              Absent:
              {" "}
              {
                item.absent
              }
            </Text>

            <Text>
              Status:
              {" "}
              {
                item.status
              }
            </Text>

          </View>
        )}
      />

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      padding: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },

    card: {
      backgroundColor:
        "#fff",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
    },

});