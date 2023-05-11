import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Platform, Image, ScrollView, Pressable } from "react-native";
import GlobalStyles from "../global-style";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import * as ImagePicker from 'expo-image-picker';
import jwtDecode from "jwt-decode";
import { API_BASE_URL } from "../axios.js";

const CreatePage = () => {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [releaseDate, setReleaseDate] = useState(new Date());
    const [showReleaseDatePicker, setShowReleaseDatePicker] = useState(false);
    const [releaseTime, setReleaseTime] = useState(new Date());
    const [showReleaseTimePicker, setShowReleaseTimePicker] = useState(false);
    const [imageUri, setImageUri] = useState('');
    const [information, setInformation] = useState("");
    const [price, setPrice] = useState("");

    const handleSubmit = async () => {
      };
           

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === "ios");
        setDate(currentDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(Platform.OS === "ios");
        setTime(currentTime);
    };
    const handleReleaseDateChange = (event, selectedReleaseDate) => {
        const currentReleaseDate = selectedReleaseDate || releaseDate;
        setShowReleaseDatePicker(Platform.OS === "ios");
        setReleaseDate(currentReleaseDate);
    };

    const handleReleaseTimeChange = (event, selectedReleaseTime) => {
        const currentReleaseTime = selectedReleaseTime || releaseTime;
        setShowReleaseTimePicker(Platform.OS === "ios");
        setReleaseTime(currentReleaseTime);
    };
    const handleImageSelect = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImageUri(result.uri);
        }
    };



    return (
        <SafeAreaView style={styles.container}>

            <ScrollView style={styles.createEventArea}>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Eventure Title:</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(text) => setTitle(text)}
                        value={title}
                        placeholder="Enter event title"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Location:</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(text) => setLocation(text)}
                        value={location}
                        placeholder="Enter event location"
                    />
                </View>
                
                <Text style={{fontSize: 13, marginTop: 8, marginLeft: '2%'}}>Eventure date:</Text>
                <View style={styles.dateAndTime}>
                    <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                        <View style={styles.buttonContent}>
                            <Ionicons name="calendar" size={30} color="black" />
                            <View style={styles.dateText}>
                                <Text style={{ marginLeft: '5%' }}>Date:</Text>
                                <Text style={styles.dateAndTimeText}>{format(date, "do 'of' MMMM yyyy")}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
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
                                <Text style={styles.dateAndTimeText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, hourCycle: 'h23' })}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {showTimePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={time}
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
                                <Text style={styles.dateAndTimeText}>{format(releaseDate, "do 'of' MMMM yyyy")}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {showReleaseDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={releaseDate}
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
                                <Text style={styles.dateAndTimeText}>{releaseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, hourCycle: 'h23' })}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {showReleaseTimePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={releaseTime}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={handleReleaseTimeChange}
                        />
                    )}
                </View>

                <TouchableOpacity style={styles.inputContainer} onPress={handleImageSelect}>
                    <Text style={styles.inputLabel}>Eventure Picture:</Text>
                    {imageUri !== '' ? (
                        <Image source={{ uri: imageUri }} style={{ width: '99%', height: 200, margin: '0.5%', borderRadius: 5 }} />
                    ) : (
                        <View style={styles.inputPictureField}>
                            <Text style={{ color: 'grey', textAlign: 'center', alignSelf: 'center' }}>Select an image...</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Eventure information:</Text>
                    <TextInput
                        style={[styles.inputField, { height: 140, textAlignVertical: 'top' }]}
                        onChangeText={(text) => setInformation(text)}
                        value={information}
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
                        value={price}
                        placeholder="Enter event price"
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
