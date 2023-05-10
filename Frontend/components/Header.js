import { StyleSheet, Text } from "react-native";

export default function Header({ text }) {
  return (
      <Text style={styles.header} > {text} </Text>
  )
};

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: "bold",
      }
});
