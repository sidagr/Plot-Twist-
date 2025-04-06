import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App';
import { AppRegistry } from 'react-native';
import appConfig from './app.json'; 

// Remove service worker import if not needed
// import * as serviceWorker from './serviceWorker'; 
 // Import app.json as a whole

const appName = appConfig.name; // Access the name property

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('root'),
});

const root = createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain="dev-ae7dxq2eddt2bejj.us.auth0.com"
    clientId="JHopXoOrOpEwiSxxwHSQ3gymTBvVBOSf"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
);

// Uncomment if you want to enable service workers later
// serviceWorker.unregister();
