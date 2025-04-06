import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, Animated, FlatList, TextInput } from 'react-native'; // React Native components
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // For web routing
import CustomButton from './components/CustomButton'
import ChoiceButton from './components/ChoiceButton'
import axios from 'axios';
import HTMLFlipBook from 'react-pageflip';
import './styles.css';
import testImage from './assets/images/sid.jpg';

//
//constants:
//
const userChoice = false;

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="page-container" ref={ref}>
      <div className="image-container">
        <img src={props.imageSrc} alt="Page Visual" width='160' height='240'/>
      </div>
      <div className="text-container">
        <h1>{props.header}</h1>
        <p>{props.children}</p>
        <p>Page number: {props.number}</p>
      </div>
    </div>
  );
});


//
// functions:
//

//
// switchUserChoice: change which choice the user wants to view.
//
function switchUserChoice(props) {
  userChoice = true;
}

//
// sendMessageToServer: function to send messages to the flask server.
//
const sendMessageToServer = async (message) => {
  try {
      const response = await axios.post('http://127.0.0.1:5000/chat', { message });
      return response.data;
  } catch (error) {
      console.error("Error sending message to Flask server: ", error);
      return null;
  }
};

//
// MyBook: function to assemble the decisions book for an individual session.
//

function MyBook(props) {
  return (
    <HTMLFlipBook width={240} height={320}>
      <Page imageSrc={testImage} header="Page header" number={1}>Page content</Page>
      <Page number="2">Page text</Page>
      <Page number="3">Page text</Page>
      <Page number="4">Page text</Page>
    </HTMLFlipBook>
  );
}

//
// Screens:
//
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
  const navigate = useNavigate();

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
          <CustomButton title="Let's start your adventures!" onPress={() => navigate('/question')} />
      </View>
  );
};

const QuestionScreen = () => {
  const navigate = useNavigate();
  return (
    <View style={styles.HomeContainer}>
      <Text style={styles.WelcomeText}>What's on your mind?</Text>
      <CustomButton title="View my journeys" onPress={() => navigate('/decision')} />
    </View>
  );
};

const DecisionScreen = () => {
  const navigate = useNavigate();
  const [userChoice, setUserChoice] = useState(null); // Initially, no choice is selected

  const handleChoice = (choice) => {
    setUserChoice(choice); // Set the choice when a button is clicked
  };

  return (
    <View style={styles.HomeContainer}>
      <Text style={styles.WelcomeText}>What's your adventure?</Text>
      <div style={{ display: 'flex', gap: '20px'}}>
        <CustomButton title="CHOICE 1" onPress={() => handleChoice(1)} />
        <CustomButton title="CHOICE 2" onPress={() => handleChoice(2)} />
      </div>
      <div style={{ marginTop: '20px' }}>
        {userChoice === 1 && MyBook()}
        {userChoice === 2 && MyBook()}
        {userChoice === null && <p>Please select a choice!</p>}
      </div>
    </View>
  );
};

const App = () => {
  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}> {/* Make the entire page scrollable */}
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/start" element={<StartScreen />} />
          <Route path="/question" element={<QuestionScreen />}/>
          <Route path="/decision" element={<DecisionScreen />}/>
        </Routes>
      </Router>
    </div>
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
