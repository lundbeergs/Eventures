import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const PopUpModal = ({ isVisible, text, closeModal, buttonText }) => {

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={closeModal}
      statusBarTranslucent={true}
    >
      <View style={styles.outerModalContainer}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{text}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    marginTop: '10%',
    marginHorizontal: 40,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#6B48D3',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  outerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default PopUpModal;
