import { StyleSheet, View, Text, Pressable, TouchableWithoutFeedback } from "react-native";

function SignInItem(props) {
  return (
    <View style={styles.signInBox}>
      <Pressable
        android_ripple={{ color: 'black' }}
        onPress={props.onDeleteItem.bind(this, props.id)}
        style={({pressed}) => pressed && styles.pressedItem}
      >
        <Text style={styles.signInText}>{props.text}</Text>
      </Pressable>
    </View>
  );
}

export default SignInItem;

const styles = StyleSheet.create({
  signInBox: {
    flex: 1,
    backgroundColor: "#5e0acc",
    margin: 5,
    alignItems: "center",
  },
  signInText: {
    padding: 8,
    color: "white",
  },
  pressedItem: {
    opacity: 0.5,
  }
});