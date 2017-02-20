import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Match } from 'react-router';
import { Provider, connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { initStore } from './store';
import * as firebase from 'firebase';
import FIREBASE_CONFIG from './config/FirebaseConfig';
import { startListeningToAuth } from './actions/user';
import { setFrequencies } from './actions/frequencies';
import { setStories } from './actions/stories';
import { Body } from './App/style';
import ModalRoot from './shared/modals/ModalRoot';
import GalleryRoot from './shared/gallery/GalleryRoot';
import { asyncComponent } from './helpers/utils';
import { loadState, saveState } from './helpers/localStorage';

const fbconfig = {
  apiKey: FIREBASE_CONFIG.API_KEY,
  authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
  databaseURL: FIREBASE_CONFIG.DB_URL,
  storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
  messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID,
};

firebase.initializeApp(fbconfig);
let store;
// In production load previously saved data from localStorage
if (process.env.NODE_ENV === 'production') {
  let localStorageState = loadState();
  store = initStore(localStorageState);

  // sync the store with localstorage
  store.subscribe(() => {
    saveState(store.getState());
  });
} else {
  store = initStore({});
}

// This is globally available in styled-components when interpolating a function like so:
// ${(props) => props.theme}
// Or using import { withTheme } from 'styled-components';
const theme = {
  brand: {
    default: '#3818E5',
    alt: '#7B16FF',
  },
  warn: {
    default: '#E3353C',
    alt: '#E2197A',
  },
  success: {
    default: '#00C383',
    alt: '#03AAFB',
  },
  bg: {
    default: '#FFFFFF',
    reverse: '#171A21',
    wash: '#f6f7f8',
  },
  text: {
    default: '#171A21',
    alt: '#747E8D',
    reverse: '#FFFFFF',
    placeholder: '#B2B9C6',
  },
  generic: {
    default: '#E6ECF7',
    alt: '#F6FBFF',
  },
  inactive: '#D6E0EE',
  border: {
    default: '#DFE7EF',
  },
};

// Let webpack know the App component should be put into its own bundle (code splitting)
const App = asyncComponent(() =>
  System.import('./App').then(module => module.default));
const Homepage = asyncComponent(() =>
  System.import('./Homepage').then(module => module.default));

// Rendered at the root of the page, renders the homepage or the App based on the login state
const Root = ({ notregistered, uid, loginError }) => {
  if (!notregistered && !uid && !loginError) return <p>Loading...</p>;
  if (notregistered) return <Homepage />;
  if (uid) return <App params={{}} />;
  return <p>Error</p>;
};

const ConnectedRoot = connect(state => ({
  notregistered: state.user.notregistered,
  uid: state.user.uid,
  loginError: state.user.loginError,
}))(Root);

render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Body>
          <ModalRoot />
          <GalleryRoot />
          <Match exactly pattern="/" component={ConnectedRoot} />
          <Match exactly pattern="/:frequency" component={App} />
          <Match exactly pattern="/:frequency/:story" component={App} />
        </Body>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root'),
);

setTimeout(() => {
  // when the app first loads, we'll listen for firebase changes
  store.dispatch(startListeningToAuth()).then(() => {
    // once auth has completed, if the user exists we'll set the frequencies and stories
    store.dispatch(setFrequencies());
    store.dispatch(setStories());
  });
});
