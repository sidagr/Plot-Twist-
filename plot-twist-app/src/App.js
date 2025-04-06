import React, { useEffect, useRef, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react"
import { View, Text, StyleSheet, Button, Animated, FlatList, TextInput } from 'react-native'; // React Native components
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // For web routing
import CustomButton from './components/CustomButton'
import AuthButton from './components/AuthButton'
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
  
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  //const { logout } = useAuth0();

  useEffect(() => {
    // You can do something here when isAuthenticated changes, 
    // like logging, triggering side effects, etc.
  }, [isAuthenticated]); // Only trigger on change in `isAuthenticated`

  return (
    <View style={styles.HomeContainer}>
      <Text style={styles.WelcomeText}>What will be your plot twist?</Text>
      <CustomButton title = "Begin your journey" onPress= {() => navigate('/start')}/>
      <View style={styles.buttonSpacer} />
      {isAuthenticated ? (
        <AuthButton 
          title="Logout" 
          onPress={() => logout({ logoutParams: { returnTo: window.location.origin } })} 
        />
      ) : (
        <AuthButton 
          title="Login" 
          onPress={() => loginWithRedirect()} 
        />
      )}
      <View style={styles.buttonSpacer} />
    </View>
  );
};

const StartScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [parametersFilled, setParametersFilled] = useState(''); // State to store filled parameters
  const navigate = useNavigate();

  const handleSend = async () => {
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    // Send the message to Flask and get the bot's response
    const serverResponse = await sendMessageToServer(input);
    if (serverResponse) {
      const botMessage = { text: serverResponse.reply, sender: 'bot' };
      const parametersFilledResponse = serverResponse.filled; // Assuming this is a string or object

      // Set the parametersFilled state
      setParametersFilled(parametersFilledResponse);

      // Set both user and bot messages in the state
      setMessages([...messages, userMessage, botMessage]);
    }

    setInput('');
  };

  return (
    <View style={styles.HomeContainer}>
      <Text style={styles.WelcomeText}>Let's get to know you!</Text>
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
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
        <View style={styles.buttonSpacer} />
        <CustomButton title="Send" onPress={handleSend} style={styles.button} />
        <View style={styles.buttonSpacer} />

        {/* Conditionally render the "Let's start your adventures!" button */}
        {parametersFilled && (
          <CustomButton
            title="Let's start your adventures!"
            onPress={() => navigate('/decision')}
            style={styles.button}
          />
        )}
      </View>
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
    justifyContent: 'center', // Centers the chat UI vertically
    alignItems: 'center', // Centers the chat UI horizontally
    backgroundColor: '#f4f4f4', // Background color for the page
    padding: 20,
  },
  SendButton: {
    width: 80,
    height: 50,
  },
  chatContainer: {
    width: '90%', // Makes the container width 90% of the screen width
    maxWidth: 600, // Ensures the container does not stretch too wide
    padding: 20,
    borderRadius: 20, // Rounded corners for the container
    backgroundColor: 'white', // White background for the chat box
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Slight shadow for effect
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 20,
    maxWidth: '80%', // Prevents bubbles from being too wide
  },
  userBubble: {
    backgroundColor: '#e4bad7', // Blue color for the user's messages
    alignSelf: 'flex-end', // Aligns the user's messages to the right
  },
  botBubble: {
    backgroundColor: '#872cd3', // Light gray color for bot's messages
    alignSelf: 'flex-start', // Aligns the bot's messages to the left
  },
  messageText: {
    fontSize: 18, // Increased font size for the messages
    color: 'white', // White text for user bubbles
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 10,
    fontSize: 16, // Increased font size for the input text
  },
  buttonSpacer: {
    marginVertical: 10,
  },
});

export default App;
