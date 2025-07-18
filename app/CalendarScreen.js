import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

// Utility for generating unique background colors without repeats
const pastelColors = [
  "#FFD3B6",
  "#DCEDC1",
  "#FFAAA5",
  "#AEC6CF",
  "#FFFACD",
  "#CBAACB",
  "#E0BBE4",
];
const router = useRouter();

const getUniqueColor = (usedColors) => {
  let index;
  do {
    index = Math.floor(Math.random() * pastelColors.length);
  } while (usedColors[usedColors.length - 1] === pastelColors[index]);
  return pastelColors[index];
};

const EventScreen = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [eventText, setEventText] = useState("");
  const [events, setEvents] = useState({});
  const [eventColors, setEventColors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null); // { date, index }

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setEventText("");
    setEditing(null);
    setModalVisible(true);
  };

  const handleAddOrUpdateEvent = () => {
    if (eventText.trim() === "") return;

    setEvents((prev) => {
      const updated = { ...prev };
      if (!updated[selectedDate]) updated[selectedDate] = [];

      if (editing) {
        updated[editing.date][editing.index] = eventText;
      } else {
        updated[selectedDate].push(eventText);

        // Assign color to this new event
        setEventColors((prevColors) => {
          const usedColors = Object.values(prevColors).map((c) => c.color);
          const newColor = getUniqueColor(usedColors);
          return {
            ...prevColors,
            [`${selectedDate}-${updated[selectedDate].length - 1}`]: {
              color: newColor,
            },
          };
        });
      }

      return updated;
    });

    setModalVisible(false);
    setEventText("");
    setEditing(null);
  };

  const handleEditEvent = (date, index, text) => {
    setSelectedDate(date);
    setEventText(text);
    setEditing({ date, index });
    setModalVisible(true);
  };

  const handleDeleteEvent = (date, index) => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setEvents((prev) => {
            const updated = { ...prev };
            updated[date].splice(index, 1);
            if (updated[date].length === 0) delete updated[date];
            return updated;
          });
          setEventColors((prev) => {
            const updated = { ...prev };
            delete updated[`${date}-${index}`];
            return updated;
          });
        },
      },
    ]);
  };

  const today = new Date().toISOString().split("T")[0];

  const allEvents = Object.entries(events).flatMap(([date, eventList]) =>
    eventList.map((event, index) => ({
      key: `${date}-${index}`,
      date,
      event,
      index,
    }))
  );

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
      <Text style={styles.header}>Calendar</Text>

      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [today]: {
            marked: true,
            dotColor: "red",
          },
          ...Object.keys(events).reduce((acc, date) => {
            acc[date] = {
              ...acc[date],
              marked: date === today,
              selected: date === selectedDate,
              selectedColor: date === selectedDate ? "#4CAF50" : undefined,
            };
            return acc;
          }, {}),
        }}
        theme={{
          calendarBackground: "#fff",
          textSectionTitleColor: "#333",
          todayTextColor: "#4CAF50",
          dayTextColor: "#333",
          arrowColor: "#4CAF50",
          monthTextColor: "#4CAF50",
        }}
      />

      <Text style={styles.subHeader}>Events</Text>

      <FlatList
        data={allEvents}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          const color =
            eventColors[item.key]?.color ||
            getUniqueColor(Object.values(eventColors).map((c) => c.color));
          return (
            <View style={[styles.eventCard, { backgroundColor: color }]}>
              <Text style={styles.eventDate}>{item.date}</Text>
              <Text style={styles.eventText}>{item.event}</Text>
              <View style={styles.eventActions}>
                <TouchableOpacity
                  onPress={() =>
                    handleEditEvent(item.date, item.index, item.event)
                  }
                >
                  <Ionicons name="create-outline" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteEvent(item.date, item.index)}
                >
                  <Ionicons name="trash-outline" size={20} color="#c00" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListEmptyComponent={
          <Text style={styles.noEvent}>No events added.</Text>
        }
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editing ? "Edit Event" : "Add Event"}
            </Text>
            <Text style={styles.modalDate}>{selectedDate}</Text>
            <TextInput
              placeholder="Enter event"
              value={eventText}
              onChangeText={setEventText}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddOrUpdateEvent}
            >
              <Text style={styles.addButtonText}>
                {editing ? "Update" : "Add"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#4CAF50",
    alignSelf: "center",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#4CAF50",
  },
  noEvent: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 10,
  },
  eventCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  eventDate: {
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
    fontWeight: "bold",
  },
  eventText: {
    fontSize: 14,
    color: "#000",
  },
  eventActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
  },
  modalDate: {
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#999",
    padding: 6,
    borderRadius: 20,
  },
});
