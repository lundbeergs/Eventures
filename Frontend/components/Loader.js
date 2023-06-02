import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// # Loader and the LoaderItem is created by: 
// '''
// ***************************************************************************************/
// *    Title: Welcome
// *    Author: Musa Adanur
// *    Date: 2023
// *    Availability: https://assets6.lottiefiles.com/packages/lf20_llbjwp92qL.json
// *
// ***************************************************************************************/
// [Source code]. https://assets6.lottiefiles.com/packages/lf20_llbjwp92qL.json
// '''

const Loader = () => {
  return (
    <View style={styles.container}>
      <LottieView
        style={styles.loader}
        source={require('./LoaderItem.json')}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 80,
    height: 80,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default Loader;
