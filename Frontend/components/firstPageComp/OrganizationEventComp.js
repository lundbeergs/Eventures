import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OrganizationEventComp = ({ orgIcon, eventTitle, eventPic, organization, location, date, price, pageToNavigate }) => {
  const navigation = useNavigation();

  return (

      <View style={styles.eventContainer}>
        <View style={styles.eventInfo}>
          <View>
            <Image style={styles.eventPic} source={eventPic} />
          </View>
          <View>
            <View style={styles.eventTextInfo}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{eventTitle}</Text>
              </View>
          </View>
        </View>
      </View>
      
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    height: 170,
    marginRight: 6,
    marginLeft: 9
  },

  eventInfo: {
    backgroundColor: 'white',
    marginTop: '1%',
    borderRadius: 5
  },

  eventPic: {
    height: 110,
    width: 160,
    marginTop: 9,
    marginLeft: 9,
    marginRight: 9,
    marginBottom: 3,
    backgroundColor: 'white'
  },

  eventTextInfo: {
    marginBottom: 3
  }
});

export default OrganizationEventComp;