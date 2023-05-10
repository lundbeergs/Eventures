import { Text, View, ScrollView, Image, StyleSheet, TouchableOpacity} from "react-native";
import { useNavigation , useRoute} from '@react-navigation/native';
import OrganizationEventComp from "../components/firstPageComp/OrganizationEventComp";
import eventures from '../assets/images/eventures.png'
import psychotech from '../assets/images/psychotech.jpg'
import stsKV from '../assets/images/stsKV.jpg'
import whiteCirkle from '../assets/images/whiteCirkle.png'

import destinationUnknown from '../assets/images/destinationUnknown.jpg'


const OrganizationPage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    
    <View style={{ backgroundColor: '#BDE3FF', flex: 1 }}>
      <ScrollView>
      <View style={styles.informationContainer}>
      <Image style={styles.orgProfilePic} source={route.params.orgProfilePic} />
      <Image style={styles.orgIconBackground} source={whiteCirkle} />
      <Image style={styles.orgIcon} source={route.params.orgIcon} />
      <Text style={{ marginTop: '55%', textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>{route.params.organization}
      </Text>
      <Text style={{ marginTop: '5%', marginLeft: '5%' }}>{route.params.organizationInformation}</Text>
      </View>

      <View style={styles.orgEventures}>
      <Text style={{textAlign: 'center', fontSize: 17}}> {route.params.organization}s eventures </Text>
      </View>

      <View>
        <ScrollView>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <OrganizationEventComp
              orgIcon={stsKV}
              eventTitle="Psychotech"
              eventPic={psychotech}
              organization="STS-klubbverk"
              location='V-dala'
              date='2023-05-12'
              price='450kr' />
            <OrganizationEventComp
              orgIcon={eventures}
              eventTitle="Destination unknown"
              eventPic={destinationUnknown}
              organization="STS-sektionen"
              location='Destination? Unknown'
              date='2023-10-27'
              price='1500kr' />
            <OrganizationEventComp
              orgIcon={eventures}
              eventTitle="It's OktoberfeSTS"
              organization="STS-klubbverk & I-klubbverk"
              location='Bridgens'
              date='2023-10-12'
              price='110kr' />
            <OrganizationEventComp
              orgIcon={eventures}
              eventTitle="It's OktoberfeSTS"
              eventPic={destinationUnknown}
              organization="STS-klubbverk & I-klubbverk"
              location='Bridgens'
              date='2023-10-12'
              price='110kr' />
          </View>
        </ScrollView>
      </View>
      </ScrollView>

    </View>

  );

};

const styles = StyleSheet.create({

  topOfPage: {
    height:30
  },

  backArrow: {
    height: 25,
    width: 25,
    marginLeft: 15,
    marginBottom: 15
  },

  informationContainer: {
    height: 350,
    marginRight: 15,
    marginLeft: 15,
    backgroundColor: 'white',
    borderRadius: 5
  },

  orgProfilePic: {
    height: 190,
    width: 340,
    marginTop: '3%',
    marginLeft: '3%',
    marginRight: '1.5%',
    zIndex: 1,
    position: 'absolute'
    },

    orgIconBackground: {
      height: 100,
      width: 100,
      zIndex: 2,
      position: 'absolute',
      top: '43%',
      left: '1.8%'
    },
  
    orgIcon: {
      height: 45,
      width: 45,
      borderRadius: 30,
      zIndex: 3,
      position: 'absolute',
      top: '51.2%',
      left: '10%'
    },

    orgEventures: {
      height: 50,
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      marginRight: 15,
      marginLeft: 15,
      margin: '3%',
      borderRadius: 5
    }
});

export default OrganizationPage