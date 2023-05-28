import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const OrgItem = ({
  orgId,
  orgName,
  orgIcon,
  orgProfilePic,
  organizationInformation,
}) => {
  const navigation = useNavigation();

  const goToOrg = () => {
    navigation.navigate("OrganizationPage", {
      orgId,
      orgName,
      orgIcon: orgIcon,
      orgProfilePic: orgProfilePic,
      organizationInformation: organizationInformation,
    });
  };

  return (
    <TouchableOpacity onPress={goToOrg}>
      <View style={styles.eventContainer}>
          <View style={styles.organizationInformation}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>{orgName}</Text>
          </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: '4%',
    width: "92%",
    height: 40,
    backgroundColor: 'white',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center', 
  },

  organizationInformation: {
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default OrgItem;
