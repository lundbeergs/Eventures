import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

const OrgItem = ({
  id,
  orgIcon,
  orgProfilePic,
  organization,
  organizationInformation
}) => {
  const navigation = useNavigation();

  const goToOrg = () => {
    navigation.navigate('OrganizationPage', {
      organization: organization,
      orgProfilePic: orgProfilePic,
      orgIcon: orgIcon,
      organizationInformation: organizationInformation
    });
  };

  return (
    <TouchableOpacity onPress={goToOrg}>
      <View style={styles.eventContainer}>
        <View style={styles.eventInfo}>
          <Image style={styles.orgProfilePic} source={orgProfilePic} />
          <View style={styles.organizationInformation}>
            <Text style={{ fontWeight: 'bold' }}>{organization}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    flex: 2,
    margin: 15,
    width: '92%',
    height: 230
  },

  eventInfo: {
    backgroundColor: 'white',
    borderRadius: 5,
    flex: 2,
    flexDirection: 'column'
  },

  orgProfilePic: {
    height: 190,
    width: '94%',
    marginTop: '3%',
    marginLeft: '3%',
    marginBottom: '1%'
  },

  organizationInformation: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
    paddingHorizontal: '3%'
  }
});

export default OrgItem;
