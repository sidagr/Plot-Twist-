import React from "react";
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ChoiceButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
  
  const styles = StyleSheet.create({
    button: {
      backgroundColor: '#3498db',
      paddingVertical: 30,
      paddingHorizontal: 90,
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontFamily: 'Boldonose',
      textAlign: 'center',
    },
  });
  
  export default ChoiceButton;