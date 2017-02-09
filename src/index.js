import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { BrowserRouter, Match } from 'react-router'
import { Provider } from 'react-redux'
import { initStore } from './store'
import helpers from './helpers'
import * as firebase from 'firebase'
import FIREBASE_CONFIG from './config/FirebaseConfig'
import actions from './actions'
import { RouteWrapper } from './style'

const fbconfig = {
  apiKey: FIREBASE_CONFIG.API_KEY,
  authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
  databaseURL: FIREBASE_CONFIG.DB_URL,
  storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
  messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID
};

firebase.initializeApp(fbconfig)
const localStorageState = helpers.loadState()
const store = initStore(localStorageState)

store.subscribe(() => {
  helpers.saveState(store.getState())
})

const Root = () => {
	return(
		<Provider store={store}>
			<BrowserRouter>
				<RouteWrapper>
					<Match exactly pattern="/" component={App}/>
					<Match pattern="/:frequency" component={App}/>
					<Match pattern="/:frequency/:story" component={App}/>
				</RouteWrapper>
			</BrowserRouter>
		</Provider>
	)
}

render(<Root/>, document.querySelector('#root'));

setTimeout(() => {
	// when the app first loads, we'll listen for firebase changes
	store.dispatch( actions.startListeningToAuth() )
	// and immediately query for the frequencies, as these will persist across the whole session
	store.dispatch( actions.setFrequencies() )
})
