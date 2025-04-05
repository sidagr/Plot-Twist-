import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native'; // React Native components
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // For web routing
// For React Native, use NativeRouter from react-router-native
// import { NativeRouter, Route, Routes } from 'react-router-native';

const HomeScreen = () => {
  const navigate = useNavigate(); // Get the navigate function from useNavigate hook

  return (
    <View style={styles.HomeContainer}>
      <Text style={styles.WelcomeText}>Hello, React Native Web!</Text>
      <View style={styles.ButtonContainer}>
        <Button title="Begin your journey" onPress={() => navigate('/start')} />
      </View>
    </View>
  );
};

const StartScreen = () => (
  <View style={styles.HomeContainer}>
    <Text style={styles.WelcomeText}>Hello, Start Screen!</Text>
  </View>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/start" element={<StartScreen />} />
      </Routes>
    </Router>
  );
};

const styles = StyleSheet.create({
  HomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#9c84c6',
  },
  WelcomeText: {
    fontSize: 50,
    fontFamily: 'Boldonose',
    color: 'white',
  },
  ButtonContainer: {
    marginTop: 20,
  },
});

export default App;
