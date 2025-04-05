import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; // Use React Native components from react-native-web

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, React Native Web!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

export default App;
