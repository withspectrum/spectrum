import React, { Component } from 'react';
import SideBar from './SideBar';
import PostList from './PostList';
import Chat from './Chat';

class App extends Component{
	render() {
		return (
	    <div className="flex col-12 fill-viewport">
	    	<SideBar />
	    	<PostList />
		    <Chat />
	    </div>
	  );
	}
}

export default App;