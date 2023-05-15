import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from "react-native-gesture-handler";

const EventItem = ({
    eventId,
    orgIcon,
    orgProfilePic,
    eventTitle,
    eventPic,
    eventInformation,
    organization,
    organizationInformation,
    location,
    date,
    price}) => {
        const navigation = useNavigation();
        const onPressHandler = () => {
          navigation.navigate('OrganizationPage', {
            organization: organization,
            orgIcon: orgIcon,
            orgProfilePic: orgProfilePic,
            organizationInformation: organizationInformation
          });
        };
      
        const onPressHandler2 = () => {
        navigation.navigate('EventPage', {
          eventId: eventId,
          eventPic: eventPic,
          eventTitle: eventTitle,
          eventInformation: eventInformation,
          organization: organization,
          location: location,
          date: date,
          price: price
        });
      };

    return (
      <ScrollView>
        <View style={styles.eventContainer}>
        <TouchableOpacity onPress={onPressHandler}>
        <View style={styles.overhead}>
          <Image style={styles.orgIcon} source={orgIcon} />
          <View style={styles.titleAndLocation}>
            <Text style={{ fontWeight: 'bold' }}>{organization}</Text>
            <Text>{location}</Text>
          </View>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressHandler2}>
        <View style={styles.eventInfo}>
          <View>
            <Image style={styles.eventPic} source={eventPic} />
          </View>
          <View>
            <View style={styles.eventTextInfo}>
              <Text style={{ marginLeft: '3%' }}>{date}</Text>
              <Text style={{ marginRight: '12%', fontWeight: 'bold' }}>{eventTitle}</Text>
              <Text style={{ marginRight: '3%' }}>{price}</Text>
            </View>
          </View>
        </View>
        </TouchableOpacity>
      </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
    eventContainer: {
        height: 275,
        marginBottom: 30,
        marginRight: 15,
        marginLeft: 15
      },
    
      overhead: {
        flexDirection: 'row',
        alignItems: 'center'
      },
    
      titleAndLocation: {
        flex: 1,
        marginLeft: 10
      },
    
      eventInfo: {
        backgroundColor: 'white',
        marginTop: '1%',
        borderRadius: 5
      },
    
      orgIcon: {
        height: 30,
        width: 30,
        borderRadius: 30
      },
    
      eventPic: {
        height: 190,
        width: 340,
        margin: '3%',
        backgroundColor: 'white'
      },
    
      eventTextInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
      }
})

export default EventItem