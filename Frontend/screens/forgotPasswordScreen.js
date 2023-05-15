import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput
  } from "react-native";
  import { useNavigation } from "@react-navigation/native";
  import GlobalStyles from "../global-style";
  import PurpleButton from "../components/PurpleButton";
  import { StatusBar } from "expo-status-bar";
  
  export default function ForgotPasswordScreen() {
    const navigation = useNavigation();

    return (
      <SafeAreaView style={GlobalStyles.container}>
        <StatusBar barStyle="dark-content"/>

        <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.header}>Forgot your password?</Text>
              <Text style={styles.descriptionText}>
                Enter your email and we'll send you a link to get back into your
                account.
              </Text>
            </View>
            
            <TextInput
              placeholder="Email"
              placeholderTextColor={"grey"}
              style={styles.inputText}
            ></TextInput>

            <PurpleButton onPress={navigation.goBack} text={"Confirm"} />
          </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    contentContainer: {
      padding: '8%',
    },
    itemContainer: {
      width: "63.5%",
    },

    contentContainer: {
        marginTop: "20%",
        padding: '8%',
      },
      contentContainer2: {
        marginTop: "45%",
        padding: 40,
      },
      textContainer: {
        margin: "8%",
        marginBottom: "20%",
      },
      inputText: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 4,
      },
      header: {
        fontWeight: "bold",
        lineHeight: 25,
        fontSize: 20,
      },
      descriptionText: {
        lineHeight: 20,
        fontSize: 16,
      },
  });
  