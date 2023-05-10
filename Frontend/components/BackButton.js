import React from "react";
import backArrow from "../assets/images/backArrow.png";
import { TouchableOpacity, Image, StyleSheet } from 'react-native'

export default function BackButton({goBack}) {
    return (
        <TouchableOpacity
          style={styles.container}
          onPress={goBack}
        >
          <Image style={styles.image} source={backArrow} />
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 10,
      left: 10,
    },
    image: {
      width: 25,
      height: 25,
    },
  });
