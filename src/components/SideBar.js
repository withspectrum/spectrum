import React, { Component } from 'react';
import Login from './Login';

class SideBar extends Component{
  setCurrentUser(user){
    this.props.setCurrentUser(user);
  }
	render() {
    console.log("render Sidebar");
		return (
	    	<div className="flex-auto flex flex-column col-1 min-x8 bg-primary">
	    		<div className="flex y10 justify-center items-center">
		    		<img src="/img/logo-mark.png" className="x3 y3" role="presentation"/>
	    		</div>
	    		<div className="flex y10 justify-center items-center">
            <Login setUser={this.setCurrentUser.bind(this)} currentUser={this.props.currentUser} />
          </div>
	    	</div>
	  );
	}
}

export default SideBar;
