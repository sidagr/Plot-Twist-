import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Remove service worker import if not needed
// import * as serviceWorker from './serviceWorker'; 

import { AppRegistry } from 'react-native';
import appConfig from './app.json';  // Import app.json as a whole

const appName = appConfig.name; // Access the name property

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('root'),
});

// Uncomment if you want to enable service workers later
// serviceWorker.unregister();
