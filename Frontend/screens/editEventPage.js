import { React, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  Pressable,
  Modal,
} from "react-native";
import GlobalStyles from "../global-style";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { API_BASE_URL } from "../axios.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PopUpModal from "../components/PopUpModal.js";

const EditEventPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [event_name, setTitle] = useState(route.params.eventTitle);
  const [event_desc, setInformation] = useState(route.params.eventInformation);
  const [event_pic, setEventPic] = useState(route.params.eventPic);
  const [event_price, setPrice] = useState(route.params.price);
  const [event_date, setDate] = useState(
    new Date(route.params.date + "T11:43:00.000Z")
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cut_date_string, setCutDate] = useState(route.params.date);
  const [event_time, setTime] = useState(
    new Date("2023-05-27T" + route.params.time + ".000Z")
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [cut_time_string, setCutTime] = useState(route.params.time);
  const [release_date, setReleaseDate] = useState(
    new Date(route.params.releaseDate + "T11:43:00.000Z")
  );
  const [showReleaseDatePicker, setShowReleaseDatePicker] = useState(false);
  const [cut_release_date_string, setCutReleaseDate] = useState(
    route.params.releaseDate
  );
  const [release_time, setReleaseTime] = useState(
    new Date("2023-05-27T" + route.params.releaseTime + "Z")
  );
  const [cut_release_time_string, setCutReleaseTime] = useState(
    route.params.releaseTime
  );
  const [showReleaseTimePicker, setShowReleaseTimePicker] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [location, setLocation] = useState(route.params.location);
  const [tickets_left, setTicketsLeft] = useState(route.params.ticketsLeft);
  const [organization, setOrganizationID] = useState(" ");
  const [error, setError] = useState("");
  const eventId = route.params.eventId;
  const [modalVisible, setModalVisible] = useState(false);

  console.log("event id " + eventId);
  console.log("org id: " + organization);
  console.log(event_date);
  console.log(event_time);
  console.log("price: " + event_price);
  console.log("cuttad tid" + cut_date_string);
  console.log("eventvild: " + event_pic);
  console.log("tickets " + tickets_left);

  const getOrganizationProfile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: userProfile } = response.data;

      if (userProfile && userProfile.length > 0) {
        const { id } = userProfile[0];
        setOrganizationID(id);
        console.log("org: " + organization + " hej" + id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (
      !event_name ||
      !event_desc ||
      !event_pic ||
      !event_price ||
      !event_date ||
      !event_time ||
      !location ||
      !tickets_left
    ) {
      setError("Please fill in all the required fields to edit your event!");
      setModalVisible(true);
      return;
    }
    const body = {
      event_name: event_name,
      event_desc: event_desc,
      event_pic: event_pic,
      event_price: event_price,
      event_date: cut_date_string,
      event_time: cut_time_string,
      release_date: cut_release_date_string,
      release_time: cut_release_time_string,
      event_location: location,
      tickets_left: tickets_left,
    };

    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log(body);
      const response = await API_BASE_URL.put(
        `/api/organizations/${organization}/events/${eventId}/`,
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      navigation.navigate("MyEventuresOrgPage", { isProfileUpdated: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDatePress = () => {
    setShowDatePicker(!showDatePicker);
  };
  const handleTimePress = () => {
    setShowTimePicker(!showTimePicker);
  };
  const handleReleasePress = () => {
    setShowReleaseDatePicker(!showReleaseDatePicker);
  };
  const handleReleaseTimePress = () => {
    setShowReleaseTimePicker(!showReleaseTimePicker);
  };

  useEffect(() => {
    getOrganizationProfile();
    console.log(organization);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const availableImages = [
    // Eight pre created images for events
    require("../assets/1.png"),
    require("../assets/2.png"),
    require("../assets/3.png"),
    require("../assets/4.png"),
    require("../assets/5.png"),
    require("../assets/6.png"),
    require("../assets/7.png"),
    require("../assets/8.png"),
  ];

  const handleImagePicker = () => {
    setShowModal(true);
  };

  const handleImageSelection = (image, index) => {
    setSelectedImage(image);
    setShowModal(false);
    setEventPic(index + 101);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || event_date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
    const event_date_string = currentDate.toLocaleDateString("sv-SE");
    setCutDate(event_date_string.slice(0, 10));
    console.log(event_date_string);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || event_time;
    setShowTimePicker(Platform.OS === "ios");
    setTime(currentTime);
    const event_time_string = currentTime.toLocaleTimeString("sv-SE");
    setCutTime(event_time_string);
    console.log(event_time_string);
  };

  const handleReleaseDateChange = (event, selectedReleaseDate) => {
    const currentReleaseDate = selectedReleaseDate || release_date;
    setShowReleaseDatePicker(Platform.OS === "ios");
    setReleaseDate(currentReleaseDate);
    const event_release_date_string =
      currentReleaseDate.toLocaleDateString("sv-SE");
    setCutReleaseDate(event_release_date_string.slice(0, 10));
    console.log(event_release_date_string);
  };

  const handleReleaseTimeChange = (event, selectedReleaseTime) => {
    const currentReleaseTime = selectedReleaseTime || release_time;
    setShowReleaseTimePicker(Platform.OS === "ios");
    setReleaseTime(currentReleaseTime);
    const event_release_time_string =
      currentReleaseTime.toLocaleTimeString("sv-SE");
    setCutReleaseTime(event_release_time_string);
    console.log(event_release_time_string);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView style={styles.createEventArea}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Eventure Title *</Text>
          <TextInput
            style={styles.inputField}
            onChangeText={(text) => setTitle(text)}
            value={event_name}
            placeholder="Enter event title"
          />
        </View>
        <Text style={{ fontSize: 13, marginTop: 8, marginLeft: "4%" }}>
          Eventure date:
        </Text>
        <View style={styles.dateAndTime}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(handleDatePress)}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="calendar" size={30} color="black" />
              <View style={styles.dateText}>
                <Text style={{ marginLeft: "5%" }}>Date *</Text>
                <Text style={styles.dateAndTimeText}>
                  {format(event_date, "do 'of' MMMM yyyy")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowTimePicker(handleTimePress)}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="time" size={30} color="black" />
              <View style={styles.dateText}>
                <Text style={{ marginLeft: "5%" }}>Time *</Text>
                <Text style={styles.dateAndTimeText}>
                  {event_time.toString().slice(16, 21)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.dateAndTimeChange}>
          <View style={styles.dateChange}>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={event_date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          <View style={styles.timeChange}>
            {showTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={event_time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
        </View>

        <Text style={{ fontSize: 13, marginTop: 8, marginLeft: "4%" }}>
          Ticket release:
        </Text>
        <View style={styles.dateAndTime}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowReleaseDatePicker(handleReleasePress)}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="calendar" size={30} color="black" />
              <View style={styles.dateText}>
                <Text style={{ marginLeft: "5%" }}>Date</Text>
                <Text style={styles.dateAndTimeText}>
                  {format(release_date, "do 'of' MMMM yyyy")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowReleaseTimePicker(handleReleaseTimePress)}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="time" size={30} color="black" />
              <View style={styles.dateText}>
                <Text style={{ marginLeft: "5%" }}>Time</Text>
                <Text style={styles.dateAndTimeText}>
                  {release_time.toString().slice(16, 21)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.dateAndTimeChange}>
          <View style={styles.dateChange}>
            {showReleaseDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={release_date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleReleaseDateChange}
              />
            )}
          </View>
          <View style={styles.timeChange}>
            {showReleaseTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={release_time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleReleaseTimeChange}
              />
            )}
          </View>
        </View>

        <View style={styles.imageContainer}>
          {selectedImage ? (
            <TouchableOpacity onPress={handleImagePicker}>
              <Image
                source={selectedImage}
                style={[
                  styles.selectedImage,
                  {
                    justifyContent: "center",
                    alignSelf: "center",
                    width: "92%",
                    height: 200,
                    borderRadius: 5,
                  },
                ]}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={handleImagePicker}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="image-outline" size={20} color="black" />
              </View>
              <Text style={styles.imagePickerButtonText}>
                Choose Eventure Pic *
              </Text>
            </TouchableOpacity>
          )}

          <Modal
            visible={showModal}
            transparent={true}
            statusBarTranslucent={true}
          >
            <View style={styles.modalContainer}>
              <ScrollView
                contentContainerStyle={styles.modalContent}
                showsVerticalScrollIndicator={false}
              >
                {availableImages.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.imagePickerItem}
                    onPress={() => handleImageSelection(image, index)}
                  >
                    <Image source={image} style={styles.imagePickerImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Modal>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Eventure information *</Text>
          <TextInput
            style={[
              styles.inputField,
              { height: 140, textAlignVertical: "top" },
            ]}
            onChangeText={(text) => setInformation(text)}
            value={event_desc}
            placeholder="Enter event info"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Eventure location *</Text>
          <TextInput
            style={styles.inputField}
            onChangeText={(text) => setLocation(text)}
            value={location}
            placeholder="Enter event location"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Eventure Price *</Text>
          <TextInput
            style={styles.inputField}
            onChangeText={(text) => {
              if (/^\d*(\.\d*)?$/.test(text) || text === "") {
                setPrice(text);
              }
            }}
            value={event_price}
            placeholder="Enter event price"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amount of tickets *</Text>
          <TextInput
            style={styles.inputField}
            onChangeText={(text) => {
              if (/^\d*$/.test(text) || text === "") {
                setTicketsLeft(text);
              }
            }}
            value={tickets_left.toString()}
            placeholder="Enter ticket amount"
            keyboardType="numeric"
          />
        </View>

        <View style={{ marginHorizontal: "4%" }}>
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              GlobalStyles.button,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={GlobalStyles.buttonText}> Save changes</Text>
          </Pressable>
        </View>
        <View style={{ height: 50 }}></View>
        <PopUpModal
          isVisible={modalVisible}
          text={error}
          closeModal={closeModal}
          buttonText="OK"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "auto",
  },
  container: {
    flex: 1,
    backgroundColor: "#BDE3FF",
  },
  createEventArea: {
    flex: 1,
  },
  inputContainer: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: "4%",
  },
  inputLabel: {
    fontSize: 13,
    marginBottom: 5,
  },
  inputField: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
  },
  inputComponent: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: "4%",
  },
  inputPictureField: {
    width: "99%",
    height: 200,
    margin: "0.5%",
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
  },

  dateAndTime: {
    alignItems: "center",
    flexDirection: "row",
    height: "8%",
    marginBottom: 5,
    marginHorizontal: "4%",
  },

  datePickerButton: {
    width: "48%",
    height: 55,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  dateAndTimeChange: {
    flexDirection: "row",
  },

  dateChange: {
    width: "42%",
    marginRight: "5%",
  },

  timeChange: {
    marginLeft: "14%",
  },
  imageContainer: {
    marginTop: "4%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  timePickerButton: {
    width: "48%",
    height: 55,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: "4%",
    backgroundColor: "white",
  },

  dateAndTimeText: {
    fontWeight: "bold",
    marginLeft: "5%",
    fontSize: 13,
  },
  imagePickerImage: {
    marginVertical: 4,
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 5,
    height: 120,
    width: 200,
    marginLeft: "4%",
  },
  imagePickerButton: {
    height: 100,
    width: "92%",
    backgroundColor: "white",
    marginHorizontal: "4%",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
});

export default EditEventPage;
