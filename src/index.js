import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { BrowserRouter, Match } from 'react-router';
import { Provider } from 'react-redux'
import { initStore } from './store'
import { loadState, saveState } from './helpers/localStorage'
import * as firebase from 'firebase';
import FIREBASE_CONFIG from './config/FirebaseConfig';
const fbconfig = {
  apiKey: FIREBASE_CONFIG.API_KEY,
  authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
  databaseURL: FIREBASE_CONFIG.DB_URL,
  storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
  messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID
};

const database = firebase.initializeApp(fbconfig)
const localStorageState = loadState()
const store = initStore(localStorageState)

store.subscribe(() => {
  saveState(store.getState())
})

const Root = () => {
	return(
		<Provider store={store}>
			<BrowserRouter>
				<div>
					<Match exactly pattern="/" component={App}/>
					<Match pattern="/:frequency" component={App}/>
					<Match pattern="/:frequency/:story" component={App}/>
				</div>
			</BrowserRouter>
		</Provider>
	)
}

render(<Root/>, document.querySelector('#root'));