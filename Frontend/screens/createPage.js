import {React, useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Platform, Image, ScrollView, Pressable } from "react-native";
import GlobalStyles from "../global-style";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import * as ImagePicker from 'expo-image-picker';
import jwtDecode from "jwt-decode";
import { API_BASE_URL } from "../axios.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PopUpModal from "../components/PopUpModal.js";

const CreatePage = () => {
    const [event_name, setTitle] = useState("");
    //const [location, setLocation] = useState("");
    const [event_desc, setInformation] = useState("");
    const [event_price, setPrice] = useState("");
    const [event_date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [cut_date_string, setCutDate] = useState('')
    const [event_time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [cut_time_string, setCutTime] = useState('')
    const [release_date, setReleaseDate] = useState(new Date());
    const [showReleaseDatePicker, setShowReleaseDatePicker] = useState(false);
    const [cut_release_date_string, setCutReleaseDate] = useState('')
    const [release_time, setReleaseTime] = useState(new Date()); 
    const [cut_release_time_string, setCutReleaseTime] = useState('')
    const [showReleaseTimePicker, setShowReleaseTimePicker] = useState(false);
    const [imageUri, setImageUri] = useState('');
    const [tickets_left, setTicketsLeft] = useState('');
    const [organization, setOrganizationID] = useState(" ");
    const [error, setError] = useState("");
    

    useEffect(() => {
        getOrganizationProfile();
        console.log(organization)
      }, []);

    const getOrganizationProfile = async () => {
        try {
          const accessToken = await AsyncStorage.getItem("accessToken");
          const response = await API_BASE_URL.get("/api/profile/", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
          });
          const { data: userProfile } = response.data;
    
          if (userProfile && userProfile.length > 0) {
            const {id } = userProfile[0];
            setOrganizationID(id);
            console.log("org hej" + id);
          }
        } catch (error) {
          console.error(error);
        }
    };
    

    const handleSubmit = async () => {
        if (!event_name /* || !location */ || !event_desc || !event_price || !event_date|| !event_time || !tickets_left) {
          setModalVisible(true);
          return;
        }
        try {
               const body = {
                event_name: event_name,
                event_desc: event_desc,
                event_price: event_price,
                event_date: cut_date_string,
                event_time: cut_time_string,
                release_date: cut_release_date_string,
                release_time: cut_release_time_string,
                tickets_left: tickets_left,
                event_org: organization
            
          };
          console.log(body)
          const accessToken = await AsyncStorage.getItem("accessToken");
          const response = await API_BASE_URL.post(`/api/organizations/${organization}/events/`, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
          });;
          const state = {
            userToken: response.data.token, 
          };
          navigation.navigate("StudentLoginPage"); 
        } catch (error) {
          console.log(error);
        }
      };
           

      const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || event_date;
        setShowDatePicker(Platform.OS === "ios");
        setDate(currentDate);
        const event_date_string = currentDate.toLocaleDateString('sv-SE');
        setCutDate(event_date_string.slice(0, 10));
        console.log(event_date_string)
      };
      
    
      const handleTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || event_time;
        setShowTimePicker(Platform.OS === "ios");
        setTime(currentTime);
        const event_time_string = currentTime.toLocaleTimeString('sv-SE');
        setCutTime(event_time_string);
        console.log(event_time_string)

      };
      

    const handleReleaseDateChange = (event, selectedReleaseDate) => {
        const currentReleaseDate = selectedReleaseDate || release_date;
        setShowReleaseDatePicker(Platform.OS === "ios");
        setReleaseDate(currentReleaseDate);
        const event_release_date_string = currentReleaseDate.toLocaleDateString('sv-SE');
        setCutReleaseDate(event_release_date_string.slice(0, 10));
        console.log(event_release_date_string)
    };

    const handleReleaseTimeChange = (event, selectedReleaseTime) => {
        const currentReleaseTime = selectedReleaseTime || release_time;
        setShowReleaseTimePicker(Platform.OS === "ios");
        setReleaseTime(currentReleaseTime);
        const event_release_time_string = currentReleaseTime.toLocaleTimeString('sv-SE');
        setCutReleaseTime(event_release_time_string);
        console.log(event_release_time_string)
    };




    return (
        <SafeAreaView style={styles.container}>

            <ScrollView style={styles.createEventArea}>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Eventure Title:</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(text) => setTitle(text)}
                        value={event_name}
                        placeholder="Enter event title"
                    />
                </View>

               {/*  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Location:</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(text) => setLocation(text)}
                        value={location}
                        placeholder="Enter event location"
                    />
                </View> */}
                
                <Text style={{fontSize: 13, marginTop: 8, marginLeft: '2%'}}>Eventure date:</Text>
                <View style={styles.dateAndTime}>
                    <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                        <View style={styles.buttonContent}>
                            <Ionicons name="calendar" size={30} color="black" />
                            <View style={styles.dateText}>
                                <Text style={{ marginLeft: '5%' }}>Date:</Text>
                                <Text style={styles.dateAndTimeText}>{format(event_date, "do 'of' MMMM yyyy")}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
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
                    <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowTimePicker(true)}>
                        <View style={styles.buttonContent}>
                            <Ionicons name="time" size={30} color="black" />
                            <View style={styles.dateText}>
                                <Text style={{ marginLeft: '5%' }}>Time:</Text>
                                <Text style={styles.dateAndTimeText}>{event_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, hourCycle: 'h23' })}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
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

                <Text style={{fontSize: 13, marginTop: 8, marginLeft: '2%'}}>Ticket release:</Text>
                <View style={styles.dateAndTime}>
                    <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowReleaseDatePicker(true)}>
                        <View style={styles.buttonContent}>
                            <Ionicons name="calendar" size={30} color="black" />
                            <View style={styles.dateText}>
                                <Text style={{ marginLeft: '5%' }}>Date:</Text>
                                <Text style={styles.dateAndTimeText}>{format(release_date, "do 'of' MMMM yyyy")}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
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
                    <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowReleaseTimePicker(true)}>
                        <View style={styles.buttonContent}>
                            <Ionicons name="time" size={30} color="black" />
                            <View style={styles.dateText}>
                                <Text style={{ marginLeft: '5%' }}>Time:</Text>
                                <Text style={styles.dateAndTimeText}>{release_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, hourCycle: 'h23' })}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
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


                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Eventure information:</Text>
                    <TextInput
                        style={[styles.inputField, { height: 140, textAlignVertical: 'top' }]}
                        onChangeText={(text) => setInformation(text)}
                        value={event_desc}
                        placeholder="Enter event info"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Eventure Price:</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(text) => {
                            if (/^\d+$/.test(text)) {
                                setPrice(text);
                            }
                        }}
                        value={event_price}
                        placeholder="Enter event price"
                        keyboardType="numeric"
                    />
                    
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Amount of tickets:</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(text) => {
                            if (/^\d+$/.test(text)) {
                                setTicketsLeft(text);
                            }
                        }}
                        value={tickets_left}
                        placeholder="Enter ticket amount"
                        keyboardType="numeric"
                    />
                    
                </View>

                <Pressable style={({ pressed }) => [GlobalStyles.button, pressed && { opacity: .8 }]} >
                    <Text style={GlobalStyles.buttonText} onPress={handleSubmit} >Create Eventure</Text>
                </Pressable>
                
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
        backgroundColor: "#B8E3FF",
      },
    createEventArea: {
        flex: 1,
    },
    inputContainer: {
        margin: '2%'
    },
    inputLabel: {
        fontSize: 13,
        marginBottom: 5,
    },
    inputField: {
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white'
    },

    inputPictureField: {
        width: '99%',
        height: 200,
        margin: '0.5%',
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center'
    },

    dateAndTime: {
        alignItems: 'center',
        flexDirection: 'row',
        height: '8%',
        marginBottom: 5
    },

    datePickerButton: {
        width: '46%',
        height: 55,
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: '2.5%',
        backgroundColor: 'white'
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    timePickerButton: {
        width: '46%',
        height: 55,
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: '3%',
        backgroundColor: 'white'
    },

    dateAndTimeText: {
        fontWeight: 'bold',
        marginLeft: '5%',
        fontSize: 15.5
    },
});

export default CreatePage;
