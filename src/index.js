import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Match } from 'react-router';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { initStore } from './store';
import * as firebase from 'firebase';
import FIREBASE_CONFIG from './config/FirebaseConfig';
import { Body } from './App/style';
import Root from './Root';
import { loadStorage, saveStorage, clearStorage } from './helpers/localStorage';
import { debounce } from './helpers/utils';

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
  let localStorageState = loadStorage();
  store = initStore(localStorageState);

  // sync the store with localstorage
  let state = store.getState();
  store.subscribe(
    debounce(
      saveStorage({
        user: state.user,
        frequencies: state.frequencies,
        stories: state.stories,
      }),
      1000,
    ),
  );
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
  space: {
    dark: '#0F015E',
    light: '#031957',
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

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Body>
            <Match
              exactly
              pattern="/(\~?):frequency?/:story?"
              component={Root}
            />
          </Body>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>,
    document.querySelector('#root'),
  );
};

try {
  render();
} catch (err) {
  clearStorage();
  render();
}
