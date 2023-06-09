import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BDE3FF",
  },
  modalContainer: {
    flex: 1,
    marginTop: 6,
    backgroundColor: "#BDE3FF",   
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  inputText: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 4,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 45,
    marginTop: 20,
    backgroundColor: "#6B48D3",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  backArrow: {
    height: 25,
    width: 25,
    marginLeft: 15,
    marginBottom: 15,
  },
  eventuresImage: {
    height: 225,
    width: 225,
    alignSelf: "center",
    marginTop: "6%",
    borderRadius: 125,
  },
  inputComponent: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: '4%',
  },
  inputContainer: {
    width: "100%",
    marginTop: 10,
  },
});

export default GlobalStyles;
