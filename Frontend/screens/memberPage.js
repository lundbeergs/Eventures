import {
    Text,
    StyleSheet,
  } from "react-native";
  import GlobalStyles from "../global-style";
  import { SafeAreaView } from "react-native-safe-area-context";
  
  const MemberPage = () => {
  
    return (
      <SafeAreaView style={GlobalStyles.container}>
        <Text>
            Member page!
        </Text>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
  });
  
  export default MemberPage;
  