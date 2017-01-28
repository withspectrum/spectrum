import React, { Component } from 'react';
import NavBar from './components/NavBar';
import { Body } from './style';
import { Provider } from 'react-redux'
import { initStore } from '../store'
import PostList from './components/PostList';
import Chat from './components/Chat';
// import ListDetail from './components/ListDetail';
import * as firebase from 'firebase';
import FIREBASE_CONFIG from '../config/FirebaseConfig'
const fbconfig = {
  apiKey: FIREBASE_CONFIG.API_KEY,
  authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
  databaseURL: FIREBASE_CONFIG.DB_URL,
  storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
  messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID
};

export default class App extends Component {
	constructor() {
    super()
    this.state = {
      currentUser: null,
      currentTag: "",
      currentPost: {
        id: 1
      }
    }

    this.store = initStore(this.state)
  }

  selectTag = (tag) => {
    this.setState({ currentTag: tag });
  }

  setCurrentUser = (user) => {
    this.setState({
      currentUser: user
    });
  }

  componentWillMount(){
    firebase.initializeApp(fbconfig);
  }

  selectPost(){
  }

  render() {
    return(
      <Provider store={this.store}>
        <Body>
          <NavBar />
  				<PostList />
  				<Chat currentData={{currentPost: this.state.currentPost}} />
        </Body>
      </Provider>
    )
  }
}