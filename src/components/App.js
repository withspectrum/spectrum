import React, { Component } from 'react';
import SideBar from './SideBar';
import PostList from './PostList';
import Chat from './Chat';
import Login from './Login';
import * as firebase from 'firebase';

import FIREBASE_CONFIG from '../config/FirebaseConfig';

const fbconfig = {
  apiKey: FIREBASE_CONFIG.API_KEY,
  authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
  databaseURL: FIREBASE_CONFIG.DB_URL,
  storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
  messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID
};

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      currentUser: null 
    }
  }
  setCurrentUser(user){
    this.setState({
      currentUser: user
    });
  }
  componentWillMount(){
    firebase.initializeApp(fbconfig);
  }
	render() {
		return (
	    <div className="flex col-12 fill-viewport">
        <Login setCurrentUser={this.setCurrentUser.bind(this)} currentUser={this.state.currentUser} />
	    	<SideBar />
	    	<PostList />
		    <Chat />
	    </div>
	  );
	}
}

export default App;
