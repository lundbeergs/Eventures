import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const TicketPage = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [qrCodes, setQrCodes] = useState([]);

  const addQrCode = () => {
    if (text && title) {
      setQrCodes([...qrCodes, { title, text }]);
      setTitle('');
      setText('');
    }
  };

  const renderQrCodes = () => {
    return qrCodes.map((qrCode, index) => (
      <View key={index} style={styles.qrCodesRow}>
        <View style={styles.qrCodeContainer}>
          <QRCode value={qrCode.text} size={150} />
          <Text style={styles.qrCodeText}>{qrCode.title}</Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter text"
          value={text}
          onChangeText={setText}
        />
        <Button title="Add QR Code" onPress={addQrCode} />
      </View>
      <ScrollView style={styles.scrollContainer}>{renderQrCodes()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingLeft: 10,
  },
  scrollContainer: {
    padding: 10,
  },
  qrCodesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  qrCodeContainer: {
    alignItems: 'center',
  },
  qrCodeText: {
    marginTop: 10,
  },
});

export default TicketPage;
