import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { BrowserRouter, Match } from 'react-router'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { initStore } from './store'
import * as firebase from 'firebase'
import FIREBASE_CONFIG from './config/FirebaseConfig'
import actions from './actions'
import { Body } from './App/style'
import ModalRoot from './shared/modals/ModalRoot'
import GalleryRoot from './shared/gallery/GalleryRoot'
import helpers from './helpers'

const fbconfig = {
  apiKey: FIREBASE_CONFIG.API_KEY,
  authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
  databaseURL: FIREBASE_CONFIG.DB_URL,
  storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
  messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID
};

firebase.initializeApp(fbconfig)
let store
// In production load previously saved data from localStorage
if (process.env.NODE_ENV === 'production') {
  let localStorageState = helpers.loadState()
  store = initStore(localStorageState)
} else {
  store = initStore({})
}

// store.subscribe(() => {
//   helpers.saveState(store.getState())
// })

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
}

const Root = () => {
	return(
		<Provider store={store}>
			<BrowserRouter>
        <ThemeProvider theme={theme}>
  				<Body>
  					<ModalRoot />
  					<GalleryRoot />
  					<Match exactly pattern="/" component={App}/>
  					<Match exactly pattern="/:frequency" component={App}/>
  					<Match exactly pattern="/:frequency/:story" component={App}/>
  				</Body>
        </ThemeProvider>
			</BrowserRouter>
		</Provider>
	)
}

render(<Root/>, document.querySelector('#root'));

setTimeout(() => {
	// when the app first loads, we'll listen for firebase changes
	store.dispatch( actions.startListeningToAuth() )
	.then(() => {
		// once auth has completed, if the user exists we'll set the frequencies and stories
		store.dispatch( actions.setFrequencies() )
		store.dispatch( actions.setStories() )
	})
})
