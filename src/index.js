import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { BrowserRouter, Match } from 'react-router'
import { Provider } from 'react-redux'
import { initStore } from './store'
import * as firebase from 'firebase'
import FIREBASE_CONFIG from './config/FirebaseConfig'
import actions from './actions'
import { Body } from './App/style'
import ModalRoot from './shared/modals/ModalRoot'
import GalleryRoot from './shared/gallery/GalleryRoot'

const fbconfig = {
  apiKey: FIREBASE_CONFIG.API_KEY,
  authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
  databaseURL: FIREBASE_CONFIG.DB_URL,
  storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
  messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID
};

firebase.initializeApp(fbconfig)
// const localStorageState = helpers.loadState()
const store = initStore({})

// store.subscribe(() => {
//   helpers.saveState(store.getState())
// })

const Root = () => {
	return(
		<Provider store={store}>
			<BrowserRouter>
				<Body>
					<ModalRoot />
					<GalleryRoot />
					<Match exactly pattern="/" component={App}/>
					<Match exactly pattern="/:frequency" component={App}/>
					<Match exactly pattern="/:frequency/:story" component={App}/>
				</Body>
			</BrowserRouter>
		</Provider>
	)
}

render(<Root/>, document.querySelector('#root'));

setTimeout(() => {
	// when the app first loads, we'll listen for firebase changes
	console.log('run: startListeningToAuth')
	store.dispatch( actions.startListeningToAuth() )
	.then(() => {
		console.log('run: setFrequencies')
		store.dispatch( actions.setFrequencies() )
		console.log('run: setStories')
		store.dispatch( actions.setStories() )
	})
	// and immediately query for the frequencies, as these will persist across the whole session
	// console.log('run: setFrequencies')
	// store.dispatch( actions.setFrequencies() )
	// // once the frequencies are set, get the relevant stories
	// console.log('run: setStories')
	// store.dispatch( actions.setStories() )
})
