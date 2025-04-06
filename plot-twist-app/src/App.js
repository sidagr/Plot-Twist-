import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, Animated, FlatList, TextInput } from 'react-native'; // React Native components
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // For web routing
import CustomButton from './components/CustomButton'
import axios from 'axios';

//functions
const sendMessageToServer = async (message) => {
  try {
      const response = await axios.post('http://127.0.0.1:5000/chat', { message });
      return response.data;
  } catch (error) {
      console.error("Error sending message to Flask server: ", error);
      return null;
  }
};


const HomeScreen = () => {
  const navigate = useNavigate();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  
  return (
    <View style={styles.HomeContainer}>
      <Text style={styles.WelcomeText}>What will be your plot twist?</Text>
      <CustomButton title = "Begin your journey" onPress= {() => navigate('/start')}/>
    </View>
  );
};

// const StartScreen = () => {
//   const navigate  = useNavigate();
//   return (
//   <View style={styles.HomeContainer}>
//     <Text style={styles.WelcomeText}>Introduce yourself to me!</Text>
//   </View>
//   );
// };

const StartScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
      const userMessage = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);

      // Send the message to Flask and get the bot's response
      const serverResponse = await sendMessageToServer(input);
      if (serverResponse) {
          const botMessage = { text: serverResponse.reply, sender: 'bot' };
          setMessages([...messages, userMessage, botMessage]);
      }

      setInput('');
  };

  return (
      <View style={styles.StartContainer}>
          <FlatList
              data={messages}
              renderItem={({ item }) => (
                  <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
                      <Text>{item.text}</Text>
                  </View>
              )}
              keyExtractor={(item, index) => index.toString()}
          />
          <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
          />
          <Button title="Send" onPress={handleSend} />
      </View>
  );
};

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
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#9c84c6',
  },
  WelcomeText: {
    fontSize: 50,
    fontFamily: 'Boldonose',
    color: 'white',
    margin: 20,
  },
  ButtonContainer: {
    marginTop: 20,
    fontSize: 30,
    fontFamily: 'Boldonose',
    height: 50,
    width: 140,
    backgroundColor: 'blue',
  },
  StartContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 10,
  },
  messageBubble: {
      marginBottom: 10,
      padding: 10,
      borderRadius: 10,
  },
  userBubble: {
      alignSelf: 'flex-end',
      backgroundColor: '#f0f0f0',
  },
  botBubble: {
      alignSelf: 'flex-start',
      backgroundColor: '#e0e0e0',
  },
});

export default App;
